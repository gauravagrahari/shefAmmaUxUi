import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../commonMethods/globalStyles';

const OrderCardHost = ({ order, cancelCutOffTime }) => {
  console.log('Processing order:', order);

  const statusMappings = {
    new: "New",
    ip: "In Progress",
    pkd: "On the Way",
    com: "Delivered",
    can: "Cancelled",
    unpkd: "Not PickedUp",
    undel: "Not Delivered",
  };

  const getFullStatus = (status) => statusMappings[status] || status;

  const formatDate = (dateString, showTime = true) => {
    const options = showTime ? { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true } 
                             : { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleString('en-IN', options);
  };

  const mealMapping = {
    b: "Breakfast",
    l: "Lunch",
    d: "Dinner"
  };

  // Extract first time slot only
  const firstTimeSlot = order.delTimeAndDay ? order.delTimeAndDay.split(' and ')[0] : 'N/A';
  
  return (
    <LinearGradient colors={[colors.darkBlue, colors.secondCardColor]} style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.name}>{order.nameGuest}</Text>
        <Text style={[styles.status, styles[order.status]]}>{getFullStatus(order.status)}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Detail label="Booked at" value={formatDate(order.timeStamp)} />
        <Detail label="No. of Servings" value={order.noOfServing.toString()} />
        <Detail label="Prepare by" value={firstTimeSlot} />
        <Detail label="Meal Type" value={mealMapping[order.mealType]} />
      </View>
    </LinearGradient>
  );
}
  const Detail = ({ label, value }) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}:</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
  
  const styles = StyleSheet.create({
    card: {
      borderRadius: 10,
      marginVertical: 5,
      marginHorizontal: 7,
      elevation: 4,
      overflow: 'hidden',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.lightGray,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderBottomColor:'lightgray',
      borderBottomWidth: 1,
    },
    name: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.deepBlue,
    },
    status: {
      fontWeight: 'bold',
      fontSize: 19,
      borderRadius: 5,
      paddingHorizontal: 6,
      paddingVertical: 2,
      overflow: 'hidden',
    },
    detailsContainer: {
      backgroundColor: colors.lightGray,
      padding: 10,
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 4,
    },
    detailLabel: {
      fontSize: 15,
      color: colors.deepBlue,
    },
    detailValue: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.darkSeaBlue,
    },
    new: { color: colors.pink },
    ip: { color: 'yellow' },
    pkd: { color: colors.dodgerBlue },
    com: { color: colors.green },
    can: { color: colors.red },
    unpkd: { color: colors.violet },
    undel: { color: colors.brown },
  });
  

export default OrderCardHost;
