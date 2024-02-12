import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import {globalStyles,colors} from '../commonMethods/globalStyles';
import ChefHatIcon from '../../assets/chefHatIcon26.svg'; // Import your SVG icon

export default function NavBarGuest() {
  const navigation = useNavigation();
  const route = useRoute();

  const isActive = (routeName) => route.name === routeName;

 
  return (
    <View style={styles.navbar}>
 <TouchableOpacity
        style={[styles.navbarButton, isActive('HomeGuest') && styles.activeNavbarButton]}
        onPress={() => navigation.navigate('HomeGuest')}>
        {isActive('HomeGuest') ? (
          <ChefHatIcon fill={colors.pink} width={56} height={57} stroke={colors.pink} strokeWidth="0.6" /> // Example of adding stroke
        ) : (
          <ChefHatIcon fill={colors.lightishPink} width={58} height={58} stroke={colors.lightishPink} strokeWidth="0.6" />
        )}
        {isActive('HomeGuest') && <View style={styles.underline} />}
      </TouchableOpacity>
      {renderIcon('ItemListGuest', 'restaurant-menu', MaterialIcons, 26)}
      {renderIcon('UpdateGuestDetails', 'person-circle-outline', Ionicons, 25)}
      {renderIcon('OrderHistoryGuest', 'receipt-long', MaterialIcons, 25)}
      {renderIcon('SettingsGuest', 'menu', Ionicons, 27)}
    </View>
  );

  function renderIcon(routeName, iconName, IconComponent, size) {
    return (
      <TouchableOpacity
        style={[styles.navbarButton, isActive(routeName) && styles.activeNavbarButton]}
        onPress={() => navigation.navigate(routeName)}>
        <IconComponent name={iconName} size={size} color={isActive(routeName) ? colors.pink : colors.lightishPink} />
        {isActive(routeName) && <View style={styles.underline} />}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    // backgroundColor: colors.lightishPink, // Updated color to new palette color
    backgroundColor: colors.navBarColor, // Updated color to new palette color
    // backgroundColor: colors.darkBlue, // Updated color to new palette color
    height: 51,
    paddingHorizontal: 16,
    elevation: 5, // for Android
    shadowColor: 'black', // for iOS
    shadowOffset: { width: 0, height: 1 }, // for iOS
    shadowOpacity: 0.3, // for iOS
    shadowRadius: 3, // for iOS
    // marginBottom:2,
    // borderBottomColor: colors.lightishPink,
    // borderBottomWidth: 2,

    },
  navbarButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  activeNavbarButton: {
    borderBottomWidth: 3,
    // borderBottomColor: colors.darkestBlue, // Updated color to new palette color
    borderBottomColor: colors.pink, // Updated color to new palette color
  },
  underline: {
    position: 'absolute',
    bottom: 0,
    left: '25%',
    right: '25%',
    height: 3,
    // backgroundColor:colors.darkestBlue, // Updated color to new palette color
    backgroundColor:colors.pink, // Updated color to new palette color
  }
});
