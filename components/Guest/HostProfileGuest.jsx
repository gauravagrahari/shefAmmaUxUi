import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import HostDetailCard from "../GuestSubComponent/HostDetailCard";
import ItemCard from "../GuestSubComponent/ItemCard";
import { RadioButton } from "react-native-paper";
import SlotCard from "../GuestSubComponent/SlotCard.jsx";
import axios from "axios";
import { ScrollView } from "react-native";
import SlotCardTest from "../test/SlotCardTest";
import { TouchableOpacity } from "react-native";

// the totalAmount is not getting updated

//in ordered json or class a change is required, in the itemList we will be sharing the item name instead of itemID, 
// as upon clicking the Host name the whole host profile would come
export default function HostProfileGuest({ route }) {
  const [checked, setChecked] = useState("dine");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [noOfGuest, setNoOfGuest] = useState(1);
  const [orderedItems, setOrderedItems] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [items, setItems] = useState([]);
  const { host, itemList, timeSlotList } = route.params || {};

  const closeOrderPlacedMessage = () => {
    setOrderPlaced(false);
  };

  const handleRadioButtonChange = (value) => {
    setChecked(value);
  };
  const handleSlotSelection = (startTime, capacity) => {
    setSelectedSlot(startTime);
    setNoOfGuest(Math.min(noOfGuest, capacity));
  };
  const handleSlotDataSubmit = (data) => {
    setSelectedSlot(data.selectedSlot);
    setNoOfGuest(data.noOfGuest);
    console.log(data.selectedSlot +" data in HostprfileGuest");
    console.log(data.noOfGuest +" data in HostprfileGuest");
  };

useEffect(() => {
  setItems(itemList);
}, []);

const handleServeChange = (itemId, serves, calculatedAmount) => {
  setItems((prevItems) =>
    prevItems.map((item) =>
      item.uuidItem === itemId
        ? { ...item, serves: serves || 0, calculatedAmount: calculatedAmount || 0 }
        : item
    )
  );
};

useEffect(() => {
  const newTotalAmount = items.reduce(
    (acc, item) => acc + (item.calculatedAmount || 0),
    0
  );
  setTotalAmount(newTotalAmount);
}, [items]);
useEffect(() => {
  const itemsWithServeAndAmount = itemList.map(item => ({
    ...item,
    serves: 0,
    calculatedAmount: 0,
  }));
  setItems(itemsWithServeAndAmount);
}, []);

  // Handles the order button click
  const handleOrderButton = async () => {
    const orderedItemsData = items.map((item) => ({
      itemId: item.uuidItem,
      noOfServing: item.serves.toString(),
    }));
    // console.log(orderData);
    const orderData = {
      uuidOrder: "2001",
      timeStamp: new Date().toISOString(),
      uuidHost: host.uuidHost,
      status: "placed",
      amount: totalAmount.toFixed(2),
      itemQuantity: orderedItemsData.length.toString(),
      noOfGuest: noOfGuest,
      pickUp: checked === "pickup" ? "Yes" : "No",
      startTime: selectedSlot, // Update with the actual selected slot value
      orderedItems: orderedItemsData,
      // name:name, //guest name will also be passed in the order
    };
    try {
      const response = await axios.post(`${URL}/guest/order`, orderData);
      console.log(orderData);
      console.log(response.data); // Handle the response data from the server
      setOrderPlaced(true); // Show the "Order Placed" message
    } catch (error) {
      console.error(error); // Handle error case
    }
  };

  return (
    <ScrollView>
      {/* <HostDetailCard hostDetails={host} /> */}
      {items.map((item) => (
        <ItemCard
          key={item.nameItem}
          item={item}
          onServeChange={handleServeChange}
        />
      ))}
       <Text>Total Amount : {totalAmount}</Text>
      <SlotCardTest
        timeSlotList={timeSlotList}
        onSlotDataSubmit={handleSlotDataSubmit}
      />
     
      <RadioButton.Group
        onValueChange={handleRadioButtonChange}
        value={checked}>
        <RadioButton.Item label="Dine" value="dine" />
        <RadioButton.Item label="Pickup" value="pickup" />
      </RadioButton.Group>
      <Button title="Order" onPress={handleOrderButton} />
      {orderPlaced && (
        <View style={styles.orderPlacedContainer}>
          <Text style={styles.orderPlacedText}>Order Placed</Text>
          <TouchableOpacity onPress={closeOrderPlacedMessage}>
            <Text style={styles.closeButton}>×</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
      }

const styles = StyleSheet.create({
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  noOfGuest: {
    marginHorizontal: 10,
  },
  orderPlacedContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
  },
  orderPlacedText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  closeButton: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginLeft: 10,
  },
});


