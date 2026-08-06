
import React, { useMemo, useState, ChangeEvent } from 'react';
import { useGame, formatNumber } from '../context/GameContext';
import { LABELS } from '../constants';
import type { Release, Song } from '../types';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';
import InformationCircleIcon from './icons/InformationCircleIcon';
import WikipediaIcon from './icons/WikipediaIcon';
import GrammyAwardIcon from './icons/GrammyAwardIcon';
import ChartBarIcon from './icons/ChartBarIcon';
import BanknotesIcon from './icons/BanknotesIcon';
import ConfirmationModal from './ConfirmationModal';
import { getEraConfiguration } from '../utils/eraUtils';

const AlbumCertificationBadge: React.FC<{ streams: number, sales?: number }> = ({ streams, sales = 0 }) => {
    const units = Math.floor(streams / 1500) + sales;
    const DIAMOND = 10_000_000;
    const PLATINUM = 1_000_000;
    const GOLD = 500_000;

    let cert = null;
    if (units >= DIAMOND) {
        const multiplier = Math.floor(units / DIAMOND);
        cert = { text: `${multiplier}x Diamond`, color: 'bg-cyan-400 text-black' };
    } else if (units >= PLATINUM) {
        const multiplier = Math.floor(units / PLATINUM);
        cert = { text: `${multiplier}x Platinum`, color: 'bg-slate-300 text-black' };
    } else if (units >= GOLD) {
        cert = { text: 'Gold', color: 'bg-yellow-400 text-black' };
    }

    if (!cert) return null;

    return (
        <span className={`px-2 py-1 text-xs font-bold rounded-full ${cert.color}`}>
            {cert.text}
        </span>
    );
};

const SongCertificationBadge: React.FC<{ streams: number, sales?: number }> = ({ streams, sales = 0 }) => {
    const units = Math.floor(streams / 150) + sales;
    const DIAMOND = 10_000_000;
    const PLATINUM = 1_000_000;
    const GOLD = 500_000;

    let cert = null;
    if (units >= DIAMOND) {
        cert = { text: 'Diamond', color: 'bg-cyan-400 text-black' };
    } else if (units >= PLATINUM) {
        const multiplier = Math.floor(units / PLATINUM);
        cert = { text: `${multiplier}x Platinum`, color: 'bg-slate-300 text-black' };
    } else if (units >= GOLD) {
        cert = { text: 'Gold', color: 'bg-yellow-400 text-black' };
    }

    if (!cert) return null;

    return (
        <span className={`px-2 py-1 text-xs font-bold rounded-full ${cert.color}`}>
            {cert.text}
        </span>
    );
};

const StatPill: React.FC<{ label: string; value: string | number | null }> = ({ label, value }) => {
    if (value === null || value === undefined) return null;
    return (
        <div className="text-center bg-zinc-700 p-2 rounded-md">
            <p className="text-xs text-zinc-400 font-semibold uppercase">{label}</p>
            <p className="text-lg font-bold">#{value}</p>
        </div>
    );
};

