import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, Button } from 'react-native';
import { globalStyles, colors } from '../commonMethods/globalStyles';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';  // for Ionicons set
import config from '../Context/constants';
import { getFromSecureStore } from '../Context/SensitiveDataStorage';
import {  Platform } from 'react-native';
import * as Linking from 'expo-linking';
import * as Clipboard from 'expo-clipboard';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';
import MessageCard from '../commonMethods/MessageCard';
const URL = Constants.expoConfig.extra.apiUrl;

export default function OrderCardDevBoy({ orderData, hostAddress, guestAddress, navigation }) {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [dropdownItems, setDropdownItems] = useState(['Not Picked Up', 'Undelivered']);
  const [clipboardMessage, setClipboardMessage] = useState('');
  const [isMessageVisible, setMessageVisible] = useState(false);
  
console.log("order data:", JSON.stringify(orderData));
console.log("host address:", JSON.stringify(hostAddress));

const statusMappings = {
  new:"New",
  ip: "In Progress",
  pkd:"Picked Up",
  com: "Completed",
  can: "Cancelled",
 unpkd:"Not Picked Up",
 undel:"Undelivered",
};
  const getFullStatus = (shortStatus) => {
    return statusMappings[orderData.status] || orderData.status;
  };
  // Handle dropdown value change
  const onDropdownValueChange = (value) => {
    setSelectedStatus(value);
    setModalVisible(true); // Show the confirmation modal when a new status is selected
  };
  let statusStyle;
  const fullStatus = getFullStatus(orderData.status);
  switch (fullStatus) {
    case "Cancelled":
      statusStyle = styles.cancelled;
      break;
    case "Completed":
      statusStyle = styles.completed;
      break;
    case "In Progress":
      statusStyle = styles.inProgress;
      break;
      case "Picked Up":
        statusStyle = styles.pickedUp;
        break;
    case "New":
      statusStyle = styles.newOrder;
      break;
    default:
      break;
  }
  const dialNumber = (phoneNumber) => {
    console.log(`Attempting to dial phone number: ${phoneNumber}`);
  
    // Check the platform (iOS or Android)
    const url = Platform.select({
      ios: `telprompt:${phoneNumber}`,
      android: `tel:${phoneNumber}`,
    });
    
  
    console.log(`Formatted URL for dialing: ${url}`);
  
    Linking.canOpenURL(url)
      .then((supported) => {
        console.log(`Can open URL: ${supported}`);
        if (!supported) {
          console.error(`Can't handle url: ${url}`);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };
  const copyToClipboardWithMessage = (text, message) => {
    Clipboard.setStringAsync(text);
    setClipboardMessage(message);
    setMessageVisible(true);
    setTimeout(() => setMessageVisible(false), 2500); // Hide the message after 2.5 seconds
  };
  
  const openInGoogleMaps = (address) => {
    const formattedAddress = encodeURIComponent(address);
    const url = `https://www.google.com/maps/search/?api=1&query=${formattedAddress}`;
    Linking.openURL(url);
  }
  const openDirectionsInGoogleMaps = (startAddress, endAddress) => {
    const formattedStartAddress = encodeURIComponent(startAddress);
    const formattedEndAddress = encodeURIComponent(endAddress);
    const url = `https://www.google.com/maps/dir/?api=1&origin=${formattedStartAddress}&destination=${formattedEndAddress}`;
    Linking.openURL(url);
}
const options = {
  year: 'numeric', 
  month: 'short', 
  day: 'numeric', 
  hour: '2-digit', 
  minute: '2-digit', 
  second: undefined, // Exclude seconds
  hour12: true // Use 12-hour time (remove this line if you want 24-hour time)
};
  const formattedDateTime = new Date(orderData.timeStamp).toLocaleString('en-IN', options);
  const copyToClipboard = (text) => {
    Clipboard.setString(text);
  };
  const mealMapping = {
    b: "Breakfast",
    l: "Lunch",
    d: "Dinner"
  };
  const handleOrderPickup = async () => {
    try {
        const currentTimestamp = new Date().toISOString();
        const attributeName = "status";
        const attributeName2 = "pickUpTime";
        const token = await getFromSecureStore('token');

        const orderEntity = {
            status: "pkd",
            uuidOrder: orderData.uuidOrder,
            timeStamp: orderData.timeStamp,
            pickUpTime: currentTimestamp,
        };

        const response = await axios.put(
          `${URL}/devBoy/updateOrder?attributeName=${attributeName}&attributeName2=${attributeName2}`,
          orderEntity,
            {
                headers: {
                  Authorization: `Bearer ${token}`,
                }
            }
        );

        if (response.data === "Order updated successfully") {
            console.log("Order picked up successfully!");
            orderData.status='pkd';
            setModalVisible(false); 
        } else {
            console.error("Unexpected response:", response.data);
        }
    } catch (error) {
        console.error("Error picking up the order:", error);
    }
};
  const handleOrderCompletion = async () => {
    try {
      const currentTimestamp = new Date().toISOString(); // Assuming you want to send the current timestamp
      const attributeName = "status"; // Assuming you're updating the 'status' attribute
      const token = await getFromSecureStore('token');
      const attributeName2 = "deliverTime";

      const orderEntity = {
        status: "com", // or whatever status value you want to set
      uuidOrder:orderData.uuidOrder,
      timeStamp: orderData.timeStamp,
      deliverTime: currentTimestamp,
      
      };
  
      const response = await axios.put(
        `${URL}/devBoy/updateOrder?attributeName=${attributeName}&attributeName2=${attributeName2}`,
        orderEntity,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
  
      if (response.data === "Order updated successfully") {
        orderData.status='com';

        console.log("Order updated successfully!");
        setModalVisible(false); // Close the modal after successful operation
      } else {
        console.error("Unexpected response:", response.data);
      }
    } catch (error) {
      console.error("Error completing the order:", error);
    }
  };
  
  return (
    <LinearGradient colors={[ colors.darkBlue,colors.secondCardColor]} style={styles.card}>
      <View style={styles.hostGuestContainer}>
        <View style={styles.guestDetailsContainer}>
          {/* <TouchableOpacity onPress={() => navigation.navigate('HostProfileMealGuest')}> */}
          <TouchableOpacity>
            <Text style={[styles.itemName]}>{orderData.nameHost}</Text>
          </TouchableOpacity>
          <TouchableOpacity onLongPress={() => copyToClipboardWithMessage(orderData.phoneHost, 'Phone number copied to clipboard!')} onPress={() => dialNumber(orderData.phoneHost)} style={styles.phoneContainer}>
        <Icon name="call-outline" size={20} color={colors.primaryText} />
        <Text style={[styles.details, styles.linkText, styles.phoneNumber]}>{orderData.phoneHost}</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => dialNumber(orderData.altPhone)} style={styles.phoneContainer} onLongPress={() => copyToClipboardWithMessage(orderData.phoneHostAlt, 'Phone number copied to clipboard!')}>
        <Icon name="call-outline" size={20} color={colors.primaryText} />
        <Text style={[styles.details, styles.linkText, styles.phoneNumber]}>{orderData.phoneHostAlt}</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.clickableAddressContainer} 
    onPress={() => openInGoogleMaps(`${hostAddress.street},${hostAddress.houseName}, ${hostAddress.city}, ${hostAddress.state}, ${hostAddress.pinCode}`)}>
 <Text style={[styles.details, styles.clickableAddress]}>
  {hostAddress.houseName ? `${hostAddress.houseName}, ` : ''}
  {hostAddress.street}
</Text>
<Text style={[styles.details, styles.clickableAddress]}>
  {hostAddress.city}, {hostAddress.state} {hostAddress.pinCode}
</Text>
</TouchableOpacity>
        </View>
        <Icon 
      name="arrow-down-outline" // Change the icon to a downward arrow
      size={40} 
      color={colors.primaryText} 
      style={styles.arrowIcon} 
    onPress={() => openDirectionsInGoogleMaps(
        `${hostAddress.street},${hostAddress.houseName}, ${hostAddress.city}, ${hostAddress.state}, ${hostAddress.pinCode}`,
        `${guestAddress.street},${guestAddress.houseName}, ${guestAddress.city}, ${guestAddress.state}, ${guestAddress.pinCode}`
    )}
/>  
        {/* Guest Details */}
        <View style={styles.guestDetailsContainer}>
          <Text style={styles.itemName}>{orderData.nameGuest}</Text>
          <TouchableOpacity onPress={() => dialNumber(orderData.phoneGuest)} style={styles.phoneContainer} onLongPress={() => copyToClipboardWithMessage(orderData.phoneGuest, 'Phone number copied to clipboard!')}>
        <Icon name="call-outline" size={20} color={colors.primaryText} />
        <Text style={[styles.details, styles.linkText, styles.phoneNumber]}>{orderData.phoneGuest}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => dialNumber(orderData.phoneGuestAlt)} style={styles.phoneContainer} onLongPress={() => copyToClipboardWithMessage(orderData.phoneGuestAlt, 'Phone number copied to clipboard!')}>
        <Icon name="call-outline" size={20} color={colors.primaryText} />
        <Text style={[styles.details, styles.linkText, styles.phoneNumber]}>{orderData.phoneGuestAlt}</Text>
        </TouchableOpacity>
 
        <TouchableOpacity 
    onPress={() => openInGoogleMaps(`${orderData.delAddress.street},${orderData.delAddress.houseName}, ${orderData.delAddress.city}, ${orderData.delAddress.state}, ${orderData.delAddress.pinCode}`)}
    style={styles.clickableAddressContainer}>
      <Text style={[styles.details, styles.clickableAddress]}>
        {orderData.delAddress.houseName ? `${orderData.delAddress.houseName}, ` : ''}
        {orderData.delAddress.street}
      </Text>
      <Text style={[styles.details, styles.clickableAddress]}>
        {orderData.delAddress.city}, {orderData.delAddress.state} {orderData.delAddress.pinCode}
      </Text>
      
</TouchableOpacity>
        </View>
      </View>
      {isMessageVisible && <MessageCard message={clipboardMessage} isVisible={isMessageVisible} onClose={() => setMessageVisible(false)} />}
      {/* Name and Time Row */}
      <View style={styles.nameTimeContainer}>
        <Text style={styles.details}>Order at  - {formattedDateTime}</Text>
      </View>
  
      {/* Meal Type and Number of Servings Row */}
      <View style={styles.mealServingContainer}>
        <Text style={styles.details}>{mealMapping[orderData.mealType]}</Text>
        <Text style={styles.details}>{orderData.noOfServing} servings</Text>
      </View>
      {
  orderData.preferredTime &&
  <View style={styles.mealServingContainer}>
    <Text style={styles.details}>Preferred time to deliver : </Text>
    <Text style={styles.details}>{orderData.preferredTime}</Text>
  </View>
}

      {/* Amount and Status Row */}
      <View style={styles.amountStatusContainer}>
        <Text style={styles.amount}>Collect : Rs {orderData.amount}</Text>
        <Text style={statusStyle}>{fullStatus}</Text>
      </View>
   {/* Amount and Status Row */}
   <View style={styles.amountStatusContainer}>
        <Text style={styles.amount}>{orderData.delTimeAndDay}</Text>
      </View>
     {/* Conditional rendering based on status */}
     {orderData.status === "ip" && (
                <View style={globalStyles.centralisingContainer}>
                  <Text style={styles.pickedUp}>You need to pick up the order from cook's location.</Text>
      <TouchableOpacity style={styles.completeOrderButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.completeOrderText}>Order Picked Up</Text>
      </TouchableOpacity>
      </View>
    )}
    
    {orderData.status === "pkd" && (
                <View style={globalStyles.centralisingContainer}>
                  <Text style={styles.completed}>You need to deliver the order to the customer.</Text>

      <TouchableOpacity style={styles.completeOrderButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.completeOrderText}>Order Delivered</Text>
      </TouchableOpacity>
      </View>
    )}
      <Modal
    animationType="slide"
    transparent={true}
    visible={isModalVisible}
    onRequestClose={() => {
      setModalVisible(!isModalVisible);
    }}>
    <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
            <Text style={styles.modalText}>
              {orderData.status === "ip" ? "Are you sure you want to mark the order as picked up?" : "Are you sure you want to mark the order as delivered?"}
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                  style={styles.confirmButton} 
                  onPress={orderData.status === "ip" ? handleOrderPickup : handleOrderCompletion}
              >
                <Text style={{ color: 'white' }}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={{ color: 'white' }}>Cancel</Text>
              </TouchableOpacity>
            </View>
        </View>
    </View>
</Modal>

  </LinearGradient>
);

}
const styles = StyleSheet.create({
  card: {
    flexDirection: 'column',
    padding: 12,
    marginBottom: 5,
    backgroundColor: colors.darkBlue,
    borderRadius: 8,
    shadowColor: '#aaa',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  linkText: {
    color: colors.primaryText,
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 8,
  },
  phoneContainer: {
    flexDirection: 'row',   // Aligns the icon and the phone number horizontally
    alignItems: 'center',   // Vertically centers the icon and the phone number
},

phoneNumber: {
    marginLeft: 8,          // Provides spacing between the icon and the phone number
},

  details: {
    fontSize: 15,
    marginBottom: 6,
    color: colors.deepBlue,
    fontWeight: 'bold',

  },
  itemName: {
    color: colors.deepBlue,
    fontWeight: 'bold',
    fontSize: 15,
    // marginBottom: 8,
  },
  amount: {
    fontSize: 17,
    fontWeight: 'bold',
    // marginBottom: 10,
    color:colors.pink,
  },
  completeOrderButton: {
    width: '80%',
    height: 55,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10,
    borderColor: colors.pink,
    borderWidth: 2,
    backgroundColor: 'rgba(0, 150, 136, 0.25)', // 80% opacity of #009688
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeOrderText: {
    color: colors.deepBlue,
    fontSize: 18,
    fontWeight: 'bold',
  },
  pickedUp: {
    color: "orange",
    fontWeight: "bold",
    fontSize: 17,
  },
  completed: {
    color: "green",
    fontWeight: "bold",
    fontSize: 16,
  },
  inProgress: {
    color: "red",
    fontWeight: "bold",
    fontSize: 17,
  },
  nameTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
    marginTop:15,
borderTopColor: 'gray',
borderTopWidth: 2,
paddingTop:10,
  },
  mealServingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  amountStatusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom:5,
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // This makes the background semi-transparent
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: colors.darkBlue,
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
    color: colors.darkGray,
    marginBottom: 15,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 15,
  },
  confirmButton: {
    backgroundColor: 'green',
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderRadius: 7,
    marginRight: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: 'red',
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderRadius: 7,
    marginLeft: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailContainer: {
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'space-between',  
    width: '100%', 
    marginTop: 15, 
  },

hostDetailsContainer: {
    flexDirection: 'column',
    flex: 1,
    paddingRight: 10,
},

guestDetailsContainer: {
    flexDirection: 'column',
    flex: 1,
    paddingLeft: 10,
},
arrowIcon: {
  alignSelf: 'center', 
  marginVertical: 5,
},
  clickableAddressContainer: {
    paddingVertical: 5, // Gives some space around the clickable area
    borderBottomWidth: 1, // A simple underline to show it's clickable
    borderBottomColor: 'lightgray', // Color for the underline
    backgroundColor:colors.deepBlue, 
    padding:7,
    borderRadius:10,
  },
  clickableAddress: {
    color: 'whitesmoke', // A common color to indicate clickable links
   
  }
});