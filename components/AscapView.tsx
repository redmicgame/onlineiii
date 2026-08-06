import React, { useMemo, useState } from 'react';
import { useGame, formatNumber } from '../context/GameContext';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import ConfirmationModal from './ConfirmationModal';

const AscapView: React.FC = () => {
    const { gameState, dispatch, activeArtistData, activeArtist } = useGame();
    const [confirmAction, setConfirmAction] = useState<{ action: () => void, message: string, title: string, confirmText: string } | null>(null);

    const oldSongs = useMemo(() => {
        if (!activeArtistData) return [];
        return activeArtistData.songs.filter(s => 
            s.isReleased && 
            s.isAvailableOnStreaming !== true
        );
    }, [activeArtistData]);

    const takenDownReleases = useMemo(() => {
        if (!activeArtistData) return [];
        return activeArtistData.releases.filter(r => r.isTakenDown);
    }, [activeArtistData]);

    const takenDownSingles = useMemo(() => {
        if (!activeArtistData) return [];
        return activeArtistData.songs.filter(s => s.isTakenDown && s.isReleased && s.releaseId && !activeArtistData.releases.find(r => r.id === s.releaseId)?.isTakenDown);
    }, [activeArtistData]);

    const getDistributeCost = () => {
        if (!activeArtistData) return 1500;
        return activeArtistData.contract !== null ? 0 : 1500;
    };

    const handleUpload = (songId: string) => {
        if (!activeArtistData) return;
        const COST = getDistributeCost();
        if (activeArtistData.money < COST) {
            alert(`Not enough money to upload to streaming. Costs $${formatNumber(COST)}.`);
            return;
        }
        dispatch({ type: 'UPLOAD_TO_STREAMING', payload: { songId, cost: COST } });
    };

    const handleUploadAll = () => {
        if (!activeArtistData) return;
        const COST = getDistributeCost() * oldSongs.length;
        if (activeArtistData.money < COST) {
            alert(`Not enough money to upload all. Costs $${formatNumber(COST)}.`);
            return;
        }
        oldSongs.forEach(song => {
             dispatch({ type: 'UPLOAD_TO_STREAMING', payload: { songId: song.id, cost: getDistributeCost() } });
        });
    }

    if (!activeArtistData) return null;

    return (
        <div className="absolute inset-0 bg-[#EFEFEF] font-serif text-black pb-24 overflow-y-auto">
            <div className="sticky top-0 left-0 right-0 h-12 bg-blue-900 flex items-center px-4 shadow-md z-20">
                <button onClick={() => dispatch({ type: 'CHANGE_VIEW', payload: 'game' })} className="text-white p-1 hover:bg-blue-800 rounded mr-4">
                    <ArrowLeftIcon className="w-5 h-5"/>
                </button>
                <div className="flex-1 flex items-center">
                    <span className="font-bold text-white text-lg tracking-widest uppercase">ASCAP</span>
                </div>
            </div>

            <div className="p-6">
                <div className="bg-white p-6 shadow-md border-t-8 border-blue-900 mb-6">
                    <h2 className="text-2xl font-bold mb-2">Digital Streaming Rights Management</h2>
                    <p className="text-sm text-gray-700">
                        In the modern era, music generates revenue primarily through streaming services like Spotify and Apple Music. 
                        Songs are NOT automatically available on streaming platforms. 
                        You must negotiate back-catalog clearances and pay server hosting fees to distribute your music digitally.
                    </p>
                </div>
                
                <h3 className="text-xl font-bold mb-4 border-b-2 border-blue-900 pb-2">Legacy Catalog Pending Distribution</h3>

                {oldSongs.length === 0 ? (
                    <div className="bg-white p-4 text-center text-gray-500 italic shadow">
                        All eligible legacy music has been uploaded to streaming platforms.
                    </div>
                ) : (
                    <div>
                        <div className="mb-4 flex justify-end">
                            <button onClick={handleUploadAll} className="bg-blue-900 text-white px-4 py-2 text-sm font-bold shadow hover:bg-blue-800">
                                Distribute All Selected ({getDistributeCost() === 0 ? 'Free' : `$ ${formatNumber(getDistributeCost() * oldSongs.length)}`})
                            </button>
                        </div>
                        <div className="space-y-3">
                            {oldSongs.map((song) => (
                                <div key={song.id} className="bg-white p-4 border border-gray-300 shadow flex justify-between items-center">
                                    <div>
                                        <p className="font-bold">{song.title}</p>
                                        <p className="text-xs text-gray-500">Released: {song.releaseDate?.month} / {song.releaseDate?.year}</p>
                                    </div>
                                    <button 
                                        onClick={() => handleUpload(song.id)}
                                        className="bg-green-700 text-white px-3 py-1 text-sm font-bold rounded-sm shadow hover:bg-green-600 border border-green-900"
                                    >
                                        Distribute ({getDistributeCost() === 0 ? 'Free' : `$${formatNumber(getDistributeCost())}`})
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {(takenDownReleases.length > 0 || takenDownSingles.length > 0) && (
                    <div className="mt-8">
                        <h3 className="text-xl font-bold mb-4 border-b-2 border-red-900 pb-2 text-red-900">Withheld Former Label Catalog</h3>
                        <div className="bg-red-50 p-4 border border-red-200 text-sm text-red-800 mb-4 shadow">
                            Record labels freeze and withhold catalogs upon contract termination. 
                            You may negotiate the master rights back from your former label by paying a release fee based on the catalog's intrinsic value and overall popularity.
                        </div>
                        <div className="space-y-4">
                            {takenDownReleases.map(release => {
                                const totalRev = release.songIds.reduce((sum, sId) => {
                                    const s = activeArtistData.songs.find(sg => sg.id === sId);
                                    return sum + (s?.revenue || 0);
                                }, 0);
                                const cost = Math.floor(Math.max(2500000, totalRev * 5 + (activeArtistData.popularity * 100000)));
                                
                                return (
                                    <div key={release.id} className="bg-white p-4 border border-gray-300 shadow flex justify-between items-center relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
                                        <div className="pl-2">
                                            <p className="font-bold">{release.title}</p>
                                            <p className="text-xs text-gray-500">{release.type} • Released {release.releaseDate?.year}</p>
                                        </div>
                                        <button 
                                            onClick={() => {
                                                if (activeArtistData.money < cost) {
                                                    alert(`Not enough money. Costs $${formatNumber(cost)}.`);
                                                    return;
                                                }
                                                setConfirmAction({
                                                    title: 'Buy Back Release',
                                                    message: `Are you sure you want to buy back "${release.title}" for $${formatNumber(cost)}? It will be 100% owned by you and distributed immediately.`,
                                                    confirmText: 'Buy Back',
                                                    action: () => dispatch({ type: 'BUY_BACK_RELEASE', payload: { releaseId: release.id, cost } })
                                                });
                                            }}
                                            className="bg-blue-900 text-white px-3 py-1 text-sm font-bold rounded-sm shadow hover:bg-blue-800"
                                        >
                                            Buy Back ($ {formatNumber(cost)})
                                        </button>
                                    </div>
                                );
                            })}
                            
                            {takenDownSingles.map(song => {
                                const totalRev = song.revenue || 0;
                                const cost = Math.floor(Math.max(500000, totalRev * 5 + (activeArtistData.popularity * 25000)));
                                
                                return (
                                    <div key={song.id} className="bg-white p-4 border border-gray-300 shadow flex justify-between items-center relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
                                        <div className="pl-2">
                                            <p className="font-bold">{song.title}</p>
                                            <p className="text-xs text-gray-500">Single • Released {song.releaseDate?.year}</p>
                                        </div>
                                        <button 
                                            onClick={() => {
                                                if (activeArtistData.money < cost) {
                                                    alert(`Not enough money. Costs $${formatNumber(cost)}.`);
                                                    return;
                                                }
                                                setConfirmAction({
                                                    title: 'Buy Back Song',
                                                    message: `Are you sure you want to buy back "${song.title}" for $${formatNumber(cost)}? It will be 100% owned by you and distributed immediately.`,
                                                    confirmText: 'Buy Back',
                                                    action: () => dispatch({ type: 'BUY_BACK_SONG', payload: { songId: song.id, cost } })
                                                });
                                            }}
                                            className="bg-blue-900 text-white px-3 py-1 text-sm font-bold rounded-sm shadow hover:bg-blue-800"
                                        >
                                            Buy Back ($ {formatNumber(cost)})
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
            
            <ConfirmationModal
                isOpen={confirmAction !== null}
                onClose={() => setConfirmAction(null)}
                onConfirm={() => {
                    if (confirmAction) {
                        confirmAction.action();
                        setConfirmAction(null);
                    }
                }}
                title={confirmAction?.title || ''}
                message={confirmAction?.message || ''}
                confirmText={confirmAction?.confirmText || ''}
            />
        </div>
    );
};

export default AscapView;
