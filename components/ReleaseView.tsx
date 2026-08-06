

import React, {  useState, useMemo , useEffect } from 'react';
import { useGame } from '../context/GameContext';
import type { Release, ReleaseType, Song, LabelSubmission } from '../types';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import { LABELS } from '../constants';

const QualityBadge: React.FC<{ quality: number; showNumber: boolean }> = ({ quality, showNumber }) => {
    const getQualityColor = () => {
        if (quality < 50) return 'bg-red-500 text-white';
        if (quality < 70) return 'bg-yellow-500 text-black';
        if (quality < 96) return 'bg-green-400 text-black';
        return 'bg-green-600 text-white';
    };
    return (
        <div className={`w-10 h-10 flex items-center justify-center rounded-md font-bold text-base ${getQualityColor()}`}>
            {showNumber ? quality : ''}
        </div>
    );
};

const ReleaseView: React.FC = () => {
    const { gameState, dispatch, activeArtist, activeArtistData } = useGame();
    const { date } = gameState;

    const [title, setTitle] = useState('');
    const [releaseType, setReleaseType] = useState<ReleaseType>('Single');
    const [selectedSongIds, setSelectedSongIds] = useState<Set<string>>(new Set());
    const [error, setError] = useState('');
    const [baseAlbumForDeluxe, setBaseAlbumForDeluxe] = useState<string>('');
    const [deluxeCoverArt, setDeluxeCoverArt] = useState<string | null>(null);
    const [selectedLiveTourId, setSelectedLiveTourId] = useState<string>('');

    if (!activeArtistData || !activeArtist) return null;
    const { songs, contract, releases, customLabels, redMicPro } = activeArtistData;

    const availableSongs = useMemo(() => {
        const songsInEPOrAlbum = new Set<string>();
        releases.forEach(r => {
            if (r.type === 'EP' || r.type === 'Album' || r.type === 'Album (Deluxe)' || r.type === 'Compilation' || r.type === 'Live Album') {
                r.songIds.forEach(songId => songsInEPOrAlbum.add(songId));
            }
        });

        if (releaseType === 'Compilation') {
            return songs.filter(s => s.isReleased && !s.isVaulted);
        }
        
        if (releaseType === 'Live Album') {
            return songs.filter(s => s.title.endsWith(' - Live') && !s.isReleased && !s.isVaulted);
        }

        return songs.filter(s => (!s.isReleased || !songsInEPOrAlbum.has(s.id)) && !s.isVaulted && !s.title.endsWith(' - Live'));
    }, [songs, releases, releaseType]);

    const coverArt = useMemo(() => {
        if (releaseType === 'Album (Deluxe)') {
            return deluxeCoverArt;
        }
        if (selectedSongIds.size > 0) {
            const firstSelectedSongId = Array.from(selectedSongIds)[0];
            const firstSelectedSong = songs.find(s => s.id === firstSelectedSongId);
            return firstSelectedSong?.coverArt || null;
        }
        return null;
    }, [selectedSongIds, songs, releaseType, deluxeCoverArt]);
    
    
    const leadSingles = useMemo(() => {
        return availableSongs.filter(s => s.singleType === 'lead' && s.isReleased);
    }, [availableSongs]);

    useEffect(() => {
        if (releaseType === 'Album' || releaseType === 'EP') {
            const newSelection = new Set(selectedSongIds);
            let changed = false;
            leadSingles.forEach(s => {
                if (!newSelection.has(s.id)) {
                    newSelection.add(s.id);
                    changed = true;
                }
            });
            if (changed) setSelectedSongIds(newSelection);
        }
    }, [leadSingles, releaseType]);

    const handleToggleSong = (songId: string) => {
        if (leadSingles.find(s => s.id === songId)) {
            setError("Lead singles must be included in your next album/EP.");
            return;
        }
        const newSelection = new Set(selectedSongIds);
        if (newSelection.has(songId)) {
            newSelection.delete(songId);
        } else {
            if (releaseType === 'Single' && newSelection.size === 1) {
                newSelection.clear();
                newSelection.add(songId);
            } else {
                newSelection.add(songId);
            }
        }
        setSelectedSongIds(newSelection);
    };

    const handleDeluxeCoverArtUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setDeluxeCoverArt(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const [showComebackConfirm, setShowComebackConfirm] = useState(false);

    const isGroupMemberSoloRelease = gameState.careerMode === 'group' && activeArtist?.id !== gameState.group?.id;
    const isHiatusComeback = activeArtistData.isHiatus && !isGroupMemberSoloRelease;

    const handleAction = () => {
        if (isHiatusComeback && !showComebackConfirm) {
             setShowComebackConfirm(true);
             return;
        }

        setError('');
        if (!title.trim()) {
            setError('Project title is required.'); return;
        }
        
        let finalReleaseType = releaseType;
        if (releaseType === 'Album (Deluxe)') {
            if (!baseAlbumForDeluxe) { setError('Please select a standard album to create a deluxe version of.'); return; }
            if (!coverArt) { setError('A cover art is required for a deluxe album.'); return; }
            if (selectedSongIds.size < 1) { setError('A deluxe album must have at least one new track.'); return; }
            finalReleaseType = 'Album';
        } else {
            const selectedSongsArr = Array.from(selectedSongIds).map(id => activeArtistData.songs.find(s => s.id === id)).filter((s): s is Song => !!s);
            const allRemixes = selectedSongsArr.length > 0 && selectedSongsArr.every(s => s.remixOfSongId);
            
            const count = selectedSongIds.size;
            if (releaseType === 'Single' && count !== 1 && !allRemixes) {
                setError('A single must have exactly 1 song (unless all songs are remixes).'); return;
            }
            if (releaseType === 'EP' && (count < 3 || count > 7) && !allRemixes) {
                setError('An EP must have between 3 and 7 songs.'); return;
            }
            if (releaseType === 'Album' && count < 8 && !allRemixes) {
                setError('An album must have at least 8 songs.'); return;
            }
            if (releaseType === 'Live Album' && count < 5) {
                setError('A live album must have at least 5 songs.'); return;
            }
            if (releaseType === 'Compilation' && count < 2) {
                setError('A compilation must have at least 2 songs.'); return;
            }
            if (!coverArt) {
                setError('Could not determine cover art. Select at least one song.'); return;
            }

            if (allRemixes && (releaseType === 'EP' || releaseType === 'Album' || releaseType === 'Single')) {
                finalReleaseType = 'Single';
            }
        }
        

        const newRelease: Release = {
            id: crypto.randomUUID(),
            title: title.trim(),
            type: finalReleaseType,
            coverArt: coverArt!,
            songIds: releaseType === 'Album (Deluxe)'
                ? [...(releases.find(r => r.id === baseAlbumForDeluxe)?.songIds || []), ...Array.from(selectedSongIds)]
                : Array.from(selectedSongIds),
            releaseDate: date, // This will be updated by label if approved
            artistId: activeArtist.id,
            standardEditionId: releaseType === 'Album (Deluxe)' ? baseAlbumForDeluxe : undefined,
        };

        if (contract) {
            if (contract.isCustom) {
                // On your own label, release is auto-approved for planning.
                const customLabel = customLabels.find(l => l.id === contract.labelId);

                // If there's a distribution deal, check quality against major label standards.
                if (customLabel && customLabel.dealWithMajorId) {
                    const majorLabel = LABELS.find(l => l.id === customLabel.dealWithMajorId);
                    const avgQuality = Array.from(selectedSongIds).reduce((sum: number, id) => sum + (songs.find(s => s.id === id)?.quality || 0), 0) / (selectedSongIds.size || 1);
                    
                    if (majorLabel && avgQuality < majorLabel.minQuality) {
                        setError(`Your release quality (${avgQuality.toFixed(0)}) doesn't meet the standards of your distribution partner, ${majorLabel.name} (requires ${majorLabel.minQuality}).`);
                        return;
                    }
                }
                
                const submission: LabelSubmission = {
                    id: crypto.randomUUID(),
                    release: newRelease,
                    submittedDate: date,
                    status: 'awaiting_player_input'
                };
                dispatch({ type: 'SUBMIT_TO_LABEL', payload: { submission } });
                dispatch({ type: 'GO_TO_LABEL_PLAN', payload: { submissionId: submission.id } });
                return; // Go directly to planning, skip the final CHANGE_VIEW
            }

            // For major labels, submit for approval.
            const submission: LabelSubmission = {
                id: crypto.randomUUID(),
                release: newRelease,
                submittedDate: date,
                status: 'pending'
            };
            dispatch({ type: 'SUBMIT_TO_LABEL', payload: { submission }});
        } else {
            // Release Independently
            dispatch({ type: 'RELEASE_PROJECT', payload: { release: newRelease } });
        }
        
        if (isHiatusComeback) {
             const avgQuality = Array.from(selectedSongIds).reduce((sum, id) => sum + (songs.find(s => s.id === id)?.quality || 0), 0) / (selectedSongIds.size || 1);
             dispatch({ type: 'END_HIATUS_COMEBACK', payload: { isGood: avgQuality > 70 } });
        }

        dispatch({ type: 'CHANGE_VIEW', payload: 'game' });
    };

    const baseAlbum = useMemo(() => {
        if (!baseAlbumForDeluxe) return null;
        return releases.find(r => r.id === baseAlbumForDeluxe);
    }, [baseAlbumForDeluxe, releases]);

    const baseAlbumSongs = useMemo(() => {
        if (!baseAlbum) return [];
        return baseAlbum.songIds.map(id => songs.find(s => s.id === id)).filter((s): s is Song => !!s);
    }, [baseAlbum, songs]);

    return (
        <div className="h-full w-full bg-zinc-900 flex flex-col">
            <header className="p-4 flex items-center gap-4 sticky top-0 bg-zinc-900/80 backdrop-blur-sm z-10 border-b border-zinc-700/50">
                <button onClick={() => dispatch({type: 'CHANGE_VIEW', payload: 'game'})} className="p-2 rounded-full hover:bg-white/10">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold">{contract ? 'Submit to Label' : 'Release Music'}</h1>
            </header>
            <div className="flex-grow p-4 space-y-6 overflow-y-auto">
                
                <div>
                    <label htmlFor="release-title" className="block text-sm font-medium text-zinc-300">Project Title</label>
                    <input type="text" id="release-title" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full bg-zinc-700 border-zinc-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm h-10 px-3"/>
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-300">Release Type</label>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                        {(['Single', 'EP', 'Album', 'Album (Deluxe)', 'Compilation', 'Live Album'] as ReleaseType[]).map(type => (
                            <button key={type} onClick={() => { setReleaseType(type); setSelectedSongIds(new Set()); setBaseAlbumForDeluxe(''); setTitle(''); }} className={`py-2 px-4 rounded-md text-sm font-semibold transition-colors ${releaseType === type ? 'bg-red-600 text-white' : 'bg-zinc-700 hover:bg-zinc-600'}`}>
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
                
                {releaseType === 'Album (Deluxe)' ? (
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="base-album" className="block text-sm font-medium text-zinc-300">Base Album</label>
                            <select id="base-album" value={baseAlbumForDeluxe} onChange={e => {
                                const albumId = e.target.value;
                                setBaseAlbumForDeluxe(albumId);
                                if (albumId) {
                                    const album = releases.find(r => r.id === albumId);
                                    if (album) {
                                        setTitle(`${album.title} (Deluxe)`);
                                        setDeluxeCoverArt(album.coverArt);
                                    }
                                } else {
                                    setTitle('');
                                    setDeluxeCoverArt(null);
                                }
                            }} className="mt-1 block w-full bg-zinc-700 border-zinc-600 rounded-md shadow-sm h-10 px-3">
                                <option value="">Select standard album...</option>
                                {releases.filter(r => r.type === 'Album').map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
                            </select>
                        </div>
                        {baseAlbumForDeluxe && (
                            <>
                            <div className="flex justify-center">
                                <label htmlFor="deluxe-cover-art" className="cursor-pointer">
                                    <div className="w-48 h-48 rounded-lg bg-zinc-800 border-2 border-dashed border-zinc-600 flex items-center justify-center hover:border-red-500 transition-colors">
                                        {coverArt ? (
                                            <img src={coverArt} alt="Deluxe Cover Art" className="w-full h-full rounded-lg object-cover" />
                                        ) : (
                                            <span className="text-zinc-400 text-sm text-center">Upload Deluxe Cover</span>
                                        )}
                                    </div>
                                </label>
                                <input id="deluxe-cover-art" type="file" accept="image/*" className="hidden" onChange={handleDeluxeCoverArtUpload} />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-zinc-300">Tracklist</h3>
                                <div className="mt-2 space-y-2 bg-zinc-800 p-2 rounded-lg">
                                    <p className="text-xs font-bold text-zinc-400 px-2">STANDARD TRACKS</p>
                                    {baseAlbumSongs.map(song => (
                                        <div key={song.id} className="w-full p-2 rounded-md flex items-center gap-3 bg-zinc-700/50 opacity-70">
                                            <img src={song.coverArt} alt={song.title} className="w-10 h-10 rounded-sm object-cover" />
                                            <p className="font-semibold">{song.title}</p>
                                        </div>
                                    ))}
                                    <p className="text-xs font-bold text-zinc-400 px-2 pt-2">DELUXE TRACKS ({selectedSongIds.size})</p>
                                    {availableSongs.map(song => (
                                        <button key={song.id} onClick={() => handleToggleSong(song.id)} className={`w-full p-2 rounded-md text-left flex items-center gap-3 transition-colors ${selectedSongIds.has(song.id) ? 'bg-red-500/20' : 'hover:bg-zinc-700'}`}>
                                            <img src={song.coverArt} alt={song.title} className="w-10 h-10 rounded-sm object-cover" />
                                            <p className="font-semibold">{song.title}</p>
                                        </button>
                                    ))}
                                    {availableSongs.length === 0 && <p className="text-xs text-zinc-500 p-2">No unreleased tracks available. Record some in the studio!</p>}
                                </div>
                            </div>
                            </>
                        )}
                    </div>
                ) : (
                    <>
                    <div className="flex justify-center">
                        <div className="w-48 h-48 rounded-lg bg-zinc-800 border-2 border-zinc-600 flex items-center justify-center">
                            {coverArt ? (
                                <img src={coverArt} alt="Cover Art" className="w-full h-full rounded-lg object-cover" />
                            ) : (
                                <span className="text-zinc-400 text-sm text-center p-2">Cover art from first selected song</span>
                            )}
                        </div>
                    </div>
                    <div>
                        <h3 className="block text-sm font-medium text-zinc-300 mb-2">Select Songs ({selectedSongIds.size})</h3>
                        <div className="max-h-60 overflow-y-auto space-y-2 bg-zinc-800 p-2 rounded-lg">
                            {availableSongs.map(song => (
                                <button key={song.id} onClick={() => handleToggleSong(song.id)} className={`w-full p-2 rounded-md text-left flex items-center gap-3 transition-colors ${selectedSongIds.has(song.id) ? 'bg-red-500/20' : 'hover:bg-zinc-700'}`}>
                                    <img src={song.coverArt} alt={song.title} className="w-10 h-10 rounded-sm object-cover" />
                                    <div className="flex-grow">
                                        <p className="font-semibold">{song.title}</p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-xs text-zinc-400">{song.genre}</p>
                                            {song.isReleased && <span className="text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full font-medium">Released as Single</span>}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <QualityBadge quality={song.quality} showNumber={redMicPro.unlocked} />
                                        {redMicPro.unlocked && (song as any).trait && (
                                            <span className="text-[9px] text-zinc-400 mt-1 uppercase font-bold text-center leading-tight max-w-[60px]">{(song as any).trait}</span>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                    </>
                )}
                

                {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                
            </div>
            <div className="p-4 border-t border-zinc-700/50">
                <button onClick={handleAction} className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-lg shadow-red-600/20">
                    {contract ? (contract.isCustom ? 'Plan Release' : 'Submit Project') : 'Release Project'}
                </button>
            </div>
        </div>
    );
};

export default ReleaseView;
