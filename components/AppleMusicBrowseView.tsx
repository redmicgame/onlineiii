import React, { useMemo, useState } from 'react';
import { useGame } from '../context/GameContext';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import ChevronRightIcon from './icons/ChevronRightIcon';
import DotsHorizontalIcon from './icons/DotsHorizontalIcon';
import PlayRedCircleIcon from './icons/PlayRedCircleIcon';
import PlusIcon from './icons/PlusIcon';

interface AppleMusicBrowseViewProps {
    browseView: 'home' | 'topPlaylists' | 'topSongs' | 'topAlbums' | 'bestNewSongs' | 'topPreAdds' | 'playlistDetail';
    setBrowseView: (view: 'home' | 'topPlaylists' | 'topSongs' | 'topAlbums' | 'bestNewSongs' | 'topPreAdds' | 'playlistDetail') => void;
    selectedPlaylist: string | null;
    setSelectedPlaylist: (id: string | null) => void;
    onExit: () => void;
}

const AppleMusicBrowseView: React.FC<AppleMusicBrowseViewProps> = ({ browseView, setBrowseView, selectedPlaylist, setSelectedPlaylist, onExit }) => {
    const { gameState, activeArtistData } = useGame();

    const [selectedGenre, setSelectedGenre] = useState<string>('All Genres');
    const [showGenreMenu, setShowGenreMenu] = useState(false);

    const topSongsSource = useMemo(() => {
        if (selectedGenre === 'Pop') return gameState.hotPopSongs || [];
        if (selectedGenre === 'Hip-Hop/R&B') return gameState.hotRapRnb || [];
        if (selectedGenre === 'Country') return gameState.countryChart || [];
        if (selectedGenre === 'Electronic') return gameState.electronicChart || [];
        return gameState.billboardHot100 || [];
    }, [gameState, selectedGenre]);

    const topSongs = useMemo(() => {
        const sorted = [...topSongsSource].map((song, i) => {
            const hash = [...song.uniqueId].reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const variation = (hash % 11) - 5;
            return { ...song, appleScore: i + variation };
        }).sort((a, b) => a.appleScore - b.appleScore);
        
        return sorted.slice(0, 100);
    }, [topSongsSource]);

    const topAlbums = useMemo(() => {
        const sorted = [...(gameState.billboardTopAlbums || [])].map((album, i) => {
            const hash = [...album.uniqueId].reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const variation = (hash % 11) - 5;
            return { ...album, appleScore: i + variation };
        }).sort((a, b) => a.appleScore - b.appleScore);
        
        return sorted.slice(0, 100);
    }, [gameState.billboardTopAlbums]);

    // Best new songs: newly debuted in hot 100 or recently released. Just pick a few from hot 100 that are maybe not top 10 but new? 
    // Or just pick randomly from bottom 50 of hot 100 to simulate "new"? Let's just use the ones with least weeks on chart.
    const bestNewSongs = useMemo(() => {
        return [...topSongs].sort((a, b) => a.weeksOnChart - b.weeksOnChart).slice(0, 20);
    }, [topSongs]);

    // Pre-adds: Use upcoming player submissions and some top albums
    const preAdds = useMemo(() => {
        const playerUpcoming = activeArtistData?.labelSubmissions.filter(s => s.hasCountdownPage && (s.release.type === 'Album' || s.release.type === 'EP')).map(s => ({
            id: s.release.id,
            title: s.release.title,
            artist: activeArtistData.artistName || 'Unknown',
            coverArt: s.release.coverArt,
            isPlayer: true
        })) || [];
        
        const topNpc = topAlbums.slice(0, 10 - playerUpcoming.length).map(a => ({
            id: a.albumId || a.uniqueId,
            title: a.title,
            artist: a.artist,
            coverArt: a.coverArt,
            isPlayer: false
        }));

        return [...playerUpcoming, ...topNpc];
    }, [activeArtistData, topAlbums]);

    const topPlaylists = [
        { id: 'todays-hits', title: "Today's Hits", subtitle: 'Apple Music Hits', cover: 'https://images.unsplash.com/photo-1493225457124-a1a2a5f5f4c5?auto=format&fit=crop&q=80&w=400&h=400' },
        { id: 'todays-country', title: "Today's Country", subtitle: 'Apple Music Country', cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=400&h=400' },
        { id: 'rap-life', title: "Rap Life", subtitle: 'Apple Music Hip-Hop', cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=400&h=400' },
        { id: 'essentials', title: "A-List Pop", subtitle: 'Apple Music Pop', cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=400&h=400' },
    ];

    if (browseView === 'topPlaylists') {
        return (
            <div className="bg-black h-full overflow-y-auto text-white pb-24">
                <header className="sticky top-0 bg-black/80 backdrop-blur-md z-10 p-4 flex items-center justify-between">
                    <button onClick={() => setBrowseView('home')} className="bg-zinc-800/80 p-2 rounded-full"><ChevronLeftIcon className="w-5 h-5" /></button>
                    <h1 className="font-bold">Top Playlists</h1>
                    <div className="w-9"></div>
                </header>
                <div className="p-4 grid grid-cols-2 gap-4">
                    {topPlaylists.map((pl, idx) => (
                        <div key={pl.id} className="cursor-pointer" onClick={() => { setSelectedPlaylist(pl.id); setBrowseView('playlistDetail'); }}>
                            <div className="relative aspect-square rounded-lg overflow-hidden mb-2">
                                <img src={pl.cover} alt={pl.title} className="w-full h-full object-cover" />
                                <div className="absolute top-2 right-2 text-[10px] font-bold bg-black/50 px-1.5 py-0.5 rounded backdrop-blur-md"> Music</div>
                            </div>
                            <p className="text-xs text-zinc-400 font-semibold mb-0.5">{idx + 1}</p>
                            <h3 className="font-semibold text-sm truncate">{pl.title}</h3>
                            <p className="text-xs text-zinc-400 truncate">{pl.subtitle}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (browseView === 'topSongs') {
        return (
            <div className="bg-black h-full overflow-y-auto text-white pb-24">
                <header className="sticky top-0 bg-black/80 backdrop-blur-md z-20 p-4 flex items-center justify-between">
                    <button onClick={() => setBrowseView('home')} className="bg-zinc-800/80 p-2 rounded-full"><ChevronLeftIcon className="w-5 h-5" /></button>
                    <h1 className="font-bold">Top Songs</h1>
                    <div className="relative">
                        <button onClick={() => setShowGenreMenu(!showGenreMenu)} className="bg-zinc-800 px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1 z-30">
                            {selectedGenre} <ChevronRightIcon className={`w-4 h-4 transition-transform ${showGenreMenu ? '-rotate-90' : 'rotate-90'}`} />
                        </button>
                        {showGenreMenu && (
                            <div className="absolute top-full right-0 mt-2 bg-zinc-800 rounded-lg shadow-xl overflow-hidden py-1 w-40 z-30">
                                {['All Genres', 'Pop', 'Hip-Hop/R&B', 'Electronic', 'Country'].map(g => (
                                    <button 
                                        key={g} 
                                        onClick={() => { setSelectedGenre(g); setShowGenreMenu(false); }}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-zinc-700 ${selectedGenre === g ? 'text-[#fa243c] font-bold' : 'text-white'}`}
                                    >
                                        {g}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </header>
                <div className="px-4 pb-4">
                    <div className="divide-y divide-zinc-800/50">
                        {topSongs.map((song, idx) => (
                            <div key={song.uniqueId} className="flex items-center gap-3 py-3">
                                <img src={song.coverArt} className="w-14 h-14 rounded object-cover" alt={song.title} />
                                <span className="text-xl font-bold w-6 text-center text-zinc-300">{idx + 1}</span>
                                <div className="flex-grow min-w-0 flex flex-col justify-center">
                                    <div className="flex items-center gap-2">
                                        <p className="font-bold text-white truncate text-base">{song.title}</p>
                                        <span className="text-[10px] w-4 h-4 bg-zinc-700 text-zinc-400 font-bold rounded flex items-center justify-center flex-shrink-0">E</span>
                                    </div>
                                    <p className="text-sm text-zinc-400 truncate">{song.artist}</p>
                                </div>
                                <button className="flex-shrink-0"><DotsHorizontalIcon className="w-5 h-5 text-zinc-500" /></button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (browseView === 'topAlbums') {
        return (
            <div className="bg-black h-full overflow-y-auto text-white pb-24">
                <header className="sticky top-0 bg-black/80 backdrop-blur-md z-10 p-4 flex items-center justify-between">
                    <button onClick={() => setBrowseView('home')} className="bg-zinc-800/80 p-2 rounded-full"><ChevronLeftIcon className="w-5 h-5" /></button>
                    <h1 className="font-bold">Top Albums</h1>
                    <button className="bg-zinc-800 px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1">All Genres <ChevronRightIcon className="w-4 h-4 rotate-90" /></button>
                </header>
                <div className="p-4 grid grid-cols-2 gap-x-4 gap-y-6">
                    {topAlbums.map((album, idx) => (
                        <div key={album.uniqueId}>
                            <img src={album.coverArt} alt={album.title} className="w-full aspect-square rounded-lg object-cover mb-2 shadow-lg" />
                            <p className="text-xs text-zinc-400 font-semibold mb-0.5">{idx + 1}</p>
                            <h3 className="font-semibold text-sm truncate flex items-center gap-1">
                                {album.title}
                                <span className="text-[9px] w-3 h-3 bg-zinc-700 text-zinc-400 font-bold rounded-sm flex items-center justify-center flex-shrink-0">E</span>
                            </h3>
                            <p className="text-xs text-zinc-400 truncate">{album.artist}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (browseView === 'bestNewSongs') {
        return (
            <div className="bg-black h-full overflow-y-auto text-white pb-24">
                <header className="sticky top-0 bg-black/80 backdrop-blur-md z-10 p-4 flex items-center justify-between">
                    <button onClick={() => setBrowseView('home')} className="bg-zinc-800/80 p-2 rounded-full"><ChevronLeftIcon className="w-5 h-5" /></button>
                    <h1 className="font-bold">Best New Songs</h1>
                    <div className="w-9"></div>
                </header>
                <div className="px-4 pb-4">
                    <div className="divide-y divide-zinc-800/50">
                        {bestNewSongs.map((song) => (
                            <div key={song.uniqueId} className="flex items-center gap-3 py-3">
                                <img src={song.coverArt} className="w-14 h-14 rounded object-cover" alt={song.title} />
                                <div className="flex-grow min-w-0 flex flex-col justify-center">
                                    <div className="flex items-center gap-2">
                                        <p className="font-bold text-white truncate text-base">{song.title}</p>
                                    </div>
                                    <p className="text-sm text-zinc-400 truncate">{song.artist}</p>
                                </div>
                                <button className="flex-shrink-0"><DotsHorizontalIcon className="w-5 h-5 text-zinc-500" /></button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (browseView === 'topPreAdds') {
        return (
            <div className="bg-black h-full overflow-y-auto text-white pb-24">
                <header className="sticky top-0 bg-black/80 backdrop-blur-md z-10 p-4 flex items-center justify-between">
                    <button onClick={() => setBrowseView('home')} className="bg-zinc-800/80 p-2 rounded-full"><ChevronLeftIcon className="w-5 h-5" /></button>
                    <h1 className="font-bold">Top Pre-Adds</h1>
                    <div className="w-9"></div>
                </header>
                <div className="p-4 grid grid-cols-2 gap-x-4 gap-y-6">
                    {preAdds.map((album, idx) => (
                        <div key={album.id + idx.toString()}>
                            <div className="relative">
                                <img src={album.coverArt} alt={album.title} className="w-full aspect-square rounded-lg object-cover mb-2 shadow-lg" />
                            </div>
                            <h3 className="font-semibold text-sm truncate flex items-center gap-1">
                                {album.title}
                                <span className="text-[9px] w-3 h-3 bg-zinc-700 text-zinc-400 font-bold rounded-sm flex items-center justify-center flex-shrink-0">E</span>
                            </h3>
                            <p className="text-xs text-zinc-400 truncate">{album.artist}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (browseView === 'playlistDetail' && selectedPlaylist) {
        const playlist = topPlaylists.find(p => p.id === selectedPlaylist) || topPlaylists[0];
        
        let playlistSongsSource = gameState.billboardHot100 || [];
        if (playlist.id === 'todays-country') playlistSongsSource = gameState.countryChart || [];
        if (playlist.id === 'rap-life') playlistSongsSource = gameState.hotRapRnb || [];
        if (playlist.id === 'essentials') playlistSongsSource = gameState.hotPopSongs || [];

        const playlistTracks = [...playlistSongsSource].slice(0, 50).sort((a, b) => {
            const hashA = [...a.uniqueId].reduce((acc, char) => acc + char.charCodeAt(0), 0) % 100;
            const hashB = [...b.uniqueId].reduce((acc, char) => acc + char.charCodeAt(0), 0) % 100;
            return hashB - hashA; // pseudo random based on id
        });
        
        return (
            <div className="bg-black h-full overflow-y-auto text-white pb-24 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-[#bda641] to-black opacity-30 pointer-events-none" />
                <header className="sticky top-0 bg-transparent z-10 p-4 flex items-center justify-between">
                    <button onClick={() => setBrowseView('home')} className="bg-zinc-800/60 backdrop-blur-md p-2 rounded-full"><ChevronLeftIcon className="w-5 h-5" /></button>
                    <div className="flex gap-4">
                        <button className="bg-zinc-800/60 backdrop-blur-md p-2 rounded-full"><PlusIcon className="w-5 h-5" /></button>
                        <button className="bg-zinc-800/60 backdrop-blur-md p-2 rounded-full"><DotsHorizontalIcon className="w-5 h-5" /></button>
                    </div>
                </header>
                
                <div className="relative pt-8 px-8 pb-4 text-center z-10">
                    <h1 className="text-[52px] font-black tracking-tighter leading-none text-[#ffe16b] shadow-xl" style={{ textShadow: '0 4px 20px rgba(189, 166, 65, 0.4)' }}>
                        {playlist.title.split(' ').map((word, i) => <React.Fragment key={i}>{word}<br/></React.Fragment>)}
                    </h1>
                    
                    <div className="mt-20 flex flex-col items-center">
                        <h2 className="text-xl font-bold">{playlist.title}</h2>
                        <p className="text-[#fa243c] font-semibold tracking-tight">{playlist.subtitle}</p>
                        <p className="text-xs text-zinc-400 mt-1">Updated 16hr ago</p>
                    </div>

                    <div className="flex gap-4 mt-6 justify-center items-center">
                        <button className="bg-zinc-800/80 backdrop-blur-md hover:bg-zinc-700 transition-colors rounded-full w-12 h-12 flex-shrink-0 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 3l4 4m0 0l-4 4m4-4H4m12 14l4-4m0 0l-4-4m4 4H4" />
                            </svg>
                        </button>
                        <button className="bg-white hover:bg-zinc-200 transition-colors rounded-full flex-1 max-w-[200px] py-3 flex items-center justify-center gap-2 shadow-lg">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-black"><path d="M7 6v12l10-6z" /></svg>
                            <span className="font-bold text-black text-lg pb-0.5">Play</span>
                        </button>
                        <button className="bg-zinc-800/80 backdrop-blur-md hover:bg-zinc-700 transition-colors rounded-full w-12 h-12 flex-shrink-0 flex items-center justify-center">
                            <PlusIcon className="w-6 h-6 text-zinc-300" />
                        </button>
                    </div>
                </div>

                <div className="px-4 mt-4 relative z-10 pb-4 border-b border-zinc-800">
                    <p className="text-sm text-zinc-400 leading-snug">
                        {playlist.title} is home to the biggest songs in pop, hip-hop, R&B, and more. At the top of this week <strong className="text-white">MORE</strong>
                    </p>
                </div>

                <div className="px-4 relative z-10 pt-2 divide-y divide-zinc-800/50">
                    {playlistTracks.map((song, index) => (
                        <div key={`${song.uniqueId}-${index}`} className="flex items-center gap-3 py-3">
                            <div className="w-5 text-center text-zinc-500 text-sm font-semibold">{index + 1}</div>
                            <img src={song.coverArt} className="w-12 h-12 rounded object-cover" alt={song.title} />
                            <div className="flex-grow min-w-0 flex flex-col justify-center">
                                <div className="flex items-center gap-2">
                                    <p className="font-semibold text-white truncate text-base">{song.title}</p>
                                </div>
                                <p className="text-sm text-zinc-400 truncate">{song.artist}</p>
                            </div>
                            <button className="flex-shrink-0"><DotsHorizontalIcon className="w-5 h-5 text-zinc-500" /></button>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="bg-black text-white h-full overflow-y-auto pb-24">
            <header className="p-4 pt-12 flex justify-between items-center">
                <h1 className="text-3xl font-bold">Browse</h1>
                <button onClick={onExit} className="bg-zinc-800/80 p-2 rounded-full"><ChevronLeftIcon className="w-5 h-5" /></button>
            </header>
            
            <main className="p-4 space-y-8">
                {/* Top Playlists Horizontal Section */}
                <section>
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-xl font-bold">Top Playlists</h2>
                        <button onClick={() => setBrowseView('topPlaylists')} className="text-zinc-400"><ChevronRightIcon className="w-6 h-6" /></button>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                        {topPlaylists.map(pl => (
                            <div key={pl.id} className="w-40 flex-shrink-0 cursor-pointer" onClick={() => { setSelectedPlaylist(pl.id); setBrowseView('playlistDetail'); }}>
                                <div className="relative aspect-square rounded-lg overflow-hidden mb-2">
                                    <img src={pl.cover} alt={pl.title} className="w-full h-full object-cover" />
                                    <div className="absolute top-2 right-2 text-[8px] font-bold bg-black/50 px-1 py-0.5 rounded backdrop-blur-md"> Music</div>
                                </div>
                                <h3 className="font-semibold text-sm truncate">{pl.title}</h3>
                                <p className="text-xs text-zinc-400 truncate">{pl.subtitle}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Top Songs Horizontal list with numbers */}
                <section>
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-xl font-bold">Top Songs</h2>
                        <button onClick={() => setBrowseView('topSongs')} className="text-zinc-400"><ChevronRightIcon className="w-6 h-6" /></button>
                    </div>
                    {/* Just show top 4 */}
                    <div className="divide-y divide-zinc-800/50">
                        {topSongs.slice(0, 4).map((song, idx) => (
                            <div key={song.uniqueId} className="flex items-center gap-3 py-2">
                                <img src={song.coverArt} className="w-12 h-12 rounded object-cover" alt={song.title} />
                                <span className="text-lg font-bold w-5 justify-center flex">{idx + 1}</span>
                                <div className="flex-grow min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold truncate">{song.title}</p>
                                        <span className="text-[10px] w-4 h-4 bg-zinc-700 text-zinc-400 font-bold rounded flex items-center justify-center flex-shrink-0">E</span>
                                    </div>
                                    <p className="text-xs text-zinc-400 mt-0.5 truncate">{song.artist}</p>
                                </div>
                                <button className="flex-shrink-0"><DotsHorizontalIcon className="w-5 h-5 text-zinc-500" /></button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Top Albums Horizontal */}
                <section>
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-xl font-bold">Top Albums</h2>
                        <button onClick={() => setBrowseView('topAlbums')} className="text-zinc-400"><ChevronRightIcon className="w-6 h-6" /></button>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                        {topAlbums.slice(0, 6).map(album => (
                            <div key={album.uniqueId} className="w-40 flex-shrink-0">
                                <img src={album.coverArt} alt={album.title} className="w-40 h-40 rounded-lg object-cover mb-2" />
                                <h3 className="font-semibold text-sm truncate flex items-center gap-1">
                                    {album.title}
                                    <span className="text-[9px] w-3 h-3 bg-zinc-700 text-zinc-400 font-bold rounded-sm flex items-center justify-center flex-shrink-0">E</span>
                                </h3>
                                <p className="text-xs text-zinc-400 truncate">{album.artist}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Best New Songs */}
                <section>
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-xl font-bold">Best New Songs</h2>
                        <button onClick={() => setBrowseView('bestNewSongs')} className="text-zinc-400"><ChevronRightIcon className="w-6 h-6" /></button>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                        {bestNewSongs.slice(0, 6).map(song => (
                            <div key={song.uniqueId} className="w-36 flex-shrink-0">
                                <img src={song.coverArt} alt={song.title} className="w-36 h-36 rounded-lg object-cover mb-2" />
                                <h3 className="font-semibold text-sm truncate">{song.title}</h3>
                                <p className="text-xs text-zinc-400 truncate">{song.artist}</p>
                            </div>
                        ))}
                    </div>
                </section>
                
                {/* Top Pre-Adds */}
                <section>
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-xl font-bold">Top Pre-Adds</h2>
                        <button onClick={() => setBrowseView('topPreAdds')} className="text-zinc-400"><ChevronRightIcon className="w-6 h-6" /></button>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                        {preAdds.slice(0, 6).map((album, idx) => (
                            <div key={album.id + idx.toString()} className="w-36 flex-shrink-0">
                                <img src={album.coverArt} alt={album.title} className="w-36 h-36 rounded-lg object-cover mb-2" />
                                <h3 className="font-semibold text-sm truncate flex items-center gap-1">
                                    {album.title}
                                    <span className="text-[9px] w-3 h-3 bg-zinc-700 text-zinc-400 font-bold rounded-sm flex items-center justify-center flex-shrink-0">E</span>
                                </h3>
                                <p className="text-xs text-zinc-400 truncate">{album.artist}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AppleMusicBrowseView;
