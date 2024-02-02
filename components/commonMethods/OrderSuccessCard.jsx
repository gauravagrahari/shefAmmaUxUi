import React, { useRef, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, Animated } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; // for the check-circle icon
import { useNavigation } from '@react-navigation/native';
import {colors} from '../commonMethods/globalStyles';

export default function OrderSuccessCard({ isVisible, onClose }) {
  const navigation = useNavigation();
    return (
        <Modal
      transparent={true}
      visible={isVisible}
      animationType="fade"
      onRequestClose={onClose}>
         <View style={styles.overlay}>
            <View style={styles.container}>
                <AntDesign name="checkcircle" size={50} color="lightgreen" />
                <Text style={styles.successText}>Order Successful</Text>
                <Text style={styles.thankYouText}>Thank You!</Text>
                <Text style={styles.message}>Constantly working towards bringing the best service for you!</Text>
                <TouchableOpacity onPress={() => {
                    onClose();
                    navigation.navigate('ItemListGuest');
                }}>
                    <Text style={styles.closeButton}>×</Text>
                </TouchableOpacity>
            </View>
            </View>
            </Modal>
    );
}

const styles = {
    container: {
        position: 'absolute',
        width: '80%',
        left: '10%',
        right: '10%',
        padding: 30,
        // backgroundColor: '#f5f5f5', // light gray background for a subtle look
        backgroundColor: colors.pink, // light gray background for a subtle look
        borderRadius: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        justifyContent: 'center',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
      },
    fullScreenOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.71)', // Dark overlay
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardContainer: {
        width: '80%', // Maintain the width as per your requirement
        padding: 30,
        backgroundColor: colors.pink,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    message:{
        fontSize: 15,
        marginTop: 20,
        color: '#ECF87F',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        fontWeight: 'bold',
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
        fontSize: 35,
        fontWeight: 'bold',
        marginTop: 15,
        color: colors.navBarColor, // dark gray to keep it subtle
        padding: 10,
    }
};
