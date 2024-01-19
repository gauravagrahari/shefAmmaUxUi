import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import axios from 'axios'; // Make sure to import axios

const URL = 'https://your-api-url.com'; // Replace with your API URL

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');

  const generateOtp = () => {
    axios.post(`${URL}/generateOtp`, { phone })
      .then(response => {
        console.log(response.data);
        setStep(2); // Move to OTP verification step
      })
      .catch(error => {
        console.error('Error generating OTP:', error);
        Alert.alert('Error', 'Failed to generate OTP. Please try again.');
      });
  };

  const changePassword = () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New password and confirm password do not match');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    // Axios call for changing password
    axios.post(`${URL}/forgotPasswordChange`, { phone, newPassword, otp })
      .then(response => {
        console.log(response.data);
        Alert.alert('Success', 'Password changed successfully');
        setStep(1); // Optionally reset or redirect to login
      })
      .catch(error => {
        console.error('Error changing password:', error);
        Alert.alert('Error', 'Failed to change password. Please try again.');
      });
  };

  const renderStep = () => {
    switch (step) {
      case 1: // Enter Phone Number
        return (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              keyboardType="number-pad"
              value={phone}
              onChangeText={setPhone}
            />
            <TouchableOpacity style={styles.button} onPress={generateOtp}>
              <Text style={styles.buttonText}>Generate OTP</Text>
            </TouchableOpacity>
          </View>
        );
      case 2: // OTP Verification and Password Change
        return (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter OTP"
              keyboardType="numeric"
              value={otp}
              onChangeText={setOtp}
            />
            <TextInput
              style={styles.input}
              placeholder="New Password"
              secureTextEntry={true}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm New Password"
              secureTextEntry={true}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity style={styles.button} onPress={changePassword}>
              <Text style={styles.buttonText}>Change Password</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return <View />;
    }
  };

  return <View style={styles.container}>{renderStep()}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    padding: 20,
    width: '80%',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 20,
    padding: 10,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});
