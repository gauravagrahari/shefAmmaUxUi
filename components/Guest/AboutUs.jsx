import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import colors from './path-to-colors'; // Import your colors file

const AboutUs = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
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
      </View>
    </ScrollView>
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
    color: colors.deepBlue,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.deepBlue,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: colors.deepBlue,
  },
});

export default AboutUs;
