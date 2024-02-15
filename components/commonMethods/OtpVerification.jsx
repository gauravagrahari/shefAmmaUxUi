import React, { useEffect, useState } from 'react';
import { Button, TextInput, View, Text, StyleSheet,Animated, TouchableOpacity  } from 'react-native';
import axios from 'axios';
import config from '../Context/constants';
import { LinearGradient } from 'expo-linear-gradient';
import {globalStyles,colors} from '../commonMethods/globalStyles';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
const URL = Constants.expoConfig.extra.apiUrl || config.URL;
export default function OtpVerification({ type, onVerify,otpGenerationUrl }) {
  const [showOtp, setShowOtp] = useState(false);
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [inputError, setInputError] = useState('');
  const [otp, setOtp] = useState('');
  const [input, setInput] = useState('');
  const [showInputButton, setShowInputButton] = useState(true);
  const [showVerifyOtpButton, setShowVerifyOtpButton] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(true);
  const [disableInput, setDisableInput] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial value for opacity
  const [serverError, setServerError] = useState('');
  const [serverErrorMessage, setServerErrorMessage] = useState('');
  const [resendOtpEnabled, setResendOtpEnabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  useEffect(() => {
    let interval = null;
  
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((countdown) => countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setResendOtpEnabled(true);
    }
  
    return () => clearInterval(interval);
  }, [countdown]);



  const handleVerify = async () => {
    setInputError('');
    setServerErrorMessage('');
    if (type === 'phone' && input.length !== 10) {
      setInputError('Phone number must be 10 digits');
      return;
    } else if (type === 'email' && !/\S+@\S+\.\S+/.test(input)) {
      setInputError('Please enter a valid email');
      return;
    }

    axios.post(otpGenerationUrl, { [type]: input })
      .then(response => {
        setShowOtp(true);
        fadeIn();
        setShowInputButton(false);
        setShowVerifyOtpButton(true);
        setDisableInput(true);
        setCountdown(75); // For example, 75 seconds until the user can resend OTP
        setResendOtpEnabled(false);
      })
      .catch(error => {
        const errorMessage = error.response && error.response.data ? error.response.data : 'An unexpected error occurred. Please try again.';
        setServerErrorMessage(errorMessage);
      });
  };
  const handleResendOtp = () => {
    if (resendOtpEnabled) {
      axios.post(`${URL}/generateOtp`, { [type]: input })
        .then(response => {
          console.log("OTP resent successfully.");
          setCountdown(75);
          setResendOtpEnabled(false);
          // Optionally display a message to the user indicating the OTP has been resent
        })
        .catch(error => {
          console.error("Failed to resend OTP:", error);
          // Handle errors here
        });
    }
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
    axios.post(`${URL}/otp${type.charAt(0).toUpperCase() + type.slice(1)}`, {
        [type]: input,
        [`${type}Otp`]: otp
    })
    .then(response => {
        // Checking if the response data is "SUCCESS"
        if (response.data === "SUCCESS") {
            console.log(response.data);
            setOtpSuccess(true);
            setOtpError(false);
            setShowVerifyOtpButton(false);
            setShowOtpInput(false);
            onVerify({ verified: true, value: input }); // Pass the verified value back to parent.
        } else {
            // Handling unexpected successful responses (for future-proofing)
            setOtpError(true); // Set OTP error as fallback
            setServerError("Unexpected response received"); // Custom error message
        }
    })
    .catch(error => {
        if (error.response && error.response.data) {
            // Handle error messages from server
            setServerError(error.response.data); 
        } else {
            console.error(error);
        }
        setOtpError(true); // Ensure otpError is set to true on catch
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

      {showOtp && (
        <Animated.View style={{ opacity: fadeAnim }}>
          {showOtpInput && (
            <>
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
                    onChangeText={text => handleOtpChange(text, index)}
                  />
                ))}
              </View>
              <View style={styles.resendOtpContainer}>
                <Text style={styles.countdownText}>
                  {countdown > 0 ? `Resend OTP in ${countdown}s` : "Didn't receive the code?"}
                </Text>
                <TouchableOpacity
                  style={[styles.resendOtpButton, { opacity: resendOtpEnabled ? 1 : 0.5 }]}
                  onPress={handleResendOtp}
                  disabled={!resendOtpEnabled}
                >
                  <Text style={styles.buttonText}>Resend OTP</Text>
                </TouchableOpacity>
              </View>
              {showVerifyOtpButton && (
                <TouchableOpacity style={styles.otpButton} onPress={handleOtpVerification}>
                  <Text style={styles.buttonText}>Verify {type} OTP</Text>
                </TouchableOpacity>
              )}
            </>
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
  resendOtpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  countdownText: {
    marginRight: 10,
    fontSize: 16,
    color: 'black', // Adjust as per your color scheme
  },
  resendOtpButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 150, 136, 0.05)', // Adjust as per your color scheme
    borderColor: colors.pink, // Use the colors object
    borderWidth: 2,
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