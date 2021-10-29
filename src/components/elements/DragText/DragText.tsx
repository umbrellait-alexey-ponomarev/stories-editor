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
} from 'react-native';
import { styles } from './style';
interface InputRef {
  blur: () => void;
  focus: () => void;
}

interface Props {
  write: boolean;
  onMoveRealise?: (
    evt: GestureResponderEvent,
    gestureState: PanResponderGestureState,
  ) => void;
  onModeChange: (mode: boolean) => void;
}

const { width } = Dimensions.get('window');
const initialCoordinates = { x: 0, y: 80 };

const DragText: FC<Props> = ({ write, onMoveRealise, onModeChange }) => {
  const input = useRef({} as InputRef);
  const pan = useRef(new Animated.ValueXY(initialCoordinates)).current;

  const [writeMode, setWriteMode] = useState(write);
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

  useEffect(() => {
    console.log(write);
    if (!write) {
      onSubmitEditing();
    }
  }, [onSubmitEditing, write]);

  return (
    <View style={styles.container} pointerEvents="box-none">
      <Animated.View
        pointerEvents="box-none"
        {...panResponder.panHandlers}
        style={[pan.getLayout()]}>
        <View style={[styles.wrapper, { width: writeMode ? width : 'auto' }]}>
          <TouchableOpacity activeOpacity={1} onPress={onTextPress}>
            <TextInput
              ref={input as any}
              style={styles.input}
              // onSubmitEditing={}
              multiline={true}
              autoFocus={true}
              value={text}
              onChangeText={setText}
              pointerEvents={writeMode ? 'auto' : 'none'}
            />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

export default DragText;
