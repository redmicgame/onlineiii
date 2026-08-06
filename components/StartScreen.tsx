import React, { useState, useRef, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { useFirebase } from '../context/FirebaseContext';
import { registerOnlinePlayer } from '../firebase';
import type { Artist } from '../types';

type AuthTab = 'signup' | 'login';

import { getGlobalGameTime } from '../utils/globalClock';

export const StartScreen: React.FC = () => {
    const { dispatch } = useGame();
    const { loginWithGoogle, loginWithEmail, registerWithEmail } = useFirebase();
    
    // Auth & Form State
    const [authTab, setAuthTab] = useState<AuthTab>('signup');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

    // Profile State
    const [soloName, setSoloName] = useState('');
    const [soloAge, setSoloAge] = useState(18);
    const [soloCountry, setSoloCountry] = useState<string>('US');
    const [soloImage, setSoloImage] = useState<string | null>(null);
    const [soloFandomName, setSoloFandomName] = useState('');
    const [soloPronouns, setSoloPronouns] = useState<'he/him' | 'she/her' | 'they/them'>('they/them');
    const [selectedRoles, setSelectedRoles] = useState<string[]>(['musician']);

    const [globalClock, setGlobalClock] = useState<{ year: number; week: number; nextTickInSeconds: number } | null>(null);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchClock = () => {
            const data = getGlobalGameTime();
            setGlobalClock(data);
        };
        fetchClock();
        const interval = setInterval(fetchClock, 1000);
        return () => clearInterval(interval);
    }, []);

    const toggleRole = (role: string) => {
        if (selectedRoles.includes(role)) {
            if (selectedRoles.length === 1) return; // Keep at least 1 role
            setSelectedRoles(selectedRoles.filter(r => r !== role));
        } else {
            setSelectedRoles([...selectedRoles, role]);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setSoloImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAuthAction = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmittingAuth(true);

        try {
            if (authTab === 'login') {
                if (!email || !password) {
                    setError('Please enter your email and password.');
                    setIsSubmittingAuth(false);
                    return;
                }
                const loggedUser = await loginWithEmail(email, password);
                if (loggedUser) {
                    const name = loggedUser.displayName || email.split('@')[0];
                    const newArtist: Artist = {
                        id: loggedUser.uid,
                        name,
                        age: 20,
                        country: 'US',
                        image: loggedUser.photoURL || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80',
                        pronouns: 'they/them',
                        fandomName: `${name}'s Fanbase`
                    };
                    await registerOnlinePlayer(loggedUser.uid, {
                        name,
                        roles: selectedRoles,
                        country: 'US',
                        email: loggedUser.email || email
                    });
                    const currentClock = getGlobalGameTime();
                    dispatch({ type: 'START_SOLO_GAME', payload: { artist: newArtist, startYear: currentClock.year, startWeek: currentClock.week, difficultyMode: 'normal' } });
                }
            } else {
                // SIGN UP
                if (!soloName.trim()) {
                    setError('Artist/Player Name is required.');
                    setIsSubmittingAuth(false);
                    return;
                }
                if (!email || !password) {
                    setError('Please provide an email and password.');
                    setIsSubmittingAuth(false);
                    return;
                }
                if (password.length < 6) {
                    setError('Password must be at least 6 characters.');
                    setIsSubmittingAuth(false);
                    return;
                }

                const registeredUser = await registerWithEmail(email, password, soloName.trim());
                const defaultImg = soloImage || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80';

                const newArtist: Artist = {
                    id: registeredUser.uid,
                    name: soloName.trim(),
                    age: soloAge,
                    country: soloCountry,
                    image: defaultImg,
                    pronouns: soloPronouns,
                    fandomName: soloFandomName.trim() || `${soloName.trim()} Stans`
                };

                await registerOnlinePlayer(registeredUser.uid, {
                    name: soloName.trim(),
                    roles: selectedRoles,
                    country: soloCountry,
                    fandomName: soloFandomName.trim(),
                    avatar: defaultImg,
                    email
                });

                const currentClock = getGlobalGameTime();
                dispatch({ type: 'START_SOLO_GAME', payload: { artist: newArtist, startYear: currentClock.year, startWeek: currentClock.week, difficultyMode: 'normal' } });
            }
        } catch (err: any) {
            console.error("Auth error:", err);
            setError(err.message || 'Authentication failed. Please check your credentials.');
        } finally {
            setIsSubmittingAuth(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError('');
        setIsSubmittingAuth(true);
        try {
            const gUser = await loginWithGoogle();
            if (gUser) {
                const name = soloName.trim() || gUser.displayName || 'Online Artist';
                const defaultImg = soloImage || gUser.photoURL || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80';
                
                const newArtist: Artist = {
                    id: gUser.uid,
                    name,
                    age: soloAge || 20,
                    country: soloCountry,
                    image: defaultImg,
                    pronouns: soloPronouns,
                    fandomName: soloFandomName.trim() || `${name} Stans`
                };

                await registerOnlinePlayer(gUser.uid, {
                    name,
                    roles: selectedRoles,
                    country: soloCountry,
                    fandomName: soloFandomName.trim(),
                    avatar: defaultImg,
                    email: gUser.email || undefined
                });

                const currentClock = getGlobalGameTime();
                dispatch({ type: 'START_SOLO_GAME', payload: { artist: newArtist, startYear: currentClock.year, startWeek: currentClock.week, difficultyMode: 'normal' } });
            }
        } catch (err: any) {
            console.error("Google login failed:", err);
            setError('Google sign-in failed. Please try again.');
        } finally {
            setIsSubmittingAuth(false);
        }
    };

    return (
        <div className="min-h-[100dvh] bg-zinc-950 text-white flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden border border-zinc-800">
                
                {/* Header Title & Clock Status */}
                <div className="p-6 bg-gradient-to-b from-zinc-800/80 to-zinc-900 border-b border-zinc-800 text-center">
                    <h1 className="text-4xl font-black text-red-500 tracking-tighter uppercase mb-1">
                        Red Mic: Online
                    </h1>
                    <p className="text-xs text-zinc-400 font-medium">Massive Online Simulator • No NPCs • Real Player World</p>

                    <div className="mt-4 bg-zinc-950/80 p-3 rounded-2xl border border-red-500/30 flex items-center justify-between px-4">
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                            <span className="text-xs font-black text-zinc-200 tracking-wider uppercase">
                                Global Time: {globalClock ? `Year ${globalClock.year}, Wk ${globalClock.week}` : 'Year 2018, Wk 1'}
                            </span>
                        </div>
                        <span className="text-[11px] font-mono text-amber-400 font-bold bg-amber-950/50 px-2.5 py-1 rounded-full border border-amber-500/20">
                            {globalClock ? `${Math.floor(globalClock.nextTickInSeconds / 60)}m ${globalClock.nextTickInSeconds % 60}s to tick` : '15m per week'}
                        </span>
                    </div>
                </div>

                {/* Auth Tabs */}
                <div className="flex bg-zinc-900 border-b border-zinc-800">
                    <button
                        type="button"
                        onClick={() => setAuthTab('signup')}
                        className={`flex-1 py-3.5 font-bold text-xs uppercase tracking-wider transition-all ${
                            authTab === 'signup' 
                                ? 'bg-red-600 text-white' 
                                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                        }`}
                    >
                        Create Online Account
                    </button>
                    <button
                        type="button"
                        onClick={() => setAuthTab('login')}
                        className={`flex-1 py-3.5 font-bold text-xs uppercase tracking-wider transition-all ${
                            authTab === 'login' 
                                ? 'bg-red-600 text-white' 
                                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                        }`}
                    >
                        Sign In Existing
                    </button>
                </div>

                <div className="p-6">
                    {error && (
                        <div className="mb-4 bg-red-950/80 border border-red-500 text-red-200 text-xs font-semibold p-3 rounded-xl flex items-center justify-between">
                            <span>{error}</span>
                            <button onClick={() => setError('')} className="text-red-400 font-bold ml-2">✕</button>
                        </div>
                    )}

                    {/* Google OAuth Quick Button */}
                    <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={isSubmittingAuth}
                        className="w-full bg-white text-zinc-900 hover:bg-zinc-100 font-bold text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-all shadow-md mb-5"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                        </svg>
                        <span>Continue with Google</span>
                    </button>

                    <div className="relative flex py-2 items-center mb-5">
                        <div className="flex-grow border-t border-zinc-800"></div>
                        <span className="flex-shrink mx-3 text-zinc-500 text-xs font-bold uppercase">Or Use Email</span>
                        <div className="flex-grow border-t border-zinc-800"></div>
                    </div>

                    <form onSubmit={handleAuthAction} className="space-y-4">
                        {authTab === 'signup' && (
                            <>
                                {/* Player / Stage Name */}
                                <div>
                                    <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">
                                        Stage / Account Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={soloName}
                                        onChange={e => setSoloName(e.target.value)}
                                        placeholder="e.g. Travis Scott, Metro Boomin..."
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
                                        required
                                    />
                                </div>

                                {/* Multi-Role Ecosystem Selection */}
                                <div>
                                    <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                                        Select Player Career Roles
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            { id: 'musician', label: '🎤 Musician', desc: 'Songs & Tours' },
                                            { id: 'producer', label: '🎧 Producer', desc: 'Beats & Mixing' },
                                            { id: 'label_head', label: '💼 Label Head', desc: 'Sign Talent' },
                                            { id: 'media', label: '📰 Media/Press', desc: 'News & Reviews' },
                                        ].map(role => {
                                            const isSelected = selectedRoles.includes(role.id);
                                            return (
                                                <button
                                                    type="button"
                                                    key={role.id}
                                                    onClick={() => toggleRole(role.id)}
                                                    className={`p-2.5 rounded-xl border text-left transition-all ${
                                                        isSelected
                                                            ? 'bg-red-950/60 border-red-500 text-white shadow-sm'
                                                            : 'bg-zinc-800/50 border-zinc-700/60 text-zinc-400 hover:border-zinc-600'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-bold text-white">{role.label}</span>
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            readOnly
                                                            className="rounded border-zinc-600 text-red-600 focus:ring-red-500 h-3.5 w-3.5"
                                                        />
                                                    </div>
                                                    <span className="text-[10px] text-zinc-400 block mt-0.5">{role.desc}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Profile Customizations */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">Country</label>
                                        <select
                                            value={soloCountry}
                                            onChange={e => setSoloCountry(e.target.value)}
                                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"
                                        >
                                            <option value="US">🇺🇸 United States</option>
                                            <option value="UK">🇬🇧 United Kingdom</option>
                                            <option value="CA">🇨🇦 Canada</option>
                                            <option value="NG">🇳🇬 Nigeria</option>
                                            <option value="KR">🇰🇷 South Korea</option>
                                            <option value="JP">🇯🇵 Japan</option>
                                            <option value="BR">🇧🇷 Brazil</option>
                                            <option value="FR">🇫🇷 France</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">Fandom Name</label>
                                        <input
                                            type="text"
                                            value={soloFandomName}
                                            onChange={e => setSoloFandomName(e.target.value)}
                                            placeholder="e.g. Swifties, Barbz"
                                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white"
                                        />
                                    </div>
                                </div>

                                {/* Avatar Upload */}
                                <div>
                                    <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">Profile Photo</label>
                                    <div className="flex items-center gap-3">
                                        {soloImage ? (
                                            <img src={soloImage} alt="Avatar" className="w-12 h-12 rounded-xl object-cover border border-red-500" />
                                        ) : (
                                            <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-500 text-xs font-bold">
                                                No Pic
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Email & Password */}
                        <div>
                            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="yourname@example.com"
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmittingAuth}
                            className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all shadow-red-600/30 flex items-center justify-center gap-2 mt-4"
                        >
                            {isSubmittingAuth ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : authTab === 'signup' ? (
                                '🚀 Join Online Simulator World'
                            ) : (
                                '🔑 Sign In & Connect'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StartScreen;
