import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import OrderCardDevBoy from '../DevBoySubComponent/OrderCardDevBoy';
import axios from 'axios';
import config from '../Context/constants';
import { getFromSecureStore } from '../Context/SensitiveDataStorage';
import NavBarDevBoy from '../DevBoySubComponent/NavBarDevBoy';
import {colors} from '../commonMethods/globalStyles';
import { BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Constants from 'expo-constants';

const URL = Constants.expoConfig.extra.apiUrl;

export default function HomeDevBoy({ navigation }) {
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        console.log('Back button pressed in HomeGuest');
        // Handle back action here, return true to override
        return true;
      };
  
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
  
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );
  
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);

    try {
      const storedUuidDevBoy = await getFromSecureStore('uuidDevBoy');
      const token = await getFromSecureStore('token');

      const responseConfig = {
        headers: {
          uuidDevBoy: storedUuidDevBoy, 
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(`${URL}/devBoy/ipDevBoyOrders`, responseConfig); 
      setOrderList(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);
  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders(); // Re-fetch the orders
  };
  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Error fetching orders. Please try again.</Text>
      </View>
    );
  }

  return (
    <ScrollView
    style={{ backgroundColor: colors.pink }} // Set the background color
    refreshControl={
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    }
  >
      <NavBarDevBoy navigation={navigation} />
    {orderList.length > 0 ? (
      orderList.sort((a, b) => new Date(b.order.timeStamp) - new Date(a.order.timeStamp)).map((eachOrderWithAddress) => (
        <OrderCardDevBoy 
          key={eachOrderWithAddress.order.timeStamp} 
          orderData={eachOrderWithAddress.order}
          hostAddress={eachOrderWithAddress.hostAddress}
          guestAddress={eachOrderWithAddress.guestAddress}
          isHost={false} 
        />
      ))
    ) : (
      <View style={styles.noOrdersView}>
        <Text style={styles.noOrdersText}>No orders to deliver</Text>
      </View>
    )}
  </ScrollView>
);
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noOrdersView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20, // Adjust as needed
  },
  noOrdersText: {
    fontSize: 18,
    color: 'white', // Or any color that contrasts well with pink
    fontWeight: 'bold',
  },
});
