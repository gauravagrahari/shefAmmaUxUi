import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import {globalStyles,colors} from '../commonMethods/globalStyles';

const MEAL_TYPE_DISPLAY_NAMES = {
  l: 'Lunch',
  b: 'Breakfast',
  d: 'Dinner'
};
export default function NavBarMeals({ selectedMealType, onSelectMealType, availableMealTypes }) {
  return (
    <View style={styles.navbarContainer}>
      {availableMealTypes.map((mealTypeKey) => {
        const isSelected = MEAL_TYPE_DISPLAY_NAMES[mealTypeKey] === selectedMealType;
        return (
          <TouchableOpacity
            key={mealTypeKey}
            style={[
              styles.navbarItem, 
              isSelected && styles.navbarItemSelected // apply the selected style if this meal type is selected
            ]}
            onPress={() => onSelectMealType(mealTypeKey)}
          >
            <Text style={[
              styles.navbarItemText, 
              isSelected && styles.navbarItemSelectedText // apply the selected text style if this meal type is selected
            ]}>
              {MEAL_TYPE_DISPLAY_NAMES[mealTypeKey]}
            </Text>
          </TouchableOpacity>
        );
      })}
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
