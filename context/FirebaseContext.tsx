import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { auth, loginWithGoogle, logout, loginWithEmail, registerWithEmail, getOrCreateGuestUser } from '../firebase';

interface FirebaseContextType {
    user: User | null;
    isLoading: boolean;
    loginWithGoogle: () => Promise<User | undefined>;
    loginWithEmail: (email: string, pass: string) => Promise<User>;
    registerWithEmail: (email: string, pass: string, name: string) => Promise<User>;
    logout: () => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType>({
    user: null,
    isLoading: true,
    loginWithGoogle: async () => undefined,
    loginWithEmail: async () => { throw new Error('Not initialized'); },
    registerWithEmail: async () => { throw new Error('Not initialized'); },
    logout: async () => {},
});

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setIsLoading(false);
            } else {
                // Auto guest session if auth provider is disabled
                signInAnonymously(auth)
                    .then(res => {
                        setUser(res.user);
                        setIsLoading(false);
                    })
                    .catch(() => {
                        setUser(getOrCreateGuestUser() as any);
                        setIsLoading(false);
                    });
            }
        });

        return () => unsubscribe();
    }, []);

    const handleGoogleLogin = async () => {
        const u = await loginWithGoogle();
        if (u) setUser(u);
        return u;
    };

    const handleEmailLogin = async (email: string, pass: string) => {
        const u = await loginWithEmail(email, pass);
        if (u) setUser(u);
        return u;
    };

    const handleEmailRegister = async (email: string, pass: string, name: string) => {
        const u = await registerWithEmail(email, pass, name);
        if (u) setUser(u);
        return u;
    };

    const handleLogout = async () => {
        await logout();
        setUser(getOrCreateGuestUser() as any);
    };

    return (
        <FirebaseContext.Provider value={{ 
            user: user || (getOrCreateGuestUser() as any), 
            isLoading, 
            loginWithGoogle: handleGoogleLogin, 
            loginWithEmail: handleEmailLogin, 
            registerWithEmail: handleEmailRegister, 
            logout: handleLogout 
        }}>
            {children}
        </FirebaseContext.Provider>
    );
};
