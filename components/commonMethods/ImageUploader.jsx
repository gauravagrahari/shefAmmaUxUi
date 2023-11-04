import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Button, StyleSheet, Dimensions } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const ImageUploader = ({ onImageUpload, existingImage }) => {
  const [selectedImage, setSelectedImage] = useState(existingImage);

  useEffect(() => {
    setSelectedImage(existingImage);
  }, [existingImage]);

  const handleImageUpload = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        console.log("Permission to access the camera roll is required!");
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
        const selectedAsset = pickerResult.assets[0];
        setSelectedImage(selectedAsset.uri);
        onImageUpload({
          uri: selectedAsset.uri,
          width: selectedAsset.width,
          height: selectedAsset.height,
        });
      }
    } catch (error) {
      console.error("Error while picking an image:", error);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    onImageUpload(null);
  };

  return (
    <View style={styles.container}>
      {!selectedImage && (
        <TouchableOpacity style={styles.button} onPress={handleImageUpload}>
          <Text style={styles.buttonText}>Upload Image</Text>
        </TouchableOpacity>
      )}
      {selectedImage && (
        <View style={styles.imageContainer}>
          <TouchableOpacity style={styles.crossButton} onPress={handleRemoveImage}>
            <AntDesign name="closecircle" size={24} color="black" />
          </TouchableOpacity>
          <Image source={{ uri: selectedImage }} style={styles.image} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#4CAF50', // green
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  imageContainer: {
    width: Dimensions.get('window').width * 0.8,
    height: Dimensions.get('window').width * 0.8,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 12,
    position: 'relative',
  },
  image: {
    width: '100%', // or the size you want
    height: '100%', // or the size you want
    borderRadius: 10,
  },
  crossButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    zIndex: 1,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 2,
  },
});

export default ImageUploader;
