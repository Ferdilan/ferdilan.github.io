// js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// TODO: Replace with your actual Firebase config from Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyCr1XQQPQl4PwmadsrS0qpxNcfsjIQLUNw",
    authDomain: "website-profile-f99e5.firebaseapp.com",
    projectId: "website-profile-f99e5",
    storageBucket: "website-profile-f99e5.firebasestorage.app",
    messagingSenderId: "471344154346",
    appId: "1:471344154346:web:547b8fe47bc8daa45db993",
    // Tambahkan databaseURL jika RTDB Anda TIDAK berada di us-central  (cek di menu Realtime Database)
    databaseURL: "https://website-profile-f99e5-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Initialize Firebase
let app, db, auth;

try {
    app = initializeApp(firebaseConfig);
    db = getDatabase(app);
    auth = getAuth(app);
    console.log("Firebase Realtime Database initialized.");
} catch (error) {
    console.error("Firebase initialization error:", error);
}

export { app, db, auth };
