import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { Storage } from '@aws-amplify/storage';
import Carousel from 'react-native-snap-carousel'; // ensure you've installed this package
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../commonMethods/globalStyles';

const screenWidth = Dimensions.get('window').width;

export default function LandingCarousel() {
  const [imageUrls, setImageUrls] = useState([]);

  const imageKeys = [
    // 'images/AratiLUnch-grayBG.jpg',
    // 'images/PunamImageLunchGrayBG.jpg',
    // 'images/sukhiMajumDinner2_squarecropped.jpeg',
    // 'images/Endu_Dinner_Gray_bg_3.jpg',
    // 'images/mithuRajDinnerFinal.jpeg'
  ];

  useEffect(() => {
    const fetchImages = async () => {
      const urls = await Promise.all(imageKeys.map(async (key) => {
        try {
          return await Storage.get(key, { level: 'public' }); // Assuming images are public
        } catch (error) {
          console.error('Error fetching image from S3', error);
          return require('../../assets/LandinImage.jpg'); // Fallback image
        }
      }));

      setImageUrls(urls);
    };

    fetchImages();
  }, []);

  const renderItem = ({ item }) => {
    return (
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* <LinearGradient colors={[colors.darkBlue, colors.secondCardColor]} style={styles.gradient}> */}
        <Carousel
          data={imageUrls}
          renderItem={renderItem}
          sliderWidth={dpDimension}
          itemWidth={dpDimension}  // Reduce width to maintain a square aspect ratio
          loop={true}
          autoplay={true}
          autoplayInterval={3000}
        />
      {/* </LinearGradient> */}
    </View>
  );
}
const dpDimension = screenWidth * 0.35;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: dpDimension, // Set height equal to width for square images
    width: dpDimension, // Set height equal to width for square images
// justifyContent:'center',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10, // Adding some border radius
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: dpDimension, // Full width images but scaled down
    borderRadius: 10, // Apply border radius to the images
    overflow: 'hidden', // Ensure the images' corners are rounded
    borderWidth: 1, // Adding a border
    borderColor: colors.darkSeaBlue, // Border color
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
