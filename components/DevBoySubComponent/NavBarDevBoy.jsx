import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import {  Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import {globalStyles,colors} from '../commonMethods/globalStyles';
import { LinearGradient } from 'expo-linear-gradient';

export default function NavBarDevBoy() {
  const navigation = useNavigation();
  const route = useRoute();

  const isActive = (routeName) => route.name === routeName;

  return (
    <View style={styles.navbar}>
      {renderIcon('HomeDevBoy', 'home-outline', Ionicons, 24)}
      {/* {renderIcon('SearchGuest', 'search', Ionicons, 24)}
      {renderIcon('UpdateGuestDetails', 'person-outline', Ionicons, 24)} */}
      {renderIcon('OrderHistoryDevBoy', 'list-outline', Ionicons, 24)}
      {renderIcon('SettingsDevBoy', 'settings-outline', Ionicons, 24)}
    </View>
  );

  function renderIcon(routeName, iconName, IconComponent, size) {
    return (
      <TouchableOpacity
        style={[styles.navbarButton, isActive(routeName) && styles.activeNavbarButton]}
        onPress={() => navigation.navigate(routeName)}>
        <IconComponent name={iconName} size={size} color={isActive(routeName) ? colors.primaryText : colors.primaryText} />
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
    backgroundColor: "#EAF86B", // Updated color to new palette color
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
    borderBottomColor: colors.primaryText, // Updated color to new palette color
  },
  underline: {
    position: 'absolute',
    bottom: 0,
    left: '25%',
    right: '25%',
    height: 2,
    backgroundColor:colors.primaryText, // Updated color to new palette color
  }
});
