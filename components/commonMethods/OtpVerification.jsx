import React, { useState } from 'react';
import { Button, TextInput, View, Text, StyleSheet,Animated, TouchableOpacity  } from 'react-native';
import axios from 'axios';
import config from '../Context/constants';
import { LinearGradient } from 'expo-linear-gradient';
import {globalStyles,colors} from '../commonMethods/globalStyles';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
const URL = Constants.expoConfig.extra.apiUrl;
export default function OtpVerification({ type, onVerify }) {
  const [showOtp, setShowOtp] = useState(false);
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [inputError, setInputError] = useState('');
  const [otp, setOtp] = useState('');
  const [input, setInput] = useState('');
  const [showInputButton, setShowInputButton] = useState(true);
  const [showVerifyOtpButton, setShowVerifyOtpButton] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(true);
  const [disableInput, setDisableInput] = useState(false);  // New state variable
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial value for opacity
  const [serverError, setServerError] = useState('');  // State for server error
  const [serverErrorMessage, setServerErrorMessage] = useState('');

  const handleVerify = async () => {
    // Reset previous errors
    setInputError('');
    setServerErrorMessage('');
    // Validate input based on type
    if (type === 'phone' && input.length !== 10) {
      setInputError('Phone number must be 10 digits');
      return;
    } else if (type === 'email' && !/\S+@\S+\.\S+/.test(input)) {
      setInputError('Please enter a valid email');
      return;
    }

    axios.post(`${URL}/generateOtp`, { [type]: input })
      .then(response => {
        console.log(response.data);
        setShowOtp(true);
        fadeIn(); // Call the fade-in function here
        setShowInputButton(false);
        setShowVerifyOtpButton(true);
        setDisableInput(true);  // Disable input after verification
      })
      .catch(error => {
        if (error.response && error.response.data) {
          setServerErrorMessage(error.response.data);
          setServerError(error.response.data);  // Set server error message
        } else {
            console.error(error);
            setServerErrorMessage('An unexpected error occurred. Please try again.'); // Generic error message

        }
    });
  };
  const fadeIn = () => {
    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true, // make sure to add this to use the native driver
      }
    ).start();
  };
  const handleOtpVerification = async () => {
    axios.post(`${URL}/otp${type.charAt(0).toUpperCase() + type.slice(1)}`,
     { [type]: input
      , [`${type}Otp`]: otp 
    })
      .then(response => {
        console.log(response.data);
        setOtpSuccess(true);
        setOtpError(false);
        setShowVerifyOtpButton(false);
        setShowOtpInput(false);
        onVerify({ verified: true, value: input }); // Pass the verified value back to parent.
      })
      .catch(error => {
        if (error.response && error.response.data) {
            setServerError(error.response.data);  // Set server error message
        } else {
            console.error(error);
        }
    });
  };
  const otpRefs = [];

  const handleOtpChange = (text, index) => {
    const otpArray = [...otp]; // Create a copy of the current OTP value
    otpArray[index] = text;   // Update the character at the specific index with the new character
    setOtp(otpArray.join('')); // Join the characters and set the new OTP value

    if (text.length && index < 5) {
      otpRefs[index + 1].focus();
    }
};

  return (
    <View style={styles.container}>
    <View style={styles.inputContainer}>
      <Ionicons name={type === 'phone' ? 'phone-portrait-outline' : 'mail-outline'} size={24} color="black" />
      <TextInput 
        style={styles.input} 
        placeholder={`Enter ${type}`} 
        value={input} 
        onChangeText={setInput} 
        keyboardType={type === 'phone' ? 'number-pad' : 'email-address'}
        editable={!disableInput}
      />
    </View>
    {inputError && <Text style={styles.errorMessage}>{inputError}</Text>}
    {serverErrorMessage && (
        <Text style={styles.errorMessage}>{serverErrorMessage}</Text>
      )}

    {showInputButton && (
      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Verify {type}</Text>
      </TouchableOpacity>
    )}
   {showOtp && showOtpInput && (
  <Animated.View style={{ opacity: fadeAnim}}>
    <View style={styles.otpMessageContainer}>
      <Text style={styles.otpMessageText}>We've sent a code to {type === 'phone' ? input : "your email"}</Text>
    </View>
    <View style={styles.otpContainer}>
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <TextInput
          key={index}
          style={styles.otpBox}
          maxLength={1}
          keyboardType="numeric"
          ref={ref => otpRefs[index] = ref}
          onChangeText={text => {
            handleOtpChange(text, index);
          }}
        />
      ))}
    </View>

    {showVerifyOtpButton && (
      <TouchableOpacity style={styles.otpButton} onPress={handleOtpVerification}>
        <Text style={styles.buttonText}>Verify {type} OTP</Text>
      </TouchableOpacity>
    )}
  </Animated.View>
)}

    {otpSuccess && <Text style={styles.successMessage}>OTP verified successfully!</Text>}
    {otpError && <Text style={styles.errorMessage}>OTP verification failed. Please try again.</Text>}
  </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
},

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '95%',
    borderBottomColor: colors.pink,
    borderBottomWidth: 2,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    height: 50,
    marginLeft: 10,
    color: 'black',
    fontSize: 16,
  },
  otpButton: {
    width: 220,  // you can adjust the width here to make it wider or narrower
    height: 45,
// marginTop: 15,
margin: 10,
    borderRadius: 10,
    borderColor: colors.pink,
    borderWidth: 2,
    backgroundColor: 'rgba(0, 150, 136, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',  // this ensures that the button is centered horizontally within its parent
  },
  button: {
    width: '75%',
    height: 45,
    // marginTop: 15,
    margin: 10,
    borderRadius: 10,
    borderColor: colors.pink,
    borderWidth: 2,
    backgroundColor: 'rgba(0, 150, 136, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  buttonText: {
    color: colors.pink,
    fontSize: 16,
  },
  successMessage: {
    color: 'green',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 5,
  },
  otpMessageContainer: {
    width: '95%',
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpMessageText: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
  },
  errorMessage: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  otpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '95%',
    marginBottom: 15,
  },
  otpBox: {
    width: 40,  // or adjust as per your design
    height: 50, // or adjust as per your design
    marginHorizontal: 5,
    borderColor: colors.pink,
    borderWidth: 2,
    textAlign: 'center',
    fontSize: 18,
    color: 'black',
    backgroundColor: 'rgba(0, 150, 136, 0.04)',

  },
});