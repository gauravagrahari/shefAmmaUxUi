import React, { useEffect, useState, memo  } from 'react';
import { View, Button, Text, Image, StyleSheet,Dimensions } from 'react-native';
import { Storage } from 'aws-amplify';
import {globalStyles,colors} from '../commonMethods/globalStyles';
import { getFromAsync, storeInAsync } from '../Context/NonSensitiveDataStorage';
import { getImageUrl, storeImageUrl } from '../Context/sqLiteDB';

function ItemCard({ item }) {
  const [imageUri, setImageUri] = useState(null);

  console.log("Rendering ItemCard with item:", item);

  useEffect(() => {
    fetchImage().catch((error) => console.error('Error fetching image:', error));
  }, [item]); // Add 'item' as a dependency

 // Modify this in your ItemCard component
const fetchImage = async () => {
  const imageKey = item.dp;
  try {
    let imageUrl = await getImageUrl(imageKey);
    if (!imageUrl) {
      imageUrl = await Storage.get(imageKey);
      await storeImageUrl(imageKey, imageUrl);
      console.log('Fetched and cached image URL for', imageKey);
    }
    else{
      console.log('Fetched from sqlit----------->', imageKey);
    }
    setImageUri(imageUrl);
  } catch (error) {
    console.error('Error fetching image for item:', item.id, error);
  }
};


  console.log("item names"+item.nameItem);
  return (
    <View style={styles.container}>
    <Image style={styles.DP} source={{ uri: imageUri }} />
    <View style={styles.details}>
      <View style={styles.nameItemContainer}>
        <Text style={styles.nameItem}>{item.nameItem}</Text>
        <View style={[styles.indicatorBox, item.vegetarian==="true" ? styles.vegBox : styles.nonVegBox]}>
            <View style={[styles.vegIndicator, item.vegetarian==="true" ? styles.veg : styles.nonVeg]} />
            </View>

      </View>
      <Text style={styles.label}>Your 1 plate will contain below items!</Text>

      <Text style={styles.description}>{item.description}</Text>
    
      <Text style={styles.amount}>{item.amount}/-</Text>
    </View>
    </View >
  );
}
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.darkBlue,
    marginBottom: screenHeight * 0.01, // Responsive margin
    borderRadius: 20,
    borderBottomColor: colors.pink,
    borderBottomWidth: 3,
  },
  DP: {
    width: '100%',
    aspectRatio: 1,
    marginBottom: screenHeight * 0.01,
  },
  details: {
    paddingLeft: screenWidth * 0.04, // Responsive padding
    paddingBottom: screenHeight * 0.02,
  },
  indicatorBox: {
    width: screenWidth * 0.035,
    height: screenWidth * 0.035,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: screenWidth * 0.01,
  },
  vegIndicator: {
    width: screenWidth * 0.022,
    height: screenWidth * 0.022,
    borderRadius: screenWidth * 0.022 / 2, // Responsive circle
  },
  vegBox: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'green',
  },
  nonVegBox: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'red',
  },
  veg: {
    backgroundColor: 'green',
  },
  nonVeg: {
    backgroundColor: 'red',
  },
  nameItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: screenHeight * 0.005,
  },
  nameItem: {
    fontSize: screenWidth * 0.045, // Responsive font size
    fontWeight: 'bold',
    color:colors.pink,
  },
  dishCategory: {
    fontSize: 14,
    color: '#777',
    marginBottom: 4,

  },
  label:{
    fontWeight: 'bold',
    fontSize: screenWidth * 0.037,
    paddingBottom: 4, // Space out the line from the text
color:"#4D6664",
  },
  description: {
    fontSize: screenWidth * 0.037,
    marginBottom: 4,
    paddingBottom: 4, // Space out the line from the text
color:colors.deepBlue,
  },
 
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  noOfServe: {
    marginHorizontal: 8,
  },
  amount: {
    marginTop: 4,
    fontWeight: '700',
    color: colors.deepBlue,
    fontSize: screenWidth * 0.042,
  },
});
export default memo(ItemCard);
