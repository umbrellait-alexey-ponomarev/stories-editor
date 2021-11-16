import React, { FC, useState } from 'react';
import { View, Button } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { FIlterSlider } from '../../components/containers/FilterSlider';

import { styles } from './style';

const HomeScreen: FC = () => {
  const [uri, setUri] = useState(null);

  const onPickPhotoPress = () => {
    launchImageLibrary({ mediaType: 'photo' }, res => {
      if (res.assets?.length) {
        setUri(res.assets[0].uri);
      }
    });
  };

  const onMakePhotoPress = () => {
    launchCamera({ mediaType: 'photo' }, res => {
      if (res.assets?.length) {
        setUri(res.assets[0].uri);
      }
    });
  };

  return uri ? (
    <FIlterSlider imageUri={uri} />
  ) : (
    <View style={styles.container}>
      <Button title="Pick photo" onPress={onPickPhotoPress} />
      <View style={styles.button}>
        <Button title="Make photo" onPress={onMakePhotoPress} />
      </View>
    </View>
  );
};

export default HomeScreen;
