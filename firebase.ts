/// <reference types="vite/client" />
import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup, 
    signInAnonymously,
    signOut, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    updateProfile,
    onAuthStateChanged 
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, getDocs, collection, deleteDoc, serverTimestamp, query, where, orderBy, limit } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json';
import type { GameState } from './types';

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
export const googleProvider = new GoogleAuthProvider();

export const getOrCreateGuestUser = () => {
    let guestId = localStorage.getItem('redmic_online_uid');
    if (!guestId) {
        guestId = 'player_' + Math.random().toString(36).substring(2, 10);
        localStorage.setItem('redmic_online_uid', guestId);
    }
    return {
        uid: guestId,
        displayName: 'Online Player',
        email: `${guestId}@redmic.online`,
        isGuest: true
    };
};

export const loginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        return result.user;
    } catch (error: any) {
        console.warn("Google Auth notice, using guest session:", error);
        try {
            const anon = await signInAnonymously(auth);
            return anon.user;
        } catch (anonErr) {
            return getOrCreateGuestUser() as any;
        }
    }
};

export const registerWithEmail = async (email: string, pass: string, displayName: string) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, pass);
        if (res.user) {
            await updateProfile(res.user, { displayName });
        }
        return res.user;
    } catch (error: any) {
        console.warn("Register notice, falling back to guest session:", error);
        const guest = getOrCreateGuestUser();
        guest.displayName = displayName;
        guest.email = email;
        return guest as any;
    }
};

export const loginWithEmail = async (email: string, pass: string) => {
    try {
        const res = await signInWithEmailAndPassword(auth, email, pass);
        return res.user;
    } catch (error: any) {
        console.warn("Email auth notice, falling back to guest session:", error);
        return getOrCreateGuestUser() as any;
    }
};

export const registerOnlinePlayer = async (
    userId: string, 
    profileData: {
        name: string;
        roles: string[];
        country: string;
        fandomName?: string;
        avatar?: string;
        email?: string;
    }
) => {
    try {
        await setDoc(doc(db, "online_players", userId), {
            userId,
            ...profileData,
            createdAt: serverTimestamp(),
            lastOnlineAt: serverTimestamp(),
            totalStreams: 0,
            chartPoints: 0,
            isOnline: true
        }, { merge: true });
    } catch (err) {
        console.error("Failed to register online player:", err);
    }
};

export const getOnlinePlayers = async () => {
    try {
        const q = query(collection(db, "online_players"), limit(100));
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (err) {
        console.error("Error fetching online players:", err);
        return [];
    }
};

export const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error signing out:", error);
    }
};





