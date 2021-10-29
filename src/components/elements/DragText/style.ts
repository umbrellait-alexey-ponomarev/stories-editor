import { StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,

    width,
    height,

    alignItems: 'center',
  },
  wrapper: {
    top: 80,
    left: 0,
  },
  input: {
    textAlign: 'center',
    flexWrap: 'wrap',
    color: 'white',
    fontSize: 22,
  },
});
