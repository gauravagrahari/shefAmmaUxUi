import React, { useState, useEffect } from 'react';
import { Text,StyleSheet  } from 'react-native';
import { getFromSecureStore } from '../Context/SensitiveDataStorage';
import {globalStyles,colors} from '../commonMethods/globalStyles';
import { LinearGradient } from 'expo-linear-gradient';

const MEAL_TYPE_MAPPING = {
    Breakfast: 'Breakfast',
    Lunch: 'Lunch',
    Dinner: 'Dinner',
};

function MealTimeMessage({ mealType, onDateAndTimeChange }) {
    const [charges, setCharges] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            let data = await getFromSecureStore('charges');
            setCharges(data);
        };
        fetchData();
    }, []);

   useEffect(() => {
    if (dateMessage && timeMessage) {
        onDateAndTimeChange(`${dateMessage},${timeMessage}`);
    }
}, [dateMessage, timeMessage, onDateAndTimeChange]);

    if (!charges) return <Text>Loading...</Text>; // Display loading while the charges data is being fetched

    const getCurrentDateAndDay = () => {
        const today = new Date();
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return `${dayNames[today.getDay()]}, ${today.getDate()} ${today.toLocaleString('default', { month: 'long' })}`;
    }

    const getDeliveryDate = () => {
        const today = new Date();
        today.setDate(today.getDate() + 1);
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return `${dayNames[today.getDay()]}, ${today.getDate()} ${today.toLocaleString('default', { month: 'long' })}`;
    }

    const isOrderForToday = (bookTime) => {
        if (!bookTime) return false; // Handle undefined bookTime
        const currentTime = new Date();
        const [hours, minutes] = bookTime.split(":").map(Number);
        const orderTime = new Date();
        orderTime.setHours(hours, minutes);
        return currentTime <= orderTime;
    }

    let dateMessage, timeMessage;
    switch (mealType) {
        case MEAL_TYPE_MAPPING.Breakfast:
            dateMessage = isOrderForToday(charges.breakfastBookTime) ? getCurrentDateAndDay() : getDeliveryDate();
            timeMessage = ` ${charges.breakfastStartTime} and ${charges.breakfastEndTime}`;
            break;
        case MEAL_TYPE_MAPPING.Lunch:
            dateMessage = isOrderForToday(charges.lunchBookTime) ? getCurrentDateAndDay() : getDeliveryDate();
            timeMessage = ` ${charges.lunchStartTime} and ${charges.lunchEndTime}`;
            break;
        case MEAL_TYPE_MAPPING.Dinner:
            dateMessage = isOrderForToday(charges.dinnerBookTime) ? getCurrentDateAndDay() : getDeliveryDate();
            timeMessage = ` ${charges.dinnerStartTime} and ${charges.dinnerEndTime}`;
            break;
        default:
            return <Text>Invalid meal type</Text>;
    }
    return (
        <LinearGradient colors={[ colors.darkBlue,colors.secondCardColor]}>
            <Text style={styles.messageText}>
            We're delighted to prepare your 
            <Text style={styles.highlightedText}> {mealType.toUpperCase()} </Text>
            . Kindly expect it on 
            <Text style={styles.highlightedText}> {dateMessage} </Text>
            between 
            <Text style={styles.highlightedText}> {timeMessage} </Text>
            </Text>
        </LinearGradient>
    );    

}
const styles = StyleSheet.create({
    messageText: {
        fontSize: 16,
        padding: 5,
        // backgroundColor: colors.darkBlue, // Light grey background
        borderRadius: 5,
        textAlign: 'center',
        marginHorizontal: 10,
        marginBottom:10,
        borderWidth: 2,
        borderColor: colors.primaryText,
        // fontWeight: '500',
        color:colors.deepBlue,

    },
    errorMessage: {
        fontSize: 16,
        color: colors.pink,   // Red color for error messages
        textAlign: 'center',
        // margin: 10,
    },
    highlightedText: {
        fontWeight: 'bold',
        // color: colors.primaryText, // A standard blue for emphasis. Change as per your design preference.
        color: colors.deepBlue, // A standard blue for emphasis. Change as per your design preference.
    }
});

export default MealTimeMessage;
