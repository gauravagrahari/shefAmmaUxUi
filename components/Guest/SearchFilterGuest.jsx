 import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

export default function SearchFilterGuest({ navigation, route }) {
 
  const { radius: routeRadius, address: routeAddress } = route.params;
  const [location, setLocation] = useState(null);
  const [mapRegion, setMap] = useState(null);
  const [radius, setRadius] = useState(routeRadius); 
  const [address, setAddress] = useState(routeAddress); 

  // useEffect(() => {
  //   setRadius(routeRadius);
  //   setAddress(routeAddress);
  // }, [routeRadius, routeAddress]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleLocateMePress = async () => {
    // Implement locating user's current location
    // Use the Location API from expo-location
    // Update the location and mapRegion state with the retrieved coordinates
  };
  const handleApplyPress = () => {
    navigation.navigate('SearchGuest', { radius, address }); // Add this line
  };

  useEffect(() => {
    
  }, []);
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
        <Text style={styles.backButtonText}>{'< Back'}</Text>
      </TouchableOpacity>
      <Text style={styles.label}>Within Radius</Text>
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} placeholder="Enter Radius" value={radius} onChangeText={setRadius} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Locate Me" onPress={handleLocateMePress} />
        <Button title="Apply" onPress={handleApplyPress} />
      </View>
      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker coordinate={location} />
        </MapView>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    marginTop: 10,
    marginLeft: 10,
  },
  backButtonText: {
    fontSize: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginLeft: 10,
  },
  inputContainer: {
    marginHorizontal: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  input: {
    height: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});
