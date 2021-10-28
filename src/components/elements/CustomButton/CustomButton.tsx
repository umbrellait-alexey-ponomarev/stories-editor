import React, { FC } from 'react';
import { TouchableOpacity } from 'react-native';
import { icons } from '../../../assets/SVG';
import { styles } from './style';

interface CustomButtonProps {
  iconName: string;
  onPress: () => void;
}

const CustomButton: FC<CustomButtonProps> = props => {
  const { iconName } = props;
  const Icon = icons[iconName];

  return (
    <TouchableOpacity style={styles.container} {...props}>
      <Icon width={20} height={20} color="black" />
    </TouchableOpacity>
  );
};

export default CustomButton;
