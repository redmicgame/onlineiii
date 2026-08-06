import React, { useState, useEffect } from 'react';
import { useGame, formatNumber } from '../context/GameContext';
import { useFirebase } from '../context/FirebaseContext';
import { getLeaderboard, uploadLeaderboardStats } from '../firebase';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import TrophyIcon from './icons/TrophyIcon';
import { db, injectMediaIntoState } from '../db/db';

const CATEGORIES = [
    { id: 'mostStreamedSong', label: 'Most Streamed Song' },
    { id: 'bestSellingAlbum', label: 'Best Selling Album' },
    { id: 'mostGrammys', label: 'Most GRAMMYs' },
    { id: 'mostIgFollowers', label: 'Most IG Followers' }
];

const MODES = ['easy', 'normal', 'hard', 'extreme'];

const LiveLeaderboardView: React.FC = () => {
    const { gameState, dispatch } = useGame();
    const { user, login } = useFirebase();

    const [activeMode, setActiveMode] = useState('normal');
    const [activeCategory, setActiveCategory] = useState('mostStreamedSong');
    
    const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    
    const [syncing, setSyncing] = useState(false);
    const [syncingImages, setSyncingImages] = useState(false);
    const [syncProgress, setSyncProgress] = useState(0);

    const fetchLeaderboard = async () => {
        setLoading(true);
        const data = await getLeaderboard(activeMode, activeCategory);
        setLeaderboardData(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchLeaderboard();
    }, [activeMode, activeCategory]);


    const handleSyncImages = async () => {
        if (!user) return;
        setSyncingImages(true);
        setSyncProgress(0);

        try {
            const allSaves = await db.saves.toArray();
            const bestStats: Record<string, any> = {};

            for (let i = 0; i < allSaves.length; i++) {
                const save = allSaves[i];
                if (!save || !save.state) continue;
                
                let stateToAnalyze = save.state;
                // Force inject media to get the actual cover arts instead of UUIDs
                stateToAnalyze = await injectMediaIntoState(save.state);
                
                const mode = stateToAnalyze.difficultyMode || 'normal';
                
                let maxSongStreams = 0;
                let maxSongData: any = null;
                
                let maxAlbumSales = 0;
                let maxAlbumData: any = null;
                
                let maxGrammys = 0;
                let maxGrammyArtist = "";
                let maxGrammyImage = "";
                
                let maxFollowers = 0;
                let maxFollowerArtist = "";
                let maxFollowerImage = "";

                Object.keys(stateToAnalyze.artistsData || {}).forEach(artistId => {
                    const data = stateToAnalyze.artistsData[artistId];
                    if (!data) return;

                    const artistName = stateToAnalyze.soloArtist?.name || stateToAnalyze.group?.name || "Artist";
                    const artistImage = stateToAnalyze.soloArtist?.avatar || stateToAnalyze.group?.avatar || "";
                    
                    if (data.songs) {
                        data.songs.forEach((song: any) => {
                            if ((song.streams || 0) > maxSongStreams) {
                                maxSongStreams = song.streams;
                                maxSongData = { songName: song.title, cover: song.coverArt, artistName };
                            }
                        });
                    }
                    if (data.releases) {
                        data.releases.forEach((rel: any) => {
                            if (rel.type === 'Album' && (rel.sales || 0) > maxAlbumSales) {
                                maxAlbumSales = rel.sales;
                                maxAlbumData = { albumName: rel.title, cover: rel.coverArt, artistName };
                            }
                        });
                    }
                    if (data.grammyHistory && data.grammyHistory.length > maxGrammys) {
                        maxGrammys = data.grammyHistory.length;
                        maxGrammyArtist = artistName;
                        maxGrammyImage = artistImage;
                    }
                    if (data.instagramFollowers && data.instagramFollowers > maxFollowers) {
                        maxFollowers = data.instagramFollowers;
                        maxFollowerArtist = artistName;
                        maxFollowerImage = artistImage;
                    }
                });

                if (maxSongData && maxSongStreams > (bestStats[`${mode}_mostStreamedSong`]?.score || 0)) {
                    bestStats[`${mode}_mostStreamedSong`] = { score: maxSongStreams, ...maxSongData };
                }
                if (maxAlbumData && maxAlbumSales > (bestStats[`${mode}_bestSellingAlbum`]?.score || 0)) {
                    bestStats[`${mode}_bestSellingAlbum`] = { score: maxAlbumSales, ...maxAlbumData };
                }
                if (maxGrammys > (bestStats[`${mode}_mostGrammys`]?.score || 0)) {
                    bestStats[`${mode}_mostGrammys`] = { score: maxGrammys, artistName: maxGrammyArtist, cover: maxGrammyImage, itemName: "" };
                }
                if (maxFollowers > (bestStats[`${mode}_mostIgFollowers`]?.score || 0)) {
                    bestStats[`${mode}_mostIgFollowers`] = { score: maxFollowers, artistName: maxFollowerArtist, cover: maxFollowerImage, itemName: "" };
                }
                
                setSyncProgress(Math.floor(((i + 1) / allSaves.length) * 100));
            }

            for (const key of Object.keys(bestStats)) {
                const [mode, category] = key.split('_');
                const stat = bestStats[key];
                await uploadLeaderboardStats(
                    user.uid,
                    mode,
                    category,
                    stat.score,
                    stat.artistName,
                    stat.songName || stat.albumName || stat.itemName || "",
                    stat.cover || ""
                );
            }

            fetchLeaderboard();
        } catch (e) {
            console.error("Sync error", e);
            alert("Error syncing saves. They may be corrupted.");
        } finally {
            setSyncingImages(false);
            setSyncProgress(0);
        }
    };

    const handleSync = async () => {
        if (!user) return;
        setSyncing(true);
        setSyncProgress(0);

        try {
            const allSaves = await db.saves.toArray();
            
            const bestStats: Record<string, any> = {};

            for (let i = 0; i < allSaves.length; i++) {
                const save = allSaves[i];
                if (!save || !save.state) continue;
                
                let stateToAnalyze = save.state;

                // Simple check for media string references to skip inject overhead for simple stats if we don't care about image precision 
                // But we need the image. So let's inject.
                stateToAnalyze = await injectMediaIntoState(save.state);
                
                const mode = stateToAnalyze.difficultyMode || 'normal';
                
                let maxSongStreams = 0;
                let maxSongData: any = null;
                
                let maxAlbumSales = 0;
                let maxAlbumData: any = null;
                
                let maxGrammys = 0;
                let maxGrammyArtist = "";
                let maxGrammyImage = "";
                
                let maxFollowers = 0;
                let maxFollowerArtist = "";
                let maxFollowerImage = "";

                Object.keys(stateToAnalyze.artistsData || {}).forEach(artistId => {
                    const data = stateToAnalyze.artistsData[artistId];
                    if (!data) return;

                    const artistName = stateToAnalyze.soloArtist?.name || stateToAnalyze.group?.name || "Artist";
                    const artistImage = stateToAnalyze.soloArtist?.avatar || stateToAnalyze.group?.avatar || "";
                    
                    if (data.songs) {
                        data.songs.forEach((song: any) => {
                            if ((song.streams || 0) > maxSongStreams) {
                                maxSongStreams = song.streams;
                                maxSongData = { songName: song.title, cover: song.coverArt, artistName };
                            }
                        });
                    }
                    if (data.releases) {
                        data.releases.forEach((rel: any) => {
                            if (rel.type === 'Album' && (rel.sales || 0) > maxAlbumSales) {
                                maxAlbumSales = rel.sales;
                                maxAlbumData = { albumName: rel.title, cover: rel.coverArt, artistName };
                            }
                        });
                    }
                    if (data.grammyHistory && data.grammyHistory.length > maxGrammys) {
                        maxGrammys = data.grammyHistory.length;
                        maxGrammyArtist = artistName;
                        maxGrammyImage = artistImage;
                    }
                    if (data.instagramFollowers && data.instagramFollowers > maxFollowers) {
                        maxFollowers = data.instagramFollowers;
                        maxFollowerArtist = artistName;
                        maxFollowerImage = artistImage;
                    }
                });

                if (maxSongData && maxSongStreams > (bestStats[`${mode}_mostStreamedSong`]?.score || 0)) {
                    bestStats[`${mode}_mostStreamedSong`] = { score: maxSongStreams, ...maxSongData };
                }
                if (maxAlbumData && maxAlbumSales > (bestStats[`${mode}_bestSellingAlbum`]?.score || 0)) {
                    bestStats[`${mode}_bestSellingAlbum`] = { score: maxAlbumSales, ...maxAlbumData };
                }
                if (maxGrammys > (bestStats[`${mode}_mostGrammys`]?.score || 0)) {
                    bestStats[`${mode}_mostGrammys`] = { score: maxGrammys, artistName: maxGrammyArtist, cover: maxGrammyImage, itemName: "" };
                }
                if (maxFollowers > (bestStats[`${mode}_mostIgFollowers`]?.score || 0)) {
                    bestStats[`${mode}_mostIgFollowers`] = { score: maxFollowers, artistName: maxFollowerArtist, cover: maxFollowerImage, itemName: "" };
                }

                setSyncProgress(Math.floor(((i + 1) / allSaves.length) * 100));
            }

            // Upload best stats
            for (const key of Object.keys(bestStats)) {
                const [mode, category] = key.split('_');
                const stat = bestStats[key];
                await uploadLeaderboardStats(
                    user.uid,
                    mode,
                    category,
                    stat.score,
                    stat.artistName,
                    stat.songName || stat.albumName || stat.itemName || "",
                    stat.cover || ""
                );
            }

            fetchLeaderboard();
        } catch (e) {
            console.error("Sync error", e);
            alert("Error syncing saves. They may be corrupted.");
        } finally {
            setSyncing(false);
            setSyncProgress(0);
        }
    };

    return (
        <div className="flex flex-col h-full bg-zinc-950 text-white">
            <div className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => dispatch({ type: 'CHANGE_VIEW', payload: 'game' })}
                        className="p-2 -ml-2 rounded-full hover:bg-zinc-800 transition-colors"
                    >
                        <ChevronLeftIcon className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-bold flex items-center gap-2">
                        <TrophyIcon className="w-5 h-5 text-yellow-500" /> Live Leaderboard
                    </h1>
                </div>
            </div>

            <div className="p-4 overflow-y-auto pb-24">
                    <div className="mb-6">
                        <div className="flex gap-2 p-1 bg-zinc-900 rounded-lg mb-4 overflow-x-auto no-scrollbar">
                            {MODES.map(mode => (
                                <button
                                    key={mode}
                                    onClick={() => setActiveMode(mode)}
                                    className={`flex-1 min-w-[80px] py-2 px-3 rounded-md text-sm font-bold capitalize transition-colors ${
                                        activeMode === mode ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                                    }`}
                                >
                                    {mode}
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-2 p-1 bg-zinc-900 rounded-lg overflow-x-auto no-scrollbar">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`flex-shrink-0 py-2 px-4 rounded-md text-sm font-bold transition-colors ${
                                        activeCategory === cat.id ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                                    }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-bold text-lg">Top Players</h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={!user ? undefined : handleSyncImages}
                                    disabled={!user || syncing || syncingImages}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold ${!user ? 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed' : syncingImages ? 'bg-pink-900/50 text-pink-400' : 'bg-pink-600 hover:bg-pink-500 text-white'} transition-colors`}
                                    title={!user ? "Sign in via Settings to sync saves" : ""}
                                >
                                    {syncingImages ? `Syncing... ${syncProgress}%` : 'Sync Saves Images'}
                                </button>
                                <button
                                    onClick={!user ? undefined : handleSync}
                                    disabled={!user || syncing || syncingImages}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold ${!user ? 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed' : syncing ? 'bg-zinc-700 text-zinc-400' : 'bg-green-600 hover:bg-green-500 text-white'} transition-colors`}
                                    title={!user ? "Sign in via Settings to sync saves" : ""}
                                >
                                    {!user ? 'Sign in to Sync' : syncing ? `Syncing... ${syncProgress}%` : 'Sync My Saves'}
                                </button>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex justify-center p-8">
                                <div className="w-8 h-8 border-4 border-zinc-700 border-t-red-500 rounded-full animate-spin"></div>
                            </div>
                        ) : leaderboardData.length === 0 ? (
                            <div className="text-center p-8 text-zinc-500">
                                No entries found for this category and mode yet. Sync your saves to be the first!
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {leaderboardData.map((entry, idx) => (
                                    <div key={entry.id} className="flex items-center p-3 rounded-lg bg-zinc-800 hover:bg-zinc-700/50 transition-colors">
                                        <div className="w-8 text-center font-bold text-zinc-500 text-sm">
                                            #{idx + 1}
                                        </div>
                                        {entry.imageUrl && (
                                            <img 
                                                src={entry.imageUrl} 
                                                alt="" 
                                                className={`w-12 h-12 object-cover ${activeCategory.includes('Song') || activeCategory.includes('Album') ? 'rounded-md' : 'rounded-full'} mx-3`}
                                                onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(entry.artistName) }}
                                            />
                                        )}
                                        <div className="flex-grow min-w-0">
                                            <p className="font-bold text-white truncate text-sm sm:text-base">
                                                {entry.itemName || entry.artistName}
                                            </p>
                                            {entry.itemName && (
                                                <p className="text-xs sm:text-sm text-zinc-400 truncate">
                                                    {entry.artistName}
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-red-500 text-sm sm:text-base">
                                                {formatNumber(entry.score)}
                                            </p>
                                            <p className="text-[10px] sm:text-xs text-zinc-500">
                                                {activeCategory.includes('Stream') ? 'Streams' : activeCategory.includes('Sell') ? 'Sales' : activeCategory.includes('Grammy') ? 'GRAMMYs' : 'Followers'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
        </div>
    );
};

export default LiveLeaderboardView;
