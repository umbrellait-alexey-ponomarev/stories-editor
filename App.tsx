import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { FIlterSlider } from './src/components/containers/FilterSlider';
import { ImageCanvas } from './src/components/containers/ImageCanvas';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ImageCanvas imageUri={require('./src/assets/img/image.jpeg')} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
});

export default App;
