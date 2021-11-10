import { GestureResponderEvent, PanResponderGestureState } from 'react-native';

export interface InputRef {
  blur: () => void;
  focus: () => void;
}

export interface DragTextProps {
  onMove?: (event: PanResponderGestureState) => void;
  onMoveRealise?: (
    evt: GestureResponderEvent,
    gestureState: PanResponderGestureState,
  ) => void;
  onModeChange: (mode: boolean) => void;
}
