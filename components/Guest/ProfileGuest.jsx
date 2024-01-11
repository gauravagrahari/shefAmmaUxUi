import { Button, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { EditableText } from '../commonMethods/EditableText';
import axios from 'axios';
import config from '../Context/constants';
import Constants from 'expo-constants';
const URL = Constants.expoConfig.extra.apiUrl;
export default function ProfileGuest() {
  const [userData, setUserData] = useState({
    name: '',
    DP: '',
    dob: '',
    gender: '',
    addressGuest: {
      street: '',
      houseName: '',
      city: '',
      state: '',
      pinCode: '',
    },
  });

  const [updatedFields, setUpdatedFields] = useState(new Set());

  useEffect(() => {
    // Replace with your actual API endpoint
    axios.get("http://192.168.43.93:9090/host/guest", {
    // axios.get(`${URL}/host/guest`, {
      headers: {
        'uuidGuest': 'guest#2001',
        'geocode': '13.055580,80.283700'
      }
    })
      .then(response => {setUserData(response.data);
        console.log(userData);}
     
      )
      .catch(error => console.error(error));
  }, []);
  
  const onSave = (name, value) => {
    if (name.length === 1) {
      setUserData({ ...userData, [name[0]]: value });
    } else if (name.length === 2) {
      setUserData({
        ...userData,
        [name[0]]: { ...userData[name[0]], [name[1]]: value },
      });
    }
    setUpdatedFields(new Set([...updatedFields, name.join('.')]));
  };

  const handleSubmit = () => {
    // Extract only the updated fields
    const updatedData = Array.from(updatedFields).reduce((obj, key) => {
      const keys = key.split('.');
      if (keys.length === 1) {
        obj[keys[0]] = userData[keys[0]];
      } else if (keys.length === 2) {
        obj[keys[0]] = { ...obj[keys[0]], [keys[1]]: userData[keys[0]][keys[1]] };
      }
      return obj;
    }, {});

    // Replace with your actual API endpoint
    axios.put('/api/user', updatedData)
      .then(response => console.log(response.data))
      .catch(error => console.error(error));
  };

  return (
    <View style={styles.container}>
      <Text>{userData.name}</Text>
      <EditableText name={['DP']} value={userData.DP} onSave={onSave} placeholder="Enter DP" />
   
      <Text style={styles.sectionTitle}>Address</Text>
      <EditableText name={['addressGuest', 'street']} value={userData.addressGuest.street} onSave={onSave} placeholder="Enter street" />
      <EditableText name={['addressGuest', 'houseName']} value={userData.addressGuest.houseName} onSave={onSave} placeholder="Enter house name" />
      <EditableText name={['addressGuest', 'city']} value={userData.addressGuest.city} onSave={onSave} placeholder="Enter city" />
      <EditableText name={['addressGuest', 'state']} value={userData.addressGuest.state} onSave={onSave} placeholder="Enter state" />
      <EditableText name={['addressGuest', 'pinCode']} value={userData.addressGuest.pinCode} onSave={onSave} placeholder="Enter pin code" />

      <View style={styles.buttonContainer}>
        <Button title="Save and Submit" onPress={handleSubmit} />
        {/* <Button title="View My Items" onPress={() => {}} /> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
  },
    editableContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    textInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: '#000',
      marginRight: 10,
      padding: 10,
    },
    button: {
      padding: 10,
      backgroundColor: '#DDD',
    },
    buttonContainer: {
      marginTop: 20,
    },
  });