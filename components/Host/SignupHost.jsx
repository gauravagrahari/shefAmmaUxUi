import { Button, StyleSheet, TextInput, View } from 'react-native';
import React, { useState } from 'react';
import axios from 'axios';
import OtpVerification from '../commonMethods/OtpVerification';
import { useNavigation } from '@react-navigation/native';
import {storeInSecureStore} from '../Context/SensitiveDataStorage';
import config from '../Context/constants';
import Constants from 'expo-constants';
const URL = Constants.expoConfig.extra.apiUrl;
export default function SignupHost() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneVerified, setPhoneVerified] = useState({ verified: false, value: null });
  const [emailVerified, setEmailVerified] = useState({ verified: false, value: null });

  const navigation = useNavigation();
  const handleSignup = () => {
    if (password !== confirmPassword) {
      console.log('Password and Confirm Password do not match');
      return;
    }

    if (!phoneVerified || !emailVerified) {
      console.log('Phone or Email not verified');
      return;
    }

    const data = {
      password: password,
      phone: phoneVerified.value,
      email: emailVerified.value,
      timeStamp: new Date().toISOString() // Using current timestamp.
    };
    console.log(data);
    axios
    .post(`${URL}/hostSignup`, data)
    .then((response) => {
      console.log('Server response:', response.data);
        storeInSecureStore('token', response.data.token);
     
      if (typeof response.data.uuidHost === 'string') {
        storeInSecureStore('uuidHost', response.data.uuidHost);
        // storeInSecureStore('timeStamp', String(response.data.timeStamp));
        console.log('timeStamp type:', typeof response.data.timeStamp);
        storeInSecureStore('timeStamp',response.data.timeStamp);
        storeInSecureStore('phone', data.phone);
      } else {
        console.error('uuidHost is not a string:', response.data.uuidHost);
      }
      console.log(response.data.uuidHost);
      console.log(response.data.timeStamp);
      navigation.navigate('DetailsHost', {
      // navigation.navigate('SettingsHost', {
        uuidHost: response.data.uuidHost,
      });
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  return (
    <View style={styles.container}>
         {/* <TextInput placeholder="Enter Phone no" value={input} onChangeText={setInput} /> */}
      <OtpVerification type="phone" onVerify={setPhoneVerified} />
      {/* <TextInput placeholder="Enter Email Id" value={input} onChangeText={setInput} /> */}
      <OtpVerification type="email" onVerify={setEmailVerified} />
      <TextInput style={styles.input} placeholder="Enter Password" secureTextEntry value={password} onChangeText={setPassword} />
      <TextInput style={styles.input} placeholder="Confirm Password" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
      <Button title="SignUp" style={styles.button} onPress={handleSignup} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  button: {
    marginTop: 10,
    marginBottom: 10,
  },
  otpContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  successMessage: {
    color: 'green',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  errorMessage: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
});
