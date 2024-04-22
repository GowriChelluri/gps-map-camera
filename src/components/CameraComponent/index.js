import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { storage } from '../../firebase/firebase';

const CameraComponent = () => {
  const webcamRef = useRef(null);
  const [capturedImages, setCapturedImages] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(null);

  useEffect(() => {
    // Get user's current location using Geolocation API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition({ lat: latitude, lng: longitude });
        },
        error => {
          console.error('Error getting user location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

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

      // Update capturedImages state with the image URL and geolocation
      setCapturedImages(prevImages => [...prevImages, { url: imageUrl, location: currentPosition }]);
    }
  };

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
            </li>
          ))}
        </ul>
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
