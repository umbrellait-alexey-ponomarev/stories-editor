/* eslint-disable react-native/no-inline-styles */
import React, { FC, useCallback, useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  Text,
  Animated,
  PanResponderGestureState,
  GestureResponderEvent,
} from 'react-native';
import {
  ColorMatrix,
  concatColorMatrices,
} from 'react-native-color-matrix-image-filters';
import { SketchCanvas } from '@terrylinla/react-native-sketch-canvas';
import {
  GestureHandlerRootView,
  PinchGestureHandler,
  RotationGestureHandler,
} from 'react-native-gesture-handler';

import CustomButton from '../../elements/CustomButton/CustomButton';
import DragText from '../../elements/DragText/DragText';
import { colors, red, white } from '../../../constants/UIColors';
import { filter, filters } from '../../../constants/Filters';
import { FIlterSliderProps, CanvasRef, DragItem } from './types';
import { styles } from './style';
import { BinIcon } from '../../../assets/SVG';
import { BIN_SIZE, BIN_COORDINATES } from '../../../constants/sizes';
import Slider from '@react-native-community/slider';
import { REMOVE_TEXT_TIME } from '../../../constants/timing';

const MODE = {
  INITIAL: '',
  FILTER: 'FILTER',
  DRAW: 'DRAW',
  TEXT: 'TEXT',
};

const animatedValue = new Animated.Value(0);
const scaleValue = new Animated.Value(1);
const rotationValue = new Animated.Value(0);

const FIlterSlider: FC<FIlterSliderProps> = ({ imageUri }) => {
  const [mode, setMode] = useState(MODE.INITIAL);
  const [color, setColor] = useState(red);
  const [brushSize, setBrushSize] = useState(5);
  const [currentFilter, setCurrentFilter] = useState(filter.normal);
  const [dragText, setDragText] = useState<DragItem[]>([]);
  const [showBin, setShowBin] = useState(false);
  const canvas = useRef({} as CanvasRef);
  const imagePinch = useRef();
  const imageRotate = useRef();

  const rotate = rotationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const onPinchEvent = (evt: any) => {
    scaleValue.setValue(evt.nativeEvent.scale);
  };

  const onRotationEvent = (evt: any) => {
    rotationValue.setValue(evt.nativeEvent.rotation);
    console.log(evt.nativeEvent.rotation * 100);
  };

  const removeTextItem = useCallback((id: number) => {
    setDragText(prev => {
      const currentItemIndex = prev.findIndex(item => item.id === id);
      const newDragText = [...prev];
      newDragText.splice(currentItemIndex, 1);

      return newDragText;
    });
  }, []);

  const onTextMove = useCallback((event: PanResponderGestureState) => {
    const { moveX, moveY } = event;

    if (
      moveX >= BIN_COORDINATES.left &&
      moveX <= BIN_COORDINATES.right &&
      moveY >= BIN_COORDINATES.top &&
      moveY >= BIN_COORDINATES.bottom
    ) {
      setShowBin(true);
    } else {
      setShowBin(false);
    }
  }, []);

  const onMoveRealise = useCallback(
    (
      evt: GestureResponderEvent,
      gestureState: PanResponderGestureState,
      id: number,
    ) => {
      const { moveX, moveY } = gestureState;

      if (
        moveX >= BIN_COORDINATES.left &&
        moveX <= BIN_COORDINATES.right &&
        moveY >= BIN_COORDINATES.top &&
        moveY >= BIN_COORDINATES.bottom
      ) {
        setTimeout(() => removeTextItem(id), REMOVE_TEXT_TIME);
        setShowBin(false);
      }
    },
    [removeTextItem],
  );

  const undo = useCallback(() => {
    canvas.current?.undo();
  }, [canvas]);

  const Ready = useCallback(
    (props: any) => <CustomButton iconName="check" {...props} />,
    [],
  );

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
                    onMove={onTextMove}
                    onMoveRealise={(evt, gestureState) =>
                      onMoveRealise(evt, gestureState, id)
                    }
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
  }, [mode, onMoveRealise, onTextMove, undo]);

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
            <Animated.Image
              style={styles.filterPreviewImage}
              source={imageUri}
            />
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RotationGestureHandler
        ref={imageRotate}
        simultaneousHandlers={imagePinch}
        onGestureEvent={onRotationEvent}>
        <PinchGestureHandler
          ref={imagePinch}
          simultaneousHandlers={imageRotate}
          onGestureEvent={onPinchEvent}>
          <View style={styles.container}>
            <ColorMatrix matrix={concatColorMatrices(currentFilter)}>
              <Animated.Image
                style={[
                  styles.image,
                  { transform: [{ scale: scaleValue }, { rotate }] },
                ]}
                source={imageUri}
              />
            </ColorMatrix>
            <View
              style={styles.canvasWrapper}
              pointerEvents={mode === MODE.DRAW ? 'box-none' : 'none'}>
              <SketchCanvas
                ref={canvas as any}
                style={styles.canvas}
                strokeColor={color}
                strokeWidth={brushSize}
                touchEnabled={mode === MODE.DRAW}
              />
            </View>
            <Tools />
            {mode === MODE.DRAW && (
              <>
                <View style={styles.sliderWrapper}>
                  <Slider
                    vertical={true}
                    style={styles.slider}
                    minimumValue={3}
                    maximumValue={34}
                    minimumTrackTintColor={white}
                    maximumTrackTintColor={white}
                    onValueChange={setBrushSize}
                    value={brushSize}
                    thumbTintColor={white}
                  />
                </View>
                <View style={styles.colors}>
                  <FlatList
                    data={colors}
                    renderItem={renderColors}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                  />
                </View>
              </>
            )}
            <Animated.View style={[styles.filters, { bottom }]}>
              <FlatList
                data={filters}
                renderItem={renderFilters}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            </Animated.View>
            {dragText.map(item => item.Component)}
            {showBin && (
              <View style={styles.bin}>
                <BinIcon color={red} width={BIN_SIZE} height={BIN_SIZE} />
              </View>
            )}
          </View>
        </PinchGestureHandler>
      </RotationGestureHandler>
    </GestureHandlerRootView>
  );
};

export default FIlterSlider;
