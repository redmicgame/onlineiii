import React, { useState } from 'react';
import { useGame, formatNumber } from '../context/GameContext';
import UserVerifiedBadge from './icons/UserVerifiedBadge';

const XPremiumModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { gameState, dispatch, activeArtistData } = useGame();
    const [selectedTier, setSelectedTier] = useState<'blue' | 'gold'>('blue');

    if (!activeArtistData) return null;
    
    // Check if current user is already verified
    const playerUser = activeArtistData.selectedPlayerXUserId ? activeArtistData.xUsers.find(u => u.id === activeArtistData.selectedPlayerXUserId) : activeArtistData.xUsers.find(u => u.isPlayer);
    
    const isAlreadyPremium = playerUser?.isVerified === true || playerUser?.isVerified === 'blue' || playerUser?.isVerified === 'gold';
    const isBuyingForBrand = activeArtistData.accountType === 'label';

    const handleBuy = () => {
        if (!playerUser) return;
        const cost = selectedTier === 'blue' ? 1000 : 250000;
        if (gameState.bankBalance >= cost) {
            dispatch({ type: 'BUY_X_VERIFICATION', payload: { accountId: playerUser.id, tier: selectedTier, cost } });
            onClose();
        } else {
            alert('Not enough funds!');
        }
    };

    return (
        <div className="fixed inset-0 bg-black flex flex-col z-[100] text-white">
            <header className="flex justify-between items-center p-4 border-b border-zinc-800">
                <button onClick={onClose} className="text-zinc-400 hover:text-white font-bold p-2 text-xl">&times;</button>
                <h1 className="font-bold text-xl flex-1 text-center">X Premium</h1>
                <div className="w-8"></div>
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="text-center">
                    <h2 className="text-3xl font-black mb-2">Upgrade your experience</h2>
                    <p className="text-zinc-400">Unlock more reach, edit posts, and get that shiny checkmark.</p>
                </div>

                <div className="flex gap-4 mb-6 relative">
                    <button 
                        onClick={() => setSelectedTier('blue')}
                        className={`flex-1 p-4 rounded-2xl border-2 transition-all ${selectedTier === 'blue' ? 'border-blue-500 bg-blue-500/10' : 'border-zinc-800 hover:border-zinc-700'}`}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <span className="font-bold text-lg">Premium</span>
                            <UserVerifiedBadge isVerified={'blue'} />
                        </div>
                        <p className="text-2xl font-black mb-1">$1K<span className="text-sm font-normal text-zinc-400">/mo</span></p>
                        <p className="text-xs text-zinc-500 text-left">Blue checkmark, priority ranking in replies, edit posts, longer videos.</p>
                    </button>

                    <button 
                         onClick={() => setSelectedTier('gold')}
                         className={`flex-1 p-4 rounded-2xl border-2 transition-all ${selectedTier === 'gold' ? 'border-yellow-500 bg-yellow-500/10' : 'border-zinc-800 hover:border-zinc-700'}`}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <span className="font-bold text-lg">Verified Org</span>
                            <UserVerifiedBadge isVerified={'gold'} />
                        </div>
                         <p className="text-2xl font-black mb-1">$250K<span className="text-sm font-normal text-zinc-400">/mo</span></p>
                         <p className="text-xs text-zinc-500 text-left">Gold checkmark, highest priority ranking, dedicated support.</p>
                    </button>
                </div>

                {isAlreadyPremium ? (
                    <div className="bg-green-500/10 text-green-500 border border-green-500/30 p-4 rounded-xl text-center font-bold">
                        You're already subscribed to X Premium!
                    </div>
                ) : (
                    <button 
                        onClick={handleBuy}
                        disabled={gameState.bankBalance < (selectedTier === 'blue' ? 1000 : 250000)}
                        className="w-full bg-white text-black py-4 rounded-full font-bold text-lg hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors relative"
                    >
                        Subscribe and Pay
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-normal text-zinc-500">Bank: ${formatNumber(gameState.bankBalance)}</div>
                    </button>
                )}
                
                <div className="text-center text-xs text-zinc-500 mt-8">
                    By subscribing, you agree to our Purchaser Terms of Service. Subscriptions auto-renew until canceled, as described in the Terms. Cancel anytime.
                </div>
            </div>
        </div>
    );
};

export default XPremiumModal;
