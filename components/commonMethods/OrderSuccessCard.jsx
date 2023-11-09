import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; // for the check-circle icon
import { useNavigation } from '@react-navigation/native';
import {globalStyles,colors} from '../commonMethods/globalStyles';

export default function OrderSuccessCard({ isVisible, onClose }) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(-50)).current;
  const navigation = useNavigation();

    useEffect(() => {
        if (isVisible) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true
                }),
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true
                })
            ]).start();
        } else {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true
            }).start();
        }
    }, [isVisible]);

    return (
        <Animated.View style={{
            ...styles.container,
            opacity: fadeAnim,
            transform: [{ translateY }]
        }}>
  

            <AntDesign name="checkcircle" size={50} color={colors.darkBlue} />
            <Text style={styles.successText}>Order Successful</Text>
            <Text style={styles.thankYouText}>Thank You!</Text>
            <TouchableOpacity 
    onPress={() => {
        onClose(); // Call the passed-in onClose function first
        navigation.navigate('HomeGuest'); // Then navigate to HomeGuest
    }}
>
    <Text style={styles.closeButton}>×</Text>
</TouchableOpacity>


        </Animated.View>
    );
}

const styles = {
    container: {
        position: 'absolute',
        top: '40%',
        left: '10%',
        right: '10%',
        padding: 30,
        backgroundColor: '#f5f5f5', // light gray background for a subtle look
        backgroundColor: colors.lightOlive, // light gray background for a subtle look
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
 
    successText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.darkBlue, // green text for "Order Successful"
        marginTop: 10
    },
    thankYouText: {
        fontSize: 18,
        marginTop: 10,
        color: colors.darkestBlue, // dark gray for a softer look
        // color: '#555' // dark gray for a softer look
    },
    closeButton: {
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: 15,
        color: colors.deepBlue // dark gray to keep it subtle
    }
};
