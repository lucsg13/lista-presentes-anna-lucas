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
  created_at?: string;
}

export async function getPresents(): Promise<Present[]> {
  const snapshot = await getDocs(collection(db, 'presents'));
  const presents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Present));
  return presents.sort((a, b) => {
    const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return timeB - timeA;
  });
}

export async function addPresent(data: Omit<Present, 'id'>): Promise<Present> {
  const dataWithTimestamp = { ...data, created_at: new Date().toISOString() };
  const docRef = await addDoc(collection(db, 'presents'), dataWithTimestamp);
  return { id: docRef.id, ...dataWithTimestamp };
}

export async function updatePresent(id: string, data: Omit<Present, 'id'>): Promise<void> {
  await updateDoc(doc(db, 'presents', id), { ...data });
}

export async function deletePresent(id: string): Promise<void> {
  await deleteDoc(doc(db, 'presents', id));
}

export async function claimPresent(id: string, presentName: string, donorName: string): Promise<void> {
  if (id !== 'special-donation') {
    await updateDoc(doc(db, 'presents', id), { status: 'claimed' });
  }
  await addDoc(collection(db, 'donations'), {
    present_id: id,
    present_name: presentName,
    donor_name: donorName,
    created_at: new Date().toISOString()
  });
}

// ==========================================
// DONATIONS
// ==========================================

export interface Donation {
  id: string;
  present_id: string;
  present_name: string;
  donor_name: string;
  created_at: string;
}

export async function getDonations(): Promise<Donation[]> {
  const q = query(collection(db, 'donations'), orderBy('created_at', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Donation));
}

export async function deleteDonation(donationId: string, presentId: string): Promise<void> {
  await deleteDoc(doc(db, 'donations', donationId));
  await updateDoc(doc(db, 'presents', presentId), { status: 'available' });
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
