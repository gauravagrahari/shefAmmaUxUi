import React, { useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';

//ProfileGuest was created, this file was not kept in excel recodrd
export default function GuestProfileEdit() {
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [dpImage, setDpImage] = useState(null);

  const handleSaveAndSubmit = () => {
    // Perform the save and submit action
    // Example: make an axios post request to save the updated guest profile
    const data = new FormData();
    data.append('uuidGuest', '123');
    data.append('name', fullName);
    data.append('address', address);
    data.append('DP', { uri: dpImage.uri, name: 'dpImage.jpg', type: 'image/jpeg' });

    axios.post('http://your-api-endpoint.com/saveGuestProfile', data, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then(response => {
        console.log('Server response:', response.data);
        // Handle successful response
      })
      .catch(error => {
        console.error('Error:', error);
        // Handle error
      });
  };

  const handleViewMyItems = () => {
    // Perform the view my items action
    // Example: navigate to the screen where the guest's items are displayed
    console.log('View My Items');
    // Add your navigation logic here
  };

  const handleImageUpload = async () => {
    try {
      // Implement image upload logic using ImagePicker
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        console.log('Permission to access camera roll is required!');
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!pickerResult.cancelled && pickerResult.assets && pickerResult.assets.length > 0) {
        const selectedAsset = pickerResult.assets[0];
        setDpImage({
          uri: selectedAsset.uri,
          width: selectedAsset.width,
          height: selectedAsset.height,
        });
      }
    } catch (error) {
      console.error('Error while picking an image:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Enter Full Name" value={fullName} onChangeText={setFullName} />
      <TextInput style={styles.input} placeholder="Enter Address" value={address} onChangeText={setAddress} />
      <TouchableOpacity style={styles.button} onPress={handleImageUpload}>
        <Text style={styles.buttonText}>Upload DP</Text>
      </TouchableOpacity>
      {dpImage && <Image source={{ uri: dpImage.uri }} style={styles.image} />}
      <TouchableOpacity style={styles.button} onPress={handleSaveAndSubmit}>
        <Text style={styles.buttonText}>Save and Submit</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleViewMyItems}>
        <Text style={styles.buttonText}>View My Items</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  button: {
    width: '100%',
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
    borderRadius: 10,
  },
});
