import React, { useState, useMemo, useRef } from 'react';
import { useGame, formatNumber } from '../context/GameContext';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import PlusIcon from './icons/PlusIcon';
import UserIcon from './icons/UserIcon';
import HeartIcon from './icons/HeartIcon';
import CommentIcon from './icons/CommentIcon';
import HomeIcon from './icons/HomeIcon';
import { InstagramPost, InstagramReel, InstagramStory } from '../types';
import { NPC_ARTIST_NAMES, getArtistImage } from '../constants';

const VerifiedBadge = () => (
    <svg aria-label="Verified" className="ml-1" fill="#0095F6" height="12" viewBox="0 0 40 40" width="12"><title>Verified</title><path d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.358 40l3.232-5.6h6.162v-6.01L40 25.359 36.905 20 40 14.641l-5.248-3.03v-6.46h-6.419L25.358 0l-5.36 3.094Zm7.415 11.225 2.254 2.287-11.43 11.5-6.835-6.93 2.244-2.258 4.587 4.581 9.18-9.18Z" fillRule="evenodd"></path></svg>
);

const InstagramFeedPost: React.FC<{ post: InstagramPost, username: string, userAvatar: string, isVerified: boolean, onDelete?: () => void }> = ({ post, username, userAvatar, isVerified, onDelete }) => {
    const [showOptions, setShowOptions] = useState(false);
    

    return (
        <div className="w-full bg-black text-white mb-6 relative">
            <div className="flex items-center justify-between px-3 py-2">
                <div className="flex items-center gap-2">
                    <img src={userAvatar} className="w-8 h-8 rounded-full object-cover border border-zinc-800" />
                    <span className="font-semibold text-[13px] flex items-center">{username} {isVerified && <VerifiedBadge />}</span>
                </div>
                <div className="flex gap-1 cursor-pointer p-2" onClick={() => setShowOptions(!showOptions)}>
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                </div>
            </div>
            {showOptions && onDelete && (
                <div className="absolute top-12 right-4 bg-zinc-800 rounded-lg shadow-lg overflow-hidden z-10 w-32 border border-zinc-700">
                    <button onClick={() => { onDelete(); setShowOptions(false); }} className="w-full text-left px-4 py-3 text-red-500 font-semibold text-sm hover:bg-zinc-700">Delete Post</button>
                </div>
            )}

            <div className="w-full aspect-square bg-zinc-900 border-y border-zinc-900 overflow-x-auto snap-x snap-mandatory flex hide-scrollbar">
                {(post.imageUrls && post.imageUrls.length > 0 ? post.imageUrls : [post.imageUrl || '']).map((url, i) => (
                    <img key={i} src={url} className="w-full h-full object-cover shrink-0 snap-center" />
                ))}
            </div>

            <div className="px-3 pt-3 pb-1 flex justify-between">
                <div className="flex gap-4 items-center">
                    <HeartIcon className="w-6 h-6 hover:text-zinc-400 cursor-pointer text-white" />
                    <CommentIcon className="w-6 h-6 hover:text-zinc-400 cursor-pointer text-white" />
                    <svg aria-label="Share Post" fill="currentColor" height="24" viewBox="0 0 24 24" width="24" className="hover:text-zinc-400 cursor-pointer"><line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083"></line><polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></polygon></svg>
                </div>
                <svg aria-label="Save" fill="currentColor" height="24" viewBox="0 0 24 24" width="24" className="hover:text-zinc-400 cursor-pointer"><polygon fill="none" points="20 21 12 13.44 4 21 4 3 20 3 20 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon></svg>
            </div>

            <div className="px-3 pb-1">
                <span className="font-semibold text-[13px]">{formatNumber(post.likes)} likes</span>
            </div>

            <div className="px-3 pb-2 text-[13px]">
                <span className="font-semibold mr-2">{username} {isVerified && <VerifiedBadge />}</span>
                <span>{post.caption}</span>
            </div>

            <div className="px-3 pb-2 text-[13px] text-zinc-400">
                View all {formatNumber(post.comments)} comments
            </div>
        </div>
    );
};

