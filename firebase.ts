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

const timeoutPromise = <T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> => {
    return Promise.race([
        promise,
        new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms))
    ]);
};

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
        const result = await timeoutPromise(signInWithPopup(auth, googleProvider), 3000, null as any);
        if (result?.user) return result.user;
        return getOrCreateGuestUser() as any;
    } catch (error: any) {
        console.warn("Google Auth notice, using guest session:", error);
        return getOrCreateGuestUser() as any;
    }
};

export const registerWithEmail = async (email: string, pass: string, displayName: string) => {
    const guest = getOrCreateGuestUser();
    guest.displayName = displayName;
    guest.email = email;

    try {
        const authAttempt = async () => {
            const res = await createUserWithEmailAndPassword(auth, email, pass);
            if (res.user) {
                await updateProfile(res.user, { displayName }).catch(() => {});
                return res.user;
            }
            return guest as any;
        };
        return await timeoutPromise(authAttempt(), 2500, guest as any);
    } catch (error: any) {
        console.warn("Register notice, falling back to guest session:", error);
        return guest as any;
    }
};

export const loginWithEmail = async (email: string, pass: string) => {
    const guest = getOrCreateGuestUser();
    guest.email = email;

    try {
        const authAttempt = async () => {
            const res = await signInWithEmailAndPassword(auth, email, pass);
            return res.user;
        };
        return await timeoutPromise(authAttempt(), 2500, guest as any);
    } catch (error: any) {
        console.warn("Email auth notice, falling back to guest session:", error);
        return guest as any;
    }
};

const saveCache = (key: string, data: any) => {
    try {
        localStorage.setItem(`rm_cache_${key}`, JSON.stringify(data));
    } catch (e) {}
};

const getCache = <T>(key: string, fallback: T): T => {
    try {
        const item = localStorage.getItem(`rm_cache_${key}`);
        if (item) return JSON.parse(item) as T;
    } catch (e) {}
    return fallback;
};

export const isQuotaError = (err: any): boolean => {
    if (!err) return false;
    const msg = String(err.message || err.code || err.reason || err).toLowerCase();
    return (
        msg.includes('quota') ||
        msg.includes('resource-exhausted') ||
        msg.includes('free daily read units') ||
        msg.includes('quota limit exceeded') ||
        msg.includes('free tier database') ||
        err.code === 'resource-exhausted'
    );
};

let quotaExceededState = localStorage.getItem('rm_quota_exceeded') === 'true';
const quotaSubscribers = new Set<(isExceeded: boolean) => void>();

export const triggerQuotaExceeded = () => {
    if (!quotaExceededState) {
        quotaExceededState = true;
        try {
            localStorage.setItem('rm_quota_exceeded', 'true');
        } catch (e) {}
        quotaSubscribers.forEach(cb => cb(true));
    }
};

export const subscribeToQuotaExceeded = (callback: (isExceeded: boolean) => void) => {
    quotaSubscribers.add(callback);
    callback(quotaExceededState);
    return () => {
        quotaSubscribers.delete(callback);
    };
};

export const getQuotaExceededState = () => quotaExceededState;

export const checkQuotaError = (err: any) => {
    if (isQuotaError(err)) {
        triggerQuotaExceeded();
        return true;
    }
    return false;
};

