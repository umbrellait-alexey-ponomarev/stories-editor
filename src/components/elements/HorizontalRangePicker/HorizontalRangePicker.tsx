import React, { FC, useMemo } from 'react';
import { View, Animated, PanResponder } from 'react-native';
import { styles } from './style';

interface HorizontalRangePickerProps {
  onChange?: () => void;
  maxValue?: number;
  minValue?: number;
}

const range: any = new Animated.ValueXY();

const HorizontalRangePicker: FC<HorizontalRangePickerProps> = ({
  maxValue = 100,
  minValue = 0,
}) => {
  const pan = useMemo(() => {
    return PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        range.setOffset({
          x: range.x._value,
          y: range.y._value,
        });
      },
      onPanResponderMove: (_, gestureState) => {
        const { dy } = gestureState;

        let rangeValue = 0;
        if (dy < 0) {
          rangeValue = Math.abs(dy);
        } else {
          console.log(range.y._value);
          rangeValue = rangeValue - Math.abs(dy);
        }
        range.setValue({ x: 0, y: rangeValue });
      },
      onPanResponderRelease: () => {
        range.flattenOffset();
      },
    });
  }, []);

  return (
    <View style={styles.container} pointerEvents="box-none">
      <View style={styles.wrapper}>
        <View style={styles.picker} />
        <Animated.View
          style={[styles.circle, { bottom: range.y }]}
          {...pan.panHandlers}
        />
      </View>
    </View>
  );
};

export default HorizontalRangePicker;