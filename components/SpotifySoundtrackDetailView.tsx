
import React, { useMemo } from 'react';
import { useGame, formatNumber } from '../context/GameContext';
import { GameDate, SoundtrackTrack } from '../types';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import DotsHorizontalIcon from './icons/DotsHorizontalIcon';
import TrianglePlayIcon from './icons/TrianglePlayIcon';

const formatGameDate = (gameDate: GameDate) => {
    const date = new Date(gameDate.year, 0, (gameDate.week - 1) * 7 + 1);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

const TrackItem: React.FC<{ track: SoundtrackTrack; index: number }> = ({ track, index }) => {
    return (
        <div className="flex items-center gap-3 py-2">
            <div className="w-6 text-center text-zinc-400">{index + 1}</div>
            <div className="flex-grow">
                <p className="font-semibold text-white">{track.title}</p>
                <div className="flex items-center gap-2">
                    {track.explicit && <span className="text-xs w-4 h-4 bg-zinc-600/80 text-zinc-300 font-bold rounded-sm flex items-center justify-center">E</span>}
                    <p className="text-sm text-zinc-400">{track.artist}</p>
                </div>
            </div>
            <p className="text-sm text-zinc-400 font-mono">{formatNumber(track.streams)}</p>
        </div>
    );
};

const SpotifySoundtrackDetailView: React.FC = () => {
    const { gameState, dispatch } = useGame();
    const { selectedSoundtrackId, soundtrackAlbums } = gameState;

    const soundtrack = useMemo(() => {
        return soundtrackAlbums.find(s => s.id === selectedSoundtrackId);
    }, [soundtrackAlbums, selectedSoundtrackId]);
    
    if (!soundtrack) {
        return (
            <div className="bg-black text-white h-full overflow-y-auto flex items-center justify-center pb-24">
                <p>Soundtrack not found.</p>
                <button onClick={() => dispatch({ type: 'CHANGE_VIEW', payload: 'spotify' })} className="absolute top-4 left-4">Back</button>
            </div>
        );
    }
    
    const totalDuration = soundtrack.tracks.reduce((sum, track) => sum + track.duration, 0);
    const totalMinutes = Math.round(totalDuration / 60);

    return (
        <div className="h-full overflow-y-auto w-full text-white bg-gradient-to-b from-zinc-800 to-black pb-24">
            <button 
                onClick={() => dispatch({ type: 'CHANGE_VIEW', payload: 'spotify' })}
                className="absolute top-12 left-4 bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors z-10"
                aria-label="Go back"
            >
                <ChevronLeftIcon className="w-6 h-6" />
            </button>
             <div className="pt-28 p-4">
                <div className="flex flex-col items-center space-y-4">
                    <img src={soundtrack.coverArt} alt={soundtrack.title} className="w-48 h-48 md:w-56 md:h-56 shadow-2xl shadow-black/50" />
                    <div className="text-center">
                        <h1 className="text-2xl font-bold">{soundtrack.title}</h1>
                        <p className="text-sm text-zinc-400 mt-1">Various Artists • {soundtrack.releaseDate.year}</p>
                    </div>
                </div>
                <div className="mt-6 flex items-center justify-end">
                    <button className="bg-green-500 rounded-full w-14 h-14 flex items-center justify-center shadow-lg shadow-green-500/30">
                       <TrianglePlayIcon className="w-7 h-7 text-black" />
                    </button>
                </div>
                <div className="mt-6 space-y-1">
                    {soundtrack.tracks.map((track, index) => (
                        <TrackItem key={track.songId} track={track} index={index} />
                    ))}
                </div>
                 <div className="mt-6 text-sm text-zinc-400 space-y-4">
                    <p>{formatGameDate(soundtrack.releaseDate)}</p>
                    <p>{soundtrack.tracks.length} songs • {totalMinutes} min</p>
                    <p className="text-xs pt-2 border-t border-white/10">© ℗ {soundtrack.releaseDate.year} {soundtrack.label}</p>
                </div>
             </div>
        </div>
    );
};

export default SpotifySoundtrackDetailView;
