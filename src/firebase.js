import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyBw9il-SNmS3WX_qgBPJVQov8Zs2jn1FVA",
	authDomain: "promise-ph.firebaseapp.com",
	projectId: "promise-ph",
	storageBucket: "promise-ph.appspot.com",
	messagingSenderId: "650569021481",
	appId: "1:650569021481:web:9814df88522d7dad83c438",
	measurementId: "G-NTY8K2KDE1"
};

let app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };
