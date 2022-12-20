importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyDSpdpLybE3v4refMstmsi_iSU7A1QgP_8",
    authDomain: "showcasetest-2fcf8.firebaseapp.com",
    projectId: "showcasetest-2fcf8",
    storageBucket: "showcasetest-2fcf8.appspot.com",
    messagingSenderId: "344696979846",
    appId: "1:344696979846:web:c459cba7f7808cab656c07"
});

const isSupported = firebase.messaging.isSupported();
if (isSupported) {
    const messaging = firebase.messaging();
    messaging.onBackgroundMessage(({ notification: { title, body, image } }) => {
        self.registration.showNotification(title, {
            body,
            icon: image || "/assets/icons/icon-72x72.png",
        });
    });
}
