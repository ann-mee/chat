import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'

var firebaseConfig = {
    apiKey: "AIzaSyDua73pOENPB09Xf-LGrClkZ2Y4qY2CBxY",
    authDomain: "chat-9f6bb.firebaseapp.com",
    projectId: "chat-9f6bb",
    storageBucket: "chat-9f6bb.appspot.com",
    messagingSenderId: "884800061261",
    appId: "1:884800061261:web:7fe847b5a80e4adb930104"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig)

export default firebase