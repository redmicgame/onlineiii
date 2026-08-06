import { NPC_ARTIST_IMAGES, getArtistImage } from "../constants";
import React, { useState } from 'react';
import { useGame, formatNumber } from '../context/GameContext';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import type { SignedNpc, Label } from '../types';
import { LABELS } from '../constants';

const ManageLabelView: React.FC = () => {
    const { gameState, dispatch, activeArtistData } = useGame();
    const customLabel = activeArtistData?.customLabels?.[0];

    const [activeTab, setActiveTab] = useState<'roster' | 'discover' | 'deals'>('roster');
    const [selectedNpcToSign, setSelectedNpcToSign] = useState<any | null>(null);
    const [selectedNpcToRenew, setSelectedNpcToRenew] = useState<any | null>(null);

    if (!activeArtistData || !customLabel) {
        return (
            <div className="h-full w-full bg-zinc-900 overflow-y-auto w-full p-4 text-white">
                <button onClick={() => dispatch({type: 'CHANGE_VIEW', payload: 'game'})} className="p-2 bg-zinc-800 rounded-lg mb-4">Back</button>
                <p>No custom label found.</p>
            </div>
        );
    }

    const availableNpcs = [...gameState.npcs].filter(npc => 
        !customLabel.signedNpcs?.some(sn => sn.name === npc.artist) && npc.basePopularity > 10000
    ).sort((a,b) => b.basePopularity - a.basePopularity).slice(0, 30);
    
    // Deduplicate array based on artists
    const uniqueAvailableNpcs = Array.from(new Map(availableNpcs.map(item => [item.artist, item])).values());

    const handleSignNPC = (npcName: string, basePopularity: number, isRenewal: boolean = false) => {
        const advance = Math.min(activeArtistData.money, Math.max(10000, Math.floor(basePopularity * 0.005)));
        const durationWeeks = 52;
        const royaltyRate = 50; 

        if (activeArtistData.money < advance) {
            alert("Not enough money for the advance.");
            return;
        }

        dispatch({
            type: 'SIGN_NPC_TO_LABEL',
            payload: {
                npcName,
                advance,
                royaltyRate,
                durationWeeks
            }
        });
        setSelectedNpcToSign(null);
        setSelectedNpcToRenew(null);
    };

    const handleReleaseContract = (npcName: string) => {
        dispatch({
             type: 'RELEASE_NPC_FROM_LABEL',
             payload: { npcName }
        });
        setSelectedNpcToRenew(null);
    };

    return (
        <div className="h-full w-full bg-zinc-900 overflow-y-auto">
            <header className="p-4 flex items-center gap-4 sticky top-0 bg-zinc-900/80 backdrop-blur-sm z-10 border-b border-zinc-700/50">
                <button onClick={() => dispatch({type: 'CHANGE_VIEW', payload: 'game'})} className="p-2 rounded-full hover:bg-white/10">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold">{customLabel.name}</h1>
                    <p className="text-sm text-zinc-400">Label Management</p>
                </div>
            </header>
            
            <div className="p-4">
                <div className="flex gap-4 mb-6">
                    <button 
                        className={`flex-1 py-2 font-bold rounded-lg ${activeTab === 'roster' ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}
                        onClick={() => setActiveTab('roster')}
                    >
                        Active Roster ({customLabel.signedNpcs?.filter(n => n.status !== 'dropped').length || 0})
                    </button>
                    <button 
                         className={`flex-1 py-2 font-bold rounded-lg ${activeTab === 'discover' ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}
                         onClick={() => setActiveTab('discover')}
                    >
                        A&R / Discovery
                    </button>
                    <button 
                         className={`flex-1 py-2 font-bold rounded-lg ${activeTab === 'deals' ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}
                         onClick={() => setActiveTab('deals')}
                    >
                        Corporate Deals
                    </button>
                </div>
                
                {activeTab === 'roster' && (
                    <div className="space-y-4">
                        {(!customLabel.signedNpcs || customLabel.signedNpcs.filter(n => n.status !== 'dropped').length === 0) ? (
                            <div className="text-center text-zinc-500 py-10 bg-zinc-800/50 rounded-xl">
                                <p>No artists currently signed to your label.</p>
                                <p className="text-sm mt-2">Go to A&R to discover talent.</p>
                            </div>
                        ) : (
                            customLabel.signedNpcs.filter(n => n.status !== 'dropped').map(npc => {
                                const weeksPassed = (gameState.date.year * 52 + gameState.date.week) - (npc.contract.startDate.year * 52 + npc.contract.startDate.week);
                                const weeksRemaining = npc.contract.durationWeeks - weeksPassed;
                                const isExpired = npc.status === 'expired' || weeksRemaining <= 0;
                                const npcProfile = gameState.npcs.find(n => n.artist === npc.name);
                                
                                return (
                                    <div key={npc.id} className="bg-zinc-800 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between border border-zinc-700/50 relative overflow-hidden gap-3">
                                        {isExpired && <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">Contract Expired</div>}
                                        
                                        <div className="flex flex-row items-center gap-3">
                                            <img src={npcProfile?.coverArt || getArtistImage(npc.name)} className="w-12 h-12 rounded-full object-cover" alt={npc.name} />
                                            <div>
                                                <h3 className="font-bold text-lg leading-tight">{npc.name}</h3>
                                                <p className="text-sm text-zinc-400">Generated: <span className="text-green-400 font-mono">${formatNumber(Math.floor(npc.revenueGenerated))}</span></p>
                                                {!isExpired && <p className="text-xs text-zinc-500 mt-1">{Math.max(0, weeksRemaining)} weeks remaining</p>}
                                            </div>
                                        </div>
                                        <div>
                                             {isExpired ? (
                                                  <button onClick={() => setSelectedNpcToRenew(npc)} className="w-full sm:w-auto bg-yellow-500 text-black px-4 py-2 font-bold rounded-lg text-sm">Renegotiate</button>
                                             ) : (
                                                  <div className="text-left sm:text-right">
                                                      <p className="text-xs text-zinc-400 uppercase tracking-wider font-bold">Split</p>
                                                      <p className="font-mono text-white">{100 - npc.contract.royaltyRate}% / {npc.contract.royaltyRate}%</p>
                                                  </div>
                                             )}
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                )}
                
                {activeTab === 'discover' && (
                    <div className="space-y-4 pb-12">
                        <p className="text-zinc-400 text-sm mb-4">Trending artists looking for representation. Signing independent talent immediately funnels their streaming revenue (after their cut) to your label.</p>
                        {uniqueAvailableNpcs.map(npc => (
                            <div key={npc.uniqueId} className="bg-zinc-800 p-3 rounded-xl flex items-center justify-between border border-zinc-700">
                                <div className="flex items-center gap-3 w-[60%]">
                                    <img src={getArtistImage(npc.artist, npc.coverArt)} className="w-12 h-12 rounded-full object-cover" alt={npc.artist} />
                                    <div className="truncate shrink">
                                        <h3 className="font-bold truncate">{npc.artist}</h3>
                                        <p className="text-xs text-zinc-400 truncate">Top pop: {formatNumber(npc.basePopularity)}</p>
                                    </div>
                                </div>
                                <button className="bg-red-600 hover:bg-red-500 text-white font-bold py-1.5 px-4 rounded-lg text-sm shrink-0" onClick={() => setSelectedNpcToSign(npc)}>
                                    Offer Deal
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                
                {activeTab === 'deals' && (
                    <div className="space-y-6 pb-12">
                        <div className="bg-zinc-800 p-5 rounded-xl border border-zinc-700">
                            <h3 className="font-bold text-lg mb-2">Exclusive License</h3>
                            <p className="text-sm text-zinc-400 mb-4">
                                Grant an exclusive license to a major label. This unlocks their promotional multiplier and stacks to your label's radio promotion. It will appear on your release credits as "Under exclusive license to [Label]".
                            </p>
                            
                            <div className="space-y-3">
                                <div 
                                    className={`p-3 rounded-lg border ${!customLabel.exclusiveLicenseId ? 'border-red-500 bg-red-500/10' : 'border-zinc-700 bg-zinc-900'} cursor-pointer transition-colors`}
                                    onClick={() => dispatch({ type: 'SET_EXCLUSIVE_LICENSE', payload: { customLabelId: customLabel.id, exclusiveLicenseId: undefined } })}
                                >
                                    <h4 className="font-bold text-white">None (Fully Independent)</h4>
                                </div>
                                {LABELS.map(l => (
                                    <div 
                                        key={l.id} 
                                        className={`p-3 rounded-lg border ${customLabel.exclusiveLicenseId === l.id ? 'border-red-500 bg-red-500/10' : 'border-zinc-700 bg-zinc-900'} cursor-pointer flex items-center justify-between transition-colors hover:border-zinc-500`}
                                        onClick={() => dispatch({ type: 'SET_EXCLUSIVE_LICENSE', payload: { customLabelId: customLabel.id, exclusiveLicenseId: l.id } })}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white rounded flex flex-shrink-0 items-center justify-center p-1">
                                                <img src={l.logo} alt={l.name} className="max-w-full max-h-full object-contain" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white">{l.name}</h4>
                                                <p className="text-xs text-zinc-400">Promo Value: {l.promotionMultiplier}x</p>
                                            </div>
                                        </div>
                                        {customLabel.exclusiveLicenseId === l.id && <span className="text-red-500 font-bold text-xl">✓</span>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Modal for Signing / Renegotiating */}
            {(selectedNpcToSign || selectedNpcToRenew) && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="bg-zinc-900 border border-zinc-700 rounded-xl w-full max-w-sm p-6 shadow-2xl relative">
                        <button onClick={() => { setSelectedNpcToSign(null); setSelectedNpcToRenew(null); }} className="absolute top-4 right-4 text-zinc-400 hover:text-white font-bold">✕</button>
                        
                        <h2 className="text-xl font-bold mb-4">{selectedNpcToRenew ? 'Renegotiate Deal' : 'Sign Artist'}</h2>
                        
                        <div className="flex items-center gap-4 mb-4">
                            <img 
                                src={
                                    selectedNpcToSign?.coverArt || gameState.npcs.find(n => n.artist === selectedNpcToRenew?.name)?.coverArt || NPC_ARTIST_IMAGES[selectedNpcToSign?.artist || selectedNpcToRenew?.name || ''] || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedNpcToSign?.artist || selectedNpcToRenew?.name || '')}&background=random&color=fff&size=250`
                                } 
                                alt="Artist" 
                                className="w-16 h-16 rounded-full object-cover shadow-lg" 
                            />
                            <h3 className="text-2xl text-red-500 font-bold leading-tight">{selectedNpcToSign ? selectedNpcToSign.artist : selectedNpcToRenew.name}</h3>
                        </div>
                        
                        {selectedNpcToRenew && (
                            <div className="mb-4 bg-zinc-800 p-3 rounded-lg text-sm text-zinc-300">
                                This artist's contract has expired. You can offer them a new advance to keep them on your roster, or free them from the label completely.
                            </div>
                        )}
                        
                        <div className="space-y-4 mb-6">
                            <div className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50">
                                 <p className="text-xs text-zinc-400 uppercase tracking-wider mb-1 font-bold">Artist Demands</p>
                                 <div className="flex justify-between border-b border-zinc-700/50 pb-2 mb-2">
                                     <span className="text-sm">Signing Advance</span>
                                     <span className="font-mono text-green-400 font-bold">-${formatNumber(Math.max(10000, Math.floor((selectedNpcToSign?.basePopularity || 20000) * 0.005)))}</span>
                                 </div>
                                 <div className="flex justify-between border-b border-zinc-700/50 pb-2 mb-2">
                                     <span className="text-sm">Revenue Split (Label/Artist)</span>
                                     <span className="font-mono font-bold">50% / 50%</span>
                                 </div>
                                 <div className="flex justify-between pb-1">
                                     <span className="text-sm">Duration</span>
                                     <span className="font-mono font-bold">52 Weeks</span>
                                 </div>
                            </div>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                            <button 
                                onClick={() => handleSignNPC(selectedNpcToSign ? selectedNpcToSign.artist : selectedNpcToRenew.name, selectedNpcToSign ? selectedNpcToSign.basePopularity : 20000, !!selectedNpcToRenew)}
                                className="w-full bg-white text-black font-bold py-2.5 rounded-lg hover:bg-zinc-200 transition-colors"
                            >
                                {selectedNpcToRenew ? 'Pay Advance & Renew' : 'Pay Advance & Sign'}
                            </button>
                            {selectedNpcToRenew && (
                                 <button 
                                     onClick={() => handleReleaseContract(selectedNpcToRenew.name)}
                                     className="w-full bg-red-900/50 text-red-500 font-bold py-2.5 rounded-lg hover:bg-red-900/80 transition-colors"
                                 >
                                     Free Artist
                                 </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageLabelView;
