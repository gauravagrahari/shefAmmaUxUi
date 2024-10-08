import React, { useState, useContext } from 'react';
import { StyleSheet,Dimensions , Text, View, TextInput, TouchableOpacity,ScrollView } from 'react-native';
import axios from 'axios';
import {EnterDate} from '../commonMethods/EnterDate'; 
import { getFromSecureStore, storeInSecureStore } from '../Context/SensitiveDataStorage';
import config from '../Context/constants';
import { getFromAsync, storeInAsync } from '../Context/NonSensitiveDataStorage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {globalStyles,colors} from '../commonMethods/globalStyles';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { AddressContext } from '../Context/AddressContext';
import { BackHandler } from 'react-native';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

const URL = Constants.expoConfig.extra.apiUrl || config.URL;
export default function DetailsGuest() {
  const [alternateMobileNumber, setAlternateMobileNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('m');//by default let the gender be male, use m for male, f for female and t for trans
  const [street, setStreet] = useState('');
  const [houseName, setHouseName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [messageText, setMessageText] = useState('');
  const [officeStreet, setOfficeStreet] = useState('');
const [officeHouseName, setOfficeHouseName] = useState('');
const [officeCity, setOfficeCity] = useState('');
const [officeState, setOfficeState] = useState('');
const [officePinCode, setOfficePinCode] = useState('');
const [isSubmitting, setIsSubmitting] = useState(false);
const { updateAddressInContext, setDefaultAddressInContext } = useContext(AddressContext);

  // const [showDatePicker, setShowDatePicker] = useState(false);
  const navigation = useNavigation();
  // Inside DetailsGuest component
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        console.log('Back button pressed in HomeGuest');
        // Handle back action here, return true to override
        return true;
      };
  
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
  
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );
  const isValidPinCode = (pin) => {
    return /^\d{6}$/.test(pin); // Regular expression to check for exactly 6 digits
  };
  const isValidMobileNumber = (number) => {
    return /^\d{10}$/.test(number);
  };
  
  const validateForm = () => {
    if (!fullName || !dob || !gender || !street || !houseName || !city || !state || !isValidPinCode(pinCode) ||
        ((alternateMobileNumber.length > 0 && !isValidMobileNumber(alternateMobileNumber)))) {
      setMessageText("Please fill in all mandatory fields correctly before submitting.");
      return false;
    }
    return true;
  };
  const fetchExpoPushToken = async () => {
    if (!Device.isDevice) {
      alert('Must use physical device for push notifications');
      return;
    }
  
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
  
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
  
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("Expo Push Token:", token);
    return token;
  };

  const handleSubmission = async () => {
    if (!validateForm()) {
        return;
      }
      setIsSubmitting(true); 
      setMessageText("");
    try {
      const expoPushToken = await fetchExpoPushToken();
        const uuidGuest = await getFromSecureStore('uuidGuest');
        const phone = await getFromSecureStore('phone');
        console.log(uuidGuest);

        const token = await getFromSecureStore('token');  
        if (!token) {
            navigation.navigate('LoginGuest');
            return; 
          }
        const data = {
            uuidGuest: uuidGuest,
            geocode: '',
            name: fullName,
            dob: dob,
            phone,
            gender: gender,
            addressGuest: {
                street: street,
                houseName: houseName,
                city: city,
                state: state,
                pinCode: pinCode,
            },
            officeAddress: {
                street: officeStreet,
                houseName: officeHouseName,
                city: officeCity,
                state: officeState,
                pinCode: officePinCode,
            },
            alternateMobile: alternateMobileNumber,
            expoPushToken,
        };

        console.log(data);

        axios
            .post(`${URL}/guest`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, 
                },
            })
            .then(async (response) => {
                console.log('Server response:', response.data);
                await storeInAsync('guestDetails', response.data);  // Use response.data if it contains the updated details
                await storeInSecureStore('altPhone', alternateMobileNumber);
    
                // Retrieving data as a confirmation step (optional)
                const getData = await getFromAsync('guestDetails');  
                console.log('Retrieved data:', getData); 
                updateAddressInContext('primary', data.addressGuest);
                setDefaultAddressInContext('primary');

                const addressGuestFromResponse = response.data.addressGuest;
                await addAddressAgain(addressGuestFromResponse);
                navigation.navigate('WelcomeMessage');
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    } catch (error) {
        console.error('An error occurred:', error);  
    }
    finally {
        setIsSubmitting(false); // End submission regardless of the outcome
      }
   };
   const addAddressAgain = async (addressGuest) => {
    console.log("Re-adding addressGuest:", addressGuest);

    try {
      // Adding a small delay before storing to ensure sequence
      await new Promise(resolve => setTimeout(resolve, 300)); // 500 ms delay

      await storeInAsync('defaultAddress', addressGuest);
      console.log("Stored in AsyncStorage successfully.");

      updateAddressInContext('primary', addressGuest);
      console.log("Updated context with addressGuest successfully.");

      // Adding a small delay after storing and before proceeding
      await new Promise(resolve => setTimeout(resolve, 200)); // 500 ms delay
    } catch (error) {
      console.error("Error in addAddressAgain:", error);
    }
};

  const handleDateChange = (date) => {
   setDob(date);
  };

  const handleGenderChange = (value) => {
    setGender(value);
  };
  return (
    <LinearGradient colors={['white', colors.darkBlue]} style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Add the below details</Text>
            <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={24} color={colors.pink} />
                <MandatoryFieldIndicator />
                <TextInput
                    style={styles.input}
                    placeholder="Enter Full Name"
                    value={fullName}
                    onChangeText={setFullName}
                />
            </View>
            <View style={styles.inputContainer}>
  <Ionicons name="call-outline" size={24} color={colors.pink} />
  <TextInput
    style={styles.input}
    placeholder="Enter Alternate Mobile Number"
    value={alternateMobileNumber}
    onChangeText={setAlternateMobileNumber}
    keyboardType="phone-pad" // to bring up numeric keypad
  />
</View>
            <EnterDate onDateChange={handleDateChange} />

            <View style={styles.radioContainer}>
                <Text style={styles.radioLabel}>Gender:</Text>
                <TouchableOpacity
                    style={[styles.radioButton, gender === 'm' && styles.radioButtonSelected]}
                    onPress={() => handleGenderChange('m')}>
                    {gender === 'm' && <View style={styles.radioButtonInner} />}
                </TouchableOpacity>
                <Text style={styles.radioButtonLabel}>Male</Text>
                
                <TouchableOpacity
                    style={[styles.radioButton, gender === 'f' && styles.radioButtonSelected]}
                    onPress={() => handleGenderChange('f')}>
                    {gender === 'f' && <View style={styles.radioButtonInner} />}
                </TouchableOpacity>
                <Text style={styles.radioButtonLabel}>Female</Text>
                
                <TouchableOpacity
                    style={[styles.radioButton, gender === 't' && styles.radioButtonSelected]}
                    onPress={() => handleGenderChange('t')}>
                    {gender === 't' && <View style={styles.radioButtonInner} />}
                </TouchableOpacity>
                <Text style={styles.radioButtonLabel}>Others</Text>
            </View>

            <View style={styles.addressBox}>
                <Text style={styles.addressTitle}>Primary Address(Default Address)</Text>
                {renderAddressFields(street, setStreet, 'Street', houseName, setHouseName, city, setCity, state, setState, pinCode, setPinCode)}
            </View>
{/* 
            <View style={styles.addressBox}>
                <Text style={styles.addressTitle}>Secondary Address</Text>
                {renderAddressFields(officeStreet, setOfficeStreet, 'Office Street', officeHouseName, setOfficeHouseName, officeCity, setOfficeCity, officeState, setOfficeState, officePinCode, setOfficePinCode)}
            </View> */}
        {messageText.length > 0 && <Text style={styles.messageText}>{messageText}</Text>}

            <TouchableOpacity  disabled={isSubmitting} style={styles.button} onPress={handleSubmission}>
                <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
        </ScrollView>
    </LinearGradient>
);
function MandatoryFieldIndicator() {
    return (
        <Text style={{ color: 'red', fontSize: 18, marginHorizontal: 3,marginBottom:7, alignSelf: 'center' }}>*</Text>
        );
  }
  
  
function renderAddressFields(street, setStreet, streetPlaceholder, houseName, setHouseName, city, setCity, state, setState, pinCode, setPinCode) {
    return (
        <>
            <View style={styles.inputContainer}>
                <Ionicons name="map-outline" size={24} color={colors.pink} />
                <MandatoryFieldIndicator />
                <TextInput style={styles.input} placeholder={streetPlaceholder} value={street} onChangeText={setStreet} />
            </View>
            <View style={styles.inputContainer}>
                <Ionicons name="home-outline" size={24} color={colors.pink} />
                <MandatoryFieldIndicator />
                <TextInput style={styles.input} placeholder="House name and no." value={houseName} onChangeText={setHouseName} />
            </View>
            <View style={styles.inputContainer}>
                <Ionicons name="location-outline" size={24} color={colors.pink} />
                <MandatoryFieldIndicator />
                <TextInput style={styles.input} placeholder="City" value={city} onChangeText={setCity} />
            </View>
            <View style={styles.inputContainer}>
                <Ionicons name="location-outline" size={24} color={colors.pink} />
                <MandatoryFieldIndicator />
                <TextInput style={styles.input} placeholder="State" value={state} onChangeText={setState} />
            </View>
            <View style={styles.inputContainer}>
                <Ionicons name="location-outline" size={24} color={colors.pink} />
                <MandatoryFieldIndicator />
                <TextInput style={styles.input} placeholder="Pin Code" value={pinCode} onChangeText={setPinCode} />
            </View>
            {pinCode.length > 0 && !isValidPinCode(pinCode) && (
  <Text style={styles.messageText}>
    Please enter a valid 6-digit pin code.
  </Text>
)}
  {alternateMobileNumber.length > 0 && !isValidMobileNumber(alternateMobileNumber) && (
    <Text style={styles.errorMessage}>
      Please enter a valid 10-digit mobile number.
    </Text>
  )}
        </>
    );
}}
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

