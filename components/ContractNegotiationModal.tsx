import React, { useState } from 'react';
import { Label, Contract } from '../types';
import { useGame, formatNumber } from '../context/GameContext';
import { createDefaultContract } from '../utils/contractUtils';

interface Props {
    label: Label;
    onClose: () => void;
    onSign: (contract: Contract) => void;
    careerStreams: number;
}

const evaluateOffer = (contract: Contract, labelTier: string, careerStreams: number) => {
    // Determine the label's baseline requirement
    let baselineRequirement = 0;
    if (labelTier === 'Top') baselineRequirement = 80;
    else if (labelTier === 'Mid-high') baselineRequirement = 60;
    else if (labelTier === 'Mid-Low') baselineRequirement = 40;
    else if (labelTier === 'Low') baselineRequirement = 20;
    
    // As the artist gets bigger, their leverage goes up, reducing the baseline
    const leverage = Math.min(40, Math.floor(careerStreams / 100000000) * 2);
    baselineRequirement = Math.max(10, baselineRequirement - leverage);

    // Calculate the "generosity" of the offer to the label
    let score = 50; 
    
    // Core terms
    score += (contract.durationWeeks / 52) * 5; 
    score += contract.albumQuota * 2;
    score -= (contract.advance / 100000);
    score -= contract.royaltyPercent; // if royalty is high, score goes down
    
    // Ownership
    if (contract.mastersOwnership === 'Label') score += 30;
    else if (contract.mastersOwnership === 'Split') score += (100 - contract.mastersSplitPercent) * 0.3;
    else score -= 30; // Artist owns masters

    if (contract.publishingRights === 'Label') score += 20;
    else if (contract.publishingRights === 'Split') score += (100 - contract.publishingSplitPercent) * 0.2;
    else score -= 20;
    
    if (contract.reversionClause) score -= 10;
    
    // Financials
    score -= (contract.tourSupport / 50000);
    score -= (contract.marketingBudget / 50000);
    score += (100 - contract.merchPercent) * 0.2;
    score += (100 - contract.streamingSplitArtist) * 0.5;
    score += (100 - contract.sponsorshipSplitArtist) * 0.2;
    
    if (contract.recoupmentTerms === '100%') score += 15;
    else if (contract.recoupmentTerms === '50%') score += 5;
    else score -= 20; // None
    
    score -= contract.successBonus / 50000;
    
    if (contract.revenueAuditRights) score -= 5;
    if (contract.producerSplitsLabelPaid) score -= 10;
    
    // Ops & Control
    if (contract.creativeControl === 'High') score -= 15;
    else if (contract.creativeControl === 'Medium') score -= 5;
    else score += 10; // Low
    
    if (contract.releaseDeadlines) score += 5;
    if (contract.exclusivity) score += 10;
    
    if (contract.collabPermissions === 'Any') score -= 5;
    else if (contract.collabPermissions === 'Strict') score += 10;
    
    if (contract.socialMediaObligations === 'Heavy') score += 5;
    else if (contract.socialMediaObligations === 'None') score -= 5;
    
    if (contract.brandingApproval === 'Artist') score -= 10;
    else score += 10;
    
    if (contract.independentRestrictions) score += 10;
    
    if (contract.renewalOptions) score += 5;
    if (contract.earlyTermination) score -= 15;
    score += (contract.penaltyAmount / 100000); // 1M penalty = +10
    
    const isAccepted = score >= baselineRequirement;
    
    return {
        score,
        baselineRequirement,
        isAccepted,
        message: isAccepted 
            ? `We find these terms agreeable. Welcome to the label.` 
            : `These terms are unacceptable. You're asking for too much value without giving us enough control/upside.`
    };
};

