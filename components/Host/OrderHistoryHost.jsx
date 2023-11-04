import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function OrderHistoryHost() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const jwtToken = 'your_jwt_token'; // Replace with your actual JWT token
      const headers = {
        // Authorization: `Bearer ${jwtToken}`,
        hostID: 'host#105',
      };
  
      const response = await axios.get('http://192.168.36.93:9090/host/orders', {
        headers,
      });
  
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };  
  return (
    <ScrollView>

      {/* <Navbar /> */}
      {orders.map((order, index) => (
        <OrderCard key={index} order={order}  isHost={true}/>
        ))}

        </ScrollView>
  );
}
const styles = StyleSheet.create({})