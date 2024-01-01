import React, { useState, useEffect } from 'react';
import { Animated, View, Text, StyleSheet } from 'react-native';

const MessageCard = ({ message, isVisible, onClose }) => {
    const [fadeAnim] = useState(new Animated.Value(0));  // Initial value for opacity

    useEffect(() => {
        if (isVisible) {
            // Fade in animation
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true
            }).start(() => {
                // Fade out after 3 seconds
                setTimeout(() => {
                    Animated.timing(fadeAnim, {
                        toValue: 0,
                        duration: 900,
                        useNativeDriver: true
                    }).start(onClose);
                }, 2000);
            });
        }
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <Animated.View style={{ ...styles.container, opacity: fadeAnim }}>
            <View style={styles.messageBox}>
                <Text style={styles.message}>{message}</Text>
            </View>
        </Animated.View>
    );
    
}
const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: adds a semi-transparent overlay for better visibility
    },
    messageBox: {
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#444',
        alignItems: 'center',
        justifyContent: 'center',
        // shadowColor: '#000',
        // shadowOffset: {
        //     width: 0,
        //     height: 2,
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 3.84,
        // elevation: 5,
        maxWidth: '80%', // Ensures the box doesn't stretch too wide on larger screens
    },
    message: {
        color: '#fff',
        fontSize: 16,
    }
});

export default MessageCard;
