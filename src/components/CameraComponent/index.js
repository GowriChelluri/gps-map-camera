import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import { storage } from '../../firebase/firebase';

const CameraComponent = () => {
  const webcamRef = useRef(null);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [address, setAddress] = useState('');
  const [capturedImages, setCapturedImages] = useState([]);

  // Function to capture photo
  const capturePhoto = async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      const imageBlob = await fetch(imageSrc).then((res) => res.blob());

      // Create a reference to the Firebase Storage location
      const storageRef = storage.ref();

      // Upload the image file to Firebase Storage
      const imageRef = storageRef.child(`images/${Date.now()}.jpg`);
      await imageRef.put(imageBlob);

      // Get the download URL of the uploaded image
      const imageUrl = await imageRef.getDownloadURL();

      // Add the captured image to the list
      setCapturedImages(prevImages => [...prevImages, { url: imageUrl, location: currentPosition, address: address }]);
    }
  };

  // Function to fetch address based on coordinates
  const getAddress = async (latitude, longitude) => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
      const { display_name } = response.data;
      setAddress(display_name);
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  // Fetch user's current location using Geolocation API
  useState(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition({ lat: latitude, lng: longitude });
          getAddress(latitude, longitude); // Fetch address once location is obtained
        },
        error => {
          console.error('Error getting user location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      {/* Display the webcam preview */}
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        style={{ width: '100%', height: '100%' }}
      />
      {/* Button to capture photo */}
      <button onClick={capturePhoto} style={captureButtonStyle}>
        Capture Photo
      </button>
      {/* Display the list of captured images */}
      <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1 }}>
        <h2>Captured Images:</h2>
        <ul>
          {capturedImages.map((image, index) => (
            <li key={index}>
              <img src={image.url} alt={`Captured ${index}`} style={{ width: '100px', height: 'auto' }} />
              <p>Latitude: {image.location?.lat}</p>
              <p>Longitude: {image.location?.lng}</p>
              <p>Address: {image.address}</p>
            </li>
          ))}
        </ul>
      </div>
      {/* Display user's current address */}
      <div style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)' }}>
        <h2>User's Current Address:</h2>
        <p>{address}</p>
      </div>
    </div>
  );
};

const captureButtonStyle = {
  position: 'absolute',
  bottom: '10px',
  left: '50%',
  transform: 'translateX(-50%)',
  padding: '8px 16px',
  fontSize: '16px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

export default CameraComponent;
