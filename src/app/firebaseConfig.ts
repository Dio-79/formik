// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCFA2AW3XVGNUOB3d_1ejoDLnz8nwf3yKs",
  authDomain: "formik-db1ad.firebaseapp.com",
  projectId: "formik-db1ad",
  storageBucket: "formik-db1ad.firebasestorage.app",
  messagingSenderId: "157484030088",
  appId: "1:157484030088:web:7a0634897ffede9191273d",
  measurementId: "G-WHTL2FMFKS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);