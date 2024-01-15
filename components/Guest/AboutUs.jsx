import React from 'react';
import { View, Text, StyleSheet, ScrollView,Dimensions  } from 'react-native';
import {globalStyles,colors} from '../commonMethods/globalStyles';
import { LinearGradient } from 'expo-linear-gradient';

const AboutUs = () => {
  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.darkBlue, colors.secondCardColor]} style={styles.card}>
        <Text style={styles.mainHeading}>ShefAmma: Nourishing Kolkata with Homemade Meals</Text>
        <Text style={styles.commonText}>
          ShefAmma brings the essence of Kolkata's culinary tradition to your doorstep. Our mission is simple - to provide delicious, home-cooked meals in the midst of your busy life. Our chefs, the loving moms of Kolkata, cook each dish with care, infusing traditional flavors in every bite.
        </Text>
        <Text style={styles.heading}>Our Values:</Text>
        <Text style={styles.text}>
          - Authentic recipes, creating genuine flavors.
        </Text>
        <Text style={styles.text}>
          - Fresh, quality ingredients for healthy eating.
        </Text>
        <Text style={styles.text}>
          - Building a community of food lovers and home chefs.
        </Text>
        <Text style={styles.commonText}>
          Choose ShefAmma for affordable, tasty, and hygienic home food. We are more than a service; we are an experience of homely comfort and cultural richness.
        </Text>
        <Text style={styles.commonText}>
          Join us in celebrating Kolkata's heritage with every meal from ShefAmma.
        </Text>
      </LinearGradient>
    </View>
  );
};
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Center content vertically
    padding: screenWidth * 0.05,
    backgroundColor:"#FF47A8",
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

export default AboutUs;