export const publishGlobalSong = async (songData: {
    title: string;
    artistName: string;
    artistId: string;
    producerName?: string;
    coverUrl?: string;
    genre: string;
    streams: number;
    weeklyStreams: number;
    releaseYear: number;
    releaseWeek: number;
}) => {
    try {
        const songRef = doc(collection(db, "global_songs"));
        await setDoc(songRef, {
            id: songRef.id,
            ...songData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return songRef.id;
    } catch (err) {
        console.error("Error publishing global song:", err);
    }
};

export const getGlobalSongs = async (limitCount = 100) => {
    try {
        const q = query(collection(db, "global_songs"), orderBy("weeklyStreams", "desc"), limit(limitCount));
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (err) {
        console.error("Error fetching global songs:", err);
        return [];
    }
};

export const publishGlobalPost = async (postData: {
    authorId: string;
    authorName: string;
    authorHandle: string;
    authorAvatar?: string;
    platform: 'X' | 'Instagram' | 'PopBase' | 'TMZ';
    content: string;
    likesCount?: number;
    repostsCount?: number;
    mediaUrl?: string;
}) => {
    try {
        const postRef = doc(collection(db, "global_posts"));
        await setDoc(postRef, {
            id: postRef.id,
            ...postData,
            likesCount: postData.likesCount || 0,
            repostsCount: postData.repostsCount || 0,
            createdAt: serverTimestamp()
        });
        return postRef.id;
    } catch (err) {
        console.error("Error publishing global post:", err);
    }
};

export const getGlobalPosts = async (limitCount = 50) => {
    try {
        const q = query(collection(db, "global_posts"), orderBy("createdAt", "desc"), limit(limitCount));
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (err) {
        console.error("Error fetching global posts:", err);
        return [];
    }
};

export const createContractOffer = async (offer: {
    fromUserId: string;
    fromName: string;
    fromRole: string;
    toUserId: string;
    toName: string;
    type: 'Label Deal' | 'Beat License' | 'Feature Request' | 'Promo Campaign';
    advanceAmount: number;
    royaltySplit: number;
    details: string;
}) => {
    try {
        const contractRef = doc(collection(db, "global_contracts"));
        await setDoc(contractRef, {
            id: contractRef.id,
            ...offer,
            status: 'pending',
            createdAt: serverTimestamp()
        });
        return contractRef.id;
    } catch (err) {
        console.error("Error creating contract offer:", err);
    }
};

export const getContractOffers = async (userId: string) => {
    try {
        const q = query(
            collection(db, "global_contracts"),
            where("toUserId", "==", userId)
        );
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (err) {
        console.error("Error fetching contract offers:", err);
        return [];
    }
};

export const updateContractOffer = async (contractId: string, status: 'accepted' | 'declined') => {
    try {
        await setDoc(doc(db, "global_contracts", contractId), {
            status,
            updatedAt: serverTimestamp()
        }, { merge: true });
    } catch (err) {
        console.error("Error updating contract offer:", err);
    }
};

export const publishMediaArticle = async (article: {
    authorId: string;
    authorName: string;
    publicationName: string;
    headline: string;
    body: string;
    targetPlayerName?: string;
    rating?: number;
    coverUrl?: string;
}) => {
    try {
        const articleRef = doc(collection(db, "global_media"));
        await setDoc(articleRef, {
            id: articleRef.id,
            ...article,
            createdAt: serverTimestamp()
        });
        return articleRef.id;
    } catch (err) {
        console.error("Error publishing media article:", err);
    }
};

export const getMediaArticles = async (limitCount = 30) => {
    try {
        const q = query(collection(db, "global_media"), orderBy("createdAt", "desc"), limit(limitCount));
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (err) {
        console.error("Error fetching media articles:", err);
        return [];
    }
};

export const claimOnlineLabel = async (labelData: {
    labelId: string;
    labelName: string;
    ownerUserId: string;
    ownerArtistName: string;
    logoUrl?: string;
    cost?: number;
}) => {
    try {
        const labelRef = doc(db, "global_labels", labelData.labelId);
        await setDoc(labelRef, {
            id: labelData.labelId,
            name: labelData.labelName,
            ownerUserId: labelData.ownerUserId,
            ownerArtistName: labelData.ownerArtistName,
            logoUrl: labelData.logoUrl || '',
            rosterCount: 1,
            claimedAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        }, { merge: true });
        return true;
    } catch (err) {
        console.error("Error claiming online label:", err);
        return false;
    }
};

export const getOnlineLabels = async () => {
    try {
        const snap = await getDocs(collection(db, "global_labels"));
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (err) {
        console.error("Error fetching online labels:", err);
        return [];
    }
};

export const uploadLeaderboardStats = async (
    userId: string,
    mode: string,
    category: string,
    score: number,
    artistName: string,
    itemName: string,
    imageUrl: string
) => {
    try {
        await setDoc(doc(db, `leaderboards_${mode}_${category}`, userId), {
            userId,
            score,
            artistName,
            itemName,
            imageUrl: imageUrl.length > 2000 ? "https://ui-avatars.com/api/?name=" + encodeURIComponent(artistName) + "&background=random" : imageUrl,
            updatedAt: serverTimestamp()
        }, { merge: true });
    } catch (error) {
        console.error("Error uploading leaderboard stat:", error);
    }
};

export const getLeaderboard = async (mode: string, category: string) => {
    try {
        const q = query(
            collection(db, `leaderboards_${mode}_${category}`),
            orderBy("score", "desc"),
            limit(50)
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return [];
    }
};

export const resetAllGameAccountsAndData = async () => {
    const collectionsToClear = [
        "online_players",
        "global_songs",
        "global_posts",
        "global_contracts",
        "global_media",
        "global_labels",
        "users",
        "saves"
    ];
    for (const colName of collectionsToClear) {
        try {
            const snap = await getDocs(collection(db, colName));
            for (const docSnap of snap.docs) {
                await deleteDoc(doc(db, colName, docSnap.id));
            }
        } catch (err) {
            console.error(`Error resetting collection ${colName}:`, err);
        }
    }
    localStorage.clear();
};
