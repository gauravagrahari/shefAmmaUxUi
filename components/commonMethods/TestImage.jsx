import React, { useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import ImageUploader from './ImageUploader';
import { uploadImageToS3 } from '../Context/s3config.js';

const UploadTestComponent = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = async (image) => {
    setSelectedImage(image);
  };
// images/8628730320_b8r.jpeg"
  const handleUploadButtonPress = async () => {
    if (selectedImage) {
      try {
        const result = await uploadImageToS3(selectedImage.uri);
        console.log('Upload result:', result);
      } catch (error) {
        console.error('Upload error:', error);
      }
    } else {
      console.log('No image selected');
    }
  };

  return (
    <View>
      <ImageUploader onImageUpload={handleImageUpload} />
      {/* {selectedImage && <Image source={{ uri: selectedImage.uri }} style={styles.image} />} */}
      <Button title="Submit To S3" onPress={handleUploadButtonPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 10,
  },
});
export default UploadTestComponent;
