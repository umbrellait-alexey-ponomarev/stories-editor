export interface FIlterSliderProps {
  imageUri: string;
}

export interface CanvasRef {
  undo: () => void;
}

export interface DragItem {
  id: number;
  Component: JSX.Element;
}
