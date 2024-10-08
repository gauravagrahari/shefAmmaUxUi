import React, { useContext, useState } from 'react';
import { View, ScrollView,Dimensions,Animated  } from 'react-native';
import HostContext from '../Context/HostContext';
import ItemListCard from '../GuestSubComponent/ItemListCard';
import NavBarGuest from '../GuestSubComponent/NavBarGuest';
import { useNavigation } from '@react-navigation/native';
import { globalStyles, colors } from '../commonMethods/globalStyles';
import { StyleSheet } from 'react-native';
import MealTypeFilter from '../commonMethods/MealTypeFilter';
import { Text } from 'react-native';
import useHideOnScroll from '../commonMethods/useHideOnScroll';
import TiffinServiceCard from '../GuestSubComponent/TiffinServiceCard';

export default function ItemListGuest() {
  const { hostList } = useContext(HostContext);
  const navigation = useNavigation();
  const { animatedStyle, handleScroll } = useHideOnScroll(54);
  const [selectedMealTypes, setSelectedMealTypes] = useState({
    breakfast: true,
    lunch: true, 
    dinner: true,
  });

  const handleHostCardClick = (selectedMeal, hostEntity) => {
    navigation.navigate('HostProfileMealGuest', {
      host: hostEntity,
      itemList: [selectedMeal], // Navigate with just the selected meal
      initialMealType: selectedMeal.mealType
    });
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

  const renderItem = () => {
    let components = [];
    let globalMealIndex = 0; // Keep track of the meal index across all hosts
  
    hostList.forEach((item, index) => {
      item.meals.filter(filterMealsByType).forEach((meal, mealIndex) => {
        components.push(
          <View key={`meal-${index}-${mealIndex}`}>
            <ItemListCard
              item={meal}
              host={item.hostEntity}
              handleHostCardClick={() => handleHostCardClick(meal, item.hostEntity)}
            />
          </View>
        );
  
        globalMealIndex++;
        // Insert the TiffinServiceCard after the first 5 ItemListCard components
        if (globalMealIndex === 3) {
          components.push(
            <View key={`tiffin-single`}>
              <TiffinServiceCard />
            </View>
          );
        }
      });
    });
  
    return components;
  };
  
  
  return (
    <View style={globalStyles.containerPrimary}>
      <Animated.View style={[{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }, animatedStyle]}>
        <NavBarGuest navigation={navigation} />
      </Animated.View>
  
      <ScrollView
        style={{ paddingTop: 54, paddingBottom: 58 }}
        contentContainerStyle={{ paddingBottom: 58 }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {renderItem()}
      </ScrollView>
  
      <MealTypeFilter
        selectedMealTypes={selectedMealTypes}
        toggleMealType={toggleMealType}
      />
    </View>
  );
  
  
  return (
    <View style={globalStyles.containerPrimary}>
 <Animated.View style={[{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }, animatedStyle]}>
  <NavBarGuest navigation={navigation} />
</Animated.View>

      {hostList && hostList.length > 0 ? (
          <ScrollView
          style={{ paddingTop: 54 , paddingBottom:58}}
          contentContainerStyle={{ paddingBottom: 58 }}
            showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
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
    color: colors.lightishPink,
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