import { StyleSheet, Dimensions } from 'react-native';
import { BIN_SIZE } from '../../../constants/sizes';
import { white } from '../../../constants/UIColors';

const { width, height } = Dimensions.get('window');

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
    elevation: 3,
  },
  color: {
    width: 25,
    height: 25,
    marginLeft: 10,

    borderRadius: 50,
    borderWidth: 1,
    borderColor: white,
  },
  colors: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    zIndex: 13,
    elevation: 14,
  },
  tools: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 5,
    elevation: 6,

    width: '100%',
    paddingTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  image: {
    width,
    height: height + 18,
  },
  filters: {
    position: 'absolute',
    bottom: 0,
    left: 12,
    right: 12,
    zIndex: 12,
    elevation: 13,

    paddingHorizontal: 10,

    borderRadius: 20,
    backgroundColor: white,
  },
  filterPreview: {
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  filterPreviewChecked: {
    padding: 5,
    borderRadius: 8,
  },
  filterPreviewImage: {
    width: 40,
    height: 60,

    borderRadius: 5,
  },
  filterText: {
    width: '100%',
    padding: 5,
    textAlign: 'center',
    fontSize: 9,
  },
  bin: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,

    height: BIN_SIZE,

    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderWrapper: {
    position: 'absolute',
    top: 300,
    left: -58,
    zIndex: 3,
    elevation: 4,
    transform: [{ rotate: '-90deg' }],
  },
  slider: { width: 150, height: 30 },
});
