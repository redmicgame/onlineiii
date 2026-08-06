
import React, { useState, useMemo, useRef } from 'react';
import { useGame, formatNumber } from '../context/GameContext';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import DotsHorizontalIcon from './icons/DotsHorizontalIcon';
import ShuffleIcon from './icons/ShuffleIcon';
import TrianglePlayIcon from './icons/TrianglePlayIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';
import MusicNoteIcon from './icons/MusicNoteIcon';
import SpotifyIcon from './icons/SpotifyIcon';
import UserIcon from './icons/UserIcon';
import VerifiedBadgeIcon from './icons/VerifiedBadgeIcon';
import type { Song, Release, GameDate } from '../types';
import { NPC_ARTIST_IMAGES } from '../constants';
import SpotifyDiscographyView from './SpotifyDiscographyView';
import SpotifyReleaseDetailView from './SpotifyReleaseDetailView';
import SpotifyPlaylistDetailView from './SpotifyPlaylistDetailView';
import { SpotifyPlaylistCover } from './SpotifyPlaylistCover';
import SpotifyNowPlayingView from './SpotifyNowPlayingView';

const PopularSongItem: React.FC<{ song: Song; index: number; hasMusicVideo?: boolean; onClick?: () => void; }> = ({ song, index, hasMusicVideo, onClick }) => {
    return (
        <div onClick={onClick} className="flex items-center gap-4 group cursor-pointer p-2 -mx-2 rounded-md hover:bg-white/10">
            <div className="text-zinc-400 font-semibold w-5 text-right">{index + 1}</div>
            <img src={song.coverArt} alt={song.title} className="w-10 h-10 rounded-sm object-cover" />
            <div className="flex-grow min-w-0">
                <p className="font-semibold text-white truncate">{song.title.replace(/ \(feat\. [^)]+\)/g, '')}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                    {song.explicit && <span className="text-[10px] w-3.5 h-3.5 bg-zinc-400 text-zinc-900 font-bold rounded-sm flex-shrink-0 flex items-center justify-center">E</span>}
                    {hasMusicVideo && (
                        <span className="flex items-center text-[13px] text-zinc-400 gap-1 flex-shrink-0">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-[18px] h-[18px] -ml-0.5">
                                <rect width="18" height="14" x="3" y="5" rx="2.5" />
                                <path d="M10 9.5l4.5 2.5-4.5 2.5z" strokeLinejoin="round" />
                            </svg>
                            Video &bull; 
                        </span>
                    )}
                    <p className="text-sm text-zinc-400 truncate">{song.streams.toLocaleString()}</p>
                </div>
            </div>
            <DotsHorizontalIcon className="w-5 h-5 text-zinc-300 invisible group-hover:visible" />
        </div>
    );
};

const PopularReleaseItem: React.FC<{ release: Release; isLatest: boolean; onClick: () => void; }> = ({ release, isLatest, onClick }) => {
    return (
        <button onClick={onClick} className="flex w-full text-left items-center gap-4 group cursor-pointer">
            <img src={release.coverArt} alt={release.title} className="w-16 h-16 rounded object-cover" />
            <div className="flex-grow min-w-0">
                <p className="font-semibold text-white text-lg truncate">{release.title}</p>
                <p className="text-sm text-zinc-400">
                    {isLatest ? 'Latest release' : release.releaseDate.year} • {release.type.replace(" (Deluxe)", "")}
                </p>
            </div>
        </button>
    );
};

const UpcomingReleaseItem: React.FC<{ release: Release; releaseDate: GameDate; onClick: () => void; }> = ({ release, releaseDate, onClick }) => {
    return (
        <button onClick={onClick} className="flex w-full text-left items-center gap-4 group cursor-pointer">
            <img src={release.coverArt} alt={release.title} className="w-16 h-16 rounded object-cover" />
            <div className="flex-grow min-w-0">
                <p className="font-semibold text-white text-lg truncate">{release.title}</p>
                <p className="text-sm text-zinc-400">
                    Coming Soon • Releasing W{releaseDate.week}, {releaseDate.year}
                </p>
            </div>
        </button>
    );
};

