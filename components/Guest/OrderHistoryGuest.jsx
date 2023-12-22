import { StyleSheet, Text, View, ActivityIndicator, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import OrderCard from '../commonMethods/OrderCard';
import axios from 'axios';
import config from '../Context/constants';
import NavBarGuest from '../GuestSubComponent/NavBarGuest';
import { getFromSecureStore } from '../Context/SensitiveDataStorage';
import {globalStyles,colors} from '../commonMethods/globalStyles';
import Loader from '../commonMethods/Loader';

const URL = config.URL;

export default function OrderHistoryGuest() {
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [charges, setCharges] = useState();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        const storedUuidGuest = await getFromSecureStore('uuidGuest');
        const token = await getFromSecureStore('token');
        const charges = await getFromSecureStore('charges');
        setCharges(charges);
        const responseConfig = {
          headers: {
            uuidOrder: storedUuidGuest,
            // Uncomment the following line if you have a JWT token for authentication
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(`${URL}/guest/orders`, responseConfig);
        setOrderList(response.data);
        console.log(response.data);
        console.log('orderlis is :'+orderList);
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
    return <Loader />;
}
  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Error fetching orders. Please try again.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <NavBarGuest style={styles.navbar} />
      <ScrollView style={globalStyles.containerPrimary}>
        {orderList.length === 0 ? (
          <View style={styles.centered}>
            <Text style={styles.text}>You have not ordered anything yet.</Text>
          </View>
        ) : (
          orderList
            .sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp))
            .map((eachOrder) => (
              <OrderCard key={eachOrder.timeStamp} order={eachOrder} cutOffTime={charges.cancelCutOffTime} isHost={false} />
            ))
        )}
      </ScrollView> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:180,
   
  },
  text:{
    color:colors.darkBlue,
    // color:colors.secondaryText,
    fontSize: 18,
    fontWeight: 'bold',
  }
});