import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"

const firebaseConfig = {
  apiKey: "AIzaSyCUtaKa38Fp1WUItoOogM4ZigWKppC1ZJ8",
  authDomain: "protein-tracker-2025.firebaseapp.com",
  databaseURL: "https://protein-tracker-2025-default-rtdb.firebaseio.com",
  projectId: "protein-tracker-2025",
  storageBucket: "protein-tracker-2025.firebasestorage.app",
  messagingSenderId: "262195651660",
  appId: "1:262195651660:web:3ab261f97d2594a0c0c0e9"
}

const app = initializeApp(firebaseConfig)
export const db = getDatabase(app)
