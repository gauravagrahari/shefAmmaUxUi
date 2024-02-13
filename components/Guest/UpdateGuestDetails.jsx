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
import NavBarGuest from '../GuestSubComponent/NavBarGuest';
import {globalStyles,colors} from '../commonMethods/globalStyles';
import Loader from '../commonMethods/Loader';
import { getFromAsync, storeInAsync } from '../Context/NonSensitiveDataStorage';
import { LinearGradient } from 'expo-linear-gradient';
import { AddressContext } from '../Context/AddressContext';
import Constants from 'expo-constants';
const URL = Constants.expoConfig.extra.apiUrl || config.URL;
export default function UpdateGuestDetails() {

  const [isLoading, setIsLoading] = useState(true);
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
  const [showSecondaryAddressForm, setShowSecondaryAddressForm] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('primary');
  const [showAlternateMobileInput, setShowAlternateMobileInput] = useState(false);
  const { addresses,updateAddressInContext, setDefaultAddressInContext } = useContext(AddressContext);

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
    // On component mount, check if secondary address is empty
    setShowSecondaryAddressForm(addresses.default === 'office');
  }, [addresses.default]);
  const handleAddSecondaryAddress = () => {
    setShowSecondaryAddressForm(true);
  };
  const shouldDisplayRadioButtons = () => {
    return !isOfficeAddressEmpty();
  };
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
    console.log('Initial selectedAddress:', selectedAddress);

    const fetchDefaultAddress = async () => {
        const defaultAddress = await getFromAsync('defaultAddress');

        const fetchedAddress = 'primary'; // Replace this with your actual fetching logic
      setSelectedAddress(fetchedAddress);
      console.log('Fetched and set selectedAddress:', fetchedAddress);
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
const handleAddAlternateNumber = () => {
  setShowAlternateMobileInput(true);
};

const handleRadioChange = async (value) => {
  setSelectedAddress(value);
  console.log('Radio button selected:', value);

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
      setMessageText("Fetching meals and cooks at this location");
      setMessageCardVisible(true);
      // Update context
      updateAddressInContext('primary', updatedAddress);
  }   if (value === 'office' && isOfficeAddressEmpty()) {
    // If office address is empty, do not set it as default and prompt user
    setMessageText("Please add Address 2 before selecting it as default.");
    setMessageCardVisible(true);
    return;
  }else if (value === 'office' ) {
      updatedAddress = {
          street: officeStreet || '',
          houseName: officeHouseName || '',
          city: officeCity || '',
          state: officeState || '',
          pinCode: officePinCode || ''
      };
      setMessageText("Fetching meals and cooks at this location!");
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
const isOfficeAddressEmpty = () => {
  return !officeStreet && !officeHouseName && !officeCity && !officeState && !officePinCode;
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
  const isOfficeAddressCompleteOrEmpty = () => {
    const fields = [officeStreet, officeHouseName, officeCity, officeState, officePinCode];
    const allEmpty = fields.every(field => field === '');
    const allFilled = fields.every(field => field !== '');
  
    return allEmpty || allFilled;
  };
  const isPrimaryAddressComplete = () => {
    const fields = [street, houseName, city, state, pinCode];
    return fields.every(field => field !== '');
  };
  
  const validateOfficeAddress = () => {
    console.log("Validating office address...", { officeStreet, officeHouseName, officeCity, officeState, officePinCode });
    if (!officeStreet || !officeHouseName || !officeCity || !officeState || !officePinCode) {
      setMessageText("Please fill in all fields of the secondary address before updating.");
      setMessageCardVisible(true);
      return false; // Indicates validation failed
    }
    return true; // Indicates validation passed
  };
  
  const handleUpdate = async () => {
    console.log("Starting update process...");
    // if (!isOfficeAddressCompleteOrEmpty()) {
    //   setMessageText("Please add all the Fields of Address 2");
    //   setMessageCardVisible(true);
    //   return;
    // }
    // if (!isPrimaryAddressComplete()) {
    //   setMessageText("Please add all the Fields of Address 1");
    //   setMessageCardVisible(true);
    //   return;
    // }
    if (!isPrimaryAddressComplete() || !isValidPinCode(pinCode)) {
      setMessageText("Please fill all fields of the Address 1 and ensure the Pin code is valid.");
      setMessageCardVisible(true);
      return;
    }
    
    // Validate office address and its pin code, if office address is provided
    if (showSecondaryAddressForm && (!isOfficeAddressCompleteOrEmpty() || !isValidPinCode(officePinCode))) {
      setMessageText("Please add all the Fields of Address 2 and ensure the Pin code is valid.");
      setMessageCardVisible(true);
      return;
    }
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
    console.log("Current data:", currentData);
    console.log("Initial data:", initialData);
    if (JSON.stringify(currentData) === JSON.stringify(initialData)) {
      setMessageText("No changes detected. Skipping update.");
      setMessageCardVisible(true);
      console.log("No changes detected.");
      return;
    }
  
    console.log("Selected address:", selectedAddress);
    console.log("Show secondary address form:", showSecondaryAddressForm);
  
    if (selectedAddress === 'office' && showSecondaryAddressForm && !validateOfficeAddress()) {
      console.log("Validation failed for office address.");
      return; // Stop the update process if validation fails
    }
    try {
      const token = await getFromSecureStore('token');
      const guestEntity = {
        uuidGuest: await getFromSecureStore('uuidGuest'),
        ...currentData,
        alternateMobile: alternateMobile,
      };
      if (!token) {
        navigation.navigate('LoginGuest');
        return; 
      }
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
      }  
     
      else if (selectedAddress === 'office') {
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
      await storeInAsync('guestDetails', guestEntity);

      console.log('Updating context with:', selectedAddress, updatedAddress);
      updateAddressInContext(selectedAddress, updatedAddress); // updatedAddress is the full address object
      setDefaultAddressInContext(selectedAddress); // selectedAddress should be 'primary' or 'secondary'
      
    } catch (error) {
      console.error("Failed to update guest details:", error);
      setMessageText('Failed to update details. Please try again later.');
      setMessageCardVisible(true);
      console.error('Update failed:', error);
    }
  };
  const isValidPinCode = (pin) => {
    return /^\d{6}$/.test(pin); // Regular expression to check for exactly 6 digits
  };
  
  return (
    isLoading ? 
      <Loader /> : 
      <LinearGradient colors={[ colors.darkBlue,colors.secondCardColor]}  style={styles.mainContainer}>
        <NavBarGuest navigation={navigation} />
        <ScrollView >
        {/* <LinearGradient colors={['white', colors.darkBlue]} style={styles.container}> */}

          <View style={globalStyles.displayTextContainer}>
            <Text style={globalStyles.displayText}>
              {fullName.split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1).toLowerCase()).join(' ')}
            </Text>
          </View>
          <View style={globalStyles.displayTextContainer}>
            <Text style={globalStyles.displayText}>
             {phone}
            </Text>
          </View>

          <View style={styles.addressContainer}>
      {showAlternateMobileInput || alternateMobile ? (
        <>
          <Text style={globalStyles.textPrimary}>Alternate Mobile Number</Text>
          <TextInput 
            style={globalStyles.input}
            placeholder="Alternate Phone Number" 
            value={alternateMobile} 
            onChangeText={setAlternateMobile} 
            keyboardType="phone-pad"
          />
        </>
      ) : (
        <TouchableOpacity onPress={handleAddAlternateNumber} style={styles.linkText}>
          <Text style={[globalStyles.textPrimary, styles.addAlternateNumberText]}>
            Click to add an alternate number
          </Text>
        </TouchableOpacity>
      )}
    </View>

          <Text style={styles.infoText}>Please Select or update your delivery Address here! (Tap on the empty circle beside your Address to select it.)</Text>
          <View style={styles.addressContainer}>

            <View style={styles.radioPair}>         
 <TouchableOpacity
 style={[
   styles.radioButton, 
   addresses.default === 'primary' ? styles.radioButtonSelected : {}
 ]}
 onPress={() => handleRadioChange('primary')}
>
 {addresses.default === 'primary' && (
   <View style={styles.radioButtonInner} />
 )}
</TouchableOpacity>


<Text style={globalStyles.textPrimary}>Address 1(Primary)</Text>
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
          {!showSecondaryAddressForm && (
        <View style={globalStyles.centralisingContainer}>
        <TouchableOpacity style={styles.linkText}
                onPress={handleAddSecondaryAddress}>
                <Text style={styles.isOfficeAddressEmpty}>Select or Add Second Address</Text>
              </TouchableOpacity>
            </View>
          )}
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
           {showSecondaryAddressForm && (
          <View style={styles.addressContainer}>
          <View style={styles.radioPair}>
          {shouldDisplayRadioButtons() && (
  <TouchableOpacity
  style={[
    styles.radioButton, 
    addresses.default === 'office' ? styles.radioButtonSelected : {}
  ]}
  onPress={() => handleRadioChange('office')}
>
  {addresses.default === 'office' && (
    <View style={styles.radioButtonInner} />
  )}
</TouchableOpacity>)}
<Text style={globalStyles.textPrimary}>Address 2</Text>
          </View>
          <TextInput 
            style={globalStyles.input}
            placeholder="Street" 
            value={officeStreet} 
            onChangeText={setOfficeStreet} 
          />
          <TextInput 
            style={globalStyles.input}
            placeholder="House name and no." 
            value={officeHouseName} 
            onChangeText={setOfficeHouseName} 
          />
          <TextInput 
            style={globalStyles.input}
            placeholder="City" 
            value={officeCity} 
            onChangeText={setOfficeCity} 
          />
          <TextInput 
            style={globalStyles.input}
            placeholder="State" 
            value={officeState} 
            onChangeText={setOfficeState} 
          />
          <TextInput 
            style={globalStyles.input}
            placeholder="Pin Code" 
            value={officePinCode} 
            onChangeText={setOfficePinCode} 
          />
         
          </View>)}
          {!isOfficeAddressCompleteOrEmpty() && (
      <Text style={styles.errorMessage}>
        While adding the Address 2, fill all the fields!
      </Text>
    )}
     {!isPrimaryAddressComplete() && (
    <Text style={styles.errorMessage}>
      Please fill all fields of the Address 1.
    </Text>
  )}
  {!isValidPinCode(pinCode) && pinCode.length > 0 && (
  <Text style={styles.errorMessage}>
    Please enter a valid 6-digit pin code.
  </Text>
)}
 {!isValidPinCode(officePinCode) && pinCode.length > 0 && pinCode.length !== 6 && (
  <Text style={styles.errorMessage}>
    Please enter a valid 6-digit pin code.
  </Text>
)}

          <View style={globalStyles.centralisingContainer}>
            <TouchableOpacity style={styles.button} onPress={handleUpdate}>
              <Text style={styles.buttonText}>Update Details</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
  );

}
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

