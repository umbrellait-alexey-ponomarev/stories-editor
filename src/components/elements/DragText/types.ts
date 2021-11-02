import { GestureResponderEvent, PanResponderGestureState } from 'react-native';

export interface InputRef {
  blur: () => void;
  focus: () => void;
}

export interface DragTextProps {
  onMoveRealise?: (
    evt: GestureResponderEvent,
    gestureState: PanResponderGestureState,
  ) => void;
  onModeChange: (mode: boolean) => void;
}
