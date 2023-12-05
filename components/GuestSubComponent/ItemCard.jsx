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
        <View
          style={[
            styles.vegetarianIndicatorContainer,
            item.vegetarian ? styles.vegetarianTrue : styles.vegetarianFalse,
          ]}
        >
          <View style={styles.vegetarianIndicator} />
        </View>
      </View>
      {/* <Text style={styles.specialIngredient}>{item.specialIngredient}</Text>
      <Text style={styles.dishCategory}>{item.dishCategory}</Text> */}
      <Text style={styles.description}>{item.description}</Text>
      {/* <Text style={styles.serve}>Each Serve - {item.serve}</Text> */}
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
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
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
  vegetarianIndicatorContainer: {
    marginLeft: 8, // spacing between name and indicator
    width: 13,
    height: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4, // slight rounding of corners
    borderWidth: 1, // width of the hollow square border
  },
  vegetarianIndicator: {
    width: 5,
    height: 5,
    borderRadius: 1,
  },
  vegetarianTrue: {
    backgroundColor: 'green',
    borderColor: 'green', // color of the hollow square border for vegetarian
  },
  vegetarianFalse: {
    backgroundColor: 'red',
    borderColor: 'red', // color of the hollow square border for non-vegetarian
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
    fontSize: 16,

  },
});
export default memo(ItemCard);
