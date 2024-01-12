import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import StarRating from '../commonMethods/StarRating';
import config from '../Context/constants';
import { Storage } from '@aws-amplify/storage';
import { getFromAsync, storeInAsync } from '../Context/NonSensitiveDataStorage';
import { getFromSecureStore } from '../Context/SensitiveDataStorage';
import {globalStyles,colors} from '../commonMethods/globalStyles';
import { LinearGradient } from 'expo-linear-gradient';
import Carousel from 'react-native-snap-carousel';
import { getImageUrl, storeImageUrl } from '../Context/sqLiteDB';
import * as Animatable from 'react-native-animatable';
import Constants from 'expo-constants';
const URL = Constants.expoConfig.extra.apiUrl;

export default function HostCard({ host, meals }) {
  const itemNames = meals.map(meal => meal.nameItem);
  const imageMeal = useMemo(() => meals.map(meal => meal.dp), [meals]);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [imageUrl, setImageUrl] = useState(null); // State to hold the fetched image URL
  // const [isTruncated, setIsTruncated] = useState(true);
  //  const truncatedDescription = isTruncated ? `${host.descriptionHost.split(' ').slice(0, -3).join(' ')}...` : host.descriptionHost;

  const navigation = useNavigation();
  const toggleDescription = () => {
    setShowFullDescription(prevState => !prevState);
  };
 // Modify this in your component where fetchImages is defined
useEffect(() => {
  const fetchImages = async () => {
    try {
      const imagePathArray = Array.isArray(imageMeal) ? imageMeal : [];
      const imageUrls = [];

      for (const imgPath of imagePathArray) {
        console.log('Processing image path:', imgPath);
        if (typeof imgPath === "string") {
          let signedUrl = await getImageUrl(imgPath);
          if (!signedUrl) {
            try {
              signedUrl = await Storage.get(imgPath);
              await storeImageUrl(imgPath, signedUrl);
              console.log('Fetched and cached signed URL for', imgPath);
            } catch (error) {
              console.error('Error fetching image URL for:', imgPath, error);
            }
          }
          if (signedUrl) {
            imageUrls.push(signedUrl);
          }
        }
      }
      setImageUrl(imageUrls);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };
  if (imageMeal.length > 0 && (!imageUrl || imageUrl.length === 0)) {
    fetchImages();
  } else {
    console.log('Skipping image fetch for', host.nameHost);
  }
}, [imageMeal, host.nameHost]);

  
  
  const handleHostCardClick = () => {
    try {
      navigation.navigate('HostProfileMealGuest', {
        host: host,
        itemList: meals, 
      });
    } catch (error) {
      console.error('Error while navigating:', error);
    }
  };
  
const renderItem = ({ item }) => {
  return (
      <View style={styles.carouselItemContainer}>
          <Image
              style={styles.carouselImage}
              source={{ uri: item }}
              onError={(error) => console.error("Image Error", error)}
          />
      </View>
  );
};

return (
  <TouchableOpacity onPress={handleHostCardClick}>
  <LinearGradient colors={[colors.darkBlue, '#fcfddd']} style={styles.container}>
      <View style={styles.host}>
          <View style={styles.carouselContainer}>
              {imageUrl && imageUrl.length > 0 ? (
                  <Carousel
                      data={imageUrl}
                      renderItem={renderItem}
                      sliderWidth={dpDimension} // Set to the width of the image
                      itemWidth={dpDimension} // Same as the width of the image
                      loop={true}
                      autoplay={true}
                      autoplayInterval={3000}
                  />
              ) : (
                  <Image
                      style={styles.carouselImage}
                      source={ require('../../assets/EmptyImageDefault.jpg')}
                      onError={(error) => console.error("Image Error", error)}
                  />
              )}
          </View>
        <View style={styles.hostInfo}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={globalStyles.textSecondary} numberOfLines={1}>
              {host.nameHost}
            </Text>
            {(host.ratingHost) && <StarRating style={styles.rating} rating={host.ratingHost} />}
          </View>
          <Animatable.Text
            iterationDelay={2000}
          easing="ease-out"
                animation="pulse"
                useNativeDriver 
                iterationCount='infinite'>

          <Text style={globalStyles.textPrimary}>
            {itemNames.join(' | ')}
          </Text>
                </Animatable.Text>
          <Text style={styles.address}>
            {host.addressHost.city}, {host.addressHost.state}
          </Text>
        </View>
      </View>

      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionHost} numberOfLines={showFullDescription ? undefined : 2}>
          {host.descriptionHost}
        </Text>
        {host.descriptionHost.length > 80 && (
          <View style={styles.readMoreContainer}>
            <Text style={styles.readMoreText} onPress={toggleDescription}>
              {showFullDescription ? '' : '...read more'}
            
            </Text>
          </View>
        )}
    </View>  
    </LinearGradient>
  </TouchableOpacity>
);
}
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

function responsiveFontSize(fontSize) {
  // Dynamic font size based on screen size
  const standardScreenHeight = 680; // Standardizing with an average screen height
  return (fontSize * screenHeight) / standardScreenHeight;
}
const itemWidth='20';
const bgColor = '#fcfddd'; 

const dpDimension = screenWidth * 0.25; // Carousel image dimension
const hostHeight = screenHeight * 0.13; // Host image height
const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
    shadowColor: colors.pink,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    padding: 5,
  },
 host: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
},
imageContainer: {
    width: hostHeight, // Giving it a fixed width 
    marginRight: 10, // Space between image and info
},
   DP: {
        width: itemWidth,
        height: 200, // Adjust the height as needed
        resizeMode: 'cover',
    },
hostInfo: {
    flex: 1,
    flexDirection: 'column',
    padding: screenWidth * 0.02,
},
carouselContainer: {
  width: dpDimension,
  height: dpDimension,
  marginRight: 10,
  overflow: 'hidden', // This prevents adjacent images from showing
},
carouselItemContainer: {
  width: dpDimension,
  height: dpDimension,
  justifyContent: 'center',
  alignItems: 'center',
},
carouselImage: {
  width: dpDimension,
  height: dpDimension,
  resizeMode: 'cover',
},
descriptionContainer: {
  width: '100%',
  overflow: 'hidden',
  paddingTop: 5,
  padding: 3,
  marginTop: 5,
},
descriptionHost: {
  fontSize: responsiveFontSize(12),
  lineHeight: responsiveFontSize(15),
  fontFamily: 'sans-serif',
  color: colors.darkPink,
},
readMoreContainer: {
  position: 'absolute', 
  bottom: 0,
  right: 0,
  backgroundColor: bgColor,
  paddingHorizontal: 3,
  marginRight: 1,
  borderBottomRightRadius: 5,
},
readMoreText: {
  color: '#662549',
  fontSize: responsiveFontSize(14),
  fontWeight: 'bold',
  paddingRight: 5,
  borderBottomRightRadius: 5,
},
name: {
  fontSize: responsiveFontSize(16),
  fontWeight: 'bold',
  marginBottom: 5,
  flex: 1,
},
  nameItem: {
    color:"#1BCCBA",
    fontSize: screenWidth * 0.045,
    // fontWeight: 'bold',
    marginBottom: 5,
  },
  address: {
    fontSize: screenWidth * 0.033,
    color: colors.deepBlue,
    marginBottom: 3,
  },
  rating: {
    marginLeft: 12,
  },
});
    