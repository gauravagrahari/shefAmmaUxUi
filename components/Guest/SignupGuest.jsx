import { Button, StyleSheet, TextInput, TouchableOpacity, Text, View, ScrollView } from 'react-native';
import React, { useState } from 'react';
import axios from 'axios';
import OtpVerification from '../commonMethods/OtpVerification';
import { useNavigation } from '@react-navigation/native';
import { storeInSecureStore } from '../Context/SensitiveDataStorage';
import config from '../Context/constants';
import { LinearGradient } from 'expo-linear-gradient';
import { globalStyles, colors } from '../commonMethods/globalStyles';
import { Ionicons } from '@expo/vector-icons';

const URL = config.URL;

export default function SignupGuest() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneVerified, setPhoneVerified] = useState({ verified: false, value: null });
  const [errorMessage, setErrorMessage] = useState(null);

  const navigation = useNavigation();

  const handleSignup = () => {
    if (password !== confirmPassword) {
      console.log('Password and Confirm Password do not match');
      return;
    }

    if (!phoneVerified.verified) {
      console.log('Phone not verified');
      return;
    }

    const data = {
      password: password,
      phone: phoneVerified.value,
      timeStamp: new Date().toISOString()
    };

    axios
      .post(`${URL}/guestSignup`, data)
      .then((response) => {
        console.log('Server response:', response.data);
        storeInSecureStore('token', response.data.token);
      
        if (typeof response.data.uuidGuest === 'string') {
          storeInSecureStore('uuidGuest', response.data.uuidGuest);
          storeInSecureStore('timeStamp', response.data.timeStamp);
          storeInSecureStore('phone', data.phone);
        } else {
          console.error('uuidGuest is not a string:', response.data.uuidGuest);
        }
        
        navigation.navigate('DetailsGuest', {
          uuidGuest: response.data.uuidGuest,
        });
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          setErrorMessage(error.response.data);
        } else {
          console.error('Error:', error);
        }
      });
  };

  return (
    <LinearGradient colors={['white', colors.darkBlue]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.welcomeText}>
          <Text style={styles.brand}>Shef<Text style={styles.boldBrand}>Amma</Text></Text>
        </Text>

        <View style={styles.innerContainer}>
          <OtpVerification type="phone" onVerify={setPhoneVerified} />

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

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={24} color="black" />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}

          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>SignUp</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('LoginGuest')}>
            <Text style={styles.linkText}>Already have an account? Login here</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

// Add your styles here

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Aligns children vertically in the center
    paddingHorizontal: 20,
    paddingTop: 20, // Adjust as needed for spacing at the top
  },
  scrollContent: {
    flexGrow: 1, // Ensures the ScrollView content grows to fill the space
    justifyContent: 'center', // Center content vertically inside the ScrollView
    alignItems: 'center',
    paddingBottom: 30,
  },
  welcomeText: {
    fontSize: 20,
    margin: 20,  // Reduced margin
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
    marginBottom: 15,
    borderBottomColor: colors.pink,
    borderBottomWidth: 2,
  },
  input: {
    flex: 1,
    height: 50,
    marginLeft: 10,
    color: 'white',
    fontSize: 16,
  },
  button: {
    width: '100%',
    height: 55,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 10,
    borderColor: colors.pink,
    borderWidth: 2,
    backgroundColor: 'rgba(0, 150, 136, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: colors.matBlack,
    fontSize: 17,
   
  },
  linkText: {
    marginTop: 15,
    textAlign: 'center',
    color: '#3498db',
    fontSize: 17,
    fontWeight: '500',
  },
  errorMessage: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
  },
});
