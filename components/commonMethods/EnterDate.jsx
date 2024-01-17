import React, { useState } from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import {globalStyles,colors} from '../commonMethods/globalStyles';
import Ionicons from '@expo/vector-icons/Ionicons'; 

export const EnterDate = ({ onDateChange }) => {
  const [date, setDate] = useState('');
  const [error, setError] = useState('');

  const handleDateChange = (text) => {
    let formattedDate = text.replace(/[^0-9/]/g, ''); // Remove non-numeric characters except /

    // Formatting the date to include '/'
    if (text.length === 3 && !text.includes('/')) {
      formattedDate = formattedDate.substr(0, 2) + '/' + formattedDate.substr(2);
    } else if (text.length === 6 && !text.slice(-1).includes('/')) {
      formattedDate = formattedDate.substr(0, 5) + '/' + formattedDate.substr(5);
    }

    setDate(formattedDate);

    // Perform validation
    if (formattedDate.length !== 10) {
      setError('Invalid date format');
      onDateChange(null);
    } else {
      const day = parseInt(formattedDate.substr(0, 2), 10);
      const month = parseInt(formattedDate.substr(3, 2), 10);
      const year = parseInt(formattedDate.substr(6, 4), 10);

      const currentYear = new Date().getFullYear();
      const isValidDay = day >= 1 && day <= 31;
      const isValidMonth = month >= 1 && month <= 12;
      const isValidYear = year > 0 && year <= currentYear;

      if (!isValidDay) {
        setError('Invalid day');
        onDateChange(null);
      } else if (!isValidMonth) {
        setError('Invalid month');
        onDateChange(null);
      } else if (!isValidYear) {
        setError('Invalid year');
        onDateChange(null);
      } else {
        setError('');
        onDateChange(formattedDate);
      }
    }
  };
  function MandatoryFieldIndicator() {
    return (
        <Text style={{ color: 'red', fontSize: 18, marginRight: 5,marginBottom:7, alignSelf: 'center' }}>*</Text>
        );
  }
  return (
    <View style={styles.container}>
        <View style={styles.inputContainer}>
            <Ionicons name="calendar-outline" size={24} color={colors.pink} />
            <MandatoryFieldIndicator />
            <TextInput
                style={styles.input}
                placeholder="Enter DOB in format DD/MM/YYYY"
                keyboardType="numeric"
                maxLength={10}
                onChangeText={handleDateChange}
                value={date}
                // placeholderTextColor={colors.matBlack}
            />
        </View>
        {error !== '' && <Text style={styles.errorText}>{error}</Text>}
    </View>
);
}

const styles = StyleSheet.create({
  container: {
      marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomColor: colors.pink,
    borderBottomWidth: 2,
  },
  input: {
    flex: 1,
    height: 50,
    marginLeft: 10,
    color: colors.matBlack,
    fontSize: 16,
  },
  errorText: {
      color: 'red',
      marginTop: 5,
      marginLeft: 10,
      fontSize: 14,
  },
});






