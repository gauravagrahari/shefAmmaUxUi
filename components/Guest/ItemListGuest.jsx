// ItemListGuest.js
import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import HostContext from '../Context/HostContext';
import ItemCard from '../GuestSubComponent/ItemCard';
import ItemListCard from '../GuestSubComponent/ItemListCard';
import { ScrollView } from 'react-native';
import NavBarGuest from '../GuestSubComponent/NavBarGuest';
import { useNavigation } from '@react-navigation/native'; // If you're using React Navigation
import {globalStyles} from '../commonMethods/globalStyles';

export default function ItemListGuest() {
  const { hostList } = useContext(HostContext);
  const navigation = useNavigation();

  return (
    <ScrollView style={globalStyles.containerPrimary}>
       <NavBarGuest navigation={navigation} />
      {hostList.map((host, index) => (
        host.meals.map((meal, mealIndex) => (
          <ItemListCard 
            key={`${index}-${mealIndex}`} 
            item={meal} 
            host={host.hostEntity}
            handleHostCardClick={() => handleHostCardClick(meal, host.hostEntity)}
          />
        ))
      ))}
    </ScrollView>
  )}
