import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, TouchableOpacity, Text } from 'react-native';
import config from '../Context/constants';
import axios from 'axios';
import MessageCard from '../commonMethods/MessageCard';
import {globalStyles,colors} from '../commonMethods/globalStyles';
import { getFromSecureStore } from '../Context/SensitiveDataStorage';

const URL = config.URL;

const ReviewInput = ({ uuidOrder, timeStamp }) => {
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  const submitReview = async () => {
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
    <>
      {showMessage && (
        <MessageCard message={message} isVisible={true} onClose={() => setShowMessage(false)} />
      )}
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Write a review..."
          multiline={true}
          value={reviewText}
          onChangeText={setReviewText}
        />
        <TouchableOpacity title="Submit" style={globalStyles.centralisingContainer} onPress={submitReview} disabled={isSubmitting} >
       <Text style={styles.postText}>Post</Text>
        </TouchableOpacity>
      </View>
    </>
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
// color:colors.pink,
color:colors.darkestBlue,
fontSize: 16,
 }
});

export default ReviewInput;
