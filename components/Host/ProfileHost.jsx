import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Image, Text } from 'react-native';
import axios from 'axios';
import ImageUploader from '../commonMethods/ImageUploader'; // Assuming ImageUploader is in the same directory
import {EditableText} from '../commonMethods/EditableText';
import NavHost from '../HostSubComponent/NavHost';
import { getFromAsync, saveToAsync } from "../Context/NonSensitiveDataStorage"; // Path might need to be adjusted
import { getFromSecureStore } from "../Context/SensitiveDataStorage"; // Path might need to be adjusted
import { uploadImageToS3,getFileFromS3 } from '../Context/s3config.js';
import { Button } from 'react-native';

//image edit functionality is incomplete
export default function ProfileHost() {
  const [fullName, setFullName] = useState("");
  const [street, setStreet] = useState("");
  const [houseName, setHouseName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [dpImage, setDpImage] = useState(null);
  const [dppImage, setDppImage] = useState(null);
  const [dineCategory, setDineCategory] = useState("");
  const [description, setDescription] = useState("");
  const [currentMessage, setCurrentMessage] = useState("");
  const [hostDetail, setHostDetail] = useState({});
  const [editFullName, setEditFullName] = useState(false);

  const fetchHostDetail = async () => {
    try {
      let hostDetail = await getFromAsync('hostDetail');
      console.log("Profile host1", hostDetail);
      // or
      console.log("Profile host2 " + JSON.stringify(hostDetail.addressHost));
  
      if (!hostDetail) {
        // Fetch hostDetail from API
        const response = await axios.get('http://192.168.86.93:9090/getHostDetail'); // replace with your actual API endpoint
        hostDetail = response.data;
        // Save hostDetail to AsyncStorage
        await storeInAsync('hostDetail', hostDetail);
      }

      setHostDetail(hostDetail);
      // Here you set the state variables once the hostDetail is fetched
      setFullName(hostDetail.nameHost); // according to your hostDetail object structure
      // console.log('name '+fullName);
      setStreet(hostDetail.addressHost.street); // according to your hostDetail object structure
      setHouseName(hostDetail.addressHost.houseName); // according to your hostDetail object structure
      setCity(hostDetail.addressHost.city); // according to your hostDetail object structure
      setState(hostDetail.addressHost.state); // according to your hostDetail object structure
      setPinCode(hostDetail.addressHost.pinCode); // according to your hostDetail object structure
      setDineCategory(hostDetail.dineCategory);
      setDescription(hostDetail.descriptionHost); // according to your hostDetail object structure
      setCurrentMessage(hostDetail.currentMessage);
    } catch (error) {
      console.error('Error fetching host details:', error);
    }
  };
  
  // Run fetchHostDetail on component mount
  useEffect(() => {
    fetchHostDetail();
  }, []);

  const handleSaveFullName = () => {
    // Perform save operation
    setEditFullName(false);
  };
  
  const handleEditFullName = () => {
    setEditFullName(true);
  };

  const handleSaveAndSubmit = async () => {
    try {
      let dpImageLink, dppImageLink;
      // Upload DP image to S3 and get the link
      if (dpImage) {
        const dpUploadResult = await uploadImageToS3(dpImage.uri);
        dpImageLink = dpUploadResult.Location; // Assuming the S3 upload function returns an object with a Location property
      }
      // Upload DPP image to S3 and get the link
      if (dppImage) {
        const dppUploadResult = await uploadImageToS3(dppImage.uri);
        dppImageLink = dppUploadResult.Location; // Assuming the S3 upload function returns an object with a Location property
      }
      const token = await getFromSecureStore('token');
      const uuidHost = await getFromSecureStore('uuidHost');      
      console.log("token: " + token);
      console.log("uuidHost: " + uuidHost);
      // Perform the save and submit action
      // Example: make an axios post request to save the updated host profile
      const data = new FormData();
      data.append("uuidHost", "123");
      data.append("name", fullName);
      data.append("DP", dpImageLink);
      data.append("DDP", dppImageLink);
      data.append(
        "addressHost",
        JSON.stringify({
          street: street,
          houseName: houseName,
          city: city,
          state: state,
          pinCode: pinCode,
        })
      );
      data.append("dineCategory", dineCategory);
      data.append("description", description);
      data.append("currentMessage", currentMessage);

      axios
        .post("http://192.168.86.93:9090/saveHostProfile", data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log("Server response:", response.data);
          // Handle successful response
        })
        .catch((error) => {
          console.error("Error:", error);
          // Handle error
        });
    } catch (error) {
      console.error("Error while uploading images:", error);
    }
  };

  const handleViewMyItems = () => {
    // Perform the view my items action
    // Example: navigate to the screen where the host's items are displayed
    console.log('View My Items');
    // Add your navigation logic here
  };
  return (
    <View>
     <NavHost/>
    <Text>{fullName}</Text>
    {!editFullName ?
      <View style={styles.editableContainer}>
        <Text style={styles.text}>{fullName}</Text>
        <Button title="Edit" onPress={handleEditFullName} />
      </View>
      :
      <View style={styles.editableContainer}>
        <TextInput 
          value={fullName}
          onChangeText={setFullName}
          style={styles.textInput}
        />
        <Button title="Save" onPress={handleSaveFullName} />
      </View>
    }
    
  <EditableText initialValue={street} onSave={setStreet} />
    <EditableText initialValue={houseName} onSave={setHouseName} />
    <EditableText initialValue={city} onSave={setCity} />
    <EditableText initialValue={state} onSave={setState} />
    <EditableText initialValue={pinCode} onSave={setPinCode} />

      <ImageUploader onImageUpload={setDpImage} />
      {dpImage && <Image source={{ uri: dpImage.uri }} style={styles.image} />}
      <ImageUploader onImageUpload={setDppImage} />
      {dppImage && <Image source={{ uri: dppImage.uri }} style={styles.image} />}
      
    <EditableText initialValue={dineCategory} onSave={setDineCategory} />
    <EditableText initialValue={description} onSave={setDescription} />
    <EditableText initialValue={currentMessage} onSave={setCurrentMessage} />
      <TouchableOpacity style={styles.button} onPress={handleSaveAndSubmit}>
        <Text style={styles.buttonText}>Save and Submit</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleViewMyItems}>
        <Text style={styles.buttonText}>View My Items</Text>
      </TouchableOpacity>
    </View>
    // </View>
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

      {/* <TextInput style={styles.input} placeholder="Enter Full Name" value={fullName} onChangeText={setFullName} /> */}
{/* <TextInput style={styles.input} placeholder="Street" value={street} onChangeText={setStreet} /> */}
{/* <TextInput style={styles.input} placeholder="House name and no." value={houseName} onChangeText={setHouseName} /> */}
 {/* <TextInput style={styles.input} placeholder="City" value={city} onChangeText={setCity} /> */}
 {/* <TextInput style={styles.input} placeholder="State" value={state} onChangeText={setState} /> */}
 {/* <TextInput style={styles.input} placeholder="Pin Code" value={pinCode} onChangeText={setPinCode} /> */}
{/* <TextInput style={styles.input} placeholder="Dine Category" value={dineCategory} onChangeText={setDineCategory} /> */}
 {/* <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} /> */}
  {/* <TextInput style={styles.input} placeholder="Dine Category" value={currentMessage} onChangeText={setCurrentMessage} /> */}