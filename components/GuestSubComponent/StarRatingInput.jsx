import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import config from '../Context/constants';
import MessageCard from '../commonMethods/MessageCard';
import { getFromSecureStore } from '../Context/SensitiveDataStorage';
import {globalStyles,colors} from '../commonMethods/globalStyles';

const URL = config.URL;

const StarRatingInput = ({ uuidOrder, timeStamp, uuidHost, geoHost }) => {
  const [currentRating, setCurrentRating] = useState(0);
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    // Fetch the token from cache when the component mounts
    const fetchToken = async () => {
      const storedToken = await getFromSecureStore('token');
      setToken(storedToken);
    };

    fetchToken();
  }, []);

  const setRating = (ratingValue) => {
    setCurrentRating(ratingValue);
    console.log('geoHost------------: ' + geoHost);

    const orderEntity = {
      uuidOrder,
      timeStamp,
      uuidHost,
      geoHost,
      rating: ratingValue,
    };

    axios
      .put(`${URL}/guest/order`, orderEntity, {
        params: {
          attributeName: 'rating',
        },
        headers: {
          Authorization: `Bearer ${token}`, // Add your bearer token here
        },
      })
      .then((response) => {
        console.log('Rating submitted successfully!');
        setMessageText('Rating submitted successfully!');
        setIsMessageVisible(true);
      })
      .catch((error) => {
        console.error('Error submitting the rating:', error.message);
        setMessageText('Error submitting the rating. Please try again.');
        setIsMessageVisible(true);
      });
  };

  
  const renderStar = (index) => (
    <TouchableOpacity key={index} onPress={() => setRating(index + 1)} style={styles.star}>
      <Icon name={index < currentRating ? 'star' : 'star-o'} size={26} color={colors.darkestBlue} />
      {/* <Icon name={index < currentRating ? 'star' : 'star-o'} size={26} color={'#d3df68'} /> */}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.ratingText}>Rate your meal</Text>
      <View style={styles.stars}>{Array.from({ length: 5 }).map((_, index) => renderStar(index))}</View>
      {isMessageVisible && (
        <MessageCard message={messageText} isVisible={isMessageVisible} onClose={() => setIsMessageVisible(false)} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.lightOlive,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    marginBottom: 15,
  },
  stars: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    fontWeight:'800'
  },
  star: {
    marginHorizontal: 10,
  },
  ratingText: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 8,
    color: colors.darkBlue,
  },
});

export default StarRatingInput;
