import React, { useState } from 'react';
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
import GoogleSignIn from '../GuestSubComponent/GoogleSignIn';
import GoogleSignInButton from '../GuestSubComponent/GoogleSignInButton';


const URL = config.URL;

export default function LoginGuest() {
  const [phoneNo, setPhoneNo] = useState('');
  const [password, setPassword] = useState('');
  const [message1, setMessage1] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showMessageCard, setShowMessageCard] = useState(false);
  const navigation = useNavigation();
  const [message, setMessage] = useState("");

  const handleLogin = () => {
    setIsLoading(true); // Start loading when API call starts
    const data = {
      phone: phoneNo,
      password: password,
    };
    axios.post(`${URL}/guestLogin`, data)
    .then(async response => {  // added async here
        setIsLoading(false); 

        console.log("Received response in Login page:", response.data); // Logging the received response

        if (response.status === 200) {
          await storeInSecureStore('token', response.data.token);
          await storeInSecureStore('uuidGuest', response.data.uuidGuest);
          await storeInSecureStore('timeStamp', response.data.timeStamp);
          await storeInSecureStore('phone', data.phone);
          await storeInSecureStore('altPhone',response.data.guestDetails.alternateMobile);
          await storeInAsync('guestDetails', response.data.guestDetails);
      
          if (response.data.guestDetails && response.data.guestDetails.addressGuest) {
              // Only run this code if addressGuest exists
              await storeInAsync('defaultAddress', response.data.guestDetails.addressGuest);
              const defaultAddress = await getFromAsync('defaultAddress');
              if (defaultAddress && defaultAddress.pinCode) {
                  console.log("Default Address " + defaultAddress.pinCode);
              }
              navigation.navigate('HomeGuest');
          } else {
              // Navigate to UpdateDetailsGuest and show the MessageCard
              setMessage("You have not added or updated your address. Please update it.");
              setShowMessageCard(true);
              navigation.navigate('DetailsGuest', {
                uuidGuest: response.data.uuidGuest,
              });
          }
      }
       else {
          setMessage(response.data);
          Alert.alert("Error", message);
      }
      
    })
    .catch(error => {
        setIsLoading(false);

        console.error("API Call Error:", error); // More detailed error logging

        setMessage1("Request failed");
        Alert.alert("Error", message1);
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
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <View >
          <GoogleSignInButton />
          {/* <GoogleSignIn /> */}

          </View>
          <TouchableOpacity onPress={() => navigation.navigate('SignupGuest')}>
            <Text style={styles.linkText}>Create a new account</Text>
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
    backgroundColor: 'rgba(0, 150, 136, 0.05)', // 80% opacity of #009688
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

