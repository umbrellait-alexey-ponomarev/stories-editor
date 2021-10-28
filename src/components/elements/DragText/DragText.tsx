import React, { useEffect, useState, useRef } from 'react';
import { TextInput } from 'react-native';
import Draggable from 'react-native-draggable';

const DragText = () => {
  const [writeMode, setWriteMode] = useState(false);
  const [text, setText] = useState('111');
  const [lastPosition, setLastPosition] = useState({ x: 100, y: 100 });
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const input = useRef(null);

  return (
    <Draggable
      x={position.x}
      y={position.y}
      onDragRelease={(_, _state, bounds) => {
        console.log(bounds);
        setLastPosition({ x: bounds.left, y: bounds.top });
      }}
      onPressIn={evt => console.log(evt.nativeEvent)}
      renderSize={100}
      renderColor="black"
      shouldReverse={writeMode}
      onShortPressRelease={() => {
        setPosition({ x: 100, y: 100 });
        setWriteMode(true);
        input.current.focus();
      }}
      touchableOpacityProps={{ activeOpacity: 1 }}>
      <TextInput
        ref={input}
        style={{ flexWrap: 'wrap' }}
        onSubmitEditing={() => input.current?.blur()}
        onBlur={() => {
          setPosition(lastPosition);
          setWriteMode(false);
        }}
        style={{ color: 'white' }}
        value={text}
        onChangeText={setText}
        pointerEvents={writeMode ? 'auto' : 'none'}
      />
    </Draggable>
  );
};

export default DragText;
