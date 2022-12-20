// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_IDD
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

function requestPermission() {
    console.log("Requesting permission...");
    Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
            console.log("Notification permission granted.");
            const app = initializeApp(firebaseConfig);

            // const messaging = getMessaging(app);
            // getToken(messaging, {
            //     vapidKey:
            //         "BGpiyjyE35MUxLQ3DMXC9DwxQsx7SwWazulSyXFHyXfvgipTwE6PAVdx4CIjmwTaFrKRD31XEoKZln-B6b199s0",
            // }).then((currentToken) => {
            //     if (currentToken) {
            //         console.log("currentToken: ", currentToken);
            //         document.cookie = "fcm=" + currentToken;
            //     } else {
            //         console.log("Can not get token");
            //     }
            // });
        } else {
            console.log("Do not have permission!");
        }
    });
}

requestPermission();

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);