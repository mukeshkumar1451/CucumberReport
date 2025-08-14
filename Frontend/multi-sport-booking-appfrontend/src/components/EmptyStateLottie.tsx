import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { Text } from 'react-native-paper';

export default function EmptyStateLottie({ text = 'Nothing here yet!' }) {
  return (
    <View style={styles.container}>
      <LottieView
        source={require('../../assets/lottie/empty-box.json')}
        autoPlay
        loop
        style={styles.lottie}
      />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginTop: 32 },
  lottie: { width: 180, height: 180 },
  text: { marginTop: 12, color: '#888', fontSize: 16 },
});
