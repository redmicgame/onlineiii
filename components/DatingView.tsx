import React, { useState } from 'react';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import { useGame } from '../context/GameContext';
import { Relationship, Artist } from '../types';

const DatingView: React.FC = () => {
    const { gameState, dispatch, activeArtistData } = useGame();
    const [showNewRelationshipModal, setShowNewRelationshipModal] = useState(false);
    const [partnerType, setPartnerType] = useState<'npc' | 'custom'>('npc');
    const [selectedNpcId, setSelectedNpcId] = useState<string>('');
    const [customName, setCustomName] = useState('');

    const [relationshipToReveal, setRelationshipToReveal] = useState<string | null>(null);

    if (!activeArtistData) return null;

    const relationships = activeArtistData.relationships || [];
    const activeRelationship = relationships.find(r => r.endYear === null);
    const pastRelationships = relationships.filter(r => r.endYear !== null).sort((a, b) => b.endYear! - a.endYear!);

    const sortedNpcs = [...gameState.npcs].sort((a, b) => a.artist.localeCompare(b.artist));

    const handleStartDating = () => {
        if (partnerType === 'npc') {
            const npc = sortedNpcs.find(n => n.uniqueId === selectedNpcId);
            if (npc) {
                dispatch({ type: 'START_DATING', payload: { partnerName: npc.artist, partnerType: 'npc' } });
            }
        } else {
            if (customName.trim()) {
                dispatch({ type: 'START_DATING', payload: { partnerName: customName.trim(), partnerType: 'custom' } });
            }
        }
        setShowNewRelationshipModal(false);
        setSelectedNpcId('');
        setCustomName('');
    };

    const handleReveal = (outlet: 'popbase' | 'tmz') => {
        if (relationshipToReveal) {
            dispatch({ type: 'REVEAL_RELATIONSHIP', payload: { relationshipId: relationshipToReveal, outlet } });
            setRelationshipToReveal(null);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, relationshipId: string) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const newImage = reader.result as string;
                dispatch({ type: 'UPDATE_RELATIONSHIP_IMAGE', payload: { relationshipId, image: newImage } });
            };
            reader.readAsDataURL(file);
        }
    };

    const formatRelationshipDate = (year: number, week?: number) => {
        if (week !== undefined) {
            const month = new Date(year, 0, (week - 1) * 7 + 1).toLocaleString('default', { month: 'long' });
            return `${month} ${year}`;
        }
        return `${year}`;
    };

    const StatusBadge = ({ status, isPublic }: { status: Relationship['status'], isPublic: boolean }) => {
        let color = 'bg-blue-500/20 text-blue-400';
        if (status === 'engaged') color = 'bg-purple-500/20 text-purple-400';
        if (status === 'married') color = 'bg-yellow-500/20 text-yellow-400';

        return (
            <div className="flex gap-2">
                <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${color}`}>
                    {status}
                </span>
                {!isPublic && (
                    <span className="px-2 py-0.5 rounded text-xs font-semibold uppercase bg-zinc-700 text-zinc-300">
                        Secret
                    </span>
                )}
            </div>
        );
    };

    return (
        <div className="h-full w-full bg-zinc-900 flex flex-col text-white">
            <header className="p-4 flex items-center gap-4 flex-shrink-0 border-b border-zinc-800">
                <button onClick={() => dispatch({ type: 'CHANGE_VIEW', payload: 'misc' })} className="p-2 rounded-full hover:bg-zinc-800">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold">Dating History</h1>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-8">
                {/* Active Relationship */}
                <section>
                    <h2 className="text-xl font-bold mb-4">Current Relationship</h2>
                    {activeRelationship ? (
                        <div className="bg-zinc-800 p-4 rounded-xl border border-zinc-700 space-y-4 shadow-xl">
                            <div className="flex justify-between items-start">
                                <div className="flex gap-4 items-center">
                                    <label htmlFor={`image-upload-${activeRelationship.id}`} className="cursor-pointer group relative flex-shrink-0">
                                        <div className="w-16 h-16 rounded-full bg-zinc-700 flex items-center justify-center overflow-hidden">
                                            {activeRelationship.image ? (
                                                <img src={activeRelationship.image} alt={activeRelationship.partnerName} className="w-full h-full object-cover"/>
                                            ) : (
                                                <span className="text-zinc-500 font-bold text-2xl">{activeRelationship.partnerName.charAt(0)}</span>
                                            )}
                                        </div>
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                                            <span className="text-white text-[10px] font-bold">Edit</span>
                                        </div>
                                        <input
                                            type="file"
                                            id={`image-upload-${activeRelationship.id}`}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, activeRelationship.id)}
                                        />
                                    </label>
                                    <div>
                                        <h3 className="text-2xl font-black text-red-500">{activeRelationship.partnerName}</h3>
                                        <p className="text-zinc-400">Since {formatRelationshipDate(activeRelationship.startYear, activeRelationship.startWeek)}</p>
                                    </div>
                                </div>
                                <StatusBadge status={activeRelationship.status} isPublic={activeRelationship.isPublic} />
                            </div>

                            <div className="flex flex-wrap gap-2 pt-4 border-t border-zinc-700">
                                {!activeRelationship.isPublic && (
                                    <button 
                                        onClick={() => setRelationshipToReveal(activeRelationship.id)}
                                        className="bg-white text-black px-4 py-2 rounded-full font-bold text-sm"
                                    >
                                        Reveal Relationship
                                    </button>
                                )}
                                
                                {activeRelationship.isPublic && activeRelationship.status === 'dating' && (
                                    <button 
                                        onClick={() => dispatch({ type: 'ADVANCE_RELATIONSHIP', payload: { relationshipId: activeRelationship.id, newStatus: 'engaged' } })}
                                        className="bg-purple-600 text-white px-4 py-2 rounded-full font-bold text-sm"
                                    >
                                        Get Engaged
                                    </button>
                                )}
                                
                                {activeRelationship.isPublic && activeRelationship.status === 'engaged' && (
                                    <button 
                                        onClick={() => dispatch({ type: 'ADVANCE_RELATIONSHIP', payload: { relationshipId: activeRelationship.id, newStatus: 'married' } })}
                                        className="bg-yellow-500 text-black px-4 py-2 rounded-full font-bold text-sm"
                                    >
                                        Get Married
                                    </button>
                                )}

                                {!activeArtistData.pregnancy && (
                                    <button 
                                        onClick={() => dispatch({ type: 'START_PREGNANCY', payload: { partnerName: activeRelationship.partnerName } })}
                                        className="bg-pink-500 text-white px-4 py-2 rounded-full font-bold text-sm hover:bg-pink-400"
                                    >
                                        Try for Baby
                                    </button>
                                )}

                                {activeArtistData.pregnancy && !activeArtistData.pregnancy.revealed && (
                                    <button 
                                        onClick={() => dispatch({ type: 'REVEAL_PREGNANCY' })}
                                        className="bg-pink-600 text-white px-4 py-2 rounded-full font-bold text-sm hover:bg-pink-500"
                                    >
                                        Reveal Pregnancy
                                    </button>
                                )}

                                <button 
                                    onClick={() => dispatch({ type: 'BREAK_UP', payload: { relationshipId: activeRelationship.id } })}
                                    className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-full font-bold text-sm"
                                >
                                    Break Up
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-zinc-800 border border-zinc-700 border-dashed p-8 rounded-xl text-center">
                            <p className="text-zinc-400 mb-4">You are currently single.</p>
                            <div className="flex justify-center gap-4">
                                <button 
                                    onClick={() => setShowNewRelationshipModal(true)}
                                    className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-full font-bold shadow-lg"
                                >
                                    Start Dating
                                </button>
                                {!activeArtistData.pregnancy && (
                                    <button 
                                        onClick={() => dispatch({ type: 'START_PREGNANCY', payload: { partnerName: 'Single Parent' } })}
                                        className="bg-pink-500 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:bg-pink-400"
                                    >
                                        Have a Baby
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </section>

                {/* Past Relationships */}
                {pastRelationships.length > 0 && (
                    <section>
                        <h2 className="text-xl font-bold mb-4 text-zinc-300">Past Relationships</h2>
                        <div className="space-y-4">
                            {pastRelationships.map(rel => (
                                <div key={rel.id} className="bg-zinc-800/50 p-4 rounded-lg flex items-center justify-between border border-zinc-700/50">
                                    <div className="flex gap-4 items-center">
                                        <label htmlFor={`image-upload-${rel.id}`} className="cursor-pointer group relative flex-shrink-0">
                                            <div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center overflow-hidden">
                                                {rel.image ? (
                                                    <img src={rel.image} alt={rel.partnerName} className="w-full h-full object-cover"/>
                                                ) : (
                                                    <span className="text-zinc-500 font-bold text-xl">{rel.partnerName.charAt(0)}</span>
                                                )}
                                            </div>
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                                                <span className="text-white text-[10px] font-bold">Edit</span>
                                            </div>
                                            <input
                                                type="file"
                                                id={`image-upload-${rel.id}`}
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => handleImageUpload(e, rel.id)}
                                            />
                                        </label>
                                        <div>
                                            <h4 className="font-bold text-lg">{rel.partnerName}</h4>
                                            <p className="text-zinc-400 text-sm">Dated from {formatRelationshipDate(rel.startYear, rel.startWeek)} - {rel.endYear ? formatRelationshipDate(rel.endYear, rel.endWeek) : 'Present'}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-center">
                                        <StatusBadge status={rel.status} isPublic={rel.isPublic} />
                                        {!activeRelationship && (
                                            <button 
                                                onClick={() => dispatch({ type: 'GET_BACK_WITH_EX', payload: { relationshipId: rel.id } })}
                                                className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold"
                                            >
                                                Get Back Together
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Kids section */}
                {activeArtistData.kids && activeArtistData.kids.length > 0 && (
                    <section>
                        <h2 className="text-xl font-bold mb-4">Children</h2>
                        <div className="space-y-4">
                            {activeArtistData.kids.map(kid => {
                                const ageInWeeks = (gameState.date.year * 52 + gameState.date.week) - (kid.birthDate.year * 52 + kid.birthDate.week);
                                const ageInYears = Math.floor(ageInWeeks / 52);
                                
                                return (
                                    <div key={kid.id} className="bg-zinc-800 p-4 rounded-xl border border-zinc-700 space-y-4 shadow-xl">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-2xl font-black text-pink-400">{kid.name}</h3>
                                                <p className="text-zinc-400">Age: {ageInYears}</p>
                                                {kid.parentName && <p className="text-zinc-400 text-sm">Co-parent: {kid.parentName}</p>}
                                            </div>
                                            {kid.isArtist && (
                                                <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded text-xs font-semibold uppercase">
                                                    Music Artist
                                                </span>
                                            )}
                                        </div>
                                        {ageInYears >= 10 && !kid.isArtist && (
                                            <div className="pt-2">
                                                <button 
                                                    onClick={() => dispatch({ type: 'START_KID_CAREER', payload: { kidId: kid.id } })}
                                                    className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-full font-bold text-sm"
                                                >
                                                    Start Music Career
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}
            </div>

            {/* Modals */}
            {showNewRelationshipModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowNewRelationshipModal(false)}>
                    <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-md p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <h2 className="text-2xl font-black mb-6">Start Dating</h2>
                        
                        <div className="flex gap-2 mb-6">
                            <button 
                                className={`flex-1 py-2 rounded-lg font-bold ${partnerType === 'npc' ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}
                                onClick={() => setPartnerType('npc')}
                            >
                                Fellow Artist
                            </button>
                            <button 
                                className={`flex-1 py-2 rounded-lg font-bold ${partnerType === 'custom' ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}
                                onClick={() => setPartnerType('custom')}
                            >
                                Someone Else
                            </button>
                        </div>

                        {partnerType === 'npc' ? (
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-zinc-400 mb-2">Select Artist</label>
                                <select 
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white outline-none focus:border-red-500"
                                    value={selectedNpcId}
                                    onChange={e => setSelectedNpcId(e.target.value)}
                                >
                                    <option value="">-- Choose an artist --</option>
                                    {sortedNpcs.map(n => (
                                        <option key={n.uniqueId} value={n.uniqueId}>{n.artist}</option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-zinc-400 mb-2">Partner's Name</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white outline-none focus:border-red-500"
                                    placeholder="Enter name..."
                                    value={customName}
                                    onChange={e => setCustomName(e.target.value)}
                                    maxLength={40}
                                />
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button 
                                onClick={() => setShowNewRelationshipModal(false)}
                                className="flex-1 bg-zinc-800 text-white py-3 rounded-xl font-bold hover:bg-zinc-700"
                            >
                                Cancel
                            </button>
                            <button 
                                disabled={partnerType === 'npc' ? !selectedNpcId : !customName.trim()}
                                onClick={handleStartDating}
                                className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {relationshipToReveal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setRelationshipToReveal(null)}>
                    <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-sm p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <h2 className="text-2xl font-black mb-2">Go Public</h2>
                        <p className="text-zinc-400 mb-6 font-medium">Which outlet do you want to break the news to?</p>
                        
                        <div className="space-y-3">
                            <button 
                                onClick={() => handleReveal('popbase')}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold text-lg transition-colors"
                            >
                                Pop Base
                            </button>
                            <button 
                                onClick={() => handleReveal('tmz')}
                                className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl font-bold text-lg transition-colors"
                            >
                                TMZ
                            </button>
                            <button 
                                onClick={() => setRelationshipToReveal(null)}
                                className="w-full bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-xl font-bold transition-colors mt-2"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DatingView;
