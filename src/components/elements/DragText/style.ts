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
    fontWeight: 'bold',
  },
  tools: {
    position: 'absolute',
    top: 56,
    right: 0,
    left: 0,

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  color: {
    width: 20,
    height: 20,

    borderRadius: 50,
    marginRight: 10,
  },
  colors: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
  },
});
