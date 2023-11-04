import React, { useState, useEffect } from 'react';
import { Dimensions, View, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadImageToS3, getFileFromS3, removeFile } from '../Context/s3config';
import { Storage } from '@aws-amplify/storage';
import ImageUploader from './ImageUploader'; // assuming this is the correct import path
import { ActivityIndicator } from 'react-native-paper';

const ImageDisplayer = ({ existingImageKey, onNewImageUpload }) => {
    const [editMode, setEditMode] = useState(false);
    const [originalImageUrl, setOriginalImageUrl] = useState(null);
    const [newImageUrl, setNewImageUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const signedUrl = await Storage.get(existingImageKey);
                setOriginalImageUrl(signedUrl);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching image from S3', error);
            }
        };
        fetchImage();
    }, [existingImageKey]);

    const handleNewImageUpload = (image) => {
        setNewImageUrl(image.uri);
        onNewImageUpload(image);
    };

    const keepOriginalImage = () => {
        setEditMode(false);
        setNewImageUrl(null); // Remove new image URL
    }

    const changeImage = () => {
        setEditMode(true);
    }

    if (isLoading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={styles.container}>
          {editMode ? (
            <React.Fragment>
              <ImageUploader onImageUpload={handleNewImageUpload} />
              <TouchableOpacity style={styles.button} onPress={keepOriginalImage}>
                <Text style={styles.buttonText}>Keep Original Image</Text>
              </TouchableOpacity>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {(newImageUrl || originalImageUrl) && (
                <View style={styles.imageContainer}>
                  <Image style={styles.image} source={{ uri: newImageUrl || originalImageUrl }} />
                </View>
              )}
              <TouchableOpacity style={styles.button} onPress={changeImage}>
                <Text style={styles.buttonText}>Change Image</Text>
              </TouchableOpacity>
            </React.Fragment>
          )}
        </View>
      );
};

// ... rest of the code

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
          borderRadius: 10,
        },
        image: {
          width: '100%', // or the size you want
          height: '100%', // or the size you want
          borderRadius: 10,
        },
      });
      export default ImageDisplayer;