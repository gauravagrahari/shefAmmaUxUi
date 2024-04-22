import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { globalStyles, colors } from '../commonMethods/globalStyles';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import Constants from 'expo-constants';

const screenWidth = Dimensions.get('window').width;

const ServiceAvailability = () => {
    const [serviceDetails, setServiceDetails] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const URL = Constants.expoConfig.extra.apiUrl; // Ensure you have URL in your app.json under extra
            try {
                const response = await axios.get(`${URL}/guest/services`);
                setServiceDetails(response.data);
            } catch (error) {
                console.error('Error fetching service details:', error);
                setServiceDetails(null); // In case of error, set serviceDetails to null to show default message
            }
        };
    
        fetchData();
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                <LinearGradient colors={[colors.darkSeaBlue, colors.seaBlue]} style={styles.card}>
                    <Text style={styles.mainHeading}>Our Service Availability</Text>
                    {serviceDetails ? (
                        <Text style={styles.commonText}>
                            {serviceDetails}
                        </Text>
                    ) : (
                        <Text style={styles.commonText}>
                            Currently, our Services are available in the Kolkata region of Sector 5, Sector 2, Keshtopur, and near DLF 1. Arriving soon at other parts of Kolkata.
                        </Text>
                    )}
                </LinearGradient>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center', // Center content vertically
        alignItems: 'center', // Center content horizontally
        backgroundColor: colors.pink, // Background color
        padding: screenWidth * 0.05,
    },
    scrollViewContainer: {
        flexGrow: 1,
        justifyContent: 'center', // Ensure the content is centered vertically
        alignItems: 'center', // Ensure the content is centered horizontally
    },
    card: {
        width: '100%',
        padding: 20,
        borderRadius: 15,
        backgroundColor: 'white', // Card background color
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    mainHeading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: colors.deepBlue, // Heading color
    },
    commonText: {
        fontSize: 16,
        color: 'white', // Text color
        textAlign: 'center', // Center text horizontally
        marginBottom: 10,
    },
});

export default ServiceAvailability;
