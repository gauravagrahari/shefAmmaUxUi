import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import { getFromSecureStore } from "../Context/SensitiveDataStorage"; // Path might need to be adjusted
import { useNavigation } from '@react-navigation/native';
import config from '../Context/constants';
import Constants from 'expo-constants';
const URL = Constants.expoConfig.extra.apiUrl;
const AddTimeSlot = () => {
  const [capacity, setCapacity] = useState('');
  const [duration, setDuration] = useState('');
  const [slotStartTime, setSlotStartTime] = useState('');
  const [slots, setSlots] = useState([]);

  const navigation = useNavigation();

  const handleAddSlot = () => {
    const newSlot = {
      startTime: parseFloat(slotStartTime),
      currentCapacity: parseInt(capacity),
    };
    setSlots([...slots, newSlot]);
    setSlotStartTime('');
  };

  const handleDeleteSlot = (indexToDelete) => {
    setSlots(slots.filter((_, index) => index !== indexToDelete));
  };

  const handleSaveSubmit = async () => {
    const token = await getFromSecureStore('token');
    const uuidHost = await getFromSecureStore('uuidHost');      
    console.log("token: " + token);
    console.log("uuidHost: " + uuidHost);
    const data = {
      uuidTime: uuidHost,
      duration: duration,
      capacity: capacity,
      slots: slots,
    };

    try {
      const response = await axios.post(`${URL}/host/timeSlot`, data, {
        params: { uuidTime: uuidHost },
      });
      console.log(response.data);
      navigation.navigate('AddItemHost');

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Schedule Form</Text>

     <TextInput
        style={styles.input}
        placeholder="Capacity"
        value={capacity}
        onChangeText={setCapacity}
        keyboardType="numeric"
      />

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
              {/* <Icon style={styles.deleteText}>Delete</Icon> Replace this with your delete icon */}
              <MaterialIcons name="delete" size={24} color="#6b21cc" />
            </TouchableOpacity>
          </View>
        ))}

      <TouchableOpacity style={styles.button} onPress={handleSaveSubmit}>
        <Text style={styles.buttonText}>Save and Submit</Text>
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
    marginBottom: 16,
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
    backgroundColor: '#009688',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  deleteText: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default AddTimeSlot;
