
import React, { useState, useEffect } from 'react';
import { useGame, formatNumber } from '../context/GameContext';
import { useFirebase } from '../context/FirebaseContext';
import { LABELS } from '../constants';
import { createDefaultContract } from '../utils/contractUtils';
import { claimOnlineLabel, getOnlineLabels, createContractOffer } from '../firebase';
import type { Contract, Label, CustomLabel, LabelSubmission } from '../types';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import ConfirmationModal from './ConfirmationModal';
import { getEraConfiguration } from '../utils/eraUtils';
import GlobeAltIcon from './icons/GlobeAltIcon';

import { ContractNegotiationModal } from './ContractNegotiationModal';

const getLabelAdvanceRange = (label: Label) => {
    if (label.isDistributionOnly) return '$0 - $100k';
    
    let base = 300000;
    if (label.contractType === 'petty') base = 1000000;
    else if (label.id === 'umg' || label.id === 'sony') base = 2500000;
    else if (label.tier === 'Mid-high' || label.tier === 'Mid-Low' || label.tier === 'Top') base = 750000;
    
    const low = Math.floor(base * 0.5);
    const high = Math.floor(base * 1.5);
    return `$${formatNumber(low)} - $${formatNumber(high)}`;
};

const getLabelSplit = (label: Label) => {
    if (label.contractType === 'petty') return '10% / 90%';
    if (label.id === 'umg') return '20% / 80%';
    if (label.tier === 'Mid-high' || label.tier === 'Mid-Low' || label.tier === 'Top') return '40% / 60%';
    return '50% / 50%';
};

