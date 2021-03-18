import * as firebase from 'firebase';
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
    apiKey: "APIKEY",
    authDomain: "AUTH-DOMAIN",
    projectId: "PROJECT_ID",
    storageBucket: "STORAGE-BUCKET",
    messagingSenderId: "MESSAGING-SENDER-ID",
    appId: "APP-ID"
  };

let app;

if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig)
}
else {
  app  = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();

export { db, auth };
