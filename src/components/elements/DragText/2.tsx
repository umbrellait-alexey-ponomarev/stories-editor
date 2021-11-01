/* eslint-disable react-native/no-inline-styles */
import React, { Component, createRef } from 'react';
import {
  Text,
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
  onMoveRealise?: (
    evt: GestureResponderEvent,
    gestureState: PanResponderGestureState,
  ) => void;
  onModeChange: (mode: boolean) => void;
}

const { width } = Dimensions.get('window');
const initialCoordinates = { x: 0, y: 80 };

const pan = new Animated.ValueXY(initialCoordinates);

class DragTest extends Component<Props> {
  state = {
    text: '',
    writeMode: true,
    prevCoordinates: initialCoordinates,
  };

  inputRef = createRef();
  panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => !this.state.writeMode,
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
      if (this.props.onMoveRealise) {
        this.props.onMoveRealise(evt, gestureState);
      }

      pan.flattenOffset();
      this.setState(prev => {
        return {
          ...prev,
          prevCoordinates: {
            x: pan.x._value,
            y: pan.y._value,
          },
        };
      });
    },
  });

  returnTextToCenter = () => {
    Animated.spring(pan, {
      toValue: initialCoordinates,
      useNativeDriver: false,
    }).start();
  };

  returnTextToPrevPosition = () => {
    const { prevCoordinates } = this.state;

    Animated.spring(pan, {
      toValue: prevCoordinates,
      useNativeDriver: false,
    }).start();
  };

  onSubmittingEnd = () => {
    this.returnTextToPrevPosition();
    this.setState(prev => {
      return {
        ...prev,
        writeMode: false,
      };
    });
    this.inputRef.current?.blur();
  };

  onPressText = () => {
    this.returnTextToCenter();
    this.setState(prev => {
      return {
        ...prev,
        writeMode: true,
      };
    });
    this.inputRef.current.focus();
  };

  render() {
    const { writeMode, text } = this.state;

    return (
      <View style={styles.container} pointerEvents="box-none">
        <Animated.View
          pointerEvents="box-none"
          {...this.panResponder.panHandlers}
          style={[pan.getLayout()]}>
          <View style={[styles.wrapper, { width: writeMode ? width : 'auto' }]}>
            <TouchableOpacity
              style={{position: 'absolute', zIndex: 100, top: 0, left: 0, }}
              onPress={this.onSubmittingEnd}>
              <Text>Готово</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={1} onPress={this.onPressText}>
              <TextInput
                ref={this.inputRef as any}
                style={styles.input}
                // onSubmitEditing={}
                multiline={true}
                autoFocus={true}
                value={text}
                onChangeText={value =>
                  this.setState(prev => ({ ...prev, text: value }))
                }
                pointerEvents={writeMode ? 'auto' : 'none'}
              />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    );
  }
}

export default DragTest;
