import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {globalStyles,colors} from '../commonMethods/globalStyles.js';
import messages from '../commonMethods/texts.js';
import { LinearGradient } from 'expo-linear-gradient';

const WelcomeMessage = () => {
  const navigation = useNavigation();

  return (
    <LinearGradient colors={[colors.darkBlue,'white']} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.mainHeading}>Welcome to ShefAmma!</Text>
        <Text style={styles.commonText}>{messages.welcomeMessage}</Text>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('SelectDefaultAddress')}
        >
          <Text style={styles.buttonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
   
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
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
    borderBottomWidth:3,
    paddingBottom:10,
    borderBottomColor: colors.deepBlue
    
  },
  commonText: {
    fontSize: 17,
    marginVertical: 10,
    color: colors.deepBlue,
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    borderWidth:2,
    borderColor:colors.pink,
  },
  buttonText: {
    color: colors.pink,
    fontSize: 16,
    textAlign: 'center',
  }
});

export default WelcomeMessage;
