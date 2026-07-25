import { Platform } from "react-native";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  initializeAuth,
  browserLocalPersistence,
  // @ts-expect-error - getReactNativePersistence exists at runtime but not in the TS types
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyCFA2AW3XVGNUOB3d_1ejoDLnz8nwf3yKs",
  authDomain: "formik-db1ad.firebaseapp.com",
  projectId: "formik-db1ad",
  storageBucket: "formik-db1ad.firebasestorage.app",
  messagingSenderId: "157484030088",
  appId: "1:157484030088:web:7a0634897ffede9191273d",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence:
    Platform.OS === "web"
      ? browserLocalPersistence
      : getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
export default app;