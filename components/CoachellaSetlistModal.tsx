import React, { useState, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { Song } from '../types';
import MusicNoteIcon from './icons/MusicNoteIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';
import XMarkIcon from './icons/XMarkIcon';

interface CoachellaSetlistModalProps {
    isOpen: boolean;
    onClose: () => void;
    slot: 'headliner' | 'mid' | 'small' | 'opener';
    stage: string;
    emailId?: string;
}

const CoachellaSetlistModal: React.FC<CoachellaSetlistModalProps> = ({ isOpen, onClose, slot, stage, emailId }) => {
    const { gameState, dispatch, activeArtist, activeArtistData } = useGame();

    if (!isOpen || !activeArtistData) return null;

    const existingSetlist = activeArtistData.coachella?.setlist || [];

    const minMax = useMemo(() => {
        switch (slot) {
            case 'opener': return { min: 1, max: 1, label: '1 song' };
            case 'small': return { min: 3, max: 5, label: '3-5 songs' };
            case 'mid': return { min: 8, max: 10, label: '8-10 songs' };
            case 'headliner': return { min: 10, max: 20, label: '10-20 songs' };
            default: return { min: 1, max: 20, label: '1-20 songs' };
        }
    }, [slot]);

    const [selectedSongIds, setSelectedSongIds] = useState<string[]>(existingSetlist);
    const [error, setError] = useState<string>('');

    // Both released and unreleased songs
    const allAvailableSongs = useMemo(() => {
        return activeArtistData.songs.filter(s => s.status !== 'written' || s.isRecorded || s.isReleased || true);
    }, [activeArtistData.songs]);

    const handleToggleSong = (songId: string) => {
        setError('');
        if (selectedSongIds.includes(songId)) {
            setSelectedSongIds(selectedSongIds.filter(id => id !== songId));
        } else {
            if (selectedSongIds.length >= minMax.max) {
                setError(`Maximum limit reached (${minMax.max} songs for ${slot.toUpperCase()} slot).`);
                return;
            }
            setSelectedSongIds([...selectedSongIds, songId]);
        }
    };

    const handleSave = () => {
        if (selectedSongIds.length < minMax.min) {
            setError(`Please select at least ${minMax.min} song${minMax.min > 1 ? 's' : ''} for your setlist.`);
            return;
        }
        if (selectedSongIds.length > minMax.max) {
            setError(`Please select at most ${minMax.max} songs for your setlist.`);
            return;
        }

        dispatch({
            type: 'SET_COACHELLA_SETLIST',
            payload: {
                songIds: selectedSongIds,
                emailId,
            }
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="p-5 border-b border-zinc-800 bg-gradient-to-r from-orange-900/30 via-zinc-900 to-amber-900/30 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400">
                            <span>Coachella {activeArtistData.coachella?.year || gameState.date.year}</span>
                            <span>•</span>
                            <span>{stage}</span>
                        </div>
                        <h2 className="text-xl font-black text-white mt-0.5">Select Coachella Setlist</h2>
                    </div>
                    <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition-colors">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Subheader / Slots info */}
                <div className="px-5 py-3 bg-zinc-800/50 border-b border-zinc-800/80 flex items-center justify-between text-xs">
                    <span className="text-zinc-400">
                        Slot: <strong className="text-white uppercase">{slot}</strong> ({minMax.label})
                    </span>
                    <span className={`font-bold ${selectedSongIds.length >= minMax.min && selectedSongIds.length <= minMax.max ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {selectedSongIds.length} / {minMax.max} selected
                    </span>
                </div>

                {/* Song List */}
                <div className="p-5 flex-1 overflow-y-auto space-y-2">
                    {allAvailableSongs.length === 0 ? (
                        <p className="text-center text-zinc-500 py-8">No songs available in your catalog.</p>
                    ) : (
                        allAvailableSongs.map((song: Song) => {
                            const isSelected = selectedSongIds.includes(song.id);
                            return (
                                <button
                                    key={song.id}
                                    onClick={() => handleToggleSong(song.id)}
                                    className={`w-full p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                                        isSelected 
                                            ? 'bg-orange-500/15 border-orange-500/50 text-white' 
                                            : 'bg-zinc-800/60 hover:bg-zinc-800 border-zinc-700/50 text-zinc-300'
                                    }`}
                                >
                                    <div className="relative w-11 h-11 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-800">
                                        {song.coverArt ? (
                                            <img src={song.coverArt} alt={song.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-zinc-700">
                                                <MusicNoteIcon className="w-5 h-5 text-zinc-400" />
                                            </div>
                                        )}
                                        {isSelected && (
                                            <div className="absolute inset-0 bg-orange-600/80 flex items-center justify-center">
                                                <CheckCircleIcon className="w-5 h-5 text-white" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-grow min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-sm truncate">{song.title}</h4>
                                            {!song.isReleased && (
                                                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-purple-900/80 text-purple-300 border border-purple-700/50 flex-shrink-0">
                                                    Unreleased
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-zinc-400 truncate">
                                            {song.genre || 'Single'} • {song.isReleased ? `${(song.streams || 0).toLocaleString()} streams` : 'Recorded in Studio'}
                                        </p>
                                    </div>

                                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 ${
                                        isSelected ? 'bg-orange-500 border-orange-400 text-white' : 'border-zinc-600'
                                    }`}>
                                        {isSelected && <CheckCircleIcon className="w-4 h-4" />}
                                    </div>
                                </button>
                            );
                        })
                    )}
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-zinc-800 bg-zinc-900 flex flex-col gap-3">
                    {error && (
                        <p className="text-red-400 text-xs font-semibold text-center bg-red-950/50 border border-red-800/50 py-2 px-3 rounded-lg">
                            {error}
                        </p>
                    )}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 px-4 rounded-xl border border-zinc-700 text-zinc-300 font-bold text-sm hover:bg-zinc-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-black font-extrabold text-sm transition-all shadow-lg shadow-orange-500/20"
                        >
                            Confirm Setlist
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoachellaSetlistModal;
