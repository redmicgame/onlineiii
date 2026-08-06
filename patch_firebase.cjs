const fs = require('fs');
let content = fs.readFileSync('firebase.ts', 'utf8');
content = content.replace(
  "import { getFirestore, doc, setDoc, getDoc, getDocs, collection, deleteDoc, serverTimestamp } from 'firebase/firestore';",
  "import { getFirestore, doc, setDoc, getDoc, getDocs, collection, deleteDoc, serverTimestamp, query, where, orderBy, limit } from 'firebase/firestore';"
);
fs.writeFileSync('firebase.ts', content);
