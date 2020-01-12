// Firebase App is always required and must be first
import { firebase } from "@firebase/app";
// Add additional services to be used
import "@firebase/firestore";
import "@firebase/storage";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyCCL8LNWfr2Ri2wSOV8rjlbxZ4S1SWRWco",
  authDomain: "tum-food-app.firebaseapp.com",
  databaseURL: "https://tum-food-app.firebaseio.com",
  projectId: "tum-food-app",
  storageBucket: "tum-food-app.appspot.com",
  messagingSenderId: "811530983997",
  appId: "1:811530983997:web:12889ab162f54f3f1be854",
  measurementId: "G-ZTTXZQNQE8"
});

// Export types that exists in Firestore
// This is not always necessary, but it's used in other examples
const { TimeStamp, GeoPoint } = firebase.firestore;
export { TimeStamp, GeoPoint };

// Firebase utilities
const database = firebaseApp.firestore();
const storage = firebase.storage();

database.enablePersistence({ synchronizeTabs: true }).catch(error => {
  if (error.code == "failed-precondition") {
    // Multiple tabs open, persistence can only be enabled
    // in one tab at a a time.
    // ...
  } else if (error.code == "unimplemented") {
    // The current browser does not support all of the
    // features required to enable persistence
    // ...
  }
});
// Subsequent queries will use persistence, if it was enabled successfully

export { database, storage };
