import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import axios from 'axios';
import OrderCard from '../commonMethods/OrderCard';
import { useNavigation } from '@react-navigation/native';
import { getFromSecureStore } from "../Context/SensitiveDataStorage";
import NavHost from '../HostSubComponent/NavHost';

export default function Dashboard() {
  const [orders, setOrders] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = await getFromSecureStore('token');
      const uuidHost = await getFromSecureStore('uuidHost');      

      const headers = {
        // Authorization: `Bearer ${token}`,
        hostID: "host#105",
      };

      const response = await axios.get('http://192.168.86.93:9090/host/ipOrders', {
        headers,
      });
  
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };  

  return (
    <ScrollView>
      <NavHost/>
      {orders.map((order, index) => (
        <OrderCard key={index} order={order} />
        ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // Your custom styles here
});
