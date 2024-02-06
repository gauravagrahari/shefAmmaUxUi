import React, { useContext, useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Text, Alert } from 'react-native';
import axios from 'axios';
import config from '../Context/constants';
import { useNavigation } from '@react-navigation/native';
import { getFromSecureStore, storeInSecureStore } from '../Context/SensitiveDataStorage';
import Loader from '../commonMethods/Loader'
import { getFromAsync, storeInAsync } from '../Context/NonSensitiveDataStorage';
import {globalStyles,colors} from '../commonMethods/globalStyles';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import MessageCard from '../commonMethods/MessageCard';
import { AddressContext } from '../Context/AddressContext';
import Constants from 'expo-constants';
const URL = Constants.expoConfig.extra.apiUrl || config.URL;

export default function LoginGuest() {
  const [phoneNo, setPhoneNo] = useState('');
  const [password, setPassword] = useState('');
  const [message1, setMessage1] = useState(null);
  const [isLoading, setIsLoading] = useState(false); 
  const [showMessageCard, setShowMessageCard] = useState(false);
  const navigation = useNavigation();
  const [message, setMessage] = useState("");
  const { updateAddressInContext, setDefaultAddressInContext, clearAddressesInContext } = useContext(AddressContext);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const handleLogin = () => {
    setIsLoading(true); // Start loading when API call starts
    const data = {
      phone: phoneNo,
      password: password,
    };
    console.log("Attempting login with:", data);
  
    axios.post(`${URL}/guestLogin`, data)
      .then(async response => {
        setIsLoading(false); 
        console.log("Received response in Login page:", response.data); // Logging the received response
  
        if (response.status === 200) {
          console.log("Storing token and user details in secure storage");
          await storeInSecureStore('token', response.data.token);
          await storeInSecureStore('uuidGuest', response.data.uuidGuest);
          await storeInSecureStore('timeStamp', response.data.timeStamp);
          await storeInSecureStore('phone', data.phone);
  
          if (response.data.guestDetails) {
            await storeInSecureStore('altPhone', response.data.guestDetails.alternateMobile);
            await storeInAsync('guestDetails', response.data.guestDetails);
  
            if (response.data.guestDetails.addressGuest) { 
              console.log("Storing default address:", response.data.guestDetails.addressGuest);
              await storeInAsync('defaultAddress', response.data.guestDetails.addressGuest);
              const defaultAddress = await getFromAsync('defaultAddress');
              if (defaultAddress && defaultAddress.pinCode) {
                console.log("Default Address " + defaultAddress.pinCode);
              }
  
              updateAddressInContext('primary', response.data.guestDetails.addressGuest);
              updateAddressInContext('secondary', response.data.guestDetails.officeAddress);
              setDefaultAddressInContext(response.data.guestDetails.defaultAddress || 'primary');
              navigation.navigate('SelectDefaultAddress');
            } else {
              // Address details are missing, navigate to DetailsGuest
              setMessage("You have not added or updated your address. Please update it.");
              setShowMessageCard(true);
              console.log("Address details not available, navigating to DetailsGuest");
              navigation.navigate('DetailsGuest');
            }
          } else {
            // Guest details are missing, navigate to DetailsGuest
            setMessage("User details are not available. Please update your profile.");
            setShowMessageCard(true);
            console.log("Guest details not available, navigating to DetailsGuest");
            navigation.navigate('DetailsGuest');
          }
        } else {
          console.error("Login failed with response:", response.data);
          Alert.alert("Error", response.data);
        }
      })
      .catch(error => {
        setIsLoading(false);
        console.error("Login error:", error);
        if (error.response) {
          // Display the error message from the API response
          setMessage1(error.response.data);
          Alert.alert("Login Error", error.response.data);
        } else {
          // Generic error message for network issues or server unavailability
          setMessage1("Unable to connect to the server. Please try again later.");
          Alert.alert("Connection Error", "Unable to connect to the server. Please try again later.");
        }
      });
  };
  

  return (
    // <LinearGradient colors={['#dee3e3', colors.darkBlue]} style={styles.container}>
    <LinearGradient colors={['white', colors.darkBlue]} style={styles.container}>
       <MessageCard 
        message={message}
        isVisible={showMessageCard}
        onClose={() => setShowMessageCard(false)}
    />
      <Text style={styles.welcomeText}>
        {/* Welcome back to{' '} */}
        {/* <ChefHatLogo/> */}
        <Text style={styles.brand}>Shef<Text style={styles.boldBrand}>Amma</Text></Text>
      </Text>

      {isLoading ? (
        <Loader/>
      ) : (
        <View style={styles.innerContainer}>
          <View style={styles.inputContainer}>
            <Ionicons name="phone-portrait-outline" size={24} color="black" />
            <TextInput
              style={styles.input}
              placeholder="Enter Phone no."
              value={phoneNo}
              onChangeText={setPhoneNo}
              keyboardType="numeric"
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
          <View >
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('SignupGuest')}>
            <Text style={styles.linkText}>New User? Create a new account</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('LoginDevBoy')}>
            <Text style={styles.linkText}>Partner Login</Text>
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