if (typeof window !== 'undefined') {
    window.addEventListener('unhandledrejection', (event) => {
        if (event.reason && isQuotaError(event.reason)) {
            triggerQuotaExceeded();
        }
    });
    window.addEventListener('error', (event) => {
        if (event.error && isQuotaError(event.error)) {
            triggerQuotaExceeded();
        }
    });
}

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
    if (getQuotaExceededState()) return;
    try {
        const guest = getOrCreateGuestUser();
        const uidToUse = userId || auth.currentUser?.uid || guest.uid;
        if (!uidToUse || !profileData || !profileData.name) return;

        const playerObj = {
            id: uidToUse,
            userId: uidToUse,
            name: profileData.name,
            roles: profileData.roles || ['Musician', 'Producer'],
            country: profileData.country || 'US',
            fandomName: profileData.fandomName || '',
            avatar: profileData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name)}&background=random`,
            email: profileData.email || `${uidToUse}@redmic.online`,
            totalStreams: profileData.totalStreams || 0,
            isOnline: true
        };

        const cachedPlayers = getCache<any[]>('online_players', []);
        const idx = cachedPlayers.findIndex(p => p.id === uidToUse || p.userId === uidToUse);
        if (idx >= 0) {
            cachedPlayers[idx] = { ...cachedPlayers[idx], ...playerObj };
        } else {
            cachedPlayers.push(playerObj);
        }
        saveCache('online_players', cachedPlayers);

        const setTask = setDoc(doc(db, "online_players", uidToUse), {
            ...playerObj,
            createdAt: serverTimestamp(),
            lastOnlineAt: serverTimestamp()
        }, { merge: true });

        await timeoutPromise(setTask, 2000, null);
    } catch (err: any) {
        if (checkQuotaError(err)) return;
        console.warn("Warning registering online player (fallback cache used):", err?.message || err);
    }
};

export const subscribeToOnlinePlayers = (callback: (players: any[]) => void) => {
    const cached = getCache<any[]>('online_players', []);
    if (cached.length > 0) callback(cached);

    if (getQuotaExceededState()) return () => {};

    try {
        const q = query(collection(db, "online_players"), limit(100));
        return onSnapshot(q, (snap) => {
            const dbPlayers = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            saveCache('online_players', dbPlayers);
            callback(dbPlayers);
        }, (err) => {
            if (checkQuotaError(err)) return;
            console.warn("Online players subscription fallback (quota or offline):", err?.message || err);
            callback(getCache<any[]>('online_players', []));
        });
    } catch (err: any) {
        if (checkQuotaError(err)) return () => {};
        console.warn("Error setting listener for online players:", err?.message || err);
        callback(getCache<any[]>('online_players', []));
        return () => {};
    }
};

export const getOnlinePlayers = async () => {
    if (getQuotaExceededState()) return getCache<any[]>('online_players', []);
    try {
        const q = query(collection(db, "online_players"), limit(100));
        const snap = await getDocs(q);
        const players = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        if (players.length > 0) saveCache('online_players', players);
        return players;
    } catch (err: any) {
        if (checkQuotaError(err)) return getCache<any[]>('online_players', []);
        console.warn("Warning fetching online players:", err?.message || err);
        return getCache<any[]>('online_players', []);
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
    const msgId = crypto.randomUUID();
    const newMsgObj: ChatMessage = {
        id: msgId,
        senderId: msg.senderId,
        senderName: msg.senderName,
        senderAvatar: msg.senderAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.senderName)}&background=random`,
        recipientId: msg.recipientId,
        recipientName: msg.recipientName || 'Global Chat',
        message: msg.message,
        timestamp: Date.now()
    };

    const cachedMsgs = getCache<ChatMessage[]>('global_chats', []);
    cachedMsgs.push(newMsgObj);
    saveCache('global_chats', cachedMsgs);

    try {
        const msgRef = doc(collection(db, "global_chats"));
        await setDoc(msgRef, {
            ...newMsgObj,
            id: msgRef.id,
            createdAt: serverTimestamp()
        });
        return true;
    } catch (err: any) {
        console.warn("Warning sending chat message (saved locally):", err?.message || err);
        return true;
    }
};

