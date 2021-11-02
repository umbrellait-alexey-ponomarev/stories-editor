import { StyleSheet, Dimensions } from 'react-native';
import { white } from '../../../constants/UIColors';
const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
    elevation: 11,

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
    color: white,
    fontSize: 22,
    fontWeight: 'bold',
  },
  tools: {
    position: 'absolute',
    top: 10,
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
    top: 60,
    left: 20,
    right: 20,
  },
  touchWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    elevation: 2,
  },
});
