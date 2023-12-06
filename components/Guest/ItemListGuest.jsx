// ItemListGuest.js
import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import HostContext from '../Context/HostContext';
import ItemCard from '../GuestSubComponent/ItemCard';
import ItemListCard from '../GuestSubComponent/ItemListCard';
import { ScrollView } from 'react-native';
import NavBarGuest from '../GuestSubComponent/NavBarGuest';
import { useNavigation } from '@react-navigation/native'; // If you're using React Navigation
import {globalStyles,colors} from '../commonMethods/globalStyles';
import { StyleSheet } from 'react-native';

export default function ItemListGuest() {
  const { hostList } = useContext(HostContext);
  const navigation = useNavigation();
  const [selectedMealTypes, setSelectedMealTypes] = useState({
    breakfast: true,
    lunch: true, 
    dinner: true,
  });
  const handleHostCardClick = (selectedMeal, hostEntity) => {
    // Find the complete set of meals for the host
    const host = hostList.find(h => h.hostEntity.uuidHost === hostEntity.uuidHost);
    if (host) {
      navigation.navigate('HostProfileMealGuest', {
        host: hostEntity,
        itemList: host.meals,
        initialMealType: selectedMeal.mealType
      });
    } else {
      // Handle the case where the host is not found (Optional)
    }
  };

  const toggleMealType = (mealTypeKey) => {
    setSelectedMealTypes({
      ...selectedMealTypes,
      [mealTypeKey]: !selectedMealTypes[mealTypeKey],
    });
  };

  const filterMealsByType = (meal) => {
    return (
      (selectedMealTypes.breakfast && meal.mealType === 'b') ||
      (selectedMealTypes.lunch && meal.mealType === 'l') ||
      (selectedMealTypes.dinner && meal.mealType === 'd')
    );
  };

  return (
    <View style={globalStyles.containerPrimary}>
      <NavBarGuest navigation={navigation} />

      <ScrollView>
        {hostList.map((host, index) => (
          host.meals
            .filter(filterMealsByType)
            .map((meal, mealIndex) => (
              <ItemListCard 
                key={`${index}-${mealIndex}`} 
                item={meal} 
                host={host.hostEntity}
                handleHostCardClick={() => handleHostCardClick(meal, host.hostEntity)}
              />
            ))
        ))}
      </ScrollView>

      {/* Meal Type Filter UI */}
      <View style={styles.mealTypeFilter}>
        {Object.entries(selectedMealTypes).map(([mealTypeKey, isSelected]) => (
          <TouchableOpacity
            key={mealTypeKey}
            onPress={() => toggleMealType(mealTypeKey)}
            style={[
              styles.mealTypeItem,
              isSelected ? styles.activeItem : null,
            ]}
          >
            <Text
              style={[
                styles.mealTypeText,
                isSelected ? styles.activeText : null,
              ]}
            >
              {mealTypeKey.charAt(0).toUpperCase() + mealTypeKey.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Add styles for mealTypeFilter, mealTypeItem, mealTypeText, activeItem, activeText
  mealTypeFilter: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: colors.lightGray, // Use appropriate color
  },
  mealTypeItem: {
    marginHorizontal: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.darkGray, // Use appropriate color
  },
  activeItem: {
    backgroundColor: colors.pink, // Use appropriate color for active state
  },
  mealTypeText: {
    color: colors.darkBlue, // Use appropriate text color
    fontSize: 16,
  },
  activeText: {
    color: colors.white, // Use appropriate text color for active state
  },
});