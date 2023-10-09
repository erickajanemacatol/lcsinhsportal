import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyAh57q2i3VhKAWiJe4B4cr_en8-9svWpo0",
  authDomain: "lcsinhs-portal.firebaseapp.com",
  projectId: "lcsinhs-portal",
  storageBucket: "lcsinhs-portal.appspot.com",
  messagingSenderId: "985764346695",
  appId: "1:985764346695:web:e3dbed71f654e2986eea62",
  measurementId: "G-Y836NDM8DL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };