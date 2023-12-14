import React from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet,Dimensions  } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {globalStyles,colors} from '../commonMethods/globalStyles';
import { LinearGradient } from 'expo-linear-gradient';
import { getFromSecureStore } from '../Context/SensitiveDataStorage';

const ContactPage = () => {

    const handleEmailPress = async (email) => {
        try {
            const userPhoneNumber = await getFromSecureStore('phone');
            // const emailSubject = encodeURIComponent('ShefAmma - Customer Inquiry/Complaint');
            const emailBody = encodeURIComponent(`Mobile Number - ${userPhoneNumber}\n\nMy Concern - `);
            const mailtoUrl = `mailto:${email}?subject=${emailSubject}&body=${emailBody}`;
            Linking.openURL(mailtoUrl);
        } catch (error) {
            console.error('Error fetching phone number:', error);
            Clipboard.setString(email);
            alert('Email address copied to clipboard. Please paste it in your mail app.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Contact Us</Text>

            <LinearGradient colors={[colors.darkBlue, '#fcfddd']} style={styles.card}>
                <Text style={styles.contentText}>
                    If you have any complaints or issues regarding your order, 
                    please email us at 
                    <Text style={styles.emailText} onPress={() => handleEmailPress('complaint@shefamma.com')}>
                        {" complaint@shefamma.com "}
                    </Text>
                    with your order number and contact number.
                </Text>
            </LinearGradient>

            <LinearGradient colors={[colors.darkBlue, '#fcfddd']} style={styles.card}>
                <Text style={styles.contentText}>
                    For general inquiries, email us at 
                    <Text style={styles.emailText} onPress={() => handleEmailPress('contactus@shefamma.com')}>
                        {" contactus@shefamma.com "}
                    </Text>
                    with your name and contact information.
                </Text>
            </LinearGradient>

            <Text style={styles.footerText}>
                Thank you for choosing ShefAmma.
            </Text>
        </View>
    );
};
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
        justifyContent: 'center', // Center content vertically
    },
    container: {
        flex: 1,
        justifyContent: 'center', // Center content vertically
        padding: screenWidth * 0.05,
        backgroundColor: colors.deepBlue,
    },
    headerText: {
        fontSize: screenWidth * 0.055,
        color: colors.pink,
        fontWeight: 'bold',
        marginBottom: screenWidth * 0.03,
        textAlign: 'center',
    },
    card: {
        padding: screenWidth * 0.04,
        borderRadius: 15, // More pronounced rounded corners
        elevation: 6, // Slightly more shadow for Android
        shadowColor: '#000', // Shadow for iOS
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        marginBottom: screenWidth * 0.06,
    },
    contentText: {
        fontSize: screenWidth * 0.04,
        color: colors.deepBlue,
    },
    emailText: {
        color: colors.pink,
        textDecorationLine: 'underline',
    },
    footerText: {
        fontSize: screenWidth * 0.04,
        color: colors.pink,
        textAlign: 'center',
        marginTop: screenWidth * 0.02,
    },
});

export default ContactPage;

//call other cooks 
//call bhooomi and look into sms succcess as false
//proceed to putting srver to live.
