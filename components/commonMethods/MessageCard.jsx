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
            <Text style={styles.message}>{message}</Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: '10%',
        left: '10%',
        right: '10%',
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#444',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    message: {
        color: '#fff',
        fontSize: 16,
    }
});

export default MessageCard;
