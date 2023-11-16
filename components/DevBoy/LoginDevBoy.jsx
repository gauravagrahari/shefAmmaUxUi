import React, { useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Text, Alert } from 'react-native';
import axios from 'axios';
import config from '../Context/constants';
import { useNavigation } from '@react-navigation/native';
import { getFromSecureStore, storeInSecureStore } from '../Context/SensitiveDataStorage';
import Loader from '../commonMethods/Loader';
import { storeInAsync } from '../Context/NonSensitiveDataStorage';
import {globalStyles,colors} from '../commonMethods/globalStyles';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const URL = config.URL;

export default function LoginDevBoy() {
  const [phone, setPhone] = useState('');
  const [devBoyPassword, setDevBoyPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();

  const handleLogin = () => {
    setIsLoading(true);
    const data = {
      phone: phone,
      password: devBoyPassword,
    };

    axios.post(`${URL}/devBoyLogin`, data)
    .then(async response => {
        setIsLoading(false);

        console.log("Received response in Login page:", response.data);

        if (response.status === 200) {
            await storeInSecureStore('token', response.data.token);
            await storeInSecureStore('uuidDevBoy', response.data.uuidDevBoy);
            await storeInSecureStore('timeStamp',response.data.timeStamp);
            // await storeInAsync('devBoyDetails', response.data.devBoyDetails);
            // await storeInSecureStore('email', data.email);
            const timeStamp = await getFromSecureStore('timeStamp');
            const uuidDevBoy = await getFromSecureStore('uuidDevBoy');
            const token = await getFromSecureStore('token');
            console.log('timestamp retrieved from Secure Store:', timeStamp);
            console.log('uuidDevBoy retrieved from Secure Store:', uuidDevBoy);
            console.log('token retrieved from Secure Store:', token);

            navigation.navigate('HomeDevBoy');
        }else {
          const errorMessage = response.data || 'Unexpected error occurred';
          Alert.alert("Login Failed", errorMessage);
      }
    })
    .catch(error => {
      setIsLoading(false);
      const errorMessage = error.response?.data || "Request failed";
      Alert.alert("Login Error", errorMessage);
  });
  };

  return (
    <LinearGradient colors={[colors.darkBlue, 'white']} style={styles.container}>
      {isLoading ? (
        <Loader/>
      ) : (
        
        <View style={styles.innerContainer}>
                 <Text style={styles.welcomeText}>

        <Text style={styles.brand}>Shef<Text style={styles.boldBrand}>Amma </Text></Text>
           - Partner Login
      </Text>
          <View style={styles.inputContainer}>
            <Ionicons name="phone-portrait-outline" size={24} color="black" />
            <TextInput
              style={styles.input}
              placeholder="Enter Phone"
              value={phone}
              onChangeText={setPhone}
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={24} color="black" />
            <TextInput
              style={styles.input}
              placeholder="Enter Password"
              secureTextEntry
              value={devBoyPassword}
              onChangeText={setDevBoyPassword}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  innerContainer: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomColor: colors.pink,
    borderBottomWidth: 2,
  },
  input: {
    flex: 1,
    height: 50,
    marginLeft: 10,
    color: colors.matBlack,
    fontSize: 16,
  },
  button: {
    width: '100%',
    height: 55,
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 10,
    borderColor: colors.pink,
    borderWidth: 2,
    backgroundColor: 'rgba(0, 150, 136, 0.15)', // 80% opacity of #009688
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: colors.matBlack,
    fontSize: 18,
    // fontWeight: 'bold',
  },
  welcomeText: {
    fontSize: 20,
    marginBottom: 60,
    color: colors.pink,
  },
  brand: {
    fontSize: 26,
  },
  boldBrand: {
    fontWeight: 'bold',
  },
});