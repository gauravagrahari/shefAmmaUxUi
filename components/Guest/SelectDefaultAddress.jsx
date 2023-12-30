import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions,Animated  } from 'react-native';
import { globalStyles, colors } from '../commonMethods/globalStyles';
import { getFromAsync, storeInAsync } from '../Context/NonSensitiveDataStorage';
import { useNavigation } from '@react-navigation/native';
import { AddressContext } from '../Context/AddressContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function SelectDefaultAddress() {
  const navigation = useNavigation();
  const [selectedAddress, setSelectedAddress] = useState('primary');
  const [guestDetails, setGuestDetails] = useState({});
  const { updateAddressInContext, setDefaultAddressInContext } = useContext(AddressContext);
  const [progress, setProgress] = useState(new Animated.Value(0));

  useEffect(() => {
    const fetchGuestDetails = async () => {
      const details = await getFromAsync('guestDetails');
      
      if (!details || Object.keys(details).length === 0) {
        // If guestDetails is empty or undefined, navigate to DetailsGuest
        navigation.navigate('DetailsGuest');
      } else {
        console.log('New guest details fetched:', details);
        setGuestDetails(details);
        const defaultAddress = await getFromAsync('defaultAddress');
        setSelectedAddress(defaultAddress || 'primary');
        updateAddressInContext('primary', details.addressGuest);
        updateAddressInContext('secondary', details.officeAddress);
        setDefaultAddressInContext(defaultAddress || 'primary');
      }
    };
    fetchGuestDetails();
  }, []);

  useEffect(() => {
    if (guestDetails && isAddressEmpty(guestDetails.officeAddress)) {
      Animated.timing(progress, {
        toValue: 100,
        duration: 2000,
        useNativeDriver: false,
      }).start();
  
      const timer = setTimeout(() => {
        navigation.navigate('HomeGuest');
      }, 4000);
  
      return () => clearTimeout(timer);
    }
  }, [guestDetails, navigation, progress]);
  
  const isAddressEmpty = (address) => !(address && address.street && address.city);

  const handleRadioChange = async (value) => {
    console.log("Selected address type:", value);

    setSelectedAddress(value);
    let addressToStore = value === 'primary' ? guestDetails.addressGuest : guestDetails.officeAddress;
    console.log("Address to store:", addressToStore);

    try {
      await storeInAsync('defaultAddress', addressToStore);
      console.log("Stored in async storage successfully.");

      // Assuming updateAddressInContext also updates the database
      updateAddressInContext(value, addressToStore);
      console.log("Updated context and potentially the database successfully.");
    } catch (error) {
      console.error("Error in handleRadioChange:", error);
    }
  };

  const handleClose = () => navigation.navigate('HomeGuest');

  return (
    <LinearGradient colors={['white', colors.darkBlue]} style={styles.modalContainer}>
        {isAddressEmpty(guestDetails.officeAddress) && (
      <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
        <Text style={styles.closeButtonText}>X</Text>
      </TouchableOpacity>)}
      {!isAddressEmpty(guestDetails.officeAddress) && (
      <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
        <Text style={styles.closeButtonText}>Proceed</Text>
      </TouchableOpacity>)}
      {!isAddressEmpty(guestDetails.officeAddress) && (
      <Text style={globalStyles.headerText}>Choose Address</Text>
      )}
      {isAddressEmpty(guestDetails.officeAddress) && (
        <Text style={globalStyles.headerText}>Your food will be delivered at...</Text>
        
      )}
      <TouchableOpacity onPress={() => handleRadioChange('primary')}>
        <View style={[styles.radioButton, selectedAddress === 'primary' && styles.radioButtonSelected]}>
          <View style={[styles.radioButtonInner, selectedAddress === 'primary' && { backgroundColor: 'white' }]} />
          <Text style={styles.radioText}>
            {`${guestDetails.addressGuest?.street}, ${guestDetails.addressGuest?.houseName}, ${guestDetails.addressGuest?.city} - ${guestDetails.addressGuest?.pinCode}`}
          </Text>
        </View>
      </TouchableOpacity>
      {!isAddressEmpty(guestDetails.officeAddress) && (
        <TouchableOpacity onPress={() => handleRadioChange('office')}>
          <View style={[styles.radioButton, selectedAddress === 'office' && styles.radioButtonSelected]}>
            <View style={[styles.radioButtonInner, selectedAddress === 'office' && { backgroundColor: 'white' }]} />
            <Text style={styles.radioText}>
              {`${guestDetails.officeAddress?.street}, ${guestDetails.officeAddress?.houseName}, ${guestDetails.officeAddress?.city} - ${guestDetails.officeAddress?.pinCode}`}
            </Text>
          </View>
        </TouchableOpacity>
      )}
       {isAddressEmpty(guestDetails.officeAddress) && (
        <Animated.View style={[styles.progressBar, { width: progress.interpolate({
          inputRange: [0, 100],
          outputRange: ['0%', '100%'],
        }) }]} />
      )}
    </LinearGradient>
  );
      }  
  const screenWidth = Dimensions.get('window').width;
  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center', // Center the content vertically
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    closeButton: {
      position: 'absolute', // Positioning the close button at the top-right
      top: 15,
      right: 15,
    },
    closeButtonText: {
      fontSize: 20,
      color: colors.deepBlue,
    },
    radioButton: {
      margin:10,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
      width: screenWidth - 40, // Ensuring the width doesn't exceed the screen width
      padding: 10,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: colors.pink,
    },
    radioButtonSelected: {
      backgroundColor: colors.lightBlue,
    },
    radioButtonInner: {
      width: 15,
      height: 15,
      borderRadius: 10,
      // backgroundColor: 'white',
    },
    radioText: {
      margin:8,
      fontSize: 16,
      color: colors.darkText,
      flexShrink: 1, // Allows the text to shrink and wrap if necessary
    },
    progressBar: {
      height: 5,
      backgroundColor: colors.pink,
      marginTop: 10,
      // borderRadius:5,
    },
  });
  