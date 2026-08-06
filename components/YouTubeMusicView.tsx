import React, { useState, useMemo } from 'react';
import { useGame, formatNumber } from '../context/GameContext';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import TrianglePlayIcon from './icons/TrianglePlayIcon';
import HomeIcon from './icons/HomeIcon';
import SearchIcon from './icons/SearchIcon';
import UserGroupIcon from './icons/UserGroupIcon';
import MusicNoteIcon from './icons/MusicNoteIcon';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import DotsVerticalIcon from './icons/DotsVerticalIcon';

const YouTubeMusicView: React.FC = () => {
    const { gameState, dispatch, activeArtistData, activeArtist } = useGame();
    const [currentTab, setCurrentTab] = useState<'home' | 'explore' | 'profile'>('home');
    const [selectedReleaseId, setSelectedReleaseId] = useState<string | null>(null);

    if (!activeArtistData || !activeArtist) return null;

    const songs = activeArtistData.songs.filter(s => s.isReleased);
    const albums = activeArtistData.releases.filter(r => r.type === 'Album' || r.type === 'EP' || r.type === 'Mixtape').sort((a,b) => b.releaseDate.year - a.releaseDate.year || b.releaseDate.week - a.releaseDate.week);
    const singles = activeArtistData.releases.filter(r => r.type === 'Single').sort((a,b) => b.releaseDate.year - a.releaseDate.year || b.releaseDate.week - a.releaseDate.week);

    const getYoutubeStreams = (spotifyStreams: number, songId: string) => {
        let hash = 0;
        for (let i = 0; i < songId.length; i++) {
            hash = songId.charCodeAt(i) + ((hash << 5) - hash);
        }
        const ratio = (Math.abs(hash) % 53) / 100 + 0.37;
        return Math.floor(spotifyStreams * ratio);
    };

    const topSongs = useMemo(() => {
        return [...songs].sort((a, b) => getYoutubeStreams(b.streams, b.id) - getYoutubeStreams(a.streams, a.id)).slice(0, 10);
    }, [songs]);

    const topNpcSongs = useMemo(() => {
        return [...(gameState.npcs || [])]
            .sort((a, b) => b.basePopularity - a.basePopularity)
            .slice(0, 5);
    }, [gameState.npcs]);

    const musicVideos = activeArtistData.videos.filter(v => (v.type === 'Music Video' || v.type === 'Live Performance') && v.isOnSpotify);
    const monthlyAudience = Math.floor(activeArtistData.monthlyListeners * 0.75);

    const renderReleaseDetail = () => {
        const release = activeArtistData.releases.find(r => r.id === selectedReleaseId);
        if (!release) return null;

        const releaseSongs = release.songIds.map(id => activeArtistData.songs.find(s => s.id === id)).filter(Boolean) as any[];

        const totalDuration = releaseSongs.reduce((acc, song) => acc + (song.duration || 0), 0);
        const totalDurationMins = Math.floor(totalDuration / 60);
        const totalDurationSecs = totalDuration % 60;

        return (
            <div className="bg-black h-full text-white flex flex-col relative">
                <div className="flex-grow overflow-y-auto pb-20">
                    <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md p-4 flex items-center justify-between border-b border-zinc-900">
                        <button onClick={() => setSelectedReleaseId(null)} className="p-1 -ml-1 hover:bg-zinc-800 rounded-full">
                            <ChevronLeftIcon className="w-6 h-6 text-white" />
                        </button>
                        <div className="flex flex-col items-center">
                            <div className="flex items-center gap-2">
                                <img src={activeArtist.image} className="w-4 h-4 rounded-full object-cover" />
                                <span className="font-bold text-sm">{activeArtist.name}</span>
                            </div>
                            <span className="text-xs text-zinc-400">{release.type} • {release.releaseDate.year}</span>
                        </div>
                        <button className="p-1">
                            <TrianglePlayIcon className="w-6 h-6 text-white" />
                        </button>
                    </div>

                    <div className="p-6 flex flex-col items-center">
                        <img src={release.coverArt} className="w-64 h-64 object-cover shadow-2xl mb-6" />
                        <h1 className="text-3xl font-bold text-center mb-6">{release.title}</h1>

                        <div className="flex items-center gap-6 mb-8 w-full justify-center">
                            <button className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
                                <ArrowLeftIcon className="w-5 h-5 -rotate-90 text-white" />
                            </button>
                            <button className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
                                <span className="text-xl">+</span>
                            </button>
                            <button className="w-16 h-16 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform text-black">
                                <TrianglePlayIcon className="w-8 h-8 ml-1" />
                            </button>
                            <button className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
                                <span className="text-lg">💬</span>
                            </button>
                            <button className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center">
                                <DotsVerticalIcon className="w-5 h-5 text-white" />
                            </button>
                        </div>

                        <div className="w-full space-y-4 mb-8">
                            {releaseSongs.map((song, idx) => {
                                const isAvailable = song.isReleased && !song.isTakenDown;
                                return (
                                    <div key={song.id} className={`flex items-center gap-4 ${isAvailable ? '' : 'opacity-50'}`}>
                                        <span className="text-zinc-500 font-bold w-4 text-center">{idx + 1}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold truncate text-white">{song.title}</p>
                                            <div className="flex items-center gap-1.5 mt-0.5 text-xs text-zinc-400">
                                                {song.explicit && <span className="text-[10px] bg-zinc-400 text-zinc-900 px-1 rounded-sm font-bold">E</span>}
                                                <p className="truncate">
                                                    {activeArtist.name} • {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                                                    {isAvailable && song.streams > 0 && ` • ${formatNumber(getYoutubeStreams(song.streams, song.id))} plays`}
                                                </p>
                                            </div>
                                        </div>
                                        <DotsVerticalIcon className="w-5 h-5 text-zinc-500" />
                                    </div>
                                );
                            })}
                        </div>
                        
                        <p className="text-zinc-500 text-sm">{releaseSongs.length} song{releaseSongs.length !== 1 ? 's' : ''} • {totalDurationMins} minutes, {totalDurationSecs} seconds</p>
                    </div>
                </div>
            </div>
        );
    };

    if (selectedReleaseId) {
        return renderReleaseDetail();
    }

    const renderHome = () => (
        <div className="px-4 py-6">
            <h1 className="text-3xl font-bold mb-6 mt-8">Listen again</h1>
            {songs.length === 0 ? (
                <div className="text-zinc-500 text-center py-12">
                    <MusicNoteIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Listen to music to build your profile.</p>
                </div>
            ) : (
                <div className="flex overflow-x-auto gap-4 pb-4 snap-x">
                    {songs.slice(0, 5).map(song => (
                        <div key={song.id} className="min-w-[120px] max-w-[120px] snap-start">
                            <img src={song.coverArt} className="w-full aspect-square object-cover rounded-md mb-2" />
                            <p className="text-white font-medium truncate text-sm">{song.title}</p>
                            <p className="text-zinc-400 text-xs truncate">{activeArtist.name}</p>
                        </div>
                    ))}
                </div>
            )}

            <h2 className="text-2xl font-bold mb-4 mt-8">Mixed for you</h2>
            <div className="flex overflow-x-auto gap-4 pb-4 snap-x">
                {['My Supermix', 'Pop Mix', 'New Release Mix', 'Discover Mix'].map((mix, idx) => (
                    <div key={mix} className="min-w-[140px] max-w-[140px] snap-start relative">
                        <div className="w-full aspect-square bg-gradient-to-br from-zinc-800 to-black rounded-md mb-2 border-t-4 border-red-600 flex items-center justify-center p-4 text-center shadow-lg relative overflow-hidden">
                            <span className="font-bold text-white z-10">{mix}</span>
                            <div className="absolute inset-0 bg-red-600/20 z-0"></div>
                        </div>
                        <p className="text-white font-medium truncate text-sm">YouTube Music</p>
                    </div>
                ))}
            </div>

            <h2 className="text-2xl font-bold mb-4 mt-8">Your artist profile</h2>
            <div 
                className="flex items-center gap-4 bg-zinc-900 p-4 rounded-xl cursor-pointer hover:bg-zinc-800 transition-colors border border-zinc-800"
                onClick={() => setCurrentTab('profile')}
            >
                <img src={activeArtist.image} className="w-16 h-16 rounded-full object-cover" />
                <div>
                    <p className="text-white font-bold">{activeArtist.name}</p>
                    <p className="text-zinc-400 text-sm">View your channel</p>
                </div>
                <ChevronLeftIcon className="w-5 h-5 text-zinc-500 rotate-180 ml-auto" />
            </div>
        </div>
    );

    const renderExplore = () => (
        <div className="px-4 py-6">
            <h1 className="text-3xl font-bold mb-6 mt-8">Explore</h1>
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-zinc-900 rounded-lg p-4 font-bold border border-zinc-800 hover:bg-zinc-800 flex items-center gap-3">
                    <MusicNoteIcon className="w-6 h-6 text-red-500" />
                    New releases
                </div>
                <div className="bg-zinc-900 rounded-lg p-4 font-bold border border-zinc-800 hover:bg-zinc-800 flex items-center gap-3">
                    <SearchIcon className="w-6 h-6 text-orange-500" />
                    Charts
                </div>
                <div className="bg-zinc-900 rounded-lg p-4 font-bold border border-zinc-800 hover:bg-zinc-800 flex items-center gap-3">
                    <UserGroupIcon className="w-6 h-6 text-yellow-500" />
                    Moods & genres
                </div>
            </div>
            <h2 className="text-2xl font-bold mb-4">Trending</h2>
            <div className="space-y-4">
                {topSongs.map((song, idx) => (
                    <div key={song.id} className="flex items-center gap-4 p-2 rounded-lg bg-zinc-900">
                        <span className="text-zinc-500 font-bold w-4 text-center">{idx + 1}</span>
                        {song.coverArt ? (
                            <img src={song.coverArt} className="w-12 h-12 rounded-sm object-cover" />
                        ) : (
                            <div className="w-12 h-12 bg-zinc-800 rounded-sm"></div>
                        )}
                        <div>
                            <p className="font-bold text-white">{song.title}</p>
                            <p className="text-sm text-zinc-400">{activeArtist.name}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderProfile = () => (
        <>
            <div className="relative">
                <div className="h-72 relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
                    <img src={activeArtist.image} className="w-full h-full object-cover" alt={activeArtist.name} />
                    <div className="absolute bottom-4 left-4 z-20">
                        <h1 className="text-5xl font-bold font-serif mb-1">{activeArtist.name}</h1>
                        <p className="text-zinc-300 text-sm">{formatNumber(monthlyAudience)} monthly audience</p>
                    </div>
                </div>
            </div>

            <div className="px-4 py-4">
                <div className="flex items-center justify-between mb-6">
                    <button className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm">
                        Subscribe {formatNumber(activeArtistData.youtubeSubscribers)}
                    </button>
                    <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform">
                        <TrianglePlayIcon className="w-6 h-6 text-black ml-1" />
                    </button>
                </div>

                {songs.length === 0 && (
                    <div className="text-zinc-500 text-center py-12">
                        <MusicNoteIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>No songs released yet.</p>
                    </div>
                )}

                {topSongs.length > 0 && (
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Top songs</h2>
                            <button className="text-sm font-semibold border border-zinc-600 px-3 py-1 rounded-full">Play all</button>
                        </div>
                        <div className="space-y-3">
                            {topSongs.map((song, idx) => (
                                <div key={song.id} className="flex items-center gap-3">
                                    <img src={song.coverArt} className="w-12 h-12 rounded-md object-cover" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-medium truncate">{song.title}</p>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            {song.explicit && <span className="text-[10px] bg-zinc-400 text-zinc-900 px-1 rounded-sm font-bold">E</span>}
                                            <p className="text-zinc-400 text-sm truncate">{activeArtist.name} • {formatNumber(getYoutubeStreams(song.streams, song.id))} plays</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {albums.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Albums</h2>
                        <div className="flex overflow-x-auto gap-4 pb-4 snap-x">
                            {albums.map(album => (
                                <div 
                                    key={album.id} 
                                    className="min-w-[140px] max-w-[140px] snap-start cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={() => setSelectedReleaseId(album.id)}
                                >
                                    <img src={album.coverArt} className="w-full aspect-square object-cover rounded-md mb-2" />
                                    <p className="text-white font-medium truncate">{album.title}</p>
                                    <div className="flex items-center gap-1.5">
                                        {album.songIds.some(sid => activeArtistData.songs.find(s => s.id === sid)?.explicit) && (
                                            <span className="text-[10px] bg-zinc-400 text-zinc-900 px-1 rounded-sm font-bold">E</span>
                                        )}
                                        <p className="text-zinc-400 text-sm">{album.releaseDate.year}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {singles.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Singles & EPs</h2>
                        <div className="flex overflow-x-auto gap-4 pb-4 snap-x">
                            {singles.map(single => (
                                <div 
                                    key={single.id} 
                                    className="min-w-[140px] max-w-[140px] snap-start cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={() => setSelectedReleaseId(single.id)}
                                >
                                    <img src={single.coverArt} className="w-full aspect-square object-cover rounded-md mb-2" />
                                    <p className="text-white font-medium truncate">{single.title}</p>
                                    <div className="flex items-center gap-1.5">
                                        {single.songIds.some(sid => activeArtistData.songs.find(s => s.id === sid)?.explicit) && (
                                            <span className="text-[10px] bg-zinc-400 text-zinc-900 px-1 rounded-sm font-bold">E</span>
                                        )}
                                        <p className="text-zinc-400 text-sm">{single.type} • {single.releaseDate.year}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {musicVideos.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Videos & Live</h2>
                        <div className="flex overflow-x-auto gap-4 pb-4 snap-x">
                            {musicVideos.map(video => (
                                <div key={video.id} className="min-w-[200px] max-w-[200px] snap-start">
                                    <img src={video.thumbnail} className="w-full aspect-video object-cover rounded-md mb-2" />
                                    <p className="text-white font-medium truncate">{video.title}</p>
                                    <p className="text-zinc-400 text-sm">{activeArtist.name} • {formatNumber(getYoutubeStreams(video.views, video.id))} views</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );

    return (
        <div className="bg-black min-h-full text-white pb-20 flex flex-col relative h-full">
            <div className="flex-grow overflow-y-auto">
                <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md p-4 flex items-center justify-between border-b border-zinc-900">
                    <div className="flex items-center gap-2">
                        {currentTab === 'profile' ? (
                            <button onClick={() => setCurrentTab('home')} className="p-1 -ml-1 hover:bg-zinc-800 rounded-full">
                                <ChevronLeftIcon className="w-6 h-6 text-white" />
                            </button>
                        ) : (
                            <button onClick={() => dispatch({ type: 'CHANGE_VIEW', payload: 'game' })} className="p-1 -ml-1 hover:bg-zinc-800 rounded-full">
                                <ChevronLeftIcon className="w-6 h-6 text-white" />
                            </button>
                        )}
                        <span className="font-bold text-xl flex items-center gap-2">
                            <span className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white text-xs">▶</span>
                            Music
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <SearchIcon className="w-6 h-6 text-white" />
                        <img src={activeArtist.image} className="w-8 h-8 rounded-full object-cover" />
                    </div>
                </div>

                {currentTab === 'home' && renderHome()}
                {currentTab === 'explore' && renderExplore()}
                {currentTab === 'profile' && renderProfile()}
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-zinc-900/90 backdrop-blur-md border-t border-zinc-800 flex justify-around items-center p-2 pb-safe text-[10px] font-medium z-50">
                <button 
                    className={`flex flex-col items-center gap-1 p-2 w-16 ${currentTab === 'home' ? 'text-white' : 'text-zinc-500'}`}
                    onClick={() => setCurrentTab('home')}
                >
                    <HomeIcon className="w-6 h-6" />
                    Home
                </button>
                <button 
                    className={`flex flex-col items-center gap-1 p-2 w-16 ${currentTab === 'explore' ? 'text-white' : 'text-zinc-500'}`}
                    onClick={() => setCurrentTab('explore')}
                >
                    <SearchIcon className="w-6 h-6" />
                    Explore
                </button>
            </div>
        </div>
    );
};

export default YouTubeMusicView;
