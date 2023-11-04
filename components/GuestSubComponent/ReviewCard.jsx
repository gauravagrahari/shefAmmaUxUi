import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ReviewCard({ prop }) {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{prop.guestName}</Text>
      <Text style={styles.timeStamp}>{prop.timeStamp}</Text>
      <Text style={styles.rating}>{prop.rating}</Text>
      <Text style={styles.review}>{prop.review}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  timeStamp: {
    fontSize: 14,
    marginBottom: 8,
  },
  rating: {
    fontSize: 16,
    marginBottom: 8,
  },
  review: {
    fontSize: 14,
  },
});
