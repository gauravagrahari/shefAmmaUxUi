import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import {globalStyles,colors} from '../commonMethods/globalStyles';
import Constants from 'expo-constants';
import config from '../Context/constants';
const URL = Constants.expoConfig.extra.apiUrl || config.URL;

const CheckPincode = ({ onClose }) => {
    const [pincode, setPincode] = useState('');
    const isValidPinCode = (pin) => {
        return /^\d{6}$/.test(pin);
    };
    const checkAvailability = async () => {
        if (!isValidPinCode(pincode)) {
            alert("Please enter a valid 6-digit pin code.");
            return;
        }
        try {
            const response = await axios.get(`${URL}/guest/checkService`, {
                headers: { 'pinCode': pincode }
            });
    
            if (response.status === 200) { // HTTP status 200 means OK
                alert(response.data+" Or try refreshing the Home Page."); // this will either show "Service is available in your area!" or an error message
            } else if (response.status === 404) { // HTTP status 404 means NOT FOUND
                alert(response.data); // this will show "Sorry, service is not available in your area."
            }
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code that falls out of the range of 2xx
                alert(error.response.data);
            } else if (error.request) {
                // The request was made but no response was received
                alert('No response from server. Please try again later.');
            } else {
                // Something happened in setting up the request that triggered an error
                alert('Error checking availability.');
            }
        }
    };
    

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <TextInput
                style={styles.input}
                placeholder="Enter Pincode"
                value={pincode}
                onChangeText={setPincode}
                keyboardType="number-pad"
                maxLength={6}
            />
            <TouchableOpacity style={styles.button} onPress={checkAvailability}>
                <Text style={styles.buttonText}>Check Service Availabitiy</Text>
            </TouchableOpacity>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        alignItems: 'center',
        backgroundColor: colors.darkBlue,
    },
    closeButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: colors.pink,
        borderRadius: 20,
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButtonText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: 'white',
    },
    input: {
        width: '90%',
        height: 50,
        paddingLeft: 10,
        marginBottom: 15,
        borderBottomWidth: 2,
        borderBottomColor: colors.pink,
        color: colors.matBlack,
        fontSize: 16,
    },
    button: {
        width: '100%',
        height: 55,
        borderRadius: 10,
        borderColor: colors.pink,
        borderWidth: 2,
        backgroundColor: 'rgba(0, 150, 136, 0.1)', // Using the same 80% opacity of #009688
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: colors.matBlack,
        fontSize: 18,
    },
});


export default CheckPincode;
