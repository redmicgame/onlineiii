import fs from 'fs';

const code = `import React, { useState, useMemo } from 'react';
import { useGame, formatNumber } from '../context/GameContext';
import { VENUES, TOUR_TIER_REQUIREMENTS, TOUR_TICKET_PRICE_SUGGESTIONS } from '../constants';
import { Tour, Venue, Song, MerchItem } from '../types';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

type TourTier = 'Small Halls' | 'Large Halls' | 'Arenas' | 'Stadiums';

const CreateTourView: React.FC = () => {
    const { gameState, dispatch, activeArtist, activeArtistData } = useGame();
    const [step, setStep] = useState(1);
    const [tourName, setTourName] = useState('');
    const [bannerImage, setBannerImage] = useState<string | null>(null);
    const [tier, setTier] = useState<TourTier | null>(null);
    const [venuesForSelection, setVenuesForSelection] = useState<(typeof VENUES[TourTier][0] & {id: string})[]>([]);
    const [chosenVenueIds, setChosenVenueIds] = useState<Set<string>>(new Set());
    
    // Support acts
    const [openerId, setOpenerId] = useState<string>('');
    const [guestIds, setGuestIds] = useState<Set<string>>(new Set());
    const [chosenMerchIds, setChosenMerchIds] = useState<Set<string>>(new Set());

    const [ticketPrice, setTicketPrice] = useState(0);
    const [useDynamicPricing, setUseDynamicPricing] = useState(false);
    const [useVipPackages, setUseVipPackages] = useState(false);
    
    const [setlist, setSetlist] = useState<Set<string>>(new Set());
    const [presalePercentage, setPresalePercentage] = useState(25);
    const [error, setError] = useState('');

    if (!activeArtistData || !activeArtist) return null;
    const { popularity, songs, hype, merch, money } = activeArtistData;
    const allSongs = useMemo(() => songs, [songs]);
    const isModernEra = gameState.date.year >= 2018;

    const top3Hits = useMemo(() => {
        return [...allSongs].filter(s => s.isReleased).sort((a,b) => (b.streams || 0) - (a.streams || 0)).slice(0, 3);
    }, [allSongs]);

    const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => setBannerImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleTierSelect = (selectedTier: TourTier) => {
        setTier(selectedTier);
        const suggestion = TOUR_TICKET_PRICE_SUGGESTIONS[selectedTier];
        setTicketPrice(Math.floor((suggestion.min + suggestion.max) / 2));
        
        const venuesWithIds = VENUES[selectedTier].map(v => ({...v, id: crypto.randomUUID()}));
        setVenuesForSelection(venuesWithIds);
        setChosenVenueIds(new Set(venuesWithIds.map(v => v.id)));
        setStep(2);
    };

    const handleToggleVenue = (id: string) => {
        const newSet = new Set(chosenVenueIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setChosenVenueIds(newSet);
    };

    const handleToggleSetlist = (id: string) => {
        const newSet = new Set(setlist);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSetlist(newSet);
    };
    
    const handleToggleGuest = (id: string) => {
        const newSet = new Set(guestIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            if (newSet.size >= 3) {
                setError("You can only bring up to 3 special guests.");
                return;
            }
            newSet.add(id);
        }
        setGuestIds(newSet);
        setError("");
    };
    
    const handleToggleMerch = (id: string) => {
        const newSet = new Set(chosenMerchIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setChosenMerchIds(newSet);
    };

    const chosenVenuesList = venuesForSelection.filter(v => chosenVenueIds.has(v.id));
    const venueBookingCost = chosenVenuesList.reduce((sum, v) => sum + (v.capacity * 4), 0); // $4 per capacity
    
    const opener = gameState.npcs?.find(n => n.uniqueId === openerId);
    const openerCost = opener ? opener.basePopularity * 2000 * chosenVenuesList.length : 0;
    
    let guestsCost = 0;
    guestIds.forEach(gid => {
        const guest = gameState.npcs?.find(n => n.uniqueId === gid);
        if (guest) guestsCost += guest.basePopularity * 1000 * chosenVenuesList.length;
    });

    const totalUpfrontCost = venueBookingCost + openerCost + guestsCost;

    const handleCreateTour = () => {
        if (!tourName) {
            setError("Tour must have a name.");
            return;
        }
        if (chosenVenueIds.size === 0) {
            setError("Select at least one venue.");
            return;
        }
        if (setlist.size < 10) {
            setError("Setlist must have at least 10 songs.");
            return;
        }
        
        if (money < totalUpfrontCost) {
            setError(\`You do not have enough money to book this tour. (Costs: \$\${formatNumber(totalUpfrontCost)})\`);
            return;
        }

        const isSetlistMissingHits = top3Hits.some(hit => !setlist.has(hit.id));
        const demandScore = Math.min(100, Math.floor(popularity * 1.5 + hype * 0.5));
        
        const selectedMerchItems = (merch || []).filter(m => chosenMerchIds.has(m.id));

        const newTour: Tour = {
            id: crypto.randomUUID(),
            artistId: activeArtist.id,
            name: tourName,
            bannerImage: bannerImage || 'https://images.unsplash.com/photo-1540039155732-68473682c892?auto=format&fit=crop&q=80',
            venues: chosenVenuesList.map(v => ({
                id: crypto.randomUUID(),
                name: v.name,
                city: v.city,
                capacity: v.capacity,
                ticketPrice: ticketPrice
            })),
            setlist: Array.from(setlist),
            status: 'planning',
            currentVenueIndex: 0,
            totalRevenue: 0,
            ticketsSold: 0,
            useDynamicPricing,
            useVipPackages,
            presalePercentage,
            presaleDemand: demandScore,
            isSetlistMissingHits,
            merchItems: selectedMerchItems,
            openerId: openerId || undefined,
            guestIds: guestIds.size > 0 ? Array.from(guestIds) : undefined,
            bookingCostsPaid: totalUpfrontCost
        };

        dispatch({ type: 'DEDUCT_MONEY', payload: totalUpfrontCost });
        dispatch({ type: 'CREATE_TOUR', payload: newTour });
        dispatch({ type: 'CHANGE_VIEW', payload: 'tours' });
    };

    const renderStep = () => {
        switch (step) {
            case 1: // Name, Banner, Tier
                return (
                    <div className="space-y-4">
                        <label htmlFor="banner-upload" className="cursor-pointer w-full aspect-[2/1] bg-zinc-800 rounded-lg border-2 border-dashed flex items-center justify-center overflow-hidden">
                            {bannerImage ? <img src={bannerImage} className="w-full h-full object-cover"/> : <span className="text-zinc-400">Upload Tour Banner</span>}
                        </label>
                        <input id="banner-upload" type="file" accept="image/*" className="hidden" onChange={handleBannerUpload} />
                        <input type="text" value={tourName} onChange={e => setTourName(e.target.value)} placeholder="Tour Name" className="w-full bg-zinc-700 p-3 rounded-md focus:outline-none" />
                        <div className="grid grid-cols-2 gap-3">
                            {Object.entries(TOUR_TIER_REQUIREMENTS).map(([tierName, req]) => {
                                const isAvailable = popularity >= req;
                                return (
                                    <button key={tierName} onClick={() => handleTierSelect(tierName as TourTier)} disabled={!isAvailable} className="bg-zinc-800 p-3 rounded-lg disabled:opacity-50 text-left hover:bg-zinc-700 transition-colors">
                                        <h3 className="font-bold">{tierName}</h3>
                                        <p className="text-xs text-zinc-400">Requires: {req} Popularity</p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                );
            case 2: // Venues and Pricing
                return (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold">{tier} Tour ({chosenVenueIds.size} shows)</h2>
                        <div className="bg-blue-900/30 border border-blue-500/50 p-3 rounded-lg">
                            <p className="text-sm font-bold text-blue-200">Venue Booking Costs</p>
                            <p className="text-xs text-blue-300">You must pay upfront to secure venues. Currently: \${formatNumber(venueBookingCost)}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-300">Ticket Price</label>
                            <input type="number" value={ticketPrice} onChange={e => setTicketPrice(Number(e.target.value))} className="mt-1 w-full bg-zinc-700 p-2 rounded-md focus:outline-none" />
                        </div>
                        {isModernEra && (
                            <div className="space-y-2 p-3 bg-zinc-800 rounded-lg">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={useDynamicPricing} onChange={() => setUseDynamicPricing(!useDynamicPricing)} className="form-checkbox text-red-500 rounded bg-zinc-700 border-zinc-600 focus:ring-red-500"/>
                                    <div>
                                        <span className="font-bold text-sm block">Ticketmaster Dynamic Pricing</span>
                                        <span className="text-xs text-zinc-400">Extracts 2-4x more cash per ticket depending on demand, but risks a massive PR disaster and federal investigation.</span>
                                    </div>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={useVipPackages} onChange={() => setUseVipPackages(!useVipPackages)} className="form-checkbox text-red-500 rounded bg-zinc-700 border-zinc-600 focus:ring-red-500"/>
                                    <div>
                                        <span className="font-bold text-sm block">VIP Meet & Greet Packages</span>
                                        <span className="text-xs text-zinc-400">Add highly expensive premium tickets. Huge profit margin.</span>
                                    </div>
                                </label>
                            </div>
                        )}
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                            {venuesForSelection.map(v => (
                                <label key={v.id} className="flex items-center gap-3 p-3 bg-zinc-800 rounded-lg cursor-pointer">
                                    <input type="checkbox" checked={chosenVenueIds.has(v.id)} onChange={() => handleToggleVenue(v.id)} className="form-checkbox h-5 w-5 rounded bg-zinc-700 border-zinc-600 text-red-600 focus:ring-red-500"/>
                                    <div>
                                        <p className="font-bold text-sm">{v.city} - {v.name}</p>
                                        <p className="text-xs text-zinc-400">Capacity: {formatNumber(v.capacity)}</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                        <button onClick={() => setStep(3)} className="w-full bg-red-600 hover:bg-red-500 transition-colors p-3 rounded-lg font-bold">Next: Support & Merch</button>
                    </div>
                );
            case 3: // Merch and Support Acts
                const npcList = gameState.npcs ? [...gameState.npcs].sort((a,b) => b.basePopularity - a.basePopularity).slice(0, 50) : [];
                return (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold">Merch & Support Acts</h2>
                        
                        <div className="space-y-2">
                            <h3 className="font-bold text-zinc-300 border-b border-zinc-800 pb-1">Tour Merch (Optional)</h3>
                            <p className="text-xs text-zinc-400">Selected merch will be sold at tour venues, increasing overall sales volume.</p>
                            {merch && merch.length > 0 ? (
                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                    {merch.map(m => (
                                        <label key={m.id} className="flex items-center gap-3 p-2 bg-zinc-800 rounded-lg cursor-pointer">
                                            <input type="checkbox" checked={chosenMerchIds.has(m.id)} onChange={() => handleToggleMerch(m.id)} className="form-checkbox h-4 w-4 rounded bg-zinc-700 border-zinc-600 text-red-600 focus:ring-red-500"/>
                                            <div className="flex-1 flex justify-between items-center">
                                                <span className="font-bold text-sm">{m.name}</span>
                                                <span className="text-xs bg-zinc-700 px-2 py-0.5 rounded">\${m.price.toFixed(2)}</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-zinc-500 italic">No merch available. Create some in the Merch Store.</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-bold text-zinc-300 border-b border-zinc-800 pb-1">Opener (Max 1)</h3>
                            <select 
                                value={openerId} 
                                onChange={(e) => setOpenerId(e.target.value)}
                                className="w-full bg-zinc-700 p-2 rounded-md focus:outline-none text-sm"
                            >
                                <option value="">No Opener</option>
                                {npcList.map(npc => (
                                    <option key={npc.uniqueId} value={npc.uniqueId}>
                                        {npc.artist} (\${formatNumber(npc.basePopularity * 2000 * chosenVenuesList.length)} total cost)
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="space-y-2">
                            <h3 className="font-bold text-zinc-300 border-b border-zinc-800 pb-1">Special Guests (Max 3)</h3>
                            <div className="max-h-40 overflow-y-auto space-y-1">
                                {npcList.map(npc => {
                                    if (npc.uniqueId === openerId) return null;
                                    return (
                                        <label key={npc.uniqueId} className="flex items-center gap-3 p-2 bg-zinc-800 rounded-lg cursor-pointer">
                                            <input type="checkbox" checked={guestIds.has(npc.uniqueId)} onChange={() => handleToggleGuest(npc.uniqueId)} className="form-checkbox h-4 w-4 rounded bg-zinc-700 border-zinc-600 text-red-600 focus:ring-red-500"/>
                                            <div className="flex-1 flex justify-between items-center text-sm">
                                                <span>{npc.artist}</span>
                                                <span className="text-xs text-zinc-400">Cost: \${formatNumber(npc.basePopularity * 1000 * chosenVenuesList.length)}</span>
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="bg-zinc-800 p-3 rounded-lg flex justify-between items-center font-bold border border-zinc-700">
                            <span>Total Upfront Cost:</span>
                            <span className={money >= totalUpfrontCost ? 'text-green-400' : 'text-red-400'}>
                                \${formatNumber(totalUpfrontCost)}
                            </span>
                        </div>

                        {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
                        <button onClick={() => { setError(''); setStep(4); }} className="w-full bg-red-600 hover:bg-red-500 transition-colors p-3 rounded-lg font-bold">Next: Setlist</button>
                    </div>
                );
            case 4: // Setlist
                const isMissingHits = top3Hits.some(hit => !setlist.has(hit.id));
                return (
                     <div className="space-y-4">
                        <h2 className="text-xl font-bold">Setlist ({setlist.size})</h2>
                        
                        {isMissingHits && (
                            <div className="bg-orange-500/20 text-orange-400 p-3 rounded-lg text-sm border border-orange-500/50">
                                <strong>Warning:</strong> You are missing some of your Top 3 biggest hits in the setlist! If you don't include them, the tour will suffer a -50% penalty to revenue and ticket sales.
                            </div>
                        )}

                        <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                            {allSongs.map(song => {
                                const isHit = top3Hits.some(h => h.id === song.id);
                                return (
                                <button key={song.id} onClick={() => handleToggleSetlist(song.id)} className={\`w-full flex items-center gap-3 p-2 rounded-lg \${setlist.has(song.id) ? 'bg-red-500/20' : 'bg-zinc-800'}\`}>
                                    <input type="checkbox" readOnly checked={setlist.has(song.id)} className="form-checkbox h-5 w-5 rounded bg-zinc-700 border-zinc-600 text-red-600 focus:ring-red-500" />
                                    <img src={song.coverArt} className="w-12 h-12 rounded-md object-cover"/>
                                    <div className="text-left flex-grow">
                                        <p className="font-semibold flex items-center gap-2">
                                            {song.title}
                                            {isHit && <span className="text-[10px] bg-amber-500 text-black px-1.5 py-0.5 rounded font-bold uppercase">Top Hit</span>}
                                        </p>
                                        {!song.isReleased && <p className="text-xs font-bold text-yellow-300 bg-yellow-900/50 px-2 py-0.5 rounded-full inline-block mt-0.5">Unreleased</p>}
                                    </div>
                                </button>
                            )})}
                        </div>
                        <button onClick={() => setStep(5)} className="w-full bg-red-600 hover:bg-red-500 transition-colors p-3 rounded-lg font-bold">Next: Presale</button>
                    </div>
                );
            case 5: // Presale
                return (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold">Presale Configuration</h2>
                        <div className="bg-zinc-800 p-4 rounded-xl space-y-4 border border-zinc-700">
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-2">Presale Allocation: {presalePercentage}%</label>
                                <input 
                                    type="range" 
                                    min="0" max="100" step="5"
                                    value={presalePercentage} 
                                    onChange={(e) => setPresalePercentage(Number(e.target.value))} 
                                    className="w-full accent-blue-500" 
                                />
                                <p className="text-xs text-zinc-400 mt-2">
                                    Choose how many tickets are available during presale. High demand during presale will help gauge excitement.
                                </p>
                            </div>
                        </div>
                        {error && <p className="text-red-500 font-bold text-sm bg-red-900/20 p-3 rounded-lg">{error}</p>}
                        <button 
                            onClick={handleCreateTour} 
                            disabled={chosenVenueIds.size === 0 || !tourName || setlist.size < 10} 
                            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition-colors p-4 rounded-lg font-bold text-lg"
                        >
                            Finalize Tour & Pay Booking (\${formatNumber(totalUpfrontCost)})
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className="h-full w-full bg-zinc-900 text-white overflow-y-auto">
            <header className="p-4 flex items-center gap-4 bg-zinc-950 sticky top-0 z-10 border-b border-zinc-800">
                <button onClick={() => dispatch({type: 'CHANGE_VIEW', payload: 'tours'})} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold">Plan Tour</h1>
                <div className="ml-auto text-green-400 font-bold text-sm">
                    Bank: \${formatNumber(money)}
                </div>
            </header>

            <main className="p-4 max-w-2xl mx-auto pb-24">
                <div className="flex items-center gap-2 mb-6">
                    {[1,2,3,4,5].map(s => (
                        <div key={s} className={\`h-2 flex-1 rounded-full \${s <= step ? 'bg-red-600' : 'bg-zinc-800'}\`}></div>
                    ))}
                </div>
                {renderStep()}
            </main>
        </div>
    );
};

export default CreateTourView;
`;

fs.writeFileSync('components/CreateTourView.tsx', code);
