import { NPC_ARTIST_IMAGES } from "../constants";

import React, { useState, useEffect, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import SpotifyIcon from './icons/SpotifyIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';
import { ChartEntry, AlbumChartEntry, GameDate } from '../types';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import PlusIcon from './icons/PlusIcon';
import ArrowUpTrayIcon from './icons/ArrowUpTrayIcon';
import DotsHorizontalIcon from './icons/DotsHorizontalIcon';

const formatGameDateToMonthDay = (gameDate: { week: number; year: number }) => {
    const date = new Date(gameDate.year, 0, (gameDate.week - 1) * 7 + 1);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(2).replace(/\.00$/, '') + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    return num.toString();
};

const SpotifyChartView: React.FC = () => {
    const { gameState, dispatch, allPlayerArtists } = useGame();
    const { spotifyGlobal = [], billboardTopAlbums, chartHistory, albumChartHistory, date } = gameState;
    const [activeSlide, setActiveSlide] = useState(0);

    const upcomingCountdowns = useMemo(() => {
        const countdowns: { id: string, title: string, artistName: string, coverArt: string, releaseDate: GameDate, preSaves: number, isExplicit: boolean }[] = [];

        // Player countdowns
        if (gameState.artistsData) {
            Object.entries(gameState.artistsData).forEach(([artistId, data]) => {
                if (data.labelSubmissions) {
                    data.labelSubmissions.forEach(sub => {
                        if (sub.status === 'scheduled' && sub.hasCountdownPage && sub.projectReleaseDate) {
                            const artistProfile = allPlayerArtists.find(a => a.id === artistId);
                            
                            // Compute pre-saves
                            let totalSongStreams = 0;
                            let isExplicit = false;
                            
                            if (sub.release && sub.release.songIds) {
                               sub.release.songIds.forEach(id => {
                                   const song = data.songs.find(s => s.id === id);
                                   if (song && song.isReleased) totalSongStreams += song.streams;
                                   if (song && song.explicit) isExplicit = true;
                               });
                            } else {
                               const song = data.songs.find(s => s.id === sub.itemId);
                               if (song && song.isReleased) totalSongStreams += song.streams;
                               if (song && song.explicit) isExplicit = true;
                            }

                            const popularity = data.popularity || 0;
                            const weeksSinceSubmit = Math.max(0, (gameState.date.year * 52 + gameState.date.week) - (sub.submittedDate.year * 52 + sub.submittedDate.week));
                            const basePreSaves = ((popularity * 15000) + (totalSongStreams * 0.05)) * (1 + (weeksSinceSubmit * 0.25));
                            
                            countdowns.push({
                                id: sub.itemId,
                                title: sub.release?.title || sub.itemName,
                                artistName: artistProfile?.name || 'Unknown',
                                coverArt: sub.release?.coverArt || 'https://ui-avatars.com/api/?name=Unknown',
                                releaseDate: sub.projectReleaseDate,
                                preSaves: basePreSaves,
                                isExplicit,
                            });
                        }
                    });
                }
            });
        }

        // Add some fake NPC countdowns if we don't have enough
        const fakeNpcCountdowns = 10 - countdowns.length;
        if (fakeNpcCountdowns > 0 && gameState.npcAlbums) {
            const upcomingNpcs = gameState.npcAlbums.slice(0, fakeNpcCountdowns);
            upcomingNpcs.forEach((album, index) => {
                const w = (gameState.date.week + 1 + index) % 52 || 52;
                const y = gameState.date.year + (gameState.date.week + 1 + index > 52 ? 1 : 0);
                const releaseDate = { year: y, week: w };
                const albumSongs = album.songIds.map(id => gameState.npcs.find(s => s.uniqueId === id)).filter(Boolean);
                const avgPop = albumSongs.length > 0 ? albumSongs.reduce((sum, s) => sum + (s?.basePopularity || 0), 0) / albumSongs.length : 500000;
                
                countdowns.push({
                    id: `fake_${album.uniqueId}`,
                    title: album.title,
                    artistName: album.artist,
                    coverArt: album.coverArt || `https://ui-avatars.com/api/?name=${encodeURIComponent(album.artist)}`,
                    releaseDate: releaseDate,
                    preSaves: (avgPop * 0.05) * (1 - (index * 0.05)), 
                    isExplicit: Math.random() > 0.5
                });
            });
        }

        return countdowns.sort((a, b) => b.preSaves - a.preSaves).slice(0, 10);
    }, [gameState.artistsData, gameState.npcAlbums, allPlayerArtists, gameState.date]);

    const slides = useMemo(() => {
        const facts = [];

        // Fact 1: Longest Charting Album
        const longestAlbum = Object.entries(albumChartHistory).reduce((longest, [id, history]) => {
            if (!longest || history.weeksOnChart > longest.history.weeksOnChart) {
                const album = billboardTopAlbums.find(a => a.uniqueId === id) || gameState.npcAlbums.find(a => a.uniqueId === id);
                if (album) return { album, history };
            }
            return longest;
        }, null as { album: AlbumChartEntry | { artist: string, title: string, coverArt: string }, history: any } | null);
        
        if (longestAlbum) {
            facts.push({
                bgColor: 'bg-emerald-800',
                text: `“${longestAlbum.album.title}” by ${longestAlbum.album.artist} has been on Top Albums Global the longest, at ${longestAlbum.history.weeksOnChart} weeks straight.`,
                image: longestAlbum.album.coverArt,
                subText: `Top Albums Global · ${date.year}`
            });
        }
        
        // Fact 2: Highest New Song Entry
        const highestNewEntry = spotifyGlobal.find((s: ChartEntry) => s.lastWeek === null && s.weeksOnChart === 1);
        if (highestNewEntry) {
            facts.push({
                bgColor: 'bg-rose-800',
                text: `“${highestNewEntry.title}” by ${highestNewEntry.artist} is the highest new entry on Top Songs Global at #${highestNewEntry.rank}.`,
                image: highestNewEntry.coverArt,
                subText: `Top Songs Global · Week of ${date.week}`
            });
        }

        // Fact 3: Generic fact if others fail
        if (facts.length === 0 && spotifyGlobal.length > 0) {
            const topArtist = spotifyGlobal[0].artist;
            facts.push({
                bgColor: 'bg-indigo-800',
                text: `${topArtist} is dominating the charts this week.`,
                image: spotifyGlobal[0].coverArt,
                subText: `Top Artists Global · Week of ${date.week}`
            });
        }
        
        return facts;
    }, [spotifyGlobal, billboardTopAlbums, albumChartHistory, date, gameState.npcAlbums]);

    useEffect(() => {
        if (slides.length <= 1) return;
        const interval = setInterval(() => {
            setActiveSlide(prev => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [slides.length]);

    const topSong: ChartEntry | undefined = spotifyGlobal[0];
    const topAlbum: AlbumChartEntry | undefined = billboardTopAlbums[0];

    return (
        <div className="bg-[#121212] h-full text-white overflow-y-auto pb-24 relative">
            <header className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <button onClick={() => dispatch({ type: 'CHANGE_VIEW', payload: 'game' })} className="p-1 -ml-1 rounded-full hover:bg-white/10" aria-label="Go back">
                        <ChevronLeftIcon className="w-6 h-6" />
                    </button>
                    <SpotifyIcon className="w-7 h-7" />
                    <h1 className="text-2xl font-bold">Charts</h1>
                </div>
                <button className="flex items-center gap-1 border border-zinc-600 rounded-full px-3 py-1 text-sm font-semibold">
                    Global <ChevronDownIcon className="w-4 h-4" />
                </button>
            </header>

            <main className="p-4 space-y-4">
                {/* Hero Section */}
                {slides.length > 0 && (
                     <div className={`relative w-full h-56 rounded-lg p-4 flex justify-between items-end ${slides[activeSlide]?.bgColor || 'bg-zinc-800'}`}>
                        <div className="w-2/3">
                            <p className="text-2xl font-bold leading-tight">{slides[activeSlide].text}</p>
                            <p className="text-sm opacity-80 mt-2">{slides[activeSlide].subText}</p>
                        </div>
                        <img src={slides[activeSlide].image} alt="Chart highlight" className="w-32 h-32 rounded-lg object-cover shadow-lg" />
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                            {slides.map((_, index) => (
                                <button key={index} onClick={() => setActiveSlide(index)} className={`h-1.5 rounded-full transition-all ${activeSlide === index ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`} />
                            ))}
                        </div>
                    </div>
                )}
                
                {/* Top 10 Countdowns (Upcoming Releases) */}
                {upcomingCountdowns.length > 0 && (
                    <div className="pt-4 pb-2 border-b border-zinc-800">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Top 10 countdowns</h2>
                            <button className="text-zinc-400 hover:text-white">
                                <ArrowUpTrayIcon className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="flex gap-4 overflow-x-auto pb-4 snap-x no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                            <style>{`
                                .no-scrollbar::-webkit-scrollbar {
                                    display: none;
                                }
                            `}</style>
                            {upcomingCountdowns.map((release) => (
                                <div key={release.id} className="min-w-[160px] max-w-[160px] snap-start flex-shrink-0 flex flex-col cursor-pointer hover:opacity-90 transition-opacity group">
                                    <div className="relative mb-3">
                                        <img src={release.coverArt} alt={release.title} className="w-40 h-40 object-cover rounded-md shadow-md bg-zinc-800" />
                                        {release.isExplicit && (
                                            <div className="absolute top-2 right-2 bg-zinc-800 rounded flex items-center justify-center w-4 h-4 shadow-sm">
                                                <span className="text-[10px] font-bold text-white leading-none">E</span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-xs text-zinc-400 mb-1">Releases on {formatGameDateToMonthDay(release.releaseDate)}</p>
                                    <p className="text-sm font-bold text-white truncate">{release.title}</p>
                                    <p className="text-sm text-zinc-400 truncate">{release.artistName}</p>
                                    <p className="text-xs text-zinc-500 mt-1">{formatNumber(release.preSaves)} pre-saves</p>
                                    
                                    <div className="flex items-center gap-4 mt-3 text-zinc-400 opacity-60 group-hover:opacity-100 transition-opacity">
                                        <button className="hover:text-white transition-colors" aria-label="Pre-save">
                                            <PlusIcon className="w-5 h-5" />
                                        </button>
                                        <button className="hover:text-white transition-colors" aria-label="Share">
                                            <ArrowUpTrayIcon className="w-4 h-4" />
                                        </button>
                                        <button className="hover:text-white transition-colors ml-auto" aria-label="More options">
                                            <DotsHorizontalIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Chart Links */}
                <button onClick={() => dispatch({type: 'CHANGE_VIEW', payload: 'spotifyVideoChart'})} className="w-full bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 p-4 rounded-lg text-left text-black shadow-lg">
                    <p className="font-bold text-lg text-white">Music Video Charts Global</p>
                    <p className="text-white/80">Top 30 Global</p>
                    <div className="mt-4 flex items-center gap-3">
                        <div className="w-16 h-16 bg-black rounded-md flex items-center justify-center text-white font-bold text-xs">
                            Daily Music<br/>Charts
                        </div>
                        <div className="text-white">
                            <p className="font-bold text-sm">UPDATED DAILY</p>
                            <p className="text-sm opacity-80">Check out the most watched videos</p>
                        </div>
                    </div>
                </button>

                {topSong && (
                    <button onClick={() => dispatch({type: 'CHANGE_VIEW', payload: 'spotifyTopSongs'})} className="w-full bg-[#a03fec] p-4 rounded-lg text-left">
                        <p className="font-bold text-lg">Weekly Top Songs</p>
                        <p>Global & Regional</p>
                        <div className="mt-4 flex items-center gap-3">
                            <img src={topSong.coverArt} className="w-16 h-16 rounded-md" />
                            <div>
                                <p className="font-bold text-sm">#1 THIS WEEK</p>
                                <p className="text-lg">{topSong.title}</p>
                                <p className="text-sm opacity-80">{topSong.artist}</p>
                            </div>
                        </div>
                    </button>
                )}

                 {topAlbum && (
                    <button onClick={() => dispatch({type: 'CHANGE_VIEW', payload: 'spotifyTopAlbums'})} className="w-full bg-emerald-800 p-4 rounded-lg text-left">
                        <p className="font-bold text-lg">Weekly Top Albums</p>
                        <p>Global</p>
                        <div className="mt-4 flex items-center gap-3">
                            <img src={topAlbum.coverArt} className="w-16 h-16 rounded-md" />
                            <div>
                                <p className="font-bold text-sm">#1 THIS WEEK</p>
                                <p className="text-lg">{topAlbum.title}</p>
                                <p className="text-sm opacity-80">{topAlbum.artist}</p>
                            </div>
                        </div>
                    </button>
                )}
                {date.year >= 2016 && gameState.ukSinglesChart && gameState.ukSinglesChart.length > 0 && (
                    <button onClick={() => dispatch({type: 'CHANGE_VIEW', payload: 'ukChart'})} className="w-full bg-blue-700 p-4 rounded-lg text-left mt-4 border border-blue-600">
                        <p className="font-bold text-lg">Official Singles Chart</p>
                        <p>United Kingdom</p>
                        <div className="mt-4 flex items-center gap-3">
                            <img src={gameState.ukSinglesChart[0].coverArt} className="w-16 h-16 rounded-md" />
                            <div>
                                <p className="font-bold text-sm text-pink-300">#1 THIS WEEK</p>
                                <p className="text-lg">{gameState.ukSinglesChart[0].title}</p>
                                <p className="text-sm opacity-80">{gameState.ukSinglesChart[0].artist}</p>
                            </div>
                        </div>
                    </button>
                )}
            </main>
        </div>
    );
};

export default SpotifyChartView;