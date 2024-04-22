import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ChangePassword from '../commonMethods/ChangePassword';
import { deleteInSecureStore } from '../Context/SensitiveDataStorage';
import NavBarHost from '../HostSubComponent/NavBarHost';
import { globalStyles, colors } from '../commonMethods/globalStyles';
import { deleteInAsync } from '../Context/NonSensitiveDataStorage';

export default function SettingsHost() {
    const navigation = useNavigation();
    const [isChangePasswordVisible, setIsChangePasswordVisible] = useState(false);
  
    const handlePasswordChangeSuccess = () => {
      setIsChangePasswordVisible(false);
    };

    const handleLogout = async () => {
        // Add or remove keys as per host's data
        await deleteInSecureStore('token');
        await deleteInSecureStore('uuidHost');
        await deleteInSecureStore('timeStamp');
        // Additional clean-up if necessary
        navigation.navigate('LoginGuest'); // Ensure you have a LoginHost screen for hosts to navigate back to on logout
    };
    const handleTimingsPage = async () => {
        navigation.navigate('HostCancellationPolicy'); // Ensure you have a LoginHost screen for hosts to navigate back to on logout
    };

  return (
    <View style={styles.mainContainer}>
      <NavBarHost /> 
      <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleTimingsPage}>
          <Text style={styles.buttonText}>Timings</Text>
        </TouchableOpacity>
        <ChangePassword 
          visible={isChangePasswordVisible} 
          onClose={() => setIsChangePasswordVisible(false)}
          onPasswordChangeSuccess={handlePasswordChangeSuccess} 
        />
        {!isChangePasswordVisible && 
          <TouchableOpacity style={styles.button} onPress={() => setIsChangePasswordVisible(true)}>
            <Text style={styles.buttonText}>Change Password</Text>
          </TouchableOpacity>
        }
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.darkBlue,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  button: {
    marginBottom: 5,
    padding: 16,
    backgroundColor: colors.pink,
    alignItems: 'center',
    shadowColor: colors.darkGray,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    fontWeight: 'bold'
  }
});
