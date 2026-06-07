import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDTBpeaH1KPmArGG4RB09z6C0fXrhQStJQ",
  authDomain: "sunnahuz.firebaseapp.com",
  projectId: "sunnahuz",
  storageBucket: "sunnahuz.firebasestorage.app",
  messagingSenderId: "812138122217",
  appId: "1:812138122217:web:2f9448ad09235afc685978",
  measurementId: "G-N2YHM1F5ED"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
