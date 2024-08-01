
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
const firebaseConfig = {
  apiKey: "AIzaSyCykKqThDkClC9kYbaYqF26ieZNVZtRPeQ",
  authDomain: "phone-auth-38815.firebaseapp.com",
  projectId: "phone-auth-38815",
  storageBucket: "phone-auth-38815.appspot.com",
  messagingSenderId: "147673693785",
  appId: "1:147673693785:web:3ff572e78e421478d27b48"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
auth.useDeviceLanguage();
export { auth };