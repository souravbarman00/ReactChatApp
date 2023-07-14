import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBIhGovTd0rUzFLXELAgPiulcbs8eWnFlw",
    authDomain: "chat-app-79d92.firebaseapp.com",
    projectId: "chat-app-79d92",
    storageBucket: "chat-app-79d92.appspot.com",
    messagingSenderId: "84381478804",
    appId: "1:84381478804:web:de49c89d71e39da19ee981"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const db = getFirestore(app);

export { auth, provider, db };
