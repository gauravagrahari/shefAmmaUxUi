import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import {globalStyles,colors} from '../commonMethods/globalStyles';

export default function NavBarMeals({ selectedMealType, onSelectMealType, servedMeals }) {
  return (
    <View style={styles.navbarContainer}>
      {servedMeals.map(mealType => {
        let fullMealName;
        switch(mealType) {
          case 'b':
            fullMealName = 'Breakfast';
            break;
          case 'l':
            fullMealName = 'Lunch';
            break;
          case 'd':
            fullMealName = 'Dinner';
            break;
          default:
            fullMealName = mealType; // In case it's already a full name
        }

        return (
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
              {fullMealName}
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
