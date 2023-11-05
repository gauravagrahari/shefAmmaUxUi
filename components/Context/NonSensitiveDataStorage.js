import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeInAsync = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (error) {
    console.error(`Error storing the value for key: ${key}`, error);
    return false;
  }
};

export const getFromAsync = async (key) => {
  try {
    const rawValue = await AsyncStorage.getItem(key);
    console.log(`Raw value retrieved for key ${key}:`, rawValue);
    return rawValue != null ? JSON.parse(rawValue) : null;
  } catch (error) {
    console.error(`Error getting the value for key: ${key}`, error);
  }
};

export const updateInAsync = async (key, newValue) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
    } catch (error) {
    console.error(`Error updating the value for key: ${key}`, error);
    return false;
  }
};
export const deleteInAsync = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error deleting the value for key: ${key}`, error);
    return false;
  }
};