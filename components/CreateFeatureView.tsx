import React, { useState } from 'react';
import { useGame, formatNumber } from '../context/GameContext';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import { GameDate } from '../types';

const CreateFeatureView: React.FC = () => {
    const { gameState, dispatch } = useGame();
    const { activeFeatureOffer, date: currentDate } = gameState;

    const [songTitle, setSongTitle] = useState('');
    const [coverArt, setCoverArt] = useState<string | null>(null);
    const [releaseDate, setReleaseDate] = useState<GameDate>(() => {
        const nextWeek = currentDate.week + 1;
        if (nextWeek > 52) {
            return { week: 1, year: currentDate.year + 1 };
        }
        return { week: nextWeek, year: currentDate.year };
    });
    const [error, setError] = useState('');

    if (!activeFeatureOffer) {
        dispatch({ type: 'CHANGE_VIEW', payload: 'inbox' });
        return null;
    }

    const { npcArtistName, payout, songQuality, promotion } = activeFeatureOffer;

    const handleCoverArtUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverArt(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDateChange = (part: 'week' | 'year', value: number) => {
        setReleaseDate(prev => ({ ...prev, [part]: value }));
    };

    const handleConfirm = () => {
        setError('');
        if (!songTitle.trim() || !coverArt) {
            setError('Song title and cover art are required.');
            return;
        }

        const toTotalWeeks = (d: GameDate) => d.year * 52 + d.week;
        if (toTotalWeeks(releaseDate) <= toTotalWeeks(currentDate)) {
            setError('Release date must be in the future.');
            return;
        }

        dispatch({ type: 'CREATE_FEATURE_SONG', payload: { songTitle: songTitle.trim(), coverArt, releaseDate } });
    };

    const handleCancel = () => {
        dispatch({ type: 'CANCEL_FEATURE_OFFER' });
    };

    return (
        <div className="h-full w-full bg-zinc-900 flex flex-col">
            <header className="p-4 flex items-center gap-4 sticky top-0 bg-zinc-900/80 backdrop-blur-sm z-10 border-b border-zinc-700/50">
                <button onClick={handleCancel} className="p-2 rounded-full hover:bg-white/10">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold truncate">Feature with {npcArtistName}</h1>
            </header>
            <main className="flex-grow p-4 space-y-6 overflow-y-auto">
                <div className="flex justify-center">
                    <label htmlFor="cover-art" className="cursor-pointer">
                        <div className="w-48 h-48 rounded-lg bg-zinc-800 border-2 border-dashed border-zinc-600 flex items-center justify-center hover:border-red-500 transition-colors">
                            {coverArt ? (
                                <img src={coverArt} alt="Cover Art" className="w-full h-full rounded-lg object-cover" />
                            ) : (
                                <span className="text-zinc-400 text-sm text-center">Upload Cover Art</span>
                            )}
                        </div>
                    </label>
                    <input id="cover-art" type="file" accept="image/*" className="hidden" onChange={handleCoverArtUpload} />
                </div>
                <div>
                    <label htmlFor="song-title" className="block text-sm font-medium text-zinc-300">Song Title</label>
                    <input type="text" id="song-title" value={songTitle} onChange={e => setSongTitle(e.target.value)} className="mt-1 block w-full bg-zinc-700 border-zinc-600 rounded-md shadow-sm h-10 px-3"/>
                </div>

                <div>
                    <label htmlFor="release-date" className="block text-sm font-medium text-zinc-300">Release Date</label>
                    <div className="mt-1 flex items-center gap-2">
                        <label className="text-sm text-zinc-400">W:</label>
                        <input 
                            type="number" 
                            value={releaseDate.week || ''} 
                            onChange={e => handleDateChange('week', parseInt(e.target.value) || 0)} 
                            min="1" max="52" 
                            className="w-20 bg-zinc-700 p-2 rounded-md text-center" 
                        />
                        <label className="text-sm text-zinc-400">Y:</label>
                        <input 
                            type="number" 
                            value={releaseDate.year || ''} 
                            onChange={e => handleDateChange('year', parseInt(e.target.value) || 0)} 
                            min={currentDate.year} 
                            className="w-24 bg-zinc-700 p-2 rounded-md text-center" 
                        />
                    </div>
                </div>

                <div className="bg-zinc-800 p-4 rounded-lg space-y-2">
                    <h3 className="font-bold text-lg">Offer Details</h3>
                    <div className="flex justify-between text-sm"><span className="text-zinc-400">Payout:</span> <span className="font-semibold text-green-400">${formatNumber(payout)}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-zinc-400">Est. Quality:</span> <span className="font-semibold">{songQuality}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-zinc-400">Promotion:</span> <span className="font-semibold">{promotion ? `${promotion.name} (${promotion.durationWeeks} wks)` : 'None'}</span></div>
                </div>
                 {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            </main>
             <div className="p-4 border-t border-zinc-700/50">
                <button onClick={handleConfirm} className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">
                    Confirm Feature
                </button>
            </div>
        </div>
    );
};

export default CreateFeatureView;