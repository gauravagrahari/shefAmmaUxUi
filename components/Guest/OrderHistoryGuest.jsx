import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import axios from 'axios';
import OrderCard from '../commonMethods/OrderCard';
import config from '../Context/constants';
import NavBarGuest from '../GuestSubComponent/NavBarGuest';
import { getFromSecureStore } from '../Context/SensitiveDataStorage';
import { globalStyles, colors } from '../commonMethods/globalStyles';
import Loader from '../commonMethods/Loader';

const URL = config.URL;
const pageSize = 6; // Adjust as needed

export default function OrderHistoryGuest({ navigation }) {
  const [orderList, setOrderList] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true); // New state for initial loading
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(true);

  
  const fetchOrders = async () => {
    if (!hasNextPage || loading) return;

    if (initialLoading) {
      setLoading(true);
    }

    setError(null);

    try {
      const storedUuidGuest = await getFromSecureStore('uuidGuest');
      const token = await getFromSecureStore('token');


      let sk, pk,lastEvaluatedKeyObj,sks,sksval;
if (lastEvaluatedKey) {
     lastEvaluatedKeyObj = JSON.parse(lastEvaluatedKey);
    sk = lastEvaluatedKeyObj.sk?.s;
    pk = lastEvaluatedKeyObj.pk?.s;
    sks=lastEvaluatedKeyObj.sk;
console.log("sks----->"+ sks);
 sksval=lastEvaluatedKeyObj.sk.s;
console.log("sks----->"+ sksval);
      console.log("LastEvaluatedKey sk:", sk, "pk:", pk, "LastEvaluatedKey: ",lastEvaluatedKeyObj);
}
// sks=lastEvaluatedKeyObj.sk;
// console.log("sks----->"+ sks);
//  sksval=lastEvaluatedKeyObj.sk.s;
// console.log("sks----->"+ sksval);
//       console.log("LastEvaluatedKey sk:", sk, "pk:", pk, "LastEvaluatedKey: ",lastEvaluatedKeyObj);

      const responseConfig = {
        headers: {
          uuidOrder: storedUuidGuest,
          Authorization: `Bearer ${token}`,
        },
        params: {
          sk: sk,
          pk: pk,
          pageSize: pageSize,
        },
      };

      console.log(`Making request to: ${URL}/guest/orders with config:`, responseConfig);

      const response = await axios.get(`${URL}/guest/orders`, responseConfig);
      const newOrders = response.data.content || [];
      const newLastEvaluatedKey = response.data.lastEvaluatedKey || null;

      console.log("Received new LastEvaluatedKey:", newLastEvaluatedKey);

      setOrderList(prevOrders => [...prevOrders, ...newOrders]);
      setLastEvaluatedKey(newLastEvaluatedKey);
      setHasNextPage(response.data.hasNextPage);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(error);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);
  const handleScroll = ({ nativeEvent }) => {
    if (isCloseToBottom(nativeEvent) && hasNextPage && !loading) {
      fetchOrders();
    }
  };

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  };

  // if (error) {
  //   // Error handling
  //   return (
  //     <View style={styles.centered}>
  //       <Text>Error fetching orders. Please try again.</Text>
  //     </View>
  //   );
  // }

  if (initialLoading) {
    // Display loader during initial loading
    return <Loader />;
  }

  // Logic for displaying orders or the "No orders available" message
  if (orderList.length > 0) {
    return (
      <ScrollView
        style={globalStyles.containerPrimary}
        onScroll={handleScroll}
        scrollEventThrottle={400}
      >
        <NavBarGuest navigation={navigation} />
        {orderList.map((eachOrder) => (
          <OrderCard key={eachOrder.timeStamp} order={eachOrder} isHost={false} />
        ))}
        {loading && (
          <View style={styles.loader}>
            <Loader />
          </View>
        )}
      </ScrollView>
    );
  } else {
    // Display "No orders available" if the list is empty after initial loading
    return (
      <View style={styles.centered}>
        <Text style={styles.centered}>No orders available to display.</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  centered: {
    fontSize: 20,
    color: colors.darkestBlue,
    textAlign: 'center',
    paddingHorizontal: 20, 
    marginTop: 100,
  },
  loader: {
    marginVertical: 20,
  },
});
