import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../commonMethods/globalStyles';

const OrderStatusFilter = ({ selectedStatus, onSelectStatus }) => {
  // Define the status options
  const statusOptions = [
    { key: 'ip', label: 'To Pick Up' },
    { key: 'pkd', label: 'To Deliver' },
    { key: 'com', label: 'Completed' },
  ];

  return (
    <View style={styles.filterContainer}>
      {statusOptions.map(({ key, label }) => (
        <TouchableOpacity
          key={key}
          style={[styles.filterItem, selectedStatus === key && styles.filterItemSelected]}
          onPress={() => onSelectStatus(key)}
        >
          <Text style={[styles.filterItemText, selectedStatus === key && styles.filterItemSelectedText]}>
            {label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.darkBlue,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 3,
    borderTopColor: colors.pink,
    marginBottom: 1,
  },
  filterItem: {
    paddingVertical: 13,
    paddingHorizontal: 20,
  },
  filterItemSelected: {
    borderBottomColor: colors.primaryText,
    borderBottomWidth: 3,
  },
  filterItemText: {
    color: colors.pink,
    fontWeight: 'bold',
    fontSize: 16,
  },
  filterItemSelectedText: {
    color: colors.primaryText,
    fontSize: 17,
  },
});
