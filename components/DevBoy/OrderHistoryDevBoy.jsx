import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';
import config from '../Context/constants';
import { getFromSecureStore } from '../Context/SensitiveDataStorage';
import NavBarDevBoy from '../DevBoySubComponent/NavBarDevBoy';
import OrderCardHistoryDevBoy from '../DevBoySubComponent/OrderCardHistoryDevBoy';
import {globalStyles,colors} from '../commonMethods/globalStyles';

const URL = config.URL;

export default function OrderHistoryDevBoy({ navigation }) {
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

        const response = await axios.get(`${URL}/devBoy/devBoyOrders`, responseConfig); 
        setOrderList(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
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
    <ScrollView style={globalStyles.containerPrimary}>
      <NavBarDevBoy navigation={navigation} />
      {orderList.sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp)).map((eachOrderWithAddress) => (
        <OrderCardHistoryDevBoy 
          key={eachOrderWithAddress.timeStamp} 
          orderData={eachOrderWithAddress}
          isHost={false} 
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
