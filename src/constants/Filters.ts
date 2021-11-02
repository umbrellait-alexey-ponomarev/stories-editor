import {
  Matrix,
  sepia,
  grayscale,
  invert,
  polaroid,
  tint,
  normal,
} from 'react-native-color-matrix-image-filters';

export const filters: string[] = [
  'normal',
  'sepia',
  'wb',
  'polaroid',
  'invert',
  'tint',
];

export const filter: { [key: string]: Matrix[] } = {
  normal: [normal()],
  sepia: [sepia(1)],
  wb: [grayscale(1)],
  polaroid: [polaroid()],
  invert: [invert()],
  tint: [tint(1)],
};
