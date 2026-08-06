import React, { useMemo } from 'react';
import { useGame, formatNumber } from '../context/GameContext';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

const LimeWireView: React.FC = () => {
    const { gameState, dispatch, activeArtistData } = useGame();

    const leakedSongs = useMemo(() => {
        if (!activeArtistData) return [];
        return activeArtistData.songs.filter(s => 
            (s.leakInfo && (s.leakInfo.illegalStreams > 0 || s.leakInfo.illegalDownloads > 0)) ||
            (s.isReleased && s.releaseDate && s.releaseDate.year <= 2008)
        ).map(s => {
             // Fake download count for generic released songs
             const fakeDls = Math.floor((s.streams || 1000) * 0.15) + (s.leakInfo?.illegalDownloads || 0);
             return { ...s, displayDownloads: fakeDls };
        }).sort((a, b) => b.displayDownloads - a.displayDownloads);
    }, [activeArtistData]);

    return (
        <div className="bg-[#E4F1E1] h-full overflow-y-auto font-sans text-black pt-12 pb-24 relative overflow-y-auto">
            <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-[#2B8B3B] to-[#1E6B2A] flex items-center px-4 shadow-[0_2px_4px_rgba(0,0,0,0.3)] z-10">
                <button onClick={() => dispatch({ type: 'CHANGE_VIEW', payload: 'game' })} className="text-white hover:text-green-200 p-1 bg-black/20 rounded shadow-inner">
                    <ArrowLeftIcon className="w-5 h-5"/>
                </button>
                <div className="flex-1 flex justify-center items-center">
                    <span className="font-bold text-white text-lg tracking-wider" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>LimeWire</span>
                </div>
            </div>

            <div className="p-4 pt-8">
                <div className="bg-[#F0F8EC] border-2 border-[#A3D9A5] shadow-[2px_2px_0px_#A3D9A5] p-3 mb-6">
                    <p className="text-xs text-[#2B8B3B] font-bold uppercase tracking-widest text-center">Gnutella Network Status: <span className="text-green-600">Connected</span></p>
                </div>
                
                <h2 className="text-xl font-bold border-b-2 border-[#2B8B3B] pb-2 mb-4 text-[#1E6B2A]">Search Results</h2>

                <div className="bg-white border-2 border-[#A3D9A5] shadow-lg overflow-hidden">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-[#D1E8CC] border-b border-[#A3D9A5] text-[#2B8B3B]">
                            <tr>
                                <th className="p-2 font-bold border-r border-[#A3D9A5]">File Name</th>
                                <th className="p-2 font-bold border-r border-[#A3D9A5] w-16 text-right">Size</th>
                                <th className="p-2 font-bold border-r border-[#A3D9A5] w-20 text-right">Downloads</th>
                                <th className="p-2 font-bold w-16 text-center">Quality</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leakedSongs.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-4 text-center text-gray-500 italic">No files found matching your search.</td>
                                </tr>
                            ) : (
                                leakedSongs.map((song, i) => (
                                    <tr key={song.id} className={i % 2 === 0 ? 'bg-white' : 'bg-[#F9FCF8]'}>
                                        <td className="p-2 border-r border-gray-200 text-blue-700 underline truncate max-w-[140px]" title={`${activeArtistData?.name} - ${song.title} [CDQ].mp3`}>
                                            {activeArtistData?.name} - {song.title} [CDQ].mp3
                                        </td>
                                        <td className="p-2 border-r border-gray-200 text-right text-gray-600">{song.duration ? (song.duration * 0.05).toFixed(1) : '3.4'}MB</td>
                                        <td className="p-2 border-r border-gray-200 text-right font-bold text-red-600">{formatNumber(song.displayDownloads)}</td>
                                        <td className="p-2 text-center text-green-600">Excellent</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6 space-y-2 text-xs text-gray-500 text-center">
                    <p>Sharing {formatNumber(Math.floor(Math.random() * 50000) + 10000)} files</p>
                    <p>WARNING: Downloading copyrighted materials may be illegal in your jurisdiction.</p>
                </div>
            </div>
        </div>
    );
};

export default LimeWireView;
