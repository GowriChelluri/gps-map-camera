import React, { useState } from 'react';
import axios from 'axios';

const CameraWithAddress = ({ latitude, longitude }) => {
  const [address, setAddress] = useState('');

  // Function to fetch address based on coordinates
  const getAddress = async () => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
      const { display_name } = response.data;
      setAddress(display_name);
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  // Call getAddress function when component mounts
  useState(() => {
    getAddress();
  }, []);

  return (
    <div>
      <h2>Captured Image Details</h2>
      <p>Latitude: {latitude}</p>
      <p>Longitude: {longitude}</p>
      <p>Address: {address || 'Loading...'}</p>
    </div>
  );
};

export default CameraWithAddress;
