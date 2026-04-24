import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBLaZlTjX734ffsRyQJMgydwOaCEUEBk24",
  authDomain: "quanturion-calculator.firebaseapp.com",
  projectId: "quanturion-calculator",
  storageBucket: "quanturion-calculator.firebasestorage.app",
  messagingSenderId: "934945084489",
  appId: "1:934945084489:web:c0895f075c96f82d3c5b98"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);