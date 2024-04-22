import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { globalStyles, colors } from '../commonMethods/globalStyles';
import ChefHatIcon from '../../assets/chefHatIcon26.svg'; // Import your SVG icon

export default function NavBarHost() {
  const navigation = useNavigation();
  const route = useRoute();

  const isActive = (routeName) => route.name === routeName;

  return (
    <View style={styles.navbar}>
      <TouchableOpacity
        style={[styles.navbarButton, isActive('Dashboard') && styles.activeNavbarButton]}
        onPress={() => navigation.navigate('Dashboard')}>
        {isActive('Dashboard') ? (
          <ChefHatIcon fill={colors.pink} width={56} height={57} stroke={colors.pink} strokeWidth="0.6" />
        ) : (
          <ChefHatIcon fill={colors.lightishPink} width={58} height={58} stroke={colors.lightishPink} strokeWidth="0.6" />
        )}
        {isActive('Dashboard') && <View style={styles.underline} />}
      </TouchableOpacity>
      {/* {renderIcon('ListingsHost', 'format-list-bulleted', MaterialIcons, 26)}
      {renderIcon('ReservationsHost', 'calendar-today', MaterialIcons, 25)}
      {renderIcon('EarningsHost', 'attach-money', MaterialIcons, 25)}*/}
      {renderIcon('SettingsHost', 'settings', Ionicons, 27)} 
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
    backgroundColor: colors.navBarColor,
    height: 51,
    paddingHorizontal: 16,
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  navbarButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  activeNavbarButton: {
    borderBottomWidth: 3,
    borderBottomColor: colors.pink,
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
