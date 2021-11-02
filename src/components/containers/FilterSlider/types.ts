import { ImageRequireSource } from 'react-native';

export interface FIlterSliderProps {
  imageUri: ImageRequireSource;
}

export interface CanvasRef {
  undo: () => void;
}

export interface DragItem {
  id: number;
  Component: JSX.Element;
}
