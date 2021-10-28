import React, { FC, useRef, useState } from 'react';
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

const filter = {
  normal: [normal()],
  sepia: [sepia(1)],
  wb: [grayscale(1)],
  polaroid: [polaroid()],
  invert: [invert()],
  tint: [tint(1)],
};

const value = new Animated.Value(0);

const FIlterSlider: FC<FIlterSliderProps> = ({ imageUri }) => {
  const [mode, setMode] = useState(MODE.INITIAL);
  const [color, setColor] = useState('red');
  const [currentFilter, setCurrentFilter] = useState(filter.normal);
  const canvas = useRef({} as CanvasRef);

  const Ready = () => (
    <CustomButton iconName="check" onPress={() => setMode(MODE.INITIAL)} />
  );

  const Tools = () => {
    switch (mode) {
      case MODE.DRAW:
        return (
          <View style={styles.tools}>
            <CustomButton
              iconName="undo"
              onPress={() => {
                canvas.current?.undo();
              }}
            />
            <Ready />
          </View>
        );

      case MODE.TEXT:
        return (
          <View style={styles.tools}>
            <Ready />
          </View>
        );
      case MODE.FILTER:
        return (
          <View style={styles.tools}>
            <Ready />
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
              onPress={() => setMode(MODE.TEXT)}
            />
            <CustomButton
              iconName="settings"
              onPress={() => setMode(MODE.FILTER)}
            />
            <CustomButton iconName="download" onPress={() => {}} />
          </View>
        );
    }
  };

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
        <TouchableOpacity onPress={() => setCurrentFilter(filterSet)}>
          <ColorMatrix matrix={concatColorMatrices(filterSet)}>
            <Image style={styles.filterPreviewImage} source={imageUri} />
          </ColorMatrix>
        </TouchableOpacity>
        <Text style={styles.filterText}>{item}</Text>
      </View>
    );
  };

  c

  return (
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
      {mode === MODE.FILTER && (
        <Animated.View style={styles.filters}>
          <FlatList data={filters} renderItem={renderFilters} horizontal />
        </Animated.View>
      )}
    </View>
  );
};

export default FIlterSlider;
