import React from 'react';
import { View, Text, StyleSheet, Dimensions,PixelRatio, Image } from 'react-native';
import { globalStyles, colors } from '../commonMethods/globalStyles';

const screenWidth = Dimensions.get('window').width;
const cardWidth = screenWidth * 0.8; // Example card width, adjust as needed
const cardHeight = cardWidth * 0.6; // Adjust based on your design

const OfferCard = ({ imageUri }) => {
  return (
    <View style={[styles.compactContainer, { width: cardWidth, height: cardHeight }]}>
      <View style={styles.linearGradientStyle}>

        <View style={styles.offerTextContainer}>
          <Text style={[styles.offerText, { fontSize: scaledFontSize(16) }]}>Free Delivery is Going On!</Text>
        </View>
      </View>
    </View>
  );
};
const normalize = (size) => {
    const newSize = size * scale 
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) 
}
const fontScale = PixelRatio.getFontScale();
    const scaledFontSize = (size) => size / fontScale;
const styles = StyleSheet.create({
    compactContainer: {
      margin: 4,
      borderRadius: 10,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: 'lightgray',
    },
    linearGradientStyle: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.darkBlue,
    },
    imageStyle: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    offerTextContainer: {
      padding: 10,
      backgroundColor: 'rgba(0,0,0,0.5)',
      borderRadius: 5,
    },
    offerText: {
      color: colors.white,
      fontWeight: 'bold',
    },
});

export default OfferCard;
