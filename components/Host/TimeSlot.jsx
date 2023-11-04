import React, { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
export default function TimeSlot({ timeSlot }) {
    const [quantity, setQuantity] = useState(0);
    const decrease = () => {
        if (quantity > 0) {
            setQuantity(quantity - 1);
        }
    };
    const increase = () => {
        setQuantity(quantity + 1);
    };
    return (
        <View style={styles.container}>
            <Text style={styles.slot}>
                {timeSlot.startTime} - `{timeSlot.startTime}+{timeSlot.duration}`
            </Text>
            <Text style={styles.capacity}>Maximum Guest {timeSlot.capacity}</Text>
            <View style={styles.quantityContainer}>
                <Text style={styles.quantity}>{quantity}</Text>
                <Button title="-" onPress={decrease} />
                <Button title="+" onPress={increase} />
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 8,
        marginBottom: 10,
    },
    slot: {
        fontSize: 12,
        marginBottom: 2,
    },
    capacity: {
        fontSize: 12,
        marginBottom: 2,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    quantity: {
        marginRight: 10,
        fontSize: 12,
    },
});