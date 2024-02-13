import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { globalStyles, colors } from '../commonMethods/globalStyles';
import { useNavigation } from '@react-navigation/native';
import StarRating from '../commonMethods/StarRating';
import * as Animatable from 'react-native-animatable';
import { Storage } from '@aws-amplify/storage';
import { Amplify } from 'aws-amplify';
import awsmobile from '../../src/aws-exports.js';
import { getImageUrl, storeImageUrl } from '../Context/sqLiteDB';

Amplify.configure(awsmobile);

const ItemListFlatListCard = ({ item, host, handleHostCardClick }) => {
    const [imageUri, setImageUri] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchImage = async () => {
          if (!item.dp) {
            console.error('No image path provided for item:', item);
            return;
          }
      
          try {
            let url = await getImageUrl(item.dp); // Assuming this is a valid function
            if (!url) {
              url = await Storage.get(item.dp, { level: 'public' }); // Ensure correct access level
              await storeImageUrl(item.dp, url); // Assuming this caches the URL
            }
            setImageUri(url);
          } catch (error) {
            console.error('Error fetching image:', error);
          }
        };
      
        fetchImage();
      }, [item.dp]);

    const getMealTypeFullText = (type) => {
      switch (type) {
        case 'b': return 'Breakfast';
        case 'l': return 'Lunch';
        case 'd': return 'Dinner';
        default: return type;
      }
    };

    const cardWidth = Dimensions.get('window').width * 0.38; // Width of the card
    const cardHeight = cardWidth * 1.5; // Height is double the width

    return (
        <TouchableOpacity onPress={handleHostCardClick} style={[styles.compactContainer, { width: cardWidth, height: cardHeight }]}>
          <View  style={styles.linearGradientStyle}>
            <View
              style={[styles.imageContainer, { height: cardWidth }]} // Image height equal to card width for square shape
            >
              <Image
                style={styles.imageStyle}
                source={imageUri ? { uri: imageUri } : require('../../assets/EmptyImageDefault.jpg')}
                onError={(error) => console.error("Image Error", error)}
              />
            </View>
            <View style={styles.detailsContainer}>
              <Text style={[globalStyles.textPrimary,{paddingTop:2},{color:colors.deepBlue},{fontWeight:'400'}]} numberOfLines={1}>{item.nameItem}</Text>
              <Text style={[styles.mealTypeText,{color:'gray'}]}>{getMealTypeFullText(item.mealType)}</Text>
              <Text style={styles.highlightedText}>{`${item.amount}`}/-</Text>
            </View>
          </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    compactContainer: {
      margin: 4,
      borderRadius: 10,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: 'lightgray',
      // marginHorizontal: 5,
    },
    linearGradientStyle: {
      flex: 1,
      justifyContent: 'space-between', // Adjusted for spacing between image and details
      backgroundColor:colors.darkBlue,
    },
    imageContainer: {
      width: '100%',
    },
    imageStyle: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    detailsContainer: {
      flex: 1, // Take up remaining space
      paddingHorizontal: 10, // Adjusted padding to ensure details use full width
    },
    mealTypeText: {
      fontSize: 15,
      color: colors.labelBlack,
      fontWeight: 'bold',
    },
    highlightedText: {
      fontWeight: 'bold',
      color: colors.pink,
      fontSize: 15,
    },
    // Other styles as previously defined
  });

export default ItemListFlatListCard;
