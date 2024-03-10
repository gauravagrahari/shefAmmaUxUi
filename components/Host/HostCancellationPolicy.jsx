import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { getFromSecureStore } from '../Context/SensitiveDataStorage';
import { globalStyles, colors } from '../commonMethods/globalStyles';

const HostCancellationPolicy = () => {
  const [lunchCutoffTime, setLunchCutoffTime] = useState('');
  const [dinnerCutoffTime, setDinnerCutoffTime] = useState('');

  useEffect(() => {
    const fetchChargesAndCalculateTimes = async () => {
      try {
        let charges = await getFromSecureStore('charges');
        // Add a check to ensure charges is a string and not already an object
        if (typeof charges === 'string') {
          try {
            charges = JSON.parse(charges);
          } catch (parseError) {
            console.error('Error parsing charges JSON:', parseError);
            // Handle the parsing error (e.g., by resetting charges or setting a default value)
            charges = null; // Example: reset to null or set a default structure
          }
        }
    
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
    <View style={styles.parent}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Host Cancellation Policy</Text>

        <View style={styles.card}>
          <Text style={styles.info}>
            As a host, understanding when orders can be cancelled allows you to plan your meal preparations efficiently. Below are the cut-off times:
          </Text>

          <View style={styles.mealTimeRow}>
            <Text style={styles.mealTimeLabel}>Lunch Preparation Cutoff: </Text>
            <Text style={styles.mealTimeValue}>{lunchCutoffTime}</Text>
          </View>

          <View style={styles.mealTimeRow}>
            <Text style={styles.mealTimeLabel}>Dinner Preparation Cutoff: </Text>
            <Text style={styles.mealTimeValue}>{dinnerCutoffTime}</Text>
          </View>

          <Text style={styles.detail}>
            - Begin preparing meals only after these cutoff times to ensure there are no cancellations.
          </Text>
          <Text style={styles.detail}>
            - This helps in managing your resources more effectively and reducing food waste.
          </Text>
          <Text style={styles.detail}>
            - Adhering to these times guarantees that you are fully compensated for each meal prepared.
          </Text>
        </View>

        <Text style={styles.additionalInfo}>
          We value your dedication and strive to support you in offering an outstanding service to our guests. Thank you for being an integral part of our community!
        </Text>
      </ScrollView>
    </View>
  );
};
const { width, height } = Dimensions.get('window');
const scaleFontSize = (fontSize) => {
  const scale = width / 320; // Assumes 320 as the base width to scale from
  const newSize = fontSize * scale;
  return Math.round(newSize);
};
const styles = StyleSheet.create({
  parent: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.darkBlue,
    alignItems: 'center'
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: width * 0.05,
  },
  title: {
    fontSize: scaleFontSize(18),
    fontWeight: 'bold',
    marginBottom: height * 0.02,
    textAlign: 'center',
    color: colors.pink,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 10,
    padding: width * 0.05,
    borderWidth:3,
    borderColor:'lightgray',
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.1,
    // shadowRadius: 2,
    // elevation: 2,
    width: width * 0.9,
  },
  mealTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.01,
  },
  mealTimeLabel: {
    fontSize: scaleFontSize(14.2),
    fontWeight: 'bold',
    color: colors.lightishPink,
  },
  mealTimeValue: {
    fontSize: scaleFontSize(14.4),
    fontWeight: 'bold',
    color: colors.pink,
  },
  info: {
    fontSize: scaleFontSize(14),
    marginBottom: height * 0.02,
    color: colors.lightishPink,
    textAlign: 'justify',
  },
  detail: {
    fontSize: scaleFontSize(14),
    marginTop: height * 0.01,
    color: colors.lightishPink,
    textAlign: 'justify',
  },
  additionalInfo: {
    fontSize: scaleFontSize(14),
    marginTop: height * 0.02,
    textAlign: 'center',
    color: colors.pink,
  },
});

export default HostCancellationPolicy;