const InstagramReelPost: React.FC<{ reel: InstagramReel, username: string, userAvatar: string, isVerified: boolean, onDelete?: () => void }> = ({ reel, username, userAvatar, isVerified, onDelete }) => {
    const [showOptions, setShowOptions] = useState(false);
    return (
        <div className="w-full h-full bg-black text-white relative">
            <img src={reel.videoUrl} className="w-full h-full object-cover opacity-80" />
            <div className="absolute top-4 right-4 z-20">
                <div className="flex gap-1 cursor-pointer p-2 drop-shadow-md" onClick={() => setShowOptions(!showOptions)}>
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
                {showOptions && onDelete && (
                    <div className="absolute top-8 right-0 bg-zinc-800 rounded-lg shadow-lg overflow-hidden z-30 w-32 border border-zinc-700">
                        <button onClick={() => { onDelete(); setShowOptions(false); }} className="w-full text-left px-4 py-3 text-red-500 font-semibold text-sm hover:bg-zinc-700">Delete Reel</button>
                    </div>
                )}
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center gap-2 mb-2">
                    <img src={userAvatar} className="w-8 h-8 rounded-full border border-zinc-800" />
                    <span className="font-semibold text-[13px] flex items-center">{username} {isVerified && <VerifiedBadge />}</span>
                    <button className="border border-white text-xs px-2 py-0.5 rounded-md font-semibold ml-2">Follow</button>
                </div>
                <p className="text-sm line-clamp-2">{reel.caption}</p>
            </div>
            <div className="absolute right-4 bottom-12 flex flex-col items-center gap-4">
                <div className="flex flex-col items-center">
                    <HeartIcon className="w-7 h-7 text-white" />
                    <span className="text-xs font-semibold mt-1">{formatNumber(reel.likes)}</span>
                </div>
                <div className="flex flex-col items-center">
                    <CommentIcon className="w-7 h-7 text-white" />
                    <span className="text-xs font-semibold mt-1">{formatNumber(reel.comments)}</span>
                </div>
                <svg aria-label="Share Post" fill="currentColor" height="24" viewBox="0 0 24 24" width="24" className="text-white"><line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083"></line><polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></polygon></svg>
            </div>
        </div>
    );
};

