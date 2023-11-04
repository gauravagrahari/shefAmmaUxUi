import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import ReviewInput from '../GuestSubComponent/ReviewInput';
import StarRatingInput from '../GuestSubComponent/StarRatingInput';
import {globalStyles,colors} from '../commonMethods/globalStyles';
import { LinearGradient } from 'expo-linear-gradient';

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
  
  const navigateToHostProfile = () => {
    navigation.navigate('HostProfileMealGuest');
  };

  const mealMapping = {
    b: "Breakfast",
    l: "Lunch",
    d: "Dinner"
  };
//   const shouldShowRatingOptions = () => {
//     return order.status === 'com' && order.rating === null && order.review === null;
// };
  return (
    <LinearGradient colors={[ colors.darkBlue,'#fcfddd']} style={styles.card}>
    <View style={styles.orderDetails}>

      <View style={styles.leftSide}>
        <TouchableOpacity onPress={navigateToHostProfile}>
          <Text style={[styles.itemName, styles.linkText]}>{order.nameHost}</Text>
        </TouchableOpacity>
        <Text style={styles.details}>{mealMapping[order.mealType]}</Text>
        <Text style={styles.details}>{order.noOfServing} servings</Text>
        <Text style={styles.details}>{formattedDateTime}</Text>
      </View>

      <View style={styles.rightSide}>
        <Text style={styles.amount}>{order.amount}</Text>
        <Text style={statusStyle}>{fullStatus}</Text>
      </View>
      </View>
      {order.status === 'com' && (
               <View style={styles.ratingReviewSection}>
               {order.rating === null && <StarRatingInput uuidOrder={order.uuidOrder} timeStamp={order.timeStamp} uuidHost={order.uuidHost} geoHost={order.geoHost} />}
               {order.review === null && <ReviewInput uuidOrder={order.uuidOrder} timeStamp={order.timeStamp}/>}
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
    color: colors.primaryText,
    // textDecorationLine: 'underline',
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 8,
  },
  cancelled: {
    color: "red",
    fontWeight: "bold",
    fontSize: 16,
  },
  completed: {
    color: "green",
    fontWeight: "bold",
    fontSize: 16,
  }, 
  inProgress: {
    color: "#FFA500",
    fontWeight: "bold",
    fontSize: 16,
  },
  newOrder: {
    color: colors.primaryText,
    fontWeight: "bold",
    fontSize: 16,
    // backgroundColor: "#e0e0e0", // Specify the background color for new orders
  },
  details: {
    fontSize: 14,
    marginBottom: 6,
    color: colors.deepBlue,
    fontWeight: 'bold',
  },
  itemName: {
    fontSize: 15,
    marginBottom: 6,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    // color: colors.pink,
    color: 'purple',
  },
  ratingReviewSection: {
    // backgroundColor: 'red',  // For visibility
    // flex: 1,
    // width: '100%',           // To occupy full width
    marginTop: 10,  // Add space between the order details and the rating/review section

}

});
