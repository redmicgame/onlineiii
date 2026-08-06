
import React from 'react';
import { useGame } from '../context/GameContext';
import { LABELS } from '../constants';

const ContractRenewalView: React.FC = () => {
    const { gameState, dispatch, activeArtistData } = useGame();
    const { contractRenewalOffer } = gameState;

    if (!contractRenewalOffer || !activeArtistData) return null;

    const { customLabels } = activeArtistData;
    const { labelId, isCustom } = contractRenewalOffer;

    const label = isCustom
        ? customLabels.find(l => l.id === labelId)
        : LABELS.find(l => l.id === labelId);

    if (!label) {
        // This should not happen, but as a fallback, go independent.
        dispatch({ type: 'GO_INDEPENDENT' });
        return null;
    }

    const handleRenew = () => {
        dispatch({ type: 'RENEW_CONTRACT' });
    };

    const handleGoIndependent = () => {
        dispatch({ type: 'GO_INDEPENDENT' });
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-zinc-800 rounded-2xl shadow-lg p-8 border border-red-500/50 text-center">
                <img src={label.logo} alt={label.name} className="w-24 h-24 rounded-full object-cover mx-auto mb-4" />
                <h2 className="text-2xl font-bold">Contract Ended</h2>
                <p className="text-zinc-300 mt-4">
                    Your contract with <span className="font-bold">{label.name}</span> has expired. They would like to offer you a new deal.
                </p>
                
                <div className="my-6 text-left bg-zinc-700/50 p-4 rounded-lg space-y-2">
                    <p className="font-bold text-center text-lg">New Offer</p>
                    <p><span className="font-semibold text-zinc-400">Duration:</span> 2 Years (104 Weeks)</p>
                    <p><span className="font-semibold text-zinc-400">Album Quota:</span> 2 Albums</p>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={handleGoIndependent}
                        className="w-full h-12 bg-zinc-600 hover:bg-zinc-700 text-white font-bold rounded-lg transition-colors"
                    >
                        Go Independent
                    </button>
                    <button
                        onClick={handleRenew}
                        className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
                    >
                        Renew Contract
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ContractRenewalView;
