import React, { useContext, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ChangePassword from '../commonMethods/ChangePassword';
import {
  storeInSecureStore,
  getFromSecureStore,
  deleteInSecureStore,
  updateInSecureStore
} from '../Context/SensitiveDataStorage';
import NavBarGuest from '../GuestSubComponent/NavBarGuest';
import {globalStyles,colors} from '../commonMethods/globalStyles';
import {
  storeInAsync,
  getFromAsync,
  updateInAsync,
  deleteInAsync
} from '../Context/NonSensitiveDataStorage';
import { AddressContext } from '../Context/AddressContext';
import HostContext, { useHostContext } from '../Context/HostContext';

const initialState = { primary: null, secondary: null, default: 'primary' };

export default function SettingsGuest() {
  const { resetHostContext } = useContext(HostContext);
  const navigation = useNavigation();
  const [isChangePasswordVisible, setIsChangePasswordVisible] = useState(false);
  const { addresses, clearAddressesInContext,setAddresses } = useContext(AddressContext); // Corrected method name and added addresses

  const handlePasswordChangeSuccess = () => {
    setIsChangePasswordVisible(false);
  };
  const handleContactUs=()=>{
    navigation.navigate('ContactPage');
  }
  const handleAboutUs=()=>{
    navigation.navigate('AboutUs');
  }
  const handlePolicy=()=>{
    navigation.navigate('CancellationPolicy');
  }
  const handleTiming=()=>{
    navigation.navigate('ChargesDisplay');
  }
  
  const handleServiceAvailability=()=>{
    navigation.navigate('ServiceAvailability');
  }
  
  const handleLogout = async () => {
    // Log data from SecureStore before deletion
    const secureStoreKeys = ['token', 'defaultAddress', 'uuidGuest', 'uuidDevBoy', 'timeStamp', 'altPhone', 'phone'];
    for (const key of secureStoreKeys) {
      const valueBefore = await getFromSecureStore(key);
      console.log(`Before logout, ${key} in SecureStore:`, valueBefore);
    }
  
    // Log data from AsyncStorage before deletion
    const asyncStoreKeys = ['guestDetails', 'addresses']; // Add other keys as necessary
    for (const key of asyncStoreKeys) {
      const valueBefore = await getFromAsync(key);
      console.log(`Before logout, ${key} in AsyncStorage:`, valueBefore);
    }
  
    // Perform deletion in SecureStore
    for (const key of secureStoreKeys) {
      await deleteInSecureStore(key);
      const valueAfter = await getFromSecureStore(key);
      console.log(`After logout, ${key} should be null, actual value:`, valueAfter);
    }
  
    // Perform deletion in AsyncStorage
    for (const key of asyncStoreKeys) {
      await deleteInAsync(key);
      const valueAfter = await getFromAsync(key);
      console.log(`After logout, ${key} should be null, actual value:`, valueAfter);
    }
      resetHostContext();
      clearAddressesInContext(); // Uncomment or modify according to your actual implementation
    console.log('All specified user data cleared from storage and context.');
  
    navigation.reset({
      index: 0,
      routes: [{ name: 'LoginGuest' }],
    });
  };
  
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
        <TouchableOpacity style={styles.button} onPress={handleAboutUs}>
          <Text style={styles.buttonText}>About Us</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handlePolicy}>
          <Text style={styles.buttonText}>Policy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleTiming}>
          <Text style={styles.buttonText}>Timings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleServiceAvailability}>
          <Text style={styles.buttonText}>Service Availability</Text>
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
