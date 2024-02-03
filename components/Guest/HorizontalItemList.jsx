import React, { useContext, useMemo } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import HostContext from '../Context/HostContext';
import ItemListFlatListCard from '../GuestSubComponent/ItemListFlatListCard';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../commonMethods/globalStyles';

const HorizontalItemList = () => {
  const { hostList } = useContext(HostContext);
  const navigation = useNavigation();

  // Function to shuffle array
  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  // Combine all meals, sort by rating, shuffle, and take the top 7
  const sortedAndLimitedMeals = useMemo(() => {
    const allMeals = hostList.reduce((acc, host) => [...acc, ...host.meals.map(meal => ({ ...meal, host: host.hostEntity }))], []);
    const sortedByRating = allMeals.sort((a, b) => b.rating - a.rating); // Assuming higher rating is better
    const shuffledAndLimited = shuffleArray(sortedByRating).slice(0, 7); // Shuffle and take top 7
    return shuffledAndLimited;
  }, [hostList]);

  const renderItem = ({ item }) => (
    <ItemListFlatListCard
      key={`${item.host.uuidHost}-${item.id}`} // Assuming each meal has a unique ID
      item={item}
      host={item.host}
      handleHostCardClick={() => handleHostCardClick(item, item.host)}
    />
  );

  const handleHostCardClick = (selectedMeal, hostEntity) => {
    navigation.navigate('HostProfileMealGuest', {
      host: hostEntity,
      itemList: [selectedMeal], // Navigate with just the selected meal
      initialMealType: selectedMeal.mealType
    });
  };

  return (
    <View style={{ alignItems: 'center' }}>
      <FlatList
        data={sortedAndLimitedMeals}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.host.uuidHost + item.id + index.toString()}
        contentContainerStyle={{ alignItems: 'center' }}
        ListFooterComponent={() => (
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => navigation.navigate('ItemListGuest')}>
            <MaterialIcons name="arrow-forward" size={28} color="#ffffff" />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  viewAllButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 10,
    backgroundColor: colors.deepBlue, // Example color
    borderRadius: 5,
  },
  viewAllButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  // Add other styles as needed
});

export default HorizontalItemList;
