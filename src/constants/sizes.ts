import { Dimensions } from 'react-native';

export const { width, height } = Dimensions.get('window');

export const BIN_SIZE = 40;

export const BIN_COORDINATES = {
  bottom: 20,
  left: (width - BIN_SIZE) / 2,
  top: height - BIN_SIZE - 20,
  right: (width + BIN_SIZE) / 2,
};
