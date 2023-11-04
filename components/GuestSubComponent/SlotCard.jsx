import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";

export default function SlotCard({ slots,duration,onSelectSlot,selectedSlot,setNoOfGuest,}) 
{
  const [selected, setSelected] = useState(false);
  const [noOfGuestLocal, setNoOfGuestLocal] = useState(0);

  const decrease = () => {
    if (noOfGuestLocal > 0) {
      const newGuestCount = noOfGuestLocal - 1;
      setNoOfGuestLocal(newGuestCount);
      setNoOfGuest(newGuestCount); // update the parent state
    }
  };
  
  const increase = () => {
    if (noOfGuestLocal < slots.currentCapacity) {
      const newGuestCount = noOfGuestLocal + 1;
      setNoOfGuestLocal(newGuestCount);
      setNoOfGuest(newGuestCount); // update the parent state
    }
  };
  

  const handleSlotSelection = () => {
    if (selectedSlot !== slots.startTime) {
      setSelected(true);
      setNoOfGuestLocal(0);
      onSelectSlot(slots.startTime, slots.capacity);
    }
  };

  useEffect(() => {
    if (selectedSlot !== slots.startTime) {
      setSelected(false);
      setNoOfGuestLocal(0);
      console.log(slots)
      console.log(duration)
    }
  }, [selectedSlot, slots.startTime]);

  return (
    <TouchableOpacity
      style={selected ? styles.selectedSlot : styles.slot}
      onPress={handleSlotSelection}
      disabled={selected}>

      <Text>{slots.startTime}-{parseInt(slots.startTime) + parseInt(duration)}</Text>
      <Text>{slots.capacity}</Text>

      {selected && (
        <View style={styles.quantityContainer}>
          <Text>Choose Number of guests:</Text>
          <Text style={styles.noOfGuest}>{noOfGuestLocal}</Text>
          <Button title="-" onPress={decrease}/>
          <Button title="+" onPress={increase}/>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  slot: {
    backgroundColor: "white",
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "gray",
  },
  selectedSlot: {
    backgroundColor: "lightgreen",
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "gray",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  noOfGuest: {
    marginHorizontal: 10,
  },
});
