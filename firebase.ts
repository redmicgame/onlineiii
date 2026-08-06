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
import { getFirestore, doc, setDoc, getDoc, getDocs, collection, deleteDoc, serverTimestamp, query, where, orderBy, limit, onSnapshot, runTransaction } from 'firebase/firestore';
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
    userId?: string | null, 
    profileData?: {
        name: string;
        roles?: string[];
        country?: string;
        fandomName?: string;
        avatar?: string;
        email?: string;
        totalStreams?: number;
    }
) => {
    try {
        const guest = getOrCreateGuestUser();
        const uidToUse = userId || auth.currentUser?.uid || guest.uid;
        if (!uidToUse || !profileData || !profileData.name) return;

        await setDoc(doc(db, "online_players", uidToUse), {
            userId: uidToUse,
            name: profileData.name,
            roles: profileData.roles || ['Musician', 'Producer'],
            country: profileData.country || 'US',
            fandomName: profileData.fandomName || '',
            avatar: profileData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name)}&background=random`,
            email: profileData.email || `${uidToUse}@redmic.online`,
            createdAt: serverTimestamp(),
            lastOnlineAt: serverTimestamp(),
            totalStreams: profileData.totalStreams || 0,
            isOnline: true
        }, { merge: true });
    } catch (err) {
        console.error("Failed to register online player:", err);
    }
};

export const subscribeToOnlinePlayers = (callback: (players: any[]) => void) => {
    try {
        const q = query(collection(db, "online_players"), limit(100));
        return onSnapshot(q, (snap) => {
            const players = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            callback(players);
        }, (err) => {
            console.error("Error subscribing to online players:", err);
        });
    } catch (err) {
        console.error("Error setting listener for online players:", err);
        return () => {};
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

export interface ChatMessage {
    id?: string;
    senderId: string;
    senderName: string;
    senderAvatar?: string;
    recipientId: string; // 'global' or player's userId/id
    recipientName?: string;
    message: string;
    createdAt?: any;
    timestamp?: number;
}

export const sendDirectMessage = async (msg: ChatMessage) => {
    try {
        const msgRef = doc(collection(db, "global_chats"));
        await setDoc(msgRef, {
            id: msgRef.id,
            senderId: msg.senderId,
            senderName: msg.senderName,
            senderAvatar: msg.senderAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.senderName)}&background=random`,
            recipientId: msg.recipientId,
            recipientName: msg.recipientName || 'Global Chat',
            message: msg.message,
            timestamp: Date.now(),
            createdAt: serverTimestamp()
        });
        return true;
    } catch (err) {
        console.error("Error sending chat message:", err);
        return false;
    }
};

export const subscribeToDirectMessages = (callback: (messages: ChatMessage[]) => void) => {
    try {
        const q = query(collection(db, "global_chats"), orderBy("timestamp", "asc"), limit(200));
        return onSnapshot(q, (snap) => {
            const msgs = snap.docs.map(d => ({ id: d.id, ...d.data() } as ChatMessage));
            callback(msgs);
        }, (err) => {
            console.error("Error subscribing to global chats:", err);
        });
    } catch (err) {
        console.error("Error setting chat listener:", err);
        return () => {};
    }
};

export const getServerDataStats = async () => {
    const collectionsToCheck = [
        "online_players",
        "global_songs",
        "global_posts",
        "global_contracts",
        "global_media",
        "global_labels",
        "global_server",
        "global_chats"
    ];
    let totalDocs = 0;
    const details: Record<string, number> = {};

    for (const colName of collectionsToCheck) {
        try {
            const snap = await getDocs(collection(db, colName));
            details[colName] = snap.docs.length;
            totalDocs += snap.docs.length;
        } catch (err) {
            console.error(`Error counting ${colName}:`, err);
            details[colName] = 0;
        }
    }

    const maxRecommendedDocs = 10000;
    const isAlmostFull = totalDocs > 8000;
    const capacityPercentage = Math.min(100, Math.round((totalDocs / maxRecommendedDocs) * 100));

    return {
        totalDocs,
        details,
        isAlmostFull,
        capacityPercentage
    };
};

export const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error signing out:", error);
    }
};





