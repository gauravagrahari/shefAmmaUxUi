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
import Icon from 'react-native-vector-icons/AntDesign';
import MealTypeFilter from '../commonMethods/MealTypeFilter';

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
    const isOnlyOneSelected = Object.values(selectedMealTypes).filter(val => val).length === 1;
    const isCurrentTypeSelected = selectedMealTypes[mealTypeKey];
    if (isOnlyOneSelected && isCurrentTypeSelected) return;

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

      
      <MealTypeFilter
      selectedMealTypes={selectedMealTypes}
      toggleMealType={toggleMealType}
    />
    </View>
  );
}

const styles = StyleSheet.create({
  mealTypeFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // borderTopWidth: 1,
    // borderBottomWidth: 1,
    // borderColor: colors.primaryText,
  }, 
  mealTypeItem: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    backgroundColor: colors.pink, // Updated color
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
    backgroundColor: colors.pink, // Updated color
  },
  activeText: {
    fontWeight:'bold',
    // color: '#12486B',
    color: colors.darkestBlue,
  },
});

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}