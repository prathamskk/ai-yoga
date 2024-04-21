import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getDatabase } from "firebase/database";

// Firebase Default App initialized before using any service
const uri = process.env.MONGODB_URI;

// REPLACE THIS WITH YOUR FIREBASE CONFIG 
// PROCESS ENV IS BROKEN IDK WHY

const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    databaseURL: process.env.databaseURL,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
    measurementId: process.env.measurementId
};
 
const app = initializeApp(firebaseConfig)
const auth = getAuth()
const db = getFirestore()
const storage = getStorage()
const database = getDatabase();


export default { app, auth, db, storage, database }