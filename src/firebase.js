// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

//  web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBIpafFeAfqI-tugOJIKdDr_MNNGDBGbwU",
    authDomain: "daysinn-6727d.firebaseapp.com",
    projectId: "daysinn-6727d",
    storageBucket: "daysinn-6727d.appspot.com",
    messagingSenderId: "750057623349",
    appId: "1:750057623349:web:e838e134b2d92164e5867c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase authentication instance
const auth = getAuth(app);

// Get Firebase storage instance
const storage = getStorage(app);

export { auth, storage };
