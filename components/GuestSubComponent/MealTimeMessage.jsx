import React, { useState, useEffect } from 'react';
import { Text,StyleSheet,View  } from 'react-native';
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
            try {
                let data = await getFromSecureStore('charges');
                // Attempt to parse the stored data as JSON, handling cases where the data may not be a string
                if (data) {
                    try {
                        // Attempt to parse and set charges
                        const parsedData = JSON.parse(data);
                        setCharges(parsedData);
                    } catch (error) {
                        // If JSON.parse() fails, it's possible the data is already an object
                        console.error('Error parsing charges from storage:', error);
                        // Assuming the data might already be in the correct format if parsing fails
                        setCharges(data);
                    }
                }
            } catch (error) {
                console.error('Error fetching charges from storage:', error);
            }
        };
        fetchData();
    }, []);
    

    if (!charges) return <Text>Loading...</Text>; // Display loading while the charges data is being fetched

    const getCurrentDateAndDay = () => {
        const today = new Date();
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return `${dayNames[today.getDay()]}, ${today.getDate()} ${today.toLocaleString('default', { month: 'long' })}`;
    };

    const getDeliveryDate = () => {
        const today = new Date();
        today.setDate(today.getDate() + 1);
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return `${dayNames[today.getDay()]}, ${today.getDate()} ${today.toLocaleString('default', { month: 'long' })}`;
    };

    const isOrderForToday = (bookTime) => {
        if (!bookTime) return false; // Handle undefined bookTime
        const currentTime = new Date();
        const [hours, minutes] = bookTime.split(":").map(Number);
        const orderTime = new Date();
        orderTime.setHours(hours, minutes);
        return currentTime <= orderTime;
    };
    const formatTime = (time) => {
        let [hours, minutes] = time.split(':');
        hours = parseInt(hours, 10);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return `${hours}:${minutes} ${ampm}`;
      };
    let dateMessage, timeMessage, bookTimeMessage;
    switch (mealType) {
        case MEAL_TYPE_MAPPING.Breakfast:
            dateMessage = isOrderForToday(charges.breakfastBookTime) ? getCurrentDateAndDay() : getDeliveryDate();
            timeMessage = ` ${charges.breakfastStartTime} - ${charges.breakfastEndTime}`;
            bookTimeMessage = ` ${charges.breakfastBookTime}`;
            break;
        case MEAL_TYPE_MAPPING.Lunch:
            dateMessage = isOrderForToday(charges.lunchBookTime) ? getCurrentDateAndDay() : getDeliveryDate();
            timeMessage = ` ${charges.lunchStartTime} - ${charges.lunchEndTime}`;
            bookTimeMessage = `${charges.lunchBookTime}`;
            break;
        case MEAL_TYPE_MAPPING.Dinner:
            dateMessage = isOrderForToday(charges.dinnerBookTime) ? getCurrentDateAndDay() : getDeliveryDate();
            timeMessage = ` ${charges.dinnerStartTime} - ${charges.dinnerEndTime}`;
            bookTimeMessage = `${charges.dinnerBookTime}`;
            break;
        default:
            return <Text>Invalid meal type</Text>;
    }
    return (
        <LinearGradient colors={[colors.darkBlue, colors.secondCardColor]} style={styles.container}>
            <Text style={styles.messageText}>
                We're delighted to prepare your <Text style={styles.highlightedText}>{mealType.toUpperCase()}</Text>. 
                Kindly expect it on <Text style={styles.highlightedText}>{dateMessage}</Text> between 
                <Text style={styles.highlightedText}>{timeMessage}</Text>. {mealType.toUpperCase()} can be ordered each day by
                <Text style={styles.highlightedText}> {formatTime(bookTimeMessage)}.</Text>
            </Text>
        </LinearGradient>
    );
}
const styles = StyleSheet.create({
    container: {
        borderRadius: 5,
        textAlign: 'center',
        marginHorizontal: 10,
        marginBottom:10,
        borderWidth: 2,
        borderColor: colors.primaryText,
    },
    messageText: {
        fontSize: 16,
        padding: 5,
        textAlign: 'center',
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
