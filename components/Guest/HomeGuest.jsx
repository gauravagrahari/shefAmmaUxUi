import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from "react-native";
import React, { useContext, useState, useCallback, useEffect } from 'react';
import HostCard from "../GuestSubComponent/HostCard";
import axios from "axios";
import NavBarGuest from "../GuestSubComponent/NavBarGuest";
import CheckPincode from "../GuestSubComponent/CheckPincode";
import config from '../Context/constants';
import { getFromSecureStore, storeInSecureStore } from "../Context/SensitiveDataStorage";
import { getFromAsync } from "../Context/NonSensitiveDataStorage";
import HostContext from '../Context/HostContext';
import Icon from 'react-native-vector-icons/AntDesign'; // Import Icon component
// import globalStyles from '../commonMethods/globalStyles';
import {globalStyles,colors} from '../commonMethods/globalStyles';
import Loader from "../commonMethods/Loader";
import { useFocusEffect } from '@react-navigation/native';
import { ScrollView, RefreshControl } from "react-native";
import MealTypeFilter from "../commonMethods/MealTypeFilter";
import { AddressContext } from "../Context/AddressContext";

const URL = config.URL;
const windowWidth = Dimensions.get('window').width;

export default function HomeGuest({ navigation }) {
  const [lastDefaultAddressType, setLastDefaultAddressType] = useState(addresses?.default);
  const { addresses } = useContext(AddressContext);
  const [lastFetchedAddress, setLastFetchedAddress] = React.useState(null);
  const [showPincodeChecker, setShowPincodeChecker] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [isReLoading, setIsReLoading] = useState(false);

  const { hostList, setHostList, hasFetchedHosts, setHasFetchedHosts } = useContext(HostContext);
  const [refreshing, setRefreshing] = React.useState(false); 
  const [selectedMealTypes, setSelectedMealTypes] = React.useState({
    breakfast: true,
    lunch: true, 
    dinner: true,
  }); 

  useEffect(() => {
    if (!addresses) {
      console.log("HomeGuest: Addresses context is not defined yet.");
      return; // Exit the useEffect if addresses is not defined
    }
    const defaultAddressType = addresses.default;
    const defaultAddress = addresses[defaultAddressType];

  
    if (JSON.stringify(defaultAddress) !== JSON.stringify(lastFetchedAddress)) {
      // setLoading(true);
      fetchUuidAndHosts(defaultAddress);
      setLastFetchedAddress(defaultAddress);
      setIsReLoading(true);
    } else if (defaultAddressType !== lastDefaultAddressType) {
      setLastFetchedAddress(null);
    }
    setLastDefaultAddressType(addresses.default);
  }, [addresses?.default, JSON.stringify(addresses?.[addresses?.default])]);
  
  const fetchUuidAndHosts = async () => {
    // Fetch the UUID from Secure Store
    const storedUuidGuest = await getFromSecureStore('uuidGuest');
    const token = await getFromSecureStore('token');
 
   console.log("value of loadinf is------->"+loading);
    try {
      // Fetch charges from the API
      const chargesResponse = await axios.get(`${URL}/guest/getCharges`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add your bearer token here
        },
      });

      // Store the received charges data in Secure Store
      await storeInSecureStore('charges', chargesResponse.data);
    } catch (error) {
      if (error.response) {
        console.error("Charges error status:", error.response.status);
        console.error("Charges error data:", error.response.data);
      } else if (error.request) {
        console.error("No response received for charges:", error.request);
      } else {
        console.error("Charges error:", error.message);
      }
    }

    try {
      // Fetch guestDetails from cache using the provided getFromAsync method
      const guestAddress = await getFromAsync('defaultAddress');
    let requestBody = null; // Initialize an empty request body

// Check if guestDetails is not empty
    if (guestAddress) {
// Prepare the request body
requestBody = {
  address: {
    street: guestAddress.street,
    houseName: guestAddress.houseName,
    city: guestAddress.city,
    state: guestAddress.state,
    pinCode: guestAddress.pinCode,
    // street: guestDetails.addressGuest.street,
    // houseName: guestDetails.addressGuest.houseName,
    // city: guestDetails.addressGuest.city,
    // state: guestDetails.addressGuest.state,
    // pinCode: guestDetails.addressGuest.pinCode,
  },
};
}


    const response = await axios.post(`${URL}/guest/hosts`, requestBody, {
      headers: {
        Authorization: `Bearer ${token}`, // Add your bearer token here
        uuidGuest: storedUuidGuest, // Use the storedUuidGuest in the headers
        // You can include other headers if needed
      },
      // params: {
      //   radius: 10, // Set the desired radius here
      // },
    });

    setHostList(response.data);
    if (!response.data || response.data.length === 0) {
      setShowPincodeChecker(true);
    } else {
      setShowPincodeChecker(false);
    }
  } catch (error) {
    if (error.response) {
      console.error("Error status:", error.response.status);
      console.error("Error data:", error.response.data);

      // Custom error message based on status code
      if (error.response.status === 400) {
        alert(error.response.data); // Alert the user with the response message
        setShowPincodeChecker(true); // Show pincode checker in case of service unavailability
        setHostList([]);
      }
    } else if (error.request) {
      console.error("No response received:", error.request);
      setHostList([]);
    } else {
      console.error("Error:", error.message);
    }
  } finally {
    setHasFetchedHosts(true);
    setIsReLoading(false);
    setLoading(false);
    console.log("value of loading at end is------->" + loading);
  }
};

