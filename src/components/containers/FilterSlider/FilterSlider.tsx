/* eslint-disable react-native/no-inline-styles */
import React, { FC, useCallback, useRef, useState } from 'react';
import {
  View,
  ImageRequireSource,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Text,
  Animated,
} from 'react-native';
import {
  Matrix,
  ColorMatrix,
  concatColorMatrices,
  sepia,
  grayscale,
  invert,
  polaroid,
  tint,
  normal,
} from 'react-native-color-matrix-image-filters';
import { SketchCanvas } from '@terrylinla/react-native-sketch-canvas';

import CustomButton from '../../elements/CustomButton/CustomButton';
import { styles } from './style';
import DragText from '../../elements/DragText/DragText';

interface FIlterSliderProps {
  imageUri: ImageRequireSource;
}

interface CanvasRef {
  undo: () => void;
}

const { width, height } = Dimensions.get('window');

const MODE = {
  INITIAL: '',
  FILTER: 'FILTER',
  DRAW: 'DRAW',
  TEXT: 'TEXT',
};

const colors: string[] = [
  'black',
  'red',
  'yellow',
  'orange',
  'blue',
  'white',
  'green',
  'purple',
  'pink',
  '#ff68d7',
  '#8dc9ff',
];

const filters: string[] = [
  'normal',
  'sepia',
  'wb',
  'polaroid',
  'invert',
  'tint',
];

const filter: { [key: string]: Matrix[] } = {
  normal: [normal()],
  sepia: [sepia(1)],
  wb: [grayscale(1)],
  polaroid: [polaroid()],
  invert: [invert()],
  tint: [tint(1)],
};

const animatedValue = new Animated.Value(0);

const FIlterSlider: FC<FIlterSliderProps> = ({ imageUri }) => {
  const [mode, setMode] = useState(MODE.TEXT);
  const [color, setColor] = useState('red');
  const [currentFilter, setCurrentFilter] = useState(filter.normal);
  const [dragText, setDragText] = useState<JSX.Element[]>([]);
  const canvas = useRef({} as CanvasRef);

  const Ready = (props: any) => <CustomButton iconName="check" {...props} />;

  const Tools = useCallback(() => {
    switch (mode) {
      case MODE.DRAW:
        return (
          <View style={styles.tools}>
            <CustomButton iconName="undo" onPress={canvas.current?.undo} />
            <Ready onPress={() => setMode(MODE.INITIAL)} />
          </View>
        );

      case MODE.TEXT:
        return (
          <View style={styles.tools}>
            <Ready onPress={() => setMode(MODE.INITIAL)} />
          </View>
        );
      case MODE.FILTER:
        return (
          <View style={styles.tools}>
            <Ready
              onPress={() => {
                setMode(MODE.INITIAL);
                hideFilters();
              }}
            />
          </View>
        );

      default:
        return (
          <View style={styles.tools}>
            <CustomButton
              iconName="drawing"
              onPress={() => setMode(MODE.DRAW)}
            />
            <CustomButton
              iconName="letter"
              onPress={() => {
                setDragText(prev => [
                  ...prev,
                  <DragText
                    onModeChange={writeMode => {
                      console.log(writeMode);
                      if (writeMode) {
                        setMode(MODE.TEXT);
                      }
                    }}
                    key={prev.length}
                    write={mode !== MODE.INITIAL}
                  />,
                ]);
                setMode(MODE.TEXT);
              }}
            />
            <CustomButton
              iconName="settings"
              onPress={() => {
                setMode(MODE.FILTER);
                showFilters();
              }}
            />
            <CustomButton iconName="download" onPress={() => {}} />
          </View>
        );
    }
  }, [mode]);

  const renderColors = ({ item }: { item: string }) => {
    return (
      <TouchableOpacity onPress={() => setColor(item)}>
        <View
          style={[
            styles.color,
            {
              backgroundColor: item,
            },
          ]}
        />
      </TouchableOpacity>
    );
  };

  const renderFilters = ({ item }: { item: string }) => {
    const filterSet = filter[item];
    return (
      <View style={styles.filterPreview}>
        <TouchableOpacity
          style={[
            styles.filterPreviewChecked,
            {
              backgroundColor:
                filterSet === currentFilter ? '#dddddd' : 'transparent',
            },
          ]}
          onPress={() => setCurrentFilter(filterSet)}>
          <ColorMatrix matrix={concatColorMatrices(filterSet)}>
            <Image style={styles.filterPreviewImage} source={imageUri} />
          </ColorMatrix>
        </TouchableOpacity>
        <Text style={styles.filterText}>{item}</Text>
      </View>
    );
  };

  const showFilters = () => {
    Animated.spring(animatedValue, {
      toValue: 1,
      useNativeDriver: false,
    }).start();
  };

  const hideFilters = () => {
    Animated.spring(animatedValue, {
      toValue: 0,
      useNativeDriver: false,
    }).start();
  };

  const bottom = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-160, 0],
  });

  return (
    <>
      <View style={styles.container}>
        <Tools />
        <ColorMatrix matrix={concatColorMatrices(currentFilter)}>
          <Image style={{ width, height }} source={imageUri} />
        </ColorMatrix>
        <SketchCanvas
          ref={canvas as any}
          style={styles.canvas}
          strokeColor={color}
          strokeWidth={5}
          touchEnabled={mode === MODE.DRAW}
        />
        {mode === MODE.DRAW && (
          <View style={styles.colors}>
            <FlatList data={colors} renderItem={renderColors} horizontal />
          </View>
        )}
        <Animated.View style={[styles.filters, { bottom }]}>
          <FlatList data={filters} renderItem={renderFilters} horizontal />
        </Animated.View>
      </View>
      {dragText}
      {/* <DragText
        onModeChange={writeMode => {
          console.log(writeMode);
          if (writeMode) {
            setMode(MODE.TEXT);
          }
        }}
        write={mode !== MODE.INITIAL}
      /> */}
    </>
  );
};

export default FIlterSlider;
