import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDtP_MbK4Q6td91ovrWqoY8Q-kg5INlnAc",
    authDomain: "bizimhikayemiz-94c4c.firebaseapp.com",
    projectId: "bizimhikayemiz-94c4c",
    storageBucket: "bizimhikayemiz-94c4c.firebasestorage.app",
    messagingSenderId: "186819356568",
    appId: "1:186819356568:web:746da882af98f8363aaded",
    measurementId: "G-NGW654L54T"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
