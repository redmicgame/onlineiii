
import React, { useState } from 'react';
import { useGame, formatNumber } from '../context/GameContext';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import { GIGS, MANAGERS } from '../constants';
import { ArtistData } from '../types';

interface Gig {
    name: string;
    description: string;
    cashRange: [number, number];
    hype: number;
    isAvailable: (state: ArtistData) => boolean;
    requirements: string;
}

const REGIONS = ["US", "Canada", "UK", "Latin America", "Asia", "Africa"] as const;

const GigsView: React.FC = () => {
    const { dispatch, activeArtistData } = useGame();
    const [selectedRegion, setSelectedRegion] = useState<string>("US");

    if (!activeArtistData) return null;
    const { performedGigThisWeek, manager, location } = activeArtistData;
    const playerLocation = location || "US";

    const handlePerform = (gig: Gig) => {
        if (performedGigThisWeek || !gig.isAvailable(activeArtistData)) return;

        let cashEarned = Math.floor(Math.random() * (gig.cashRange[1] - gig.cashRange[0] + 1)) + gig.cashRange[0];
        const isRemoteGig = selectedRegion !== playerLocation;
        let flightFee = 0;
        
        if (isRemoteGig) {
            flightFee = Math.floor(cashEarned * 0.25);
            cashEarned -= flightFee;
        }

        dispatch({ 
            type: 'PERFORM_GIG', 
            payload: { 
                cash: cashEarned, 
                hype: gig.hype,
                region: selectedRegion
            } 
        });
        
        if (isRemoteGig) {
            alert(`You performed in ${selectedRegion}! A flight fee of $${formatNumber(flightFee)} (25%) was deducted from your earnings.`);
        }
    };

    const currentManager = manager ? MANAGERS.find(m => m.id === manager.id) : null;

    return (
        <div className="h-full w-full bg-zinc-900 overflow-y-auto">
            <header className="p-4 flex items-center gap-4 sticky top-0 bg-zinc-900/80 backdrop-blur-sm z-10 border-b border-zinc-700/50">
                <button onClick={() => dispatch({type: 'CHANGE_VIEW', payload: 'game'})} className="p-2 rounded-full hover:bg-white/10">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold">Perform Live</h1>
            </header>
            <main className="p-4 space-y-4">
                {currentManager && (
                    <div className="bg-blue-900/50 border border-blue-700 text-blue-300 text-center p-3 rounded-lg">
                        Your manager, {currentManager.name}, is automatically booking {currentManager.autoGigsPerWeek} gig{currentManager.autoGigsPerWeek > 1 ? 's' : ''} for you each week. You can still perform one additional gig yourself.
                    </div>
                )}
                {performedGigThisWeek && (
                    <div className="bg-yellow-900/50 border border-yellow-700 text-yellow-300 text-center p-3 rounded-lg">
                        You've already performed your manual gig this week. Come back next week!
                    </div>
                )}
                
                <div className="bg-zinc-800 p-4 rounded-lg">
                    <h2 className="text-xl font-bold mb-2">Select Tour Region</h2>
                    <p className="text-sm text-zinc-400 mb-3">Performing outside your home region ({playerLocation}) will incur a 25% flight fee, but builds regional popularity.</p>
                    <select 
                        value={selectedRegion} 
                        onChange={(e) => setSelectedRegion(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-white"
                    >
                        {REGIONS.map(r => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                </div>

                {GIGS.map(gig => {
                    const available = gig.isAvailable(activeArtistData);
                    const canPerform = available && !performedGigThisWeek;
                    return (
                        <div key={gig.name} className={`bg-zinc-800 p-4 rounded-lg transition-opacity ${!available ? 'opacity-50' : ''}`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-bold">{gig.name}</h2>
                                    <p className="text-sm text-zinc-400 mt-1">{gig.description}</p>
                                    {!available && (
                                        <p className="text-xs text-red-400 mt-2 font-semibold">Requires: {gig.requirements}</p>
                                    )}
                                </div>
                                <div className="text-right flex-shrink-0 ml-4">
                                    <p className="font-bold text-green-400">${formatNumber(gig.cashRange[0])} - ${formatNumber(gig.cashRange[1])}</p>
                                    {selectedRegion !== playerLocation && (
                                        <p className="text-xs text-red-400 mb-1">Flight: -25%</p>
                                    )}
                                    <p className="text-sm text-red-400">+{gig.hype} Hype</p>
                                </div>
                            </div>
                             <button 
                                onClick={() => handlePerform(gig)}
                                disabled={!canPerform}
                                className="mt-4 w-full h-10 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-lg shadow-red-600/20 disabled:bg-zinc-600 disabled:shadow-none disabled:cursor-not-allowed"
                             >
                                Perform
                            </button>
                        </div>
                    );
                })}
            </main>
        </div>
    );
};

export default GigsView;
