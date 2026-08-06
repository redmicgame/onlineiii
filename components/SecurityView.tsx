
import React, { useState } from 'react';
import { useGame, formatNumber } from '../context/GameContext';
import { SECURITY_TEAMS } from '../constants';
import { SecurityTeam } from '../types';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import ConfirmationModal from './ConfirmationModal';

const SecurityView: React.FC = () => {
    const { dispatch, activeArtistData } = useGame();
    const [confirmHire, setConfirmHire] = useState<SecurityTeam | null>(null);
    const [confirmFire, setConfirmFire] = useState(false);

    if (!activeArtistData) return null;
    const { money, securityTeamId } = activeArtistData;

    const currentTeam = securityTeamId ? SECURITY_TEAMS.find(s => s.id === securityTeamId) : null;

    const handleHire = (team: SecurityTeam) => {
        dispatch({ type: 'HIRE_SECURITY', payload: { teamId: team.id } });
        setConfirmHire(null);
    };

    const handleFire = () => {
        dispatch({ type: 'FIRE_SECURITY' });
        setConfirmFire(false);
    };
    
    return (
        <>
            {confirmHire && (
                <ConfirmationModal
                    isOpen={!!confirmHire}
                    onClose={() => setConfirmHire(null)}
                    onConfirm={() => handleHire(confirmHire)}
                    title={`Hire ${confirmHire.name}?`}
                    message={`This will immediately deduct the first weekly payment of $${formatNumber(confirmHire.weeklyCost)}. Are you sure?`}
                    confirmText="Confirm Hire"
                />
            )}
            {confirmFire && currentTeam && (
                 <ConfirmationModal
                    isOpen={confirmFire}
                    onClose={() => setConfirmFire(false)}
                    onConfirm={handleFire}
                    title={`Fire ${currentTeam.name}?`}
                    message={`Are you sure you want to fire your security team? They will stop protecting your music at the end of the week.`}
                    confirmText="Fire Security"
                />
            )}
            <div className="h-full w-full bg-zinc-900 overflow-y-auto">
                <header className="p-4 flex items-center gap-4 sticky top-0 bg-zinc-900/80 backdrop-blur-sm z-10 border-b border-zinc-700/50">
                    <button onClick={() => dispatch({type: 'CHANGE_VIEW', payload: 'game'})} className="p-2 rounded-full hover:bg-white/10">
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                    <h1 className="text-2xl font-bold">Security</h1>
                </header>
                <main className="p-4 space-y-4">
                    {SECURITY_TEAMS.map(team => {
                        const isHired = securityTeamId === team.id;
                        const canAfford = money >= team.weeklyCost;

                        return (
                            <div key={team.id} className={`p-4 rounded-lg border-2 ${isHired ? 'border-red-500 bg-red-900/30' : 'border-zinc-700 bg-zinc-800'}`}>
                                <h2 className="text-xl font-bold">{team.name}</h2>
                                <p className={`font-bold text-lg ${isHired || canAfford ? 'text-green-400' : 'text-red-500'}`}>${formatNumber(team.weeklyCost)}<span className="text-sm font-normal text-zinc-400">/week</span></p>
                                <p className="text-blue-400 font-semibold mt-1">{(1 - team.leakProtection) * 100}% Leak Chance Reduction</p>

                                {isHired ? (
                                    <button onClick={() => setConfirmFire(true)} className="mt-4 w-full bg-red-600/20 text-red-400 font-bold p-2 rounded-lg">
                                        Fire Team
                                    </button>
                                ) : (
                                    <button onClick={() => setConfirmHire(team)} disabled={!canAfford} className="mt-4 w-full bg-red-600 font-bold p-2 rounded-lg disabled:bg-zinc-600">
                                        Hire
                                    </button>
                                )}
                            </div>
                        )
                    })}
                </main>
            </div>
        </>
    );
};

export default SecurityView;
