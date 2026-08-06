import React from 'react';
import { useGame, formatNumber } from '../context/GameContext';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import UserVerifiedBadge from './icons/UserVerifiedBadge';

const XAnalyticsView: React.FC = () => {
    const { gameState, dispatch, activeArtistData } = useGame();
    if (!activeArtistData) return null;

    const { xUsers, selectedPlayerXUserId, xPosts } = activeArtistData;
    const playerUser = selectedPlayerXUserId ? xUsers.find(u => u.id === selectedPlayerXUserId) : xUsers.find(u => u.isPlayer);
    
    if (!playerUser) return null;

    const userPosts = xPosts.filter(p => p.authorId === playerUser.id);
    const totalViews = userPosts.reduce((sum, p) => sum + p.views, 0);
    const totalLikes = userPosts.reduce((sum, p) => sum + p.likes, 0);
    const totalRetweets = userPosts.reduce((sum, p) => sum + p.retweets, 0);
    const engagements = totalLikes + totalRetweets + Math.floor(totalViews * 0.05);

    return (
        <div className="bg-black h-full overflow-y-auto text-white pt-safe px-4 flex flex-col pb-24">
            <header className="flex items-center gap-4 py-4 border-b border-zinc-800">
                <button onClick={() => dispatch({ type: 'CHANGE_VIEW', payload: 'x' })} className="p-2 rounded-full hover:bg-zinc-900 transition-colors">
                    <ArrowLeftIcon className="w-5 h-5"/>
                </button>
                <div className="flex-1">
                    <h1 className="font-bold text-xl">Account Analytics</h1>
                </div>
            </header>

            <div className="mt-6">
                <div className="flex justify-between items-center bg-zinc-900 border border-zinc-800 p-4 rounded-2xl mb-6">
                    <div className="flex gap-3 items-center">
                        <img src={playerUser.avatar} className="w-12 h-12 rounded-full object-cover" />
                        <div>
                            <div className="flex gap-1 items-center">
                                <span className="font-bold text-lg leading-tight">{playerUser.name}</span>
                                <UserVerifiedBadge isVerified={playerUser.isVerified} className="w-4 h-4" />
                            </div>
                            <span className="text-zinc-500 text-sm">@{playerUser.username}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-zinc-400 font-bold">28 day summary</h2>
                        <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">Updates daily</span>
                    </div>

                    <div className="grid grid-cols-2 gap-y-8 gap-x-4">
                        <div>
                            <h3 className="text-zinc-400 text-sm mb-1">Views</h3>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold">{formatNumber(totalViews)}</span>
                                <span className="text-green-500 text-xs font-bold bg-green-500/10 px-1 rounded flex items-center gap-0.5">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                                    12.4%
                                </span>
                            </div>
                        </div>
                        
                        <div>
                            <h3 className="text-zinc-400 text-sm mb-1">Engagements</h3>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold">{formatNumber(engagements)}</span>
                                <span className="text-green-500 text-xs font-bold bg-green-500/10 px-1 rounded flex items-center gap-0.5">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                                    5.2%
                                </span>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-zinc-400 text-sm mb-1">Profile visits</h3>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold">{formatNumber(Math.floor(totalViews * 0.1))}</span>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-zinc-400 text-sm mb-1">Likes</h3>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold">{formatNumber(totalLikes)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-zinc-800">
                        <div className="h-32 flex items-end justify-between px-2 gap-1 mb-2">
                            {Array.from({ length: 14 }).map((_, i) => (
                                <div key={i} className="w-full bg-[#1DA1F2]/50 hover:bg-[#1DA1F2] rounded-t-sm transition-all" style={{ height: `${Math.max(10, Math.random() * 100)}%`}}></div>
                            ))}
                        </div>
                        <p className="text-center text-xs text-zinc-500 uppercase tracking-widest font-bold">Impressions over 14 days</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default XAnalyticsView;
