import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { View, Text,ScrollView, StyleSheet,Dimensions  } from 'react-native';
import { getFromSecureStore, storeInSecureStore } from '../Context/SensitiveDataStorage';
import config from '../Context/constants';
import {globalStyles,colors} from '../commonMethods/globalStyles';
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants';
const URL = Constants.expoConfig.extra.apiUrl;
const ChargesDisplay = () => {
    const [charges, setCharges] = useState(null);
  
    useEffect(() => {
      const fetchData = async () => {
        const token = await getFromSecureStore('token');
        const charges = await getFromSecureStore('charges');
        if (!token) {
          navigation.navigate('LoginGuest');
          return; 
        }
        if (!charges) {
            try {
                const response = await axios.get(`${URL}/guest/getCharges`, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                });
                await storeInSecureStore('charges', JSON.stringify(response.data));
                setCharges(response.data);
              } catch (error) {
                console.error('Error fetching charges:', error);
              }
        }
        else{
            setCharges(charges);
        }
     
      };
      fetchData();
    }, []);
  
    const formatTime = (time) => {
        let [hours, minutes] = time.split(':');
        hours = parseInt(hours, 10);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return `${hours}:${minutes} ${ampm}`;
      };
    
      const renderMealTiming = (mealName, startTime, endTime, bookTime) => (
        <LinearGradient colors={[colors.darkBlue,'white']} style={styles.card}>
          <Text style={styles.heading}>{mealName} Timing</Text>
          <Text style={styles.text}>Delivery Window: {formatTime(startTime)} - {formatTime(endTime)}</Text>
          <Text style={styles.text}>Booking Cut-off Time: {formatTime(bookTime)}</Text>
        </LinearGradient>
      );
    
      return (
        <ScrollView style={styles.scrollContainer}>
          <LinearGradient colors={[colors.darkBlue, colors.darkBlue]} style={styles.container}>
            <Text style={globalStyles.headerText}>Meal Timings and Booking Information</Text>
            <Text style={styles.commonText}>
              The Delivery Window indicates the time frame during which we delightfully deliver your meal.
              {"\n"}{"\n"}The Booking Cut-off Time helps us ensure timely delivery; orders placed before this time will be delivered today, while orders after this time are warmly scheduled for tomorrow's delivery.
              {"\n"}{"\n"}We're gearing up to launch our Breakfast service soon. Stay tuned!
            </Text>
            {charges ? (
              <>
                {renderMealTiming('Breakfast', charges.breakfastStartTime, charges.breakfastEndTime, charges.breakfastBookTime)}
                {renderMealTiming('Lunch', charges.lunchStartTime, charges.lunchEndTime, charges.lunchBookTime)}
                {renderMealTiming('Dinner', charges.dinnerStartTime, charges.dinnerEndTime, charges.dinnerBookTime)}
              </>
            ) : (
              <Text style={styles.heading}>Loading timings...</Text>
            )}
          </LinearGradient>
        </ScrollView>
      );
    };
    const { width } = Dimensions.get('window'); // Get the width of the device screen

  const styles = StyleSheet.create({
    scrollContainer: {
      flex: 1,
      backgroundColor: colors.darkBlue,

    },
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
      padding: width * 0.05, // 5% of screen width
    },
    card: {
      width: '100%', // Full width
      margin: 10,
      padding: 20,
      borderRadius: 10,
      backgroundColor: 'white',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
    },
    mainHeading: {
      fontSize: width * 0.055, // Proportional to screen width
      fontWeight: 'bold',
      marginVertical: 20,
    },
    commonText: {
      fontSize: width * 0.04, // Proportional to screen width
      marginVertical: 10,
      color: colors.deepBlue,
      paddingHorizontal: 20,
    },
    heading: {
      fontSize: width * 0.045, // Proportional to screen width
      fontWeight: 'bold',
      color: colors.deepBlue,
      marginBottom: 10,
    },
    text: {
      fontSize: width * 0.04, // Proportional to screen width
      color: colors.pink,
    },
  });
  
  export default ChargesDisplay;