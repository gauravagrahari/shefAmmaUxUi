import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert,StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios'; // Assuming axios is used for HTTP requests
import {globalStyles,colors} from '../commonMethods/globalStyles';
import MessageCard from '../commonMethods/MessageCard';
import Loader from '../commonMethods/Loader';
import { storeInSecureStore } from '../Context/SensitiveDataStorage';
const URL = Constants.expoConfig.extra.apiUrl || config.URL;
import Constants from 'expo-constants';
import ChefHatIcon from '../../assets/chefHatIcon52.svg'; // Import your SVG icon

export default function LoginHost() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigation = useNavigation();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = () => {
    setIsLoading(true);
    const data = {
      phone: phone,
      password: password,
    };

    axios.post(`${URL}/hostLogin`, data)
      .then(async response => {
        setIsLoading(false);
        if (response.status === 200) {
          // Assuming the response contains token, host ID, and timestamp
          await storeInSecureStore('token', response.data.token);
          await storeInSecureStore('uuidHost', response.data.uuidHost);
          await storeInSecureStore('timeStamp', response.data.timeStamp);
          // Navigate to the host's dashboard or home page
          Alert.alert("Login done","done");
          navigation.navigate('Dashboard');
          console.log("Login done", response.data);
        } else {
          // Handle non-200 responses
          Alert.alert("Login Failed", response.data);
        }
      })
      .catch(error => {
        setIsLoading(false);
        const errorMessage = error.response?.data || "Unable to connect to the server. Please try again later.";
        Alert.alert("Login Error", errorMessage);
      });
  };

  return (
    <LinearGradient colors={[colors.lightBlue, 'white']} style={styles.container}>
    <View style={styles.iconContainer}>
     <ChefHatIcon fill={colors.pink} width={100} height={100} stroke={colors.pink} strokeWidth="0.3" /> 
      </View>
          <Text style={styles.welcomeText}>
            <Text style={styles.brand}>Shef<Text style={styles.boldBrand}>Amma </Text></Text>
            - Host Login
          </Text>
      {isLoading ? (
        <Loader />
      ) : (
        <View style={styles.innerContainer}>
               
          <View style={styles.inputContainer}>
            <Ionicons name="phone-portrait-outline" size={24} color="black" />
            <TextInput
              style={styles.input}
              placeholder="Enter Phone"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={24} color="black" />
            <TextInput
              style={styles.input}
              placeholder="Enter Password"
              secureTextEntry={!passwordVisible}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={togglePasswordVisibility}>
              <Ionicons name={passwordVisible ? 'eye-off' : 'eye'} size={24} color="black" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.linkText}>Forgot Password?</Text>
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
  innerContainer: {
    width: '100%',
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
    backgroundColor: 'rgba(0, 150, 136, 0.1)', // 80% opacity of #009688
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: colors.matBlack,
    fontSize: 18,
    
  },
  linkText: {
    marginTop: 15,
    textAlign: 'center',
    // color: 'white',
    color: '#3498db',
    fontSize: 17,
    fontWeight: '500',
  },
});