export const ContractNegotiationModal: React.FC<Props> = ({ label, onClose, onSign, careerStreams }) => {
    const { gameState, activeArtist } = useGame();
    
    const [contract, setContract] = useState<Contract>(() => createDefaultContract({
        labelId: label.id,
        artistId: activeArtist!.id,
        startDate: gameState.date,
        advance: label.isDistributionOnly ? 0 : (label.tier === 'Top' ? 2000000 : (label.tier === 'Low' ? 300000 : 750000)),
        merchPercent: 50,
        marketingBudget: 100000,
        royaltyPercent: 15,
        streamingSplitArtist: 15,
        mastersOwnership: 'Label',
        mastersSplitPercent: 0,
        creativeControl: 'Medium'
    }));
    
    const [negotiationResult, setNegotiationResult] = useState<{message: string, isAccepted: boolean} | null>(null);

    const handleNegotiate = () => {
        const result = evaluateOffer(contract, label.tier, careerStreams);
        setNegotiationResult(result);
    };

    const handleAccept = () => {
        onSign(contract);
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
             <div className="bg-zinc-900 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-zinc-800 shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="p-5 border-b border-zinc-800 flex justify-between items-center bg-zinc-900 sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <img src={label.logo} alt={label.name} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                            <h2 className="text-xl font-bold">Negotiate Contract with {label.name}</h2>
                            <p className="text-xs text-zinc-400">{label.tier} Tier Label</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white pb-1 font-mono text-2xl">×</button>
                </div>

                <div className="flex-grow overflow-y-auto p-6 space-y-8 custom-scrollbar">
                    <fieldset disabled={negotiationResult?.isAccepted} className="space-y-8">
                    {/* Core Terms */}
                    <section>
                        <h3 className="text-lg font-bold text-[#1ed760] mb-4 uppercase tracking-wider text-sm sticky top-0 bg-zinc-900/90 py-2">Core Terms</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-zinc-400 mb-1">Contract Duration (Weeks)</label>
                                <input type="number" value={contract.durationWeeks} onChange={e => setContract({...contract, durationWeeks: Number(e.target.value)})} className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white" min={52} />
                            </div>
                            <div>
                                <label className="block text-xs text-zinc-400 mb-1">Album Quota</label>
                                <input type="number" value={contract.albumQuota} onChange={e => setContract({...contract, albumQuota: Number(e.target.value)})} className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white" min={1} />
                            </div>
                            <div>
                                <label className="block text-xs text-zinc-400 mb-1">Advance ($)</label>
                                <input type="number" value={contract.advance} onChange={e => setContract({...contract, advance: Number(e.target.value)})} className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white" />
                            </div>
                            <div>
                                <label className="block text-xs text-zinc-400 mb-1">Standard Royalty (%)</label>
                                <input type="number" value={contract.royaltyPercent} onChange={e => setContract({...contract, royaltyPercent: Number(e.target.value)})} className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white" max={100} min={0} />
                            </div>
                        </div>
                    </section>

                    {/* Financials */}
                    <section>
                        <h3 className="text-lg font-bold text-[#1ed760] mb-4 uppercase tracking-wider text-sm sticky top-0 bg-zinc-900/90 py-2">Financials & Splits</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-zinc-400 mb-1">Marketing Budget ($)</label>
                                <input type="number" value={contract.marketingBudget} onChange={e => setContract({...contract, marketingBudget: Number(e.target.value)})} className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white" />
                            </div>
                            <div>
                                <label className="block text-xs text-zinc-400 mb-1">Tour Support ($)</label>
                                <input type="number" value={contract.tourSupport} onChange={e => setContract({...contract, tourSupport: Number(e.target.value)})} className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white" />
                            </div>
                            <div>
                                <label className="block text-xs text-zinc-400 mb-1">Merch Artist Split (%)</label>
                                <input type="number" value={contract.merchPercent} onChange={e => setContract({...contract, merchPercent: Number(e.target.value)})} className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white" max={100} min={0} />
                            </div>
                            <div>
                                <label className="block text-xs text-zinc-400 mb-1">Streaming Artist Split (%)</label>
                                <input type="number" value={contract.streamingSplitArtist} onChange={e => setContract({...contract, streamingSplitArtist: Number(e.target.value)})} className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white" max={100} min={0} />
                            </div>
                            <div>
                                <label className="block text-xs text-zinc-400 mb-1">Sponsorship Artist Split (%)</label>
                                <input type="number" value={contract.sponsorshipSplitArtist} onChange={e => setContract({...contract, sponsorshipSplitArtist: Number(e.target.value)})} className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white" max={100} min={0} />
                            </div>
                            <div>
                                <label className="block text-xs text-zinc-400 mb-1">Recoupment Terms</label>
                                <select value={contract.recoupmentTerms} onChange={e => setContract({...contract, recoupmentTerms: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white">
                                    <option value="100%">100% Recouped against Artist</option>
                                    <option value="50%">50% Recouped against Artist</option>
                                    <option value="None">No Recoupment (Artist pays nothing back)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-zinc-400 mb-1">Success Bonus ($)</label>
                                <input type="number" value={contract.successBonus} onChange={e => setContract({...contract, successBonus: Number(e.target.value)})} className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white" />
                            </div>
                             <div className="flex items-center gap-2 mt-4 text-xs text-zinc-300">
                                <input type="checkbox" checked={contract.revenueAuditRights} onChange={e => setContract({...contract, revenueAuditRights: e.target.checked})} className="w-4 h-4" />
                                <label>Artist gets Revenue Audit Rights</label>
                            </div>
                            <div className="flex items-center gap-2 mt-4 text-xs text-zinc-300">
                                <input type="checkbox" checked={contract.producerSplitsLabelPaid} onChange={e => setContract({...contract, producerSplitsLabelPaid: e.target.checked})} className="w-4 h-4" />
                                <label>Label pays Producer Splits (Not out of Artist advance)</label>
                            </div>
                        </div>
                    </section>
                    
                    {/* Ownership & Rights */}
                    <section>
                        <h3 className="text-lg font-bold text-[#1ed760] mb-4 uppercase tracking-wider text-sm sticky top-0 bg-zinc-900/90 py-2">Ownership & Rights</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-zinc-400 mb-1">Masters Ownership</label>
                                <select value={contract.mastersOwnership} onChange={e => setContract({...contract, mastersOwnership: e.target.value as any})} className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white">
                                    <option value="Label">Label Owns Masters</option>
                                    <option value="Split">Split Ownership</option>
                                    <option value="Artist">Artist Owns Masters</option>
                                </select>
                            </div>
                            {contract.mastersOwnership === 'Split' && (
                                <div>
                                    <label className="block text-xs text-zinc-400 mb-1">Masters Artist Split (%)</label>
                                    <input type="number" value={contract.mastersSplitPercent} onChange={e => setContract({...contract, mastersSplitPercent: Number(e.target.value)})} className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white" max={100} min={0} />
                                </div>
                            )}
                            <div>
                                <label className="block text-xs text-zinc-400 mb-1">Publishing Rights</label>
                                <select value={contract.publishingRights} onChange={e => setContract({...contract, publishingRights: e.target.value as any})} className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white">
                                    <option value="Label">Label Controls Publishing</option>
                                    <option value="Split">Split Publishing</option>
                                    <option value="Artist">Artist Controls Publishing</option>
                                </select>
                            </div>
                            {contract.publishingRights === 'Split' && (
                                <div>
                                    <label className="block text-xs text-zinc-400 mb-1">Publishing Artist Split (%)</label>
                                    <input type="number" value={contract.publishingSplitPercent} onChange={e => setContract({...contract, publishingSplitPercent: Number(e.target.value)})} className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white" max={100} min={0} />
                                </div>
                            )}
                            <div>
                                <label className="block text-xs text-zinc-400 mb-1">Licensing Rights (Sync)</label>
                                <select value={contract.licensingRights} onChange={e => setContract({...contract, licensingRights: e.target.value as any})} className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white">
                                    <option value="Label">Label Exclusive Control</option>
                                    <option value="Split">Joint Approval Required</option>
                                    <option value="Artist">Artist Exclusive Control</option>
                                </select>
                            </div>
                             <div className="flex items-center gap-2 mt-4 text-xs text-zinc-300">
                                <input type="checkbox" checked={contract.reversionClause} onChange={e => setContract({...contract, reversionClause: e.target.checked})} className="w-4 h-4" />
                                <label>Reversion Clause (Masters revert to Artist after deal)</label>
                            </div>
                        </div>
                    </section>

                    {/* Operations & Legal */}
                    <section>
                        <h3 className="text-lg font-bold text-[#1ed760] mb-4 uppercase tracking-wider text-sm sticky top-0 bg-zinc-900/90 py-2">Operations, Control & Legal</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-zinc-400 mb-1">Creative Control</label>
                                <select value={contract.creativeControl} onChange={e => setContract({...contract, creativeControl: e.target.value as any})} className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white">
                                    <option value="High">High (Artist Dictates)</option>
                                    <option value="Medium">Medium (Joint Decision)</option>
                                    <option value="Low">Low (Label Dictates)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-zinc-400 mb-1">Collab Permissions</label>
                                <select value={contract.collabPermissions} onChange={e => setContract({...contract, collabPermissions: e.target.value as any})} className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white">
                                    <option value="Any">Accept Any Features</option>
                                    <option value="Label Approval">Label Approval Needed</option>
                                    <option value="Strict">Strict Exclusivity</option>
                                </select>
                            </div>
                             <div>
                                <label className="block text-xs text-zinc-400 mb-1">Branding & Image Approval</label>
                                <select value={contract.brandingApproval} onChange={e => setContract({...contract, brandingApproval: e.target.value as any})} className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white">
                                    <option value="Artist">Artist Controls Image</option>
                                    <option value="Label">Label Veto Power</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-zinc-400 mb-1">Breach Penalty ($)</label>
                                <input type="number" value={contract.penaltyAmount} onChange={e => setContract({...contract, penaltyAmount: Number(e.target.value)})} className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white" />
                            </div>
                            
                            <div className="flex flex-col gap-2 mt-2 text-xs text-zinc-300">
                                <label className="flex items-center gap-2"><input type="checkbox" checked={contract.releaseDeadlines} onChange={e => setContract({...contract, releaseDeadlines: e.target.checked})} className="w-4 h-4" /> Strict Release Deadlines</label>
                                <label className="flex items-center gap-2"><input type="checkbox" checked={contract.exclusivity} onChange={e => setContract({...contract, exclusivity: e.target.checked})} className="w-4 h-4" /> 100% Exclusivity</label>
                                <label className="flex items-center gap-2"><input type="checkbox" checked={contract.independentRestrictions} onChange={e => setContract({...contract, independentRestrictions: e.target.checked})} className="w-4 h-4" /> Independent Release Restrictions</label>
                                <label className="flex items-center gap-2"><input type="checkbox" checked={contract.renewalOptions} onChange={e => setContract({...contract, renewalOptions: e.target.checked})} className="w-4 h-4" /> Label Option to Renew</label>
                                <label className="flex items-center gap-2"><input type="checkbox" checked={contract.earlyTermination} onChange={e => setContract({...contract, earlyTermination: e.target.checked})} className="w-4 h-4" /> Early Termination Allowed</label>
                                <label className="flex items-center gap-2"><input type="checkbox" checked={contract.nda} onChange={e => setContract({...contract, nda: e.target.checked})} className="w-4 h-4" /> NDA / Confidentiality Required</label>
                            </div>
                        </div>
                    </section>
                    </fieldset>
                </div>

                <div className="p-5 border-t border-zinc-800 bg-zinc-900 sticky bottom-0 z-10 flex flex-col gap-4">
                    {negotiationResult && (
                        <div className={`p-4 rounded-lg font-bold text-sm ${negotiationResult.isAccepted ? 'bg-green-900/50 text-green-300 border border-green-700' : 'bg-red-900/50 text-red-300 border border-red-700'}`}>
                            {negotiationResult.message}
                            <div className="mt-2 text-xs text-white/50 opacity-0 group-hover:opacity-100 transition-opacity">(Dev Note: Score {formatNumber(negotiationResult.score)} required {formatNumber(negotiationResult.baselineRequirement)})</div>
                        </div>
                    )}
                    
                    <div className="flex gap-4">
                        <button onClick={handleNegotiate} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors shadow-lg">Submit Offer</button>
                        {negotiationResult?.isAccepted && (
                             <button onClick={handleAccept} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors shadow-lg flex items-center justify-center gap-2">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                                Sign Agreement
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
