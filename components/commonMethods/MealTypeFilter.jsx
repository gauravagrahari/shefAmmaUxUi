// MealTypeFilter.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { colors } from '../commonMethods/globalStyles';

const MealTypeFilter = ({ selectedMealTypes, toggleMealType }) => {
  return (
    <View style={styles.mealTypeFilter}>
      {['breakfast', 'lunch', 'dinner'].map((mealType) => (
        <TouchableOpacity
          key={mealType}
          onPress={() => toggleMealType(mealType)}
          style={[
            styles.mealTypeItem,
            selectedMealTypes[mealType] ? styles.activeItem : null,
          ]}
        >
          <View style={styles.mealTypeContent}>
            {selectedMealTypes[mealType] && (
              <Icon name="check" size={12} color={colors.seaBlue} style={styles.iconWrapper} />
            )}
            <Text
              style={[
                styles.mealTypeText,
                selectedMealTypes[mealType] ? styles.activeText : null,
              ]}
            >
              {capitalize(mealType)}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  mealTypeFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mealTypeItem: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    backgroundColor: colors.pink,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  mealTypeContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    position: 'absolute',
    left: 8,
    top: 8,
  },
  mealTypeText: {
    fontSize: 16,
    color: colors.darkestBlue,
    textAlign: 'center',
  },
  activeItem: {
    backgroundColor: colors.pink,
  },
  activeText: {
    fontWeight: 'bold',
    color: colors.darkestBlue,
  },
});

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default MealTypeFilter;
