import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated,ActivityIndicator, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import OrderCardDevBoy from '../DevBoySubComponent/OrderCardDevBoy';
import axios from 'axios';
import config from '../Context/constants';
import { getFromSecureStore } from '../Context/SensitiveDataStorage';
import NavBarDevBoy from '../DevBoySubComponent/NavBarDevBoy';
import {colors, globalStyles} from '../commonMethods/globalStyles';
import { BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Constants from 'expo-constants';
import Dropdown from '../commonMethods/Dropdown';
import useHideOnScroll from '../commonMethods/useHideOnScroll';

const URL = Constants.expoConfig.extra.apiUrl || config.URL;

export default function HomeDevBoy({ navigation }) {
  const [orderList, setOrderList] = useState([]);
  const [filteredOrderList, setFilteredOrderList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedHost, setSelectedHost] = useState('');
  const [statusCounts, setStatusCounts] = useState({
    toPickUp: 0,
    toDeliver: 0,
    delivered: 0,
  });
  const { animatedStyle, handleScroll } = useHideOnScroll(54);
  const [selectedFilter, setSelectedFilter] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // Exit the app
        BackHandler.exitApp();
        return true; // Prevent default behavior
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );
  
  const handleOrderListUpdate = (orderId, newStatus) => {
    setOrderList((prevOrderList) => {
      return prevOrderList.map((order) => {
        if (order.order.uuidOrder === orderId) {
          return { ...order, order: { ...order.order, status: newStatus } };
        }
        return order;
      });
    });
    handleStatusChange(null, newStatus); // Call status count update without needing oldStatus
  };
  
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
    let filtered = orderList;
    if (selectedHost !== '' && selectedHost !== 'All') {
      filtered = filtered.filter(order => order.order.nameHost === selectedHost);
    }
    if (selectedFilter) {
      filtered = filtered.filter(order => order.order.status === selectedFilter);
    }
    setFilteredOrderList(filtered);
  }, [selectedHost, orderList, selectedFilter]); // Add selectedFilter as a dependency

  const handleFilterTap = (status) => {
    setSelectedFilter(prevFilter => prevFilter === status ? '' : status); // Toggle filter on/off
  };

  useEffect(() => {
    console.log('Calculating status counts with current order list:', orderList);
    const counts = {
      toPickUp: orderList.filter(order => order.order.status === 'ip').length,
      toDeliver: orderList.filter(order => order.order.status === 'pkd').length,
      delivered: orderList.filter(order => order.order.status === 'com').length,
    };
    console.log('Updated counts:', counts);
    setStatusCounts(counts);
  }, [orderList]);

  const handleStatusChange = (oldStatus, newStatus) => {
    // Update the counts based on the status change
    setStatusCounts((currentCounts) => {
      const updatedCounts = { ...currentCounts };
  
      // Decrease count of the old status
      if (oldStatus) {
        if (oldStatus === 'ip') updatedCounts.toPickUp--;
        else if (oldStatus === 'pkd') updatedCounts.toDeliver--;
        else if (oldStatus === 'com') updatedCounts.delivered--;
      }
  
      // Increase count of the new status
      if (newStatus === 'ip') updatedCounts.toPickUp++;
      else if (newStatus === 'pkd') updatedCounts.toDeliver++;
      else if (newStatus === 'com') updatedCounts.delivered++;
  
      return updatedCounts;
    });
  };
  

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
    <View style={globalStyles.containerPrimary}>
     <Animated.View style={[{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }, animatedStyle]}>
      <NavBarDevBoy navigation={navigation} />
        <View style={styles.orderCountContainer}>
  {/* <Text style={styles.orderCountText}>Total Orders: {orderList.length}</Text> */}
  <View style={styles.statusCountsContainer}>
    <View style={styles.statusCountItem}>
      <Text style={styles.orderCountText}>Total</Text>
      <Text style={styles.statusValue}>{orderList.length}</Text>
    </View>
    <TouchableOpacity style={[styles.statusCountItem, selectedFilter === 'ip' ? activeFilterStyle : {}]} onPress={() => handleFilterTap('ip')}>
          <Text style={styles.orderCountText}>To Pick Up</Text>
          <Text style={styles.statusValue}>{statusCounts.toPickUp}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.statusCountItem, selectedFilter === 'pkd' ? activeFilterStyle : {}]} onPress={() => handleFilterTap('pkd')}>
          <Text style={styles.orderCountText}>To Deliver</Text>
          <Text style={styles.statusValue}>{statusCounts.toDeliver}</Text>
        </TouchableOpacity>
    <View style={styles.statusCountItem}>
      <Text style={styles.orderCountText}>Delivered</Text>
      <Text style={styles.statusValue}>{statusCounts.delivered}</Text>
    </View>
  
  </View>
  <Dropdown
    items={uniqueHosts}
    selectedValue={selectedHost}
    onValueChange={(value) => setSelectedHost(value)}
    placeholder="Select a Cook"
    buttonStyle={dropdownStyle}
  />
</View>
</Animated.View>
<ScrollView
      style={{ paddingTop: 170,backgroundColor: colors.seaBlue }}
      contentContainerStyle={{ paddingBottom: 185}}
      showsVerticalScrollIndicator={false}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {filteredOrderList.length > 0 ? (
        filteredOrderList.map((eachOrderWithAddress) => (
          <OrderCardDevBoy 
          key={eachOrderWithAddress.order.timeStamp}
          orderData={eachOrderWithAddress.order}
          hostAddress={eachOrderWithAddress.hostAddress}
          guestAddress={eachOrderWithAddress.guestAddress}
          isHost={false}
          onUpdateStatus={handleStatusChange} // Pass the callback function here
        />
        
        ))
      ) : (
        <View style={styles.noOrdersView}>
          <Text style={styles.noOrdersText}>No orders to deliver</Text>
        </View>
      )}
    </ScrollView>
    </View>
  );
}
const dropdownStyle = {
  // Define your custom style for the Dropdown button here
  backgroundColor: colors.darkBlue,
  marginHorizontal:10,
  borderRadius: 10,
  padding: 8,
  color: 'white',
  marginTop: 3,
  borderColor: 'white',
  borderWidth:1,
  fontSize: 10,
  // numberOfRows:2,
};
const activeFilterStyle = {
  backgroundColor: colors.labelBlack, // Example active color, adjust as needed
  color: 'white',
  paddingHorizontal:8,
  borderRadius: 5,
};
const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderCountContainer: {
    padding: 2,
    backgroundColor: '#009292',
    borderRadius:10,
    margin: 5,
  },
  orderCountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.darkBlue,
    marginBottom: 4,
  },
  statusCountText: {
    fontSize: 14,
    color: '#555555',
  },
  statusCountsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 5,
  },
  statusCountItem: {
    alignItems: 'center',
    // marginLeft:3,
    // borderRightWidth: 1,
    // borderRightColor: 'white',
  },
  statusValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fafafa',
  },
});
