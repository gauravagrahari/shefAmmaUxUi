import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';
import { getFromSecureStore } from "../Context/SensitiveDataStorage";
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
const URL = Constants.expoConfig.extra.apiUrl;

const EditTimeSlot = () => {
  const [capacity, setCapacity] = useState('');
  const [duration, setDuration] = useState('');
  const [slotStartTime, setSlotStartTime] = useState('');
  const [slots, setSlots] = useState([]);
  const [oldCapacity, setOldCapacity] = useState(capacity);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchSlots = async () => {
      const token = await getFromSecureStore('token');
      const uuidHost = await getFromSecureStore('uuidHost'); 
      try {
        const response = await axios.get(`${URL}/guest/host/timeSlot`, {
          headers: { id: 'time#105' },
        });
        setSlots(response.data.slots);
        setCapacity(String(response.data.capacity));
        setOldCapacity(String(response.data.capacity)); // Initialize oldCapacity here
        setDuration(response.data.duration);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSlots();
  }, []);


  const handleAddSlot = () => {
    const newSlot = {
      startTime: parseFloat(slotStartTime),
      currentCapacity: parseInt(capacity), // New slot currentCapacity equals capacity
    };
    setSlots([...slots, newSlot]);
    setSlotStartTime('');
  };

  useEffect(() => {
    if (capacity === '') {
      // Handle the case where capacity is an empty string
      setOldCapacity(capacity);
    } else {
      setSlots((currentSlots) =>
        currentSlots.map((slot) => {
          // If slot's currentCapacity is equal to the old capacity or greater than the new capacity
          if (slot.currentCapacity === parseInt(oldCapacity) || slot.currentCapacity > parseInt(capacity)) {
            // Then update slot's currentCapacity to the new capacity
            return { ...slot, currentCapacity: parseInt(capacity) };
          }
          // Otherwise, leave slot's currentCapacity unchanged
          return slot;
        })
      );
      // Save the new capacity as the old capacity for the next time capacity changes
      setOldCapacity(capacity);
    }
}, [capacity]);



  const handleDeleteSlot = (indexToDelete) => {
    setSlots(slots.filter((_, index) => index !== indexToDelete));
  };

  const handleUpdateSubmit = async () => {
    const token = await getFromSecureStore('token');
    const uuidHost = await getFromSecureStore('uuidHost');      
    console.log("token: " + token);
    console.log("uuidHost: " + uuidHost);
    const data = {
      uuidTime: 'time#105',
      duration: duration,
      capacity: capacity,
      slots: slots,
    };
    try {
      const response = await axios.put(`${URL}/host/timeSlot`, data
    //   , {
    //     params: { uuidTime: uuidHost },}
      );
      console.log(response.data);
    //   navigation.navigate('AddItemHost');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Schedule Form</Text>
      <Text style={styles.textField}>Capacity of each Slot</Text>
      <TextInput
        style={styles.input}
        placeholder="Capacity"
        value={capacity}
        onChangeText={setCapacity}
        keyboardType="numeric"
      />
      <Text style={styles.textField}>Duration of each Slot</Text>
      <TextInput
        style={styles.input}
        placeholder="Duration"
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Slot Start Time"
        value={slotStartTime}
        onChangeText={setSlotStartTime}
      />
      <TouchableOpacity style={styles.button} onPress={handleAddSlot}>
        <Text style={styles.buttonText}>Add Slot</Text>
      </TouchableOpacity>
      <Text style={styles.slotListTitle}>Slots:</Text>

      {slots
        .sort((a, b) => a.startTime - b.startTime)
        .map((slot, index) => (
          <View style={styles.slotItem} key={index}>
            <Text>Start Time: {slot.startTime}</Text>
            <TouchableOpacity onPress={() => handleDeleteSlot(index)}>
              <MaterialIcons name="delete" size={24} color="#6b21cc" />
            </TouchableOpacity>
          </View>
        ))}

      <TouchableOpacity style={styles.button} onPress={handleUpdateSubmit}>
        <Text style={styles.buttonText}>Update and Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles =StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 18,
    color: '#5a838c',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
 button: {
    width: '100%',
    height: 50,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#2ab2d1',
    // backgroundColor: '#009688',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textField: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#85a4ab',
    marginBottom: 5,
  },
  slotListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  slotItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    padding: 10,
    backgroundColor: '#ccc',
    borderRadius: 4,
  },
});

export default EditTimeSlot;
