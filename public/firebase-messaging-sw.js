// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
    apiKey: 'AIzaSyBKJP8VMEwc_DKh0Z4xS8z4xCXC4igaO-I',
    authDomain: 'saturnonew-c3099.firebaseapp.com',
    databaseURL: 'https://saturnonew-c3099.firebaseio.com',
    projectId: 'saturnonew-c3099',
    storageBucket: 'saturnonew-c3099.appspot.com',
    messagingSenderId: '751536198908',
    appId: '1:751536198908:web:29c39618d7207916f0b379',
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();