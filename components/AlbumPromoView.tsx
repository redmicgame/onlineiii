


import React, { useMemo, useState } from 'react';
import { useGame, formatNumber } from '../context/GameContext';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import SpotifyIcon from './icons/SpotifyIcon';
import GeniusIcon from './icons/GeniusIcon';
import TonightShowIcon from './icons/TonightShowIcon';
import { Song, Video } from '../types';

const AlbumPromoView: React.FC = () => {
    const { gameState, dispatch, activeArtist, activeArtistData } = useGame();
    const { activeSubmissionId, date } = gameState;
    const { labelSubmissions, songs } = activeArtistData!;

    const [selectedSongId, setSelectedSongId] = useState<string | null>(null);

    const submission = useMemo(() => {
        return labelSubmissions.find(s => s.id === activeSubmissionId);
    }, [labelSubmissions, activeSubmissionId]);

    const projectSongs = useMemo(() => {
        if (!submission) return [];
        return submission.release.songIds.map(id => songs.find(s => s.id === id)).filter((s): s is Song => !!s);
    }, [submission, songs]);

    const handleAction = (actionType: 'countdown' | 'genius' | 'fallon' | 'magazine' | 'tv_interview') => {
        if (!submission) return;

        switch (actionType) {
            case 'countdown':
                if (activeArtistData.monthlyListeners >= 10000) {
                    dispatch({ type: 'LAUNCH_COUNTDOWN_PAGE', payload: { submissionId: submission.id, cost: 0 } });
                }
                break;
            case 'genius':
                if (selectedSongId && submission.promoBudgetSpent! + 150000 <= submission.promoBudget!) {
                    dispatch({ type: 'REQUEST_GENIUS_PROMO', payload: { submissionId: submission.id, songId: selectedSongId, cost: 150000 } });
                    setSelectedSongId(null);
                }
                break;
            case 'fallon':
                 if (selectedSongId && submission.promoBudgetSpent! + 500000 <= submission.promoBudget!) {
                    dispatch({ type: 'REQUEST_FALLON_PROMO', payload: { submissionId: submission.id, songId: selectedSongId, cost: 500000 } });
                    setSelectedSongId(null);
                }
                break;
        }
    };
    
    if (!submission || !activeArtist) {
        return <div className="p-4">Could not load promotion page.</div>;
    }
    
    const budget = submission.promoBudget || 0;
    const spent = submission.promoBudgetSpent || 0;
    const budgetPercentage = (spent / budget) * 100;

    return (
        <div className="h-full w-full bg-zinc-900 overflow-y-auto">
            <header className="p-4 flex items-center gap-4 sticky top-0 bg-zinc-900/80 backdrop-blur-sm z-10 border-b border-zinc-700/50">
                <button onClick={() => dispatch({type: 'CHANGE_VIEW', payload: 'game'})} className="p-2 rounded-full hover:bg-white/10">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold truncate">Promo: {submission.release.title}</h1>
            </header>
            <main className="p-4 space-y-6">
                <div>
                    <div className="flex justify-between items-baseline mb-1">
                        <h2 className="text-xl font-bold">Promo Budget</h2>
                        <span className="font-semibold text-zinc-300">
                            <span className="text-green-400">${formatNumber(budget - spent)}</span> / ${formatNumber(budget)}
                        </span>
                    </div>
                     <div className="w-full bg-zinc-700 rounded-full h-4 overflow-hidden">
                        <div 
                            className="bg-gradient-to-r from-green-500 to-emerald-400 h-4 rounded-full transition-all duration-500 ease-out" 
                            style={{ width: `${budgetPercentage}%` }}
                        ></div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-bold">Actions</h2>
                     {/* Spotify Countdown */}
                     <div className={`p-4 rounded-lg border-2 ${submission.hasCountdownPage ? 'border-green-500 bg-green-900/30' : 'border-zinc-700 bg-zinc-800'}`}>
                        <div className="flex items-center gap-3">
                            <SpotifyIcon className="w-10 h-10 flex-shrink-0" />
                            <div>
                                <h3 className="font-bold text-lg">Launch Spotify Countdown</h3>
                                <p className="text-sm text-zinc-400">Create a pre-save page with a live countdown. Needs 10K+ monthly listeners.</p>
                            </div>
                        </div>
                         <button 
                            onClick={() => handleAction('countdown')}
                            disabled={submission.hasCountdownPage || activeArtistData.monthlyListeners < 10000}
                            className="mt-3 w-full h-10 bg-green-500 text-black font-bold rounded-lg text-sm disabled:bg-zinc-600 disabled:text-zinc-400"
                        >
                            {submission.hasCountdownPage ? 'Launched' : (activeArtistData.monthlyListeners < 10000 ? 'Requires 10K Listeners' : 'Launch (Free)')}
                        </button>
                    </div>


                    {/* Dynamic Promos */}
                    {[
                        ...(date.year >= 2009 ? ['genius'] : []),
                        ...(date.year >= 2014 ? ['fallon'] : (date.year >= 1968 ? ['tv_interview'] : [])),
                        'magazine'
                    ].map(type => {
                        const isGenius = type === 'genius';
                        const isMagazine = type === 'magazine';
                        const isFallon = type === 'fallon';
                        const isTv = type === 'tv_interview';
                        
                        let cost = 50000;
                        let title = "Magazine Interview";
                        let desc = "An in-depth feature discussing your new music.";
                        let requestedSongId = submission.magazineInterviewRequestedForSongId;
                        let icon = <span className="font-serif font-black text-2xl px-2 italic">M</span>;
                        let actionType = 'magazine';
                        let colorClass = 'bg-amber-100 text-amber-900 border-amber-500';
                        
                        if (isGenius) {
                            cost = 150000;
                            title = "Genius 'Verified'";
                            desc = "An official lyric breakdown video.";
                            requestedSongId = submission.geniusInterviewRequestedForSongId;
                            icon = <GeniusIcon className="w-10 h-10 text-yellow-300 flex-shrink-0" />;
                            actionType = 'genius';
                            colorClass = 'bg-yellow-300 text-black border-yellow-500';
                        } else if (isFallon) {
                            cost = 500000;
                            title = "Fallon Performance";
                            desc = "A high-profile live TV performance.";
                            requestedSongId = submission.fallonPerformanceRequestedForSongId;
                            icon = <TonightShowIcon className="w-10 h-10 flex-shrink-0" />;
                            actionType = 'fallon';
                            colorClass = 'bg-blue-500 text-white border-blue-500';
                        } else if (isTv) {
                            cost = 300000;
                            title = "60 Minutes Interview";
                            desc = "A prime-time investigative journalism interview.";
                            requestedSongId = submission.tvInterviewRequestedForSongId;
                            icon = <span className="font-sans font-black text-xl px-1">60</span>;
                            actionType = 'tv_interview';
                            colorClass = 'bg-red-600 text-white border-red-600';
                        }

                        return (
                            <div key={type} className={`p-4 rounded-lg border-2 ${requestedSongId ? 'border-green-500 bg-green-900/30' : 'border-zinc-700 bg-zinc-800'}`}>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-12 h-12 flex items-center justify-center bg-zinc-900 rounded-lg">
                                        {icon}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{title}</h3>
                                        <p className="text-sm text-zinc-400">{desc}</p>
                                    </div>
                                </div>
                                {!requestedSongId ? (
                                    <div className="space-y-2">
                                        <select
                                            onChange={(e) => setSelectedSongId(e.target.value)}
                                            defaultValue=""
                                            className="w-full bg-zinc-700 p-2 rounded-md text-sm"
                                        >
                                            <option value="" disabled>Select a song to feature...</option>
                                            {projectSongs.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                                        </select>
                                        <button
                                            onClick={() => handleAction(actionType as any)}
                                            disabled={!selectedSongId || budget - spent < cost}
                                            className={`w-full h-10 font-bold rounded-lg text-sm ${colorClass} disabled:bg-zinc-600 disabled:text-zinc-400 disabled:border-transparent`}
                                        >
                                            Request (-${formatNumber(cost)})
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-center text-green-300 font-semibold p-2 bg-green-900/50 rounded-md">
                                        {title} for "{songs.find(s => s.id === requestedSongId)?.title}" requested.
                                    </p>
                                )}
                            </div>
                        )
                    })}

                </div>
            </main>
        </div>
    );
};
export default AlbumPromoView;