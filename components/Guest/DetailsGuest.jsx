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

const URL = config.URL;
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
  
  const validateForm = () => {
    if (!fullName || !dob || !gender || !street || !houseName || !city || !state || !pinCode || !alternateMobileNumber) {
      setMessageText("Please fill in all the fields before submitting.");
      return false;
    }
    return true;
  };
  const handleSubmission = async () => {
    if (!validateForm()) {
        return;
      }
      setIsSubmitting(true); 
      setMessageText("");
    try {
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

        };

        console.log(data);

        await storeInAsync('guestDetails', data);
        await storeInSecureStore('altPhone',alternateMobileNumber);

        // Retrieving data
        const getData = await getFromAsync('guestDetails');  // Typo here, it should be getFromSecureStore instead of getFromAsync
        console.log('Retrieved data:', getData);  // Updated the console message for clarity

        axios
            .post(`${URL}/guest`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, 
                },
            })
            .then((response) => {
                console.log('Server response:', response.data);
                updateAddressInContext('primary', data.addressGuest);
                setDefaultAddressInContext('primary');
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
        {messageText.length > 0 && <Text style={styles.messageText}>{messageText}</Text>}

            <TouchableOpacity  disabled={isSubmitting} style={styles.button} onPress={handleSubmission}>
                <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
        </ScrollView>
    </LinearGradient>
);

function renderAddressFields(street, setStreet, streetPlaceholder, houseName, setHouseName, city, setCity, state, setState, pinCode, setPinCode) {
    return (
        <>
            <View style={styles.inputContainer}>
                <Ionicons name="map-outline" size={24} color={colors.pink} />
                <TextInput style={styles.input} placeholder={streetPlaceholder} value={street} onChangeText={setStreet} />
            </View>
            <View style={styles.inputContainer}>
                <Ionicons name="home-outline" size={24} color={colors.pink} />
                <TextInput style={styles.input} placeholder="House name and no." value={houseName} onChangeText={setHouseName} />
            </View>
            <View style={styles.inputContainer}>
                <Ionicons name="location-outline" size={24} color={colors.pink} />
                <TextInput style={styles.input} placeholder="City" value={city} onChangeText={setCity} />
            </View>
            <View style={styles.inputContainer}>
                <Ionicons name="location-outline" size={24} color={colors.pink} />
                <TextInput style={styles.input} placeholder="State" value={state} onChangeText={setState} />
            </View>
            <View style={styles.inputContainer}>
                <Ionicons name="location-outline" size={24} color={colors.pink} />
                <TextInput style={styles.input} placeholder="Pin Code" value={pinCode} onChangeText={setPinCode} />
            </View>
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