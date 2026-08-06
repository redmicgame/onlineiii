
import React, { useMemo, useState } from 'react';
import { useGame, formatNumber } from '../context/GameContext';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import ImageIcon from './icons/ImageIcon';
import VideoIcon from './icons/VideoIcon';
import HeartIcon from './icons/HeartIcon';
import ArrowUpOnBoxIcon from './icons/ArrowUpOnBoxIcon';
import LocationMarkerIcon from './icons/LocationMarkerIcon';
import CommentIcon from './icons/CommentIcon';

const StatPill: React.FC<{ value: string; label: string }> = ({ value, label }) => (
    <div className="text-center">
        <p className="font-bold text-lg">{value}</p>
        <p className="text-xs text-zinc-500 uppercase">{label}</p>
    </div>
);

const OnlyFansView: React.FC = () => {
    const { dispatch, activeArtistData, gameState } = useGame();
    const [view, setView] = useState<'profile' | 'stats'>('profile');
    
    if (!activeArtistData || !activeArtistData.onlyfans) {
        // This should not happen if logic is correct, but it's a safe fallback.
        return (
            <div className="p-4">
                <p>OnlyFans profile not found.</p>
                <button onClick={() => dispatch({ type: 'CHANGE_VIEW', payload: 'game' })}>Back</button>
            </div>
        );
    }

    const { onlyfans } = activeArtistData;
    const { posts, displayName, username, bio, profilePicture, bannerPicture, subscribers, likes, subscriptionPrice } = onlyfans;

    const handleCreatePost = () => {
        dispatch({ type: 'CHANGE_VIEW', payload: 'createOnlyFansPost' });
    };
    
    const sortedEarnings = useMemo(() => {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return Object.entries(onlyfans.earningsByMonth).map(([key, value]) => {
            const [year, monthIndex] = key.split('-').map(Number);
            return {
                label: `${months[monthIndex]}, ${year}`,
                gross: value.gross,
                net: value.net
            };
        }).reverse();
    }, [onlyfans.earningsByMonth]);


    if (view === 'stats') {
        return (
            <div className="bg-white text-black h-full overflow-y-auto">
                 <header className="p-4 border-b border-zinc-200">
                    <button onClick={() => setView('profile')} className="flex items-center gap-2 text-zinc-600">
                        <ArrowLeftIcon className="w-5 h-5" />
                        Back to Profile
                    </button>
                </header>
                <main className="p-4 space-y-4">
                    <div className="border-b pb-4">
                        <p className="text-zinc-500">All time</p>
                        <p className="text-4xl font-bold">${formatNumber(onlyfans.totalNet)}</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm"><span>Subscriptions</span> <span>${formatNumber(onlyfans.totalGross)}</span></div>
                        <div className="flex justify-between text-sm text-zinc-500"><span>Tips</span> <span>$0.00</span></div>
                        <div className="flex justify-between text-sm text-zinc-500"><span>Posts</span> <span>$0.00</span></div>
                        <div className="flex justify-between text-sm text-zinc-500"><span>Messages</span> <span>$0.00</span></div>
                    </div>
                     <div className="flex justify-between font-bold border-t pt-2"><span>TOTAL GROSS</span> <span>${formatNumber(onlyfans.totalGross)}</span></div>
                     <div className="flex justify-between font-bold"><span>NET</span> <span>${formatNumber(onlyfans.totalNet)}</span></div>
                     <hr/>
                     {sortedEarnings.map(month => (
                         <div key={month.label} className="flex justify-between items-center py-2 border-b">
                            <p>{month.label}</p>
                            <p className="font-semibold">${formatNumber(month.net)}</p>
                         </div>
                     ))}
                </main>
            </div>
        );
    }


    return (
        <div className="bg-white text-black h-full overflow-y-auto">
            <header className="p-3 flex justify-between items-center">
                <button onClick={() => dispatch({type: 'CHANGE_VIEW', payload: 'game'})}><ArrowLeftIcon className="w-6 h-6"/></button>
                <p className="font-bold">{displayName}</p>
                <div className="flex items-center gap-4 text-sm font-semibold">
                    <div className="flex items-center gap-1"><ImageIcon className="w-5 h-5"/> {posts.length}</div>
                    <div className="flex items-center gap-1"><VideoIcon className="w-5 h-5"/> 0</div>
                    <div className="flex items-center gap-1"><HeartIcon className="w-5 h-5"/> {formatNumber(likes)}</div>
                </div>
            </header>
            
            <div className="relative">
                <div className="h-40 bg-zinc-200">
                    <img src={bannerPicture} alt="Banner" className="w-full h-full object-cover"/>
                </div>
                <div className="absolute -bottom-10 left-4 w-28 h-28 rounded-full border-4 border-white bg-zinc-300">
                    <img src={profilePicture} alt="Profile" className="w-full h-full rounded-full object-cover"/>
                </div>
                <button className="absolute top-4 right-4 bg-white/80 rounded-full p-2">
                    <ArrowUpOnBoxIcon className="w-6 h-6"/>
                </button>
            </div>
            
            <main className="pt-14 px-4 pb-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-1">{displayName}</h1>
                        <p className="text-zinc-500">@{username} • <span className="text-green-600">Online</span></p>
                    </div>
                     <button onClick={() => setView('stats')} className="text-sm bg-zinc-100 px-4 py-2 rounded-lg font-semibold">Stats</button>
                </div>
                
                <p className="mt-3">{bio}</p>

                <div className="flex items-center gap-2 text-zinc-500 mt-2">
                    <LocationMarkerIcon className="w-5 h-5"/>
                    <span>London</span>
                </div>
                
                <div className="mt-6 border-t pt-4">
                    <h2 className="font-bold uppercase text-sm text-zinc-500">Subscription</h2>
                    <button className="w-full bg-[#00aff0] hover:bg-[#009cd8] text-white font-bold py-3 rounded-full mt-2">
                        SUBSCRIBE ${subscriptionPrice.toFixed(2)} per month
                    </button>
                </div>

                <div className="mt-6 flex justify-around border-b">
                    <button className="flex-1 text-center py-2 font-bold border-b-2 border-black">{posts.length} POSTS</button>
                    <button className="flex-1 text-center py-2 text-zinc-500 font-bold">0 MEDIA</button>
                </div>
                 <div className="mt-4">
                    <button onClick={handleCreatePost} className="w-full bg-zinc-200 text-black font-semibold py-3 rounded-lg">
                        New Post
                    </button>
                    {posts.length > 0 ? (
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-1">
                            {posts.map(post => (
                                <div key={post.id} className="relative aspect-square group">
                                    <img src={post.image} alt={post.caption} className="w-full h-full object-cover"/>
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                                        <div className="text-white text-xs flex items-center gap-4">
                                            <div className="flex items-center gap-1"><HeartIcon className="w-4 h-4"/>{formatNumber(post.likes)}</div>
                                            <div className="flex items-center gap-1"><CommentIcon className="w-4 h-4"/>{formatNumber(post.comments)}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="mt-4 text-center text-zinc-400">
                            <p>No posts yet. Start by creating your first post!</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default OnlyFansView;
