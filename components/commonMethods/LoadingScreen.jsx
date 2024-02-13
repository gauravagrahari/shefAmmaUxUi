import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const LoadingScreen = () => {
    return (
        <LinearGradient
            colors={['#eaf6f6', '#FFF']}
            style={styles.loadingContainer}>
            {/* <View style={styles.brandContainer}>
                <Text style={styles.shef}>Shef</Text>
                <Text style={styles.amma}>Amma</Text>
            </View>
            <Text style={styles.tagline}>Home-Cooked Delights, Delivered to Your Doorstep</Text> */}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    brandContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    shef: {
        fontSize: 48,
        color: '#D0004E',
    },
    amma: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#D0004E',
    },
    tagline: {
        fontSize: 16,
        color: '#385170',
        fontStyle: 'italic',
    },
});

export default LoadingScreen;
