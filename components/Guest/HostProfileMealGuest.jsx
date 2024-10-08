import React, { useCallback, useEffect, useState } from "react";
import { Button,Dimensions, StyleSheet, Text, View,PixelRatio , ScrollView,TextInput, TouchableOpacity,Modal } from "react-native";
import ItemCard from "../GuestSubComponent/ItemCard";
import NavBarMeals from "../GuestSubComponent/NavBarMeals";
import axios from "axios";
import { getFromSecureStore } from "../Context/SensitiveDataStorage";
import config from '../Context/constants';
import OrderSuccessCard from "../commonMethods/OrderSuccessCard";
import { getFromAsync } from "../Context/NonSensitiveDataStorage";
import MealTimeMessage from "../GuestSubComponent/MealTimeMessage";
import {globalStyles,colors} from '../commonMethods/globalStyles';
import MessageCard from "../commonMethods/MessageCard";
import { LinearGradient } from "expo-linear-gradient";
import StarRating from "../commonMethods/StarRating";
import * as Animatable from 'react-native-animatable';
import Constants from 'expo-constants';
const URL = Constants.expoConfig.extra.apiUrl || config.URL;

export default function HostProfileMealGuest({ route }) {
  const MEAL_TYPE_MAPPING = {
      'Breakfast': 'b',
      'Lunch': 'l',
      'Dinner': 'd',
  };
  const getCurrentCapacityAttributes = () => {
    switch (selectedMealType) {
        case MEAL_TYPE_MAPPING['Breakfast']:
            return { capacity: 'breakfastCapacity', currentCapacity: 'currentBreakfastCapacity' };
        case MEAL_TYPE_MAPPING['Lunch']:
            return { capacity: 'lunchCapacity', currentCapacity: 'currentLunchCapacity' };
        case MEAL_TYPE_MAPPING['Dinner']:
            return { capacity: 'dinnerCapacity', currentCapacity: 'currentDinnerCapacity' };
        default:
            return {};
    }
  };
  const [orderDelTimeAndDay, setOrderDelTimeAndDay] = useState('');
  const [showExceedMessage, setShowExceedMessage] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedMealType, setSelectedMealType] = useState(MEAL_TYPE_MAPPING['Breakfast']); 
  const [mealCount, setMealCount] = useState(0); // Counter for the number of selected meals
  const { itemList,host } = route.params || {};
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [packagingCharge, setPackagingCharge] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [mealTotal, setMealTotal] = useState(0);  // For clarity, we'll separate the meal total from the overall total
  const [isModalVisible, setModalVisible] = React.useState(false);
  const [charges, setCharges] = useState(0);  // For clarity, we'll separate the meal total from the overall total
  const [message, setMessage] = useState('');
  const [capacityData, setCapacityData] = useState(null);
  const [capacityAttributes, setCapacityAttributes] = useState(getCurrentCapacityAttributes());
  const { capacity, currentCapacity } = capacityAttributes;
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [preferredTime, setPreferredTime] = useState('');
  const [servedMeals, setServedMeals] = useState([]);
  const [isOrdering, setIsOrdering] = useState(false);
  const [maxMeal, setMaxMeal] = useState(3); 
  const [isDescriptionVisible, setDescriptionVisible] = useState(false);
  const [cutleryCount, setCutleryCount] = useState(0);
  const [cutleryCharge, setCutleryCharge] = useState(5);
  
  useEffect(() => {
    setMealCount(0);
}, [selectedMealType]);

useEffect(() => {
  if (itemList && itemList.length > 0) {
    const meals = itemList.map(item => item.mealType) // Assuming mealType is the full meal name
                      .filter((value, index, self) => self.indexOf(value) === index);
    setServedMeals(meals);

    // Set default selected meal
    if (meals.length > 0) {
      setSelectedMealType(meals[0]);
    }
  }
}, [itemList]);
  useEffect(() => {
    setCapacityAttributes(getCurrentCapacityAttributes());
  }, [selectedMealType]);

  const getSelectedItem = useCallback(() => {
    return itemList.find(item => item.mealType === selectedMealType);
}, [itemList, selectedMealType]);