function responsiveFontSize(fontSize) {
  const standardScreenHeight = 680; // Adjust based on your target devices
  return (fontSize * screenHeight) / standardScreenHeight;
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 10,
    // backgroundColor: '#f8f8f8',
  },
  errorMessage: {
    color: 'red',
    fontSize: responsiveFontSize(14),
    textAlign: 'center',
    margin: 10,
  },
  addAlternateNumberText: {
    marginHorizontal:20, // Example padding for better touchability


  },
  button: {
    width: '80%',
    height: screenHeight * 0.07, // 8% of screen height
    marginTop: 30,
    marginBottom: 50,
    borderRadius: 10,
    borderColor: colors.pink,
    borderWidth: 2,
    backgroundColor: 'rgba(0, 150, 136, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: colors.deepBlue,
    fontSize: responsiveFontSize(15),
    fontWeight: 'bold',
  },
  messageCardFixed: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  addressContainer: {
    padding: 10,
    borderRadius: 8,
    // marginBottom: 5,
    marginTop: 10,
    paddingHorizontal: 20,
  },
  linkText:{
borderBottomWidth:1,
borderBottomColor: colors.pink,
margin:20,
  },
  isOfficeAddressEmpty: {
    fontSize: responsiveFontSize(14),
    color: colors.pink,
  },
  addressTitle: {
    color: colors.primaryText,
    fontSize: responsiveFontSize(screenWidth * 0.047),
    marginBottom: 5,
    paddingLeft: 40,
  },
  infoText: {
    color: colors.deepBlue,
    fontSize: responsiveFontSize(screenWidth * 0.035),
    paddingTop:5,
    // marginTop: 5,
    padding: 15,
  
  },
  activeAddressHint: {
    fontSize: responsiveFontSize(14),
    color: colors.deepBlue,
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
    width: screenWidth * 0.05, // 5% of screen width
    height: screenWidth * 0.05, // 5% of screen width
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
    width: screenWidth * 0.025, // 2.5% of screen width
    height: screenWidth * 0.025, // 2.5% of screen width
    borderRadius: 6,
    backgroundColor: colors.darkBlue,
  },

  radioLabel: {
    marginLeft: 5,
    fontSize: responsiveFontSize(15),
  },
});