const InstagramView: React.FC = () => {
    const { activeArtist, activeArtistData, dispatch } = useGame();
    const [currentTab, setCurrentTab] = useState<'home' | 'profile' | 'create' | 'reels' | 'discover' | 'followers' | 'following'>('profile');
    const [profileTab, setProfileTab] = useState<'grid' | 'reels'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    
    // Create state
    const [createType, setCreateType] = useState<'post' | 'story' | 'reel'>('post');
    const [createCaption, setCreateCaption] = useState('');
    const [createImageUrls, setCreateImageUrls] = useState<string[]>([]);

    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editBio, setEditBio] = useState('');
    const [editLink, setEditLink] = useState('');

    const [isCreatingCommunity, setIsCreatingCommunity] = useState(false);
    const [communityName, setCommunityName] = useState('');
    const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(null);
    const [selectedReel, setSelectedReel] = useState<InstagramReel | null>(null);

    const handleCreatePost = () => {
        if (createImageUrls.length === 0) return;
        
        if (createType === 'post') {
            dispatch({ type: 'CREATE_INSTAGRAM_POST', payload: { caption: createCaption, imageUrls: createImageUrls } });
        } else if (createType === 'story') {
            dispatch({ type: 'CREATE_INSTAGRAM_STORY', payload: { imageUrl: createImageUrls[0] } });
        } else if (createType === 'reel') {
            dispatch({ type: 'CREATE_INSTAGRAM_REEL', payload: { caption: createCaption, videoUrl: createImageUrls[0] } });
        }
        
        setCreateCaption('');
        setCreateImageUrls([]);
        setCurrentTab('profile');
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCreateImageUrls([...createImageUrls, reader.result as string]);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = () => {
        dispatch({ type: 'EDIT_INSTAGRAM_PROFILE', payload: { bio: editBio, link: editLink } });
        setIsEditingProfile(false);
    };

    const handleCreateCommunity = () => {
        if (!communityName.trim()) return;
        dispatch({ type: 'CREATE_INSTAGRAM_COMMUNITY', payload: { name: communityName } });
        setIsCreatingCommunity(false);
    };

    if (!activeArtist || !activeArtistData) return null;

    const myPosts = activeArtistData.instagramPosts || [];
    const myReels = activeArtistData.instagramReels || [];
    const myStories = activeArtistData.instagramStories || [];
    const username = activeArtist.name.replace(/\s/g, '').toLowerCase();
    if (selectedPost) {

        return (
            <div className="h-full w-full bg-black relative max-w-[400px] mx-auto overflow-y-auto overflow-x-hidden">
                <div className="flex items-center gap-4 p-4 border-b border-zinc-800 sticky top-0 bg-black z-20">
                    <button onClick={() => setSelectedPost(null)} className="text-white">
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                    <span className="font-bold text-white">Post</span>
                </div>
                <div className="pt-4">
                    <InstagramFeedPost 
                        post={selectedPost} 
                        username={username} 
                        userAvatar={activeArtist.image} 
                        isVerified={isVerified} 
                        onDelete={() => { dispatch({ type: 'DELETE_INSTAGRAM_POST', payload: { postId: selectedPost.id } }); setSelectedPost(null); }} 
                    />
                </div>
            </div>
        );
    }

    if (selectedReel) {
        return (
            <div className="h-full w-full bg-black relative max-w-[400px] mx-auto overflow-hidden">
                <button 
                    onClick={() => setSelectedReel(null)} 
                    className="absolute top-4 left-4 z-50 text-white drop-shadow-md bg-black/30 p-2 rounded-full"
                >
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <div className="w-full h-full bg-zinc-900 relative">
                    <img src={selectedReel.videoUrl} className="w-full h-full object-cover opacity-80" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                        <div className="flex justify-between items-end">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <img src={activeArtist.image} className="w-8 h-8 rounded-full border border-zinc-800" />
                                    <span className="text-white font-semibold text-sm">{username}</span>
                                </div>
                                <p className="text-white text-sm mb-2">{selectedReel.caption}</p>
                                {selectedReel.songId && (
                                    <div className="flex items-center gap-2 text-white text-xs">
                                        <svg aria-label="Audio" fill="currentColor" height="12" viewBox="0 0 24 24" width="12"><path d="M12 2v20M8 6v12M4 10v4M16 6v12M20 10v4" stroke="currentColor" strokeLinecap="round" strokeWidth="2"></path></svg>
                                        {activeArtistData.songs.find(s => s.id === selectedReel.songId)?.title}
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col items-center gap-4">
                                <div className="flex flex-col items-center">
                                    <HeartIcon className="w-7 h-7 text-white" />
                                    <span className="text-white text-xs mt-1">{formatNumber(selectedReel.likes)}</span>
                                </div>
                                <button onClick={() => { dispatch({ type: 'DELETE_INSTAGRAM_REEL', payload: { reelId: selectedReel.id } }); setSelectedReel(null); }} className="p-2 rounded-full bg-red-500/20 text-red-500 hover:bg-red-500/40">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    const followers = activeArtistData.instagramFollowers || 0;
    const popularity = activeArtistData.popularity || 0;
    const isVerified = followers >= 100000 || popularity >= 50 || !!activeArtistData.instagramVerified;

    return (
        <div className="h-full flex flex-col bg-black text-white relative font-sans max-w-[400px] border-x border-zinc-900 mx-auto overflow-hidden">
            {/* Top Bar for Profile/Create Tabs */}
            <div className="flex-shrink-0 flex justify-between items-center px-4 h-12 bg-black border-b border-zinc-900">
                <button onClick={() => dispatch({ type: 'CHANGE_VIEW', payload: 'game' })} className="text-white hover:text-zinc-300 transition-colors">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <div className="font-semibold text-base flex items-center gap-1">
                    {currentTab === 'profile' && <span className="flex items-center">{username} {isVerified && <VerifiedBadge />}</span>}
                    {currentTab === 'create' && <span>New post</span>}
                    {currentTab === 'home' && <span className="font-serif italic font-bold text-xl tracking-tight">Instagram</span>}
                    {currentTab === 'reels' && <span>Reels</span>}
                    {currentTab === 'discover' && <span>Explore Celebrities</span>}
                    {currentTab === 'followers' && <span>Followers</span>}
                    {currentTab === 'following' && <span>Following</span>}
                </div>
                <div className="w-6 h-6"></div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar bg-black">
                {currentTab === 'home' && (
                    <div className="w-full flex-col flex">
                        {myStories.length > 0 && (
                            <div className="flex gap-4 p-3 overflow-x-auto hide-scrollbar border-b border-zinc-900">
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 to-fuchsia-600">
                                        <div className="w-full h-full rounded-full border-2 border-black overflow-hidden">
                                            <img src={myStories[0].imageUrl} className="w-full h-full object-cover" />
                                        </div>
                                    </div>
                                    <span className="text-[11px] mt-1 truncate w-16 text-center">Your story</span>
                                </div>
                            </div>
                        )}
                        {myPosts.length > 0 ? (
                            myPosts.slice(0, 5).map(post => (
                                <InstagramFeedPost key={post.id} post={post} username={username} userAvatar={activeArtist.image} isVerified={isVerified} onDelete={() => dispatch({ type: 'DELETE_INSTAGRAM_POST', payload: { postId: post.id } })} />
                            ))
                        ) : (
                            <div className="flex-1 flex items-center justify-center pt-24 text-zinc-500">
                                <p>No posts to show.</p>
                            </div>
                        )}
                    </div>
                )}

                {currentTab === 'reels' && (
                    <div className="w-full h-full snap-y snap-mandatory overflow-y-auto hide-scrollbar">
                        {myReels.length > 0 ? (
                            myReels.map(reel => (
                                <div key={reel.id} className="w-full h-full snap-start">
                                    <InstagramReelPost reel={reel} username={username} userAvatar={activeArtist.image} isVerified={isVerified} />
                                </div>
                            ))
                        ) : (
                            <div className="flex-1 h-full flex items-center justify-center text-zinc-500">
                                <p>No reels yet.</p>
                            </div>
                        )}
                    </div>
                )}

                {currentTab === 'create' && (
                    <div className="p-4 w-full h-full flex flex-col pt-4">
                        <div className="flex gap-2 mb-6">
                            <button onClick={() => setCreateType('post')} className={`flex-1 py-1.5 text-sm font-semibold rounded-lg ${createType === 'post' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:bg-zinc-900'}`}>Post</button>
                            <button onClick={() => setCreateType('story')} className={`flex-1 py-1.5 text-sm font-semibold rounded-lg ${createType === 'story' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:bg-zinc-900'}`}>Story</button>
                            <button onClick={() => setCreateType('reel')} className={`flex-1 py-1.5 text-sm font-semibold rounded-lg ${createType === 'reel' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:bg-zinc-900'}`}>Reel</button>
                        </div>
                        <div className="mb-8">
                            <div className="flex gap-4">
                                <label className="flex-1 flex-col flex items-center justify-center p-8 border border-zinc-800 bg-zinc-900 rounded-sm cursor-pointer hover:bg-zinc-800/80 transition-all">
                                    <svg aria-label="Icon to represent media such as images or videos" fill="currentColor" height="32" viewBox="0 0 48 48" width="32" className="text-zinc-300 mb-4"><path clipRule="evenodd" d="M24 6C14.059 6 6 14.059 6 24s8.059 18 18 18 18-8.059 18-18S33.941 6 24 6Zm-1.892 34.908c-1.425-.138-2.79-.475-4.08-.985V24.5a3.992 3.992 0 0 1-2.909-3.83A3.995 3.995 0 0 1 20 16.522 3.996 3.996 0 0 1 24.184 17a3.995 3.995 0 0 1 3.513 3.652 3.991 3.991 0 0 1-2.697 4.018v15.253a15.932 15.932 0 0 0-2.892.985ZM12.756 36.31A15.96 15.96 0 0 1 8.04 24c0-8.822 7.178-16 16-16s16 7.178 16 16a15.961 15.961 0 0 1-4.716 12.31A15.82 15.82 0 0 0 24.5 26.5v-1.127a5.98 5.98 0 0 0 3.235-5.26 5.993 5.993 0 0 0-5.836-6.096A5.994 5.994 0 0 0 16 20.113a5.98 5.98 0 0 0 3.2 5.26v1.127a15.82 15.82 0 0 0-6.444 9.81Z" fillRule="evenodd"></path></svg>
                                    <span className="text-white text-sm font-semibold">{createImageUrls.length > 0 ? (createType === 'post' ? 'Add Another Image' : 'Change Media') : 'Select from computer'}</span>
                                    <input 
                                        type="file"
                                        accept={createType === 'reel' ? 'video/*' : 'image/*'}
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </label>
                                <button onClick={() => {
                                    if (createType === 'post') {
                                        setCreateImageUrls([...createImageUrls, activeArtist.image]);
                                    } else {
                                        setCreateImageUrls([activeArtist.image]);
                                    }
                                }} className="flex-1 flex flex-col items-center justify-center p-8 border border-zinc-800 bg-zinc-900 rounded-sm cursor-pointer hover:bg-zinc-800/80 transition-all">
                                    <UserIcon className="w-8 h-8 text-zinc-300 mb-4" />
                                    <span className="text-white text-sm font-semibold text-center">Use profile<br />picture</span>
                                </button>
                            </div>
                            {createImageUrls.length > 0 && (
                                <div className="mt-4 flex gap-2 overflow-x-auto hide-scrollbar snap-x">
                                    {createImageUrls.map((url, i) => (
                                        <div key={i} className="relative shrink-0 snap-center">
                                            <img src={url} className="w-32 aspect-square object-cover rounded-sm border border-zinc-800" alt="Preview" />
                                            {createType === 'post' && (
                                                <button onClick={() => setCreateImageUrls(createImageUrls.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-black/50 rounded-full p-1"><PlusIcon className="w-4 h-4 rotate-45 text-white" /></button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {createType !== 'story' && (
                            <div className="mb-6 flex-1">
                                <textarea 
                                    value={createCaption}
                                    onChange={(e) => setCreateCaption(e.target.value)}
                                    placeholder="Write a caption..."
                                    className="w-full h-24 bg-transparent border-b border-zinc-800 text-white resize-none outline-none focus:border-zinc-500 mb-6 text-sm py-2"
                                />
                            </div>
                        )}
                        
                        <button 
                            onClick={handleCreatePost}
                            disabled={createImageUrls.length === 0}
                            className="w-full bg-[#0095F6] text-white disabled:bg-[#005286] disabled:text-zinc-400 font-semibold py-2.5 rounded-lg hover:bg-[#1877F2] transition-colors"
                        >
                            Share {createType}
                        </button>
                    </div>
                )}

                {currentTab === 'profile' && !isEditingProfile && (
                    <div className="w-full">
                        {/* Profile Info */}
                        <div className="px-4 py-4">
                            <div className="flex items-center justify-between mb-4">
                                <div className="relative">
                                    <img src={activeArtist.image} className="w-20 h-20 rounded-full object-cover p-1 border-2 border-zinc-700" />
                                    {myStories.length > 0 && <div className="absolute inset-0 rounded-full border-2 border-pink-500 scale-105 pointer-events-none" />}
                                </div>
                                <div className="flex-1 flex justify-around pl-4">
                                    <div className="flex flex-col items-center">
                                        <span className="font-bold text-base">{formatNumber(myPosts.length)}</span>
                                        <span className="text-[13px] text-zinc-300">posts</span>
                                    </div>
                                    <div onClick={() => setCurrentTab('followers')} className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity">
                                        <span className="font-bold text-base">{formatNumber(activeArtistData.instagramFollowers || 0)}</span>
                                        <span className="text-[13px] text-zinc-300">followers</span>
                                    </div>
                                    <div onClick={() => setCurrentTab('following')} className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity">
                                        <span className="font-bold text-base">{formatNumber((activeArtistData.instagramFollowing || []).length)}</span>
                                        <span className="text-[13px] text-zinc-300">following</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mb-4 text-[13px]">
                                <h2 className="font-semibold">{activeArtist.name}</h2>
                                <p className="text-zinc-300">Musician/band</p>
                                <p className="whitespace-pre-wrap mt-0.5">{activeArtistData.instagramBio || 'Official Instagram account.'}</p>
                                {activeArtistData.instagramLink && (
                                    <a href="#" className="flex items-center gap-1 text-[#E0F1FF] mt-1 font-semibold">
                                        <svg aria-label="Link icon" fill="currentColor" height="12" viewBox="0 0 24 24" width="12"><path d="M9.736 15.656a4.873 4.873 0 0 0 6.945.045l4.58-4.58a4.873 4.873 0 1 0-6.892-6.891L12.592 6.01a1 1 0 0 0 1.414 1.414l1.777-1.78a2.873 2.873 0 1 1 4.064 4.063l-4.58 4.58a2.872 2.872 0 0 1-4.062-.058 1 1 0 1 0-1.469 1.427Z"></path><path d="M14.264 8.344a4.873 4.873 0 0 0-6.945-.045l-4.58 4.58a4.873 4.873 0 1 0 6.892 6.891l1.777-1.78a1 1 0 1 0-1.414-1.414l-1.777 1.78a2.873 2.873 0 1 1-4.064-4.063l4.58-4.58a2.872 2.872 0 0 1 4.062.058 1 1 0 1 0 1.469-1.427Z"></path></svg>
                                        {activeArtistData.instagramLink}
                                    </a>
                                )}
                            </div>

                            {activeArtistData.instagramCommunityName ? (
                                <div className="mb-4 bg-zinc-900 rounded-lg p-2 flex items-center gap-2 cursor-pointer hover:bg-zinc-800">
                                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">💬</div>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-sm">{activeArtistData.instagramCommunityName}</span>
                                        <span className="text-xs text-zinc-400">{formatNumber(activeArtistData.instagramCommunityMembers || 0)} members</span>
                                    </div>
                                </div>
                            ) : (
                                <button onClick={() => setIsCreatingCommunity(true)} className="w-full mb-4 bg-zinc-900 py-2 rounded-lg text-sm font-semibold text-white hover:bg-zinc-800 text-center flex items-center justify-center gap-2">
                                    <PlusIcon className="w-4 h-4" /> Start a Broadcast Channel
                                </button>
                            )}

                            <div className="flex gap-2 mb-4">
                                <button onClick={() => {
                                    setEditBio(activeArtistData.instagramBio || '');
                                    setEditLink(activeArtistData.instagramLink || '');
                                    setIsEditingProfile(true);
                                }} className="flex-1 bg-zinc-800 py-1.5 rounded-lg text-sm font-semibold text-white hover:bg-zinc-700">Edit profile</button>
                                <button className="flex-1 bg-zinc-800 py-1.5 rounded-lg text-sm font-semibold text-white hover:bg-zinc-700">Share profile</button>
                            </div>
                        </div>

                        {/* Grid/Feed Tabs */}
                        <div className="flex border-t border-zinc-900 border-b border-black">
                            <button onClick={() => setProfileTab('grid')} className={`flex-1 py-2 flex justify-center border-b-[1px] ${profileTab === 'grid' ? 'border-white text-white' : 'border-transparent text-zinc-500'}`}>
                                <svg aria-label="Posts" fill="currentColor" height="24" viewBox="0 0 24 24" width="24"><rect fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" width="18" x="3" y="3"></rect><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="9.015" x2="9.015" y1="3" y2="21"></line><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="14.985" x2="14.985" y1="3" y2="21"></line><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="21" x2="3" y1="9.015" y2="9.015"></line><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="21" x2="3" y1="14.985" y2="14.985"></line></svg>
                            </button>
                            <button onClick={() => setProfileTab('reels')} className={`flex-1 py-2 flex justify-center border-b-[1px] ${profileTab === 'reels' ? 'border-white text-white' : 'border-transparent text-zinc-500'}`}>
                                <svg aria-label="Reels" fill="currentColor" height="24" viewBox="0 0 24 24" width="24"><line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="2.049" x2="21.95" y1="7.002" y2="7.002"></line><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="9.725" x2="13.764" y1="17.018" y2="17.018"></line><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="11.744" x2="11.744" y1="15" y2="19.036"></line><rect fill="none" height="20" rx="3.003" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" width="20" x="2" y="2"></rect></svg>
                            </button>
                        </div>

                        {/* Image Grid */}
                        {profileTab === 'grid' && (
                            <div className="grid grid-cols-3 gap-[1px]">
                                {myPosts.map(post => (
                                    <div key={post.id} className="aspect-square bg-zinc-900 relative cursor-pointer group" onClick={() => setSelectedPost(post)}>
                                        <img src={post.imageUrls?.[0] || post.imageUrl} className="w-full h-full object-cover" />
                                        {post.imageUrls && post.imageUrls.length > 1 && (
                                            <div className="absolute top-2 right-2 text-white">
                                                <svg aria-label="Carousel" fill="currentColor" height="22" viewBox="0 0 48 48" width="22"><path d="M34.8 29.7V11c0-2.9-2.3-5.2-5.2-5.2H11c-2.9 0-5.2 2.3-5.2 5.2v18.7c0 2.9 2.3 5.2 5.2 5.2h18.7c2.8-.1 5.1-2.4 5.1-5.2zM39.2 15v16.1c0 4.5-3.7 8.2-8.2 8.2H14.9c-.6 0-1.1.5-1.1 1.1 0 .6.5 1.1 1.1 1.1h16.1c5.8 0 10.5-4.7 10.5-10.5V15c0-.6-.5-1.1-1.1-1.1-.6 0-1.2.5-1.2 1.1z"></path></svg>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-500 font-bold transition-opacity" onClick={(e) => { e.stopPropagation(); dispatch({ type: 'DELETE_INSTAGRAM_POST', payload: { postId: post.id } }); }}>
                                            DELETE
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {profileTab === 'reels' && (
                            <div className="grid grid-cols-3 gap-[1px]">
                                {myReels.map(reel => (
                                    <div key={reel.id} className="aspect-[9/16] bg-zinc-900 relative cursor-pointer group" onClick={() => setSelectedReel(reel)}>
                                        <img src={reel.videoUrl} className="w-full h-full object-cover" />
                                        <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white font-semibold text-xs">
                                            <svg aria-label="Play" fill="currentColor" height="12" viewBox="0 0 24 24" width="12"><path d="M16.394 12.001 8.542 16.59V7.41l7.852 4.591ZM21.996 12A10.005 10.005 0 1 1 12 1.996 10.016 10.016 0 0 1 21.996 12Z"></path></svg>
                                            {formatNumber(reel.views)}
                                        </div>
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-500 font-bold transition-opacity" onClick={(e) => { e.stopPropagation(); dispatch({ type: 'DELETE_INSTAGRAM_REEL', payload: { reelId: reel.id } }); }}>
                                            DELETE
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {profileTab === 'grid' && myPosts.length === 0 && (
                            <div className="mt-12 flex flex-col items-center text-center px-8 text-zinc-500 pb-20">
                                <p className="font-bold text-lg mb-1">No posts yet</p>
                            </div>
                        )}
                        {profileTab === 'reels' && myReels.length === 0 && (
                            <div className="mt-12 flex flex-col items-center text-center px-8 text-zinc-500 pb-20">
                                <p className="font-bold text-lg mb-1">No reels yet</p>
                            </div>
                        )}
                    </div>
                )}

                {isEditingProfile && (
                    <div className="p-4 w-full h-full flex flex-col bg-zinc-950">
                        <h2 className="text-xl font-bold mb-6">Edit Profile</h2>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-zinc-400 mb-1">Bio</label>
                            <textarea 
                                value={editBio} 
                                onChange={(e) => setEditBio(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-white h-24 resize-none"
                            />
                        </div>
                        
                        <div className="mb-8">
                            <label className="block text-sm font-semibold text-zinc-400 mb-1">Link</label>
                            <input 
                                type="text"
                                value={editLink} 
                                onChange={(e) => setEditLink(e.target.value)}
                                placeholder="e.g. yourwebsite.com"
                                className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-white"
                            />
                        </div>
                        
                        <div className="flex gap-4">
                            <button onClick={() => setIsEditingProfile(false)} className="flex-1 py-2 font-semibold text-white bg-zinc-800 rounded-lg">Cancel</button>
                            <button onClick={handleSaveProfile} className="flex-1 py-2 font-semibold text-white bg-[#0095F6] rounded-lg">Done</button>
                        </div>
                    </div>
                )}

                {isCreatingCommunity && (
                    <div className="p-4 w-full h-full flex flex-col bg-zinc-950">
                        <h2 className="text-xl font-bold mb-2">Create Broadcast Channel</h2>
                        <p className="text-sm text-zinc-400 mb-6">Anyone can join this channel to receive updates.</p>
                        
                        <div className="mb-8">
                            <label className="block text-sm font-semibold text-zinc-400 mb-1">Channel Name</label>
                            <input 
                                type="text"
                                value={communityName} 
                                onChange={(e) => setCommunityName(e.target.value)}
                                placeholder="e.g. 🍒 CHXRRYBOMBS 🍒"
                                className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-white"
                            />
                        </div>
                        
                        <div className="flex gap-4">
                            <button onClick={() => setIsCreatingCommunity(false)} className="flex-1 py-2 font-semibold text-white bg-zinc-800 rounded-lg">Cancel</button>
                            <button onClick={handleCreateCommunity} disabled={!communityName.trim()} className="flex-1 py-2 font-semibold text-white bg-[#0095F6] rounded-lg disabled:opacity-50">Create</button>
                        </div>
                    </div>
                )}

                {(currentTab === 'discover' || currentTab === 'followers' || currentTab === 'following') && (
                    <div className="p-4 w-full h-full flex flex-col bg-black">
                        {/* Subtabs for navigation */}
                        <div className="flex border-b border-zinc-800 mb-3 text-xs sm:text-sm font-semibold">
                            <button
                                onClick={() => setCurrentTab('discover')}
                                className={`flex-1 py-2 text-center border-b-2 ${currentTab === 'discover' ? 'border-white text-white' : 'border-transparent text-zinc-500'}`}
                            >
                                Celebrities
                            </button>
                            <button
                                onClick={() => setCurrentTab('followers')}
                                className={`flex-1 py-2 text-center border-b-2 ${currentTab === 'followers' ? 'border-white text-white' : 'border-transparent text-zinc-500'}`}
                            >
                                Followers ({ formatNumber(activeArtistData.instagramFollowers || 0) })
                            </button>
                            <button
                                onClick={() => setCurrentTab('following')}
                                className={`flex-1 py-2 text-center border-b-2 ${currentTab === 'following' ? 'border-white text-white' : 'border-transparent text-zinc-500'}`}
                            >
                                Following ({ formatNumber((activeArtistData.instagramFollowing || []).length) })
                            </button>
                        </div>

                        {/* Search Input */}
                        <div className="mb-3 relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search celebrities..."
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                            />
                        </div>

                        {currentTab === 'followers' && (
                            <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-2.5 mb-2 text-xs text-zinc-300 flex items-center justify-between shrink-0">
                                <span><strong className="text-white">{formatNumber(activeArtistData.instagramFollowers || 0)}</strong> Total Followers</span>
                                <span className="text-zinc-400 text-[11px]">{(activeArtistData.instagramNpcFollowers || []).length} Verified Stars</span>
                            </div>
                        )}

                        {/* Celebrity list */}
                        <div className="flex-1 overflow-y-auto space-y-2 pr-1 hide-scrollbar">
                            {(() => {
                                const npcFollowersList = activeArtistData.instagramNpcFollowers || [];
                                const userFollowingList = activeArtistData.instagramFollowing || [];
                                
                                let targetList: string[] = [];
                                if (currentTab === 'followers') {
                                    targetList = npcFollowersList;
                                } else if (currentTab === 'following') {
                                    targetList = userFollowingList;
                                } else {
                                    targetList = NPC_ARTIST_NAMES;
                                }

                                if (searchQuery.trim()) {
                                    targetList = targetList.filter(name => name.toLowerCase().includes(searchQuery.toLowerCase()));
                                }

                                if (targetList.length === 0) {
                                    return (
                                        <div className="text-center py-10 text-zinc-500 text-xs sm:text-sm px-4">
                                            {currentTab === 'followers'
                                                ? `You have ${formatNumber(activeArtistData.instagramFollowers || 0)} total followers (fans). No celebrities are following you yet — gain hype and popularity to attract star followers!`
                                                : currentTab === 'following'
                                                ? "You aren't following any celebrities yet."
                                                : "No artists found."}
                                        </div>
                                    );
                                }

                                return targetList.map((npcName) => {
                                    const isFollowedByNpc = npcFollowersList.includes(npcName);
                                    const isFollowingNpc = userFollowingList.includes(npcName);
                                    const img = getArtistImage(npcName);
                                    const handle = `@${npcName.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

                                    return (
                                        <div key={npcName} className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80">
                                            <div className="flex items-center gap-3">
                                                <img src={img} alt={npcName} className="w-10 h-10 rounded-full object-cover border border-zinc-700" />
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-xs sm:text-sm text-white flex items-center gap-0.5">
                                                        {npcName} <VerifiedBadge />
                                                    </span>
                                                    <div className="flex items-center gap-1.5 mt-0.5">
                                                        <span className="text-[11px] text-zinc-400">{handle}</span>
                                                        {isFollowedByNpc && (
                                                            <span className="text-[9px] text-zinc-300 bg-zinc-800 px-1.5 py-0.5 rounded font-medium">Follows you</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {isFollowingNpc ? (
                                                <button
                                                    onClick={() => dispatch({ type: 'UNFOLLOW_INSTAGRAM_NPC', payload: { npcName } })}
                                                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs transition-colors shrink-0"
                                                >
                                                    Following
                                                </button>
                                            ) : isFollowedByNpc ? (
                                                <button
                                                    onClick={() => dispatch({ type: 'FOLLOW_INSTAGRAM_NPC', payload: { npcName } })}
                                                    className="px-3 py-1.5 rounded-lg bg-[#0095F6] hover:bg-blue-600 text-white font-bold text-xs transition-colors shadow-sm shrink-0"
                                                >
                                                    Follow Back
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => dispatch({ type: 'FOLLOW_INSTAGRAM_NPC', payload: { npcName } })}
                                                    className="px-3 py-1.5 rounded-lg bg-[#0095F6] hover:bg-blue-600 text-white font-bold text-xs transition-colors shrink-0"
                                                >
                                                    Follow
                                                </button>
                                            )}
                                        </div>
                                    );
                                });
                            })()}
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Nav */}
            <div className="flex-shrink-0 w-full bg-black border-t border-zinc-900 z-30 px-6 py-3 flex justify-between items-center text-white pb-6">
                <button onClick={() => setCurrentTab('home')} className={`hover:text-zinc-300 transition-colors ${currentTab === 'home' ? 'text-white' : 'text-zinc-400'}`}>
                    <HomeIcon className="w-7 h-7" />
                </button>
                <button onClick={() => setCurrentTab('discover')} className={`hover:text-zinc-300 transition-colors ${currentTab === 'discover' || currentTab === 'followers' || currentTab === 'following' ? 'text-white' : 'text-zinc-400'}`}>
                    <svg aria-label="Search" fill="currentColor" height="24" viewBox="0 0 24 24" width="24"><path d="M19 10.5A8.5 8.5 0 1 1 10.5 2a8.5 8.5 0 0 1 8.5 8.5Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="16.511" x2="22" y1="16.511" y2="22"></line></svg>                
                </button>
                <button onClick={() => setCurrentTab('create')} className={`hover:text-zinc-300 transition-colors ${currentTab === 'create' ? 'text-white' : 'text-zinc-400'}`}>
                    <PlusIcon className="w-7 h-7 border-[2.5px] border-current rounded-lg p-0.5" />
                </button>
                <button onClick={() => setCurrentTab('reels')} className={`hover:text-zinc-300 transition-colors ${currentTab === 'reels' ? 'text-white' : 'text-zinc-400'}`}>
                    <svg aria-label="Reels" fill="currentColor" height="24" viewBox="0 0 24 24" width="24"><line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="2.049" x2="21.95" y1="7.002" y2="7.002"></line><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="9.725" x2="13.764" y1="17.018" y2="17.018"></line><line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="11.744" x2="11.744" y1="15" y2="19.036"></line><rect fill="none" height="20" rx="3.003" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" width="20" x="2" y="2"></rect></svg>
                </button>
                <button onClick={() => setCurrentTab('profile')} className={`rounded-full border border-transparent overflow-hidden hover:border-zinc-300 transition-colors ${currentTab === 'profile' ? 'border-white' : ''}`}>
                    <img src={activeArtist.image} className="w-7 h-7 object-cover" />
                </button>
            </div>
            
             <style dangerouslySetInnerHTML={{__html: `
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}} />
        </div>
    );
};

export default InstagramView;
