import React, { useState, useEffect, useContext } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, Dimensions
} from 'react-native';
import axios from 'axios';
import config from '../Context/constants';
import { useNavigation } from '@react-navigation/native'; // If you're using React Navigation
import { StyleSheet } from 'react-native';
import { getFromSecureStore, storeInSecureStore } from '../Context/SensitiveDataStorage';
import MessageCard from '../commonMethods/MessageCard';
import CustomRadioButton from '../commonMethods/CustomRadioButton';
import NavBarGuest from '../GuestSubComponent/NavBarGuest';
import {globalStyles,colors} from '../commonMethods/globalStyles';
import Loader from '../commonMethods/Loader';
import { getFromAsync, storeInAsync } from '../Context/NonSensitiveDataStorage';
import { RadioButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { AddressContext } from '../Context/AddressContext';

const URL = config.URL;
export default function UpdateGuestDetails() {
  const { updateAddressInContext, setDefaultAddressInContext } = useContext(AddressContext);

  const [isLoading, setIsLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState('primary');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('m');
  const [street, setStreet] = useState('');
  const [houseName, setHouseName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [officeStreet, setOfficeStreet] = useState('');
  const [officeHouseName, setOfficeHouseName] = useState('');
  const [officeCity, setOfficeCity] = useState('');
  const [officeState, setOfficeState] = useState('');
  const [officePinCode, setOfficePinCode] = useState('');
  const [firstTime, setFirstTime] = useState(false);
  const [messageCardVisible, setMessageCardVisible] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [initialData, setInitialData] = useState({});
  const [alternateMobile, setAlternateMobile] = useState('');
  const [geocode, setGeocode] = useState('');

  const navigation = useNavigation();

  const extractRelevantDetails = (data) => ({
    name: data.name,
    phone:data.phone,
    geocode:data.geocode,
    alternateMobile: data.alternateMobile,
    addressGuest: {
      street: data.addressGuest.street,
      houseName: data.addressGuest.houseName,
      city: data.addressGuest.city,
      state: data.addressGuest.state,
      pinCode: data.addressGuest.pinCode,
    },
    officeAddress: {
      street: data.officeAddress.street,
      houseName: data.officeAddress.houseName,
      city: data.officeAddress.city,
      state: data.officeAddress.state,
      pinCode: data.officeAddress.pinCode,
    }
  });
  useEffect(() => {
    const setDefaultAddress = async () => {
      const defaultAddress = await getFromAsync('defaultAddress');
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
      } else {
        setSelectedAddress('primary');
        await storeInAsync('defaultAddress', 'primary');
      }
    }
    
    setDefaultAddress();
  }, []);

  useEffect(() => {
    const fetchDefaultAddress = async () => {
        const defaultAddress = await getFromAsync('defaultAddress');
        if (defaultAddress) {
            setSelectedAddress(defaultAddress);
        } else {
            await storeInAsync('defaultAddress', 'primary');
            setSelectedAddress('primary');
            setMessageText("You have not added or updated your address. Please update it.");
            setMessageCardVisible(true);
        }
    };

    fetchDefaultAddress();
}, []);

const handleRadioChange = async (value) => {
  setSelectedAddress(value);
  console.log("UpdateGuestDetails: Radio button selected", value);

  let updatedAddress = {}; // Initialize an empty object

  if (value === 'primary') {
      updatedAddress = {
          street: street || '',
          houseName: houseName || '',
          city: city || '',
          state: state || '',
          pinCode: pinCode || ''
      };
      setMessageText("Refresh the Home Screen to find meals near this Default Address!");
      setMessageCardVisible(true);
      // Update context
      updateAddressInContext('primary', updatedAddress);
  } else if (value === 'office') {
      updatedAddress = {
          street: officeStreet || '',
          houseName: officeHouseName || '',
          city: officeCity || '',
          state: officeState || '',
          pinCode: officePinCode || ''
      };
      setMessageText("Refresh the Home Screen to find meals near this Default Address!");
      setMessageCardVisible(true);
      // Update context
      updateAddressInContext('secondary', updatedAddress);
  }

  console.log("UpdateGuestDetails: Updating context with", value, updatedAddress);
  updateAddressInContext(value === 'primary' ? 'primary' : 'secondary', updatedAddress);
  setDefaultAddressInContext(value);

  // Store in Async Storage (if needed)
  await storeInAsync('defaultAddress', updatedAddress);
};

  useEffect(() => {
    const fetchGuestDetails = async () => {
      setIsLoading(true);
      try {
        let guestData;
        const cachedGuestDetails = await getFromAsync('guestDetails');
        const cachedAltPhone = await getFromSecureStore('altPhone');
  
        if (cachedGuestDetails  && cachedAltPhone) {
          // Since the data is already an object, there's no need to parse it
          guestData = cachedGuestDetails;
        } else {
          // If not present in cache, make a server request
          const storedUuidGuest = await getFromSecureStore('uuidGuest');
          const token = await getFromSecureStore('token');
          const responseConfig = {
            headers: {
              uuidGuest: storedUuidGuest,
              Authorization: `Bearer ${token}`,
            },
          };
          const response = await axios.get(`${URL}/guest/getGuestUsingPk`, responseConfig);
          guestData = response.data;

          // Update the cache with new data
          await storeInAsync('guestDetails', guestData); // Make sure this is storing an object, not a string
          await storeInSecureStore('altPhone', guestData.alternateMobile);
        }
        // Set states with guestData
        setInitialData(extractRelevantDetails(guestData));
        setAlternateMobile(cachedAltPhone || guestData.alternateMobile || '');
        setFullName(guestData.name || '');
        setGeocode(guestData.geocode || guestData.geocode);
        setPhone(guestData.phone || '');
        setGender(guestData.gender || '');
        setStreet(guestData.addressGuest?.street || '');
        setHouseName(guestData.addressGuest?.houseName || '');
        setCity(guestData.addressGuest?.city || '');
        setState(guestData.addressGuest?.state || '');
        setPinCode(guestData.addressGuest?.pinCode || '');
        setOfficeStreet(guestData.officeAddress?.street || '');
        setOfficeHouseName(guestData.officeAddress?.houseName || '');
        setOfficeCity(guestData.officeAddress?.city || '');
        setOfficeState(guestData.officeAddress?.state || '');
        setOfficePinCode(guestData.officeAddress?.pinCode || '');
        
      } catch (error) {
        console.error("Failed to fetch guest details:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchGuestDetails();
  }, []);
  

  const handleUpdate = async () => {
    const currentData = extractRelevantDetails({
      name: fullName,
      phone,
      geocode,
      alternateMobile: alternateMobile, 
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
      }
    });

    if (JSON.stringify(currentData) === JSON.stringify(initialData)) {
      setMessageText("No changes detected. Skipping update.");
      setMessageCardVisible(true);
      return;
    }
    try {
      const token = await getFromSecureStore('token');
      const guestEntity = {
        uuidGuest: await getFromSecureStore('uuidGuest'),
        ...currentData,
        alternateMobile: alternateMobile,
      };

      await axios.put(`${URL}/guest/updateDetails`, guestEntity, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      await storeInAsync('guestDetails', guestEntity);
      await storeInSecureStore("altPhone", alternateMobile);

      let updatedAddress = {};
      if (selectedAddress === 'primary') {
          updatedAddress = {
              street: street,
              houseName: houseName,
              city: city,
              state: state,
              pinCode: pinCode
          };
      } else if (selectedAddress === 'office') {
          updatedAddress = {
              street: officeStreet,
              houseName: officeHouseName,
              city: officeCity,
              state: officeState,
              pinCode: officePinCode
          };
      }

      // Update the default address in cache.
      await storeInAsync('defaultAddress', updatedAddress);
      setMessageText('Details updated successfully!');
      setMessageCardVisible(true);

      console.log('Updating context with:', selectedAddress, updatedAddress);
      updateAddressInContext(selectedAddress, updatedAddress); // updatedAddress is the full address object
      setDefaultAddressInContext(selectedAddress); // selectedAddress should be 'primary' or 'secondary'
      
    } catch (error) {
        console.error("Failed to update guest details:", error);
        setMessageText('Failed to update details. Please try again later.');
        setMessageCardVisible(true);
    }
  };

  return (
    isLoading ? 
      <Loader /> : 
      <LinearGradient colors={[ colors.darkBlue,'#fcfddd']}  style={styles.mainContainer}>
        <NavBarGuest navigation={navigation} />
        <ScrollView >
        {/* <LinearGradient colors={['white', colors.darkBlue]} style={styles.container}> */}

          <View style={globalStyles.displayTextContainer}>
            <Text style={globalStyles.displayText}>
              {fullName.split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1).toLowerCase()).join(' ')}
            </Text>
          </View>
          {/* <View style={globalStyles.displayTextContainer}>
            <Text style={globalStyles.displayText}>
             {phone}
            </Text>
          </View> */}

          <View style={styles.addressContainer}>
          <Text style={globalStyles.textPrimary}>Alternate Mobile Number</Text>
          <TextInput 
  style={globalStyles.input}
  placeholder="Alternate Phone Number" 
  value={alternateMobile} 
  onChangeText={setAlternateMobile} 
  keyboardType="phone-pad"/>
</View>
          <Text style={styles.infoText}>Choose or update your delivery Address (By default it woud be delivered to the primary address)</Text>
          <View style={styles.addressContainer}>
            <View style={styles.radioPair}>
            <TouchableOpacity
    style={[styles.radioButton, selectedAddress === 'primary' && styles.radioButtonSelected]}
    onPress={() => handleRadioChange('primary')}
>   
    {selectedAddress === 'primary' && <View style={styles.radioButtonInner} />}
</TouchableOpacity>
<Text style={globalStyles.textPrimary}>Primary Address</Text>
            </View>
            <TextInput 
              style={globalStyles.input}
              placeholder="Street" 
              value={street} 
              onChangeText={setStreet} 
            />
            <TextInput 
              style={globalStyles.input}
              placeholder="House name and no." 
              value={houseName} 
              onChangeText={setHouseName} 
            />
            <TextInput 
              style={globalStyles.input}
              placeholder="City" 
              value={city} 
              onChangeText={setCity} 
            />
            <TextInput 
              style={globalStyles.input}
              placeholder="State" 
              value={state} 
              onChangeText={setState} 
            />
            <TextInput 
              style={globalStyles.input}
              placeholder="Pin Code" 
              value={pinCode} 
              onChangeText={setPinCode} 
            />
          </View>
  
          <View style={styles.addressContainer}>
          <View style={styles.radioPair}>
          <TouchableOpacity
    style={[styles.radioButton, selectedAddress === 'office' && styles.radioButtonSelected]}
    onPress={() => handleRadioChange('office')}
>
    {selectedAddress === 'office' && <View style={styles.radioButtonInner} />}
</TouchableOpacity>
<Text style={globalStyles.textPrimary}>Secondary Address</Text>
          </View>
          <TextInput 
            style={globalStyles.input}
            placeholder="Office Street" 
            value={officeStreet} 
            onChangeText={setOfficeStreet} 
          />
          <TextInput 
            style={globalStyles.input}
            placeholder="Office House name and no." 
            value={officeHouseName} 
            onChangeText={setOfficeHouseName} 
          />
          <TextInput 
            style={globalStyles.input}
            placeholder="Office City" 
            value={officeCity} 
            onChangeText={setOfficeCity} 
          />
          <TextInput 
            style={globalStyles.input}
            placeholder="Office State" 
            value={officeState} 
            onChangeText={setOfficeState} 
          />
          <TextInput 
            style={globalStyles.input}
            placeholder="Office Pin Code" 
            value={officePinCode} 
            onChangeText={setOfficePinCode} 
          />
          <MessageCard 
            message={messageText} 
            isVisible={messageCardVisible} 
            style={styles.messageCardFixed}
            onClose={() => setMessageCardVisible(false)} 
          />
          <MessageCard 
          message={messageText} 
          style={styles.messageCardFixed}
          isVisible={messageCardVisible || firstTime}  // Updated this line
          onClose={() => {
          setMessageCardVisible(false);
          setFirstTime(false);  // This line is added to set firstTime to false when the card is closed.
  }} 
/>
          </View>
          <View style={globalStyles.centralisingContainer}>
            <TouchableOpacity style={styles.button} onPress={handleUpdate}>
              <Text style={styles.buttonText}>Update Details</Text>
            </TouchableOpacity>
          </View>
          {/* </LinearGradient> */}
        </ScrollView>
      </LinearGradient>
  );

}
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 10,
    // backgroundColor: '#f8f8f8',
  },
  button: {
    width: '80%',
    height: 55,
    marginTop: 20,
    marginBottom: 30,
    borderRadius: 10,
    borderColor: colors.pink,
    borderWidth: 2,
    backgroundColor: 'rgba(0, 150, 136, 0.15)', // 80% opacity of #009688
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: colors.deepBlue,
    fontSize: 18,
    fontWeight: 'bold',
  },
  messageCardFixed: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    zIndex: 1000 // Ensure it's above other elements
  },
  addressContainer: {
    // backgroundColor: colors.darkBlue,
    padding: 10,
    borderRadius: 8,
    marginBottom: 5,
    marginTop: 10,
    paddingHorizontal: 20,
  },
  addressTitle: {
    color: colors.primaryText,
    fontSize: screenWidth * 0.047,
    marginBottom: 5,
    paddingLeft: 40,
  },
  infoText:{
    // color: colors.primaryText,
    color: colors.deepBlue,
    fontSize: screenWidth * 0.038,
    marginTop: 5,
    padding: 15,
  },
  activeAddressHint: {
    fontSize: 13,
    color: colors.deepBlue, // or any color you prefer
    marginLeft: 5,
    marginRight: 5,
  },
  // Styles for the custom radio button:
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  radioPair: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 10,
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
    backgroundColor: colors.darkBlue,
},

  radioLabel: {
    marginLeft: 5,
    fontSize: 16,
  },
});

