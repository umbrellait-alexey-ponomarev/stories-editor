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
  },
  wrapper: {
    top: 200,
    left: 10,

    height: 150,
    width: 15,

    alignItems: 'center',
  },
  picker: {
    height: 150,
    width: 3,

    backgroundColor: 'gray',
  },
  circle: {
    position: 'absolute',
    bottom: 0,
    left: 0,

    width: 15,
    height: 15,

    borderRadius: 50,
    backgroundColor: 'white',
  },
});
