import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { globalStyles, colors } from '../commonMethods/globalStyles';
import { useNavigation } from '@react-navigation/native';

const GiveReviewCard = () => {
    const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('ReviewPage');
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <LinearGradient colors={[colors.seaBlue, colors.lightPink]} style={styles.card}>
        <Text style={styles.heading}>We Value Your Feedback!</Text>
        <Text style={styles.text}>Tap here to share your thoughts on our food and service.</Text>
        <Text style={styles.dailyMenuText}>Your insights will help us enhance your dining experience.</Text>
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

export default GiveReviewCard;
