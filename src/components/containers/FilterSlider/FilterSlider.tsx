/* eslint-disable react-native/no-inline-styles */
import React, { FC, useCallback, useRef, useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Text,
  Animated,
} from 'react-native';
import {
  ColorMatrix,
  concatColorMatrices,
} from 'react-native-color-matrix-image-filters';
import { SketchCanvas } from '@terrylinla/react-native-sketch-canvas';

import CustomButton from '../../elements/CustomButton/CustomButton';
import DragText from '../../elements/DragText/DragText';
import { colors, red } from '../../../constants/UIColors';
import { filter, filters } from '../../../constants/Filters';
import { FIlterSliderProps, CanvasRef, DragItem } from './types';
import { styles } from './style';

const MODE = {
  INITIAL: '',
  FILTER: 'FILTER',
  DRAW: 'DRAW',
  TEXT: 'TEXT',
};

const animatedValue = new Animated.Value(0);

const FIlterSlider: FC<FIlterSliderProps> = ({ imageUri }) => {
  const [mode, setMode] = useState(MODE.INITIAL);
  const [color, setColor] = useState(red);
  const [currentFilter, setCurrentFilter] = useState(filter.normal);
  const [dragText, setDragText] = useState<DragItem[]>([]);
  const canvas = useRef({} as CanvasRef);

  const undo = useCallback(() => {
    canvas.current?.undo();
  }, [canvas]);

  const Ready = (props: any) => <CustomButton iconName="check" {...props} />;

  const Tools = useCallback(() => {
    switch (mode) {
      case MODE.DRAW:
        return (
          <View style={styles.tools}>
            <CustomButton iconName="undo" onPress={undo} />
            <Ready
              onPress={() => {
                setMode(MODE.INITIAL);
              }}
            />
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
  }, [mode, undo]);

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
    outputRange: [-160, 10],
  });

  return (
    <>
      <View style={styles.container}>
        <ColorMatrix matrix={concatColorMatrices(currentFilter)}>
          <Image style={styles.image} source={imageUri} />
        </ColorMatrix>
        <SketchCanvas
          ref={canvas as any}
          style={styles.canvas}
          strokeColor={color}
          strokeWidth={5}
          touchEnabled={mode === MODE.DRAW}
        />
        <Tools />
        {mode === MODE.DRAW && (
          <View style={styles.colors}>
            <FlatList data={colors} renderItem={renderColors} horizontal />
          </View>
        )}
        <Animated.View style={[styles.filters, { bottom }]}>
          <FlatList data={filters} renderItem={renderFilters} horizontal />
        </Animated.View>
        {dragText.map(item => item.Component)}
      </View>
    </>
  );
};

export default FIlterSlider;
