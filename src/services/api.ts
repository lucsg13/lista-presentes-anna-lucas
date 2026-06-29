import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
} from 'firebase/firestore';
import {
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { db, auth } from '../config/firebase';

// ==========================================
// PRESENTS
// ==========================================

export interface Present {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  links: string[];
  image_url: string;
  status?: 'available' | 'claimed';
}

export async function getPresents(): Promise<Present[]> {
  const snapshot = await getDocs(collection(db, 'presents'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Present));
}

export async function addPresent(data: Omit<Present, 'id'>): Promise<Present> {
  const docRef = await addDoc(collection(db, 'presents'), data);
  return { id: docRef.id, ...data };
}

export async function updatePresent(id: string, data: Omit<Present, 'id'>): Promise<void> {
  await updateDoc(doc(db, 'presents', id), { ...data });
}

export async function deletePresent(id: string): Promise<void> {
  await deleteDoc(doc(db, 'presents', id));
}

export async function claimPresent(id: string): Promise<void> {
  await updateDoc(doc(db, 'presents', id), { status: 'claimed' });
}

// ==========================================
// RSVPS
// ==========================================

export interface RSVP {
  id: string;
  name: string;
  email?: string;
  phone: string;
  message: string;
  status: string;
  companion: string;
  companion_name: string;
  created_at: string;
}

export async function getRSVPs(): Promise<RSVP[]> {
  const q = query(collection(db, 'rsvps'), orderBy('created_at', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RSVP));
}

export async function addRSVP(data: Omit<RSVP, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'rsvps'), data);
  return docRef.id;
}

export async function deleteRSVP(id: string): Promise<void> {
  await deleteDoc(doc(db, 'rsvps', id));
}

// ==========================================
// AUTHENTICATION
// ==========================================

export async function adminLogin(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

export async function adminLogout() {
  await signOut(auth);
}
