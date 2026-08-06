

import React, { useState, useMemo } from 'react';
import { useGame, formatNumber } from '../context/GameContext';
import { LABELS, CUSTOM_LABEL_TIERS } from '../constants';
import { getEraConfiguration } from '../utils/eraUtils';
import type { CustomLabel, Label } from '../types';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

const CreateLabelView: React.FC = () => {
    const { gameState, dispatch, activeArtist, activeArtistData } = useGame();

    const [name, setName] = useState('');
    const [logo, setLogo] = useState<string | null>(null);
    const [dealWith, setDealWith] = useState<Label['id'] | 'none'>('none');
    const [exclusiveLicenseWith, setExclusiveLicenseWith] = useState<Label['id'] | 'none'>('none');
    const [customLabelTier, setCustomLabelTier] = useState<'Indie' | 'Mid' | 'High'>('Indie');
    const [membersToSign, setMembersToSign] = useState<Set<string>>(new Set());
    const [error, setError] = useState('');
    
    if (!activeArtistData || !activeArtist) return null;
    const { money, songs, contract } = activeArtistData;
    const { group, careerMode } = gameState;

    const careerStreams = songs.reduce((sum, song) => sum + song.streams, 0);
    const eraConfig = getEraConfiguration(gameState.date.year);

    const availableDeals = useMemo(() => {
        const currentYear = gameState.date.year;
        return LABELS.filter(label => 
            careerStreams >= label.streamRequirement && 
            label.contractType !== 'petty' &&
            (!label.activeFromYear || currentYear >= label.activeFromYear) &&
            (!label.activeUntilYear || currentYear <= label.activeUntilYear)
        );
    }, [careerStreams]);
    
    const groupMembers = careerMode === 'group' ? group?.members.filter(m => m.id !== activeArtist.id) : [];

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogo(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleToggleMember = (memberId: string) => {
        setMembersToSign(prev => {
            const newSet = new Set(prev);
            if (newSet.has(memberId)) {
                newSet.delete(memberId);
            } else {
                newSet.add(memberId);
            }
            return newSet;
        });
    };
    
    const cost = useMemo(() => {
        if (dealWith !== 'none') {
            const selectedDeal = LABELS.find(l => l.id === dealWith);
            return selectedDeal ? selectedDeal.streamRequirement * 0.0001 : 0;
        }
        return CUSTOM_LABEL_TIERS[customLabelTier].cost;
    }, [dealWith, customLabelTier]);
    
    const handleCreateLabel = () => {
        setError('');
        if (!name.trim() || !logo) {
            setError('Label name and logo are required.');
            return;
        }

        const isMajorDeal = dealWith !== 'none';
        const totalCost = cost;

        if (money < totalCost) {
            setError(`You can't afford this. Required: $${formatNumber(totalCost)}`);
            return;
        }

        const newLabel: CustomLabel = {
            id: crypto.randomUUID(),
            name: name.trim(),
            logo,
            artistOwnerId: activeArtist.id,
            dealWithMajorId: isMajorDeal ? dealWith : undefined,
            exclusiveLicenseId: exclusiveLicenseWith !== 'none' ? exclusiveLicenseWith : undefined,
            tier: isMajorDeal ? 'High' : customLabelTier,
            promotionMultiplier: isMajorDeal
                ? Math.max(LABELS.find(l => l.id === dealWith)!.promotionMultiplier, exclusiveLicenseWith !== 'none' ? LABELS.find(l => l.id === exclusiveLicenseWith)!.promotionMultiplier : 0)
                : Math.max(CUSTOM_LABEL_TIERS[customLabelTier].promotionMultiplier, exclusiveLicenseWith !== 'none' ? LABELS.find(l => l.id === exclusiveLicenseWith)!.promotionMultiplier : 0),
        };

        dispatch({ type: 'CREATE_CUSTOM_LABEL', payload: { label: newLabel, cost: totalCost, membersToSign: Array.from(membersToSign) } });
    };

    return (
        <div className="h-full w-full bg-zinc-900 overflow-y-auto">
            <header className="p-4 flex items-center gap-4 sticky top-0 bg-zinc-900/80 backdrop-blur-sm z-10 border-b border-zinc-700/50">
                <button onClick={() => dispatch({type: 'CHANGE_VIEW', payload: 'game'})} className="p-2 rounded-full hover:bg-white/10">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold">Create Record Label</h1>
            </header>
            <div className="p-4 space-y-6">
                <div className="flex justify-center">
                    <label htmlFor="logo-upload" className="cursor-pointer">
                        <div className="w-32 h-32 rounded-full bg-zinc-800 border-2 border-dashed border-zinc-600 flex items-center justify-center hover:border-red-500 transition-colors">
                            {logo ? (
                                <img src={logo} alt="Label Logo" className="w-full h-full rounded-full object-cover" />
                            ) : (
                                <span className="text-zinc-400 text-sm text-center">Upload Logo</span>
                            )}
                        </div>
                    </label>
                    <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                </div>
                 <div>
                    <label htmlFor="label-name" className="block text-sm font-medium text-zinc-300">Label Name</label>
                    <input type="text" id="label-name" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full bg-zinc-700 border-zinc-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm h-10 px-3"/>
                </div>
                <div className="bg-blue-900/40 border border-blue-500/50 p-3 rounded-lg flex items-start gap-3">
                    <p className="text-sm text-blue-200">
                        <span className="font-bold text-white">Owner's Advantage:</span> Since you own the custom label, you keep <span className="font-bold text-green-400">100%</span> of all streaming and tour revenue, even if you secure a major distribution deal.
                    </p>
                </div>
                <div>
                    <h3 className="block text-sm font-medium text-zinc-300 mb-2">Structure</h3>
                     <div className="grid grid-cols-1 gap-2">
                        <button onClick={() => setDealWith('none')} className={`p-3 rounded-lg text-left transition-all border-2 ${dealWith === 'none' ? 'border-red-500 bg-red-500/10' : 'border-zinc-700 bg-zinc-800 hover:border-zinc-600'}`}>
                            <p className="font-bold">Independent Label</p>
                            <p className="text-xs text-zinc-400">Build your own empire from the ground up.</p>
                        </button>
                        {availableDeals.map(deal => (
                             <button key={deal.id} onClick={() => setDealWith(deal.id)} className={`p-3 rounded-lg text-left transition-all border-2 ${dealWith === deal.id ? 'border-red-500 bg-red-500/10' : 'border-zinc-700 bg-zinc-800 hover:border-zinc-600'}`}>
                                <div className="flex items-center gap-3">
                                    <img src={deal.logo} alt={deal.name} className="w-10 h-10 rounded-full" />
                                    <div>
                                        <p className="font-bold">Distribution Deal with {deal.name}</p>
                                        <p className="text-sm text-green-400 font-semibold">-${formatNumber(deal.streamRequirement * 0.0001)}</p>
                                        <p className="text-xs text-zinc-400">{deal.tier} Tier Promotion</p>
                                    </div>
                                </div>
                            </button>
                        ))}
                        {availableDeals.length === 0 && <p className="text-sm text-zinc-500 p-2">You don't meet the requirements for any major label deals yet. Keep growing your {eraConfig.streamingActive ? 'streams' : 'sales'}!</p>}
                    </div>
                </div>

                {dealWith === 'none' && (
                    <div>
                         <h3 className="block text-sm font-medium text-zinc-300 mb-2">Label Tier</h3>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            {(Object.keys(CUSTOM_LABEL_TIERS) as Array<keyof typeof CUSTOM_LABEL_TIERS>).map(tier => {
                                const tierData = CUSTOM_LABEL_TIERS[tier];
                                const canAfford = careerStreams >= tierData.requiredStreams;
                                return (
                                    <button key={tier} onClick={() => setCustomLabelTier(tier)} disabled={!canAfford} className={`p-3 rounded-lg text-left transition-all border-2 ${customLabelTier === tier ? 'border-red-500 bg-red-500/10' : 'border-zinc-700 bg-zinc-800 hover:border-zinc-600'} ${!canAfford ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                        <p className="font-bold">{tier} Label</p>
                                        <p className="text-sm text-green-400 font-semibold">-${formatNumber(tierData.cost)}</p>
                                        <p className="text-xs text-zinc-400">Promo: {tierData.promotionMultiplier}x</p>
                                        {!canAfford && <p className="text-xs text-red-400 mt-1">Req: {eraConfig.streamingActive ? formatNumber(tierData.requiredStreams) + ' streams' : formatNumber(Math.floor(tierData.requiredStreams / 500)) + ' sales'}</p>}
                                    </button>
                                )
                            })}
                         </div>
                    </div>
                )}

                <div>
                    <h3 className="block text-sm font-medium text-zinc-300 mb-2">Exclusive License To (Optional)</h3>
                     <p className="text-sm text-zinc-400 mb-2">Grant an exclusive license to a major label. This unlocks their promo multiplier and lists them in your credits.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-2">
                        <button onClick={() => setExclusiveLicenseWith('none')} className={`p-3 rounded-lg text-left transition-all border-2 ${exclusiveLicenseWith === 'none' ? 'border-red-500 bg-red-500/10' : 'border-zinc-700 bg-zinc-800 hover:border-zinc-600'}`}>
                            <p className="font-bold">None (Fully Independent)</p>
                        </button>
                        {LABELS.map(deal => (
                             <button key={deal.id} onClick={() => setExclusiveLicenseWith(deal.id)} className={`p-3 rounded-lg text-left transition-all border-2 ${exclusiveLicenseWith === deal.id ? 'border-red-500 bg-red-500/10' : 'border-zinc-700 bg-zinc-800 hover:border-zinc-600'}`}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white rounded flex items-center justify-center p-1 shrink-0">
                                        <img src={deal.logo} alt={deal.name} className="w-full h-full object-contain" />
                                    </div>
                                    <div>
                                        <p className="font-bold">{deal.name}</p>
                                        <p className="text-xs text-zinc-400">Promo: {deal.promotionMultiplier}x</p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
                
                {groupMembers.length > 0 && (
                    <div>
                         <h3 className="block text-sm font-medium text-zinc-300 mb-2">Sign Members (Optional)</h3>
                         <div className="space-y-2">
                            {groupMembers.map(member => {
                                const isSigned = member.id in gameState.artistsData && gameState.artistsData[member.id].contract !== null;
                                return (
                                <button key={member.id} onClick={() => handleToggleMember(member.id)} disabled={isSigned} className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors ${membersToSign.has(member.id) ? 'bg-red-500/20' : 'bg-zinc-800'} ${isSigned ? 'opacity-50 cursor-not-allowed' : 'hover:bg-zinc-700'}`}>
                                    <input type="checkbox" readOnly checked={membersToSign.has(member.id)} className="form-checkbox h-5 w-5 rounded bg-zinc-700 border-zinc-600 text-red-600 focus:ring-red-500" />
                                    <img src={member.image} alt={member.name} className="w-10 h-10 rounded-full" />
                                    <div>
                                        <p className="font-semibold">{member.name}</p>
                                        {isSigned && <p className="text-xs text-zinc-400">Already signed to another label.</p>}
                                    </div>
                                </button>
                                )
                            })}
                         </div>
                    </div>
                )}


                 {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                 <button onClick={handleCreateLabel} className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-lg shadow-red-600/20 disabled:bg-zinc-600 disabled:shadow-none" disabled={money < cost}>
                    Found Label & Sign Artist (-${formatNumber(cost)})
                </button>
            </div>
        </div>
    );
};

export default CreateLabelView;