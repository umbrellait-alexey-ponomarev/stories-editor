import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { FIlterSlider } from './src/components/containers/FilterSlider';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <FIlterSlider imageUri={require('./src/assets/img/image.jpeg')} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default App;
