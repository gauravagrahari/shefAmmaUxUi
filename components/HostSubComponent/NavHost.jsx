import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function NavHost() {
  const navigation = useNavigation();
  return (
    <View style={styles.navbar}>
        
      <TouchableOpacity
        style={styles.navbarButton}
        onPress={() => navigation.navigate('Dashboard')}>
        <MaterialIcons name="dashboard" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navbarButton}
        onPress={() => navigation.navigate('ProfileHost')}>
        <FontAwesome name="user" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navbarButton}
        onPress={() => navigation.navigate('OrderHistoryHost')}>
        <FontAwesome name="list" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navbarButton}
        onPress={() => navigation.navigate('SettingsHost')}>
        <Ionicons name="ios-settings" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#6a1b9a',
    height: 56,
    paddingHorizontal: 16,
  },
  navbarButton: {
    alignItems: 'center',
  }
});
