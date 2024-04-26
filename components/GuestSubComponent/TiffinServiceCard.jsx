import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { globalStyles, colors } from '../commonMethods/globalStyles';

const TiffinServiceCard = () => {
  const handlePress = () => {
    Linking.openURL('https://www.shefamma.com/services');
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <LinearGradient colors={[colors.seaBlue, colors.lightPink]} style={styles.card}>
        <Text style={styles.heading}>To avoid the hassle of daily booking, avail our monthly plan.</Text>
        <Text style={styles.text}>Tiffin services are available. Visit our website to check the details. Tap here.</Text>
        <Text style={styles.dailyMenuText}>Check what we're serving each day of the week!</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    margin: 5,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 1.62,
    elevation: 2,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.white,
  },
  text: {
    fontSize: 15,
    color: 'white',
    marginBottom: 10, // Added margin for spacing
  },
  dailyMenuText: {
    fontSize: 14,
    color: colors.seaBlue,
    fontStyle: 'italic', // Italicize for emphasis
    fontWeight: 'bold', // Bold for importance
  },
});

export default TiffinServiceCard;
