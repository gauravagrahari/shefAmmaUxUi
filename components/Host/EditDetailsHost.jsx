import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import axios from "axios";
import ImageUploader from "../commonMethods/ImageUploader";
import { uploadImageToS3 } from "../Context/s3config";
import { getFromAsync, storeInAsync } from "../Context/NonSensitiveDataStorage";
import { getFromSecureStore } from "../Context/SensitiveDataStorage";
import { useNavigation } from '@react-navigation/native';
import config from '../Context/constants';
import IndianStates from "../Context/IndianStates";
import Dropdown from "../commonMethods/Dropdown";
import Loader from "../commonMethods/Loader";
import ImageDisplayer from "../commonMethods/ImageDisplayer";

const URL = config.URL;

export default function EditDetailsHost() {
  const [uuidHost, setUuidHost] = useState("");
  const [geocode, setGeocode] = useState("");
  const [fullName, setFullName] = useState("");
  const [street, setStreet] = useState("");
  const [houseName, setHouseName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [dpImage, setDpImage] = useState(null);
  const [ddpImage, setDdpImage] = useState(null);
  const [dineCategory, setDineCategory] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [editable, setEditable] = useState(false);
  const [loading, setLoading] = useState(true);  // Add a loading state
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  const navigation = useNavigation();
  const states=IndianStates;

  useEffect(() => {
    const fetchData = async () => {
      const uuidHost = await getFromSecureStore('uuidHost');
      const token = await getFromSecureStore('token');
      axios.get(`${URL}/host/getHostUsingPk`, {
        headers: {
          "Content-Type": "application/json",
          // 'Authorization': `Bearer ${token}`, // Add the token in the headers
          "uuidHost": 'host#45be1c85-db91-4d5f-a100-4f3142f3c3b4',
        },
      })
      .then(response => {
        const data = response.data;
        setUuidHost(data.uuidHost);
        setGeocode(data.geocode);
        setFullName(data.nameHost);
        setStreet(data.addressHost.street);
        setHouseName(data.addressHost.houseName);
        setCity(data.addressHost.city);
        setState(data.addressHost.state);
        setPinCode(data.addressHost.pinCode);
        setDpImage("images/ShefAmma (1).jpg");
        setDdpImage("images/ShefAmma (1).jpg");
        setDineCategory(data.dineCategory);
        setDescription(data.descriptionHost);
        setMessage(data.currentMessage);
        console.log("host detail"+JSON.stringify(response.data));
        setLoading(false);  // Set loading to false when data is fetched

      })
      .catch(error => {
        console.error("Error:", error);
        setLoading(false);  // Also set loading to false if there's an error
      });
    }
    fetchData();
  }, []);

  const handleEdit = () => {
    setEditable(true);
  }
  const uploadImage = async (imageUri, attributeName, setUploadedImageState) => {
    try {
        // upload the image to S3
        console.log("received image" + imageUri);
        const newImageKey = await uploadImageToS3(imageUri);
        console.log("new image key " + newImageKey.key);

        const data = { 
            [attributeName.toLowerCase()]: newImageKey.key,
            uuidHost: uuidHost,
            geocode: geocode,
        }

        // make a PUT request with the new image key
        const response = await axios.put(`${URL}/host`, data, {
            params: {
                attributeName: attributeName
            }
        });

        console.log("response is " + response.data[attributeName.toLowerCase()]);

        // Set the state using the callback passed in
        setDpImage("images/Your paragraph text.jpg");
        // setDpImage("images/ShefAmma (1).jpg");

    } catch (error) {
        console.error('Error uploading image', error);
    }
};

const handleNewImageUpload = async (image) => {
    await uploadImage(image.uri, 'DP', setDpImage);
};

const handleNewImageUploadDdp = async (image) => {
    await uploadImage(image.uri, 'DDP', setDdpImage);
};

  const handleSave = async () => {
    const dpImageUrl = await uploadImageToS3(dpImage.uri);
    const ddpImageUrl = await uploadImageToS3(ddpImage.uri);
    const token = await getFromSecureStore('token');
    const hostDetail = {
      uuidHost: uuidHost,
      geocode: "",
      gsiPk: "",
      uuidHostGsi: uuidHost,
      nameHost: fullName,
      dp: dpImageUrl.key, 
      ddp: ddpImageUrl.key, 
      dineCategory: dineCategory,
      descriptionHost: description,
      currentMessage: message,
      addressHost: {
        street: street,
        houseName: houseName,
        city: city,
        state: state,
        pinCode: pinCode,
      },
    };
    axios.put(`${URL}/host/${uuidHost}`, hostDetail, {
      headers: {
        "Content-Type": "application/json",
        // 'Authorization': `Bearer ${token}`, // Add the token in the headers
      },
    })
    .then(response => {
      console.log("Server response:", response.data);
      setEditable(false);
      navigation.goBack();
    })
    .catch(error => {
      console.error("Error:", error);
    });
  }
  if (loading) {
    return <Loader/>;
  }  
  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      <View style={styles.inputField}>
        <Text style={styles.inputLabel}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          editable={editable}
        />
      </View>
      <View style={styles.inputField}>
        <Text style={styles.inputLabel}>Message</Text>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          editable={editable}
        />
      </View>
      <View style={styles.inputField}>
        <Text style={styles.inputLabel}>Description</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          editable={editable}
        />
      </View>
      <View style={styles.inputField}>
        <Text style={styles.inputLabel}>Dp Image</Text>
        {/* <ImageUploader onImageUpload={setDpImage} disabled={!editable} /> */}
        <ImageDisplayer existingImageKey={dpImage} onNewImageUpload={handleNewImageUpload} />

      </View>
      <View style={styles.inputField}>
        <Text style={styles.inputLabel}>Ddp Image</Text>
        {/* <ImageUploader onImageUpload={setDdpImage} disabled={!editable} /> */}
        <ImageDisplayer existingImageKey={ddpImage} onNewImageUpload={handleNewImageUploadDdp} />

      </View>
      <View style={styles.inputField}>
        <Text style={styles.inputLabel}>Dine Category</Text>
        <TextInput
          style={styles.input}
          value={dineCategory}
          onChangeText={setDineCategory}
          editable={editable}
        />
      </View>
      <View style={styles.inputField}>
        <Text style={styles.inputLabel}>Street</Text>
        <TextInput
          style={styles.input}
          value={street}
          onChangeText={setStreet}
          editable={editable}
        />
      </View>
      <View style={styles.inputField}>
        <Text style={styles.inputLabel}>House Name</Text>
        <TextInput
          style={styles.input}
          value={houseName}
          onChangeText={setHouseName}
          editable={editable}
        />
      </View>
      <View style={styles.inputField}>
        <Text style={styles.inputLabel}>City</Text>
        <TextInput
          style={styles.input}
          value={city}
          onChangeText={setCity}
          editable={editable}
        />
      </View>
      <View style={styles.inputField}>
        <Text style={styles.inputLabel}>State</Text>
        <Dropdown
          items={states}
          selectedValue={state}
          onValueChange={(itemValue) => setState(itemValue)}
          placeholder="Select state"
          disabled={!editable}
        />
      </View>
      <View style={styles.inputField}>
        <Text style={styles.inputLabel}>Pin Code</Text>
        <TextInput
          style={styles.input}
          value={pinCode}
          onChangeText={setPinCode}
          editable={editable}
        />
      </View>
      {!editable ? (
        <TouchableOpacity style={styles.button} onPress={handleEdit}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
  
}
  
  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      backgroundColor: "#c6cdcf",
    },
    inputField: {
      width: "100%",
      marginBottom: 20,
      color:"black",
    },
    inputLabel: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 5,
    },
    input: {
      height: 40,
      borderColor: "black",
      borderWidth: 1,
      paddingHorizontal: 10,
      borderRadius: 5,
      backgroundColor:"white",
      color:"black",
    },
    button: {
      width: "100%",
      backgroundColor: "#4CAF50",
      padding: 10,
      borderRadius: 5,
      marginBottom: 20,
    },
    buttonText: {
      color: "white",
      textAlign: "center",
      fontWeight: "bold",
    },
  });
  