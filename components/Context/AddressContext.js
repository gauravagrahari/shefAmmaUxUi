// AddressContext.js
import React, { createContext, useState } from 'react';

export const AddressContext = createContext();

export const AddressProvider = ({ children }) => {
  const [addresses, setAddresses] = useState({ primary: null, secondary: null, default: 'primary' });

  const updateAddressInContext = (type, newAddress) => {
    console.log(`Updating address in context for ${type}:`, newAddress);
    setAddresses(prev => {
      const updatedAddresses = { ...prev, [type]: newAddress };
      console.log('New addresses state:', updatedAddresses);
      return updatedAddresses;
    });
  };
  
  const setDefaultAddressInContext = (type) => {
    console.log(`Setting default address in context to ${type}`);
    setAddresses(prev => {
      const updatedAddresses = { ...prev, default: type };
      console.log('New default address set:', updatedAddresses);
      return updatedAddresses;
    });
  };
  

  return (
    <AddressContext.Provider value={{ addresses, updateAddressInContext, setDefaultAddressInContext }}>
      {children}
    </AddressContext.Provider>
  );
};
