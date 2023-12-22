import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { View, Text, StyleSheet } from 'react-native';
import { getFromSecureStore, storeInSecureStore } from '../Context/SensitiveDataStorage';
import config from '../Context/constants';
import {globalStyles,colors} from '../commonMethods/globalStyles';
import { LinearGradient } from 'expo-linear-gradient';

const URL = config.URL;
const ChargesDisplay = () => {
    const [charges, setCharges] = useState(null);
  
    useEffect(() => {
      const fetchData = async () => {
        const token = await getFromSecureStore('token');
        const charges = await getFromSecureStore('charges');
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
        <LinearGradient colors={['white', colors.darkBlue]} style={styles.card}>
          <Text style={styles.heading}>{mealName} Timing</Text>
          <Text style={styles.text}>Delivery Window: {formatTime(startTime)} - {formatTime(endTime)}</Text>
          <Text style={styles.text}>Booking Cut-off Time: {formatTime(bookTime)}</Text>
        </LinearGradient>
      );
    
      return (
        <LinearGradient colors={[colors.darkBlue, 'white']} style={styles.container}>
          <Text style={globalStyles.headerText}>Meal Timings and Booking Information</Text>
          <Text style={styles.commonText}>
            The Delivery Window indicates the time frame during which we delightfully deliver your meal.
            {"\n"}The Booking Cut-off Time helps us ensure timely delivery; orders placed before this time are guaranteed delivery today, while orders after this time are warmly scheduled for tomorrow's delivery.
          </Text>
          {charges ? (
            <>
              {renderMealTiming('Breakfast', charges.breakfastStartTime, charges.breakfastEndTime, charges.breakfastBookTime)}
              {renderMealTiming('Lunch', charges.lunchStartTime, charges.lunchEndTime, charges.lunchBookTime)}
              {renderMealTiming('Dinner', charges.dinnerStartTime, charges.dinnerEndTime, charges.dinnerBookTime)}
            </>
          ) : (
            <Text>Loading charges...</Text>
          )}
        </LinearGradient>
      );
    };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
    },
    card: {
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
      fontSize: 22,
      fontWeight: 'bold',
      marginVertical: 20,
    },
    commonText: {
        fontSize: 16,
        marginVertical: 10,
        paddingHorizontal: 20,
      },
    heading: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    text: {
      fontSize: 16,
    },
  });
  
  export default ChargesDisplay;