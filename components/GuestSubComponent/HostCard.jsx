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
import Swiper from 'react-native-swiper';

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
            // If imageMeal is undefined, default to an empty array
            const imagePathArray = Array.isArray(imageMeal) ? imageMeal : [];

            const imageUrls = [];
            for (const imgPath of imagePathArray) {
                // Ensure imgPath is a string before using it
                if (typeof imgPath === "string") {
                    const signedUrl = await Storage.get(imgPath);
                    imageUrls.push(signedUrl);
                    console.log(host.nameHost);
                    if (host.nameHost === "Eden garden") {
                        console.log('imgPath:', imgPath); // Log the imgPath for debugging
                    }
                } else {
                    if (host.nameHost === "Eden garden") {
                        console.error('Expected imgPath to be a string but received:', typeof imgPath, imgPath); // Log the object for debugging
                    }
                }
            }
            setImageUrl(imageUrls);
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    };
    
    fetchImages();
}, [imageMeal, host.name]);


  
const handleHostCardClick = async () => {
  try {
    const token = await getFromSecureStore('token');
     console.log(host.uuidHost);
    const itemListRequest = axios.get(`${URL}/guest/host/mealItems`, {
      headers: {
        Authorization: `Bearer ${token}`, // Add your bearer token here
        id: host.uuidHost,
      },
    });
    const [itemListResponse] = await Promise.all([itemListRequest]);

    const itemList = itemListResponse.data;
    console.log(itemList);
    console.log('host rating is -----------------' + host.ratingHost);

    const mealTypes = itemList.map(item => item.mealType);
  if (mealTypes.length > 0) {
    navigation.navigate('HostProfileMealGuest', {
      host: host,
      itemList: itemList,
    });
  } else {
    // Optionally handle the case when no meal types are available
    console.log('No meals available for this host.');
  }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

return (
  <TouchableOpacity onPress={handleHostCardClick}>
        <LinearGradient colors={[colors.darkBlue,'#fcfddd']} style={styles.container}>
    {/* <View style={styles.container}> */}
    <View style={styles.host}>
    <View style={styles.imageContainer}>
     {imageUrl && imageUrl.length > 0 ? (
      <Swiper 
      autoplay={true}
      loop={true}
      autoplayTimeout={2.1}
      showsPagination={true}
      dot={<View style={{backgroundColor:'rgba(255,255,255,.3)', width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3}} />}
      activeDot={<View style={{backgroundColor: '#fff', width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3}} />}
      paginationStyle={{position: 'absolute', bottom: 10}}
      style={styles.DP}
  >
          {imageUrl.map((img, index) => (
              <View key={index} style={{flex: 1}}>
                  <Image 
                      style={styles.DP} 
                      source={{ uri: img }} 
                      onError={(error) => console.error("Image Error", error)}
                  />
              </View>
          ))}
      </Swiper>
      
        ) : (
            <Image 
                style={styles.DP} 
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
);}
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const hostHeight = screenHeight * 0.13; // You can adjust this value according to your needs
const bgColor = '#fcfddd'; 
// const bgColor = colors.darkBlue; 

const dpDimension = screenWidth * 0.23;
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
    width: '100%',  // takes the full width of imageContainer
    height: hostHeight,
    resizeMode: 'cover',
},
hostInfo: {
    flex: 1,
    flexDirection: 'column',
    padding: screenWidth * 0.02,
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