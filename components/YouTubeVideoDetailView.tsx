

import React, { useState, useMemo } from 'react';
import { useGame, formatNumber } from '../context/GameContext';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import ThumbUpIcon from './icons/ThumbUpIcon';
import ThumbDownIcon from './icons/ThumbDownIcon';
import ShareIcon from './icons/ShareIcon';
import SaveIcon from './icons/SaveIcon';
import DownloadIconSimple from './icons/DownloadIconSimple';
import DotsHorizontalIcon from './icons/DotsHorizontalIcon';
import { Video, Song, Release } from '../types';
import ShoppingBagIcon from './icons/ShoppingBagIcon';
import { LABELS, SUBSCRIBER_THRESHOLD_VERIFIED, VIEWS_THRESHOLD_VERIFIED } from '../constants';

const CancelIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const ActionButton: React.FC<{
    icon: React.ReactNode;
    label: string;
}> = ({ icon, label }) => (
    <button className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 rounded-full py-2 px-4 transition-colors">
        {icon}
        <span className="text-sm font-semibold">{label}</span>
    </button>
);

const DescriptionOverlay: React.FC<{ video: Video; onClose: () => void }> = ({ video, onClose }) => {
    const { activeArtist, activeArtistData, dispatch, gameState } = useGame();
    const { songs, releases, merch } = activeArtistData!;

    const song = songs.find(s => s.id === video.songId);
    const release = song ? releases.find(r => r.id === song.releaseId) : null;
    
    const mentionedPeople: {name: string, image: string}[] = [];
    if (activeArtist) {
        mentionedPeople.push({ name: activeArtist.name, image: activeArtist.image });
    }
    
    if (video.mentionedNpcs) {
        for (const npcName of video.mentionedNpcs) {
            if (!mentionedPeople.some(p => p.name === npcName)) {
                mentionedPeople.push({ name: npcName, image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2E1YTVhNSIgY2xhc3M9InctNiBoLTYiPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTE4Ljc1IDE5LjEyNWExLjEyNSAxLjEyNSAwIDAgMS0xLjEyNSAxLjEyNUg2LjM3MmExLjEyNSAxLjEyNSAwIDAgMS0xLjEyNS0xLjEyNVY2LjE4OGExLjEyNSAxLjEyNSAwIDAgMSAxLjEyNS0xLjEyNWgxMS4yNVYxOS4xMjV6TTEyIDIuMjVjLTUuMzg1IDAtOS43NSA0LjM2NS05Ljc1IDkuNzVzNC4zNjUgOS43NSA5Ljc1IDkuNzUgOS43NS00LjM2NSA5Ljc1LTkuNzVTMTcuMzg1IDIuMjUgMTIgMi4yNXptMCAxLjVjNC41NTQgMCA4LjI1IDMuNjk2IDguMjUgOC4yNXMtMy42OTYgOC4yNS04LjI1IDguMjUtOC4yNS0zLjY5Ni04LjI1LTguMjVNNy40NDYgMy43NSAxMiAzLjc1em0tMi40IDEwLjVhMS4xMjUgMS4xMjUgMCAxIDEgMCAyLjI1IDEuMTI1IDEuMTI1IDAgMCAxIDAtMi4yNXptMy4zNDEtLjAyMmExLjEyNSAxLjEyNSAwIDEgMCAyLjI1IDAgMS4xMjUgMS4xMjUgMCAxIDAtMi4yNSAwem0zLjY4OS0xLjEyNWExLjEyNSAxLjEyNSAwIDEgMSAwLTIuMjUgMS4xMjUgMS4xMjUgMCAwIDEgMCAyLjI1eiIgY2xpcC1ydWxlPSJldmVub2RkIiAvPjwvc3ZnPg==' });
            }
        }
    }
    
    const storeItems = merch.slice(0, 3);
    
    return (
        <>
            <div className="p-4 border-b border-zinc-700 sticky top-0 bg-[#181818] z-10 flex justify-between items-center">
                <h2 className="text-xl font-bold">Description</h2>
                <button onClick={onClose} className="text-3xl text-zinc-400">&times;</button>
            </div>
            
            <div className="p-4 space-y-6">
                <div className="bg-zinc-800 rounded-xl p-4">
                    <h3 className="text-lg font-bold">{video.title}</h3>
                    <div className="grid grid-cols-3 gap-4 text-zinc-300 mt-4 text-center">
                        <div>
                            <p className="font-bold text-lg">{formatNumber(Math.floor(video.views * 0.01))}</p>
                            <p className="text-xs text-zinc-400">Likes</p>
                        </div>
                        <div>
                            <p className="font-bold text-lg">{video.views.toLocaleString()}</p>
                            <p className="text-xs text-zinc-400">Views</p>
                        </div>
                        <div>
                            <p className="font-bold text-lg">{new Date(video.releaseDate.year, 0, (video.releaseDate.week - 1) * 7 + 1).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                            <p className="text-xs text-zinc-400">Date</p>
                        </div>
                    </div>
                    <hr className="border-zinc-700 my-4" />
                    <p className="text-zinc-300 whitespace-pre-wrap text-sm">{video.description || 'No description available.'}</p>
                </div>

                {mentionedPeople.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="font-bold text-lg">People mentioned</h4>
                        <div className="grid grid-cols-3 gap-4">
                            {mentionedPeople.map(person => (
                                <div key={person.name} className="flex flex-col items-center text-center">
                                    <img src={person.image} alt={person.name} className="w-20 h-20 rounded-full object-cover mb-2" />
                                    <p className="font-semibold text-sm">{person.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {song && (
                    <div className="space-y-3">
                         <h4 className="font-bold text-lg">Music</h4>
                         <div className="bg-zinc-800 rounded-lg p-3 flex items-center gap-4">
                             <img src={song.coverArt} alt={song.title} className="w-16 h-16 rounded-md object-cover" />
                             <div className="flex-grow">
                                 <p className="font-bold">{song.title}</p>
                                 <p className="text-sm text-zinc-400">{activeArtist?.name}</p>
                                 <p className="text-xs text-zinc-500">{release ? release.title : song.title}</p>
                             </div>
                             <button className="ml-auto text-zinc-400"><DotsHorizontalIcon className="w-6 h-6" /></button>
                         </div>
                    </div>
                )}
                
                {storeItems.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="font-bold text-lg">{activeArtist!.name} store</h4>
                        <div className="bg-zinc-800 rounded-xl p-4 space-y-4">
                            {storeItems.map(item => (
                                <div key={item.id} className="flex items-center gap-3">
                                    <div className="relative w-[3.5rem] h-12 shrink-0">
                                        {/* Vinyl Disc */}
                                        {item.type === 'Vinyl' && (
                                            <div 
                                                className="absolute inset-y-0 right-0 w-12 h-full rounded-full shadow-sm"
                                                style={{ backgroundColor: item.color || '#1A1A1A' }}
                                            >
                                                <div className="absolute inset-1 rounded-full border border-black/20" />
                                                <div className="absolute inset-2 rounded-full border border-black/20" />
                                                <div className="absolute top-1/2 left-1/2 w-[35%] h-[35%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/50 overflow-hidden">
                                                    <img src={item.image} className="w-full h-full object-cover opacity-80" alt="" />
                                                </div>
                                                <div className="absolute top-1/2 left-1/2 w-1 h-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
                                            </div>
                                        )}
                                        {/* CD Disc */}
                                        {item.type === 'CD' && (
                                            <div className="absolute top-[2%] bottom-[2%] right-0 w-[2.85rem] rounded-full bg-gradient-to-tr from-zinc-300 via-gray-100 to-zinc-400 shadow-sm border border-zinc-300">
                                                <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent,rgba(255,255,255,0.8),transparent,rgba(255,255,255,0.8),transparent)] mix-blend-overlay opacity-50" />
                                                <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_90deg,rgba(255,0,0,0.1),rgba(0,255,0,0.1),rgba(0,0,255,0.1),rgba(255,0,0,0.1))] mix-blend-overlay" />
                                                <div className="absolute top-1/2 left-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-zinc-400 bg-white" />
                                            </div>
                                        )}
                                        
                                        {/* Sleeve/Case */}
                                        <div className={`absolute inset-y-0 left-0 w-12 h-12 z-10 shadow-sm bg-white ${item.type === 'CD' ? 'rounded-sm border border-zinc-300 overflow-hidden' : ''}`}>
                                            {item.type === 'CD' && (
                                                <>
                                                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-black flex flex-col justify-center border-r-[1px] border-zinc-400/50 shadow-inner"></div>
                                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
                                                </>
                                            )}
                                            <img src={item.image} alt={item.name} className={`w-full h-full object-cover ${item.type === 'CD' ? 'pl-1.5' : ''}`} />
                                        </div>
                                    </div>
                                    <div className="flex-grow">
                                        <p className="font-semibold text-sm line-clamp-2">{item.name}</p>
                                        <p className="text-xs text-zinc-400">shop.{activeArtist?.name.replace(/\s/g, '').toLowerCase()}.com</p>
                                    </div>
                                </div>
                            ))}
                             <button onClick={() => dispatch({ type: 'CHANGE_VIEW', payload: 'merchStore' })} className="w-full bg-zinc-700 hover:bg-zinc-600 rounded-full py-2.5 font-semibold text-sm mt-2 flex items-center justify-center gap-2">
                                <ShoppingBagIcon className="w-5 h-5" /> View {activeArtist!.name} store
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};


const CommentsOverlay: React.FC<{ video: Video; onClose: () => void; likes: number }> = ({ video, onClose, likes }) => {
    const commentsCount = Math.floor(video.views * 0.005);
    
    const comments = [
        {
            user: "@alessiobertarelli",
            avatar: "https://i.pravatar.cc/150?u=1",
            text: "VIDEO OF THE YEAR",
            likes: "11K",
            time: "7d ago",
            replies: 125
        },
        {
            user: "@evolvinali",
            avatar: "https://i.pravatar.cc/150?u=2",
            text: "A music video? Nah, a short film full of art, emotion, expression, symbolism and music. This is great",
            likes: "37K",
            time: "6d ago",
            replies: 92,
            verified: true
        },
        {
            user: "@mansi-j2b",
            avatar: "https://i.pravatar.cc/150?u=3",
            text: "I love it when singers are actual ACTORS 😭",
            likes: "15K",
            time: "6d ago",
            replies: 45
        },
        {
            user: "@positionswt6395",
            avatar: "https://i.pravatar.cc/150?u=4",
            text: "❤️",
            likes: "2",
            time: "40s ago",
            replies: 0
        },
        {
            user: "@lararodriguez.mp3",
            avatar: "https://i.pravatar.cc/150?u=5",
            text: "this is sooooo good love it",
            likes: "450",
            time: "4 min ago",
            replies: 1
        },
        {
            user: "@Jayden_mlbb",
            avatar: "https://i.pravatar.cc/150?u=6",
            text: "Love it. 😭 😭 🩷",
            likes: "12",
            time: "9 min ago",
            replies: 0
        }
    ];

    const aiTopics = [
        { title: "Fans anticipate the release", comment: "TEAM HERE BEFORE RELEASE 👇" },
        { title: "Viewers praise artistic depth", comment: "i love how they used their lower register for this song. its completes the melancholy, cinematic..." },
        { title: "Viewers admire her attire", comment: "The visual contrast of the bright yellow dress against the dark, gritty, raining background is a..." },
        { title: "Fans praise her artistry", comment: "Deep vocals, powerful belts, insane lyrics," }
    ];

    return (
        <div className="flex flex-col h-full bg-[#0f0f0f] rounded-t-2xl text-white">
            <div className="p-4 border-b border-zinc-800 flex justify-between items-center shrink-0">
                <h2 className="text-lg font-bold">Comments <span className="font-normal text-zinc-400 text-sm ml-2">{formatNumber(commentsCount)}</span></h2>
                <div className="flex gap-4 items-center">
                    <button className="p-1"><DotsHorizontalIcon className="w-5 h-5 text-white" /></button>
                    <button onClick={onClose} className="text-white"><CancelIcon className="w-6 h-6" /></button>
                </div>
            </div>
            
            <div className="overflow-y-auto flex-grow pb-10">
                <div className="px-4 py-3 flex gap-2 overflow-x-auto hide-scrollbar border-b border-zinc-800">
                    <button className="bg-white text-black px-4 py-1.5 rounded-lg text-sm font-semibold shrink-0">Top</button>
                    <button className="bg-zinc-800 text-white px-4 py-1.5 rounded-lg text-sm font-semibold shrink-0 flex items-center gap-1">
                        ✨ Topics
                    </button>
                    <button className="bg-zinc-800 text-white px-4 py-1.5 rounded-lg text-sm font-semibold shrink-0">Timed</button>
                    <button className="bg-zinc-800 text-white px-4 py-1.5 rounded-lg text-sm font-semibold shrink-0">Newest</button>
                </div>

                <div className="p-4 border-b border-zinc-800 bg-zinc-900/50">
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <h3 className="font-semibold text-sm">Summarized by AI</h3>
                            <p className="text-xs text-zinc-400">Quality and accuracy may vary ⓘ</p>
                        </div>
                        <DotsHorizontalIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="space-y-2">
                        {aiTopics.map((topic, i) => (
                            <div key={i} className="bg-zinc-800 rounded-lg p-3 flex justify-between items-center">
                                <div>
                                    <h4 className="font-bold text-sm text-white mb-1">{topic.title}</h4>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-pink-500 shrink-0"></div>
                                        <p className="text-xs text-zinc-400 truncate w-64">{topic.comment}</p>
                                    </div>
                                </div>
                                <span className="text-zinc-500 font-bold">&rsaquo;</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-4 space-y-6">
                    {comments.map((comment, i) => (
                        <div key={i} className="flex gap-3">
                            <img src={comment.avatar} alt="user" className="w-8 h-8 rounded-full object-cover mt-1 shrink-0 bg-zinc-800" />
                            <div className="flex-grow">
                                <p className="text-xs text-zinc-400 mb-1">
                                    {comment.user} {comment.verified && <span className="bg-zinc-400 text-black text-[8px] font-bold px-1 rounded-full ml-1">✓</span>} • {comment.time}
                                </p>
                                <p className="text-sm mb-2">{comment.text}</p>
                                <div className="flex items-center gap-4 text-xs">
                                    <button className="flex items-center gap-1">
                                        <ThumbUpIcon className="w-4 h-4" /> {comment.likes}
                                    </button>
                                    <button>
                                        <ThumbDownIcon className="w-4 h-4" />
                                    </button>
                                    <button>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.38-.445 1.488-1.42 2.723-2.613 3.493a.75.75 0 00.414 1.347c2.193.181 4.31-.383 5.922-1.464a9.664 9.664 0 003.004.544z" />
                                        </svg>
                                    </button>
                                </div>
                                {comment.replies > 0 && (
                                    <button className="text-blue-400 font-bold text-sm mt-2 flex items-center gap-1">
                                        {comment.replies} replies <span className="text-xl leading-none">&rsaquo;</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="p-3 border-t border-zinc-800 shrink-0 bg-[#0f0f0f]">
                <div className="flex items-center gap-3">
                    <img src="https://i.pravatar.cc/150?u=player" alt="you" className="w-8 h-8 rounded-full bg-zinc-800" />
                    <input type="text" placeholder="Add a comment..." className="bg-zinc-800 text-white text-sm rounded-full px-4 py-2 flex-grow focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
            </div>
        </div>
    );
};

const YouTubeVideoDetailView: React.FC = () => {
    const { gameState, dispatch, activeArtist, activeArtistData } = useGame();
    const { selectedVideoId, date } = gameState;
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [isCommentsExpanded, setIsCommentsExpanded] = useState(false);

    if (!activeArtist || !activeArtistData) return null;
    const { videos, youtubeSubscribers } = activeArtistData;

    const video = videos.find(v => v.id === selectedVideoId);

    const channelData = useMemo(() => {
        const isLabelVideo = video && video.channelId !== activeArtist.id;
        if (isLabelVideo) {
            const label = LABELS.find(l => l.id === video.channelId);
            if (label && label.youtubeChannel) {
                return {
                    name: label.youtubeChannel.name,
                    avatar: label.logo,
                    subscribers: label.youtubeChannel.subscribers,
                };
            }
        }
        // Fallback to personal channel
        return {
            name: activeArtist.name,
            avatar: activeArtist.image,
            subscribers: youtubeSubscribers,
        };
    }, [video, activeArtist, youtubeSubscribers]);


    const handleBack = () => {
        dispatch({ type: 'SELECT_VIDEO', payload: null });
        dispatch({ type: 'CHANGE_VIEW', payload: 'youtube' });
    };

    if (!video) {
        return (
            <div className="bg-[#0f0f0f] text-white h-full overflow-y-auto p-4">
                <p>Video not found.</p>
                <button onClick={handleBack} className="mt-4 text-red-500">Back to YouTube</button>
            </div>
        );
    }

    const likes = Math.floor(video.views * 0.01);
    const timeAgo = (releaseDate: { week: number, year: number }, currentDate: { week: number, year: number }): string => {
        const weeksAgo = (currentDate.year * 52 + currentDate.week) - (releaseDate.year * 52 + releaseDate.week);
    
        if (weeksAgo <= 0) return 'Just now';
        if (weeksAgo === 1) return `1w ago`;
        if (weeksAgo < 4) return `${weeksAgo}w ago`;
    
        if (weeksAgo < 52) {
            const monthsAgo = Math.floor(weeksAgo / 4);
            return `${monthsAgo}mo ago`;
        }
    
        const yearsAgo = Math.floor(weeksAgo / 52);
        if (yearsAgo === 1) return `1 year ago`;
        return `${yearsAgo} years ago`;
    };

    return (
        <div className="bg-[#0f0f0f] text-white h-full overflow-y-auto">
            <div className="w-full aspect-video bg-black flex items-center justify-center relative">
                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-contain"/>
                 <button onClick={handleBack} className="absolute top-4 left-4 z-20 p-2 bg-black/50 rounded-full">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
            </div>

            <main className="p-3 space-y-4">
                <h1 className="text-xl font-semibold leading-tight">{video.title}</h1>

                <div className="flex items-center gap-4 text-sm text-zinc-400">
                    <span>{formatNumber(video.views)} views</span>
                    <span>{timeAgo(video.releaseDate, date)}</span>
                    <button onClick={() => setIsDescriptionExpanded(true)} className="font-semibold text-white">...more</button>
                </div>

                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <img src={channelData.avatar} alt={channelData.name} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                            <p className="font-semibold">{channelData.name}</p>
                            <p className="text-xs text-zinc-400">{formatNumber(channelData.subscribers)} subscribers</p>
                        </div>
                    </div>
                    <button className="bg-white text-black font-semibold py-2 px-4 rounded-full text-sm hover:bg-zinc-200 transition-colors">Subscribe</button>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2">
                    <div className="flex items-center bg-zinc-800 rounded-full flex-shrink-0">
                        <button className="flex items-center gap-2 p-2 px-4 hover:bg-zinc-700 rounded-l-full">
                            <ThumbUpIcon className="w-5 h-5"/>
                            <span className="text-sm font-semibold">{formatNumber(likes)}</span>
                        </button>
                        <div className="w-px h-6 bg-zinc-600"></div>
                        <button className="p-2 px-4 hover:bg-zinc-700 rounded-r-full">
                            <ThumbDownIcon className="w-5 h-5"/>
                        </button>
                    </div>
                    <ActionButton icon={<ShareIcon className="w-5 h-5"/>} label="Share" />
                    <ActionButton icon={<DownloadIconSimple className="w-5 h-5"/>} label="Download" />
                    <ActionButton icon={<SaveIcon className="w-5 h-5"/>} label="Save" />
                </div>

                <div className="bg-zinc-800 rounded-lg p-3 cursor-pointer" onClick={() => setIsCommentsExpanded(true)}>
                    <div className="flex justify-between items-center">
                        <h2 className="font-bold">Comments <span className="text-zinc-400 font-normal">{formatNumber(Math.floor((video.views) * 0.005))}</span></h2>
                        <DotsHorizontalIcon className="w-5 h-5 text-zinc-400" />
                    </div>
                    <div className="flex items-center gap-3 mt-3 overflow-hidden">
                        <img src="https://i.pravatar.cc/150?u=2" alt="user" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                        <p className="text-sm truncate">A music video? Nah, a short film full of art, emotion, expression, symbolism and music. This is great</p>
                    </div>
                </div>
            </main>

            <div className={`fixed inset-0 bg-black/80 z-40 transition-opacity duration-300 ${isDescriptionExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsDescriptionExpanded(false)}>
                <div 
                    className={`absolute bottom-0 left-0 right-0 bg-[#181818] rounded-t-2xl max-h-[85vh] transition-transform duration-300 ease-in-out ${isDescriptionExpanded ? 'translate-y-0' : 'translate-y-full'}`}
                    onClick={e => e.stopPropagation()}
                >
                    {isDescriptionExpanded && <DescriptionOverlay video={video} onClose={() => setIsDescriptionExpanded(false)} />}
                </div>
            </div>

            <div className={`fixed inset-0 bg-black/80 z-40 transition-opacity duration-300 ${isCommentsExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsCommentsExpanded(false)}>
                <div 
                    className={`absolute bottom-0 left-0 right-0 bg-[#0f0f0f] rounded-t-2xl h-[85vh] transition-transform duration-300 ease-in-out ${isCommentsExpanded ? 'translate-y-0' : 'translate-y-full'}`}
                    onClick={e => e.stopPropagation()}
                >
                    {isCommentsExpanded && <CommentsOverlay video={video} likes={likes} onClose={() => setIsCommentsExpanded(false)} />}
                </div>
            </div>
        </div>
    );
};

export default YouTubeVideoDetailView;
