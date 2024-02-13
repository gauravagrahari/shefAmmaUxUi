import React, { createContext, useState, useContext } from 'react';

const OrdersContext = createContext();

export const useOrders = () => useContext(OrdersContext);

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [charges, setCharges] = useState();
  const [refreshing, setRefreshing] = useState(false); // Add this line

  const resetOrdersContext = () => {
    setOrders([]);
    setLoading(true);
    setError(null);
    setCharges(undefined);
    setRefreshing(false);
  };

  return (
    <OrdersContext.Provider value={{ orders, setOrders, loading, setLoading, error, setError, charges, setCharges, refreshing, setRefreshing, resetOrdersContext }}>
      {children}
    </OrdersContext.Provider>
  );
};