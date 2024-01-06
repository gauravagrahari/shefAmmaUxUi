import React from 'react';
import { StyleSheet, Modal, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { getFromSecureStore } from '../Context/SensitiveDataStorage';
import config from '../Context/constants';
import {globalStyles,colors} from '../commonMethods/globalStyles';

const URL = config.URL;
export default function ChangePassword({ visible, onClose, onPasswordChangeSuccess }) {
  const [oldPassword, setOldPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const handlePasswordChange = async () => {
    // Validate the new and confirm passwords match
    if (newPassword !== confirmPassword) {
      Alert.alert('New password and confirm password do not match');
      return;
    }
        // Check if the new password length is at least 8 characters
        if (newPassword.length < 8) {
          Alert.alert('Password must be at least 8 characters long');
          return; 
        }
    
    // Retrieve uuidHost and timestamp from SecureStore
    const uuidHost = await getFromSecureStore('uuidGuest');
    const timeStamp = await getFromSecureStore('timeStamp');
    const token = await getFromSecureStore('token');
    const phone = await getFromSecureStore('phone');
    console.log('phone: ' + phone);
  
    // Setup the request data and headers
    const data = {
     phone,
      timeStamp,
      oldPassword,
      newPassword,
    };
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // assuming 'jwt' is the key where the JWT is stored
    };
  
    // Make the axios post request
    axios.post(`${URL}/guest/changePassword`, data, { headers })
      .then(response => {
        if (response.data.success) { 
          // If password change was successful, show a success message
          Alert.alert('Password has been changed successfully');
          onPasswordChangeSuccess(); // Call the callback function to notify the parent component
        } else {
          // If the server response indicates the password change was unsuccessful, show an error message
          Alert.alert(response.data.message || 'An error occurred while changing the password');
        } 
      })
      .catch(error => {
        console.error(error);
        Alert.alert('An error occurred while changing the password');
      });
  }
  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.innerContainer}>
          {/* <Text style={styles.modalTitle}>Change Password</Text> */}
          <TextInput 
            style={styles.input} 
            placeholder="Old password" 
            placeholderTextColor="gray" // Set the color you desire for the placeholder text

            secureTextEntry={true}
            onChangeText={setOldPassword}
            value={oldPassword} />
          <TextInput 
            style={styles.input} 
            placeholder="New password" 
            placeholderTextColor="gray" 
            secureTextEntry={true}
            onChangeText={setNewPassword}
            value={newPassword} />
          <TextInput 
            style={styles.input} 
            placeholder="Confirm password"
            placeholderTextColor="gray"  
            secureTextEntry={true}
            onChangeText={setConfirmPassword}
            value={confirmPassword} />
          <TouchableOpacity style={styles.button} onPress={handlePasswordChange}>
            <Text style={styles.buttonText}>Change Password</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  innerContainer: {
    width: '85%',
    backgroundColor: '#f5f5f5',  // light gray background
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color:'#1BCCBA',
  },
  input: {
    width: '100%',
    height: 45,
    // borderColor: '#ddd', // Soft border color
    // borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    // backgroundColor: 'white',
    borderBottomColor: colors.pink,
    borderBottomWidth: 2,
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
});





