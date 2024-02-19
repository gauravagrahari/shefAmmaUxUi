import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView,Dimensions  } from 'react-native';
import {globalStyles,colors} from '../commonMethods/globalStyles';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import Constants from 'expo-constants';

const ServiceAvailability = () => {
    const [serviceDetails, setServiceDetails] = useState(null);
  
    useEffect(() => {
        const fetchData = async () => {
          const URL = Constants.expoConfig.extra.apiUrl; // Ensure you have URL in your app.json under extra
          try {
            const response = await axios.get(`${URL}/guest/services`);
            setServiceDetails(response.data);
          } catch (error) {
            console.error('Error fetching service details:', error);
            setServiceDetails(null); // In case of error, set serviceDetails to null to show default message
          }
        };
    
        fetchData();
      }, []);
      return (
        <View style={styles.parent}>
          <ScrollView style={{ flexGrow: 1 }} contentContainerStyle={styles.container}>
            <LinearGradient colors={[colors.darkBlue, colors.secondCardColor]} style={styles.card}>
              <Text style={styles.mainHeading}>Our Service Availability</Text>
              {serviceDetails ? (
                <Text style={styles.commonText}>
                  {serviceDetails}
                </Text>
              ) : (
                <Text style={styles.commonText}>
                  Currenty our Services are available in the Kolkata region of Sector 5, Sector 2, Keshtopur, and near DLF 1. Arriving soon at other parts of Kolkata.
                </Text>
              )}
            </LinearGradient>
          </ScrollView>
        </View>
      );
    };
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  parent:{
        flex: 1,
    justifyContent: 'center', // Center content vertically
    // padding: screenWidth * 0.05,
    backgroundColor:"#FF47A8",
    alignItems:'center'
  },
  container: {
    // flex: 1,
    // justifyContent: 'center', // Center content vertically
    padding: screenWidth * 0.05,
    backgroundColor:"#FF47A8",
    marginVertical: 20,
},
  card: {
    padding: screenWidth * 0.043,
    borderRadius: 15,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    margin: 10,
    backgroundColor: 'white', // Assuming you want to keep the card white
  },
  mainHeading: {
    fontSize: screenWidth * 0.055,
    fontWeight: 'bold',
    marginVertical: 20,
    color: colors.deepBlue,
  },
  commonText: {
    fontSize: screenWidth * 0.04,
    marginVertical: 10,
    color: colors.pink,
  },
  heading: {
    fontSize: screenWidth * 0.045,
    fontWeight: 'bold',
    color: colors.deepBlue,
    marginBottom: 10,
  },
  text: {
    fontSize: screenWidth * 0.042,
    color: colors.pink,
  },
});

export default ServiceAvailability;