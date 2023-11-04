import React, { useEffect, useState } from 'react';
import { View, Button, Text, ScrollView } from 'react-native';
import ItemCard from '../GuestSubComponent/ItemCard';

export default function ItemCardTest() {
  const [totalAmount, setTotalAmount] = useState(0);
  const [items, setItems] = useState([]);

  const handleServeChange = (itemId, serves, calculatedAmount) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.uuidItem === itemId
          ? { ...item, serves: serves, calculatedAmount: calculatedAmount }
          : item
      )
    );
  };
  useEffect(() => {
    const newTotalAmount = items.reduce(
      (acc, item) => acc + item.calculatedAmount,
      0
    );
    setTotalAmount(newTotalAmount);
  }, [items]);

  useEffect(() => {
    const initialItems = [
      {
        uuidItem: 'item#123',
        nameItem: 'Sample Item 1.',
        DP: 'images/8727054607_pkr.jpeg',
        vegetarian: true,
        specialIngredient: 'Special Ingredient',
        dishCategory: 'Sample Category',
        description: 'Sample Description',
        serve: 'Sample Serve',
        amount: 10.99,
        serves: 0,
        calculatedAmount: 0,
      },
      {
        uuidItem: 'item#456',
        nameItem: 'Sample Item 2',
        DP: 'images/8727054607_pkr.jpeg',
        vegetarian: true,
        specialIngredient: 'Special Ingredient',
        dishCategory: 'Sample Category',
        description: 'Sample Description',
        serve: 'Sample Serve',
        amount: 15.99,
        serves: 0,
        calculatedAmount: 0,
      }, {
        uuidItem: 'item#451',
        nameItem: 'Sample Item 2',
        DP: 'images/8727054607_pkr.jpeg',
        vegetarian: true,
        specialIngredient: 'Special Ingredient',
        dishCategory: 'Sample Category',
        description: 'Sample Description',
        serve: 'Sample Serve',
        amount: 15.99,
        serves: 0,
        calculatedAmount: 0,
      },
    ];
    setItems(initialItems);
  }, []);

  return (
    <ScrollView>
      {items.map((item) => (
        <ItemCard
          key={item.uuidItem}
          item={item}
          onServeChange={handleServeChange}
        />
      ))}
      <Text>Total Amount: {totalAmount}</Text>
    </ScrollView>
  );
}
