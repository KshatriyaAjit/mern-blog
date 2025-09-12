// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyADpeO39E9hqoJqay4Sf4kmABGxZnz5GKo",
  authDomain: "mernblog-324e4.firebaseapp.com",
  projectId: "mernblog-324e4",
  storageBucket: "mernblog-324e4.firebasestorage.app",
  messagingSenderId: "70375708000",
  appId: "1:70375708000:web:dd38eb00160cacf5ff3a05"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {auth, provider};