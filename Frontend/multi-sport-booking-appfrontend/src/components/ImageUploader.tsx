import React, { useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';

export default function ImageUploader({ onUpload, label = 'Upload Image', initialUri }) {
  const [image, setImage] = useState(initialUri || null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets[0].uri) {
      setImage(result.assets[0].uri);
      setUploading(true);
      // Mock upload, replace with real upload logic
      setTimeout(() => {
        setUploading(false);
        onUpload && onUpload(result.assets[0].uri);
      }, 1000);
    }
  };

  return (
    <View style={styles.container}>
      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <Text>No image selected</Text>
      )}
      <Button mode="outlined" onPress={pickImage} loading={uploading} style={styles.btn}>
        {label}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginVertical: 12 },
  image: { width: 120, height: 90, borderRadius: 8, marginBottom: 8 },
  btn: { minWidth: 120, minHeight: 44 },
});