const formatPlaylistsList = (playlists: string[]) => {
    if (playlists.length === 0) return '';
    if (playlists.length === 1) return playlists[0];
    if (playlists.length === 2) return `${playlists[0]} and ${playlists[1]}`;
    return playlists.slice(0, -1).join(', ') + ', and ' + playlists[playlists.length - 1];
};


const TOP_100_LISTENERS = [
  131300000, 124500000, 114100000, 113400000, 110900000, 103500000, 102400000, 102200000, 94700000, 94200000, 
  92100000, 91900000, 91100000, 88000000, 87500000, 83300000, 81000000, 79400000, 78300000, 78100000, 
  76900000, 75800000, 74900000, 73800000, 72600000, 71800000, 70900000, 69800000, 68900000, 67800000, 
  66900000, 66100000, 65400000, 64700000, 64000000, 63400000, 62800000, 62200000, 61600000, 61000000, 
  60500000, 59900000, 59300000, 58800000, 58200000, 57700000, 57200000, 56700000, 56200000, 55700000, 
  55200000, 54800000, 54300000, 53900000, 53500000, 53000000, 52600000, 52200000, 51800000, 51400000, 
  51000000, 50600000, 50200000, 49800000, 49400000, 49000000, 48700000, 48300000, 47900000, 47500000, 
  47100000, 46700000, 46300000, 45900000, 45500000, 45100000, 44700000, 44300000, 43900000, 43500000, 
  43100000, 42700000, 42300000, 41900000, 41500000, 41100000, 40700000, 40300000, 39900000, 39500000, 
  39100000, 38700000, 38300000, 37900000, 37500000, 37100000, 36700000, 36300000, 35900000, 35500000
];

const getSpotifyRank = (listeners: number) => {
    for (let i = 0; i < TOP_100_LISTENERS.length; i++) {
        if (listeners >= TOP_100_LISTENERS[i]) {
            return i + 1;
        }
    }
    
    if (listeners < 15000000) return null;
    
    const rank = 100 + Math.round(100 * (1 - (listeners - 15000000) / (35500000 - 15000000)));
    return Math.max(101, Math.min(200, rank));
};

const VerifiedModal: React.FC<{ isOpen: boolean; onClose: () => void; sinceYear: number; releasesCount: number; playlists: string[]; recentVenues: any[] }> = ({ isOpen, onClose, sinceYear, releasesCount, playlists, recentVenues }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 sm:items-center p-0 sm:p-4">
            <div className="bg-zinc-900 w-full max-w-md sm:rounded-2xl rounded-t-2xl p-6 pb-12 sm:pb-6 relative animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:fade-in duration-300" onClick={e => e.stopPropagation()}>
                <div className="w-10 h-1 bg-zinc-600 rounded-full mx-auto mb-6 sm:hidden"></div>
                
                <h2 className="text-base font-bold text-white text-center mb-6">Artist badges</h2>

                <div className="bg-zinc-800/50 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <VerifiedBadgeIcon className="w-5 h-5 text-[#A0D9B1]" />
                        <span className="font-bold text-white">Verified by Spotify</span>
                    </div>
                    <p className="text-sm text-zinc-300">
                        This artist has grown an active fanbase to be eligible for review and has met Spotify's criteria for profile authenticity. <a href="#" className="text-zinc-400 hover:text-white underline">Learn more</a>
                    </p>
                </div>

                <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-base font-bold text-white">Artist details</h3>
                    <span className="text-[10px] font-bold text-black bg-[#1ed760] px-1.5 py-0.5 rounded-sm">Beta</span>
                </div>

                <div className="space-y-6 mt-6">
                    <div className="flex gap-4">
                        <MusicNoteIcon className="w-6 h-6 text-zinc-400 shrink-0" />
                        <p className="text-sm text-zinc-300">Has released music since {sinceYear}, with {releasesCount} {releasesCount === 1 ? 'album, EP, single, or remix' : 'albums, EPs, singles, or remixes'} on Spotify globally.</p>
                    </div>
                    
                    {playlists.length > 0 && (
                        <div className="flex gap-4">
                            <div className="w-6 h-6 shrink-0 flex items-center justify-center">
                                <SpotifyIcon className="w-5 h-5 text-zinc-400 grayscale opacity-80" />
                            </div>
                            <p className="text-sm text-zinc-300">Playlisted by Spotify's editors on {formatPlaylistsList(playlists)} in the past year.</p>
                        </div>
                    )}
                    
                    {recentVenues.length > 0 && (
                        <div className="flex gap-4">
                            <svg className="w-6 h-6 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <p className="text-sm text-zinc-300">
                                Most recent concerts listed on Spotify were in 2026, and has played recently at {
                                   recentVenues.map(v => v.name).join(', ').replace(/, ([^,]*)$/, ' and $1')
                                }.
                            </p>
                        </div>
                    )}

                    <div className="flex gap-4">
                        <UserIcon className="w-6 h-6 text-zinc-400 shrink-0" />
                        <p className="text-sm text-zinc-300">This artist has a claimed profile in Spotify for Artists.</p>
                    </div>
                </div>
            </div>
            <div className="absolute inset-0 z-[-1]" onClick={onClose}></div>
        </div>
    );
};


