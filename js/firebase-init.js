// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBKR9WrSKnYvzcaC2HVcF1Z1v17FwLVRb4",
  authDomain: "stratusspoon.firebaseapp.com",
  projectId: "stratusspoon",
  storageBucket: "stratusspoon.firebasestorage.app",
  messagingSenderId: "792749144655",
  appId: "1:792749144655:web:55073cff63e98aee28483a",
  measurementId: "G-S5XXB390GH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore and export it
export const db = getFirestore(app);

  