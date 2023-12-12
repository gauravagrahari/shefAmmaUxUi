import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import ReviewInput from '../GuestSubComponent/ReviewInput';
import StarRatingInput from '../GuestSubComponent/StarRatingInput';
import {globalStyles,colors} from '../commonMethods/globalStyles';
import { LinearGradient } from 'expo-linear-gradient';
import { getFromSecureStore } from '../Context/SensitiveDataStorage';
import axios from 'axios';
import config from '../Context/constants';
import * as Animatable from 'react-native-animatable';

const URL = config.URL;
export default function OrderCard({ order, navigation }) {
  const statusMappings = {
    new:"New",
    ip: "In Progress",
    pkd:"On the Way",
    com: "Delivered",
    can: "Cancelled",
   unpkd:"Not PickedUp",
   undel:"Not Delivered",
};

  const getFullStatus = (shortStatus) => {
    return statusMappings[order.status] || order.status;
  };

  let statusStyle;
  const fullStatus = getFullStatus(order.status);
  if (fullStatus === "Cancelled") {
    statusStyle = styles.cancelled;
  } else if (fullStatus === "Delivered") {
    statusStyle = styles.completed;
  } else if (fullStatus === "In Progress") {
    statusStyle = styles.inProgress;
  } else if (fullStatus === "New") {
    statusStyle = styles.newOrder;
  }else if (fullStatus === "Not Delivered") {
    statusStyle = styles.cancelled;
  }else if (fullStatus === "On the Way") {
    statusStyle = styles.inProgress;
  }
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [isModalVisible, setModalVisible] = React.useState(false);
  const options = {
    year: 'numeric', 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit', 
    second: undefined, // Exclude seconds
    hour12: true // Use 12-hour time (remove this line if you want 24-hour time)
  };

  const formattedDateTime = new Date(order.timeStamp).toLocaleString('en-IN', options);
  
 

  const mealMapping = {
    b: "Breakfast",
    l: "Lunch",
    d: "Dinner"
  };
  const getCutoffTime = (delTimeAndDay) => {
    if (!delTimeAndDay) {
      return null;
    }
  
    try {
      const parts = delTimeAndDay.split(', '); // Split by comma and space
      if (parts.length < 3) {
        return null;
      }
const dayMonthPart = parts[1]; 
      const timePart = parts[2].split(' and ')[0]; 
      const year = new Date().getFullYear();
const [day, month] = dayMonthPart.split(' ');

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const monthNumber = monthNames.indexOf(month) + 1;

const monthPadded = monthNumber.toString().padStart(2, '0');

const dateString = `${year}-${monthPadded}-${day}T${timePart}:00`;
      // Create the Date object from the dateString
      const dateTime = new Date(dateString);
      if (isNaN(dateTime)) {
        return null;
      }
      
      // Subtract 3 hours to get the cutoff time
      const cutoffTime = new Date(dateTime.setHours(dateTime.getHours() - 3));
      
      return cutoffTime;
    } catch (error) {
      console.error('Error parsing date:', error);
      return null;
    }
  };
  const handleConfirm = () => {
    setModalVisible(true);
  };
  const canCancel = (order) => {
    if (!order.delTimeAndDay || (order.status !== 'new' && order.status !== 'pkd')) {
      return false;
    }

    const currentTime = new Date();
    const cutoffTime = getCutoffTime(order.delTimeAndDay);

    if (!cutoffTime) {
      return false;
    }

    return currentTime < cutoffTime;
  };
  const handleCancelOrderButton = async () => {
    try {
      const currentTimestamp = new Date().toISOString(); // Assuming you want to send the current timestamp
      const attributeName = "status"; // Assuming you're updating the 'status' attribute
      const token = await getFromSecureStore('token');
      const attributeName2 = "cancelledTime";
      

      const orderEntity = {
      status: "can", // or whatever status value you want to set
      uuidOrder:order.uuidOrder,
      timeStamp: order.timeStamp,
      cancelledTime: currentTimestamp,
      noOfServing:order.noOfServing,
      mealType:order.mealType
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
        order.status='can';
        setShowConfirmation(false); // Hide confirmation prompt after action
      } else {
        console.error("Unexpected response:", response.data);
      }
    } catch (error) {
      console.error("Error cancelling the order:", error);
    }
  };
//   const shouldShowRatingOptions = () => {
//     return order.status === 'com' && order.rating === null && order.review === null;
// };
  return (
    <LinearGradient colors={[ colors.darkBlue,'#fcfddd']} style={styles.card}>
   <View style={styles.orderDetails}>

<View style={styles.leftSide}>
  {/* <TouchableOpacity > */}
    <Text style={[styles.itemName]}>{order.nameHost}</Text>
  {/* </TouchableOpacity> */}
  <Text style={styles.detailsMealType}>{mealMapping[order.mealType]}</Text>
  <Text style={styles.details}>Quantity - {order.noOfServing}</Text>
  <Text style={styles.details}>Booked on - {formattedDateTime}</Text>
</View>

<View style={styles.rightSide}>
  <Text style={styles.amount}>{order.amount}</Text>
  <Animatable.Text
            iterationDelay={2400}
          easing="ease-out"
                animation="rubberBand"
                useNativeDriver 
                iterationCount='infinite'>
  <Text style={statusStyle}>{fullStatus}</Text>
  </Animatable.Text>
</View>

</View>
{['new', 'ip'].includes(order.status) ? (
        canCancel(order) ? (
          showConfirmation ? (
            // Inline confirmation prompt
            <View style={styles.confirmationPrompt}>
              <Text style={styles.confirmationText}>
                We feel sad! Do you really want to cancel this order?
              </Text>
              <TouchableOpacity style={styles.yesButton} onPress={handleCancelOrderButton}>
                <Text style={styles.btnText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.noButton} onPress={() => setShowConfirmation(false)}>
              <Animatable.Text
            // iterationDelay={1000}
          easing="ease-out"
                animation="pulse"
                useNativeDriver 
                iterationCount='infinite'>
                <Text style={styles.btnText}>No</Text>
                </Animatable.Text>
              </TouchableOpacity>
            </View>
          ) : (<>
            <Text style={styles.confirmationText}>Your {mealMapping[order.mealType]} will be reaching to you at {order.delTimeAndDay}!</Text>

            <View style={globalStyles.centralisingContainer}>
            <TouchableOpacity style={styles.orderButton} onPress={() => setShowConfirmation(true)}>
              <Text style={styles.btnText}>Cancel Order</Text>
            </TouchableOpacity>
            </View>
            </>
          )
        ) : (
          // Message when the order can't be cancelled
          <Text style={styles.confirmationText}>Your {mealMapping[order.mealType]} will be reaching to you at {order.delTimeAndDay}!</Text>
        )
      ) : null }
{order.status === 'com' && order.rating === null && (
<View style={styles.ratingReviewSection}>
  <StarRatingInput uuidOrder={order.uuidOrder} timeStamp={order.timeStamp} uuidHost={order.uuidHost} geoHost={order.geoHost} />
  <ReviewInput uuidOrder={order.uuidOrder} timeStamp={order.timeStamp}/>
</View>
)}
</LinearGradient>
);
}
const styles = StyleSheet.create({
  card: {
    flexDirection: 'column',  // Change row to column
    justifyContent: 'space-between',
    // borderWidth: 1,
    // borderColor: "#e0e0e0",
    // borderRadius: 8,
    // margin: 3,
    padding: 12,
    backgroundColor: colors.darkBlue,
    shadowColor: '#aaa',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
    borderBottomColor:colors.pink,
    borderBottomWidth:4,
},
orderButton: {
  width: '50%',
  height: 35,
  marginTop: 9,
  marginBottom: 5,
  borderRadius: 10,
  borderColor: colors.pink,
  borderWidth: 1,
  backgroundColor: 'rgba(0, 150, 136, 0.15)', // 80% opacity of #009688
  justifyContent: 'center',
  alignItems: 'center',
},
orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
},
  leftSide: {
    flex: 2,
  },
  rightSide: {
    flex: 1,
    alignItems: 'flex-end',
  },
  linkText: {
    color: colors.deepBlue,
    // textDecorationLine: 'underline',
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 8,
  },
  cancelled: {
    color: "red",
    fontWeight: "bold",
    fontSize: 18,
  },
  completed: {
    color: "green",
    fontWeight: "bold",
    fontSize: 18,
  }, 
  inProgress: {
    color: "#FFA500",
    fontWeight: "bold",
    fontSize: 18,
  },
  newOrder: {
    color: colors.primaryText,
    fontWeight: "bold",
    fontSize: 18,
    // backgroundColor: "#e0e0e0", // Specify the background color for new orders
  },
  detailsMealType: {
    fontSize: 16,
    marginBottom: 6,
    color: colors.deepBlue,
    fontWeight: 'bold',
  },
  details: {
    fontSize: 14,
    marginBottom: 6,
    color: colors.pink,
    // fontWeight: 'bold',
  },
  itemName: {
    fontSize: 17,
    marginBottom: 6,
     fontWeight: 'bold',
     color: colors.pink,
  },
  amount: {
    fontSize: 18,
    // fontWeight: 'bold',
    marginBottom: 10,
    // color: colors.pink,
    color: 'purple',
  },
  ratingReviewSection: {
    // backgroundColor: 'red',  // For visibility
    // flex: 1,
    // width: '100%',           // To occupy full width
    marginTop: 10,  // Add space between the order details and the rating/review section
},
confirmationPrompt: {
  flexDirection: 'row', // Aligns children horizontally
  alignItems: 'center', // Centers children vertically in the cross axis
  justifyContent: 'center', // Centers children horizontally in the main axis
  padding: 10, // Add some padding for spacing
  marginTop: 10, // Give some space from the above element
},
confirmationText: {
  flex: 1, // Takes up as much space as possible
  marginRight: 10, // Add some margin to the right of the text
  fontSize: 16, // Standard readable size
  color: colors.matBlack, // Assuming a light background, otherwise choose a contrasting color
},
yesButton: {
  backgroundColor: 'rgba(0, 150, 136, 0.05)', // 80% opacity of #009688
  paddingVertical: 8, // Modest padding for touch area
  paddingHorizontal: 16, // Horizontal padding
  borderRadius: 5, // Rounded corners
  marginRight: 10, // Space between the Yes and No buttons
  borderRadius: 10,
  borderColor: colors.pink,
  borderWidth: 1.5,
},
noButton: {
  backgroundColor: 'rgba(0, 150, 136, 0.15)', // 80% opacity of #009688
  paddingVertical: 8,
  paddingHorizontal: 16,
  borderRadius: 5,
  borderRadius: 10,
  borderColor: colors.pink,
  borderWidth: 2,
},
btnText: {
  color: colors.deepBlue, // Text color that stands out on the buttons
  fontSize: 16, // Matching font size with the confirmation text
  textAlign: 'center', // Center text inside the button
},

});
//when cancelled then the currentcapacity should get increased by nOfserving in db.
//when calling the updateattibute method in db twice, instead update the complete item at once