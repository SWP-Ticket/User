// Import the functions you need from the Firebase SDK
import { initializeApp } from 'firebase/app';

import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAyxtra_7NAcB6vhqrgMnaUeIwBqo1f43A',
  authDomain: 'capstone-b87ce.firebaseapp.com',
  projectId: 'capstone-b87ce',
  storageBucket: 'capstone-b87ce.appspot.com',
  messagingSenderId: '863065874835',
  appId: '1:863065874835:web:9059fe1c54746c9cb5c866',
  measurementId: 'G-E04B3MKJ6X',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage
const storage = getStorage(app);

// Export the storage instance for use in other parts of your application
export { storage };
