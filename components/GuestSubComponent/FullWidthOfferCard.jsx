import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../commonMethods/globalStyles';

const screenWidth = Dimensions.get('window').width;

const FullWidthOfferCard = ({ offerText }) => {
  return (
    <View style={styles.fullWidthContainer}>
      <Icon name="tag" size={30} color={colors.darkSeaBlue} style={styles.iconStyle} />
      <Text style={styles.fullWidthText}>{offerText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
    fullWidthContainer: {
        flexDirection: 'row', // Align icon and text horizontally
        width: screenWidth - 10, // Slightly less than full width for padding
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: colors.pink, // Assuming this is defined in your global styles
        borderRadius: 5,
        padding: 12,
        borderWidth: 2,
        borderColor: 'green', // Assuming this is defined in your global styles
        // borderColor: colors.pink, // Assuming this is defined in your global styles
        margin: 5,
      },
    iconStyle: {
        marginHorizontal: 5, // Space between icon and text
      },
    fullWidthText: {
      color: colors.pink,
      fontWeight: 'bold',
      fontSize: 16,
    },
});

export default FullWidthOfferCard;
