import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {globalStyles,colors} from '../commonMethods/globalStyles.js';
import messages from '../commonMethods/texts.js';
import { LinearGradient } from 'expo-linear-gradient';
import { BackHandler } from 'react-native';
import * as Animatable from 'react-native-animatable'; // Import Animatable

const WelcomeMessage = () => {
  const navigation = useNavigation();
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        console.log('Back button pressed in HomeGuest');
        return true;
      };
  
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
  
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  return (
    <View style={styles.container}>
      <Animatable.View animation="fadeInUp" duration={1200} style={styles.card}>
        <LinearGradient colors={['#f6f6f6', colors.darkBlue]} style={styles.gradient}>
          <Text style={styles.mainHeading}>Welcome to ShefAmma!</Text>
          <Text style={styles.commonText}>{messages.welcomeMessage}</Text>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => navigation.navigate('HomeGuest')}
          >
            <LinearGradient colors={[colors.lightishPink, colors.lightishPink]} style={styles.gradientButton}>
              <Text style={styles.buttonText}>Close</Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </Animatable.View>
    </View>
  );
};
const { width, height } = Dimensions.get('window');
const responsiveSize = (size) => {
  const baseWidth = 375; // Base screen width to scale from (e.g., iPhone X)
  return (size / baseWidth) * width;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.darkBlue,
  },
  card: {
    margin: 15,
    padding: 20,
    borderRadius: 10,
    backgroundColor: colors.darkBlue,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  mainHeading: {
    color: colors.pink,
    fontSize: responsiveSize(22), // Responsive font size
    fontWeight: 'bold',
    marginVertical: height * 0.02, // Responsive vertical margin
    textAlign: 'center',
    borderBottomWidth: 2,
    paddingBottom: 10,
    borderBottomColor: colors.matBlack
  },
  commonText: {
    fontSize: responsiveSize(17), // Responsive font size
    marginVertical: 10,
    color: colors.deepBlue,
    textAlign: 'center',
  },
  gradient: {
    flex: 1,
    borderRadius: 10,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginTop: 20,
    borderRadius: 5,
    overflow: 'hidden',
  },
  gradientButton: {
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 4,
  },
  buttonText: {
    color: colors.navBarColor,
    fontSize: 16,
    textAlign: 'center',
  }
});

export default WelcomeMessage;
