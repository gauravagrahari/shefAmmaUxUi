import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { globalStyles, colors } from '../commonMethods/globalStyles';
import { LinearGradient } from 'expo-linear-gradient';

const AboutUs = () => {
  return (
    <View style={styles.parent}>
      <ScrollView style={{ flexGrow: 1 }} contentContainerStyle={styles.container}>
        <LinearGradient colors={[colors.darkBlue, colors.secondCardColor]} style={styles.card}>
          <View style={styles.mainHeadingView}>
          <Text style={styles.mainHeading}>About ShefAmma</Text>
          </View>
          <Text style={styles.commonText}>
            Born from the need for trustworthy, home-cooked meals for corporate employees and students away from home, ShefAmma offers a reliable solution that ensures both hygiene and nutrition.
          </Text>
          
          <Text style={styles.commonText}>
            From our beginnings with a dedicated network of local cooks to leveraging advanced technology, we are expanding across Kolkata with plans to reach every major corporate hub in India.
          </Text>
          
          <Text style={styles.heading}>Our Core Values</Text>
          <Text style={styles.text}>
            At ShefAmma, we believe in the nourishing power of home-cooked meals and are committed to providing high-quality, hygienic food that nurtures both body and soul.
          </Text>
          
          <Text style={styles.heading}>Our Goals</Text>
          <Text style={styles.text}>
            We aim to become a household name across India, synonymous with health, convenience, and home cooking. Join us as we make healthy, homemade meals accessible to all.
          </Text>
          
          <Text style={styles.heading}>Our Impact</Text>
          <Text style={styles.commonText}>
            Driven by the potential to make a positive change, ShefAmma is connecting local cooks with a broader audience, fostering community bonds and empowering individuals.
          </Text>
          
          <Text style={styles.commonText}>
            Discover the joy of dining on meals that feel like they’ve been prepared in your own kitchen. Visit us at www.shefamma.com and be part of our journey.
          </Text>
        </LinearGradient>
      </ScrollView>
    </View>
  );
};

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    justifyContent: 'center', // Center content vertically
    backgroundColor: colors.darkBlue,
    alignItems: 'center'
  },
  container: {
    padding: screenWidth * 0.05,
    backgroundColor: colors.darkBlue,
    marginVertical: 8,
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
    backgroundColor: 'white',
  },
  mainHeadingView: {
    flex:1,
    alignItems:'center',
  },
  mainHeading: {
    fontSize: screenWidth * 0.055,
    fontWeight: 'bold',
    marginVertical: 10,
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
