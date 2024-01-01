import React, { useEffect, useState, memo } from 'react';
import { View, Button, Text, Image, StyleSheet } from 'react-native';
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

      <Text style={styles.description}>{item.description}</Text>
    
      <Text style={styles.amount}>{item.amount}/-</Text>
    </View>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.darkBlue,
    // backgroundColor: colors.darkBlue,
    // padding: 1,
    marginBottom: 10,
    borderRadius: 20,
    borderBottomColor: colors.pink,
    borderBottomWidth:3,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.2,
    // shadowRadius: 2,

    // elevation: 2,
  },
  DP: {
    width: '100%', // Make image as wide as the container
    aspectRatio: 1, // Keep the image square
    marginBottom: 8,
    // padding:10,
    // borderBottomWidth: 1, // Add a horizontal line below the image
    // borderBottomColor: '#ccc', // Set the color for the horizontal line
  },
  details:{
    paddingLeft:16,
    paddingBottom:16,
     // borderTopWidth: 1,
    // borderTopColor: '#ccc',
  },
  indicatorBox: {
    width: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  vegIndicator: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  vegBox: {
    backgroundColor: 'transparent',
    borderWidth:1,
    borderColor: 'green',
  },
  nonVegBox: {
    backgroundColor: 'transparent',
    borderWidth:1,
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
    marginBottom: 4,
  },
  nameItem: {
    fontSize: 18,
    fontWeight: 'bold',
    color:colors.pink,
    // marginBottom: 4,
    // borderTopWidth: 1,
    // borderTopColor: '#ccc',
  },
  dishCategory: {
    fontSize: 14,
    color: '#777',
    marginBottom: 4,

  },
  description: {
    fontSize: 14,
    // borderBottomWidth: 1, // Add a horizontal line below the description
    // borderBottomColor: '#ccc', // Set the color for the horizontal line
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
    color:colors.deepBlue,
    fontSize: 17,

  },
});
export default memo(ItemCard);
