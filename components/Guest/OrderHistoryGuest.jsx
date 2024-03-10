import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
  TouchableOpacity,Animated
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import OrderCard from "../commonMethods/OrderCard";
import axios from "axios";
import Constants from "expo-constants";
import NavBarGuest from "../GuestSubComponent/NavBarGuest";
import { getFromSecureStore } from "../Context/SensitiveDataStorage";
import { globalStyles, colors } from "../commonMethods/globalStyles";
import Loader from "../commonMethods/Loader";
import { useOrders } from "../Context/OrdersContext";
import useHideOnScroll from '../commonMethods/useHideOnScroll';
import config from "../Context/constants";

const URL = Constants.expoConfig.extra.apiUrl || config.URL;

export default function OrderHistoryGuest() {
  const {
    orders,
    setOrders,
    loading = true,
    setLoading,
    error,
    setError,
    charges,
    setCharges,
    refreshing,
    setRefreshing,
  } = useOrders();
  const [showMessage, setShowMessage] = useState(true);
  const { animatedStyle, handleScroll } = useHideOnScroll(54);

  const fetchOrders = useCallback(
    async (forceRefresh = false) => {
      if (!forceRefresh && orders.length > 0) {
        console.log("Skipping fetch, orders already loaded.");
        return;
      }

      // Only proceed if forceRefresh is true or no orders are loaded yet
      if (forceRefresh || orders.length === 0) {
        setLoading(true);
        setError(null);
        try {
          const storedUuidGuest = await getFromSecureStore("uuidGuest");
          const token = await getFromSecureStore("token");
          if (!token) {
            console.log("No token found, navigating to login.");
            setLoading(false); // Ensure loading is set to false if exiting early
            return;
          }

          const storedCharges = await getFromSecureStore("charges");
          setCharges(storedCharges);

          const responseConfig = {
            headers: {
              uuidOrder: storedUuidGuest,
              Authorization: `Bearer ${token}`,
            },
          };

          const response = await axios.get(
            `${URL}/guest/orders`,
            responseConfig
          );
          setOrders(response.data);
          setShowMessage(false);
          console.log("Orders fetched successfully.");
        } catch (error) {
          console.error("Error fetching orders:", error);
          setError(error);
        } finally {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [setLoading, setError, setCharges, setRefreshing, showMessage]
  );

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = useCallback(() => {
    console.log("Pull to refresh initiated.");
    setRefreshing(true);
    fetchOrders(true);
  }, [fetchOrders, setRefreshing]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Error fetching orders. Please try again later.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
     
    <Animated.View style={[{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }, animatedStyle]}>
    <NavBarGuest style={styles.navbar} />
      </Animated.View>
      <ScrollView
        style={[globalStyles.containerPrimary,{ paddingTop: 54 }]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {showMessage && (
          <View style={styles.messageContainer}>
            <TouchableOpacity
              style={styles.dismissButton}
              onPress={() => setShowMessage(false)}
            >
              <Text style={styles.dismissButtonText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.messageText}>
            Is your latest order Missing? Pull down to refresh.
            </Text>
          </View>
        )}
        {orders.length === 0 ? (
          <View style={styles.centered}>
            <Text style={styles.text}>You have not ordered anything yet.</Text>
          </View>
        ) : (
          orders
            .sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp))
            .map((eachOrder) => (
              <OrderCard
                key={eachOrder.timeStamp}
                order={eachOrder}
                cancelCutOffTime={charges.cancelCutOffTime}
                isHost={false}
              />
            ))
        )}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightishPink,
    // alignContent: 'center',
  },
  navbar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 180,
  },
  text: {
    color: colors.pink,
    // color:colors.secondaryText,
    fontSize: 18,
    fontWeight: "bold",
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "lightgreen", // Light grey background
    padding: 10,
    // borderTopWidth: 1,
    // borderBottomWidth: 1,
    // borderColor: '#ccc', // Light grey border
    marginVertical: 4,
    // width:'95%',
  },
  dismissButton: {
    marginRight: 10,
    padding: 5,
  },
  dismissButtonText: {
    color: colors.labelBlack, // Dark grey for the cross icon
    fontSize: 18,
    fontWeight: "800",
  },
  messageText: {
    flex: 1, // Take up remaining space
    fontSize: 13,
    color: colors.lightishPink, // Dark grey text
  },
});
