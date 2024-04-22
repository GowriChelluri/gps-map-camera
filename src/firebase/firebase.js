// src/firebase/firebase.js
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';

const firebaseConfig = {
    apiKey: "AIzaSyD1w_fTW9EdvsrjbRzE6KW75lWS7y5efLQ",
    authDomain: "gps-map-camera-b88c4.firebaseapp.com",
    projectId: "gps-map-camera-b88c4",
    storageBucket: "gps-map-camera-b88c4.appspot.com",
    messagingSenderId: "292762365074",
    appId: "1:292762365074:web:e771652305658756984a4b",
    measurementId: "G-S135TEL343"
  };

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const storage = firebase.storage();

export { storage, firebase }; // Export both storage and firebase explicitly
