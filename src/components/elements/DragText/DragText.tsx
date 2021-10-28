import React, { useState, useRef } from 'react';
import { TextInput, Dimensions } from 'react-native';
import Draggable from 'react-native-draggable';
const { width } = Dimensions.get('window');
interface InputRef {
  blur: () => void;
  focus: () => void;
}

const DragText = () => {
  const [writeMode, setWriteMode] = useState(false);
  const [text, setText] = useState('111');
  const [lastPosition, setLastPosition] = useState({ x: 100, y: 100 });
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const input = useRef({} as InputRef);

  return (
    <Draggable
      x={position.x}
      y={position.y}
      onDragRelease={(_, _state, bounds) => {
        setLastPosition({ x: bounds.left, y: bounds.top });
      }}
      onPressIn={evt => console.log(evt.nativeEvent)}
      renderSize={100}
      shouldReverse={writeMode}
      onShortPressRelease={() => {
        setPosition({ x: 100, y: 100 });
        setWriteMode(true);
        input.current?.focus();
      }}
      touchableOpacityProps={{ activeOpacity: 1 }}>
      <TextInput
        ref={input as any}
        style={{
          width,
          flexWrap: 'wrap',
          color: 'white',
          fontSize: 22,
          paddingHorizontal: 30,
        }}
        onSubmitEditing={() => input.current?.blur()}
        onBlur={() => {
          setPosition(lastPosition);
          setWriteMode(false);
        }}
        value={text}
        onChangeText={setText}
        pointerEvents={writeMode ? 'auto' : 'none'}
      />
    </Draggable>
  );
};

export default DragText;
