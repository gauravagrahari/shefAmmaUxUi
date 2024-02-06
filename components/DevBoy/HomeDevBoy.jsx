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
import Dropdown from '../commonMethods/Dropdown';

const URL = Constants.expoConfig.extra.apiUrl || config.URL;

export default function HomeDevBoy({ navigation }) {
  const [orderList, setOrderList] = useState([]);
  const [filteredOrderList, setFilteredOrderList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedHost, setSelectedHost] = useState('');

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

  useEffect(() => {
    if (selectedHost === '' || selectedHost === 'All') {
      setFilteredOrderList(orderList);
    } else {
      const filteredOrders = orderList.filter(order => order.order.nameHost === selectedHost);
      setFilteredOrderList(filteredOrders);
    }
  }, [selectedHost, orderList]);

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
  const uniqueHosts = ['All', ...new Set(orderList.map(order => order.order.nameHost))];
  return (
    <ScrollView
      style={{ backgroundColor: colors.pink }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <NavBarDevBoy navigation={navigation} />
      {/* <View style={styles.detailConatiner}> */}
      <View style={styles.orderCountContainer}>
      <Text style={styles.orderCountText}>Total Orders: {orderList.length}</Text>
    {/* </View> */}
      <Dropdown
  items={uniqueHosts}
  selectedValue={selectedHost}
  onValueChange={(value) => setSelectedHost(value)}
  placeholder="Select a Cook"
  buttonStyle={dropdownStyle}
/></View>
      {filteredOrderList.length > 0 ? (
        filteredOrderList.map((eachOrderWithAddress) => (
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
const dropdownStyle = {
  // Define your custom style for the Dropdown button here
  backgroundColor: colors.darkBlue,
  marginHorizontal:5,
  borderRadius: 10,
  padding: 10,
  color: 'white',
  marginTop: 5
};
const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderCountContainer: {
    flexDirection: 'row',
    flexWrap:'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
    // Adjust these styles as needed
  },
  orderCountText: {
    fontSize: 16,
    color: 'white', // Or any color that contrasts well with pink
    fontWeight: 'bold',
    marginRight: 10, // Spacing between text and dropdown
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