const AboutModal: React.FC<{ isOpen: boolean; onClose: () => void; artistData: ArtistData; artist: Artist; }> = ({ isOpen, onClose, artistData, artist }) => {
    if (!isOpen) return null;

    const listeners = artistData.monthlyListeners >= 1000000 ? `${(artistData.monthlyListeners / 1000000).toFixed(1).replace(/\.0$/, '')}M` : artistData.monthlyListeners.toLocaleString();

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
            <div className="bg-[#282828] w-full max-w-lg rounded-xl flex flex-col max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="flex justify-end p-4 absolute top-0 right-0 z-10 w-full bg-gradient-to-b from-black/50 to-transparent pt-4">
                    <button onClick={onClose} className="p-2 bg-black/50 hover:bg-black/70 rounded-full text-white backdrop-blur-md">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                
                <div className="overflow-y-auto w-full">
                    {artistData.aboutImages && artistData.aboutImages.length > 0 ? (
                        <div className="flex overflow-x-auto snap-x scrollbar-hide">
                            {artistData.aboutImages.map((img, i) => (
                                <img key={i} src={img} className="w-full snap-start flex-shrink-0 object-cover aspect-[4/5] sm:aspect-auto" />
                            ))}
                        </div>
                    ) : (
                        <img src={artist.image} className="w-full object-cover" />
                    )}

                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                {getSpotifyRank(artistData.monthlyListeners) !== null && (
                                    <div className="mb-4">
                                        <p className="text-5xl font-black mb-1">#{getSpotifyRank(artistData.monthlyListeners)}</p>
                                        <p className="text-sm text-zinc-300 font-medium">in the world</p>
                                    </div>
                                )}
                                <p className="text-3xl font-black mb-1">{artistData.monthlyListeners.toLocaleString()}</p>
                                <p className="text-sm text-zinc-400 font-semibold uppercase tracking-wider">Monthly Listeners</p>
                            </div>
                        </div>

                        {artistData.aboutBio && (
                            <p className="text-base text-zinc-200 whitespace-pre-wrap mb-8">
                                {artistData.aboutBio}
                            </p>
                        )}
                        
                        <div className="flex items-center gap-3">
                             <img src={artist.image} className="w-12 h-12 rounded-full object-cover" />
                             <div>
                                 <p className="text-sm text-zinc-400">Posted by</p>
                                 <p className="font-bold">{artist.name}</p>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="absolute inset-0 z-[-1]" onClick={onClose}></div>
        </div>
    );
};

