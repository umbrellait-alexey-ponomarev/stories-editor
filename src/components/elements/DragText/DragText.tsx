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
  GestureResponderEvent,
  PanResponderGestureState,
  FlatList,
} from 'react-native';
import { colors } from '../../../constants/UIColors';

import CustomButton from '../CustomButton/CustomButton';
import { styles } from './style';
interface InputRef {
  blur: () => void;
  focus: () => void;
}

interface Props {
  onMoveRealise?: (
    evt: GestureResponderEvent,
    gestureState: PanResponderGestureState,
  ) => void;
  onModeChange: (mode: boolean) => void;
}

const { width } = Dimensions.get('window');
const initialCoordinates = { x: 0, y: 80 };

const DragText: FC<Props> = ({ onMoveRealise, onModeChange }) => {
  const input = useRef({} as InputRef);
  const pan = useRef<any>(new Animated.ValueXY(initialCoordinates)).current;

  const [writeMode, setWriteMode] = useState(true);
  const [color, setColor] = useState('white');
  const [text, setText] = useState('');
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
        onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
          useNativeDriver: false,
        }),
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
    [onMoveRealise, pan, writeMode],
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
            style={[styles.input, { color }]}
            multiline={true}
            autoFocus={true}
            value={text}
            onChangeText={setText}
            pointerEvents={writeMode ? 'auto' : 'none'}
          />
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1,
              elevation: 2,
            }}
            activeOpacity={1}
            onPress={onTextPress}
          />
        </View>
      </Animated.View>
    </View>
  );
};

export default DragText;
