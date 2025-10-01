import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getAuth, Auth } from 'firebase/auth'
import { getFirestore, Firestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

// Check if Firebase is already initialized
let app: FirebaseApp | undefined
let auth: Auth | undefined
let db: Firestore | undefined

// Initialize Firebase if we have valid config
if (firebaseConfig.apiKey && firebaseConfig.projectId) {
  try {
    console.log('Initializing Firebase with config:', {
      apiKey: firebaseConfig.apiKey ? 'Present' : 'Missing',
      authDomain: firebaseConfig.authDomain,
      projectId: firebaseConfig.projectId,
      storageBucket: firebaseConfig.storageBucket,
      messagingSenderId: firebaseConfig.messagingSenderId,
      appId: firebaseConfig.appId ? 'Present' : 'Missing'
    })
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
    auth = getAuth(app)
    db = getFirestore(app)
    console.log('Firebase initialized successfully')
  } catch (error) {
    console.error('Firebase initialization error:', error)
  }
} else {
  console.error('Firebase config missing:', {
    apiKey: firebaseConfig.apiKey ? 'Present' : 'Missing',
    projectId: firebaseConfig.projectId ? 'Present' : 'Missing'
  })
}

export { auth, db }
export default app
