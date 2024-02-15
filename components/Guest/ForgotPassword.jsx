import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet,Alert, ScrollView } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles, colors } from '../commonMethods/globalStyles';
import OtpVerification from '../commonMethods/OtpVerification';
import ChefHatIcon from '../../assets/chefHatIcon52.svg'; // Import your SVG icon
import { useNavigation } from '@react-navigation/native';

const URL = Constants.expoConfig.extra.apiUrl;

export default function ForgotPassword() {
  const navigation = useNavigation();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneVerified, setPhoneVerified] = useState({ verified: false, value: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
  const toggleConfirmPasswordVisibility = () => setConfirmPasswordVisible(!confirmPasswordVisible);

  const changePassword = () => {
    if (!phoneVerified.verified) {
      alert('Please verify your phone number.');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('New password and confirm password do not match.');
      return;
    }

    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters long.');
      return;
    }

    setIsSubmitting(true);
    // Assuming your API endpoint for changing the password is /changePassword
    axios.post(`${URL}/changeForgottenPassword`, { phone: phoneVerified.value, newPassword })
      .then(response => {
        // navigation.navigate('LoginGuest')
        Alert.alert('Success', 'Password changed successfully.', [
          { text: "OK", onPress: () => navigation.navigate('LoginGuest') }
        ]);
         setIsSubmitting(false);
      })
      .catch(error => {
        console.error('Error changing password:', error);
        alert('Failed to change password. Please try again.');
        setIsSubmitting(false);
      });
  };

  return (
    <LinearGradient colors={['white', colors.darkBlue]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.iconContainer}>
     <ChefHatIcon fill={colors.pink} width={100} height={100} stroke={colors.pink} strokeWidth="0.3" /> 
      </View>
      <Text style={styles.welcomeText}>
          <Text style={styles.brand}>
            Shef<Text style={styles.boldBrand}>Amma </Text>
          </Text>
           - Change Password
        </Text>
        <View style={styles.innerContainer}>
        <OtpVerification type="phone" onVerify={setPhoneVerified} otpGenerationUrl={`${URL}/generateForgotPassOtp`}/>
      
        {phoneVerified.verified && (
          <>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={24} color="black" />
              <TextInput
                style={styles.input}
                placeholder="New Password"
                secureTextEntry={!passwordVisible}
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TouchableOpacity onPress={togglePasswordVisibility}>
                <Ionicons
                  name={passwordVisible ? "eye-off" : "eye"}
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={24} color="black" />
              <TextInput
                style={styles.input}
                placeholder="Confirm New Password"
                secureTextEntry={!confirmPasswordVisible}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity onPress={toggleConfirmPasswordVisibility}>
                <Ionicons
                  name={confirmPasswordVisible ? "eye-off" : "eye"}
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            </View>
          
            <TouchableOpacity style={styles.button} onPress={changePassword} disabled={isSubmitting}>
              <Text style={styles.buttonText}>Change Password</Text>
            </TouchableOpacity>
          </>
        )}
          </View>
      </ScrollView>
    </LinearGradient>
  );
}

// Adapt styles based on your globalStyles and the OTP component's styles for consistency
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: 'white', // Assuming a light theme, adjust as necessary
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 20,
    margin: 20, // Reduced margin
    color: colors.pink,
    marginTop: 5,
  },
  brand: {
    fontSize: 26,
  },
  boldBrand: {
    fontWeight: "bold",
  },
  innerContainer: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: colors.pink, // Adjust the color to match the theme
  },
  input: {
    flex: 1,
    height: 50,
    marginLeft: 10,
    color: colors.matBlack, // Updated color
    fontSize: 16,

  },
  button: {
    width: "100%",
    height: 55,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 10,
    borderColor: colors.pink,
    borderWidth: 2,
    backgroundColor: "rgba(0, 150, 136, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: colors.pink,
    fontSize: 17,
  },
  linkText: {
    color: colors.blue,
    marginTop: 20,
    textDecorationLine: 'underline',
  },
  errorMessage: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
});