export const subscribeToDirectMessages = (callback: (messages: ChatMessage[]) => void) => {
    const cached = getCache<ChatMessage[]>('global_chats', []);
    if (cached.length > 0) callback(cached);

    try {
        const q = query(collection(db, "global_chats"), orderBy("timestamp", "asc"), limit(200));
        return onSnapshot(q, (snap) => {
            const msgs = snap.docs.map(d => ({ id: d.id, ...d.data() } as ChatMessage));
            saveCache('global_chats', msgs);
            callback(msgs);
        }, (err) => {
            console.warn("Global chats subscription fallback (quota or offline):", err?.message || err);
            callback(getCache<ChatMessage[]>('global_chats', []));
        });
    } catch (err: any) {
        console.warn("Error setting chat listener:", err?.message || err);
        callback(getCache<ChatMessage[]>('global_chats', []));
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
    const idToUse = songData.songId || songData.id || `${songData.artistId}_${songData.title.replace(/[^a-zA-Z0-9]/g, '_')}`;
    const newSongObj = {
        id: idToUse,
        songId: idToUse,
        ...songData,
        isOnlinePlayer: songData.isOnlinePlayer ?? true,
        updatedAt: Date.now()
    };

    const cachedSongs = getCache<any[]>('global_songs', []);
    const existingIdx = cachedSongs.findIndex(s => s.id === idToUse || s.songId === idToUse);
    if (existingIdx >= 0) {
        cachedSongs[existingIdx] = { ...cachedSongs[existingIdx], ...newSongObj };
    } else {
        cachedSongs.unshift(newSongObj);
    }
    saveCache('global_songs', cachedSongs);

    try {
        const songRef = doc(db, "global_songs", idToUse);
        await setDoc(songRef, {
            ...newSongObj,
            updatedAt: serverTimestamp()
        }, { merge: true });
        return idToUse;
    } catch (err: any) {
        console.warn("Warning publishing global song (saved locally):", err?.message || err);
        return idToUse;
    }
};

export const getGlobalSongs = async (limitCount = 100) => {
    try {
        const q = query(collection(db, "global_songs"), orderBy("weeklyStreams", "desc"), limit(limitCount));
        const snap = await getDocs(q);
        const songs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        if (songs.length > 0) saveCache('global_songs', songs);
        return songs;
    } catch (err: any) {
        console.warn("Warning fetching global songs:", err?.message || err);
        return getCache<any[]>('global_songs', []);
    }
};

export const subscribeToGlobalSongs = (callback: (songs: any[]) => void) => {
    const cached = getCache<any[]>('global_songs', []);
    if (cached.length > 0) callback(cached);

    try {
        const q = query(collection(db, "global_songs"), orderBy("weeklyStreams", "desc"), limit(200));
        return onSnapshot(q, (snap) => {
            const songs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            saveCache('global_songs', songs);
            callback(songs);
        }, (err) => {
            console.warn("Global songs subscription fallback (quota or offline):", err?.message || err);
            callback(getCache<any[]>('global_songs', []));
        });
    } catch (err: any) {
        console.warn("Error setting listener for global songs:", err?.message || err);
        callback(getCache<any[]>('global_songs', []));
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
    const docId = postData.id || crypto.randomUUID();
    const newPostObj = {
        id: docId,
        ...postData,
        platform: postData.platform || 'X',
        likesCount: postData.likesCount || 0,
        repostsCount: postData.repostsCount || 0,
        isOnlinePlayer: postData.isOnlinePlayer ?? true,
        createdAt: Date.now()
    };

    const cachedPosts = getCache<any[]>('global_posts', []);
    cachedPosts.unshift(newPostObj);
    saveCache('global_posts', cachedPosts);

    try {
        const postRef = doc(db, "global_posts", docId);
        await setDoc(postRef, {
            ...newPostObj,
            createdAt: serverTimestamp()
        }, { merge: true });
        return docId;
    } catch (err: any) {
        console.warn("Warning publishing global post (saved locally):", err?.message || err);
        return docId;
    }
};

export const getGlobalPosts = async (limitCount = 50) => {
    try {
        const q = query(collection(db, "global_posts"), orderBy("createdAt", "desc"), limit(limitCount));
        const snap = await getDocs(q);
        const posts = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        if (posts.length > 0) saveCache('global_posts', posts);
        return posts;
    } catch (err: any) {
        console.warn("Warning fetching global posts:", err?.message || err);
        return getCache<any[]>('global_posts', []);
    }
};

export const subscribeToGlobalPosts = (callback: (posts: any[]) => void) => {
    const cached = getCache<any[]>('global_posts', []);
    if (cached.length > 0) callback(cached);

    try {
        const q = query(collection(db, "global_posts"), orderBy("createdAt", "desc"), limit(100));
        return onSnapshot(q, (snap) => {
            const posts = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            saveCache('global_posts', posts);
            callback(posts);
        }, (err) => {
            console.warn("Global posts subscription fallback (quota or offline):", err?.message || err);
            callback(getCache<any[]>('global_posts', []));
        });
    } catch (err: any) {
        console.warn("Error setting listener for global posts:", err?.message || err);
        callback(getCache<any[]>('global_posts', []));
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
    const defaultStatus: GlobalServerStatus = {
        year: 2026,
        week: 1,
        day: 1,
        tickCount: 1,
        lastTickTimestamp: Date.now()
    };
    const cached = getCache<GlobalServerStatus>('global_server', defaultStatus);
    callback(cached);

    try {
        return onSnapshot(SERVER_STATUS_DOC, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data() as GlobalServerStatus;
                saveCache('global_server', data);
                callback(data);
            } else {
                setDoc(SERVER_STATUS_DOC, defaultStatus, { merge: true }).catch(() => {});
                saveCache('global_server', defaultStatus);
                callback(defaultStatus);
            }
        }, (err) => {
            console.warn("Global server status subscription fallback (quota or offline):", err?.message || err);
            callback(getCache<GlobalServerStatus>('global_server', defaultStatus));
        });
    } catch (err: any) {
        console.warn("Global server status listener error:", err?.message || err);
        callback(getCache<GlobalServerStatus>('global_server', defaultStatus));
        return () => {};
    }
};

export const advanceGlobalServerTick = async () => {
    try {
        await runTransaction(db, async (transaction) => {
            const sfDoc = await transaction.get(SERVER_STATUS_DOC);
            let year = 2026;
            let week = 1;
            let day = 1;
            let tickCount = 1;

            if (sfDoc.exists()) {
                const data = sfDoc.data() as GlobalServerStatus;
                year = data.year || 2026;
                week = data.week || 1;
                day = data.day || 1;
                tickCount = (data.tickCount || 0) + 1;

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

            const newStatus = {
                year,
                week,
                day,
                tickCount,
                lastTickTimestamp: Date.now()
            };
            transaction.set(SERVER_STATUS_DOC, newStatus);
            saveCache('global_server', newStatus);
        });
    } catch (e: any) {
        console.warn("Warning advancing global tick:", e?.message || e);
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
