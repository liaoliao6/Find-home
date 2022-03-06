import firebase from "firebase"
const config = {
    apiKey: "AIzaSyDlWfqh7FhI4smIUX6iKJpVQ8AHna34Heg",
    authDomain: "cmpe202-team12.firebaseapp.com",
    databaseURL: "https://cmpe202-team12.firebaseio.com",
    projectId: "cmpe202-team12",
    storageBucket: "cmpe202-team12.appspot.com",
    messagingSenderId: "790688666321",
    appId: "1:790688666321:web:0ce937b2f8909050622bf0",
    measurementId: "G-GCD893XLGV"
};

firebase.initializeApp(config)
export default firebase