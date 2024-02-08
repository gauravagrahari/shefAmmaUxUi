import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { globalStyles, colors } from '../commonMethods/globalStyles'; // Update path as needed
import { useNavigation } from '@react-navigation/native';
import StarRating from '../commonMethods/StarRating';
import { getImageUrl, storeImageUrl } from '../Context/sqLiteDB';
import * as Animatable from 'react-native-animatable';

const ItemListCard = ({ item, host,handleHostCardClick  }) => {
    const [imageUri, setImageUri] = useState(null);
    const navigation = useNavigation();
  
    useEffect(() => {
      const fetchImage = async () => {
        if (!item.dp) {
          console.error('No image path provided for item:', item);
          return;
        }
    
        try {
          let url = await getImageUrl(item.dp);
          if (!url) {
            url = await Storage.get(item.dp);
            await storeImageUrl(item.dp, url);
          }
          setImageUri(url);
        } catch (error) {
          console.error('Error fetching image:', error);
        }
      };
    
      if (item.dp) {
        fetchImage();
      }
    }, [item.dp]);
    
  
    const getMealTypeFullText = (type) => {
      switch (type) {
        case 'b': return 'Breakfast';
        case 'l': return 'Lunch';
        case 'd': return 'Dinner';
        default: return type;
      }
    };
  
    return (
      <TouchableOpacity onPress={handleHostCardClick}>
      <LinearGradient colors={[colors.darkBlue, colors.secondCardColor]} style={{marginBottom:3}}>
     <View style={styles.containerVertical}>
          <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.itemImage}
            source={imageUri ? { uri: imageUri } : require('../../assets/EmptyImageDefault.jpg')} 
            onError={(error) => console.error("Image Error", error)}
          />
        </View>
        <View style={styles.hostInfo}>
        <View style={styles.nameAndIndicator}>
          <Text style={globalStyles.textPrimary}>{item.nameItem}</Text>
          <View style={[styles.indicatorBox, item.vegetarian==="true" ? styles.vegBox : styles.nonVegBox]}>
          <View style={[styles.vegIndicator, item.vegetarian==="true" ? styles.veg : styles.nonVeg]} />
          </View>
        </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={globalStyles.textSecondary} numberOfLines={1}>
              {host.nameHost}
            </Text>
            {host.ratingHost && <StarRating style={styles.rating} rating={host.ratingHost} />}
          </View>

        <View style={styles.mealTypeAndAmount}>
          <Text style={styles.mealType}>{getMealTypeFullText(item.mealType)}</Text>
          <Text style={styles.highlightedText}>{`${item.amount}`}/-</Text>
        </View>
        </View>
        </View>

        <View style={styles.detailConatiner}>
       <Text style={styles.detail}>{item.description}</Text>
         </View>
         </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const screenWidth = Dimensions.get('window').width;
const dpDimension = screenWidth * 0.30; 

const styles = StyleSheet.create({
  container: {
      elevation: 5,
      flexDirection: 'row',
      alignItems: 'center',
      padding: 5,
      paddingTop:10,
  },
  containerVertical: {
      flexDirection: 'column',
      // alignItems: 'center',
      // padding: 1,
  },
  mealTypeAndAmount: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    mealType:{
        fontSize: screenWidth * 0.039,
        color: colors.labelBlack,
        marginBottom: 3,
        fontWeight: 'bold',
    },
  imageContainer: {
      width: dpDimension,
      height: dpDimension,
      marginRight: 10,
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
    highlightedText: {
      fontWeight: 'bold',
      color: colors.darkPink,
      fontSize:17
    },
  itemImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
      marginLeft: 5,
      borderRadius: 7,
      borderColor: 'lightgray',
      borderWidth: 1,
  },
  nameAndIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  hostInfo: {
      flex: 1,
      flexDirection: 'column',
      padding: screenWidth * 0.02,
  },
  name: {
      fontSize: screenWidth * 0.04,
      fontWeight: 'bold',
      marginBottom: 5,
  },
  nameItem: {
      color: "#1BCCBA",
      fontSize: screenWidth * 0.045,
      marginBottom: 5,
  },
  address: {
      fontSize: screenWidth * 0.033,
      color: colors.deepBlue,
      marginBottom: 3,
  },

  detailConatiner:{
      marginLeft: 15,
margin:5,
// borderTopColor: colors.deepBlue,
// borderTopWidth: 1,
paddingTop: 5,
  },

  detail: {
      fontSize: screenWidth * 0.034,
      marginBottom: 2,
      // color:colors.deepBlue,
      color:colors.deepBlue,
      // Additional styling for other details
  },
  // Add other styles as needed
});

export default ItemListCard;