function responsiveFontSize(fontSize) {
  const standardScreenHeight = 680; // Adjust this based on your target devices
  return (fontSize * screenHeight) / standardScreenHeight;
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    heading: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.deepBlue,
      margin: 15,
      textAlign: 'center',
  },
  messageText:{
margin:5,
color:'red',
  },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
      borderBottomColor: colors.pink,
      borderBottomWidth: 2,
    },
    input: {
      flex: 1,
      height: 50,
      marginLeft: 10,
      color: colors.matBlack,
      fontSize: 16,
    },
    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        flexWrap: 'wrap',
    },
    radioLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginRight: 10,
        color: colors.deepBlue,
    },
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: colors.pink,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioButtonSelected: {
        backgroundColor: colors.pink,
    },
    radioButtonInner: {
        width: 10,
        height: 10,
        borderRadius: 6,
        backgroundColor: 'white',
    },
    radioButtonLabel: {
        fontSize: 14,
        marginRight: 15,
        color: colors.matBlack,
    },
    addressBox: {
        marginBottom: 20,
        padding: 15,
        borderRadius: 10,
        // backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    addressTitle: {
        fontSize: 17,
        fontWeight: '600',
        marginBottom: 15,
        color: colors.deepBlue,
    },
    button: {
        width: '100%',
        height: 55,
        marginTop: 10,
        marginBottom: 50,
        borderRadius: 10,
        borderColor: colors.pink,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 150, 136, 0.1)',
    },
    buttonText: {
        color: colors.matBlack,
        fontSize: 18,
    },
});