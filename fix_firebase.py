import re
with open('firebase.ts', 'r') as f:
    content = f.read()

replacement = '''
const activeConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseConfig.apiKey,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfig.authDomain,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseConfig.projectId,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfig.storageBucket,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfig.messagingSenderId,
    appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseConfig.appId,
    firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID || firebaseConfig.firestoreDatabaseId,
};

const app = initializeApp(activeConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, activeConfig.firestoreDatabaseId);
'''

# We need to replace these three lines:
# const app = initializeApp(firebaseConfig);
# export const auth = getAuth(app);
# export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

pattern = r'const app = initializeApp\(firebaseConfig\);\s*export const auth = getAuth\(app\);\s*export const db = getFirestore\(app, firebaseConfig\.firestoreDatabaseId\);'
content = re.sub(pattern, replacement.strip(), content)

with open('firebase.ts', 'w') as f:
    f.write(content)
