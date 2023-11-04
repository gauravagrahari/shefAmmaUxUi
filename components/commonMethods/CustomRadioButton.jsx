import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CustomRadioButton = ({ label, value, selectedValue, onValueChange }) => {
    return (
        <TouchableOpacity style={styles.radioButton} onPress={() => onValueChange(value)}>
            <View style={[styles.circle, value === selectedValue && styles.selectedCircle]}>
                {value === selectedValue && <View style={styles.innerCircle} />}
            </View>
            <Text style={styles.radioLabel}>{label}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    },
    circle: {
        height: 24,
        width: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#12486B',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10
    },
    selectedCircle: {
        borderColor: '#2a9d8f'
    },
    innerCircle: {
        height: 14,
        width: 14,
        borderRadius: 7,
        backgroundColor: '#2a9d8f'
    },
    radioLabel: {
        fontSize: 16,
        color: '#12486B'
    }
});

export default CustomRadioButton;
