// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
	apiKey: 'AIzaSyC-sstL-VtWW-7jo-slmLr-IcizkahjUlM',
	authDomain: 'prayer-circle-8c3ff.firebaseapp.com',
	databaseURL: 'https://prayer-circle-8c3ff-default-rtdb.firebaseio.com',
	projectId: 'prayer-circle-8c3ff',
	storageBucket: 'prayer-circle-8c3ff.appspot.com',
	messagingSenderId: '1084782526516',
	appId: '1:1084782526516:web:a541c99eba181be3ca8a61',
	measurementId: 'G-8SV7SF9LZN'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = initializeAuth(app, {
	persistence: getReactNativePersistence(AsyncStorage)
});
export const storage = getStorage(app);
