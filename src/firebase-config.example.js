// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBG1feNIjSW4sz4ib8eHZfrXWv4CZS9Xvk",
  authDomain: "fcmtest-aeb69.firebaseapp.com",
  projectId: "fcmtest-aeb69",
  storageBucket: "fcmtest-aeb69.firebasestorage.app",
  messagingSenderId: "194844519048",
  appId: "1:194844519048:web:06d7aa343626df54be4d3d",
  measurementId: "G-MXX7Y596ML",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Firebase Console > Project Settings > General > Your apps > Web app에서 확인 가능
// Cloud Messaging > Web Push certificates에서 VAPID key도 확인 필요
export const vapidKey = "example vapid key string for firebase cloud messaging";

