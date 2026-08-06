import { NPC_ARTIST_IMAGES } from "../constants";


import React, { useMemo } from 'react';
import { useGame, formatNumber } from '../context/GameContext';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import { Release, Song } from '../types';

interface AlbumWithSales extends Release {
    units: number;
}

const AlbumSalesChartView: React.FC = () => {
    const { gameState, dispatch, activeArtist, activeArtistData } = useGame();

    if (!activeArtist || !activeArtistData) {
        return <p>Loading...</p>;
    }

    const { songs, releases } = activeArtistData;

    const albumsWithSales = useMemo<AlbumWithSales[]>(() => {
        const eligibleReleases = releases.filter(r => (r.type === 'Album' || r.type === 'EP' || r.type === 'Album (Deluxe)' || r.type === 'Compilation' || r.type === 'Live Album') && !r.soundtrackInfo);
        
        const releaseRawStreams = new Map<string, number>();
        eligibleReleases.forEach(release => {
            const rawStreams = release.songIds.reduce((total, songId) => {
                const song = songs.find(s => s.id === songId);
                return total + (song?.streams || 0);
            }, 0);
            releaseRawStreams.set(release.id, rawStreams);
        });

        const initialList = eligibleReleases
            .map(release => {
                const releaseStreams = release.songIds.reduce((total, songId) => {
                    const song = songs.find(s => s.id === songId);
                    const songStreams = song?.streams || 0;

                    const otherReleases = eligibleReleases.filter(r => r.songIds.includes(songId));
                    const thisRaw = releaseRawStreams.get(release.id) || 0;
                    const getTypePriority = (type: string) => type === 'Compilation' ? 2 : 1;
                    const bestRelease = otherReleases.reduce((best, r) => {
                        const raw = releaseRawStreams.get(r.id) || 0;
                        const rPriority = getTypePriority(r.type);
                        const bestPriority = getTypePriority(best.type);
                        
                        if (rPriority > bestPriority) return { id: r.id, raw, type: r.type };
                        if (rPriority < bestPriority) return best;
                        
                        if (raw > best.raw) return { id: r.id, raw, type: r.type };
                        return best;
                    }, { id: release.id, raw: thisRaw, type: release.type });

                    if (bestRelease.id !== release.id) {
                        return total;
                    }

                    return total + songStreams;
                }, 0);
                
                const rawSingleSales = release.songIds.reduce((total, songId) => {
                    const song = songs.find(s => s.id === songId);
                    return total + (song?.sales || 0);
                }, 0);
                const trackEquivalentAlbumSales = Math.floor(Math.max(0, rawSingleSales - (release.preReleaseSales || 0)) * 0.1);
                
                const units = Math.floor(releaseStreams / 1500) + (release.sales || 0) + trackEquivalentAlbumSales;
                return { ...release, units };
            });

        const mergedMap = new Map<string, number>();
        initialList.forEach(release => {
            const targetId = release.standardEditionId || release.id;
            mergedMap.set(targetId, (mergedMap.get(targetId) || 0) + release.units);
        });

        const mergedReleases: AlbumWithSales[] = [];
        mergedMap.forEach((units, id) => {
             const baseRelease = releases.find(r => r.id === id);
             if (baseRelease) {
                 mergedReleases.push({ ...baseRelease, units });
             }
        });
        return mergedReleases.sort((a, b) => b.units - a.units);
    }, [releases, songs, activeArtistData.merch]);

    const totalUnits = useMemo(() => {
        return albumsWithSales.reduce((sum, album) => sum + album.units, 0);
    }, [albumsWithSales]);

    const maxUnits = useMemo(() => {
        if (albumsWithSales.length === 0) return 1;
        return Math.max(...albumsWithSales.map(a => a.units), 1);
    }, [albumsWithSales]);


    return (
        <div className="h-full overflow-y-auto w-full bg-white text-black font-sans relative overflow-x-auto">
            <button onClick={() => dispatch({ type: 'CHANGE_VIEW', payload: 'catalog' })} className="absolute top-4 left-4 z-20 p-2 bg-black/10 rounded-full hover:bg-black/20">
                <ArrowLeftIcon className="w-6 h-6 text-black" />
            </button>
            
            <div className="p-4 pt-4">
                <div className="flex items-center gap-4">
                     <img src={activeArtist.image} alt={activeArtist.name} className="w-24 h-24 rounded-full object-cover shadow-lg" />
                     <div>
                        <h1 className="text-xl font-black tracking-tighter">{activeArtist.name.toUpperCase()}'S ALBUM SALES BAR CHART</h1>
                        <h2 className="text-lg font-bold">{formatNumber(totalUnits).toUpperCase()} UNITS SOLD</h2>
                        <div className="flex items-center gap-2">
                            <p className="text-sm text-zinc-600 font-semibold">@Red Mic</p>
                            {gameState.difficultyMode && (
                                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                                    {gameState.difficultyMode} MODE
                                </p>
                            )}
                        </div>
                     </div>
                </div>
            </div>
            
            <main className="absolute bottom-0 left-0 right-0 w-full h-[70vh] flex justify-center items-end gap-4 px-4 pb-8">
                {albumsWithSales.length > 0 ? albumsWithSales.map(album => {
                    const barHeightPercentage = (album.units / maxUnits) * 90; // use 90% to leave some headroom
                    return (
                        <div key={album.id} className="flex flex-col items-center justify-end text-center h-full w-1/5 max-w-[160px] min-w-[100px]">
                             <p className="font-black text-2xl md:text-3xl">{formatNumber(album.units)}</p>
                             <p className="font-bold text-sm md:text-base uppercase tracking-wider mb-2 line-clamp-2">{album.title}</p>
                             <div className="w-full rounded-t-lg overflow-hidden shadow-lg" style={{ height: `${barHeightPercentage}%`}}>
                                <img 
                                    src={album.coverArt} 
                                    alt={album.title} 
                                    className="w-full h-full object-cover"
                                />
                             </div>
                        </div>
                    );
                }) : (
                    <div className="absolute inset-0 flex items-center justify-center text-zinc-500">
                        <p>No album or EP sales data to display yet.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AlbumSalesChartView;