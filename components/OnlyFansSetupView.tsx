
import React, { useState } from 'react';
import { useGame, formatNumber } from '../context/GameContext';
import { OnlyFansProfile } from '../types';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

const OnlyFansSetupView: React.FC = () => {
    const { dispatch, activeArtist, activeArtistData } = useGame();
    
    if (!activeArtist || !activeArtistData) return null;

    const [displayName, setDisplayName] = useState(activeArtist.name);
    const [username, setUsername] = useState(activeArtist.name.replace(/\s/g, '').toLowerCase());
    const [bio, setBio] = useState('');
    const [price, setPrice] = useState(10.00);
    const [profilePicture, setProfilePicture] = useState(activeArtist.image);
    const [bannerPicture, setBannerPicture] = useState(activeArtistData.artistImages[0] || activeArtist.image);
    const [error, setError] = useState('');

    const handleSubmit = () => {
        setError('');
        if (!displayName.trim() || !username.trim()) {
            setError("Display Name and Username are required.");
            return;
        }

        if (price > 49.99) {
            setError("The monthly subscription price cannot be higher than $49.99.");
            return;
        }

        const newProfile: OnlyFansProfile = {
            displayName,
            username,
            bio,
            subscriptionPrice: price,
            profilePicture,
            bannerPicture,
            subscribers: 0,
            likes: 0,
            posts: [],
            totalGross: 0,
            totalNet: 0,
            earningsByMonth: {},
        };
        dispatch({ type: 'CREATE_ONLYFANS_PROFILE', payload: { profile: newProfile } });
    };

    return (
        <div className="h-full w-full bg-zinc-900 overflow-y-auto">
            <header className="p-4 flex items-center gap-4 sticky top-0 bg-zinc-900/80 backdrop-blur-sm z-10 border-b border-zinc-700/50">
                <button onClick={() => dispatch({type: 'CHANGE_VIEW', payload: 'game'})} className="p-2 rounded-full hover:bg-white/10">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold">Set Up OnlyFans Profile</h1>
            </header>
            <div className="p-4 space-y-6">
                <div>
                    <label htmlFor="displayName" className="block text-sm font-medium text-zinc-300">Display Name</label>
                    <input type="text" id="displayName" value={displayName} onChange={e => setDisplayName(e.target.value)} className="mt-1 block w-full bg-zinc-700 border-zinc-600 rounded-md shadow-sm h-10 px-3"/>
                </div>
                 <div>
                    <label htmlFor="username" className="block text-sm font-medium text-zinc-300">Username</label>
                    <input type="text" id="username" value={username} onChange={e => setUsername(e.target.value)} className="mt-1 block w-full bg-zinc-700 border-zinc-600 rounded-md shadow-sm h-10 px-3"/>
                </div>
                 <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-zinc-300">Bio</label>
                    <textarea id="bio" value={bio} onChange={e => setBio(e.target.value)} rows={3} className="mt-1 block w-full bg-zinc-700 border-zinc-600 rounded-md shadow-sm p-3"></textarea>
                </div>
                 <div>
                    <label htmlFor="price" className="block text-sm font-medium text-zinc-300">Monthly Subscription Price</label>
                    <input type="number" id="price" value={price} onChange={e => setPrice(parseFloat(e.target.value))} min="4.99" max="49.99" step="1" className="mt-1 block w-full bg-zinc-700 border-zinc-600 rounded-md shadow-sm h-10 px-3"/>
                    <p className="text-xs text-zinc-400 mt-1">Between $4.99 and $49.99. A lower price attracts more subscribers.</p>
                </div>
                {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                 <button onClick={handleSubmit} className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">
                    Create Profile
                </button>
            </div>
        </div>
    );
};

export default OnlyFansSetupView;
