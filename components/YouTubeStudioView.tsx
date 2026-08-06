
import React, { useState, useMemo } from 'react';
import { useGame, formatNumber } from '../context/GameContext';
import { VIEW_INCOME_MULTIPLIER } from '../constants';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import ChartBarIcon from './icons/ChartBarIcon';
import ThumbUpIcon from './icons/ThumbUpIcon';
import CommentIcon from './icons/CommentIcon';
import ArrowDownIcon from './icons/ArrowDownIcon';

type StudioTab = 'Dashboard' | 'Earn';

const YouTubeStudioView: React.FC = () => {
    const { gameState, dispatch, activeArtist, activeArtistData } = useGame();
    const { date } = gameState;
    const [activeTab, setActiveTab] = useState<StudioTab>('Dashboard');

    if (!activeArtist || !activeArtistData) return null;
    const { youtubeSubscribers, videos, lastFourWeeksViews, youtubePartnerProgram } = activeArtistData;

    const last28DaysViews = useMemo(() => {
        return lastFourWeeksViews.reduce((sum, weeklyViews) => sum + weeklyViews, 0);
    }, [lastFourWeeksViews]);

    const last28DaysRevenue = useMemo(() => {
        return last28DaysViews * VIEW_INCOME_MULTIPLIER;
    }, [last28DaysViews]);
    
    const latestVideos = useMemo(() => {
        return [...videos]
            .filter(v => !v.isFeatureVideo)
            .sort((a, b) => (b.releaseDate.year * 52 + b.releaseDate.week) - (a.releaseDate.year * 52 + a.releaseDate.week))
            .slice(0, 5);
    }, [videos]);

    const weeksAgo = (releaseDate: { week: number, year: number }): number => {
        return (date.year * 52 + date.week) - (releaseDate.year * 52 + releaseDate.week);
    }

    const publicViewsLast12Months = useMemo(() => {
        const limitYear = date.week > 52 ? date.year : date.year - 1;
        const limitWeek = date.week > 52 ? date.week - 52 : 52 - (52 - date.week);
        return [...videos].filter(v => !v.isFeatureVideo && ((v.releaseDate.year === date.year && v.releaseDate.week <= date.week) || (v.releaseDate.year === limitYear && v.releaseDate.week > limitWeek))).reduce((sum, v) => sum + v.views, 0);
    }, [videos, date]);

    const reqSubscribers = youtubeSubscribers >= 1000;
    const reqViews = publicViewsLast12Months >= 100000;
    const canJoinYPP = reqSubscribers && reqViews;
    const yppActive = youtubePartnerProgram?.isActive;

    const handleApplyYPP = () => {
        dispatch({ type: 'APPLY_YOUTUBE_PARTNER' });
    }

    return (
        <div className="bg-[#0f0f0f] text-white h-full overflow-y-auto pb-16">
             <header className="p-4 flex flex-col gap-2 sticky top-0 bg-[#0f0f0f]/95 backdrop-blur-sm z-10 border-b border-white/10">
                <div className="flex items-center gap-4">
                    <button onClick={() => dispatch({type: 'CHANGE_VIEW', payload: 'youtube'})} className="p-2 rounded-full hover:bg-white/10">
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-bold">Studio</h1>
                </div>
                <div className="flex gap-6 border-b border-white/20 mt-2">
                    <button 
                        onClick={() => setActiveTab('Dashboard')}
                        className={`pb-2 text-sm font-semibold border-b-2 ${activeTab === 'Dashboard' ? 'border-white text-white' : 'border-transparent text-zinc-400 hover:text-white'}`}
                    >
                        Dashboard
                    </button>
                    <button 
                        onClick={() => setActiveTab('Earn')}
                        className={`pb-2 text-sm font-semibold border-b-2 ${activeTab === 'Earn' ? 'border-white text-white' : 'border-transparent text-zinc-400 hover:text-white'}`}
                    >
                        Earn
                    </button>
                </div>
            </header>

            <main className="p-4 space-y-6">
                {activeTab === 'Dashboard' && (
                    <>
                        <div className="flex items-center gap-4">
                            <img src={activeArtist.image} alt={activeArtist.name} className="w-16 h-16 rounded-full object-cover"/>
                            <div>
                                <h2 className="text-xl font-bold">{activeArtist.name}</h2>
                                <p className="text-sm text-zinc-400">{formatNumber(youtubeSubscribers)} Total subscribers</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-bold">Channel analytics</h3>
                                <p className="text-xs text-zinc-400">Last 28 days</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-[#282828] p-4 rounded-lg">
                                    <p className="text-sm text-zinc-400">Views</p>
                                    <p className="text-2xl font-bold">{formatNumber(last28DaysViews)}</p>
                                </div>
                                <div className="bg-[#282828] p-4 rounded-lg">
                                    <p className="text-sm text-zinc-400">Revenue</p>
                                    <p className="text-2xl font-bold">${formatNumber(last28DaysRevenue)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-bold">Latest published content</h3>
                            <div className="space-y-3">
                                {latestVideos.map(video => {
                                    const likes = Math.floor(video.views * 0.2);
                                    const comments = Math.floor(video.views / (Math.random() * 500 + 400));
                                    const weeksSinceRelease = weeksAgo(video.releaseDate);

                                    return (
                                        <div key={video.id} className="bg-[#282828] p-3 rounded-lg space-y-2">
                                            <div className="flex gap-3">
                                                <img src={video.thumbnail} alt={video.title} className="w-24 aspect-video rounded-md object-cover"/>
                                                <div className="flex-grow">
                                                    <p className="font-semibold line-clamp-2 text-sm">{video.title}</p>
                                                    <p className="text-xs text-zinc-400">First {weeksSinceRelease * 7} days</p>
                                                </div>
                                            </div>
                                            <div className="border-t border-white/10 pt-2 flex justify-around items-center text-xs">
                                                <div className="flex items-center gap-1.5">
                                                    <ChartBarIcon className="w-4 h-4 text-zinc-400" />
                                                    <span>{formatNumber(video.views)}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <ThumbUpIcon className="w-4 h-4 text-zinc-400" />
                                                    <span>{formatNumber(likes)}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <CommentIcon className="w-4 h-4 text-zinc-400" />
                                                    <span>{formatNumber(comments)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'Earn' && (
                    <div className="space-y-6">
                        {yppActive ? (
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-center mt-4">You're a YouTube Partner!</h2>
                                <p className="text-zinc-400 text-center">You are eligible to earn money from your videos.</p>
                                <div className="bg-[#282828] p-4 rounded-xl mt-6">
                                    <p className="text-zinc-400 text-sm">Lifetime YPP Earnings</p>
                                    <p className="text-3xl font-bold text-green-400 mt-1">${formatNumber(youtubePartnerProgram?.lifetimeEarnings || 0)}</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="text-center space-y-2 mt-4">
                                    <h2 className="text-2xl font-bold">Grow with YouTube</h2>
                                    <p className="text-zinc-400 text-sm px-4">
                                        As a YouTube partner, you'll be eligible to earn money from your videos, get creator support, and more.
                                    </p>
                                </div>

                                <div className="bg-[#282828] p-5 rounded-xl space-y-6">
                                    <h3 className="font-bold">Eligibility requirements</h3>
                                    
                                    <div className="space-y-6">
                                        <div>
                                            <div className="flex justify-between items-end mb-2">
                                                <div>
                                                    <p className="text-sm font-semibold">{formatNumber(youtubeSubscribers)} subscribers</p>
                                                    <p className="text-xs text-zinc-400">1,000 required</p>
                                                </div>
                                                {reqSubscribers && <span className="text-[#3ea6ff] text-xs font-bold">Met</span>}
                                            </div>
                                            <div className="w-full bg-white/10 rounded-full h-2">
                                                <div className="bg-[#3ea6ff] h-2 rounded-full" style={{ width: `${Math.min(100, (youtubeSubscribers / 1000) * 100)}%` }}></div>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between items-end mb-2">
                                                <div>
                                                    <p className="text-sm font-semibold">{formatNumber(publicViewsLast12Months)} public views</p>
                                                    <p className="text-xs text-zinc-400">100K required (last 12 months)</p>
                                                </div>
                                                {reqViews && <span className="text-[#3ea6ff] text-xs font-bold">Met</span>}
                                            </div>
                                            <div className="w-full bg-white/10 rounded-full h-2">
                                                <div className="bg-[#3ea6ff] h-2 rounded-full" style={{ width: `${Math.min(100, (publicViewsLast12Months / 100000) * 100)}%` }}></div>
                                            </div>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={handleApplyYPP}
                                        disabled={!canJoinYPP}
                                        className={`w-full py-2.5 rounded-full font-bold text-sm ${canJoinYPP ? 'bg-white text-black hover:bg-zinc-200' : 'bg-white/10 text-white/50 cursor-not-allowed'}`}
                                    >
                                        Apply Now
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default YouTubeStudioView;
