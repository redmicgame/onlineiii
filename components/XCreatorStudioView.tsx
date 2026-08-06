import React, { useState, useMemo } from 'react';
import { useGame, formatNumber } from '../context/GameContext';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';

const XCreatorStudioView: React.FC = () => {
    const { gameState, dispatch, activeArtistData } = useGame();
    
    const [view, setView] = useState<'main' | 'subscriptions' | 'revenueSharing' | 'dashboard'>('main');
    
    // Subscribe state
    const [perk1, setPerk1] = useState('Welcome to the super follow page! Here you\'ll find exclusives.');
    const [perk2, setPerk2] = useState('By subscribing, you\'ll get access to exclusive content and stats.');
    const [priceStr, setPriceStr] = useState('4.99');

    if (!activeArtistData) return null;
    
    const { xUsers, selectedPlayerXUserId, xPosts } = activeArtistData;
    const playerUser = selectedPlayerXUserId ? xUsers.find(u => u.id === selectedPlayerXUserId) : xUsers.find(u => u.isPlayer);
    
    if (!playerUser) return null;

    const isPremium = playerUser.isVerified === true || playerUser.isVerified === 'blue' || playerUser.isVerified === 'gold';
    
    const totalImpressions3Mo = useMemo(() => {
        // Calculate impressions (views) from the last 12 weeks
        const limitYear = gameState.date.week > 12 ? gameState.date.year : gameState.date.year - 1;
        const limitWeek = gameState.date.week > 12 ? gameState.date.week - 12 : 52 - (12 - gameState.date.week);
        
        return (xPosts || []).filter(p => p.authorId === playerUser.id && 
            ((p.date.year === gameState.date.year && p.date.week > limitWeek && p.date.week <= gameState.date.week) ||
             (p.date.year === limitYear && p.date.week > limitWeek))
        ).reduce((sum, p) => sum + (p.views || 0), 0);
    }, [xPosts, playerUser.id, gameState.date]);

    const reqPremium = isPremium;
    const reqFollowersRev = playerUser.followersCount >= 500;
    const reqFollowersSub = playerUser.followersCount >= 2000;
    const reqImpressions = totalImpressions3Mo >= 5000000;
    
    const canRevShare = reqPremium && reqFollowersRev && reqImpressions;
    const canSub = reqPremium && reqFollowersSub && reqImpressions;
    
    const revShareActive = playerUser.xMonetization?.revenueSharing?.isActive;
    const subActive = playerUser.xMonetization?.subscriptions?.isActive;

    const handleEnableSubscriptions = () => {
        const p = parseFloat(priceStr);
        if (isNaN(p) || p <= 0 || p > 20) return alert('Price must be between $0.01 and $20.00');
        dispatch({ type: 'ENABLE_X_SUBSCRIPTIONS', payload: { price: p, perks: [perk1, perk2] } });
        setView('main');
    };

    const renderMain = () => (
        <div className="p-4 space-y-6">
            <h2 className="text-xl font-bold text-zinc-500 mb-2">Programs</h2>
            <div 
                className="flex items-center justify-between bg-black p-4 cursor-pointer hover:bg-zinc-900"
                onClick={() => setView('revenueSharing')}
            >
                <div className="flex items-center gap-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>
                    <div>
                        <h3 className="font-bold text-lg text-white">Revenue Sharing</h3>
                        <p className="text-zinc-500 text-sm">Earn from your posts</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full text-sm font-semibold">
                        {revShareActive ? 'Manage' : (canRevShare ? 'Eligible' : 'Ineligible')}
                    </span>
                    <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </div>
            </div>

            <div 
                className="flex items-center justify-between bg-black p-4 cursor-pointer hover:bg-zinc-900"
                onClick={() => setView('subscriptions')}
            >
                <div className="flex items-center gap-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11l-1-1m0 0l-1-1m1 1l1 1m-1-1v4" /></svg>
                    <div>
                        <h3 className="font-bold text-lg text-white">Subscriptions</h3>
                        <p className="text-zinc-500 text-sm">Earn from your most engaged followers</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full text-sm font-semibold">
                        {subActive ? 'Manage' : (canSub ? 'Eligible' : 'Ineligible')}
                    </span>
                    <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </div>
            </div>

            {(revShareActive || subActive) && (
                <div 
                    className="flex items-center justify-between bg-black p-4 cursor-pointer hover:bg-zinc-900"
                    onClick={() => setView('dashboard')}
                >
                    <div className="flex items-center gap-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <div>
                            <h3 className="font-bold text-lg text-white">Creator earnings dashboard</h3>
                            <p className="text-zinc-500 text-sm">View your payouts</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </div>
                </div>
            )}
        </div>
    );

    const renderReq = (met: boolean, text: string) => (
        <div className="flex items-center justify-between py-4">
            <span className="text-lg text-white">{text}</span>
            {met ? (
                <CheckCircleIcon className="w-6 h-6 text-[#20D5EC]" />
            ) : (
                <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 text-xs">X</div>
            )}
        </div>
    );

    const renderRevenueSharing = () => {
        if (revShareActive) {
            return (
                <div className="p-4 space-y-4">
                    <h2 className="text-xl font-bold text-white mb-4">Creator Revenue Sharing</h2>
                    <p className="text-zinc-400">You are enrolled in Creator Revenue Sharing.</p>
                    <div className="bg-zinc-900 p-4 rounded-xl">
                        <p className="text-zinc-400">Eligible Views this month</p>
                        <p className="text-2xl font-bold text-white">{formatNumber(playerUser.xMonetization?.revenueSharing?.eligibleViewsThisMonth || 0)}</p>
                    </div>
                    <div className="bg-zinc-900 p-4 rounded-xl">
                        <p className="text-zinc-400">Lifetime Earnings</p>
                        <p className="text-2xl font-bold text-green-400">${formatNumber(playerUser.xMonetization?.revenueSharing?.lifetimeEarnings || 0)}</p>
                    </div>
                </div>
            );
        }

        return (
            <div className="p-4 space-y-4">
                <p className="text-zinc-400 text-lg mb-6">
                    {canRevShare 
                        ? 'You are eligible for Creator Revenue Sharing! Enable to start earning.'
                        : 'Unfortunately, you\'re not yet eligible for Creator Revenue Sharing. You\'ll need to meet the below requirements to participate:'
                    }
                </p>
                <div className="space-y-2">
                    {renderReq(reqPremium, 'Get Verified by subscribing to Premium')}
                    {renderReq(reqFollowersRev, '500 Premium followers (Followers)')}
                    {renderReq(reqImpressions, 'Have at least 5M impressions on your posts within the last 3 months')}
                </div>
                {canRevShare && (
                    <button 
                        onClick={() => {
                            dispatch({ type: 'ENABLE_X_REVENUE_SHARING' });
                            setView('main');
                        }}
                        className="w-full bg-white text-black font-bold py-3 rounded-full mt-8"
                    >
                        Join and setup payouts
                    </button>
                )}
            </div>
        );
    };

    const renderSubscriptions = () => {
        if (subActive) {
            const subData = playerUser.xMonetization?.subscriptions;
            return (
                <div className="p-4 space-y-4">
                    <h2 className="text-xl font-bold text-white mb-4">Subscriptions</h2>
                    <p className="text-zinc-400">You are enrolled in Subscriptions.</p>
                    <div className="bg-zinc-900 p-4 rounded-xl">
                        <p className="text-zinc-400">Active Subscribers</p>
                        <p className="text-2xl font-bold text-white">{formatNumber(subData?.subscribers || 0)}</p>
                    </div>
                    <div className="bg-zinc-900 p-4 rounded-xl">
                        <p className="text-zinc-400">Monthly Price</p>
                        <p className="text-2xl font-bold text-white">${subData?.price}/mo</p>
                    </div>
                </div>
            );
        }

        if (canSub) {
            return (
                <div className="p-4 space-y-6">
                    <h2 className="text-2xl font-bold text-white">Setup Subscriptions</h2>
                    <p className="text-zinc-400">Choose your monthly price and perks for your subscribers.</p>
                    
                    <div>
                        <label className="block text-sm font-semibold text-zinc-300 mb-2">Monthly Price ($)</label>
                        <input 
                            type="number" 
                            step="0.01"
                            max="20.00"
                            min="0.01"
                            value={priceStr}
                            onChange={(e) => setPriceStr(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-white"
                        />
                        <p className="text-xs text-zinc-500 mt-1">Maximum $20.00/month</p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-zinc-300 mb-2">Perk 1 Description</label>
                        <textarea 
                            value={perk1}
                            onChange={(e) => setPerk1(e.target.value)}
                            rows={3}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-white resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-zinc-300 mb-2">Perk 2 Description</label>
                        <textarea 
                            value={perk2}
                            onChange={(e) => setPerk2(e.target.value)}
                            rows={3}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-white resize-none"
                        />
                    </div>

                    <button 
                        onClick={handleEnableSubscriptions}
                        className="w-full bg-[#E11383] text-white font-bold py-3 rounded-full mt-4"
                    >
                        Enable Subscriptions
                    </button>
                </div>
            );
        }

        return (
            <div className="p-4 space-y-4">
                <p className="text-zinc-400 text-lg mb-6">
                    Unfortunately, you don't meet our eligibility requirements for Subscriptions at this time.
                </p>
                <div className="space-y-2">
                    {renderReq(reqPremium, 'Get Verified by subscribing to Premium')}
                    {renderReq(reqFollowersSub, '2,000 verified followers (Followers)')}
                    {renderReq(reqImpressions, '5M organic impressions in the past 3 months')}
                    {renderReq(true, 'Active in the past 30 days')}
                    {renderReq(true, 'Be at least 18 years old')}
                </div>
            </div>
        );
    };

    const renderDashboard = () => {
        return (
            <div className="flex flex-col items-center justify-center p-8 space-y-6 mt-10">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-2">
                    <img src={playerUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(playerUser.name)}&background=random`} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <p className="text-zinc-400 text-lg">@{playerUser.username}</p>
                
                <h1 className="text-4xl font-bold text-white mt-8">
                    +${formatNumber(playerUser.xMonetization?.revenueSharing?.lifetimeEarnings || 0)}
                </h1>
                <p className="text-zinc-500">
                    Pay period: Month of Week {gameState.date.week}, {gameState.date.year}
                </p>
            </div>
        );
    };

    return (
        <div className="h-full w-full bg-black text-white flex flex-col overflow-y-auto">
            <header className="sticky top-0 bg-black/80 backdrop-blur-sm z-20 p-4 flex items-center border-b border-zinc-800">
                <button onClick={() => {
                    if (view === 'main') {
                        dispatch({ type: 'CHANGE_VIEW', payload: 'x' });
                    } else {
                        setView('main');
                    }
                }} className="mr-4">
                    <ArrowLeftIcon className="w-6 h-6 text-white" />
                </button>
                <h1 className="text-xl font-bold">
                    {view === 'main' && 'Creator Studio'}
                    {view === 'revenueSharing' && (canRevShare ? (revShareActive ? 'Revenue Sharing' : 'Check back later') : 'Check back later')}
                    {view === 'subscriptions' && (canSub ? (subActive ? 'Subscriptions' : 'Subscribe') : 'Check back later')}
                    {view === 'dashboard' && 'Creator earnings dashboard / X'}
                </h1>
            </header>
            
            <main className="flex-grow">
                {view === 'main' && renderMain()}
                {view === 'revenueSharing' && renderRevenueSharing()}
                {view === 'subscriptions' && renderSubscriptions()}
                {view === 'dashboard' && renderDashboard()}
            </main>
        </div>
    );
};

export default XCreatorStudioView;
