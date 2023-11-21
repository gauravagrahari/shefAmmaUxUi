import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import StarRating from '../commonMethods/StarRating';
import config from '../Context/constants';
import { Storage } from '@aws-amplify/storage';
import { getFromSecureStore } from '../Context/SensitiveDataStorage';
import {globalStyles,colors} from '../commonMethods/globalStyles';
import { LinearGradient } from 'expo-linear-gradient';
import Carousel from 'react-native-snap-carousel';

const URL = config.URL;

export default function HostCard({ host, itemNames,imageMeal }) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [imageUrl, setImageUrl] = useState(null); // State to hold the fetched image URL
  const [isTruncated, setIsTruncated] = useState(true);
   const truncatedDescription = isTruncated ? `${host.descriptionHost.split(' ').slice(0, -3).join(' ')}...` : host.descriptionHost;

  const navigation = useNavigation();
  const toggleDescription = () => {
    setShowFullDescription(prevState => !prevState);
  };
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const imagePathArray = Array.isArray(imageMeal) ? imageMeal : [];
        const imageUrls = [];
  
        for (const imgPath of imagePathArray) {
          if (typeof imgPath === "string") {
            try {
              const signedUrl = await Storage.get(imgPath);
              imageUrls.push(signedUrl);
            
            } catch (error) {
              console.error('Error fetching image URL for:', imgPath, error);
            }
          }
        }
        setImageUrl(imageUrls);
       
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };
  fetchImages();
  }, [imageMeal, host.nameHost]);
  
const handleHostCardClick = async () => {
  try {
    const token = await getFromSecureStore('token');
    const itemListRequest = axios.get(`${URL}/guest/host/mealItems`, {
      headers: {
        Authorization: `Bearer ${token}`, // Add your bearer token here
        id: host.uuidHost,
      },
    });
    const [itemListResponse] = await Promise.all([itemListRequest]);

    const itemList = itemListResponse.data;

    navigation.navigate('HostProfileMealGuest', {
      host: host,
      itemList: itemList,
    });
  } catch (error) {
    console.error('Error fetching data:', error);
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
                      source={{ uri: 'YOUR_DEFAULT_IMAGE_URL' }}
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
          
          <Text style={globalStyles.textPrimary}>
            {itemNames.join(' | ')}
          </Text>
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
              {/* {showFullDescription ? 'Read less' : '...read more'} */}
            </Text>
          </View>
        )}
      {/* </View> */}
    </View>
    </LinearGradient>
  </TouchableOpacity>
);
}
const itemWidth='20';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const hostHeight = screenHeight * 0.13; // You can adjust this value according to your needs
const bgColor = '#fcfddd'; 
// const bgColor = colors.darkBlue; 

const dpDimension = screenWidth * 0.25  ;
const styles = StyleSheet.create({
  container: {
    // backgroundColor: bgColor,
    marginBottom: 4,
    shadowColor: colors.pink,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    // borderBottomLeftRadius: 15,
    // borderBottomRightRadius: 15,
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
    // paddingTop: 5,
    // paddingHorizontal: 2,
    width: '100%',
    // borderBottomLeftRadius: 18,
    // borderBottomRightRadius: 18,
    overflow: 'hidden',
    // backgroundColor: bgColor,
    paddingTop: 5,
    padding:3,
// borderTopWidth: 1,
// borderTopColor:'#0F0E0E',
    // marginBottom: 5,
    marginTop: 5,
    // marginLeft: 5,
    // marginRight:6,
  },
  descriptionHost: {
    // backgroundColor: bgColor,
    fontSize: screenWidth * 0.037,
    lineHeight: screenWidth * 0.045, // Adjust line height
    fontFamily: 'sans-serif', // Use a system font
    color: colors.darkPink, // Darker, more professional font color
    // color: colors.darkestOliveGreen, // Darker, more professional font color
    // fontWeight: 'bold',
  },
  readMoreContainer: {
    position: 'absolute', 
    bottom: 0,
    right: 0,
    backgroundColor: bgColor, // Semi-transparent background
    paddingHorizontal: 3,
    marginRight: 1,
   borderBottomRightRadius: 5,

  },
  readMoreText: {
    color: '#662549',
    fontSize: screenWidth * 0.035,
    fontWeight: 'bold',
    paddingRight: 5,
    borderBottomRightRadius: 5,
  },

  name: {
    fontSize: screenWidth * 0.04,
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
    