const LabelCard: React.FC<{ 
    label: Label, 
    onSign: (label: Label) => void, 
    onClaim: (label: Label) => void,
    onApplyOnline: (label: Label, ownerData: any) => void,
    canSign: boolean, 
    isStreamingActive: boolean,
    claimedOwner?: any,
    currentUserId?: string
}> = ({ label, onSign, onClaim, onApplyOnline, canSign, isStreamingActive, claimedOwner, currentUserId }) => {
    const isOwnerByMe = claimedOwner && claimedOwner.ownerUserId === currentUserId;

    return (
        <div className={`bg-zinc-800 p-4 rounded-xl flex flex-col items-center text-center transition-all border border-zinc-700/60 shadow-lg hover:border-zinc-500 relative ${!canSign && !claimedOwner ? 'opacity-60' : ''}`}>
            {claimedOwner && (
                <div className="absolute top-3 right-3 bg-red-950/90 text-red-400 border border-red-700/60 text-[10px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                    <GlobeAltIcon className="w-3 h-3 text-red-500 animate-pulse" />
                    {isOwnerByMe ? 'Your Label' : `Owner: ${claimedOwner.ownerArtistName}`}
                </div>
            )}

            <img src={label.logo} alt={label.name} className="w-20 h-20 rounded-full object-cover mb-3 border-2 border-zinc-700" />
            <h3 className="text-lg font-bold">{label.name}</h3>
            <p className="text-sm font-semibold" style={{ color: label.tier === 'Top' ? '#f59e0b' : '#a1a1aa' }}>{label.tier} Tier</p>
            
            <div className="mt-3 text-xs text-zinc-400 space-y-1 w-full bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800">
                <p>Promotion: <span className="font-bold text-white">{label.promotionMultiplier}x</span></p>
                <p>Est. Adv: <span className="font-bold text-green-400 font-mono">{getLabelAdvanceRange(label)}</span></p>
                <p>Cut (You/Label): <span className="font-bold text-yellow-400">{getLabelSplit(label)}</span></p>
            </div>

            <div className="mt-4 w-full space-y-2">
                {claimedOwner ? (
                    isOwnerByMe ? (
                        <div className="w-full bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 font-bold py-2 rounded-lg text-xs text-center">
                            ✓ You Own This Label
                        </div>
                    ) : (
                        <button
                            onClick={() => onApplyOnline(label, claimedOwner)}
                            className="w-full bg-red-600 hover:bg-red-500 text-white font-extrabold py-2 rounded-lg transition-colors text-xs shadow-md flex items-center justify-center gap-1.5"
                        >
                            📩 Apply to {claimedOwner.ownerArtistName}
                        </button>
                    )
                ) : (
                    <div className="flex gap-2">
                        <button 
                            onClick={() => onSign(label)}
                            disabled={!canSign}
                            className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white font-bold py-2 rounded-lg transition-colors text-xs disabled:opacity-50"
                        >
                            {canSign ? 'View Contract' : 'Locked'}
                        </button>
                        <button
                            onClick={() => onClaim(label)}
                            className="flex-1 bg-amber-600 hover:bg-amber-500 text-white font-extrabold py-2 rounded-lg transition-colors text-xs shadow-md"
                        >
                            👑 Claim ($250k)
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const SubmissionStatusBadge: React.FC<{ status: LabelSubmission['status'] }> = ({ status }) => {
    switch (status) {
        case 'pending':
            return <span className="text-xs font-bold text-yellow-400 bg-yellow-900/50 px-2 py-1 rounded-full">Pending</span>;
        case 'awaiting_player_input':
            return <span className="text-xs font-bold text-blue-400 bg-blue-900/50 px-2 py-1 rounded-full">Action Required</span>;
        case 'scheduled':
            return <span className="text-xs font-bold text-purple-400 bg-purple-900/50 px-2 py-1 rounded-full">Scheduled</span>;
        case 'rejected':
            return <span className="text-xs font-bold text-red-400 bg-red-900/50 px-2 py-1 rounded-full">Rejected</span>;
    }
}

const SubmissionItem: React.FC<{ submission: LabelSubmission }> = ({ submission }) => {
    const { dispatch } = useGame();

    const handlePlanRelease = () => {
        dispatch({ type: 'GO_TO_LABEL_PLAN', payload: { submissionId: submission.id } });
    };

    return (
        <div className="bg-zinc-800 p-3 rounded-lg flex items-center gap-4">
            <img src={submission.release.coverArt} alt={submission.release.title} className="w-16 h-16 rounded-md object-cover"/>
            <div className="flex-grow">
                <p className="font-bold">{submission.release.title}</p>
                <p className="text-sm text-zinc-400">{submission.release.type.replace(" (Deluxe)", "")}</p>
                {submission.status === 'scheduled' && submission.projectReleaseDate && (
                    <p className="text-xs text-green-300">Releasing W{submission.projectReleaseDate.week}, {submission.projectReleaseDate.year}</p>
                )}
            </div>
            <div className="flex flex-col items-end gap-2">
                <SubmissionStatusBadge status={submission.status} />
                {submission.status === 'awaiting_player_input' && (
                    <button onClick={handlePlanRelease} className="text-sm bg-blue-500 text-white font-semibold px-3 py-1 rounded-md hover:bg-blue-600">
                        Plan Release
                    </button>
                )}
            </div>
        </div>
    );
};


const SignedView: React.FC<{ contract: Contract }> = ({ contract }) => {
    const { gameState, dispatch, activeArtistData } = useGame();
    const { date } = gameState;
    const { labelSubmissions, contractHistory } = activeArtistData!;

    const allCustomLabels = Object.values(gameState.artistsData).flatMap(data => data.customLabels);

    const label = contract.isCustom 
        ? allCustomLabels.find(l => l.id === contract.labelId)
        : LABELS.find(l => l.id === contract.labelId);

    if (!label) return <p>Error: Label not found.</p>;

    if (contract.isCustom) {
        const customLabel = label as CustomLabel;
        const deal = LABELS.find(l => l.id === customLabel.dealWithMajorId);
        return (
            <div className="space-y-6">
                <div className="bg-zinc-800 rounded-lg p-6 flex flex-col items-center">
                    <img src={customLabel.logo} alt={customLabel.name} className="w-24 h-24 rounded-full object-cover mb-4" />
                    <h3 className="text-2xl font-bold">{customLabel.name}</h3>
                    <p className="text-zinc-400 mt-1">You are signed to your own label.</p>
                    {deal && (
                        <p className="text-sm text-blue-300 mt-2">Distribution deal with {deal.name}</p>
                    )}
                    <div className="w-full mt-6 text-center text-sm">
                        <p className="text-zinc-300">As the owner, you have full creative control. Submissions are auto-approved.</p>
                        {deal ? (
                             <p className="text-zinc-400 mt-2">Your releases must meet the quality standards of {deal.name}.</p>
                        ) : (
                            <p className="text-zinc-400 mt-2">You can seek a major label distribution deal to improve your promotional power.</p>
                        )}
                        <button onClick={() => dispatch({type: 'CHANGE_VIEW', payload: 'manageLabel'})} className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors text-base">
                            Manage Artists & Roster
                        </button>
                    </div>
                </div>
                 <button onClick={() => dispatch({type: 'END_CONTRACT'})} className="w-full text-center text-sm text-zinc-500 hover:text-red-500">
                    Go Independent
                </button>
            </div>
        )
    }

    const majorLabel = label as Label;
    const isPetty = majorLabel.contractType === 'petty';

    const weeksPassed = (date.year * 52 + date.week) - (contract.startDate.year * 52 + contract.startDate.week);
    const weeksRemaining = contract.durationWeeks ? contract.durationWeeks - weeksPassed : Infinity;
    const yearsRemaining = contract.durationWeeks ? (weeksRemaining / 52).toFixed(1) : '∞';

    const progressPercentage = contract.albumQuota ? (contract.albumsReleased / contract.albumQuota) * 100 : 0;

    return (
        <div className="space-y-6">
            <div className="bg-zinc-800 rounded-lg p-6 flex flex-col items-center">
                <img src={majorLabel.logo} alt={majorLabel.name} className="w-24 h-24 rounded-full object-cover mb-4" />
                <h3 className="text-2xl font-bold">{majorLabel.name}</h3>
                <p className="text-zinc-400">{majorLabel.tier} Tier Label</p>
                <div className="mt-3 text-sm text-center">
                    <p className="text-zinc-300">Revenue Split (You/Label): <span className="font-bold text-yellow-400">{getLabelSplit(majorLabel)}</span></p>
                </div>
                {isPetty && (
                    <button onClick={() => dispatch({type: 'END_CONTRACT'})} className="mt-4 bg-red-900/50 text-red-400 font-bold px-4 py-2 rounded-md text-sm hover:bg-red-900">
                        Leave Label
                    </button>
                )}
                <div className="w-full mt-6 space-y-4">
                    {!isPetty && contract.durationWeeks && (
                        <>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-semibold text-zinc-300">Time Remaining</span>
                                    <span className="text-zinc-400">{weeksRemaining} weeks (~{yearsRemaining} years)</span>
                                </div>
                                <div className="w-full bg-zinc-700 rounded-full h-2.5">
                                    <div className="bg-red-600 h-2.5 rounded-full" style={{width: `${Math.max(0, Math.min(100, (weeksRemaining / contract.durationWeeks) * 100))}%`}}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-semibold text-zinc-300">Album Quota</span>
                                    <span className="text-zinc-400">{contract.albumsReleased} / {contract.albumQuota} Albums</span>
                                </div>
                                <div className="w-full bg-zinc-700 rounded-full h-2.5">
                                    <div className="bg-blue-500 h-2.5 rounded-full" style={{width: `${progressPercentage}%`}}></div>
                                </div>
                            </div>
                        </>
                    )}
                    
                    {!isPetty && (
                        <div className="bg-zinc-700/30 p-4 rounded-xl space-y-3 text-sm text-zinc-300 mt-4">
                            <h4 className="font-bold text-white mb-2 uppercase text-xs tracking-widest text-zinc-400">Contract Terms</h4>
                            <div className="flex justify-between border-b border-zinc-700/50 pb-2">
                                <span>Advance:</span>
                                <span className="font-mono text-green-400">${formatNumber(contract.advance || 0)}</span>
                            </div>
                            <div className="flex justify-between border-b border-zinc-700/50 pb-2">
                                <span>Royalty Split:</span>
                                <span className="font-mono">{contract.royaltyPercent || 15}% Artist</span>
                            </div>
                            <div className="flex justify-between border-b border-zinc-700/50 pb-2">
                                <span>Masters Ownership:</span>
                                <span className="font-mono">
                                    {contract.mastersOwnership === 'Label' ? '0% Artist' 
                                    : contract.mastersOwnership === 'Artist' ? '100% Artist' 
                                    : `${contract.mastersSplitPercent || 0}% Artist`}
                                </span>
                            </div>
                            <div className="flex justify-between border-b border-zinc-700/50 pb-2">
                                <span>Marketing Budget:</span>
                                <span className="font-mono text-blue-400">${formatNumber(contract.marketingBudget || 0)} <span className="text-xs text-zinc-500">(Available for Promo)</span></span>
                            </div>
                            <div className="flex justify-between border-b border-zinc-700/50 pb-2">
                                <span>Tour Support:</span>
                                <span className="font-mono text-blue-400">${formatNumber(contract.tourSupport || 0)}</span>
                            </div>
                            <div className="flex justify-between pb-2">
                                <span>Recoupment:</span>
                                <span className="font-mono">{contract.recoupmentTerms || '100%'}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {labelSubmissions.length > 0 && (
                 <div className="space-y-4">
                    <h2 className="text-xl font-bold">Label Submissions</h2>
                    <div className="space-y-3">
                        {labelSubmissions.map(sub => <SubmissionItem key={sub.id} submission={sub} />)}
                    </div>
                </div>
            )}
            {contractHistory.length > 0 && (
                <div className="space-y-4 mt-6">
                    <h2 className="text-xl font-bold">Past Contracts</h2>
                    <div className="space-y-3">
                        {contractHistory.map(pastContract => {
                            const pastLabel = pastContract.isCustom 
                                ? allCustomLabels.find(l => l.id === pastContract.labelId) 
                                : LABELS.find(l => l.id === pastContract.labelId);
                            if (!pastLabel) return null;

                            const hasLabelChannel = !pastContract.isCustom && (pastLabel as Label).youtubeChannel;

                            const durationWeeks = pastContract.durationWeeks || 0;
                            const endWeekRaw = pastContract.startDate.week + durationWeeks;
                            const endDate = {
                                week: (endWeekRaw - 1) % 52 + 1,
                                year: pastContract.startDate.year + Math.floor((endWeekRaw - 1) / 52)
                            };

                            return (
                                <div key={pastLabel.id} className="bg-zinc-800 p-3 rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <img src={pastLabel.logo} alt={pastLabel.name} className="w-12 h-12 rounded-full object-cover"/>
                                        <div className="flex-grow">
                                            <p className="font-bold">{pastLabel.name}</p>
                                            <p className="text-sm text-zinc-400">Ended: W{endDate.week}, {endDate.year}</p>
                                        </div>
                                        {hasLabelChannel && (
                                            <button
                                                onClick={() => dispatch({ type: 'VIEW_PAST_LABEL_CHANNEL', payload: pastLabel.id })}
                                                className="bg-blue-600/20 text-blue-300 font-bold px-3 py-1.5 rounded-md text-sm hover:bg-blue-600/40"
                                            >
                                                View Channel
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

const UnsignedView: React.FC = () => {
    const { gameState, dispatch, activeArtist, activeArtistData } = useGame();
    const { user } = useFirebase();
    
    // Online claimed labels from Firestore
    const [claimedLabels, setClaimedLabels] = useState<Record<string, any>>({});
    const [claimModalLabel, setClaimModalLabel] = useState<Label | null>(null);
    const [applyModalData, setApplyModalData] = useState<{ label: Label; owner: any } | null>(null);
    const [applyAdvanceInput, setApplyAdvanceInput] = useState(500000);
    const [applyRoyaltyInput, setApplyRoyaltyInput] = useState(25);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedbackMsg, setFeedbackMsg] = useState('');

    // offerModalLabel is used to start the name check process
    const [offerModalLabel, setOfferModalLabel] = useState<Label | null>(null);
    const [confirmPettyJoin, setConfirmPettyJoin] = useState<Label | null>(null);
    
    // negotiationLabel is used to show the negotiation UI after name check
    const [negotiationLabel, setNegotiationLabel] = useState<Label | null>(null);
    
    const [nameChangeReq, setNameChangeReq] = useState<{
        label: Label;
        type: 'petty' | 'small';
        options?: string[];
        fee?: number;
    } | null>(null);
    const [nameChangeInput, setNameChangeInput] = useState('');

    useEffect(() => {
        const fetchLabels = async () => {
            const list = await getOnlineLabels();
            const map: Record<string, any> = {};
            list.forEach((item: any) => {
                if (item.id) map[item.id] = item;
            });
            setClaimedLabels(map);
        };
        fetchLabels();
    }, []);

    if (!activeArtistData || !activeArtist) return null;
    const eraConfig = getEraConfiguration(gameState.date.year);
    const careerStreams = activeArtistData.songs.reduce((sum, song) => sum + song.streams, 0);

    const currentYear = gameState.date.year;
    const standardLabels = LABELS.filter(l => 
        l.contractType !== 'petty' && 
        !l.isDistributionOnly &&
        (!l.activeFromYear || currentYear >= l.activeFromYear) &&
        (!l.activeUntilYear || currentYear <= l.activeUntilYear)
    );
    const pettyLabels = LABELS.filter(l => 
        l.contractType === 'petty' && 
        !l.isDistributionOnly &&
        (!l.activeFromYear || currentYear >= l.activeFromYear) &&
        (!l.activeUntilYear || currentYear <= l.activeUntilYear)
    );

    const handleConfirmClaim = async () => {
        if (!claimModalLabel || !user) return;
        const claimCost = 250000;
        if (activeArtistData.money < claimCost) {
            setFeedbackMsg('Insufficient funds! You need $250,000 to claim a record label.');
            return;
        }

        setIsSubmitting(true);
        const success = await claimOnlineLabel({
            labelId: claimModalLabel.id,
            labelName: claimModalLabel.name,
            ownerUserId: user.uid,
            ownerArtistName: activeArtist.name,
            logoUrl: claimModalLabel.logo,
            cost: claimCost
        });

        if (success) {
            dispatch({ type: 'DEDUCT_MONEY', payload: claimCost });
            dispatch({
                type: 'CREATE_CUSTOM_LABEL',
                payload: {
                    name: claimModalLabel.name,
                    dealWithMajorId: claimModalLabel.id,
                    exclusiveLicenseId: 'none',
                    tier: 'Standard'
                }
            });
            setClaimedLabels(prev => ({
                ...prev,
                [claimModalLabel.id]: {
                    id: claimModalLabel.id,
                    name: claimModalLabel.name,
                    ownerUserId: user.uid,
                    ownerArtistName: activeArtist.name
                }
            }));
            setFeedbackMsg(`Congratulations! You are now the official owner of ${claimModalLabel.name}.`);
        } else {
            setFeedbackMsg('Failed to claim label. Please check your connection.');
        }
        setIsSubmitting(false);
        setClaimModalLabel(null);
    };

    const handleSendOnlineApplication = async () => {
        if (!applyModalData || !user) return;
        setIsSubmitting(true);

        const offerPayload = {
            fromUserId: user.uid,
            fromArtistName: activeArtist.name,
            fromAvatar: activeArtist.image,
            toUserId: applyModalData.owner.ownerUserId,
            labelId: applyModalData.label.id,
            labelName: applyModalData.label.name,
            type: 'label_application' as const,
            advance: applyAdvanceInput,
            royaltyPercent: applyRoyaltyInput,
            status: 'pending' as const
        };

        await createContractOffer(offerPayload);
        setFeedbackMsg(`Contract offer sent to ${applyModalData.owner.ownerArtistName}! They will review it via Email.`);
        setIsSubmitting(false);
        setApplyModalData(null);
    };

    const handleSignWithCheck = (label: Label, isPetty: boolean = false) => {
        // 50% chance for small/petty labels to require a name change
        if ((label.contractType === 'petty' || label.tier === 'Low') && Math.random() < 0.5) {
            if (label.contractType === 'petty') {
                const randomNames = [
                    `${activeArtist.name} The Creator`,
                    `Lil ${activeArtist.name.split(' ')[0]}`,
                    `${activeArtist.name} Da Don`
                ];
                setNameChangeReq({ label, type: 'petty', options: randomNames });
                setNameChangeInput(randomNames[0]);
            } else {
                setNameChangeReq({ label, type: 'small', fee: Math.floor(Math.random() * (30000 - 20000 + 1)) + 20000 });
                setNameChangeInput(activeArtist.name); // Default to current name if they decide to change it anyway
            }
            if (isPetty) setConfirmPettyJoin(null);
            else setOfferModalLabel(null);
            return;
        }

        if (isPetty) handleSignPetty(label);
        else {
            setOfferModalLabel(null);
            setNegotiationLabel(label); // Open negotiation
        }
    };

    const handleSignNegotiatedContract = (contract: Contract) => {
        dispatch({ type: 'SIGN_CONTRACT', payload: { contract } });
        setNegotiationLabel(null);
    };

     const handleSignPetty = (label: Label) => {
        const newContract: Contract = createDefaultContract({
            labelId: label.id,
            artistId: activeArtist!.id,
            startDate: gameState.date,
            albumsReleased: 0,
            advance: 1000000,
            royaltyPercent: 10
        });
        dispatch({ type: 'SIGN_CONTRACT', payload: { contract: newContract } });
        setConfirmPettyJoin(null);
    };

    const confirmNameChangeAndSign = (payFee: boolean = false) => {
        if (!nameChangeReq) return;
        
        const isPetty = nameChangeReq.label.contractType === 'petty';
        
        if (payFee && nameChangeReq.fee) {
            if (activeArtistData.money < nameChangeReq.fee) return;
            // Pay fee and keep name
            dispatch({ type: 'CHANGE_STAGE_NAME', payload: { newName: activeArtist.name, cost: nameChangeReq.fee, contractId: 'TEMP' } });
        } else {
            // Change name
            if (!nameChangeInput.trim()) return;
            dispatch({ type: 'CHANGE_STAGE_NAME', payload: { newName: nameChangeInput.trim(), contractId: 'TEMP' } });
        }

        if (isPetty) handleSignPetty(nameChangeReq.label);
        else setNegotiationLabel(nameChangeReq.label);
        
        setNameChangeReq(null);
    };
    
    return (
        <>
            {feedbackMsg && (
                <div className="mb-4 bg-red-950/80 border border-red-500/50 p-3 rounded-xl flex items-center justify-between text-xs text-red-200">
                    <span>{feedbackMsg}</span>
                    <button onClick={() => setFeedbackMsg('')} className="font-bold text-white ml-2">✕</button>
                </div>
            )}

            {/* Claim Label Modal */}
            {claimModalLabel && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 space-y-4">
                        <div className="text-center">
                            <img src={claimModalLabel.logo} alt={claimModalLabel.name} className="w-20 h-20 rounded-full mx-auto mb-2 border-2 border-amber-500" />
                            <h2 className="text-2xl font-black text-white">Claim {claimModalLabel.name}</h2>
                            <p className="text-xs text-zinc-400 mt-1">
                                Become the official Label Owner of {claimModalLabel.name}. You will be able to sign online artists, accept or decline contract applications via email, and collect label royalties on their releases!
                            </p>
                        </div>
                        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-xs space-y-2">
                            <div className="flex justify-between">
                                <span className="text-zinc-400">Claim Cost:</span>
                                <span className="font-bold text-amber-400">$250,000</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-400">Your Funds:</span>
                                <span className="font-bold text-green-400">${formatNumber(activeArtistData.money)}</span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setClaimModalLabel(null)} 
                                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2.5 rounded-xl text-xs"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleConfirmClaim} 
                                disabled={isSubmitting || activeArtistData.money < 250000} 
                                className="flex-1 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-extrabold py-2.5 rounded-xl text-xs"
                            >
                                {isSubmitting ? 'Claiming...' : 'Confirm Claim ($250k)'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Apply to Online Label Modal */}
            {applyModalData && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 space-y-4">
                        <div className="text-center">
                            <img src={applyModalData.label.logo} alt={applyModalData.label.name} className="w-16 h-16 rounded-full mx-auto mb-2" />
                            <h2 className="text-xl font-bold text-white">Apply to {applyModalData.label.name}</h2>
                            <p className="text-xs text-zinc-400">Owner: <span className="text-white font-bold">{applyModalData.owner.ownerArtistName}</span></p>
                        </div>

                        <div className="space-y-3 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                            <div>
                                <label className="text-xs text-zinc-400 block mb-1">Requested Advance ($):</label>
                                <input 
                                    type="number"
                                    value={applyAdvanceInput}
                                    onChange={(e) => setApplyAdvanceInput(Number(e.target.value))}
                                    className="w-full bg-zinc-900 text-white p-2.5 rounded-lg text-sm border border-zinc-800 focus:outline-none focus:border-red-500"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-zinc-400 block mb-1">Requested Artist Royalty Split (%):</label>
                                <input 
                                    type="number"
                                    min={5}
                                    max={90}
                                    value={applyRoyaltyInput}
                                    onChange={(e) => setApplyRoyaltyInput(Number(e.target.value))}
                                    className="w-full bg-zinc-900 text-white p-2.5 rounded-lg text-sm border border-zinc-800 focus:outline-none focus:border-red-500"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button 
                                onClick={() => setApplyModalData(null)} 
                                className="flex-1 bg-zinc-800 text-white font-bold py-2.5 rounded-xl text-xs"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSendOnlineApplication} 
                                disabled={isSubmitting} 
                                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 rounded-xl text-xs"
                            >
                                {isSubmitting ? 'Sending...' : 'Send Offer via Email'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {negotiationLabel && (
                <ContractNegotiationModal
                    label={negotiationLabel}
                    careerStreams={careerStreams}
                    onClose={() => setNegotiationLabel(null)}
                    onSign={handleSignNegotiatedContract}
                />
            )}
            {offerModalLabel && (
                <ConfirmationModal
                    isOpen={!!offerModalLabel}
                    onClose={() => setOfferModalLabel(null)}
                    onConfirm={() => handleSignWithCheck(offerModalLabel)}
                    title="Contract Offer"
                    message={`Begin negotiations with ${offerModalLabel.name}?`}
                    confirmText="Negotiate"
                />
            )}
            {confirmPettyJoin && (
                 <ConfirmationModal
                    isOpen={!!confirmPettyJoin}
                    onClose={() => setConfirmPettyJoin(null)}
                    onConfirm={() => handleSignWithCheck(confirmPettyJoin, true)}
                    title={`Join ${confirmPettyJoin.name}?`}
                    message={`By joining ${confirmPettyJoin.name}, you agree to their terms: a minimum release quality of 70.`}
                    confirmText="Agree & Join"
                />
            )}
            {nameChangeReq && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setNameChangeReq(null)}>
                    <div className="bg-white rounded-lg w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-4 text-black">Stage Name Change Requested</h2>
                        
                        {nameChangeReq.type === 'petty' ? (
                            <>
                                <p className="text-zinc-600 mb-4">The label expects you to adopt a new stage name. Please select one of the following options:</p>
                                <div className="space-y-2 mb-4">
                                    {nameChangeReq.options?.map(opt => (
                                        <button 
                                            key={opt}
                                            onClick={() => setNameChangeInput(opt)}
                                            className={`w-full p-3 rounded-lg text-left ${nameChangeInput === opt ? 'bg-red-100 text-red-900 border-2 border-red-500' : 'bg-zinc-100 text-black border-2 border-transparent'}`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={() => setNameChangeReq(null)} className="w-full bg-zinc-200 text-black py-2 rounded-full font-semibold">Cancel</button>
                                    <button onClick={() => confirmNameChangeAndSign()} className="w-full bg-black text-white py-2 rounded-full font-semibold">Accept & Sign</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <p className="text-zinc-600 mb-4">The label would prefer you change your stage name. You can either change it now, or pay a <strong>Name Change Settlement Fee</strong> to keep your current name.</p>
                                
                                <label className="block mb-4">
                                    <span className="text-black font-semibold">New Stage Name</span>
                                    <input 
                                        type="text" 
                                        className="w-full p-2 border border-zinc-300 rounded-lg text-black mt-1" 
                                        value={nameChangeInput}
                                        onChange={(e) => setNameChangeInput(e.target.value)}
                                        maxLength={30}
                                    />
                                </label>

                                <div className="flex flex-col gap-3">
                                    <button 
                                        onClick={() => confirmNameChangeAndSign()} 
                                        disabled={!nameChangeInput.trim()} 
                                        className="w-full bg-black text-white py-2 rounded-full font-semibold disabled:bg-zinc-400"
                                    >
                                        Change Name & Sign
                                    </button>
                                    
                                    <button 
                                        onClick={() => confirmNameChangeAndSign(true)} 
                                        disabled={activeArtistData.money < (nameChangeReq.fee || 0)} 
                                        className="w-full bg-red-600 text-white py-2 rounded-full font-semibold disabled:bg-zinc-400 flex flex-col items-center"
                                    >
                                        <span>Keep Current Name (-${(nameChangeReq.fee || 0).toLocaleString()})</span>
                                    </button>

                                    <button onClick={() => setNameChangeReq(null)} className="w-full bg-zinc-200 text-black py-2 rounded-full font-semibold mt-2">Cancel Contract</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
            <div className="space-y-8">
                <div className="bg-gradient-to-r from-red-950/60 via-zinc-900 to-amber-950/60 p-6 rounded-2xl border border-zinc-800 text-center space-y-3">
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center justify-center gap-2">
                        <GlobeAltIcon className="w-6 h-6 text-red-500" />
                        Online Label Ecosystem
                    </h2>
                    <p className="text-xs text-zinc-400 max-w-lg mx-auto">
                        Claim major label rights to sign online player artists, manage advances, and earn continuous label royalties from global streams!
                    </p>
                    <button 
                        onClick={() => dispatch({ type: 'CHANGE_VIEW', payload: 'createLabel' })}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold py-2.5 px-6 rounded-xl transition-all text-xs shadow-lg"
                    >
                        + Create Custom Online Label
                    </button>
                </div>

                <div>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                        <span>⚡ Boutique & Independent Labels</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pettyLabels.map(label => (
                            <LabelCard 
                                key={label.id} 
                                label={label} 
                                onSign={setConfirmPettyJoin} 
                                onClaim={setClaimModalLabel}
                                onApplyOnline={(lbl, owner) => setApplyModalData({ label: lbl, owner })}
                                canSign={true}
                                isStreamingActive={eraConfig.streamingActive}
                                claimedOwner={claimedLabels[label.id]}
                                currentUserId={user?.uid}
                            />
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                        <span>🏛️ Major Record Labels</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {standardLabels.map(label => {
                            const canSign = careerStreams >= label.streamRequirement;
                            return (
                                <LabelCard 
                                    key={label.id} 
                                    label={label} 
                                    onSign={setOfferModalLabel} 
                                    onClaim={setClaimModalLabel}
                                    onApplyOnline={(lbl, owner) => setApplyModalData({ label: lbl, owner })}
                                    canSign={canSign}
                                    isStreamingActive={eraConfig.streamingActive}
                                    claimedOwner={claimedLabels[label.id]}
                                    currentUserId={user?.uid}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};


const LabelsView: React.FC = () => {
    const { dispatch, activeArtistData } = useGame();
    if (!activeArtistData) return null;

    const { contract } = activeArtistData;

    return (
        <div className="h-full w-full bg-zinc-900 overflow-y-auto">
            <header className="p-4 flex items-center gap-4 sticky top-0 bg-zinc-900/80 backdrop-blur-sm z-10 border-b border-zinc-700/50">
                <button onClick={() => dispatch({type: 'CHANGE_VIEW', payload: 'game'})} className="p-2 rounded-full hover:bg-white/10">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold">{contract ? 'Current Contract' : 'Record Labels'}</h1>
            </header>
            <main className="p-4">
                {contract ? <SignedView contract={contract} /> : <UnsignedView />}
            </main>
        </div>
    );
};

export default LabelsView;
