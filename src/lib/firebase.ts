
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAhHtEb_7adNuVDPg7WKr_KjHG4X9w9rQE",
  authDomain: "personal-portofolio-4fc27.firebaseapp.com",
  projectId: "personal-portofolio-4fc27",
  storageBucket: "personal-portofolio-4fc27.firebasestorage.app",
  messagingSenderId: "992863616902",
  appId: "1:992863616902:web:31fc12c3999287c4a13607",
  measurementId: "G-LJK8G6RS31"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
