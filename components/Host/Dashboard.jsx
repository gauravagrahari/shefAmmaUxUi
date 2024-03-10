import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, RefreshControl,Alert, } from 'react-native';
import axios from 'axios';
import OrderCard from '../commonMethods/OrderCard';
import { useNavigation } from '@react-navigation/native';
import { getFromSecureStore, storeInSecureStore } from "../Context/SensitiveDataStorage";
import NavBarHost from '../HostSubComponent/NavBarHost';
import Constants from 'expo-constants';
import OrderCardHost from '../HostSubComponent/OrderCardHost';
import { colors } from '../commonMethods/globalStyles';
import Dropdown from '../commonMethods/Dropdown';

const URL = Constants.expoConfig.extra.apiUrl || config.URL;

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [cancelCutOffTime, setCancelCutOffTime] = useState(); // Defaulting to 180 minutes
  const [mealTypeFilter, setMealTypeFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchCharges();
    fetchOrders();
  }, []);

  const mapMealTypeToReadable = (type) => {
    switch (type) {
      case 'b': return 'Breakfast';
      case 'l': return 'Lunch';
      case 'd': return 'Dinner';
      default: return type;
    }
  };

  useEffect(() => {
    let filtered = orders.filter(order => {
      console.log("Filtering order:", order);
      const mealTypeReadable = mapMealTypeToReadable(order.mealType);
      const mealTypeMatch = mealTypeFilter === 'All' || mealTypeReadable === mealTypeFilter;
      let dateMatch = dateFilter === 'All';
      if (dateFilter !== 'All' && order.delTimeAndDay) {
        const orderDate = order.delTimeAndDay.split(', ')[1];
        dateMatch = orderDate === dateFilter;
      }
      return dateMatch && mealTypeMatch;
    });
    console.log("Filtered orders:", filtered);
    setFilteredOrders(filtered);
}, [orders, mealTypeFilter, dateFilter]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchOrders().then(() => setRefreshing(false));
  }, []);

  const fetchCharges = async () => {
    try {
      const token = await getFromSecureStore('token');
      if (!token) {
        console.log('Token not found, redirecting to login');
        // Redirect to login screen
        return;
      }
      const chargesResponse = await axios.get(`${URL}/host/getCharges`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await storeInSecureStore('charges', chargesResponse.data);
      setCancelCutOffTime(chargesResponse.data.cancelCutOffTime);
    } catch (error) {
      console.error("Error fetching charges:", error);
      Alert.alert("Error", "Failed to fetch charges");
    }
  };

  const fetchOrders = async () => {
    try {
      const token = await getFromSecureStore('token');
      const uuidHost = await getFromSecureStore('uuidHost');      

      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // Fetch new orders
      const newOrdersResponse = await axios.get(`${URL}/host/getOrdersByStatus`, {
        headers: { ...headers, id: uuidHost },
        params: { status: 'new' }
      });

      // Fetch ip orders
      const ipOrdersResponse = await axios.get(`${URL}/host/getOrdersByStatus`, {
        headers: { ...headers, id: uuidHost },
        params: { status: 'ip' }
      });

      // Combine new and ip orders
      const combinedOrders = [...newOrdersResponse.data, ...ipOrdersResponse.data];
      setOrders(combinedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const mealTypesDropdownItems = ['All', 'Breakfast', 'Lunch', 'Dinner'];
  console.log("Orders before processing for datesDropdownItems:", orders);

  const datesDropdownItems = ['All', ...new Set(orders.map(order => {
      console.log("Processing order for datesDropdownItems:", order);
      return order.delTimeAndDay ? order.delTimeAndDay.split(', ')[1] : 'N/A';
  }))];
  

  return (
    <View style={styles.container}>
        <NavBarHost />
        <View style={styles.filterSection}>
            <View style={styles.dropdownSection}>
                <Dropdown
                    items={mealTypesDropdownItems}
                    selectedValue={mealTypeFilter}
                    onValueChange={setMealTypeFilter}
                    placeholder="Select Meal Type"
                    buttonStyle={styles.dropdown}
                />
                <Dropdown
                    items={datesDropdownItems}
                    selectedValue={dateFilter}
                    onValueChange={setDateFilter}
                    placeholder="Select Date"
                    buttonStyle={styles.dropdown}
                />
            </View>
            <View style={styles.orderCountSection}>
            <Text style={styles.orderCountText}>Filtered Orders: <Text style={styles.orderCountNumber}>{filteredOrders.length}</Text></Text>
                <Text style={styles.orderCountText}>Total Orders: <Text style={styles.orderCountNumber}>{orders.length}</Text></Text>
            </View>
        </View>
        <ScrollView
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            {filteredOrders.map((order, index) => (
                <OrderCardHost key={index} order={order} cancelCutOffTime={cancelCutOffTime} />
            ))}
        </ScrollView>
    </View>
);}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.seaBlue,
  },
  filterSection: {
    padding: 5,
    paddingHorizontal:12,
    backgroundColor: colors.darkSeaBlue,
    borderRadius: 5,
    margin: 5,
  },
  orderCountSection: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Space out the total and filtered order count
    marginBottom: 5, // Separate the counts from the dropdowns
  },
  dropdownSection: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Space out the dropdowns
  },
  dropdown: {
    width: 150, // Set a fixed width for consistency
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: colors.darkBlue,
    borderRadius: 10,
    borderColor: 'white',
    borderWidth: 1,
    color: 'white',
    fontSize: 14,
  },
  orderCountText: {
    color: colors.white,
    fontSize: 16,
  },
  orderCountNumber: {
    fontWeight: 'normal', // Differentiate numbers from the label text
      color:'whitesmoke',
      fontSize: 18,
      fontWeight: 'bold',

  },
});