const SpotifyView: React.FC = () => {
    const { gameState, dispatch, activeArtist, activeArtistData, allPlayerArtists } = useGame();
    const [view, setView] = useState<'profile' | 'discography' | 'releaseDetail' | 'playlistDetail'>('profile');
    const [selectedReleaseId, setSelectedReleaseId] = useState<string | null>(null);
    const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
    const [history, setHistory] = useState<Array<'profile' | 'discography' | 'playlistDetail'>>(['profile']);
    const [isPopularExpanded, setIsPopularExpanded] = useState(false);
    const [showVerifiedModal, setShowVerifiedModal] = useState(false);
    const [showAboutModal, setShowAboutModal] = useState(false);
    const [nowPlayingSongIndex, setNowPlayingSongIndex] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!activeArtist || !activeArtistData) return null;
    const { monthlyListeners, songs, releases, artistPick, labelSubmissions } = activeArtistData;
    const { date } = gameState;

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0] && activeArtist) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const newImage = reader.result as string;
                dispatch({ type: 'UPDATE_ARTIST_IMAGE', payload: { artistId: activeArtist.id, newImage } });
            };
            reader.readAsDataURL(file);
        }
        if (e.target) e.target.value = '';
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const allSongs = useMemo(() => {
        const playerFeatureSongs: Song[] = [];
        const activeArtistName = activeArtist?.name;
        
        if (activeArtistName) {
            Object.entries(gameState.artistsData).forEach(([artistId, data]) => {
                if (artistId === activeArtist?.id) return;
                data.songs.forEach(song => {
                    if (song.isReleased && !song.isTakenDown && (song.collaboration?.artistName === activeArtistName || (song.features && song.features.includes(activeArtistName)))) {
                        playerFeatureSongs.push(song);
                    }
                });
            });
        }
        return [...songs, ...playerFeatureSongs];
    }, [songs, activeArtist, gameState.artistsData]);

    const streamingSongs = useMemo(() => {
        return allSongs
            .filter(s => s.isReleased && !s.isTakenDown && (s.isAvailableOnStreaming === true || s.isFeatureToNpc))
            .sort((a, b) => (b.lastWeekStreams || 0) - (a.lastWeekStreams || 0));
    }, [allSongs]);

    const topSongs = streamingSongs.slice(0, 10);
        
    const popularSongsToShow = isPopularExpanded ? topSongs : topSongs.slice(0, 5);

    const popularReleases = (() => {
        const isFeature = (r: Release) => r.type !== 'Live Album' && (r.isFeatureToNpc || r.songIds.some(id => songs.find(s => s.id === id)?.isFeatureToNpc));
        const availableReleases = releases.filter(r => !r.isTakenDown && !r.soundtrackInfo && !isFeature(r) && r.songIds.some(id => songs.find(s => s.id === id)?.isAvailableOnStreaming === true));

        if (availableReleases.length === 0) {
            return [];
        }

        const releasesWithStreams = availableReleases.map(release => {
            const totalStreams = release.songIds.reduce((sum, songId) => {
                const song = songs.find(s => s.id === songId);
                return sum + (song?.streams || 0);
            }, 0);
            return { ...release, totalStreams };
        });

        const latestRelease = releasesWithStreams.reduce((latest, current) => {
            const latestDate = latest.releaseDate ? latest.releaseDate.year * 52 + latest.releaseDate.week : 0;
            const currentDate = current.releaseDate ? current.releaseDate.year * 52 + current.releaseDate.week : 0;
            return currentDate > latestDate ? current : latest;
        });

        const toTotalWeeks = (d: GameDate | undefined) => d ? d.year * 52 + d.week : 0;
        const nowTotalWeeks = toTotalWeeks(date);
        const latestReleaseWeeks = toTotalWeeks(latestRelease.releaseDate);
        const isLatestRecent = (nowTotalWeeks - latestReleaseWeeks) <= 26; // 6 months

        if (isLatestRecent) {
            const otherReleases = releasesWithStreams
                .filter(r => r.id !== latestRelease.id)
                .sort((a, b) => b.totalStreams - a.totalStreams);
            
            const sortedPopularReleases = [latestRelease, ...otherReleases].slice(0, 4);
            return sortedPopularReleases.map(r => ({ ...r, isLatest: r.id === latestRelease.id }));
        } else {
            const sortedPopularReleases = [...releasesWithStreams].sort((a, b) => b.totalStreams - a.totalStreams).slice(0, 4);
            return sortedPopularReleases.map(r => ({ ...r, isLatest: false }));
        }
    })();

    const artistPickItem = useMemo(() => {
        if (!artistPick) return null;
        if (artistPick.itemType === 'song') {
            return songs.find(s => s.id === artistPick.itemId);
        }
        if (artistPick.itemType === 'release') {
            return releases.find(r => r.id === artistPick.itemId);
        }
        return null;
    }, [artistPick, songs, releases]);

    const upcomingReleases = useMemo(() => {
        if (!labelSubmissions) return [];
        
        const toTotalWeeks = (d: GameDate) => d.year * 52 + d.week;
        const nowTotalWeeks = toTotalWeeks(date);
    
        return labelSubmissions
            .filter(sub => 
                sub.status === 'scheduled' && 
                sub.hasCountdownPage &&
                sub.projectReleaseDate &&
                toTotalWeeks(sub.projectReleaseDate) > nowTotalWeeks
            )
            .map(sub => ({
                release: sub.release,
                releaseDate: sub.projectReleaseDate!
            }))
            .sort((a, b) => toTotalWeeks(a.releaseDate) - toTotalWeeks(b.releaseDate));
    }, [labelSubmissions, date]);

    const appearsOnPlaylists = useMemo(() => {
        const playlists = gameState.spotifyPlaylists || [];
        return playlists.filter(p => 
            p.tracks.some(t => t.artistName === activeArtist.name)
        ).map(p => {
            const track = p.tracks.find(t => t.artistName === activeArtist.name);
            return {
                ...p,
                artistPosition: track?.position
            };
        });
    }, [gameState.spotifyPlaylists, activeArtist.name]);
    
    const isVerified = monthlyListeners >= 1000000 || appearsOnPlaylists.length > 0;
    const sinceYear = useMemo(() => releases.length > 0 ? Math.min(...releases.map(r => r.releaseDate.year)) : date.year, [releases, date.year]);
    const playlistsNames = useMemo(() => appearsOnPlaylists.map(p => p.name), [appearsOnPlaylists]);
    const recentVenues = useMemo(() => {
        const pastVenues: any[] = [];
        const reversedTours = [...activeArtistData.tours].reverse();
        for (const tour of reversedTours) {
            const maxIdx = tour.status === 'finished' ? tour.venues.length : tour.currentVenueIndex;
            for (let i = maxIdx - 1; i >= 0; i--) {
                pastVenues.push(tour.venues[i]);
                if (pastVenues.length === 3) break;
            }
            if (pastVenues.length === 3) break;
        }
        return pastVenues;
    }, [activeArtistData.tours]);

    const navigateTo = (newView: 'profile' | 'discography' | 'releaseDetail' | 'playlistDetail') => {
        if (newView !== view) {
            if (view !== 'releaseDetail' && view !== 'playlistDetail') {
                setHistory(prev => [...prev, view]);
            }
        }
        setView(newView);
    };

    const handleBack = () => {
        const previousView = history[history.length - 1] || 'profile';
        setHistory(prev => prev.slice(0, -1));
        setView(previousView);
    };

    const handleShowDiscography = () => {
        navigateTo('discography');
    };

    const handleShowReleaseDetail = (releaseId: string) => {
        setSelectedReleaseId(releaseId);
        navigateTo('releaseDetail');
    };

    const handleShowPlaylistDetail = (playlistId: string) => {
        setSelectedPlaylistId(playlistId);
        navigateTo('playlistDetail');
    };

    const handleShowCompilationDetail = (compilationId: string) => {
        dispatch({ type: 'SELECT_SOUNDTRACK', payload: compilationId });
    }

    if (view === 'discography') {
        return <SpotifyDiscographyView onBack={handleBack} onSelectRelease={handleShowReleaseDetail} onSelectCompilation={handleShowCompilationDetail} />;
    }

    if (view === 'releaseDetail' && selectedReleaseId) {
        return <SpotifyReleaseDetailView releaseId={selectedReleaseId} onBack={handleBack} />;
    }

    if (view === 'playlistDetail' && selectedPlaylistId) {
        return <SpotifyPlaylistDetailView playlistId={selectedPlaylistId} onBack={handleBack} />;
    }

    if (nowPlayingSongIndex !== null) {
        return <SpotifyNowPlayingView songs={streamingSongs} initialSongIndex={streamingSongs.findIndex(s => s.id === popularSongsToShow[nowPlayingSongIndex].id)} onBack={() => setNowPlayingSongIndex(null)} />;
    }

    return (
        <div className="bg-[#121212] text-white h-full overflow-y-auto pb-24">
            {/* Header with Background Image */}
            <div className="relative h-[40vh] min-h-[340px] w-full group cursor-pointer" onClick={triggerFileInput}>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                <img src={activeArtist.image} alt={activeArtist.name} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-[#121212] pointer-events-none"></div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="text-white font-bold text-lg bg-black/50 px-4 py-2 rounded-full">Change Photo</span>
                </div>
                <button 
                    onClick={(e) => { e.stopPropagation(); dispatch({ type: 'CHANGE_VIEW', payload: 'game' }); }} 
                    className="absolute top-12 left-4 bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors z-10"
                    aria-label="Go back"
                >
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <div className="absolute bottom-8 left-4 right-4 z-10 pointer-events-none">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>
                        {activeArtist.name}
                    </h1>
                    {isVerified && (
                        <div 
                            className="flex items-center gap-2 mt-2 cursor-pointer pointer-events-auto hover:opacity-80 transition-opacity w-max"
                            onClick={(e) => { e.stopPropagation(); setShowVerifiedModal(true); }}
                        >
                            <VerifiedBadgeIcon className="w-6 h-6 text-[#A0D9B1]" />
                            <span className="font-semibold text-white drop-shadow-md">Verified by Spotify</span>
                        </div>
                    )}
                </div>
            </div>

            <VerifiedModal 
                isOpen={showVerifiedModal} 
                onClose={() => setShowVerifiedModal(false)}
                sinceYear={sinceYear}
                releasesCount={releases.length}
                playlists={playlistsNames}
                recentVenues={recentVenues}
            />

            {/* Main Content */}
            <div className="p-4 space-y-8 pb-20">
                {/* Listeners and Actions */}
                <div>
                    <p className="text-zinc-400 text-sm">
                        {monthlyListeners >= 1000000 
                            ? `${(monthlyListeners / 1000000).toFixed(1).replace(/\.0$/, '')}M` 
                            : monthlyListeners.toLocaleString()} monthly listeners
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button className="px-4 py-1 border border-zinc-400 rounded-full text-sm font-semibold hover:border-white">
                                Following
                            </button>
                            <button>
                                <DotsHorizontalIcon className="w-6 h-6 text-zinc-400" />
                            </button>
                        </div>
                        <div className="flex items-center gap-4">
                             <button>
                                <ShuffleIcon className="w-6 h-6 text-green-500" />
                            </button>
                            <button className="bg-green-500 rounded-full w-14 h-14 flex items-center justify-center shadow-lg shadow-green-500/30">
                               <TrianglePlayIcon className="w-7 h-7 text-black" />
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Placeholder for Music/Clips/Events/Merch tabs */}
                <div className="border-b border-zinc-800">
                    <div className="flex gap-6">
                        <button className="py-2 text-sm font-semibold border-b-2 border-green-500">Music</button>
                        <button className="py-2 text-sm font-semibold text-zinc-400 hover:text-white">Clips</button>
                        <button className="py-2 text-sm font-semibold text-zinc-400 hover:text-white">Events</button>
                        <button className="py-2 text-sm font-semibold text-zinc-400 hover:text-white">Merch</button>
                    </div>
                </div>

                {/* Popular Songs */}
                {topSongs.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">Popular</h2>
                        <div className="space-y-2">
                            {popularSongsToShow.map((song, index) => {
                                const hasMusicVideo = activeArtistData.videos?.some(v => v.songId === song.id && v.type === 'Music Video');
                                return <PopularSongItem key={song.id} song={song} index={index} hasMusicVideo={hasMusicVideo} onClick={() => setNowPlayingSongIndex(index)} />;
                            })}
                        </div>
                        {topSongs.length > 5 && (
                             <div className="pt-2">
                                <button 
                                    onClick={() => setIsPopularExpanded(!isPopularExpanded)} 
                                    className="px-6 py-2 border border-zinc-400 rounded-full text-sm font-semibold hover:border-white hover:scale-105 transition-transform"
                                >
                                    {isPopularExpanded ? 'Show less' : 'See more'}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Artist Pick (Moved between Popular and Popular Releases) */}
                {artistPickItem && (
                    <div className="space-y-3">
                        <h2 className="text-2xl font-bold">Artist pick</h2>
                        <button onClick={() => handleShowReleaseDetail(artistPick.itemType === 'release' ? artistPick.itemId : (songs.find(s=>s.id === artistPick.itemId)?.releaseId || ''))} className="w-full text-left flex items-start gap-4 p-3 -m-3 rounded-lg hover:bg-white/10">
                            <img src={artistPickItem.coverArt} alt={artistPickItem.title} className="w-20 h-20 rounded object-cover" />
                            <div className="flex-1">
                                {artistPick.message ? (
                                    <div className="flex items-center gap-2 mb-1 bg-white inline-flex rounded-full py-1 pr-3 pl-1">
                                        <img src={activeArtist.image} className="w-5 h-5 rounded-full object-cover" />
                                        <span className="text-[11px] font-bold text-black pt-0.5" style={{ lineHeight: '14px' }}>
                                            {artistPick.message}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 mb-1">
                                        <img src={activeArtist.image} className="w-5 h-5 rounded-full object-cover" />
                                        <span className="text-xs font-semibold text-zinc-300 pt-0.5">
                                            Posted by {activeArtist.name}
                                        </span>
                                    </div>
                                )}
                                <p className="font-semibold text-white">{artistPickItem.title}</p>
                                <p className="text-sm text-zinc-400">
                                    {'songIds' in artistPickItem ? artistPickItem.type : 'Single'}
                                </p>
                            </div>
                        </button>
                    </div>
                )}


                {/* Popular Releases */}
                {popularReleases.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Popular releases</h2>
                            <button onClick={handleShowDiscography} className="text-xs font-semibold text-zinc-400 hover:text-white">Show all</button>
                        </div>
                        <div className="space-y-4">
                            {popularReleases.map(release => (
                                <PopularReleaseItem key={release.id} release={release} isLatest={release.isLatest} onClick={() => handleShowReleaseDetail(release.id)}/>
                            ))}
                        </div>
                        <div className="text-center pt-4">
                            <button onClick={handleShowDiscography} className="px-6 py-2 border border-zinc-400 rounded-full text-sm font-semibold hover:border-white hover:scale-105 transition-transform">
                                See discography
                            </button>
                        </div>
                    </div>
                )}

                {/* Upcoming Releases */}
                {upcomingReleases.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Upcoming</h2>
                        </div>
                        <div className="space-y-4">
                            {upcomingReleases.map(({ release, releaseDate }) => (
                                <UpcomingReleaseItem 
                                    key={release.id} 
                                    release={release} 
                                    releaseDate={releaseDate} 
                                    onClick={() => {
                                        dispatch({ type: 'SELECT_RELEASE', payload: release.id });
                                        dispatch({ type: 'CHANGE_VIEW', payload: 'spotifyAlbumCountdown' });
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}
                
                {/* Appears On */}
                {appearsOnPlaylists.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">Appears on</h2>
                        <div className="flex overflow-x-auto gap-4 pb-4 snap-x">
                            {appearsOnPlaylists.map(playlist => {
                                let playlistCover = playlist.coverArt;
                                if (playlist.tracks && playlist.tracks.length > 0) {
                                    const topTrack = playlist.tracks[0];
                                    if (topTrack.artistId !== 'unknown') {
                                        const topPlayerArtist = allPlayerArtists.find(a => a.id === topTrack.artistId);
                                        if (topPlayerArtist) playlistCover = topPlayerArtist.image;
                                    } else {
                                        playlistCover = NPC_ARTIST_IMAGES?.[topTrack.artistName] || topTrack.coverArt || playlist.coverArt;
                                    }
                                }
                                return (
                                <div key={playlist.id} onClick={() => handleShowPlaylistDetail(playlist.id)} className="min-w-[140px] max-w-[140px] flex-shrink-0 snap-start bg-zinc-800/40 p-3 rounded-md hover:bg-zinc-800 transition-colors cursor-pointer group">
                                    <div className="relative w-full aspect-square bg-[#282828] rounded-md mb-3 shadow-lg overflow-hidden">
                                        <SpotifyPlaylistCover 
                                            name={playlist.name} 
                                            imageUrl={playlistCover} 
                                            size="small" 
                                        />
                                    </div>
                                    <h3 className="font-bold text-sm truncate">{playlist.name}</h3>
                                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-tight flex flex-col gap-1">
                                        <span>Position: #{playlist.artistPosition}</span>
                                        <span>{formatNumber(playlist.followers)} likes</span>
                                    </p>
                                </div>
                            )})}
                        </div>
                    </div>
                )}
                
                
                {/* Music Videos Section */}
                {activeArtistData.videos?.filter(v => v.isOnSpotify && v.type === 'Music Video').length > 0 && (
                    <div className="space-y-4 pt-4">
                        <h2 className="text-2xl font-bold">Music videos</h2>
                        <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar snap-x">
                            {activeArtistData.videos.filter(v => v.isOnSpotify && v.type === 'Music Video').map(video => (
                                <div key={video.id} className="min-w-[280px] w-[280px] sm:min-w-[320px] sm:w-[320px] snap-center group relative cursor-pointer flex-shrink-0 rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-[1.02]">
                                    <div className="aspect-video w-full bg-zinc-800 relative">
                                        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
                                        <div className="absolute bottom-2 right-2 bg-black/70 rounded p-1">
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-[#181818] h-full">
                                        <p className="font-bold text-white truncate text-base mb-1 group-hover:underline">{video.title}</p>
                                        <p className="text-sm text-zinc-400 truncate">{activeArtist.name} • {formatNumber(video.spotifyViews || 0)} views</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Watch More Section */}
                {activeArtistData.videos?.filter(v => v.isOnSpotify && v.type !== 'Music Video').length > 0 && (
                    <div className="space-y-4 pt-4">
                        <h2 className="text-2xl font-bold">Watch more from {activeArtist.name}</h2>
                        <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar snap-x">
                            {activeArtistData.videos.filter(v => v.isOnSpotify && v.type !== 'Music Video').map(video => (
                                <div key={video.id} className="min-w-[280px] w-[280px] sm:min-w-[320px] sm:w-[320px] snap-center group relative cursor-pointer flex-shrink-0 rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-[1.02]">
                                    <div className="aspect-video w-full bg-zinc-800 relative">
                                        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
                                        <div className="absolute bottom-2 right-2 bg-black/70 rounded p-1">
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-[#181818] h-full">
                                        <p className="font-bold text-white truncate text-base mb-1 group-hover:underline">{video.title}</p>
                                        <p className="text-sm text-zinc-400 truncate">{activeArtist.name} • {formatNumber(video.spotifyViews || 0)} views</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* About Section */}
                <div className="space-y-4 pt-4">
                    <h2 className="text-2xl font-bold">About</h2>
                    <div 
                        className="bg-[#282828] rounded-xl overflow-hidden cursor-pointer hover:bg-[#3E3E3E] transition-colors relative"
                        onClick={() => setShowAboutModal(true)}
                    >
                        <div className="h-64 sm:h-80 w-full">
                            <img 
                                src={(activeArtistData.aboutImages && activeArtistData.aboutImages.length > 0) ? activeArtistData.aboutImages[0] : activeArtist.image} 
                                className="w-full h-full object-cover" 
                                alt={`${activeArtist.name} about`} 
                            />
                        </div>
                        <div className="p-4" style={{ background: 'linear-gradient(to top, #282828 100%, transparent) -mt-10' }}>
                            {getSpotifyRank(monthlyListeners) !== null && (
                                <p className="text-sm font-semibold mb-1">#{getSpotifyRank(monthlyListeners)} in Top Artists</p>
                            )}
                            <div className="flex justify-between items-center mb-1">
                                <div className="flex items-center gap-1">
                                    <h3 className="text-xl font-bold">{activeArtist.name}</h3>
                                    {activeArtistData.isSpotifyVerified && (
                                        <div className="ml-1 flex items-center">
                                            <VerifiedBadgeIcon className="w-5 h-5 text-[#A0D9B1]" />
                                        </div>
                                    )}
                                </div>
                                <button className="border border-zinc-400 rounded-full px-4 py-1 text-sm font-semibold hover:border-white">
                                    Follow
                                </button>
                            </div>
                            <p className="text-sm text-zinc-400 mb-4">{monthlyListeners >= 1000000 ? `${(monthlyListeners / 1000000).toFixed(1).replace(/\.0$/, '')}M` : monthlyListeners.toLocaleString()} monthly listeners</p>
                            
                            {activeArtistData.aboutBio && (
                                <p className="text-sm line-clamp-3 text-zinc-300">
                                    {activeArtistData.aboutBio}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

            </div>

            <AboutModal 
                isOpen={showAboutModal} 
                onClose={() => setShowAboutModal(false)}
                artistData={activeArtistData}
                artist={activeArtist}
            />
        </div>
    );
};

export default SpotifyView;
