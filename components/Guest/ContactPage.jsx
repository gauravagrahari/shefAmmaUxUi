import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet,Dimensions, ScrollView  } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import {globalStyles,colors} from '../commonMethods/globalStyles';
import { LinearGradient } from 'expo-linear-gradient';
import { getFromSecureStore } from '../Context/SensitiveDataStorage';
import MessageCard from '../commonMethods/MessageCard';

const ContactPage = () => {
    const [messageCardVisible, setMessageCardVisible] = useState(false);
    const [messageCardText, setMessageCardText] = useState('');

    const handleEmailPress = async (email) => {
        try {
            const userPhoneNumber = await getFromSecureStore('phone');
            const emailSubject = encodeURIComponent('');
            const emailBody = encodeURIComponent(`Mobile Number - ${userPhoneNumber}\n\nMy Concern or Query - `);
            const mailtoUrl = `mailto:${email}?subject=${emailSubject}&body=${emailBody}`;
            await Linking.openURL(mailtoUrl);
        } catch (error) {
            console.error('Error fetching phone number or opening email client:', error);
            await Clipboard.setStringAsync(email); // Use setStringAsync for Expo's Clipboard
            showMessageCard('Email address copied to clipboard!');
        }
    };
    
    const showMessageCard = (message) => {
        setMessageCardText(message);
        setMessageCardVisible(true);
        setTimeout(() => setMessageCardVisible(false), 2900); // Hide after the animation
    };
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={globalStyles.headerText}>Contact Us</Text>
            <LinearGradient colors={[colors.darkBlue, colors.secondCardColor]} style={styles.card}>
                <Text style={styles.contentText}>
                    If you have any complaints or issues regarding your order, 
                    please email us at 
                    <Text style={styles.emailText} onPress={() => handleEmailPress('complaint@shefamma.com')}>
                        {" complaint@shefamma.com "}
                    </Text>
                    with your registered contact number and your concern.
                </Text>
            </LinearGradient>

            <LinearGradient colors={[colors.darkBlue, colors.secondCardColor]} style={styles.card}>
                <Text style={styles.contentText}>
                    For general inquiries or to join us as a partner email us at 
                    <Text style={styles.emailText} onPress={() => handleEmailPress('contactus@shefamma.com')}>
                        {" contactus@shefamma.com "}
                    </Text>
                    with contact information and the details.
                </Text>
            </LinearGradient>
            <MessageCard message={messageCardText} isVisible={messageCardVisible} onClose={() => setMessageCardVisible(false)} />
            <Text style={styles.footerText}>
                Thank you for choosing ShefAmma!
            </Text>
        </ScrollView> 
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
        backgroundColor:colors.darkBlue,
    },
    card: {
        padding: screenWidth * 0.043,
        borderRadius: 15, // More pronounced rounded corners
        elevation: 6, // Slightly more shadow for Android
        shadowColor: '#000', // Shadow for iOS
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        marginBottom: screenWidth * 0.06,
        margin:10,
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

