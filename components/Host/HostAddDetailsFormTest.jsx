import React, { useState } from 'react';
import { View, Button } from 'react-native';
import axios from 'axios';

const HostAddDetailsFormTest = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Hardcoded data
      const formData = {
        uuidHost: 'host#50345',
        geocode: '',
        nameHost: 'fullName',
        dp: 'dpImageUrl',
        dineCategory: 'dineCategory',
        addressHost: {
          street: 'street',
          houseName: 'houseName',
          city: 'city',
          state: 'state',
          pinCode: 'pinCode',
        },
      };

      // Make POST request
      const response = await axios.post('http://192.168.1.3:9090/host', formData);

      // Handle the response as needed
      console.log(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <Button title="Submit" onPress={handleSubmit} disabled={loading} />
    </View>
  );
};

export default HostAddDetailsFormTest;
