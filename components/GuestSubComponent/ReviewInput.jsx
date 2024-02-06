import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, TouchableOpacity, Text } from 'react-native';
import config from '../Context/constants';
import axios from 'axios';
import MessageCard from '../commonMethods/MessageCard';
import {globalStyles,colors} from '../commonMethods/globalStyles';
import { getFromSecureStore } from '../Context/SensitiveDataStorage';
import Constants from 'expo-constants';
const URL = Constants.expoConfig.extra.apiUrl || config.URL;
const ReviewInput = ({ uuidOrder, timeStamp }) => {
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  const submitReview = async () => {
    // Check if the review text is empty
    if (!reviewText.trim()) {
      setMessage('No review added! Please write a review.');
      setShowMessage(true);
      return; // Exit the function if review is empty
    }

    console.log('uuid: ' + uuidOrder);
    const token = await getFromSecureStore('token');

    setIsSubmitting(true);

    const orderEntity = {
      uuidOrder,
      timeStamp,
      review: reviewText,
    };

    try {
      const response = await axios.put(`${URL}/guest/order`, orderEntity, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          attributeName: 'review',
        },
      });

      setMessage('Review submitted successfully!');
      setShowMessage(true);
    } catch (error) {
      setMessage('Error submitting review.');
      setShowMessage(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'space-between' }}> 
      
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Write a review..."
          multiline={true}
          value={reviewText}
          onChangeText={setReviewText}
        />
        <TouchableOpacity title="Submit" style={globalStyles.centralisingContainer} onPress={submitReview} disabled={isSubmitting}>
          <Text style={styles.postText}>Submit</Text>
        </TouchableOpacity>
      </View>
      {showMessage && (
        <MessageCard message={message} isVisible={true} onClose={() => setShowMessage(false)} />
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.lightOlive,
    padding: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    // marginTop: 5,
  },
  input: {
    borderBottomColor: colors.darkBlue,
    borderBottomWidth:1,
    padding: 10,
    // borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0)', // fully transparent
    fontSize: 16,
    marginBottom: 5,
    color:'white'
  },
  postText:{
padding: 5,
fontWeight:'bold',
color: colors.darkBlue,  
fontSize: 16,
 }
});

export default ReviewInput;
