import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import {globalStyles,colors} from '../commonMethods/globalStyles';

export default function NavBarGuest() {
  const navigation = useNavigation();
  const route = useRoute();

  const isActive = (routeName) => route.name === routeName;

  return (
    <View style={styles.navbar}>
      {renderIcon('HomeGuest', 'home-outline', Ionicons, 25)}
      {/* {renderIcon('SearchGuest', 'search', Ionicons, 24)} */}
      {renderIcon('ItemListGuest', 'restaurant-menu', MaterialIcons, 25)} 
      {renderIcon('UpdateGuestDetails', 'person-circle-outline', Ionicons, 25)}
{renderIcon('OrderHistoryGuest', 'receipt-long', MaterialIcons, 25)}

      {renderIcon('SettingsGuest', 'settings-outline', Ionicons, 25)}
    </View>
  );

  function renderIcon(routeName, iconName, IconComponent, size) {
    return (
      <TouchableOpacity
        style={[styles.navbarButton, isActive(routeName) && styles.activeNavbarButton]}
        onPress={() => navigation.navigate(routeName)}>
        {/* <IconComponent name={iconName} size={size} color={isActive(routeName) ? colors.darkestBlue : colors.darkestBlue} /> */}
        <IconComponent name={iconName} size={size} color={isActive(routeName) ? colors.pink : colors.pink} />
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
    // backgroundColor: colors.pink, // Updated color to new palette color
    backgroundColor: "#EAF86B", // Updated color to new palette color
    // backgroundColor: colors.darkBlue, // Updated color to new palette color
    height: 51,
    paddingHorizontal: 16,
    // marginBottom:5,
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
    height: 2,
    // backgroundColor:colors.darkestBlue, // Updated color to new palette color
    backgroundColor:colors.pink, // Updated color to new palette color
  }
});