const ItunesVersionManager: React.FC<{ song: Song }> = ({ song }) => {
    const { dispatch } = useGame();
    const [itunesTitle, setItunesTitle] = useState(`${song.title} (Acoustic Version)`);
    const [itunesCover, setItunesCover] = useState(song.coverArt);
    const [itunesPrice, setItunesPrice] = useState(1.29);

    const handleReleaseItunes = () => {
        dispatch({ type: 'RELEASE_ITUNES_VERSION', payload: { songId: song.id, title: itunesTitle, coverArt: itunesCover, price: itunesPrice } });
    };

    const handleItunesCoverUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setItunesCover(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="col-span-2 mt-4 space-y-2 border-t border-zinc-700/50 pt-2">
            <p className="font-bold text-xs text-zinc-400 uppercase tracking-wider">Release iTunes Version</p>
            <p className="text-[10px] text-zinc-500 leading-tight">These chart exclusively on iTunes & boost original Hot 100 standing (Max 10).</p>
            {(!song.itunesVersions || song.itunesVersions.length < 10) ? (
                <div className="space-y-2 bg-zinc-900 p-2 rounded">
                    <div>
                        <label className="text-[10px] text-zinc-400 block mb-1">Title</label>
                        <input type="text" className="w-full bg-zinc-800 text-white rounded p-1 text-xs" value={itunesTitle} onChange={(e) => setItunesTitle(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="text-[10px] text-zinc-400 block mb-1">Cover Art</label>
                            <label className="w-full bg-zinc-800 text-white rounded p-1 text-xs cursor-pointer block text-center hover:bg-zinc-700">
                                Upload Image
                                <input type="file" className="hidden" accept="image/*" onChange={handleItunesCoverUpload} />
                            </label>
                        </div>
                        <div>
                            <label className="text-[10px] text-zinc-400 block mb-1">Price</label>
                            <select 
                                className="w-full bg-zinc-800 text-white rounded p-1 text-xs" 
                                value={itunesPrice} 
                                onChange={(e) => setItunesPrice(Number(e.target.value))}
                            >
                                <option value={0.69}>$0.69</option>
                                <option value={0.99}>$0.99</option>
                                <option value={1.29}>$1.29</option>
                            </select>
                        </div>
                    </div>
                    {itunesCover && itunesCover !== song.coverArt && (
                        <p className="text-[10px] text-green-400 text-right">Custom cover selected</p>
                    )}
                    <button onClick={handleReleaseItunes} className="w-full bg-rose-600/30 text-rose-400 hover:bg-rose-600 hover:text-white py-1 rounded text-xs font-bold transition-colors">
                        Release Version
                    </button>
                </div>
            ) : (
                <p className="text-xs text-rose-400">Max iTunes versions reached (10).</p>
            )}
            {(song.itunesVersions?.length || 0) > 0 && (
                <div className="space-y-1 mt-2">
                    <p className="text-[10px] text-zinc-400 font-bold mb-1 border-b border-zinc-800 pb-1">Released iTunes Versions:</p>
                    {song.itunesVersions?.map(iv => (
                        <div key={iv.id} className="flex gap-2 items-center text-[10px] bg-zinc-900/50 p-1.5 rounded pr-2">
                            <img src={iv.coverArt} className="w-6 h-6 object-cover rounded-sm border border-zinc-700" />
                            <div className="flex-1 min-w-0">
                                <p className="truncate font-semibold">{iv.title}</p>
                                <p className="text-zinc-500">{formatNumber(iv.sales)} sales</p>
                            </div>
                            <div className="flex gap-1 items-center">
                                <select 
                                    className="bg-zinc-800 border-none text-[10px] p-1 rounded" 
                                    value={iv.price} 
                                    onChange={(e) => dispatch({ type: 'EDIT_ITUNES_VERSION', payload: { songId: song.id, versionId: iv.id, price: Number(e.target.value) } })}
                                >
                                    <option value={0.69}>$0.69</option>
                                    <option value={0.99}>$0.99</option>
                                    <option value={1.29}>$1.29</option>
                                </select>
                                <button 
                                    onClick={() => dispatch({ type: 'REMOVE_ITUNES_VERSION', payload: { songId: song.id, versionId: iv.id } })}
                                    className="text-red-400 hover:text-red-300 bg-red-400/10 hover:bg-red-400/20 px-1 py-1 rounded"
                                    title="Take Down"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

interface TrackItemProps {
    onCoverChange: (songId: string, e: React.ChangeEvent<HTMLInputElement>) => void;
    song: Song;
    chartInfo: { peak: number | null; current: number | null };
    isExpanded: boolean;
    onToggleExpand: () => void;
    grammyWin?: string;
    canTakeDown?: boolean;
    onTakeDown: () => void;
    onBuyBack: () => void;
    isStreamingActive?: boolean;
}

const TrackItem: React.FC<TrackItemProps> = ({ song, chartInfo, isExpanded, onToggleExpand, grammyWin, canTakeDown, onTakeDown, onBuyBack, isStreamingActive, onCoverChange }) => {

    return (
        <div className={`bg-zinc-800/50 p-2 rounded-lg ${song.isTakenDown ? 'opacity-60' : ''}`}>
            <div className="flex items-center gap-3">
                <label htmlFor={`song-cover-upload-${song.id}`} className="cursor-pointer group relative flex-shrink-0">
                    <img src={song.coverArt} alt={song.title} className="w-10 h-10 rounded-sm object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-sm">
                        <span className="text-white text-[8px] font-bold">Edit</span>
                    </div>
                    <input
                        type="file"
                        id={`song-cover-upload-${song.id}`}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => onCoverChange(song.id, e)}
                    />
                </label>
                <div className="flex-grow">
                    <div className="flex items-center gap-2">
                         <p className="font-semibold">{song.title}</p>
                         {grammyWin && <GrammyAwardIcon className="w-4 h-4 text-yellow-400" title={`GRAMMY Winner: ${grammyWin}`} />}
                         {song.isTakenDown && <span className="text-[10px] font-bold bg-red-900/80 text-red-400 px-1.5 py-0.5 rounded-full">TAKEN DOWN</span>}
                    </div>
                    <p className="text-sm text-zinc-400">
                        {isStreamingActive ? `${formatNumber(song.streams)} streams & ${formatNumber(song.sales || 0)} sales` : `${formatNumber(song.sales || 0)} sales`}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <SongCertificationBadge streams={song.streams} sales={song.sales} />
                    <button onClick={onToggleExpand} className="p-1 text-zinc-400 hover:text-white">
                        <InformationCircleIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
            {isExpanded && (
                <div className="mt-2 pt-2 border-t border-zinc-700/50 text-sm text-zinc-300 grid grid-cols-2 gap-x-4 gap-y-1 px-1">
                     <p className="font-semibold text-zinc-400">Current Position:</p>
                     <p className="font-bold text-right">#{chartInfo.current ?? 'N/A'}</p>
                     <p className="font-semibold text-zinc-400">Peak Position:</p>
                     <p className="font-bold text-right">#{chartInfo.peak ?? 'N/A'}</p>
                     
                     <ItunesVersionManager song={song} />

                     {canTakeDown && !song.isTakenDown && (
                         <div className="col-span-2 mt-2">
                             <button onClick={onTakeDown} className="w-full bg-red-600/20 hover:bg-red-600/40 text-red-400 py-1 rounded-md text-xs font-bold transition-colors">
                                 Take Down
                             </button>
                         </div>
                     )}
                     {song.isTakenDown && (
                         <div className="col-span-2 mt-2">
                             <button onClick={onBuyBack} className="w-full bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 py-1 rounded-md text-xs font-bold transition-colors">
                                 Buy Back & Own 100%
                             </button>
                         </div>
                     )}
                </div>
            )}
        </div>
    );
};


const PostAlbumSingleManager: React.FC<{ project: Release, allReleases: Release[] }> = ({ project, allReleases }) => {
    const { gameState, dispatch, activeArtistData } = useGame();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedTrackId, setSelectedTrackId] = useState<string>('');
    const [releaseOffset, setReleaseOffset] = useState<number>(1);
    const [customCover, setCustomCover] = useState<string>('');

    if (!activeArtistData) return null;

    // Filter tracks that are not already released as singles
    const eligibleTracks = project.songIds.map(id => activeArtistData.songs.find(s => s.id === id)).filter((song): song is Song => {
        if (!song) return false;
        // If the song's current releaseId points to a Single release, it's already a single
        const mainRelease = allReleases.find(r => r.id === song.releaseId);
        return mainRelease?.type !== 'Single';
    });

    if (eligibleTracks.length === 0) return null;

    const handleCoverUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setCustomCover(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRelease = () => {
        if (!selectedTrackId) return;
        const targetWeek = gameState.date.week + releaseOffset;
        const targetYear = gameState.date.year + Math.floor(targetWeek / 53);
        const normalizedWeek = targetWeek % 53 || 1;

        dispatch({
            type: 'RELEASE_POST_ALBUM_SINGLE',
            payload: {
                projectId: project.id,
                songId: selectedTrackId,
                coverArt: customCover || project.coverArt,
                releaseDate: { week: normalizedWeek, year: targetYear }
            }
        });
        setIsMenuOpen(false);
        setSelectedTrackId('');
        setCustomCover('');
    };

    return (
        <div className="mb-4 bg-zinc-900/50 p-3 rounded-lg border border-zinc-700">
            <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-full flex items-center justify-between text-sm font-semibold text-zinc-300 hover:text-white"
            >
                <span>🚀 Release a New Single from this Project</span>
                <ChevronDownIcon className={`w-5 h-5 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            {isMenuOpen && (
                <div className="mt-3 space-y-3">
                    <div>
                        <label className="text-xs text-zinc-400 block mb-1">Select Track</label>
                        <select 
                            className="w-full bg-zinc-800 text-white rounded p-2 text-sm border border-zinc-700"
                            value={selectedTrackId}
                            onChange={(e) => setSelectedTrackId(e.target.value)}
                        >
                            <option value="">-- Choose a Track --</option>
                            {eligibleTracks.map(t => (
                                <option key={t.id} value={t.id}>{t.title}</option>
                            ))}
                        </select>
                    </div>
                    {selectedTrackId && (
                        <>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-zinc-400 block mb-1">Release Timing</label>
                                    <select 
                                        className="w-full bg-zinc-800 text-white rounded p-2 text-sm border border-zinc-700"
                                        value={releaseOffset}
                                        onChange={(e) => setReleaseOffset(Number(e.target.value))}
                                    >
                                        <option value={1}>Next Week</option>
                                        <option value={2}>In 2 Weeks</option>
                                        <option value={3}>In 3 Weeks</option>
                                        <option value={4}>In 4 Weeks</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-zinc-400 block mb-1">Single Cover Art</label>
                                    <label className="w-full bg-zinc-800 text-white rounded p-2 text-sm cursor-pointer block text-center hover:bg-zinc-700 border border-zinc-700 transition-colors">
                                        {customCover ? 'Cover Selected' : 'Upload Cover'}
                                        <input type="file" className="hidden" accept="image/*" onChange={handleCoverUpload} />
                                    </label>
                                    <p className="text-[10px] text-zinc-500 mt-1 text-center">Defaults to project cover</p>
                                </div>
                            </div>
                            <button 
                                onClick={handleRelease}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded font-bold text-sm transition-colors mt-2"
                            >
                                Schedule Single Release
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

const CatalogView: React.FC = () => {
    const { gameState, dispatch, activeArtistData, activeArtist } = useGame();
    const { billboardHot100, chartHistory, billboardTopAlbums, albumChartHistory } = gameState;
    const [expandedProjectIds, setExpandedProjectIds] = useState<Set<string>>(new Set());
    const [expandedTrackId, setExpandedTrackId] = useState<string | null>(null);
    const [expandedSingleId, setExpandedSingleId] = useState<string | null>(null);
    const [takeDownTarget, setTakeDownTarget] = useState<{ type: 'song' | 'release', id: string, title: string } | null>(null);
    const [rightsTarget, setRightsTarget] = useState<{ type: 'song' | 'release', item: Song | Release } | null>(null);
    const [confirmAction, setConfirmAction] = useState<{ action: () => void, message: string, title: string, confirmText: string } | null>(null);

    const eraConfig = useMemo(() => getEraConfiguration(gameState.date.year), [gameState.date.year]);

    if (!activeArtistData || !activeArtist) return null;

    const { grammyHistory } = activeArtistData;
    const canTakeDown = !activeArtistData.contract || activeArtistData.customLabels.length > 0;

    const allSongs = Object.values(gameState.artistsData).flatMap(d => d.songs);
    const allReleases = Object.values(gameState.artistsData).flatMap(d => d.releases);

    const songsForArtist = useMemo(() => {
        return allSongs.filter(s => s.artistId === activeArtist.id || s.collaboration?.artistName === activeArtist.name || (s.features && s.features.includes(activeArtist.name)));
    }, [allSongs, activeArtist]);

    
    const handleSongCoverArtChange = (songId: string, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const newCoverArt = reader.result as string;
                dispatch({ type: 'UPDATE_SONG_COVER_ART', payload: { songId, newCoverArt } });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCoverArtChange = (e: React.ChangeEvent<HTMLInputElement>, releaseId: string) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const newCoverArt = reader.result as string;
                dispatch({ type: 'UPDATE_RELEASE_COVER_ART', payload: { releaseId, newCoverArt } });
            };
            reader.readAsDataURL(file);
        }
    };

    const releasedSingles = useMemo(() => {
        return songsForArtist
            .filter(s => {
                const release = allReleases.find(r => r.id === s.releaseId);
                return s.isReleased && release?.type === 'Single';
            })
            .map(s => {
                const merchUnits = activeArtistData.merch
                    .filter(m => m.releaseId === s.releaseId)
                    .reduce((sum, m) => sum + (m.unitsSold || 0), 0);
                return { ...s, streams: s.streams, sales: (s.sales || 0) + merchUnits };
            })
            .sort((a, b) => ((b.streams || 0) + (b.sales || 0) * 150) - ((a.streams || 0) + (a.sales || 0) * 150));
    }, [songsForArtist, allReleases, activeArtistData.merch]);
    
    const releasedProjects = useMemo(() => {
        const projects = activeArtistData.releases
            .filter(r => (r.type === 'EP' || r.type === 'Album' || r.standardEditionId || r.type === 'Compilation' || r.type === 'Live Album') && !r.soundtrackInfo);
            
        const deluxeMap = new Map<string, Release>();
        projects.forEach(p => {
            if (p.standardEditionId && p.standardEditionId) {
                deluxeMap.set(p.standardEditionId, p);
            }
        });
        
        return projects
            .filter(r => !(r.standardEditionId && r.standardEditionId))
            .map(release => {
                const deluxeVersion = deluxeMap.get(release.id);
                const songsToCount = deluxeVersion ? deluxeVersion.songIds : release.songIds;

                const releaseStreams = Math.max(0, songsToCount.reduce((total, songId) => {
                    const song = activeArtistData.songs.find(s => s.id === songId);
                    return total + (song?.streams || 0);
                }, 0) - (release.preReleaseStreams || 0));
                
                const rawSingleSales = songsToCount.reduce((total, songId) => {
                    const song = activeArtistData.songs.find(s => s.id === songId);
                    return total + (song?.sales || 0);
                }, 0);
                const trackEquivalentAlbumSales = Math.floor(Math.max(0, rawSingleSales - (release.preReleaseSales || 0)) * 0.1);

                return { ...release, streams: releaseStreams, sales: (release.sales || 0) + trackEquivalentAlbumSales, hasDeluxe: !!deluxeVersion, deluxeSongIds: deluxeVersion?.songIds };
            })
            .sort((a, b) => ((b.streams || 0) + (b.sales || 0) * 150) - ((a.streams || 0) + (a.sales || 0) * 150));
    }, [activeArtistData.releases, activeArtistData.songs, activeArtistData.merch]);
    
    const handleToggleExpand = (projectId: string) => {
        setExpandedProjectIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(projectId)) {
                newSet.delete(projectId);
            } else {
                newSet.add(projectId);
            }
            return newSet;
        });
    };

    const handleToggleTrackInfo = (songId: string) => {
        setExpandedTrackId(prevId => (prevId === songId ? null : songId));
    };
    
    const findGrammyWin = (itemId: string, itemType: 'song' | 'album') => {
        const win = grammyHistory.find(g => g.itemId === itemId && g.isWinner);
        return win?.category;
    }

    return (
        <div className="h-full w-full bg-zinc-900 overflow-y-auto">
            <header className="p-4 flex items-center gap-4 sticky top-0 bg-zinc-900/80 backdrop-blur-sm z-10 border-b border-zinc-700/50">
                <button onClick={() => dispatch({type: 'CHANGE_VIEW', payload: 'game'})} className="p-2 rounded-full hover:bg-white/10">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold">Your Catalog</h1>
                    {gameState.difficultyMode && (
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-0.5">
                            {gameState.difficultyMode} MODE
                        </p>
                    )}
                </div>
            </header>
            <div className="p-4 space-y-8">
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Projects (EPs & Albums)</h2>
                        <button
                            onClick={() => dispatch({ type: 'CHANGE_VIEW', payload: 'albumSalesChart' })}
                            className="flex items-center gap-2 bg-zinc-700/50 hover:bg-zinc-700 text-zinc-300 text-sm font-semibold p-2 rounded-md transition-colors"
                        >
                            <ChartBarIcon className="w-5 h-5" />
                            Sales Chart
                        </button>
                    </div>
                    {releasedProjects.length > 0 ? (
                        <div className="space-y-3">
                            {releasedProjects.map(project => {
                                const isExpanded = expandedProjectIds.has(project.id);
                                const totalUnits = Math.floor(project.streams / 1500) + ((project as any).sales || 0);
                                const albumChartEntry = billboardTopAlbums.find(e => e.albumId === project.id);
                                const albumHistory = albumChartHistory[project.id];
                                const albumChartInfo = {
                                    peak: albumHistory?.peak ?? null,
                                    current: albumChartEntry?.rank ?? null,
                                };
                                const grammyWin = findGrammyWin(project.id, 'album');
                                const isTakenDown = project.isTakenDown;
                                return (
                                    <div key={project.id} className={`bg-zinc-800 p-3 rounded-lg relative ${isTakenDown ? 'opacity-50' : ''}`}>
                                        {isTakenDown && <div className="absolute top-2 right-2 text-xs font-bold bg-red-900/80 text-red-400 px-2 py-1 rounded-full z-10">TAKEN DOWN</div>}
                                        <div className="flex items-center gap-4">
                                            <div onClick={() => document.getElementById(`cover-upload-album-${project.id}`)?.click()} className="cursor-pointer group relative flex-shrink-0">
                                                <img src={project.coverArt} alt={project.title} className="w-20 h-20 rounded-md object-cover"/>
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                                                    <span className="text-white text-xs font-bold">Change</span>
                                                </div>
                                                <input
                                                    type="file"
                                                    id={`cover-upload-album-${project.id}`}
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={(e) => handleCoverArtChange(e, project.id)}
                                                />
                                            </div>
                                            <div className="flex-grow">
                                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                    <p className="font-bold text-lg">{project.title} {(project as any).hasDeluxe ? '(Deluxe)' : ''}</p>
                                                    {grammyWin && <GrammyAwardIcon className="w-5 h-5 text-yellow-400" title={`GRAMMY Winner: ${grammyWin}`} />}
                                                    <AlbumCertificationBadge streams={project.streams} sales={(project as any).sales} />
                                                </div>
                                                <p className="text-sm text-zinc-400">{formatNumber(totalUnits)} total units</p>
                                                {eraConfig.streamingActive && (
                                                    <p className="text-xs text-zinc-500 mt-0.5">{formatNumber(project.streams)} streams & {formatNumber((project as any).sales || 0)} sales</p>
                                                )}
                                                <div className="mt-2 grid grid-cols-2 gap-2 max-w-xs">
                                                    <StatPill label="Album Chart" value={albumChartInfo.current} />
                                                    <StatPill label="Peak" value={albumChartInfo.peak} />
                                                </div>
                                                <div className="mt-3 flex items-center gap-2">
                                                    <button onClick={() => document.getElementById(`cover-upload-album-${project.id}`)?.click()} className="bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-1 rounded-md text-xs font-bold transition-colors">
                                                        Edit Cover
                                                    </button>
                                                    {canTakeDown && !isTakenDown && (
                                                        <button onClick={() => setTakeDownTarget({ type: 'release', id: project.id, title: project.title })} className="bg-red-600/20 hover:bg-red-600/40 text-red-400 px-3 py-1 rounded-md text-xs font-bold transition-colors">
                                                            Take Down
                                                        </button>
                                                    )}
                                                </div>
                                                {isTakenDown && (
                                                    <div className="mt-3 flex items-center gap-2">
                                                        <button 
                                                            onClick={() => {
                                                                const totalRev = project.songIds.reduce((sum, sId) => {
                                                                    const s = activeArtistData.songs.find(sg => sg.id === sId);
                                                                    return sum + (s?.revenue || 0);
                                                                }, 0);
                                                                const cost = Math.floor(Math.max(2500000, totalRev * 5 + (activeArtistData.popularity * 100000)));
                                                                if (activeArtistData.money < cost) {
                                                                    alert(`Not enough money. Costs $${formatNumber(cost)}.`);
                                                                    return;
                                                                }
                                                                setConfirmAction({
                                                                    title: 'Buy Back Release',
                                                                    message: `Are you sure you want to buy back "${project.title}" for $${formatNumber(cost)}? It will be 100% owned by you.`,
                                                                    confirmText: 'Buy Back',
                                                                    action: () => {
                                                                        dispatch({ type: 'BUY_BACK_RELEASE', payload: { releaseId: project.id, cost } });
                                                                    }
                                                                });
                                                            }} 
                                                            className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 px-3 py-1 rounded-md text-xs font-bold transition-colors"
                                                        >
                                                            Buy Back & Own 100%
                                                        </button>
                                                    </div>
                                                )}
                                                {!isTakenDown && (
                                                    <div className="mt-2">
                                                        <button onClick={() => setRightsTarget({ type: 'release', item: project })} className="bg-zinc-700/50 hover:bg-zinc-700 text-zinc-300 px-3 py-1 rounded-md text-xs font-bold transition-colors flex items-center gap-1">
                                                            <BanknotesIcon className="w-3 h-3" />
                                                            Manage Rights
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            <button onClick={() => handleToggleExpand(project.id)} className="p-2 self-start">
                                                <ChevronDownIcon className={`w-6 h-6 text-zinc-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                            </button>
                                        </div>
                                        {isExpanded && (
                                            <div className="mt-3 pt-3 border-t border-zinc-700 space-y-2">
                                                {!isTakenDown && <PostAlbumSingleManager project={project} allReleases={allReleases} />}
                                                {(project as any).hasDeluxe ? (
                                                    <>
                                                        <h4 className="font-semibold text-zinc-300">Disc 1</h4>
                                                        {project.songIds.map(songId => {
                                                            const song = activeArtistData.songs.find(s => s.id === songId);
                                                            if (!song) return null;
                                                            const trackChartInfo = { peak: chartHistory[song.id]?.peak ?? null, current: billboardHot100.find(e => e.songId === song.id)?.rank ?? null };
                                                            return (
                                                                <TrackItem
                                                                onCoverChange={handleSongCoverArtChange}
                                                                key={song.id} song={song} chartInfo={trackChartInfo} isExpanded={expandedTrackId === song.id} onToggleExpand={() => handleToggleTrackInfo(song.id)}
                                                                    grammyWin={findGrammyWin(song.id, 'song')} canTakeDown={canTakeDown} onTakeDown={() => setTakeDownTarget({ type: 'song', id: song.id, title: song.title })}
                                                                    onBuyBack={() => {
    const totalRev = song.revenue || 0;
    const cost = Math.floor(Math.max(500000, totalRev * 5 + (activeArtistData.popularity * 25000)));
    if (activeArtistData.money < cost) {
        alert(`Not enough money. Costs $${formatNumber(cost)}.`);
        return;
    }
    setConfirmAction({
        title: 'Buy Back Song',
        message: `Are you sure you want to buy back "${song.title}" for $${formatNumber(cost)}? It will be 100% owned by you.`,
        confirmText: 'Buy Back',
        action: () => {
            dispatch({ type: 'BUY_BACK_SONG', payload: { songId: song.id, cost } });
        }
    });
}} isStreamingActive={eraConfig.streamingActive}
                                                                />
                                                            );
                                                        })}
                                                        <h4 className="font-semibold text-zinc-300 mt-4">Disc 2</h4>
                                                        {((project as any).deluxeSongIds || []).filter((id: string) => !project.songIds.includes(id)).map((songId: string) => {
                                                            const song = activeArtistData.songs.find(s => s.id === songId);
                                                            if (!song) return null;
                                                            const trackChartInfo = { peak: chartHistory[song.id]?.peak ?? null, current: billboardHot100.find(e => e.songId === song.id)?.rank ?? null };
                                                            return (
                                                                <TrackItem
                                                                onCoverChange={handleSongCoverArtChange}
                                                                key={song.id} song={song} chartInfo={trackChartInfo} isExpanded={expandedTrackId === song.id} onToggleExpand={() => handleToggleTrackInfo(song.id)}
                                                                    grammyWin={findGrammyWin(song.id, 'song')} canTakeDown={canTakeDown} onTakeDown={() => setTakeDownTarget({ type: 'song', id: song.id, title: song.title })}
                                                                    onBuyBack={() => {
    const totalRev = song.revenue || 0;
    const cost = Math.floor(Math.max(500000, totalRev * 5 + (activeArtistData.popularity * 25000)));
    if (activeArtistData.money < cost) {
        alert(`Not enough money. Costs $${formatNumber(cost)}.`);
        return;
    }
    setConfirmAction({
        title: 'Buy Back Song',
        message: `Are you sure you want to buy back "${song.title}" for $${formatNumber(cost)}? It will be 100% owned by you.`,
        confirmText: 'Buy Back',
        action: () => {
            dispatch({ type: 'BUY_BACK_SONG', payload: { songId: song.id, cost } });
        }
    });
}} isStreamingActive={eraConfig.streamingActive}
                                                                />
                                                            );
                                                        })}
                                                    </>
                                                ) : (
                                                    <>
                                                        <h4 className="font-semibold text-zinc-300">Tracklist</h4>
                                                        {project.songIds.map(songId => {
                                                            const song = activeArtistData.songs.find(s => s.id === songId);
                                                            if (!song) return null;
                                                            const trackChartInfo = { peak: chartHistory[song.id]?.peak ?? null, current: billboardHot100.find(e => e.songId === song.id)?.rank ?? null };
                                                            return (
                                                                <TrackItem
                                                                onCoverChange={handleSongCoverArtChange}
                                                                key={song.id} song={song} chartInfo={trackChartInfo} isExpanded={expandedTrackId === song.id} onToggleExpand={() => handleToggleTrackInfo(song.id)}
                                                                    grammyWin={findGrammyWin(song.id, 'song')} canTakeDown={canTakeDown} onTakeDown={() => setTakeDownTarget({ type: 'song', id: song.id, title: song.title })}
                                                                    onBuyBack={() => {
    const totalRev = song.revenue || 0;
    const cost = Math.floor(Math.max(500000, totalRev * 5 + (activeArtistData.popularity * 25000)));
    if (activeArtistData.money < cost) {
        alert(`Not enough money. Costs $${formatNumber(cost)}.`);
        return;
    }
    setConfirmAction({
        title: 'Buy Back Song',
        message: `Are you sure you want to buy back "${song.title}" for $${formatNumber(cost)}? It will be 100% owned by you.`,
        confirmText: 'Buy Back',
        action: () => {
            dispatch({ type: 'BUY_BACK_SONG', payload: { songId: song.id, cost } });
        }
    });
}} isStreamingActive={eraConfig.streamingActive}
                                                                />
                                                            );
                                                        })}
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => {
                                                        dispatch({ type: 'SELECT_RELEASE', payload: project.id });
                                                        dispatch({ type: 'CHANGE_VIEW', payload: 'wikipedia' });
                                                    }}
                                                    className="w-full mt-2 flex items-center justify-center gap-2 bg-zinc-700/50 hover:bg-zinc-700 text-zinc-300 text-sm font-semibold p-2 rounded-md transition-colors"
                                                >
                                                    <WikipediaIcon className="w-5 h-5" />
                                                    View Wikipedia Article
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-zinc-500 text-sm">No EPs or Albums released yet.</p>
                    )}
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-bold">Singles</h2>
                    {releasedSingles.length > 0 ? (
                        <div className="space-y-3">
                            {releasedSingles.map(song => {
                                const chartInfo = {
                                    peak: chartHistory[song.id]?.peak ?? null,
                                    current: billboardHot100.find(e => e.songId === song.id)?.rank ?? null
                                };
                                const grammyWin = findGrammyWin(song.id, 'song');
                                const isTakenDown = song.isTakenDown;
                                return (
                                    <div key={song.id} className={`bg-zinc-800 p-3 rounded-lg relative ${isTakenDown ? 'opacity-50' : ''}`}>
                                        {isTakenDown && <div className="absolute top-2 right-2 text-xs font-bold bg-red-900/80 text-red-400 px-2 py-1 rounded-full z-10">TAKEN DOWN</div>}
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-4">
                                                <div onClick={() => document.getElementById(`cover-upload-single-${song.id}`)?.click()} className="cursor-pointer group relative flex-shrink-0">
                                                    <img src={song.coverArt} alt={song.title} className="w-20 h-20 rounded-md object-cover"/>
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                                                        <span className="text-white text-xs font-bold">Change</span>
                                                    </div>
                                                    <input
                                                        type="file"
                                                        id={`cover-upload-single-${song.id}`}
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            if (song.releaseId) {
                                                                handleCoverArtChange(e, song.releaseId);
                                                            } else {
                                                                handleSongCoverArtChange(song.id, e);
                                                            }
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex-grow">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <p className="font-bold text-lg">{song.title}</p>
                                                            {grammyWin && <GrammyAwardIcon className="w-5 h-5 text-yellow-400" title={`GRAMMY Winner: ${grammyWin}`} />}
                                                            <SongCertificationBadge streams={song.streams} sales={song.sales} />
                                                        </div>
                                                        <button onClick={() => setExpandedSingleId(prev => prev === song.id ? null : song.id)} className="p-2 self-start text-zinc-400 hover:text-white">
                                                            <ChevronDownIcon className={`w-6 h-6 transition-transform ${expandedSingleId === song.id ? 'rotate-180' : ''}`} />
                                                        </button>
                                                    </div>
                                                    <p className="text-sm text-zinc-400">
                                                        {eraConfig.streamingActive ? `${formatNumber(song.streams)} streams & ${formatNumber(song.sales || 0)} sales` : `${formatNumber(song.sales || 0)} sales`}
                                                    </p>
                                                    <div className="mt-2 grid grid-cols-2 gap-2 max-w-xs">
                                                        <StatPill label="Current" value={chartInfo.current} />
                                                        <StatPill label="Peak" value={chartInfo.peak} />
                                                    </div>
                                                    {canTakeDown && !isTakenDown && (
                                                        <div className="mt-3 flex items-center gap-2">
                                                            <button onClick={() => setTakeDownTarget({ type: 'song', id: song.id, title: song.title })} className="bg-red-600/20 hover:bg-red-600/40 text-red-400 px-3 py-1 rounded-md text-xs font-bold transition-colors">
                                                                Take Down
                                                            </button>
                                                        </div>
                                                    )}
                                                    {isTakenDown && (
                                                        <div className="mt-3 flex items-center gap-2">
                                                            <button 
                                                                onClick={() => {
                                                                    const totalRev = song.revenue || 0;
                                                                    const cost = Math.floor(Math.max(500000, totalRev * 5 + (activeArtistData.popularity * 25000)));
                                                                    if (activeArtistData.money < cost) {
                                                                        alert(`Not enough money. Costs $${formatNumber(cost)}.`);
                                                                        return;
                                                                    }
                                                                    setConfirmAction({
                                                                        title: 'Buy Back Song',
                                                                        message: `Are you sure you want to buy back "${song.title}" for $${formatNumber(cost)}? It will be 100% owned by you.`,
                                                                        confirmText: 'Buy Back',
                                                                        action: () => {
                                                                            dispatch({ type: 'BUY_BACK_SONG', payload: { songId: song.id, cost } });
                                                                        }
                                                                    });
                                                                }} 
                                                                className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 px-3 py-1 rounded-md text-xs font-bold transition-colors"
                                                            >
                                                                Buy Back & Own 100%
                                                            </button>
                                                        </div>
                                                    )}
                                                    {!isTakenDown && (
                                                        <div className="mt-2">
                                                            <button onClick={() => setRightsTarget({ type: 'song', item: song })} className="bg-zinc-700/50 hover:bg-zinc-700 text-zinc-300 px-3 py-1 rounded-md text-xs font-bold transition-colors flex items-center gap-1">
                                                                <BanknotesIcon className="w-3 h-3" />
                                                                Manage Rights
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            {expandedSingleId === song.id && (
                                                <div className="pl-24 mt-2">
                                                    <ItunesVersionManager song={song} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-zinc-500 text-sm">No Singles released yet.</p>
                    )}
                </div>
            </div>
            <ConfirmationModal
                isOpen={takeDownTarget !== null}
                onClose={() => setTakeDownTarget(null)}
                onConfirm={() => {
                    if (takeDownTarget) {
                        if (takeDownTarget.type === 'song') {
                            dispatch({ type: 'TAKE_DOWN_SONG', payload: { songId: takeDownTarget.id } });
                        } else {
                            dispatch({ type: 'TAKE_DOWN_RELEASE', payload: { releaseId: takeDownTarget.id } });
                        }
                        setTakeDownTarget(null);
                    }
                }}
                title="Take Down Release"
                message={`Are you sure you want to take down "${takeDownTarget?.title}"? This action cannot be undone and the release will no longer generate streams or revenue.`}
                confirmText="Take Down"
            />

            <ConfirmationModal
                isOpen={confirmAction !== null}
                onClose={() => setConfirmAction(null)}
                onConfirm={() => {
                    if (confirmAction) {
                        confirmAction.action();
                        setConfirmAction(null);
                    }
                }}
                title={confirmAction?.title || "Confirm Action"}
                message={confirmAction?.message || "Are you sure you want to proceed?"}
                confirmText={confirmAction?.confirmText || "Confirm"}
            />

            {rightsTarget && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                    <div className="bg-zinc-900 border border-zinc-700 rounded-lg max-w-md w-full p-6 space-y-4">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-xl font-bold">Manage Rights</h2>
                            <button onClick={() => setRightsTarget(null)} className="text-zinc-500 hover:text-white">✕</button>
                        </div>
                        <div className="flex gap-4 items-center">
                             <img src={rightsTarget.item.coverArt} className="w-16 h-16 rounded-md object-cover" />
                             <div>
                                 <p className="font-bold">{rightsTarget.item.title}</p>
                                 <p className="text-sm text-zinc-400 capitalize">{rightsTarget.type}</p>
                             </div>
                        </div>

                        {(() => {
                            const item = rightsTarget.item;
                            let totalRev = 0;
                            if (rightsTarget.type === 'song') {
                                totalRev = (item as Song).revenue || 0;
                            } else {
                                const release = item as Release;
                                totalRev = release.songIds.reduce((sum, sId) => {
                                    const s = activeArtistData.songs.find(sg => sg.id === sId);
                                    return sum + (s?.revenue || 0);
                                }, 0);
                            }

                            const currentSoldPercent = item.rightsSoldPercent || 0;
                            const ownerLabel = item.rightsOwnerLabelId ? LABELS.find(l => l.id === item.rightsOwnerLabelId) : null;
                            const isIndependent = !activeArtistData.contract || activeArtistData.customLabels.length > 0;

                            const activeLabel = activeArtistData.contract && !activeArtistData.contract.isCustom 
                                ? LABELS.find(l => l.id === activeArtistData.contract!.labelId) 
                                : null;

                            return (
                                <div className="space-y-4 text-sm mt-4">
                                    <div className="bg-zinc-800 p-3 rounded-md">
                                        <p className="text-zinc-400">Total Lifetime Revenue</p>
                                        <p className="text-2xl font-bold text-green-400">${formatNumber(Math.floor(totalRev))}</p>
                                    </div>

                                    <div className="bg-zinc-800 p-3 rounded-md flex justify-between items-center">
                                        <div>
                                            <p className="text-zinc-400">Your Ownership</p>
                                            <p className="text-lg font-bold text-white">{100 - currentSoldPercent}%</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-zinc-400">Sold To</p>
                                            <p className="text-lg font-bold text-blue-400">
                                                {currentSoldPercent > 0 ? (ownerLabel?.name || 'Unknown Label') : 'N/A'}
                                                {currentSoldPercent > 0 && <span className="text-xs text-white ml-2">({currentSoldPercent}%)</span>}
                                            </p>
                                        </div>
                                    </div>

                                    {currentSoldPercent < 100 && (
                                        <div className="space-y-2 border-t border-zinc-700 pt-4">
                                            <h3 className="font-bold text-white">Sell Rights</h3>
                                            <p className="text-xs text-zinc-400 mb-2">Sell your remaining rights for a lump sum. The label will permanently take that percentage of all future streaming revenue.</p>
                                            
                                            <div className="flex gap-2">
                                                {[25, 50, 100].map(pct => {
                                                    const availableToSell = 100 - currentSoldPercent;
                                                    if (pct > availableToSell) return null;
                                                    
                                                    // Determine buyer
                                                    let buyerLabel = activeLabel || LABELS[Math.floor(Math.random() * 3)]; // Default to a top label if independent
                                                    if (currentSoldPercent > 0 && ownerLabel) buyerLabel = ownerLabel; // Must sell to current owner

                                                    let premium = 1.05;
                                                    if (buyerLabel.tier === 'Top' || buyerLabel.id === 'umg') premium = 1.10;
                                                    if (buyerLabel.contractType === 'petty') premium = 1.0;
                                                    
                                                    const val = Math.floor(totalRev * premium * (pct / 100));

                                                    return (
                                                        <button key={pct}
                                                            onClick={() => {
                                                                setConfirmAction({
                                                                    title: 'Sell Rights',
                                                                    message: `Sell ${pct}% of "${item.title}" to ${buyerLabel.name} for $${formatNumber(val)}?`,
                                                                    confirmText: 'Sell Rights',
                                                                    action: () => {
                                                                        dispatch({ type: 'SELL_RIGHTS', payload: { itemType: rightsTarget.type, id: item.id, percent: pct, labelId: buyerLabel.id, value: Math.floor(totalRev * premium) } });
                                                                        setRightsTarget(null);
                                                                    }
                                                                });
                                                            }}
                                                            className="flex-1 bg-zinc-700 hover:bg-zinc-600 p-2 rounded-md transition-colors text-center"
                                                        >
                                                            <div className="font-bold text-white">{pct}%</div>
                                                            <div className="text-green-400 font-bold">${formatNumber(val)}</div>
                                                            <div className="text-xs text-zinc-400">{buyerLabel.name}</div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {currentSoldPercent > 0 && (
                                        <div className="space-y-2 border-t border-zinc-700 pt-4">
                                            <h3 className="font-bold text-white">Buy Back Rights</h3>
                                            {!isIndependent && ownerLabel?.id !== activeLabel?.id ? (
                                                <p className="text-xs text-red-400">You must be an independent artist to buy back the rights from another label.</p>
                                            ) : ownerLabel?.id === activeLabel?.id ? (
                                                <p className="text-xs text-red-400">{ownerLabel?.name} refuses to sell your masters back to you until your contract with them expires.</p>
                                            ) : (
                                                <div className="flex gap-2">
                                                    {[25, 50, 100].map(pctToBuy => {
                                                        if (pctToBuy > currentSoldPercent) return null;
                                                        
                                                        // Buying back costs the original sold valuation premium + 20%
                                                        const originalValuation = item.rightsSoldOriginalValue || totalRev * 1.1; 
                                                        const currentValuation = Math.max(originalValuation * 1.2, totalRev * 1.2);
                                                        const cost = Math.floor(currentValuation * (pctToBuy / 100));

                                                        return (
                                                            <button key={pctToBuy}
                                                                disabled={activeArtistData.money < cost}
                                                                onClick={() => {
                                                                    setConfirmAction({
                                                                        title: 'Buy Back Rights',
                                                                        message: `Buy back ${pctToBuy}% of "${item.title}" for $${formatNumber(cost)}?`,
                                                                        confirmText: 'Buy Back',
                                                                        action: () => {
                                                                            dispatch({ type: 'BUY_RIGHTS', payload: { itemType: rightsTarget.type, id: item.id, percentToBuy: pctToBuy, cost } });
                                                                            setRightsTarget(null);
                                                                        }
                                                                    });
                                                                }}
                                                                className="flex-1 bg-blue-900/40 hover:bg-blue-900/60 border border-blue-500/50 p-2 rounded-md transition-colors text-center disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                <div className="font-bold text-white">{pctToBuy}%</div>
                                                                <div className="text-red-400 font-bold">-${formatNumber(cost)}</div>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })()}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CatalogView;
