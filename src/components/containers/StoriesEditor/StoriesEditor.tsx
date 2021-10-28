import React, { FC } from 'react';
import { View, Text, Animated, Dimensions } from 'react-native';
// import { CustomButton } from '../../elements/CustomButton/CustomButton';
import { styles } from './style';

const panFilter = new Animated.Value(0);
// const pan = new Animated.ValueXY();
const displayWidth = Dimensions.get('screen').width;

const StoriesEditor: FC = () => {
  return (
    <View style={styles.container}>
      <Text>text</Text>
      <Animated.View style={[styles.filter]}>
        <CurrentFilter amount={1}>
          <Image
            style={[styles.image, { width: displayWidth }]}
            source={imageUri}
          />
        </CurrentFilter>
      </Animated.View>

      <Animated.View
        style={[
          styles.filter,
          {
            right: currentFilter ? 0 : panFilter,
            zIndex: currentFilter ? 1 : 2,
          },
        ]}>
        <NextFilter amount={1}>
          <Image
            style={[styles.image, { width: displayWidth }]}
            source={imageUri}
          />
        </NextFilter>
      </Animated.View>
      <SketchCanvas
        ref={canvas}
        style={styles.canvas}
        strokeColor={color}
        strokeWidth={5}
        touchEnabled={mode === MODE.DRAW}
      />
    </View>
  );
};

export default StoriesEditor;
