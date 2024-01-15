import React, { useContext, useState } from 'react';
import { View, ScrollView,Dimensions } from 'react-native';
import HostContext from '../Context/HostContext';
import ItemListCard from '../GuestSubComponent/ItemListCard';
import NavBarGuest from '../GuestSubComponent/NavBarGuest';
import { useNavigation } from '@react-navigation/native';
import { globalStyles, colors } from '../commonMethods/globalStyles';
import { StyleSheet } from 'react-native';
import MealTypeFilter from '../commonMethods/MealTypeFilter';
import { Text } from 'react-native';

export default function ItemListGuest() {
  const { hostList } = useContext(HostContext);
  const navigation = useNavigation();
  const [selectedMealTypes, setSelectedMealTypes] = useState({
    breakfast: true,
    lunch: true, 
    dinner: true,
  });

  const handleHostCardClick = (selectedMeal, hostEntity) => {
    const host = hostList.find(h => h.hostEntity.uuidHost === hostEntity.uuidHost);
    if (host) {
      navigation.navigate('HostProfileMealGuest', {
        host: hostEntity,
        itemList: host.meals,
        initialMealType: selectedMeal.mealType
      });
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

  const renderItem = ({ item, index }) => {
    return item.meals.filter(filterMealsByType).map((meal, mealIndex) => (
        <View key={`${index}-${mealIndex}`}>
            <ItemListCard 
                item={meal}
                host={item.hostEntity}
                handleHostCardClick={() => handleHostCardClick(meal, item.hostEntity)}
            />
        </View>
    ));
  };
  return (
    <View style={globalStyles.containerPrimary}>
      <NavBarGuest navigation={navigation} />

      {hostList && hostList.length > 0 ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          {hostList.map((item, index) => renderItem({ item, index }))}
        </ScrollView>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
           <View style={styles.emptyHostMessageContainer}>
        <Text style={styles.emptyHostMessage}>
          Currently, no items are available for your address. Please refresh the home page and enter your pincode to check service availability.
        </Text>  
        </View>
         </ScrollView>
      )}

      <MealTypeFilter
        selectedMealTypes={selectedMealTypes}
        toggleMealType={toggleMealType}
      />
    </View>
  );
}
const { width, height } = Dimensions.get('window');

function responsiveFontSize(fSize) {
  const tempHeight = (16 / 9) * width;
  return Math.sqrt(tempHeight ** 2 + width ** 2) * (fSize / 100);
}

const styles = StyleSheet.create({
  emptyHostMessageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: height * 0.4, // Adjusted to 40% of screen height
  },
  mealTypeFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // borderTopWidth: 1,
    // borderBottomWidth: 1,
    // borderColor: colors.primaryText,
  }, 
  emptyHostMessage: {
    fontSize: responsiveFontSize(2.25),
    color: colors.darkestBlue,
    textAlign: 'center',
    paddingHorizontal: width * 0.05,
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