// auth.js
import * as SecureStore from 'expo-secure-store';

export const storeInSecureStore = async (key, value) => {
  try {
    await SecureStore.setItemAsync(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error storing the ${key}`, error);
  }
};

export const getFromSecureStore = async (key) => {
  try {
    const value = await SecureStore.getItemAsync(key);
    // As we have stored the values after JSON.stringify, we need to parse it
    return JSON.parse(value);
  } catch (error) {
    console.error(`Error getting the ${key}`, error);
  }
};

export const deleteInSecureStore = async (key) => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.error(`Error deleting the ${key}`, error);
  }
};

export const updateInSecureStore = async (key, newValue) => {
  try {
    // The update process involves replacing the existing value
    // We can achieve this by calling setItemAsync with the new value
    await SecureStore.setItemAsync(key, JSON.stringify(newValue));
  } catch (error) {
    console.error(`Error updating the ${key}`, error);
  }
};
