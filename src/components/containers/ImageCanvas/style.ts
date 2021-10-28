import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
  tools: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 5,

    width: '100%',
    paddingTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  colors: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
  },
  color: {
    width: 25,
    height: 25,
    marginLeft: 10,

    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'white',
  },
  text: {
    position: 'absolute',
    zIndex: 5,

    padding: 5,

    backgroundColor: 'white',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  filter: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,

    overflow: 'hidden',
  },
});
