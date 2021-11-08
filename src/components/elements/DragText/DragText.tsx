/* eslint-disable react-native/no-inline-styles */
import React, {
  useState,
  useRef,
  useMemo,
  useCallback,
  FC,
  useEffect,
} from 'react';
import {
  TextInput,
  Dimensions,
  Animated,
  PanResponder,
  View,
  FlatList,
  Platform,
  Pressable,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Slider from '@react-native-community/slider';

import { colors, white } from '../../../constants/UIColors';
import CustomButton from '../CustomButton/CustomButton';
import { styles } from './style';
import { DragTextProps, InputRef } from './types';
import { REMOVE_TEXT_TIME } from '../../../constants/timing';
import { BIN_COORDINATES } from '../../../constants/sizes';

const { width } = Dimensions.get('window');
const initialCoordinates = { x: 0, y: 80 };

const DragText: FC<DragTextProps> = ({
  onMoveRealise,
  onModeChange,
  onMove = () => {},
  showRemoveAnimation = false,
}) => {
  const [writeMode, setWriteMode] = useState(true);
  const [color, setColor] = useState('white');
  const [text, setText] = useState('');
  const [textSize, setTextSize] = useState(22);
  const [prevCoordinates, setPrevCoordinates] = useState(initialCoordinates);
  const [isDraggable, setIsDraggable] = useState(false);

  const input = useRef({} as InputRef);
  const pan = useRef<any>(new Animated.ValueXY(initialCoordinates)).current;
  const removeValue = useRef<any>(new Animated.Value(0)).current;

  const removeAnimation = useCallback(() => {
    Animated.timing(removeValue, {
      duration: REMOVE_TEXT_TIME,
      toValue: 1,
      useNativeDriver: false,
    }).start();
  }, [removeValue]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: () => !writeMode,
        onPanResponderGrant: () => {
          pan.setOffset({
            x: pan.x._value,
            y: pan.y._value,
          });
        },
        onPanResponderMove: (_, gestureState) => {
          onMove(gestureState);

          pan.setValue({
            x: gestureState.dx,
            y: gestureState.dy,
          });
        },
        onPanResponderRelease: (evt, gestureState) => {
          const { moveX, moveY, dx, dy } = gestureState;

          if (onMoveRealise) {
            onMoveRealise(evt, gestureState);
          }

          if (
            moveX >= BIN_COORDINATES.left &&
            moveX <= BIN_COORDINATES.right &&
            moveY >= BIN_COORDINATES.top &&
            moveY >= BIN_COORDINATES.bottom
          ) {
            removeAnimation();
          }

          if (Platform.OS === 'ios') {
            if (
              (Math.abs(dx) > 0 && Math.abs(dy) > 0) ||
              Math.abs(dx) > 0 ||
              Math.abs(dy) > 0
            ) {
              setIsDraggable(false);
            }
          }

          pan.flattenOffset();
          setPrevCoordinates({
            x: pan.x._value,
            y: pan.y._value,
          });
        },
      }),
    [onMove, onMoveRealise, pan, removeAnimation, writeMode],
  );

  const scaleX = removeValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const translateY = removeValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100],
  });

  const returnTextToCenter = useCallback(() => {
    Animated.spring(pan, {
      toValue: initialCoordinates,
      useNativeDriver: false,
    }).start();
  }, [pan]);

  const returnTextToPrevPosition = useCallback(() => {
    Animated.timing(pan, {
      duration: REMOVE_TEXT_TIME,
      toValue: prevCoordinates,
      useNativeDriver: false,
    }).start();
  }, [pan, prevCoordinates]);

  const onSubmitEditing = useCallback(() => {
    returnTextToPrevPosition();
    setWriteMode(false);
    input.current?.blur();
  }, [returnTextToPrevPosition]);

  const onTextPress = useCallback(() => {
    if (Platform.OS === 'ios' && isDraggable) {
      returnTextToCenter();
      setWriteMode(true);
      input.current.focus();
    } else {
      returnTextToCenter();
      setWriteMode(true);
      input.current.focus();
    }
  }, [isDraggable, returnTextToCenter]);

  const renderColors = ({ item }: { item: string }) => {
    return (
      <TouchableOpacity onPress={() => setColor(item)}>
        <View style={[styles.color, { backgroundColor: item }]} />
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    if (showRemoveAnimation) {
      removeAnimation();
    }
  }, [removeAnimation, showRemoveAnimation]);

  useEffect(() => {
    onModeChange(writeMode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [writeMode]);

  return (
    <View
      style={[
        styles.container,
        {
          zIndex: writeMode ? 100 : 10,
          elevation: writeMode ? 101 : 11,
        },
      ]}
      pointerEvents={writeMode ? 'auto' : 'box-none'}>
      {writeMode && (
        <>
          <View style={styles.tools}>
            <CustomButton iconName="check" onPress={onSubmitEditing} />
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
      <Animated.View
        pointerEvents="box-none"
        {...panResponder.panHandlers}
        style={[pan.getLayout(), { transform: [{ scaleX }, { translateY }] }]}>
        <View style={[styles.wrapper, { width: writeMode ? width : 'auto' }]}>
          <TouchableOpacity
            activeOpacity={1}
            onPressIn={() => {
              if (Platform.OS === 'ios') {
                setIsDraggable(true);
              }
            }}
            onPressOut={() => {
              onTextPress();
            }}>
            <TextInput
              ref={input as any}
              style={[styles.input, { color, fontSize: textSize }]}
              multiline={true}
              autoFocus={true}
              value={text}
              onChangeText={setText}
              pointerEvents={writeMode ? 'auto' : 'none'}
            />
          </TouchableOpacity>

          {Platform.OS === 'android' && (
            <Pressable style={styles.touchWrapper} onPress={onTextPress} />
          )}
        </View>
      </Animated.View>
      {writeMode && (
        <View style={styles.sliderWrapper}>
          <Slider
            vertical={true}
            style={styles.slider}
            minimumValue={10}
            maximumValue={36}
            minimumTrackTintColor={white}
            maximumTrackTintColor={white}
            onValueChange={setTextSize}
            value={textSize}
            thumbTintColor={white}
          />
        </View>
      )}
    </View>
  );
};

export default DragText;
