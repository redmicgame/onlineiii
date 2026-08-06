import React, { useState, useMemo } from 'react';
import { useGame, formatNumber } from '../context/GameContext';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';
import PlusIcon from './icons/PlusIcon';

const getCurrencySymbol = (location?: string) => {
    switch (location) {
        case "Canada": return "CA$";
        case "UK": return "£";
        case "Asia": return "¥";
        case "Latin America": return "R$"; // generic
        default: return "$";
    }
}

const CryptoView: React.FC = () => {
    const { gameState, dispatch, activeArtistData } = useGame();
    
    const [name, setName] = useState('');
    const [ticker, setTicker] = useState('');
    const [logo, setLogo] = useState('');
    const [launchPrice, setLaunchPrice] = useState(0.01);
    const [totalSupply, setTotalSupply] = useState(1000000000);
    const [playerPercent, setPlayerPercent] = useState(20);
    const cost = 250000; // Fixed launch & liquidity cost

    const [buyAmount, setBuyAmount] = useState(1000);
    const [sellAmount, setSellAmount] = useState(1000);

    const coin = activeArtistData?.cryptoCoin;
    const currency = getCurrencySymbol(activeArtistData?.location);
    const money = activeArtistData?.money || 0;

    const handleLaunch = () => {
        if (name && ticker && logo && launchPrice > 0 && totalSupply > 0 && money >= cost) {
            dispatch({
                type: 'LAUNCH_CRYPTO_COIN',
                payload: { name, ticker, logo, launchPrice, totalSupply, cost, playerPercent }
            });
        }
    };

    const formatCurrency = (val: number) => {
        if (val < 0.01) return currency + val.toPrecision(3);
        if (val < 1) return currency + val.toFixed(4);
        return currency + formatNumber(val);
    };

    if (!coin) {
        return (
            <div className="flex-1 bg-black text-white p-4 overflow-y-auto h-full min-h-0 pb-32">
                <div className="flex items-center mb-6 border-b border-zinc-800 pb-4">
                    <button onClick={() => dispatch({ type: 'CHANGE_VIEW', payload: 'game' })} className="mr-4 hover:bg-zinc-800 p-2 rounded-full transition-colors">
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">Crypto Launcher</h1>
                        <p className="text-sm text-zinc-400">Create your own cryptocurrency</p>
                    </div>
                </div>

                <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 mb-6">
                    <h2 className="text-xl font-bold mb-4">Coin Setup</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold mb-1 text-zinc-400">Coin Name (e.g., Mother Iggy)</label>
                            <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-zinc-800 p-3 rounded-lg border border-zinc-700 outline-none focus:border-amber-500" placeholder="Coin Name" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1 text-zinc-400">Ticker (e.g., MOTHER)</label>
                            <input value={ticker} onChange={e => setTicker(e.target.value.toUpperCase())} className="w-full bg-zinc-800 p-3 rounded-lg border border-zinc-700 outline-none focus:border-amber-500" placeholder="TICKER" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1 text-zinc-400">Logo (Upload Image)</label>
                            
                            <input type="file" accept="image/*" onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                        setLogo(reader.result as string);
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }} className="w-full bg-zinc-800 p-3 rounded-lg border border-zinc-700 outline-none focus:border-amber-500" />
                            {logo && <img src={logo} className="h-16 w-16 object-cover rounded-full mt-2" />}

                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-semibold mb-1 text-zinc-400">Launch Price ({currency})</label>
                                <input type="number" step="0.001" value={launchPrice} onChange={e => setLaunchPrice(Number(e.target.value))} className="w-full bg-zinc-800 p-3 rounded-lg border border-zinc-700 outline-none focus:border-amber-500" />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-semibold mb-1 text-zinc-400">Total Supply</label>
                                <input type="number" value={totalSupply} onChange={e => setTotalSupply(Number(e.target.value))} className="w-full bg-zinc-800 p-3 rounded-lg border border-zinc-700 outline-none focus:border-amber-500" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-semibold mb-1 text-zinc-400">Amount to Keep for Yourself: {playerPercent}%</label>
                            <input type="range" min="1" max="99" value={playerPercent} onChange={e => setPlayerPercent(Number(e.target.value))} className="w-full accent-amber-500" />
                            <div className="text-xs text-zinc-500 text-center mt-1">The rest goes to the public/liquidity pool.</div>
                        </div>
                        <div className="bg-zinc-800 p-4 rounded-lg mt-2 flex justify-between items-center">
                            <span>Launch Cost:</span>
                            <span className="font-bold">{currency}{formatNumber(cost)}</span>
                        </div>
                        <button 
                            onClick={handleLaunch}
                            disabled={!name || !ticker || !logo || money < cost}
                            className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-600 text-black disabled:text-zinc-400 font-bold p-4 rounded-xl transition-colors mt-2"
                        >
                            Launch Coin
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const { currentPrice, launchPrice: originalLaunch, totalSupply: supply, marketCap, tradingVolume, holders, priceHistory } = coin;
    const ownershipPercent = (coin.playerOwnedCoins / supply) * 100;
    const isUp = currentPrice >= priceHistory[priceHistory.length - 2 || 0];
    const change24h = priceHistory.length > 1 ? ((currentPrice - priceHistory[priceHistory.length - 2]) / priceHistory[priceHistory.length - 2]) * 100 : 0;
    const color = isUp ? 'text-green-500' : 'text-red-500';

    return (
        <div className="flex-1 bg-[#121212] text-white p-4 overflow-y-auto h-full min-h-0 pb-32">
            <div className="flex items-center justify-between mb-6">
                <button onClick={() => dispatch({ type: 'CHANGE_VIEW', payload: 'game' })} className="hover:bg-zinc-800 p-2 rounded-full transition-colors">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <div className="flex gap-2">
                    <button className="bg-zinc-800 px-4 py-1.5 text-sm font-semibold rounded-full flex items-center gap-2">DEX <ChevronDownIcon className="w-4 h-4"/></button>
                </div>
            </div>

            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        {coin.name}
                        {coin.logo && <img src={coin.logo} className="w-8 h-8 rounded-full border border-zinc-700 object-cover" />}
                    </h1>
                    <div className="text-4xl font-semibold mt-1">{formatCurrency(currentPrice)}</div>
                    <div className={`text-lg font-medium mt-1 ${change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {change24h >= 0 ? '↗' : '↘'} {formatCurrency(Math.abs(currentPrice - (priceHistory[priceHistory.length - 2] || currentPrice)))} ({change24h > 0 ? '+' : ''}{change24h.toFixed(2)}%)
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-zinc-500 text-sm font-semibold">Market cap</div>
                    <div className="font-semibold text-lg">{currency}{formatNumber(marketCap)}</div>
                </div>
            </div>

            {/* Sparkline approximation */}
            <div className="w-full h-40 mb-6 flex items-end gap-1 relative">
                {priceHistory.map((p, i) => {
                    const min = Math.min(...priceHistory) * 0.9;
                    const max = Math.max(...priceHistory) * 1.1;
                    const height = Math.max(5, ((p - min) / (max - min)) * 100);
                    return (
                        <div key={i} className={`flex-1 ${isUp ? 'bg-green-500' : 'bg-red-500'} opacity-80 rounded-t-sm`} style={{ height: `${height}%` }}></div>
                    );
                })}
            </div>

            <div className="flex justify-between text-zinc-500 text-xs font-bold px-2 mb-8 uppercase tracking-wider">
                <span>1m</span><span>15m</span><span>1H</span><span>1D</span><span>1W</span><span className="bg-zinc-800 text-white px-3 py-1 rounded-full">All</span>
            </div>

            <div className="bg-zinc-900 rounded-xl p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">About</h2>
                <div className="flex flex-wrap gap-2 mb-6">
                    <div className="bg-zinc-800 px-4 py-2 rounded-full text-sm font-semibold border border-zinc-700 flex items-center gap-2">
                        <span>{formatNumber(holders)} holders</span>
                    </div>
                    <div className="bg-zinc-800 px-4 py-2 rounded-full text-sm font-semibold border border-zinc-700 flex items-center gap-2">
                        <span>Vol {currency}{formatNumber(tradingVolume)}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-800/50">
                        <div className="text-zinc-400 text-sm mb-1">Your Ownership</div>
                        <div className="text-2xl font-bold">{ownershipPercent.toFixed(2)}%</div>
                        <div className="text-sm text-amber-500">{formatNumber(coin.playerOwnedCoins)} coins</div>
                    </div>
                    <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-800/50">
                        <div className="text-zinc-400 text-sm mb-1">Total Supply</div>
                        <div className="text-2xl font-bold">{formatNumber(supply)}</div>
                    </div>
                </div>
            </div>

            <div className="bg-zinc-900 rounded-xl p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Reputation & Utility</h2>
                
                <div className="space-y-4 mb-6">
                    <div>
                        <div className="flex justify-between text-sm mb-1"><span className="text-zinc-400">Hype</span><span className="font-bold text-amber-500">{Math.round(coin.reputation.hype)}/100</span></div>
                        <div className="w-full bg-zinc-800 rounded-full h-2"><div className="bg-amber-500 h-2 rounded-full" style={{width: `${coin.reputation.hype}%`}}></div></div>
                    </div>
                    <div>
                        <div className="flex justify-between text-sm mb-1"><span className="text-zinc-400">Trust</span><span className="font-bold text-blue-500">{Math.round(coin.reputation.trust)}/100</span></div>
                        <div className="w-full bg-zinc-800 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{width: `${coin.reputation.trust}%`}}></div></div>
                    </div>
                    <div>
                        <div className="flex justify-between text-sm mb-1"><span className="text-zinc-400">Utility</span><span className="font-bold text-green-500">{Math.round(coin.reputation.utility)}/100</span></div>
                        <div className="w-full bg-zinc-800 rounded-full h-2"><div className="bg-green-500 h-2 rounded-full" style={{width: `${coin.reputation.utility}%`}}></div></div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {[
                        { id: 'merch', label: 'Buy Merch' },
                        { id: 'tickets', label: 'Concert Tickets' },
                        { id: 'fanClub', label: 'Fan Club Access' },
                        { id: 'voting', label: 'Voting Rights' }
                    ].map(u => (
                        <button 
                            key={u.id}
                            onClick={() => dispatch({ type: 'TOGGLE_CRYPTO_UTILITY', payload: { utility: u.id as any } })}
                            className={`p-3 rounded-lg text-sm font-semibold transition-colors ${coin.utilityEnabled[u.id as keyof typeof coin.utilityEnabled] ? 'bg-green-500/20 text-green-500 border border-green-500/50' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}
                        >
                            {u.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-zinc-900 rounded-xl p-6 mb-24">
                <h2 className="text-xl font-bold mb-4">Trade & Manage</h2>
                {coin.isRugpulled ? (
                    <div className="text-center text-red-500 font-bold py-4 bg-red-900/20 rounded-lg">Trading is permanently halted.</div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="text-xs text-zinc-400 mb-1 block">Buy Amount</label>
                                <input type="number" value={buyAmount} onChange={e => setBuyAmount(Number(e.target.value))} className="w-full bg-zinc-800 p-2 rounded-md outline-none focus:border-amber-500 border border-zinc-700 text-sm" />
                                <button 
                                    onClick={() => dispatch({ type: 'BUY_CRYPTO', payload: { amount: buyAmount, cost: buyAmount * currentPrice } })}
                                    disabled={money < buyAmount * currentPrice}
                                    className="w-full mt-2 bg-green-500 hover:bg-green-600 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-bold py-2 rounded-md text-sm"
                                >
                                    Buy ({formatCurrency(buyAmount * currentPrice)})
                                </button>
                            </div>
                            <div>
                                <label className="text-xs text-zinc-400 mb-1 block">Sell Amount</label>
                                <input type="number" value={sellAmount} onChange={e => setSellAmount(Number(e.target.value))} className="w-full bg-zinc-800 p-2 rounded-md outline-none focus:border-amber-500 border border-zinc-700 text-sm" />
                                <button 
                                    onClick={() => dispatch({ type: 'SELL_CRYPTO', payload: { amount: sellAmount, revenue: sellAmount * currentPrice } })}
                                    disabled={coin.playerOwnedCoins < sellAmount}
                                    className="w-full mt-2 bg-red-500 hover:bg-red-600 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-bold py-2 rounded-md text-sm"
                                >
                                    Sell ({formatCurrency(sellAmount * currentPrice)})
                                </button>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <button 
                                onClick={() => dispatch({ type: 'BURN_CRYPTO', payload: { amount: Math.floor(coin.playerOwnedCoins * 0.1) } })}
                                disabled={coin.playerOwnedCoins <= 0}
                                className="w-full bg-orange-600/20 text-orange-500 border border-orange-600/50 font-bold p-3 rounded-lg flex items-center justify-center gap-2 hover:bg-orange-600/30 transition-colors"
                            >
                                Burn 10% Holdings
                            </button>
                            <button 
                                onClick={() => dispatch({ type: 'MARKET_CRYPTO', payload: { cost: 50000, platform: 'x' } })}
                                disabled={money < 50000}
                                className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold p-3 rounded-lg border border-zinc-700 transition-colors"
                            >
                                Market on X ({currency}50k)
                            </button>
                            <button 
                                onClick={() => {
                                    if (window.confirm("Are you sure you want to RUGPULL? This will cash out your holdings, crash the coin, and severely damage your public image and hype!")) {
                                        dispatch({ type: 'RUGPULL_CRYPTO' });
                                        dispatch({ type: 'CHANGE_VIEW', payload: 'game' });
                                    }
                                }}
                                className="w-full bg-red-900/40 text-red-500 border border-red-900/80 font-bold p-3 rounded-lg flex items-center justify-center gap-2 hover:bg-red-900/60 transition-colors mt-4"
                            >
                                🚨 RUGPULL (Cash out {formatCurrency(coin.currentPrice * coin.playerOwnedCoins)})
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CryptoView;