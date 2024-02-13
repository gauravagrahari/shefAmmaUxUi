import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet,Dimensions, ScrollView  } from 'react-native';
import { getFromSecureStore } from '../Context/SensitiveDataStorage';
import {globalStyles,colors} from '../commonMethods/globalStyles';
const { width } = Dimensions.get('window');

const CancellationPolicy = () => {
  const [lunchCutoffTime, setLunchCutoffTime] = useState('');
  const [dinnerCutoffTime, setDinnerCutoffTime] = useState('');

  useEffect(() => {
    const fetchChargesAndCalculateTimes = async () => {
      try {
        const charges = await getFromSecureStore('charges');
        if (charges) {
          setLunchCutoffTime(calculateCutoffTime(charges.lunchStartTime, charges.cancelCutOffTime));
          setDinnerCutoffTime(calculateCutoffTime(charges.dinnerStartTime, charges.cancelCutOffTime));
        }
      } catch (error) {
        console.error('Error fetching charges:', error);
      }
    };

    fetchChargesAndCalculateTimes();
  }, []);

  const calculateCutoffTime = (mealTime, cancelCutOffTime) => {
    const [hours, minutes] = mealTime.split(':').map(Number);
    const dateTime = new Date();
    dateTime.setHours(hours, minutes - cancelCutOffTime, 0, 0);

    return dateTime.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cancellation Policy</Text>
      
      <View style={styles.card}>
        <Text style={styles.info}>
          To ensure a smooth experience for both our guests and home-cooks, we have a clear cancellation policy. Please review the following details:
        </Text>

        <View style={styles.mealTimeRow}>
          <Text style={styles.mealTimeLabel}>Lunch Cancellation Cutoff: </Text>
          <Text style={styles.mealTimeValue}>{lunchCutoffTime}</Text>
        </View>

        <View style={styles.mealTimeRow}>
          <Text style={styles.mealTimeLabel}>Dinner Cancellation Cutoff: </Text>
          <Text style={styles.mealTimeValue}>{dinnerCutoffTime}</Text>
        </View>

        <Text style={styles.detail}>
          - Orders are eligible for cancellation only before the cutoff time. After this time, our home-cooks start preparing your order.
        </Text>
        <Text style={styles.detail}>
          - Once the cutoff time has passed, the cancellation option will no longer be available, and the order will not be eligible for cancellation.
        </Text>
        <Text style={styles.detail}>
          - Cancelling your order within the stipulated time will not incur any extra charges. If you have already made a payment, it will be fully refunded.
        </Text>
      </View>

      <Text style={styles.additionalInfo}>
        We appreciate your understanding and cooperation in ensuring that we can provide the best service possible!
      </Text>
    </ScrollView>
  );
};
const scaleFontSize = (size) => {
    const screenWidth = Dimensions.get('window').width;
    const scaleFactor = screenWidth / 320; // Base scale on standard screen width (e.g., iPhone SE)
    return Math.round(size * scaleFactor);
  };
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:colors.darkBlue,
  },
  title: {
    fontSize: scaleFontSize(20), 
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color:colors.pink,
  },
  card: {
    backgroundColor: colors.darkBlue,
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    width: width * 0.9, 
  },
  mealTimeRow: {
    flexDirection: 'row', // Align label and value in one line
    alignItems: 'center',
    marginBottom: 5,
  },
  mealTimeLabel: {
    fontSize: scaleFontSize(15), // Responsive font size
    fontWeight: 'bold',
    color: colors.lightishPink, // Existing color for label
  },
  mealTimeValue: {
    fontSize: scaleFontSize(16), // Responsive font size
    fontWeight: 'bold',
    color: colors.pink, // Pink color for the time
  },
  info: {
    fontSize: scaleFontSize(13), // Responsive font size
    marginBottom: 10,
    color: colors.lightishPink,
  },
//   mealTime: {
//     fontSize: scaleFontSize(16), // Responsive font size
//     fontWeight: 'bold',
//     marginVertical: 5,
//     color:colors.lightishPink,
//   },
  detail: {
    fontSize: scaleFontSize(13), // Responsive font size
    marginTop: 10,
    color:colors.lightishPink,
  },
  additionalInfo: {
    fontSize: scaleFontSize(14), // Responsive font size
    marginTop: 20,
    textAlign: 'center',
    color:colors.pink,
  }
});

export default CancellationPolicy;