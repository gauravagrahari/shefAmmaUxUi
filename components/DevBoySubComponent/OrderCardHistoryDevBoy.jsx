import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import { globalStyles, colors } from '../commonMethods/globalStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

export default function OrderCardHistoryDevBoy({ orderData, navigation }) {
//   const [isModalVisible, setModalVisible] = useState(false);

  console.log("order data:", JSON.stringify(orderData));
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
        statusStyle = styles.inProgress;
        break;
    case "New":
      statusStyle = styles.newOrder;
      break;
    default:
      break;
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
  const formattedDateTime = new Date(orderData.timeStamp).toLocaleString();
  const formattedDateTimeDelivery = orderData.deliverTime ? new Date(orderData.deliverTime).toLocaleString('en-US', options) : null;
  const mealMapping = {
    b: "Breakfast",
    l: "Lunch",
    d: "Dinner"
  };

  
  return (
    <LinearGradient colors={[ colors.darkBlue,colors.secondCardColor]} style={styles.card}>
     <View style={styles.namesWithArrowContainer}>
        <TouchableOpacity >
          <Text style={[styles.itemName, styles.linkText]}>{orderData.nameHost}</Text>
        </TouchableOpacity>

        <Icon
          name="arrow-down-outline"
          size={30}
          color={colors.primaryText}
          style={styles.arrowIcon}
        />

        <Text style={[styles.itemName, styles.linkText]}>{orderData.nameGuest}</Text>
      </View>
      {/* <View style={styles.nameTimeContainer}>
        <Text style={styles.details}>{formattedDateTime}</Text>
      </View> */}

      {/* Meal Type and Number of Servings Row */}
      <View style={styles.mealServingContainer}>
        <Text style={styles.details}>{mealMapping[orderData.mealType]}</Text>
        <Text style={styles.details}>Items : {orderData.noOfServing}</Text>
      </View>
      {formattedDateTimeDelivery && (
      <View style={styles.mealServingContainer}>
        <Text style={styles.details}>Delivered at -</Text>
        <Text style={styles.details}>{formattedDateTimeDelivery}</Text>
      </View>
    )}
      <View style={styles.amountStatusContainer}>
        <Text style={styles.amount}>{orderData.amount}</Text>
        <Text style={statusStyle}>{fullStatus}</Text>
      </View>
      
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  card: {
    flexDirection: 'column',
    padding: 12,
    margin: 3,
    backgroundColor: '#0D47A1', // Dark blue color, adjust the shade as needed
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.deepBlue,
    marginBottom: 4, // Spacing between the name and the details below
  },
  linkText: {
    // color: '#BBDEFB', // Lighter shade of blue for links
    // textDecorationLine: 'underline',
  },
  nameTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  namesWithArrowContainer: {
    alignItems: 'center', // Center items horizontally in the container
    justifyContent: 'center', // Center items vertically in the container
    flexDirection: 'column', // Arrange items in a column
    marginBottom: 12, // Add some space below the container for separation
  },
  arrowIcon: {
    marginVertical: 2, // Add some vertical space around the arrow
  },
  details: {
    fontSize: 14,
    color: colors.pink,
    fontWeight: 'bold',
    paddingVertical: 2, // Adds space above and below the text
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
    marginBottom: 6,
  },
  amount: {
    fontSize: 16,
    fontWeight: '500',
    color:'red', // Yellow tint for amount to make it stand out
  },
  // // Add a new style for status text
  // statusStyle: {
  //   fontSize: 14,
  //   fontWeight: 'bold',
  //   color: '#C6FF00', // A bright color for status to make it pop
  // },
  cancelled: {
    color: "red",
    fontWeight: "bold",
    fontSize: 15,
  },
  completed: {
    color: "green",
    fontWeight: "bold",
    fontSize: 15,
  },
  inProgress: {
    color: "brown",
    fontWeight: "bold",
    fontSize: 17,
  },
  // Add any other styles you might need for other elements
});
