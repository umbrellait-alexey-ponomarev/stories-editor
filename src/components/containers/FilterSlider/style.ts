import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
  color: {
    width: 25,
    height: 25,
    marginLeft: 10,

    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'white',
  },
  colors: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    zIndex: 3,
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
  filters: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 3,

    backgroundColor: 'white',
  },
  filterPreview: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  filterPreviewImage: {
    width: 40,
    height: 60,
  },
  filterText: {
    width: '100%',
    padding: 5,
    textAlign: 'center',
    fontSize: 9,
  },
});