const increaseMealCount = () => {
  if (mealCount >= capacityData[currentCapacity]) {
    setShowExceedMessage(true); // Show message when capacity is exceeded
    return;
  }

  if (mealCount >= maxMeal) {
    alert(`Per order, a maximum of ${maxMeal} meals can be ordered.`);
    return;
  }

  setMealCount(prevCount => prevCount + 1);
};
const toggleDescription = () => {
  setDescriptionVisible(!isDescriptionVisible);
};

const fetchCharges = async () => {
  try {
    console.log("Making API call to fetch charges. URL:", URL);
    const token = await getFromSecureStore('token');
    const chargesResponse = await axios.get(`${URL}/guest/getCharges`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const chargesData = chargesResponse.data;
    setDeliveryCharge(parseFloat(chargesData.deliveryCharges));
    console.log('fetched------------------->');
    setPackagingCharge(parseFloat(chargesData.packagingCharges) + parseFloat(chargesData.handlingCharges));
    setDiscount(parseFloat(chargesData.discount));
    setCutleryCharge(parseFloat(chargesData.cutleryCharge));
    console.log('------------cutlery------------------->'+ cutleryCharge);
    if (chargesData.maxMeal) {
      setMaxMeal(chargesData.maxMeal);
    }
    await storeInSecureStore('charges', chargesData);
    console.log("Charges response:", chargesResponse.data);
  } catch (error) {
    console.error('Failed to fetch charges:', error);
    throw error;
  }
};

useEffect(() => {
  const fetchChargesFromStore = async () => {
    const charges = await getFromSecureStore('charges');
    if (!charges) {
      await fetchCharges();
    } else {
      setDeliveryCharge(parseFloat(charges.deliveryCharges));
      setPackagingCharge(parseFloat(charges.packagingCharges) + parseFloat(charges.handlingCharges));
      setDiscount(parseFloat(charges.discount));
      setCutleryCharge(parseFloat(charges.cutleryCharge));
      if (charges.maxMeal) {
        setMaxMeal(charges.maxMeal);
      }
    }
  };
  fetchChargesFromStore();
}, []); 

useEffect(() => {
  const fetchDefaultAddress = async () => {
    const address = await getFromAsync('defaultAddress');
    setDefaultAddress(address);
  };

  fetchDefaultAddress();
}, []);

const decreaseMealCount = () => {
  if (mealCount > 0) {
      setMealCount(prevCount => prevCount - 1);
  }
};
  const closeOrderPlacedMessage = () => {
    setOrderPlaced(false);
};
useEffect(() => {
  const fetchCapacityData = async () => {
    try {
      const token = await getFromSecureStore('token'); 
      if (!token) {
        navigation.navigate('LoginGuest');
        return; 
      }
      const response = await axios.get(`${URL}/guest/host/capacity`, {
        headers: {
          Authorization: `Bearer ${token}`,
          id: host.uuidHost,
        },
      });
      
      console.log('Received capacity data:', response.data);    
      setCapacityData(response.data);

    } catch (error) {
      console.error('Failed to fetch capacity data:', error);
    }
  };

  fetchCapacityData();
}, []);

useEffect(() => {
  const selectedItem = getSelectedItem();
  if (selectedItem) {
    // Ensure all values are numbers, defaulting to 0 if not
    const itemAmount = Number(selectedItem.amount) || 0;
    const parsedCutleryCharge = Number(cutleryCharge) || 0;
    const parsedDeliveryCharge = Number(deliveryCharge) || 0;
    const parsedPackagingCharge = Number(packagingCharge) || 0;
    const parsedDiscount = Number(discount) || 0;

    const newMealTotal = itemAmount * mealCount;
    const cutleryTotal = parsedCutleryCharge * cutleryCount;

    setMealTotal(newMealTotal);
    const overallTotal = newMealTotal + parsedDeliveryCharge + parsedPackagingCharge - parsedDiscount + cutleryTotal;
    setTotalAmount(overallTotal);
  }
}, [mealCount, cutleryCount, selectedMealType, deliveryCharge, packagingCharge, discount, cutleryCharge]);


  const handleConfirm = () => {
    setModalVisible(true);
  };
  const handleDateAndTimeChange = (delTimeAndDay) => {
    console.log('the time and day'+delTimeAndDay);  // You will have date and time here
    setOrderDelTimeAndDay(delTimeAndDay); 
};
  const handleOrderButton = async () => {
    if (isOrdering) {
      return;
    }
  
    setIsOrdering(true);
   
  if (deliveryCharge === null || deliveryCharge === undefined || packagingCharge === null || packagingCharge === undefined) {
    try {
      await fetchCharges();
      // Repeat the explicit checks after fetching charges
      if (deliveryCharge === null || deliveryCharge === undefined || packagingCharge === null || packagingCharge === undefined) {
        alert("Unable to fetch delivery and packaging charges. Please try again.");
        setIsOrdering(false);
        return;
      }
    } catch (error) {
      alert("An error occurred while fetching charges. Please try again.");
      setIsOrdering(false);
      return;
    }
  }
    const selectedItem = getSelectedItem();
    if (!selectedItem) {
        console.error("No selected item found");
        return;
    }

    const orderedItemsData = {
        itemId: selectedItem.uuidItem,
        noOfServing: mealCount.toString()
    };
    const guestDetails=await getFromAsync('guestDetails');
    const storedUuidGuest = await getFromSecureStore('uuidGuest');
    const phone = await getFromSecureStore('phone');
    const altPhone = await getFromSecureStore('altPhone');

    const orderTimeStamp = new Date().toISOString();
    const orderData = {
      uuidOrder: storedUuidGuest,
      timeStamp: orderTimeStamp,
      status: "new",  
      amount: totalAmount.toFixed(2),
      // itemQuantity: "1",
      noOfServing: mealCount,
      nameGuest:guestDetails.name,
      geoGuest: guestDetails.geocode,
      nameHost:host.nameHost,
      phoneGuest:phone,
      phoneGuestAlt:altPhone,
      phoneHost:host.phone,
      phoneHostAlt:host.altPhone,
      geoHost:host.geocode,
      uuidHost:host.uuidHost,
      timeStampGsi:orderTimeStamp,
      timeStampGsiDev:orderTimeStamp,
      // Adding the new properties:
      mealType: selectedMealType, 
      itemName: selectedItem.nameItem ,
      itemPrice: selectedItem.amount,  // Assuming the price is stored in either 'amount' or 'price' property
      delTimeAndDay: orderDelTimeAndDay,
      delAddress:defaultAddress,
      preferredTime,
      amtDelivery:deliveryCharge,
      amtPackaging:packagingCharge,
      amtCook:mealTotal,
      cutleryCount:cutleryCount,
  };

  try {
    const token = await getFromSecureStore('token');
    console.log(`Order sent was: ${JSON.stringify(orderData)}`);
    console.log('capacity', capacityData.capacityUuid);

    const response = await axios.post(`${URL}/guest/order`, orderData, {
      headers: {
        Authorization: `Bearer ${token}`,
        capacityUuid:capacityData.uuidCapacity,
            },
    });

    if (response.status === 200) {
      // Order placed successfully
      console.log(response.data);
      setModalVisible(false);
     
      setTimeout(() => {
        setOrderPlaced(true);
      }, 150); 
    } else if (orderResponse.status === 409) { // Assuming 409 Conflict for price discrepancy
      // Fetch the latest charges in case of a price discrepancy
      await fetchCharges();
      alert("Charges got updated. Try again or please refresh the home page to view the latest prices of all items.");
    }else {
      console.error('Unexpected response:', orderResponse);
    }
  } catch (error) {
    if (error.response) {
      console.error('Server Response:', error.response.data);
      console.error('Server Status:', error.response.status);
      console.error('Server Headers:', error.response.headers);
      console.log('Complete Server Response:', error.response);

      // Display error message from the server
      alert(error.response.data); // This will display the custom error message from your controller
    } else if (error.request) {
      console.error('Request made by client:', error.request);
      // Display a generic error message
      alert("An error occurred while placing the order. Please try again.");
    } else {
      console.error('Error:', error.message);
      alert("An unexpected error occurred.");
    }
  } 
finally {
  setIsOrdering(false);
}
};

return (
  <View style={{ flex: 1 }}>
  <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
  <LinearGradient colors={[colors.navBarColor, colors.navBarColor]} style={styles.hostInfoContainer}>
  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',   }}>

        <Text style={styles.hostName}>{host.nameHost}</Text>
        {(host.ratingHost) && <StarRating style={styles.rating} rating={host.ratingHost} />}
        </View>
        <Text style={styles.address}>
            {host.addressHost.city}, {host.addressHost.state}
          </Text>
        {/* <Text style={styles.descriptionHost}>{host.descriptionHost}</Text> */}
      </LinearGradient>
        <NavBarMeals 
          selectedMealType={selectedMealType} 
          onSelectMealType={setSelectedMealType} 
          servedMeals={servedMeals} 
        />
      {getSelectedItem() && <ItemCard item={getSelectedItem()} />}
{/* <View style={styles.capacityContainer}>

</View> */}
    <View style={styles.quantityContainer}>
    {/* <View style={{backgroundColor: 'red'}}> */}
    <Text style={styles.subTitle}>Choose number of plates : </Text>
 {/* </View> */}
   <TouchableOpacity style={styles.counterButton} onPress={decreaseMealCount}>
      <Text style={styles.counterText}>-</Text>
  </TouchableOpacity>
  <Text style={styles.noOfGuest}>{mealCount}</Text>
  <Animatable.View
            iterationDelay={5000}
            easing="ease-out"
            animation="rubberBand"
            useNativeDriver
            iterationCount='infinite'
          >
  <TouchableOpacity style={styles.counterButton} onPress={increaseMealCount}>
      <Text style={styles.counterText}>+</Text>
  </TouchableOpacity>
  </Animatable.View>
</View>
{mealCount > 0 && cutleryCharge > 0 &&(
  <View style={[styles.quantityContainer,{backgroundColor: "rgba(0, 150, 136, 0.05)",borderWidth:1,borderColor:colors.pink}]}>
  <Text style={[styles.subTitle],{color:colors.matBlack}}>Add a disposable plate n spoon:</Text>
  <TouchableOpacity style={styles.counterButton} onPress={() => setCutleryCount(Math.max(0, cutleryCount - 1))}>
    <Text style={styles.counterText}>-</Text>
  </TouchableOpacity>
  <Text style={[styles.noOfGuest,{color:colors.matBlack}]}>{cutleryCount}</Text>
  <TouchableOpacity style={[styles.counterButton]} onPress={() => setCutleryCount(cutleryCount + 1)}>
    <Text style={styles.counterText}>+</Text>
  </TouchableOpacity>

</View>
)}
  <View style={styles.costsContainer}>

{capacityData && capacityData[capacity] && capacityData[currentCapacity] && (
  <View style={styles.costRow}>
      <Text style={styles.costLabelText}>Maximum Plates We Can Prepare:</Text>
      <Text style={styles.costValueText}>{capacityData[capacity]}</Text>
  </View>
)}

{capacityData && capacityData[capacity] && capacityData[currentCapacity] && (
  <View style={styles.costRow}>
      <Text style={styles.costLabelText}>Plates Available to Order:</Text>
      <Text style={styles.costValueText}>{capacityData[currentCapacity]}</Text>
  </View>
)}

  <View style={styles.costRow}>
      <Text style={styles.costLabelText}>Meal Price:</Text>
      <Text style={styles.costValueText}>{mealTotal.toFixed(2)}/-</Text>
  </View>

  {cutleryCharge > 0 && (
  <View style={styles.costRow}>
    <Text style={styles.costLabelText}>Cutlery Charges:</Text>
    <Text style={styles.costValueText}>{(cutleryCharge.toFixed(2) * cutleryCount).toFixed(2)}/-</Text>
  </View>
)}
{deliveryCharge === 0 ? (
        <Text style={styles.offerText}>Yay! Free Delivery!</Text>
    ) : (
        <View style={styles.costRow}>
            <Text style={styles.costLabelText}>Delivery Charges:</Text>
            <Text style={styles.costValueText}>{deliveryCharge.toFixed(2)}/-</Text>
        </View>
    )}

{packagingCharge === 0 ? (
        <Text style={styles.offerText}>Yay! Free Packaging, Handling, and Platform Charges!</Text>
    ) : (
        <View style={styles.costRow}>
            <Text style={styles.costLabelText}>Packaging, Handling and Platform Charges:</Text>
            <Text style={styles.costValueText}>{packagingCharge.toFixed(2)}/-</Text>
        </View>
    )}

{mealCount > 0 && packagingCharge > 0 && (
    <Text style={styles.offerText}>
        Enjoy additional discount on packaging, handling, and platform charges for your second plate when you add it to your order!
    </Text>
)}

  {mealCount > 0 && discount >0 && (
        <View style={styles.costRow}>
            <Text style={styles.costLabelText}>ShefAmma's Discount:</Text>
            <Text style={styles.discountText}>{discount.toFixed(2)}/-</Text>
        </View>
    )}
  {mealCount > 0 && (
  <View style={styles.costRow}>
      <Text style={styles.costLabelText}>Total Amount:</Text>
      <Text style={styles.finalAmountText}>{totalAmount.toFixed(2)}/-</Text>
  </View>)}
  {mealCount > 0 && (
  <View style={styles.costRow}>
      <Text style={styles.costLabelText}>Payment:</Text>
      <Text style={styles.finalAmountText}>Pay On Delivery</Text>
  </View>)}
</View>

<MealTimeMessage
                mealType={Object.keys(MEAL_TYPE_MAPPING).find(meal => MEAL_TYPE_MAPPING[meal] === selectedMealType)}
                onDateAndTimeChange={handleDateAndTimeChange} />
{defaultAddress && defaultAddress.houseName && defaultAddress.street && defaultAddress.city && defaultAddress.pinCode ? (
  <LinearGradient colors={[colors.darkBlue, colors.secondCardColor]} style={styles.defaultAddressContainer}>
    <Text style={styles.defaultAddressText}>Your order will be delivered at - </Text>
    <Text style={styles.defaultAddressDetails}>
      {defaultAddress.houseName}, {defaultAddress.street}, {defaultAddress.city} - {defaultAddress.pinCode}.
    </Text>
  </LinearGradient>
) : (
  // Display this message if the address details are incomplete or not provided
  <LinearGradient colors={[colors.darkBlue, colors.secondCardColor]} style={styles.defaultAddressContainer}>
  <Text style={[styles.defaultAddressDetails,{color:'red'}]}>
    You have not selected a delivery address in the profile, select an address to be able to place Order.
  </Text>
   </LinearGradient>
)}
{mealCount > 0 && (
  <View style={styles.preferredTimeContainer}>
    <Text style={styles.preferredTimeLabel}>Add a preferred Delivery Time:</Text>
    <TextInput
      style={styles.preferredTimeInput}
      placeholder="e.g., 06:30 PM"
      value={preferredTime}
      onChangeText={setPreferredTime}
    />
  </View>
)}
{mealCount > 0 && (
  <View>
    <Text style={styles.beReady}>Please be ready to receive your order between the given time slot and have your payment prepared. Quick and efficient handovers help our delivery partners serve everyone better. Thank you!</Text>
</View>
)}

<View style={globalStyles.centralisingContainer}>
  {mealCount > 0 && defaultAddress && defaultAddress.houseName && defaultAddress.street && defaultAddress.city && defaultAddress.pinCode && (
    <TouchableOpacity 
      style={styles.orderButton} 
      onPress={handleConfirm} 
      disabled={isOrdering}
    >
      <Animatable.Text
        iterationDelay={5000}
        easing="ease-out"
        animation="rotate"
        useNativeDriver 
        iterationCount='infinite'
      >
        <Text style={styles.buttonText}>{isOrdering ? 'Processing...' : 'Order'}</Text>
      </Animatable.Text>
    </TouchableOpacity>
  )}
</View>
<OrderSuccessCard isVisible={orderPlaced} onClose={closeOrderPlacedMessage} />
<LinearGradient colors={[colors.navBarColor, colors.navBarColor]} style={styles.hostInfoContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
          <TouchableOpacity onPress={toggleDescription}>
            <Text style={styles.hostNameButton}>
              Check what {host.nameHost} has to tell you about her cooking!
            </Text>
          </TouchableOpacity>
        </View>
        {isDescriptionVisible && (
          <Text style={styles.descriptionHost}>{host.descriptionHost}</Text>
        )}
      </LinearGradient>

      <Modal
transparent={true}
animationType="slide"
visible={isModalVisible}
onRequestClose={() => {
  setModalVisible(false); // Ensure it can be closed on Android back button press
}}
>
<View style={styles.modalView}>
  <View style={styles.modalContainer}>
    <Text style={styles.modalText}>Click confirm button to place order for your {Object.keys(MEAL_TYPE_MAPPING).find(meal => MEAL_TYPE_MAPPING[meal] === selectedMealType).toUpperCase()}.</Text>
    <View style={styles.modalButtons}>
      <TouchableOpacity style={styles.confirmButton} onPress={handleOrderButton}  disabled={isOrdering}
>
        <Text style={{ color: colors.pink }}>{isOrdering ? 'Processing...' : 'Confirm'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
        <Text style={{ color:  colors.pink  }}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </View>
</View>
</Modal>


  </ScrollView>
  <MessageCard 
          message="Ooops!! The Kitchen Capacity has been reached."
          isVisible={showExceedMessage}
          onClose={() => setShowExceedMessage(false)}
      />
  </View>

);
}
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const scale = screenWidth / 320;
const normalize = (size) => {
    const newSize = size * scale 
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) 
}
const fontScale = PixelRatio.getFontScale();
    const scaledFontSize = (size) => size / fontScale;
const styles = StyleSheet.create({
  container: {
  
      flex: 1,
      // padding: 10,
      // backgroundColor: colors.darkestBlue,
      backgroundColor: colors.primaryLight, // Slightly off-white for a more professional look
  },
  hostNameButton: {
    fontSize: screenWidth * 0.042,
    fontWeight: 'bold',
    color: 'gray', // Change as per your color theme
    textDecorationLine: 'underline', 
    padding: 10,
    borderTopColor:colors.deepBlue,
    borderTopWidth:1,
    marginHorizontal:10,
  },
  hostInfoContainer: {
    padding: screenWidth * 0.025,
    borderRadius: 5,
  },
  address: {
    fontSize: screenWidth * 0.037,
    color: 'gray',
    marginBottom: screenHeight * 0.012,
  },
  hostName: {
    fontSize: screenWidth * 0.048,
    fontWeight: 'bold',
    color: colors.deepBlue,
  },
  descriptionHost: {
    fontSize: normalize(11.5),
        color: colors.lightishPink,
        lineHeight: normalize(12),
    marginBottom: screenHeight * 0.015,
  },
  title: {
      fontSize: 20,
      fontWeight: "700",
      marginBottom: 15,
      color: '#2C3E50', // Dark bluish-gray for better contrast
  },
 subTitle: {
  fontSize: scaledFontSize(16.5),
    fontWeight: "600",
    color: 'white',
  },     
   quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: screenHeight * 0.01,
    marginHorizontal: screenWidth * 0.025,
    justifyContent: 'center',
    backgroundColor: colors.primaryText,
    padding: screenHeight * 0.01,
    borderRadius: 8,
  },
  orderPlacedContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2ECC71', 
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
},

orderPlacedText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
},
preferredTimeContainer: {
  marginVertical: 10,
  alignItems: 'center',
},
preferredTimeLabel: {
  fontSize: 16,
  fontWeight: '600',
  color: colors.deepBlue, // Adjust as needed
},
preferredTimeInput: {
  borderWidth: 2,
  borderColor: colors.pink,
  borderRadius: 3,
  padding: 7,
  width: '30%',
  marginTop: 5,
},
closeButton: {
    fontSize: 24,
    color: '#FFF',
},
noOfGuest: {
  marginHorizontal: screenWidth * 0.035,
  fontSize: scaledFontSize(16),
  fontWeight: "500",
  color: 'white',
},
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi transparent background
  },
  modalContainer: {
    width: '80%',
    padding: 18,
    borderRadius: 10,
    backgroundColor:colors.primaryLight,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  
  modalContent: {
    width: '80%',
  padding: 20,
  borderRadius: 10,
  backgroundColor: '#f5f5f5', // light gray background for a subtle look
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: {
      width: 0,
      height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5,

  },
  modalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.deepBlue,
    marginBottom: 15,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 15, // space between text and buttons
  },
  confirmButton: {
    backgroundColor: 'rgba(0, 150, 136, 0.15)',
     paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 7,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.pink,
    borderWidth: 2,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 7,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.pink,
    borderWidth: 2,
  },
  counterButton: {
    backgroundColor: colors.darkBlue,
    padding: screenWidth * 0.025,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginHorizontal: screenWidth * 0.015,
    width: screenWidth * 0.12,
    height: screenWidth * 0.12,
  },
  counterText: {
    fontSize: scaledFontSize(16),
    color: colors.deepBlue,
    fontWeight: '600',
  },

  orderButton: {
    width: '80%',
    height: 55,
    marginTop: 20,
    marginBottom: 50,
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
  costsContainer: {
    width: '100%',
      marginVertical: 10,
      padding:10,
      backgroundColor:colors.primaryLight,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: screenHeight * 0.0051,
    marginBottom: screenHeight * 0.005,
  },
  costLabelText: {
    fontSize: scaledFontSize(15.5),
    color: colors.deepBlue,
  },
  offerText: {
    marginVertical:5,
    borderWidth: 1,
    borderColor:colors.deepBlue,
    borderRadius: 5,
    padding: 7,
    fontSize: normalize(13),
    color: "#1AB269",
    fontWeight: 'bold',
  },
  beReady: {
    margin:10,
    borderWidth: 1,
    // borderColor:colors.deepBlue,
    borderColor:'gray',
    borderRadius: 10,
    padding: 7,
    fontSize: normalize(11.5),
    // color: "gray",
    color: colors.pink,
  },
  costValueText: {
    fontSize: scaledFontSize(17),
    fontWeight: '500',
    color: colors.deepBlue,
    textAlign: 'right',
  },
  discountText: {
      fontSize: 16,
      fontWeight: '500',
      color: '#a8004b',  // A slightly more saturated shade of red for emphasis
  },
  finalAmountText: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.primaryText,  // A more vivid green for the total amount
      textAlign: 'right',
  },

  defaultAddressContainer: {
    fontSize: 16,
        color: '#333',   // Dark grey color
        padding: 5,
        backgroundColor: colors.darkBlue, // Light grey background
        borderRadius: 5,
        textAlign: 'center',
        marginHorizontal: 10,
        marginBottom:10,
        borderWidth: 2,
        borderColor: colors.primaryText,
        fontWeight: '500',
  },
  defaultAddressText: {
      fontSize: 16,
        textAlign: 'center',

        color:colors.deepBlue,
  },
  defaultAddressDetails: {
    fontSize: 16,
    color: colors.deepBlue, 
    fontWeight: 'bold',
    textAlign: 'center',

  }
});
