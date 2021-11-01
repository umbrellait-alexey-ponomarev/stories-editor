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
import { colors } from '../../../constants/UIColors';

interface FIlterSliderProps {
  imageUri: ImageRequireSource;
}

interface CanvasRef {
  undo: () => void;
}

interface DragItem {
  id: number;
  Component: JSX.Element;
}

const { width, height } = Dimensions.get('window');

const MODE = {
  INITIAL: '',
  FILTER: 'FILTER',
  DRAW: 'DRAW',
  TEXT: 'TEXT',
};

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
  const [mode, setMode] = useState(MODE.INITIAL);
  const [color, setColor] = useState('red');
  const [currentFilter, setCurrentFilter] = useState(filter.normal);
  const [dragText, setDragText] = useState<DragItem[]>([]);
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

      // case MODE.TEXT:
      //   return (
      //     <View style={styles.tools}>
      //       <Ready
      //         onPress={() => {
      //           setMode(MODE.INITIAL);
      //         }}
      //       />
      //     </View>
      //   );
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

      case MODE.INITIAL:
        return (
          <View style={styles.tools}>
            <CustomButton
              iconName="drawing"
              onPress={() => setMode(MODE.DRAW)}
            />
            <CustomButton
              iconName="letter"
              onPress={() => {
                setMode(MODE.TEXT);

                const id = Math.random();
                const Component = (
                  <DragText
                    key={id}
                    onModeChange={(writeMode: boolean) => {
                      if (writeMode) {
                        setMode(MODE.TEXT);
                      } else {
                        setMode(MODE.INITIAL);
                      }
                    }}
                  />
                );

                setDragText(prev => [...prev, { id, Component }]);
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
      default:
        return null;
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
      {dragText.map(item => item.Component)}
    </>
  );
};

export default FIlterSlider;
