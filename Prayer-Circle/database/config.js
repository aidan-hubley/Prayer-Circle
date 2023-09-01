// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC-sstL-VtWW-7jo-slmLr-IcizkahjUlM",
    authDomain: "prayer-circle-8c3ff.firebaseapp.com",
    databaseURL: "https://prayer-circle-8c3ff-default-rtdb.firebaseio.com",
    projectId: "prayer-circle-8c3ff",
    storageBucket: "prayer-circle-8c3ff.appspot.com",
    messagingSenderId: "1084782526516",
    appId: "1:1084782526516:web:a541c99eba181be3ca8a61",
    measurementId: "G-8SV7SF9LZN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
