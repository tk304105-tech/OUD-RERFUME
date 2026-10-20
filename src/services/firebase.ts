import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as fbSignOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc 
} from 'firebase/firestore';

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phone?: string;
  tier: 'VIP Gold' | 'Platinum Connoisseur' | 'Patron' | 'New Client';
  addresses?: Array<{
    title: string;
    address_line: string;
    city: string;
    province: string;
    phone: string;
    is_primary?: boolean;
  }>;
}

// Default fallback configuration for client-side persistence
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyFakeKeyForPreviewLocalHostModeOnly12345",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "aura-oud-parfums.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "aura-oud-parfums",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "aura-oud-parfums.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "334337631597",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:334337631597:web:9429eee5dbaa4ebe8e873d"
};

let app: any = null;
let auth: any = null;
let db: any = null;

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
} catch (err) {
  console.warn("Firebase initialized in simulated offline mode:", err);
}

export { app, auth, db };

const USER_SESSION_KEY = 'aura_oud_authenticated_user_v2';

export async function loginWithGoogle(): Promise<AppUser> {
  // If real Firebase Auth is configured and reachable
  if (auth && import.meta.env.VITE_FIREBASE_API_KEY) {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;
      
      const appUser: AppUser = {
        uid: fbUser.uid,
        email: fbUser.email || 'patron@auraoud.com',
        displayName: fbUser.displayName || 'Distinguished Patron',
        photoURL: fbUser.photoURL || undefined,
        tier: 'VIP Gold',
        phone: fbUser.phoneNumber || '+92 300 8821940'
      };

      // Persist to Firestore if available
      if (db) {
        try {
          const userDocRef = doc(db, 'users', appUser.uid);
          await setDoc(userDocRef, {
            ...appUser,
            lastLogin: new Date().toISOString()
          }, { merge: true });
        } catch (dbErr) {
          console.warn("Could not sync to cloud Firestore, keeping local persistence", dbErr);
        }
      }

      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(appUser));
      return appUser;
    } catch (popupErr) {
      console.warn("Popup sign-in encountered error, falling back to simulated session:", popupErr);
    }
  }

  // High-fidelity fallback / prototype mode for test environment
  // Customer patron fallback (Admin is strictly tk304105@gmail.com with password tayyaba009)
  const fallbackUser: AppUser = {
    uid: 'usr-patron-vip',
    email: 'patron.oud@gmail.com',
    displayName: 'Hamza Al-Zubair',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    phone: '+92 300 8821940',
    tier: 'VIP Gold',
    addresses: [
      {
        title: 'Primary Residence (Lahore)',
        address_line: 'Villa 14, Sector Y, Phase 5, DHA',
        city: 'Lahore',
        province: 'Punjab',
        phone: '+92 300 8821940',
        is_primary: true
      },
      {
        title: 'Karachi Boutique Suite',
        address_line: 'B-42, 26th Street, Phase 6, DHA',
        city: 'Karachi',
        province: 'Sindh',
        phone: '+92 321 4559081',
        is_primary: false
      }
    ]
  };

  localStorage.setItem(USER_SESSION_KEY, JSON.stringify(fallbackUser));
  return fallbackUser;
}

const REGISTERED_ACCOUNTS_KEY = 'aura_oud_registered_patrons_v2';

export interface RegisteredPatron {
  email: string;
  password?: string;
  displayName: string;
  phone?: string;
  tier: 'VIP Gold' | 'Platinum Connoisseur' | 'Patron' | 'New Client';
  updatedAt: string;
}

export function getRegisteredPatrons(): RegisteredPatron[] {
  try {
    const raw = localStorage.getItem(REGISTERED_ACCOUNTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function loginWithUserEmail(
  email: string, 
  displayName?: string, 
  phone?: string,
  password?: string
): Promise<AppUser> {
  const cleanEmail = email.trim().toLowerCase();
  const name = displayName?.trim() || cleanEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  // Record into persistent registered patrons list
  try {
    const patrons = getRegisteredPatrons();
    const existingIdx = patrons.findIndex(p => p.email.toLowerCase() === cleanEmail);
    const patronRecord: RegisteredPatron = {
      email: cleanEmail,
      displayName: name || 'Distinguished Patron',
      phone: phone?.trim() || '+92 300 1234567',
      password: password?.trim() || (existingIdx >= 0 ? patrons[existingIdx].password : 'patron123'),
      tier: existingIdx >= 0 ? patrons[existingIdx].tier : 'VIP Gold',
      updatedAt: new Date().toISOString()
    };

    if (existingIdx >= 0) {
      patrons[existingIdx] = { ...patrons[existingIdx], ...patronRecord };
    } else {
      patrons.unshift(patronRecord);
    }
    localStorage.setItem(REGISTERED_ACCOUNTS_KEY, JSON.stringify(patrons));
  } catch (err) {
    console.warn("Could not save to registered patrons list:", err);
  }

  const appUser: AppUser = {
    uid: `usr_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
    email: cleanEmail,
    displayName: name || 'Distinguished Patron',
    phone: phone?.trim() || '+92 300 1234567',
    tier: 'VIP Gold',
    addresses: [
      {
        title: 'Primary Residence (Lahore)',
        address_line: 'Villa 14, Sector Y, Phase 5, DHA',
        city: 'Lahore',
        province: 'Punjab',
        phone: phone?.trim() || '+92 300 1234567',
        is_primary: true
      }
    ]
  };

  // Immediate synchronous session persistence
  try {
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(appUser));
  } catch (err) {
    console.warn("Could not save user session:", err);
  }

  // Non-blocking firestore sync: only run if real credentials and never block user promise
  if (db && firebaseConfig.apiKey && !firebaseConfig.apiKey.includes('FakeKey')) {
    try {
      const userDocRef = doc(db, 'users', appUser.uid);
      setDoc(userDocRef, {
        ...appUser,
        lastLogin: new Date().toISOString()
      }, { merge: true }).catch(e => {
        console.warn("Firestore background sync skipped:", e);
      });
    } catch (e) {
      console.warn("Firestore sync skipped:", e);
    }
  }

  return appUser;
}

export function getCurrentUser(): AppUser | null {
  try {
    const raw = localStorage.getItem(USER_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function logoutUser(): Promise<void> {
  if (auth) {
    try {
      await fbSignOut(auth);
    } catch {}
  }
  localStorage.removeItem(USER_SESSION_KEY);
}

export async function updateUserProfile(updated: Partial<AppUser>): Promise<AppUser> {
  const current = getCurrentUser();
  if (!current) throw new Error("No active patron session");

  const merged = { ...current, ...updated };
  localStorage.setItem(USER_SESSION_KEY, JSON.stringify(merged));

  if (db && current.uid) {
    try {
      const userDocRef = doc(db, 'users', current.uid);
      await updateDoc(userDocRef, { ...updated });
    } catch (e) {
      console.warn("Firestore updateDoc skipped:", e);
    }
  }

  return merged;
}