useFocusEffect(
  useCallback(() => {
    // Only fetch if it hasn't been fetched this session
    if (!hasFetchedHosts) {
      fetchUuidAndHosts();
    } else {
      setLoading(false);
    }
  }, [hasFetchedHosts])
);

const onRefresh = React.useCallback(() => {
  setRefreshing(true);
  setLoading(true);
  console.log('loading value when refreshed'+ loading);
  fetchUuidAndHosts().then(() => setRefreshing(false));
}, []);

  const toggleMealType = (mealType) => {
    // Count the number of active meal types
    const activeMealTypes = Object.values(selectedMealTypes).filter(
      (value) => value === true
    );
  
    // If there is only one active meal type and the user tries to toggle it off,
    // prevent it from being turned off
    if (activeMealTypes.length === 1 && selectedMealTypes[mealType]) {
      return;
    }
  
    setSelectedMealTypes({
      ...selectedMealTypes,
      [mealType]: !selectedMealTypes[mealType],
    });
  };

  const filterHostsByMealType = () => {
    return hostList.filter((host) => {
      return host.meals.some(meal => {
        return (
          (selectedMealTypes.breakfast && meal.mealType === 'b') ||
          (selectedMealTypes.lunch && meal.mealType === 'l') ||
          (selectedMealTypes.dinner && meal.mealType === 'd')
          // (selectedMealTypes.dinner && meal.mealType === 'null')
        );
      });
    });
  };
  const filteredHosts = filterHostsByMealType();
  if (loading) {
    console.log("Rendering Loader, loading:", loading);
    return <Loader />;
  }
  if (isReLoading) {
    console.log("Rendering Loader, loading:", loading);
    return <Loader />;
  }
  return (  
      <View style={globalStyles.containerPrimary}>
     <NavBarGuest navigation={navigation} />
    <ScrollView 
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />} showsVerticalScrollIndicator={false}
        >
     <View>
        {
        filteredHosts.length === 0 && !showPincodeChecker ? (
          <View style={styles.emptyHostMessageContainer}>
            <Text style={styles.emptyHostMessage}>No cooks available in your region! Try updating your Address.</Text>
          </View>
        ) : (
          filteredHosts.map((host, index) => (
            <HostCard key={index} host={host.hostEntity} meals={host.meals} />
          //  <Text key={index}>hey{host.nameHost}</Text>
            ))
        )}
      </View>
    </ScrollView>
    {/* {!showPincodeChecker &&  <TouchableOpacity onPress={() => setShowPincodeChecker(true)} style={globalStyles.centralisingContainer}>
      <Text style={globalStyles.button}>Check Pincode</Text></TouchableOpacity>} */}

    <MealTypeFilter
      selectedMealTypes={selectedMealTypes}
      toggleMealType={toggleMealType}
    />
  {showPincodeChecker && <CheckPincode onClose={() => setShowPincodeChecker(false)} />}
     </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mealTypeFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // borderTopWidth: 1,
    // borderBottomWidth: 1,
    // borderColor: colors.primaryText,
  }, 
  mealTypeItem: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    backgroundColor: colors.pink, // Updated color
    borderWidth: 1,
    borderColor: 'transparent',
  },
  mealTypeContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    position: 'absolute',
    left: 8,
    top: 8,
  },
  mealTypeText: {
    fontSize: 16,
    color: colors.darkestBlue,
    textAlign: 'center',
  },
  activeItem: {
    backgroundColor: colors.pink, // Updated color
  },
  activeText: {
    fontWeight:'bold',
    // color: '#12486B',
    color: colors.darkestBlue,
  },
  emptyHostMessageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 300, // Adjust as necessary
  },
  emptyHostMessage: {
    fontSize: 18,
    color: colors.darkestBlue,
    textAlign: 'center',
    paddingHorizontal: 20, // To ensure the message fits well if it's long
  },
});
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}