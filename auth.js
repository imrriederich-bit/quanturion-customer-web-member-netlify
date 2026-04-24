import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { auth, db } from "./firebase-web.js";

export async function registerCustomer({
  email,
  password,
  fullName = "",
  plan = "single",
  language = "de"
}) {
  const cleanEmail = String(email || "").trim().toLowerCase();
  const cleanName = String(fullName || "").trim();

  const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);

  await setDoc(doc(db, "customers", cred.user.uid), {
    uid: cred.user.uid,
    email: cleanEmail,
    fullName: cleanName,
    role: "customer",
    plan,
    membershipStatus: "inactive",
    language,
    createdAt: serverTimestamp()
  });

  return cred.user;
}

export async function loginCustomer({ email, password }) {
  const cleanEmail = String(email || "").trim().toLowerCase();
  const cred = await signInWithEmailAndPassword(auth, cleanEmail, password);
  return cred.user;
}

export async function logoutCustomer() {
  await signOut(auth);
}

export function subscribeAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

export async function getCustomerProfile(uid) {
  if (!uid) return null;
  const ref = doc(db, "customers", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}