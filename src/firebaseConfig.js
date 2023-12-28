import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore/lite";
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyClYQonJ7dkOPJwEQPqY17XNAn_DqD1n6s",
  authDomain: "web1-7e600.firebaseapp.com",
  projectId: "web1-7e600",
  storageBucket: "web1-7e600.appspot.com",
  messagingSenderId: "729786870397",
  appId: "1:729786870397:web:591debab5bf711f8949f14"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const storage = getStorage(firebaseApp);

export { auth, db, storage }; 