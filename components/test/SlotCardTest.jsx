import React, { useState } from "react";
import { View, Button, Text } from "react-native";
import SlotCard from "../GuestSubComponent/SlotCard";

export default function SlotCardTest({ timeSlotList, onSlotDataSubmit }) {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [noOfGuest, setNoOfGuest] = useState(1);
  const [submittedData, setSubmittedData] = useState(null);

  // hey, chat gpt timeSlotList will not be hardcoded value instead it will take data from the parent HostProfileGuest


  const handleSlotSelection = (startTime, capacity) => {
    setSelectedSlot(startTime);
    setNoOfGuest(Math.min(noOfGuest, capacity));
  };

  const handleSubmit = () => {
    const selectedData = {
      selectedSlot: selectedSlot,
      noOfGuest: noOfGuest,
    };
    console.log("Submitted Data:", selectedData);
    setSubmittedData(selectedData);
    onSlotDataSubmit(selectedData); // Call the callback function with the selected data
  };

  return (
    <View>
      {timeSlotList.slots.map((slot, index) => (
        <SlotCard
          key={index}
          slots={slot}
          duration={timeSlotList.duration}
          onSelectSlot={handleSlotSelection}
          selectedSlot={selectedSlot}
          setNoOfGuest={setNoOfGuest}
          noOfGuest={noOfGuest}
        />
      ))}
      <Button title="Submit" onPress={handleSubmit} />
      {submittedData && (
        <View>
          <Text>Submitted Data:</Text>
          <Text>Selected Slot: {submittedData.selectedSlot}</Text>
          <Text>No. of Guests: {submittedData.noOfGuest}</Text>
        </View>
      )}
    </View>
  );
}
