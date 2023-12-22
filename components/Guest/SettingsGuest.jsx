import React, { useContext, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ChangePassword from '../commonMethods/ChangePassword';
import { deleteInSecureStore } from '../Context/SensitiveDataStorage';
import NavBarGuest from '../GuestSubComponent/NavBarGuest';
import {globalStyles,colors} from '../commonMethods/globalStyles';
import { deleteInAsync } from '../Context/NonSensitiveDataStorage';
import { AddressContext } from '../Context/AddressContext';

export default function SettingsGuest() {
  const navigation = useNavigation();
  const [isChangePasswordVisible, setIsChangePasswordVisible] = useState(false);
  const { addresses, clearAddressesInContext } = useContext(AddressContext); // Corrected method name and added addresses

  const handlePasswordChangeSuccess = () => {
    setIsChangePasswordVisible(false);
  };
  const handleContactUs=()=>{
    navigation.navigate('ContactPage');
  }
  
  const handleTiming=()=>{
    navigation.navigate('ChargesDisplay');
  }
  
  const handleLogout = async () => {
    console.log('Current addresses in context before logout------>', addresses);
    await deleteInSecureStore('token');
    await deleteInSecureStore('defaultAddress');
    await deleteInSecureStore('uuidGuest');
    await deleteInSecureStore('uuidDevBoy');
    await deleteInSecureStore('timeStamp');
    await deleteInSecureStore('altPhone');
    await deleteInSecureStore('phone');
    await deleteInAsync('guestDetails');
    console.log('Calling clearAddressesInContext');
    clearAddressesInContext();
    navigation.navigate('LoginGuest');
  }

  return (
    // <View style={globalStyles.containerPrimary}>
    <View style={styles.mainContainer}>
      <NavBarGuest navigation={navigation} />
      <View style={styles.container}>

        <ChangePassword 
          visible={isChangePasswordVisible} 
          onClose={() => setIsChangePasswordVisible(false)}
          onPasswordChangeSuccess={handlePasswordChangeSuccess} 
        />

     <TouchableOpacity style={styles.button} onPress={handleContactUs}>
          <Text style={styles.buttonText}>Contact Us</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleTiming}>
          <Text style={styles.buttonText}>Timings</Text>
        </TouchableOpacity>
        
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
    backgroundColor: colors.darkBlue, // light gray background
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    // padding: 20,
  },
  button: {
    marginBottom: 5,
    padding: 16,
    backgroundColor: colors.pink, 
    // borderRadius: 10,
    alignItems: 'center',
    shadowColor: colors.darkGray,
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
