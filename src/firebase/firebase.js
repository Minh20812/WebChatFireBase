import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD14Z27MG7QSv4WAy95I_jb0lidu3sAXYc",
  authDomain: "webchatapp-44c42.firebaseapp.com",
  projectId: "webchatapp-44c42",
  storageBucket: "webchatapp-44c42.firebasestorage.app",
  messagingSenderId: "577848021460",
  appId: "1:577848021460:web:b067813faa27eadff58641",
  measurementId: "G-PVXVVLK2F3",
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const realtimeDB = getDatabase(app);

export { auth, provider, db, realtimeDB, app };
