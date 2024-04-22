import React, { useState, useEffect ,useRef} from 'react';
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';
import { MdCamera } from 'react-icons/md';
import CameraComponent from '../CameraComponent'

import { storage } from '../../firebase/firebase';

const containerStyle = {
  width: '100%',
  height: '100vh', // Set map height to cover entire viewport
  position: 'relative', // Ensure the map container is positioned relatively
};

const GoogleMapComponent = () => {
  const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 });
  const [searchedLocation, setSearchedLocation] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(null);
  const webcamRef = useRef(null);
  useEffect(() => {
    // Get user's current location using Geolocation API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
        },
        error => {
          console.error('Error getting user location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  const handlePlaceSelect = () => {
    // Ensure autocomplete is defined before calling getPlace
    if (autocomplete) {
      // Get the selected place from the Autocomplete component and update the map's center
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        setCurrentLocation({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        });
      }
    } else {
      console.error('Autocomplete is not yet initialized.');
    }
  };

  const handleSearchInputChange = (event) => {
    // Update the search input value and reset the searchedLocation state
    setSearchInput(event.target.value);
    setSearchedLocation(null);
  };

  const handleMarkerClick = () => {
    setIsCameraOpen(true);
  };
 
  let autocomplete;
  const onLoad = ref => (autocomplete = ref);
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
    <LoadScript
      googleMapsApiKey="AIzaSyDG6mOFENxqrzWoLoei68HcUAWLnUu01OE"
      libraries={["places"]}
    >
      <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={currentLocation}
          zoom={10}
        >
          {/* Marker for current location */}
          <Marker
            position={currentLocation}

            
          />
          {capturedImages.map((image, index) => (
  <Marker key={index} position={{ lat: image.lat, lng: image.lng }} />
))}
          {/* Marker for searched location */}
          {searchedLocation && (
            <Marker position={searchedLocation} />
          )}

          {/* Autocomplete search bar */}
          <Autocomplete onLoad={onLoad} onPlaceChanged={handlePlaceSelect}>
            <input
              type="text"
              placeholder="Search for a location"
              value={searchInput}
              onChange={handleSearchInputChange}
              style={{
                boxSizing: `border-box`,
                border: `1px solid transparent`,
                width: `240px`,
                height: `32px`,
                padding: `0 12px`,
                borderRadius: `3px`,
                boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                fontSize: `14px`,
                outline: `none`,
                textOverflow: `ellipses`,
                position: 'absolute',
                top: '10px',
                left: '50%',
                marginLeft: '-90px'
              }}
            />
          </Autocomplete>
          
          
        </GoogleMap>
        <div
          style={{
            position: 'absolute',
            top: '0px',
            right: '10px',
            zIndex: 9999,
            marginRight: '150px' // Added margin for better spacing
          }}
        >
         
        </div>
        {/* Camera component */}
        {isCameraOpen && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 9999 }}>
           <CameraComponent/>
          </div>
        )}
        <button
            onClick={handleMarkerClick}
            style={{
              position: 'absolute',
              bottom: '20px',
              marginRight:'60px',
              right: '20px',
              zIndex: 9999,
              backgroundColor: 'white',
              borderRadius: '50%',
              border: 'none',
              padding: '10px',
              cursor: 'pointer',
            }}
          >
            <MdCamera size={24} />
          </button>
          
      </div>
      
    </LoadScript>
    
  );
};

export default GoogleMapComponent;
