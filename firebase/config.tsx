// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCQS0L81BYZA84lJKF4QlncBjGkK1ro-uE",
  authDomain: "p2pclouds-crm.firebaseapp.com",
  databaseURL: "https://p2pclouds-crm-default-rtdb.firebaseio.com",
  projectId: "p2pclouds-crm",
  storageBucket: "p2pclouds-crm.appspot.com",
  messagingSenderId: "920690160890",
  appId: "1:920690160890:web:e992ade68d3bdc355c4543",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
