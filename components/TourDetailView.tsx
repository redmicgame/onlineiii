
import React, { useState } from 'react';
import { useGame, formatNumber } from '../context/GameContext';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import { Tour } from '../types';
import { VENUES } from '../constants';

const TourDetailView: React.FC = () => {
    const { dispatch, gameState, activeArtistData } = useGame();
    const { activeTourId } = gameState;
    const [error, setError] = useState('');
    const [isEditingSetlist, setIsEditingSetlist] = useState(false);
    const [tempSetlist, setTempSetlist] = useState<string[]>([]);
    
    if (!activeTourId || !activeArtistData) {
        dispatch({ type: 'CHANGE_VIEW', payload: 'tours' });
        return null;
    }

    const tour = activeArtistData.tours.find(t => t.id === activeTourId);
    
    if (!tour) return <div className="p-4">Tour not found.</div>;

    const { songs, tourPhotos } = activeArtistData;
    const setlistSongs = tour.setlist.map(id => songs.find(s => s.id === id)).filter(Boolean);
    const progress = (tour.currentVenueIndex / tour.venues.length) * 100;

    const handleSaveSetlist = () => {
        console.log("Saving setlist. Temp setlist:", tempSetlist);
        const added = tempSetlist.filter(id => !tour.setlist.includes(id));
        const removed = tour.setlist.filter(id => !tempSetlist.includes(id));
        if (added.length > 0 || removed.length > 0) {
            dispatch({
                type: 'EDIT_TOUR_SETLIST',
                payload: {
                    tourId: tour.id,
                    newSetlist: [...tempSetlist],
                    addedSongs: added,
                    removedSongs: removed
                }
            });
        }
        setIsEditingSetlist(false);
    };

    const toggleSong = (songId: string) => {
        if (tempSetlist.includes(songId)) {
            setTempSetlist(tempSetlist.filter(id => id !== songId));
        } else {
            setTempSetlist([...tempSetlist, songId]);
        }
    };
    
    const handleStartEditSetlist = () => {
        setTempSetlist(tour.setlist);
        setIsEditingSetlist(true);
    };

    const handleStartTour = () => {
        if (tour.status === 'planning' || tour.status === 'presale') {
            dispatch({ type: 'START_TOUR', payload: { tourId: tour.id }});
        }
    };

    const handleCancelTour = () => {
        dispatch({ type: 'CANCEL_TOUR', payload: { tourId: tour.id }});
        dispatch({ type: 'CHANGE_VIEW', payload: 'tours' });
    };
    
    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                dispatch({ type: 'UPLOAD_TOUR_PHOTO', payload: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };


        const handleCollectPresale = () => {
            dispatch({ type: 'COLLECT_PRESALE', payload: { tourId: tour.id }});
        };

        const handleAddPresaleAllocation = () => {
            dispatch({ type: 'ADD_PRESALE_ALLOCATION', payload: { tourId: tour.id, percentage: 10 }});
        };

        return (
            <div className="h-full w-full bg-zinc-900 overflow-y-auto">
                <header className="relative h-48">
                    <img src={tour.bannerImage} className="w-full h-full object-cover"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent"/>
                    <button onClick={() => dispatch({type: 'CHANGE_VIEW', payload: 'tours'})} className="absolute top-4 left-4 p-2 bg-black/50 rounded-full hover:bg-black/70">
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                    <h1 className="absolute bottom-4 left-4 text-4xl font-black">{tour.name}</h1>
                </header>
                <main className="p-4 space-y-6">
                    {tour.status === 'cancelled' && (
                        <div className="bg-red-900/50 text-red-100 p-4 rounded-xl border border-red-500 text-center font-medium">
                            This tour was cancelled.
                        </div>
                    )}
                    {tour.status === 'presale' && (
                        <div className="bg-blue-900/20 border border-blue-500/50 p-4 flex flex-col gap-4 rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                            <div className="flex justify-between items-center border-b border-blue-500/20 pb-3">
                                <h2 className="text-xl font-bold text-blue-400">Presale Dashboard</h2>
                                <span className="text-sm bg-blue-600 px-2 py-1 rounded text-white font-bold">Allocation: {tour.presalePercentage || 0}%</span>
                            </div>
                            <div className="text-center">
                                <h3 className="text-3xl font-black text-white">{tour.presaleDemand || 0}%</h3>
                                <p className="text-blue-300 text-sm font-medium">Estimated Ticket Demand</p>
                            </div>
                            <p className="text-sm text-gray-400 text-center">
                                Collect presale revenue upfront.
                            </p>
                            <div className="flex flex-col gap-2 pt-2 border-t border-blue-500/20">
                                { (tour.presalePercentage || 0) - (tour.presaleCollectedPercentage || 0) > 0 && (
                                    <button onClick={handleCollectPresale} className="bg-green-600 hover:bg-green-500 text-white p-3 rounded-lg font-bold transition-colors">Collect Presale Funds (-{(tour.presalePercentage || 0) - (tour.presaleCollectedPercentage || 0)}%)</button>
                                )}
                                { (tour.presalePercentage || 0) <= 90 && (
                                    <button onClick={handleAddPresaleAllocation} className="bg-blue-800 hover:bg-blue-700 text-blue-200 p-2 rounded-lg font-medium transition-colors border border-blue-500">+10% Presale Tickets</button>
                                )}
                            </div>
                            <div className="flex gap-2 pt-2 border-t border-blue-500/20">
                                <button onClick={handleCancelTour} className="flex-1 border border-red-500/50 text-red-400 hover:bg-red-500/10 p-3 rounded-lg font-bold transition-colors">Cancel Tour</button>
                                <button onClick={handleStartTour} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-lg font-bold transition-colors">Start Tour</button>
                            </div>
                        </div>
                    )}

                {tour.status === 'planning' && (
                    <button onClick={handleStartTour} className="w-full bg-green-600 p-3 rounded-lg font-bold hover:bg-green-500 transition-colors">Start Tour</button>
                )}
                
                {tour.status === 'finished' && (!activeArtistData.actingRoles || !activeArtistData.actingRoles.some(r => r.title === `${tour.name}: The Documentary`)) && (
                    <div className="bg-zinc-800 p-4 rounded-xl space-y-3 border border-zinc-700">
                        <h3 className="font-bold text-lg text-white">Release Tour Documentary</h3>
                        <p className="text-sm text-zinc-400">Release a movie documenting the tour to boost hype and popularity, which will appear on your IMDb profile.</p>
                        <button 
                            onClick={() => {
                                dispatch({ type: 'RELEASE_TOUR_DOCUMENTARY', payload: { tourId: tour.id, coverUrl: tour.bannerImage }});
                                alert("Documentary Released!");
                            }} 
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold p-3 rounded-lg transition-colors"
                        >
                            Release Documentary
                        </button>
                    </div>
                )}
                
                <div>
                    <div className="flex justify-between text-sm mb-1"><p>Progress</p><p>{tour.currentVenueIndex} / {tour.venues.length}</p></div>
                    <div className="w-full bg-zinc-700 h-3 rounded-full"><div className="bg-red-500 h-3 rounded-full transition-all" style={{width: `${progress}%`}}></div></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-zinc-800 p-3 rounded-lg text-center"><p className="text-xs text-zinc-400">Total Revenue</p><p className="font-bold text-2xl text-green-400">${formatNumber(tour.totalRevenue)}</p></div>
                    <div className="bg-zinc-800 p-3 rounded-lg text-center"><p className="text-xs text-zinc-400">Tickets Sold</p><p className="font-bold text-2xl">{formatNumber(tour.ticketsSold)}</p></div>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Shows</h2>
                        {(tour.status === 'planning' || tour.status === 'presale' || tour.status === 'active') && (
                            <button 
                                onClick={() => {
                                    if(tour.venues.length > 0) {
                                        const cap = tour.venues[0].capacity;
                                        let tierKey: keyof typeof VENUES = 'Small Halls';
                                        if (cap > 23500) tierKey = 'Stadiums';
                                        else if (cap > 8400) tierKey = 'Arenas';
                                        else if (cap > 2600) tierKey = 'Large Halls';

                                        const possibleVenues = VENUES[tierKey];
                                        const selected = [...possibleVenues].sort(() => 0.5 - Math.random()).slice(0, 3);
                                        
                                        const sampleVenues = selected.map(v => ({
                                            ...v, 
                                            id: crypto.randomUUID(), 
                                            ticketPrice: tour.venues[0].ticketPrice,
                                            ticketsSold: 0, 
                                            revenue: 0, 
                                            soldOut: false
                                        }));
                                        dispatch({ type: 'ADD_TOUR_LEG', payload: { tourId: tour.id, venues: sampleVenues }});
                                    }
                                }} 
                                className="bg-zinc-700 hover:bg-zinc-600 text-xs px-3 py-1 rounded-full font-bold transition-colors"
                            >
                                + Add Leg
                            </button>
                        )}
                    </div>
                    {tour.venues.map((v, i) => {
                        const isCompleted = i < tour.currentVenueIndex;
                        const isCurrent = i === tour.currentVenueIndex && tour.status === 'active';
                        
                        // Show mock map for sold out states as per Ticketmaster request
                        const fillPercent = isCompleted ? (v.ticketsSold / v.capacity) * 100 : (tour.presaleDemand || Math.random() * 100);
                        const isSoldOutUI = fillPercent >= 98;
                        
                        return (
                            <div key={v.id} className={`p-4 rounded-xl shadow-md ${isCurrent ? 'bg-blue-900/30 border border-blue-500/30' : 'bg-zinc-800'}`}>
                                <div className="flex justify-between items-center mb-2">
                                    <div>
                                        <p className="font-bold text-lg">{v.name}</p>
                                        <p className="text-sm text-zinc-400">{v.city}</p>
                                    </div>
                                    {isCompleted && (
                                        <div className="text-right">
                                            <p className={`font-semibold ${v.soldOut ? 'text-yellow-400' : 'text-green-400'}`}>${formatNumber(v.revenue)}</p>
                                            <p className="text-xs text-zinc-400">{formatNumber(v.ticketsSold)} / {formatNumber(v.capacity)}</p>
                                        </div>
                                    )}
                                </div>
                                
                                {!isCompleted && (
                                    <div className="mt-4 pt-3 border-t border-zinc-700/50 flex gap-4 items-center">
                                         <div className="w-12 h-12 flex-shrink-0 bg-zinc-900 rounded-full flex items-center justify-center p-2 relative overflow-hidden">
                                            {/* Mock Map UI */}
                                            <div className="absolute bottom-0 left-0 right-0 bg-blue-500 opacity-80" style={{height: `${fillPercent}%`, filter: isSoldOutUI ? 'brightness(0.6)' : 'none'}}></div>
                                            <svg className="w-full h-full relative z-10 text-white/50 mix-blend-overlay" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                                         </div>
                                         <div className="flex-grow">
                                             {isSoldOutUI ? (
                                                <p className="text-sm font-bold text-blue-400">Sold Out</p>
                                             ) : (
                                                <p className="text-sm font-bold text-green-400">Tickets Available</p>
                                             )}
                                             <p className="text-xs text-zinc-400 mt-1">
                                                {isSoldOutUI ? `Resale: $${Math.floor(v.ticketPrice * 1.62)}` : `Standard: $${Math.floor(v.ticketPrice * 0.95)} - $${v.ticketPrice}`}
                                             </p>
                                         </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
                
                 { (tour.guestIds?.length || tour.openerId || tour.merchItems?.length) ? (
                    <div className="space-y-4 pt-4 border-t border-zinc-800">
                        <h2 className="text-xl font-bold">Tour Information</h2>
                        
                        {(tour.openerId || tour.guestIds?.length) ? (
                            <div className="bg-zinc-800 p-4 rounded-xl">
                                <h3 className="font-bold text-zinc-400 text-sm mb-2">Support Acts</h3>
                                {tour.openerId && (
                                    <p className="text-sm"><span className="font-bold text-zinc-300">Opener:</span> {gameState.npcs?.find(n => n.uniqueId === tour.openerId)?.artist || 'Unknown'}</p>
                                )}
                                {tour.guestIds && tour.guestIds.length > 0 && (
                                    <p className="text-sm mt-1"><span className="font-bold text-zinc-300">Special Guests:</span> {tour.guestIds.map(id => gameState.npcs?.find(n => n.uniqueId === id)?.artist || 'Unknown').join(', ')}</p>
                                )}
                            </div>
                        ) : null}

                        {tour.merchItems && tour.merchItems.length > 0 && (
                            <div className="bg-zinc-800 p-4 rounded-xl">
                                <h3 className="font-bold text-zinc-400 text-sm mb-2">Tour Merch</h3>
                                <div className="space-y-1">
                                    {tour.merchItems.map(m => (
                                        <div key={m.id} className="flex justify-between text-sm">
                                            <span>{m.name}</span>
                                            <span className="text-zinc-400">${m.price.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : null }

                 <div className="space-y-3 pt-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Setlist Details</h2>
                        {tour.status === 'active' && (
                            <button onClick={handleStartEditSetlist} className="px-3 py-1 bg-zinc-800 rounded-md text-sm hover:bg-zinc-700">
                                Edit
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                    {setlistSongs.map(song => song && (
                        <div key={song.id} className="bg-zinc-800 p-2 rounded-md flex items-center gap-2">
                             <img src={song.coverArt} className="w-8 h-8 rounded-sm object-cover"/>
                             <p className="text-sm font-semibold truncate">{song.title}</p>
                        </div>
                    ))}
                    </div>
                </div>

                <div className="space-y-3 pt-4">
                    <h2 className="text-xl font-bold">Tour Photos</h2>
                     <div className="grid grid-cols-3 gap-2">
                         {tourPhotos.map((photo, i) => <img key={i} src={photo} className="w-full aspect-square object-cover rounded-md shadow-sm"/>)}
                         {tourPhotos.length < 9 && (
                            <label htmlFor="photo-upload" className="w-full aspect-square bg-zinc-800 rounded-md flex items-center justify-center cursor-pointer hover:bg-zinc-700 transition-colors">
                                <span className="text-3xl text-zinc-500">+</span>
                            </label>
                         )}
                    </div>
                    <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                </div>
            </main>

            {isEditingSetlist && (
                <div className="fixed inset-0 bg-black/80 z-50 flex flex-col p-4 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-white">Edit Setlist</h2>
                        <button onClick={() => setIsEditingSetlist(false)} className="p-2 text-zinc-400 hover:text-white">
                            ✕
                        </button>
                    </div>
                    
                    <div className="flex-grow overflow-y-auto space-y-2 mb-4 pr-2">
                        {songs.map(song => {
                            if (!song.isReleased) return null;
                            const isSelected = tempSetlist.includes(song.id);
                            return (
                                <button
                                    key={song.id}
                                    onClick={() => toggleSong(song.id)}
                                    className={`w-full flex items-center p-3 rounded-lg border transition-colors ${isSelected ? 'bg-indigo-600/20 border-indigo-500' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'}`}
                                >
                                    <img src={song.coverArt} alt="" className="w-12 h-12 rounded object-cover mr-4" />
                                    <div className="text-left flex-grow">
                                        <div className="font-bold text-white">{song.title}</div>
                                        <div className="text-sm text-zinc-400">
                                            {(song.streams / 1000000).toFixed(1)}M streams
                                        </div>
                                    </div>
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-zinc-600'}`}>
                                        {isSelected && "✓"}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <div className="bg-zinc-900 p-4 rounded-xl space-y-4">
                        <div className="flex justify-between text-zinc-400">
                            <span>Selected Songs</span>
                            <span className="font-bold text-white">{tempSetlist.length}</span>
                        </div>
                        <button
                            onClick={handleSaveSetlist}
                            disabled={tempSetlist.length < 1}
                            className="w-full py-3 bg-white text-black font-bold rounded-lg disabled:opacity-50"
                        >
                            Save Setlist
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TourDetailView;
