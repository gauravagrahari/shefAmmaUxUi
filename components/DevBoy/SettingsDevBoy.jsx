import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ChangePassword from '../commonMethods/ChangePassword';
import { deleteInSecureStore } from '../Context/SensitiveDataStorage';
import NavBarDevBoy from '../DevBoySubComponent/NavBarDevBoy'; // Assuming there is a NavBarDevBoy
import { globalStyles, colors } from '../commonMethods/globalStyles';
import { deleteInAsync } from '../Context/NonSensitiveDataStorage';

export default function SettingsDevBoy() {
    const navigation = useNavigation();
    const [isChangePasswordVisible, setIsChangePasswordVisible] = useState(false);
  
    const handlePasswordChangeSuccess = () => {
      setIsChangePasswordVisible(false);
    };
    const handleLogout = async () => {
        await deleteInSecureStore('token');
        await deleteInSecureStore('defaultAddress');
        await deleteInSecureStore('uuidGuest');
        await deleteInSecureStore('uuidDevBoy');
        await deleteInSecureStore('timeStamp');
        await deleteInSecureStore('phone');
        await deleteInAsync('guestDetails');
        navigation.navigate('LoginDevBoy');
      }
    
  return (
    <View style={styles.mainContainer}>
      <NavBarDevBoy navigation={navigation} /> 
      <View style={styles.container}>

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