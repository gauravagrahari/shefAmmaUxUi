import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

// Import your screen components here
import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';
import OrderHistoryScreen from './OrderHistoryScreen';
import CurrentRatingScreen from './CurrentRatingScreen';
import SettingsScreen from './SettingsScreen';

const Tab = createBottomTabNavigator();

const Navbar = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Dashboard') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            } else if (route.name === 'OrderHistory') {
              iconName = focused ? 'list' : 'list-outline';
            } else if (route.name === 'CurrentRating') {
              iconName = focused ? 'star' : 'star-outline';
            } else if (route.name === 'SettingsHost') {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'blue',
          inactiveTintColor: 'gray',
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="OrderHistory" component={OrderHistoryScreen} />
        <Tab.Screen name="CurrentRating" component={CurrentRatingScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Navbar;
