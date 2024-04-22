import React from 'react';
import GoogleMapComponent from './components/GoogleMapComponent';

const App = () => {
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <GoogleMapComponent center={{ lat: 0, lng: 0 }} zoom={10} />
      {/* Add other components on top of the map */}
    </div>
  );
};

export default App;
