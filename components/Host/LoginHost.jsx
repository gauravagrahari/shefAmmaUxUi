import React, { useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Text, Alert } from 'react-native';
import axios from 'axios';
import config from '../Context/constants';
import { useNavigation } from '@react-navigation/native';
import {storeInSecureStore} from '../Context/SensitiveDataStorage';

const URL = config.URL;
export default function LoginHost() {
  const [phoneNo, setPhoneNo] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const navigation = useNavigation();
  const handleLogin = () => {
    const data = {
      phone: phoneNo,
      password: password,
    };
    axios
      .post(`${URL}/hostLogin`, data)
      .then((response) => {
        if (response.status === 200) {
          // Handle success
        } else {
          // Log the entire response object for non-200 status codes
          console.error('Response with non-200 status:', response);
          setMessage(response.data);
          Alert.alert("Error", message);
        }
      })
      .catch((error) => {
        // Log the entire error object
        console.error('Network request error:', error);
        
        // Log specific error details if available
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Error response data:', error.response.data);
          console.error('Error response status:', error.response.status);
          console.error('Error response headers:', error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('Error request data:', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error message:', error.message);
        }
        
        setMessage("Request failed");
        Alert.alert("Error", message);
      });
  };
  

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter Phone no."
        value={phoneNo}
        onChangeText={setPhoneNo}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    height: 50,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#009688',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