export const publishGlobalSong = async (songData: {
    id?: string;
    songId?: string;
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
    isOnlinePlayer?: boolean;
    type?: string;
    albumTitle?: string;
}) => {
    try {
        const idToUse = songData.songId || songData.id || `${songData.artistId}_${songData.title.replace(/[^a-zA-Z0-9]/g, '_')}`;
        const songRef = doc(db, "global_songs", idToUse);
        await setDoc(songRef, {
            id: idToUse,
            songId: idToUse,
            ...songData,
            isOnlinePlayer: songData.isOnlinePlayer ?? true,
            updatedAt: serverTimestamp()
        }, { merge: true });
        return idToUse;
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

export const subscribeToGlobalSongs = (callback: (songs: any[]) => void) => {
    try {
        const q = query(collection(db, "global_songs"), orderBy("weeklyStreams", "desc"), limit(200));
        return onSnapshot(q, (snap) => {
            const songs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            callback(songs);
        }, (err) => {
            console.error("Error subscribing to global songs:", err);
        });
    } catch (err) {
        console.error("Error setting listener for global songs:", err);
        return () => {};
    }
};

export const publishGlobalPost = async (postData: {
    id?: string;
    authorId: string;
    authorName: string;
    authorHandle: string;
    authorAvatar?: string;
    platform?: 'X' | 'Instagram' | 'PopBase' | 'TMZ';
    content: string;
    likesCount?: number;
    repostsCount?: number;
    mediaUrl?: string;
    isOnlinePlayer?: boolean;
}) => {
    try {
        const docId = postData.id || crypto.randomUUID();
        const postRef = doc(db, "global_posts", docId);
        await setDoc(postRef, {
            id: docId,
            ...postData,
            platform: postData.platform || 'X',
            likesCount: postData.likesCount || 0,
            repostsCount: postData.repostsCount || 0,
            isOnlinePlayer: postData.isOnlinePlayer ?? true,
            createdAt: serverTimestamp()
        }, { merge: true });
        return docId;
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

export const subscribeToGlobalPosts = (callback: (posts: any[]) => void) => {
    try {
        const q = query(collection(db, "global_posts"), orderBy("createdAt", "desc"), limit(100));
        return onSnapshot(q, (snap) => {
            const posts = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            callback(posts);
        }, (err) => {
            console.error("Error subscribing to global posts:", err);
        });
    } catch (err) {
        console.error("Error setting listener for global posts:", err);
        return () => {};
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

export interface GlobalServerStatus {
    year: number;
    week: number;
    day: number;
    tickCount: number;
    lastTickTimestamp: number;
}

const SERVER_STATUS_DOC = doc(db, "global_server", "status");

export const subscribeToGlobalServerStatus = (callback: (status: GlobalServerStatus) => void) => {
    return onSnapshot(SERVER_STATUS_DOC, (docSnap) => {
        if (docSnap.exists()) {
            callback(docSnap.data() as GlobalServerStatus);
        } else {
            const initialStatus: GlobalServerStatus = {
                year: 2026,
                week: 1,
                day: 1,
                tickCount: 1,
                lastTickTimestamp: Date.now()
            };
            setDoc(SERVER_STATUS_DOC, initialStatus, { merge: true }).catch(err => console.error("Error initializing global server status:", err));
            callback(initialStatus);
        }
    }, (err) => console.error("Global server status snapshot error:", err));
};

export const advanceGlobalServerTick = async () => {
    try {
        await runTransaction(db, async (transaction) => {
            const sfDoc = await transaction.get(SERVER_STATUS_DOC);
            let year = 2026;
            let week = 1;
            let day = 1;
            let tickCount = 1;
            let lastTick = Date.now();

            if (sfDoc.exists()) {
                const data = sfDoc.data() as GlobalServerStatus;
                year = data.year || 2026;
                week = data.week || 1;
                day = data.day || 1;
                tickCount = (data.tickCount || 0) + 1;
                lastTick = data.lastTickTimestamp || Date.now();

                day++;
                if (day > 7) {
                    day = 1;
                    week++;
                    if (week > 52) {
                        week = 1;
                        year++;
                    }
                }
            }

            transaction.set(SERVER_STATUS_DOC, {
                year,
                week,
                day,
                tickCount,
                lastTickTimestamp: Date.now()
            });
        });
    } catch (e) {
        console.error("Error advancing global tick:", e);
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
        "global_server",
        "global_chats",
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
