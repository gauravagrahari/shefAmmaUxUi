import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import {globalStyles,colors} from '../commonMethods/globalStyles';

export default function NavBarMeals({ selectedMealType, onSelectMealType })  {
  return (
    <View style={styles.navbarContainer}>
      {['Breakfast', 'Lunch', 'Dinner'].map(mealType => (
        <TouchableOpacity 
          key={mealType}
          style={[
            styles.navbarItem, 
            selectedMealType === mealType && styles.navbarItemSelected
          ]}
          onPress={() => onSelectMealType(mealType)}
        >
          <Text style={[
            styles.navbarItemText,
            selectedMealType === mealType && styles.navbarItemSelectedText
          ]}>
            {mealType}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  navbarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    // padding: 5,
    backgroundColor: colors.darkBlue, // dark blue-gray
    // borderRadius:10,
    marginBottom:1
  },
  navbarItem: {
    paddingVertical: 13,
    paddingHorizontal: 20,
    // borderRadius: 20,
    // backgroundColor: '#34495E', // light blue-gray
  },
  navbarItemSelected: {
    // borderBottomColor: colors.primaryText, 
    borderBottomColor:colors.primaryText, 
    borderBottomWidth:2,
  },
  navbarItemText: {
    color: colors.pink, // almost white
    // color: colors.darkPink, // almost white
    fontWeight: 'bold',
    fontSize: 16,
  },
  navbarItemSelectedText: {
    // color: colors.primaryText, // almost white
    color: colors.primaryText, // almost white
    fontWeight: 'bold',
    fontSize: 17,
  },
});
