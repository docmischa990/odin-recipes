//SECTION - Firebase Configuration
// ! OPTION A - Install Firebase SDK using <script> tag

<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
</script>




//SECTION - Firebase Configuration
// ! OPTION B - Install Firebase SDK using npm

//NOTE - Add this in Terminal for option B
// ! npm install firebase

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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