import { Platform } from "react-native";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
	initializeAuth,
	browserLocalPersistence,
	// @ts-expect-error - getReactNativePersistence exists at runtime but not in the TS types
	getReactNativePersistence,
	getAuth,
	type Auth
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
	apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};

function missingConfigKeys() {
	return Object.entries(firebaseConfig)
		.filter(([, value]) => !value)
		.map(([key]) => key);
}

const missing = missingConfigKeys();
if (missing.length > 0) {
	console.warn(`Firebase config missing env vars: ${missing.join(", ")}. Copy .env.example to .env and fill in your Firebase project values.`);
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let auth: Auth;
try {
	auth = initializeAuth(app, {
		persistence: Platform.OS === "web" ? browserLocalPersistence : getReactNativePersistence(AsyncStorage)
	});
} catch {
	auth = getAuth(app);
}

export { auth };
export const db = getFirestore(app);
