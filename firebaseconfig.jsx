// Import the functions you need from the Firebase SDK
import { initializeApp } from 'firebase/app';

import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCkxq1jeb9v320Aow79Mx0Sbe6Dq-dLQD0',
  authDomain: 'swp-3-209dc.firebaseapp.com',
  projectId: 'swp-3-209dc',
  storageBucket: 'swp-3-209dc.appspot.com',
  messagingSenderId: '265867443689',
  appId: '1:265867443689:web:088f3245a50cb7f77ddf78',
  measurementId: 'G-Y36B4FEHF5',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage
const storage = getStorage(app);

// Export the storage instance for use in other parts of your application
export { storage };
