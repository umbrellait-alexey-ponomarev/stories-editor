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
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import Slider from '@react-native-community/slider';

import { colors, white } from '../../../constants/UIColors';
import CustomButton from '../CustomButton/CustomButton';
import { styles } from './style';
import { DragTextProps, InputRef } from './types';

const { width } = Dimensions.get('window');
const initialCoordinates = { x: 0, y: 80 };

const DragText: FC<DragTextProps> = ({
  onMoveRealise,
  onModeChange,
  onMove = () => {},
  onPressIn = () => {},
  onPressOut = () => {},
}) => {
  const input = useRef({} as InputRef);
  const pan = useRef<any>(new Animated.ValueXY(initialCoordinates)).current;

  const [writeMode, setWriteMode] = useState(true);
  const [color, setColor] = useState('white');
  const [text, setText] = useState('');
  const [textSize, setTextSize] = useState(22);
  const [prevCoordinates, setPrevCoordinates] = useState(initialCoordinates);

  useEffect(() => {
    onModeChange(writeMode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [writeMode]);

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
          if (onMoveRealise) {
            onMoveRealise(evt, gestureState);
          }

          pan.flattenOffset();
          setPrevCoordinates({
            x: pan.x._value,
            y: pan.y._value,
          });
        },
      }),
    [onMove, onMoveRealise, pan, writeMode],
  );

  const returnTextToCenter = useCallback(() => {
    Animated.spring(pan, {
      toValue: initialCoordinates,
      useNativeDriver: false,
    }).start();
  }, [pan]);

  const returnTextToPrevPosition = useCallback(() => {
    Animated.spring(pan, {
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
    returnTextToCenter();
    setWriteMode(true);
    input.current.focus();
  }, [returnTextToCenter]);

  const renderColors = ({ item }: { item: string }) => {
    return (
      <TouchableOpacity onPress={() => setColor(item)}>
        <View style={[styles.color, { backgroundColor: item }]} />
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        styles.container,
        { zIndex: writeMode ? 100 : 10, elevation: writeMode ? 101 : 11 },
      ]}
      pointerEvents={writeMode ? 'auto' : 'box-none'}>
      {writeMode && (
        <>
          <View style={styles.tools}>
            <CustomButton iconName="check" onPress={onSubmitEditing} />
          </View>
          <View style={styles.colors}>
            <FlatList data={colors} renderItem={renderColors} horizontal />
          </View>
        </>
      )}
      <Animated.View
        pointerEvents="box-none"
        {...panResponder.panHandlers}
        style={[pan.getLayout()]}>
        <View style={[styles.wrapper, { width: writeMode ? width : 'auto' }]}>
          <TextInput
            ref={input as any}
            style={[styles.input, { color, fontSize: textSize }]}
            multiline={true}
            autoFocus={true}
            value={text}
            onChangeText={setText}
            pointerEvents={writeMode ? 'auto' : 'none'}
          />
          <TouchableOpacity
            style={styles.touchWrapper}
            activeOpacity={1}
            onPress={onTextPress}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
          />
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
