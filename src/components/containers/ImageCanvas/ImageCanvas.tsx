/* eslint-disable react-native/no-inline-styles */
import { SketchCanvas } from '@terrylinla/react-native-sketch-canvas';
import React, { FC, useRef, useState, useCallback } from 'react';
import {
  ImageURISource,
  View,
  FlatList,
  TouchableOpacity,
  PanResponder,
  Animated,
  Dimensions,
} from 'react-native';
import {
  Matrix,
  ColorMatrix,
  concatColorMatrices,
  sepia,
  tint,
  grayscale,
  invert,
  polaroid,
  normal,
} from 'react-native-color-matrix-image-filters';
// import RNSaveView from 'react-native-save-view';

import CustomButton from '../../elements/CustomButton/CustomButton';
import DragText from '../../elements/DragText/DragText';
import { styles } from './style';

interface ImageCanvasProps {
  imageUri: ImageURISource;
}

const displayWidth = Dimensions.get('screen').width;

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

const MODE = {
  DRAW: 'DRAW',
  TEXT: 'TEXT',
  INITIAL: '',
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

const panFilter: any = new Animated.Value(0);
const panFilterLeft: any = new Animated.Value(0);

const ImageCanvas: FC<ImageCanvasProps> = ({ imageUri }) => {
  const [color, setColor] = useState('red');
  const [mode, setMode] = useState(MODE.INITIAL);
  const [currentFilterIndex, setCurrentFilterIndex] = useState(0);
  const [nextFilterIndex, setNextFilterIndex] = useState(1);
  const [currentFilter, setCurrentFilter] = useState(true);
  const [leftDirection, setLeftDirection] = useState(true);

  const canvas = useRef(null as any);
  const wrapper = useRef(null);
  const panResponderFilter = PanResponder.create({
    onMoveShouldSetPanResponder: () => mode === MODE.INITIAL,
    onPanResponderGrant: (_, gestureState) => {
      if (gestureState.moveX > displayWidth / 2) {
        setLeftDirection(true);
      } else {
        setLeftDirection(false);
      }
    },
    onPanResponderMove: (_, gestureState) => {
      if (
        (gestureState.dx < 0 && !leftDirection) ||
        (gestureState.dx > 0 && leftDirection)
      ) {
        return;
      }
      panFilterLeft.setValue(-Math.abs(gestureState.dx));
      panFilter.setValue(Math.abs(gestureState.dx));
    },
    onPanResponderRelease: (_, gestureState) => {
      if (Math.abs(gestureState.dx) > displayWidth / 2) {
        slideToEnd();
      } else {
        slideToStart();
      }
    },
  });

  const switchNext = useCallback(() => {
    currentFilter
      ? setCurrentFilterIndex(() => {
          if (currentFilterIndex + 1 >= filters.length - 1) {
            return 0;
          }
          return currentFilterIndex + 2;
        })
      : setNextFilterIndex(() => {
          if (nextFilterIndex + 1 >= filters.length - 1) {
            return 1;
          }
          return nextFilterIndex + 2;
        });
  }, [currentFilter, currentFilterIndex, nextFilterIndex]);

  const switchPrev = useCallback(() => {
    currentFilter
      ? setCurrentFilterIndex(() => {
          if (currentFilterIndex - 2 < 0) {
            return filters.length - 1;
          }
          return currentFilterIndex - 2;
        })
      : setNextFilterIndex(() => {
          if (nextFilterIndex - 2 < 0) {
            return filters.length - 2;
          }

          return nextFilterIndex - 2;
        });
  }, [currentFilter, currentFilterIndex, nextFilterIndex]);

  const slideToEnd = () => {
    Animated.timing(panFilter, {
      toValue: displayWidth,
      duration: 200,
      useNativeDriver: false,
    }).start(() => {
      panFilter.setValue(0);
      panFilterLeft.setValue(0);

      setCurrentFilter(!currentFilter);

      if (leftDirection) {
        switchNext();
      } else {
        switchPrev();
      }
    });

    if (!leftDirection) {
      Animated.timing(panFilterLeft, {
        toValue: -Math.abs(displayWidth),
        duration: 200,
        useNativeDriver: false,
      }).start(() => {
        panFilterLeft.setValue(0);
        panFilter.setValue(0);
      });
    }
  };

  const slideToStart = () => {
    Animated.timing(panFilter, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();

    if (!leftDirection) {
      Animated.timing(panFilterLeft, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const getSnapshotBase64 = () => {
    // RNSaveView.saveToPNGBase64(wrapper.current).then((res: any) => {
    //   console.log(res);
    // });
  };

  const renderItem = ({ item }: any) => {
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

  const Ready = () => (
    <CustomButton iconName="check" onPress={() => setMode(MODE.INITIAL)} />
  );

  const Tools = () => {
    switch (mode) {
      case MODE.DRAW:
        return (
          <>
            <CustomButton
              iconName="undo"
              onPress={() => {
                canvas.current?.undo();
              }}
            />
            <Ready />
          </>
        );

      case MODE.TEXT:
        return (
          <>
            <Ready />
          </>
        );

      default:
        return (
          <>
            <CustomButton
              iconName="drawing"
              onPress={() => setMode(MODE.DRAW)}
            />
            <CustomButton
              iconName="letter"
              onPress={() => setMode(MODE.TEXT)}
            />
            <CustomButton iconName="download" onPress={getSnapshotBase64} />
          </>
        );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.tools}>
        <Tools />
      </View>
      <View
        ref={wrapper}
        style={styles.container}
        {...panResponderFilter.panHandlers}>
        <Animated.View
          style={[
            styles.filter,
            {
              left: leftDirection ? 0 : currentFilter ? panFilter : 0,
              right: leftDirection ? (currentFilter ? panFilter : 0) : 0,
              zIndex: currentFilter ? 2 : 1,
            },
          ]}>
          {/* <Text style={{position: 'absolute', top: 30, zIndex: 2}}>currentFilter</Text> */}
          <ColorMatrix
            matrix={concatColorMatrices(filter[filters[currentFilterIndex]])}>
            <Animated.Image
              style={[
                styles.image,
                {
                  width: displayWidth,
                  marginLeft: currentFilter
                    ? leftDirection
                      ? 0
                      : panFilterLeft
                    : 0,
                },
              ]}
              source={imageUri}
            />
          </ColorMatrix>
        </Animated.View>

        <Animated.View
          style={[
            styles.filter,
            {
              left: leftDirection ? 0 : currentFilter ? 0 : panFilter,
              right: leftDirection ? (currentFilter ? 0 : panFilter) : 0,
              zIndex: currentFilter ? 1 : 2,
            },
          ]}>
          {/* <Text style={{position: 'absolute', top: 30, zIndex: 2}}>nextFilter</Text> */}

          <ColorMatrix
            matrix={concatColorMatrices(filter[filters[nextFilterIndex]])}>
            <Animated.Image
              style={[
                styles.image,
                {
                  width: displayWidth,
                  marginLeft: !currentFilter
                    ? leftDirection
                      ? 0
                      : panFilterLeft
                    : 0,
                },
              ]}
              source={imageUri}
            />
          </ColorMatrix>
        </Animated.View>

        <SketchCanvas
          ref={canvas}
          style={styles.canvas}
          strokeColor={color}
          strokeWidth={5}
          touchEnabled={mode === MODE.DRAW}
        />
      </View>
      <DragText />
      {mode === MODE.DRAW && (
        <View style={styles.colors}>
          <FlatList data={colors} renderItem={renderItem} horizontal={true} />
        </View>
      )}
    </View>
  );
};

export default ImageCanvas;
