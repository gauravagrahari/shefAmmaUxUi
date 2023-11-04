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
import { getFromAsync, storeInAsync } from "../Context/NonSensitiveDataStorage"; // Path might need to be adjusted
import { getFromSecureStore } from "../Context/SensitiveDataStorage"; // Path might need to be adjusted
import { useNavigation } from '@react-navigation/native';
import config from '../Context/constants';
import IndianStates from "../Context/IndianStates";
import Dropdown from "../commonMethods/Dropdown";

const URL = config.URL;
export default function DetailsHost({ route }) {
  const [uuidHost, setUuidHost] = useState("setUuidHost");
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


  const navigation = useNavigation();
  const states=IndianStates;
  const handleSubmission = async () => {
    try {
      const dpImageUrl = await uploadImageToS3(dpImage.uri);
      const ddpImageUrl = await uploadImageToS3(ddpImage.uri);
      const token = await getFromSecureStore('token');
      const uuidHost = await getFromSecureStore('uuidHost');      
      console.log("token detailHost: " + token);
      console.log("uuidHost detailHost: " + uuidHost);
      console.log(dpImageUrl);
      const hostDetail = {
        uuidHost: uuidHost,
        geocode: "",
        gsiPk: "",
        uuidHostGsi: uuidHost,
        nameHost: fullName,
        dp: dpImageUrl.key, //keep dp as small case as it is becoming null in the backend
        ddp: ddpImageUrl.key, //keep dp as small case as it is becoming null in the backend
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
      console.log("the data is " + JSON.stringify(hostDetail));
      // Storing data to AsyncStorage
      await storeInAsync('hostDetail', hostDetail);
      
      axios
        .post(`${URL}/host`, hostDetail, {
          headers: {
            "Content-Type": "application/json",
            // 'Authorization': `Bearer ${token}`, // Add the token in the headers
          },
        })
        .then((response) => {
          console.log("Server response:", response.data);
          navigation.navigate('AddTimeSlot');
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
<ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter Full Name"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Street"
        value={street}
        onChangeText={setStreet}
      />
      <TextInput
        style={styles.input}
        placeholder="House name"
        value={houseName}
        onChangeText={setHouseName}
      />
      <TextInput
        style={styles.input}
        placeholder="City"
        value={city}
        onChangeText={setCity}
      />
     <Dropdown
  items={states}
  selectedValue={state}
  onValueChange={(itemValue) => setState(itemValue)}
  placeholder="Select state"
/>
      <TextInput
        style={styles.input}
        placeholder="Pin Code"
        value={pinCode}
        onChangeText={setPinCode}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="message"
        value={message}
        onChangeText={setMessage}
      />
      <ImageUploader onImageUpload={setDpImage} />
      <ImageUploader onImageUpload={setDdpImage} />
      <TextInput
        style={styles.input}
        placeholder="Dine Category"
        value={dineCategory}
        onChangeText={setDineCategory}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmission}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  button: {
    width: "100%",
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  pickerContainer: {
    height: 40,
    width: "100%",
  },
  dropdown: {
    backgroundColor: '#fafafa',
  },
  dropdownItem: {
    justifyContent: 'flex-start',
  },
  dropdownList: {
    backgroundColor: '#fafafa',
    marginTop: 2,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
    borderRadius: 10,
  },
});
