

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useGame, formatNumber } from '../context/GameContext';
import type { Video } from '../types';
import { SUBSCRIBER_THRESHOLD_VERIFIED, VIEWS_THRESHOLD_VERIFIED, SUBSCRIBER_THRESHOLD_STORE, LABELS } from '../constants';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';
import DotsVerticalIcon from './icons/DotsVerticalIcon';
import GeniusIcon from './icons/GeniusIcon';
import CameraIcon from './icons/CameraIcon';
import HomeIcon from './icons/HomeIcon';
import UserGroupIcon from './icons/UserGroupIcon';
import YouTubeIcon from './icons/YouTubeIcon';

const formatTimeAgo = (releaseDate: { week: number, year: number }, currentDate: { week: number, year: number }): string => {
    const weeksAgo = (currentDate.year * 52 + currentDate.week) - (releaseDate.year * 52 + releaseDate.week);

    if (weeksAgo <= 0) return 'Just now';
    if (weeksAgo === 1) return `1 week ago`;
    if (weeksAgo < 4) return `${weeksAgo} weeks ago`;

    if (weeksAgo < 52) {
        const monthsAgo = Math.floor(weeksAgo / 4);
        if (monthsAgo === 1) return `1 month ago`;
        return `${monthsAgo} months ago`;
    }

    const yearsAgo = Math.floor(weeksAgo / 52);
    if (yearsAgo === 1) return `1 year ago`;
    return `${yearsAgo} years ago`;
};

const VideoItem: React.FC<{
    video: Video;
    channel?: { name: string; avatar: string };
}> = ({ video, channel }) => {
    const { gameState, dispatch } = useGame();
    const { date } = gameState;

    const handleVideoClick = () => {
        dispatch({ type: 'SELECT_VIDEO', payload: video.id });
        dispatch({ type: 'CHANGE_VIEW', payload: 'youtubeVideoDetail' });
    };

    return (
        <button onClick={handleVideoClick} className="w-full text-left">
            <div className="w-full aspect-video rounded-lg overflow-hidden bg-zinc-800">
                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex gap-3 mt-3 px-2">
                {channel && (
                    <img src={channel.avatar} alt={channel.name} className="w-9 h-9 rounded-full object-cover mt-1 flex-shrink-0" />
                )}
                <div className="flex-grow min-w-0">
                    <h4 className="font-semibold leading-tight line-clamp-2">{video.title}</h4>
                    <p className="text-xs text-zinc-400 truncate">
                        {channel?.name} • {video.isScheduled ? 'Scheduled for ' + video.releaseDate.year + ' W' + video.releaseDate.week : formatNumber(video.views) + ' views • ' + formatTimeAgo(video.releaseDate, date)}
                    </p>
                </div>
                <DotsVerticalIcon className="w-5 h-5 text-zinc-400 flex-shrink-0" />
            </div>
        </button>
    );
};

const YouTubeHome: React.FC = () => {
    const { gameState, allPlayerArtists } = useGame();
    const { artistsData, group, careerMode } = gameState;
    const [activeFilter, setActiveFilter] = useState('All');

    const channelsMap = useMemo(() => {
        const map = new Map<string, { name: string; avatar: string }>();
        allPlayerArtists.forEach(artist => {
            map.set(artist.id, { name: artist.name, avatar: artist.image });
        });
        LABELS.forEach(label => {
            if (label.youtubeChannel) {
                map.set(label.id, { name: label.youtubeChannel.name, avatar: label.logo });
            }
        });
        map.set('mtv', { name: 'MTV', avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/MTV_Logo.svg/1200px-MTV_Logo.svg.png' });
        return map;
    }, [allPlayerArtists]);

    const filters = useMemo(() => {
        const baseFilters = ['All', 'Music Videos', 'Live', 'Interviews', 'Genius', 'GRAMMYs'];
        if (careerMode === 'group' && group) {
            const memberFilters = [group.name, ...group.members.map(m => m.name)];
            return [...baseFilters, ...memberFilters];
        }
        return baseFilters;
    }, [careerMode, group]);
    
    const filteredVideos = useMemo(() => {
        let allVideos = Object.values(artistsData).flatMap(data => data.videos);
        allVideos = allVideos.filter(v => !(v.channelId === 'mtv' && date.year < 2010));
        const sortedByDate = [...allVideos].sort((a, b) => (b.releaseDate.year * 52 + b.releaseDate.week) - (a.releaseDate.year * 52 + a.releaseDate.week));

        if (activeFilter === 'All') {
            return [...allVideos].sort(() => Math.random() - 0.5);
        }
        if (activeFilter === 'Music Videos') {
            return sortedByDate.filter(v => v.type === 'Music Video');
        }
        if (activeFilter === 'Live') {
            return sortedByDate.filter(v => v.type === 'Live Performance');
        }
        if (activeFilter === 'Interviews') {
            return sortedByDate.filter(v => v.type === 'Interview' || v.type === 'Genius Verified');
        }
        if (activeFilter === 'Genius') {
            return sortedByDate.filter(v => v.type === 'Genius Verified');
        }
        if (activeFilter === 'GRAMMYs') {
            return sortedByDate.filter(v => v.type === 'Live Performance' && v.title.toLowerCase().includes('grammys'));
        }

        const artistToFilter = allPlayerArtists.find(a => a.name === activeFilter);
        if (artistToFilter) {
            return sortedByDate.filter(v => v.artistId === artistToFilter.id && !v.isFeatureVideo);
        }
        
        return [...allVideos].sort(() => Math.random() - 0.5);
    }, [artistsData, activeFilter, allPlayerArtists]);

    return (
        <>
            <div className="sticky top-0 z-10">
                <header className="p-3 flex items-center justify-between bg-[#0f0f0f]/80 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                        <YouTubeIcon className="w-8 h-8 text-red-500" />
                        <h1 className="text-2xl font-bold tracking-tighter">YouTube</h1>
                    </div>
                </header>
                <div className="px-3 bg-[#0f0f0f] border-b border-white/10">
                    <div className="flex gap-2 overflow-x-auto py-2 scrollbar-hide">
                        {filters.map(filter => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
                                    activeFilter === filter
                                        ? 'bg-white text-black'
                                        : 'bg-zinc-800 hover:bg-zinc-700'
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="space-y-6 py-4">
                {filteredVideos.length > 0 ? (
                    filteredVideos.map(video => (
                        <VideoItem key={video.id} video={video} channel={channelsMap.get(video.channelId)} />
                    ))
                ) : (
                    <div className="text-center py-20 text-zinc-500">
                        <p>No videos found for this filter.</p>
                    </div>
                )}
            </div>
        </>
    );
};

const YouTubeChannelView: React.FC = () => {
    const { gameState, dispatch, activeArtist, activeArtistData } = useGame();
    const { date, activeYoutubeChannel, activeArtistId, viewingPastLabelId } = gameState;
    const [filter, setFilter] = useState<'Popular' | 'Latest' | 'Oldest'>('Popular');
    const [channelTab, setChannelTab] = useState<'Videos' | 'Podcasts'>('Videos');
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!activeArtist || !activeArtistData) return null;
    const { youtubeSubscribers, videos, youtubeStoreUnlocked, contract } = activeArtistData;

    const isViewingPastLabel = !!viewingPastLabelId;

    const handleBack = () => {
        dispatch({ type: 'CHANGE_VIEW', payload: isViewingPastLabel ? 'labels' : 'game' });
    };

    const currentLabel = useMemo(() => contract ? LABELS.find(l => l.id === contract.labelId) : null, [contract]);
    const canSwitchToLabelChannel = currentLabel && currentLabel.youtubeChannel;
    const isLabelView = (activeYoutubeChannel === 'label' && canSwitchToLabelChannel) || isViewingPastLabel;

    const channelData = useMemo(() => {
        let labelToShow;
        if (isViewingPastLabel) {
            labelToShow = LABELS.find(l => l.id === viewingPastLabelId);
        } else if (activeYoutubeChannel === 'label' && canSwitchToLabelChannel) {
            labelToShow = currentLabel;
        }

        if (labelToShow && labelToShow.youtubeChannel) {
            return {
                name: labelToShow.youtubeChannel.name,
                handle: labelToShow.youtubeChannel.handle,
                avatar: labelToShow.logo,
                banner: labelToShow.youtubeChannel.banner,
                subscribers: labelToShow.youtubeChannel.subscribers,
                isVerified: true,
                isPersonal: false,
                bio: `Official YouTube for ${labelToShow.name}.`,
            }
        }
        
        return {
            name: activeArtist.name,
            handle: `@${activeArtist.name.replace(/\s/g, '').toLowerCase()}`,
            avatar: activeArtist.image,
            banner: activeArtist.image,
            subscribers: youtubeSubscribers,
            isVerified: youtubeSubscribers >= SUBSCRIBER_THRESHOLD_VERIFIED || videos.some(v => v.views >= VIEWS_THRESHOLD_VERIFIED),
            isPersonal: true,
            bio: `Official YouTube channel for ${activeArtist.name}.`
        }
    }, [isViewingPastLabel, viewingPastLabelId, activeYoutubeChannel, canSwitchToLabelChannel, currentLabel, activeArtist, youtubeSubscribers, videos]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0] && activeArtist && channelData.isPersonal) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const newImage = reader.result as string;
                dispatch({ type: 'UPDATE_ARTIST_IMAGE', payload: { artistId: activeArtist.id, newImage } });
            };
            reader.readAsDataURL(file);
        }
        if (e.target) e.target.value = '';
    };

    const triggerFileInput = () => {
        if (channelData.isPersonal) {
            fileInputRef.current?.click();
        }
    };
    
    const channelIdToShow = isViewingPastLabel ? viewingPastLabelId : (isLabelView && contract ? contract.labelId : activeArtistId!);
    const displayedVideos = useMemo(() => {
         const filtered = videos.filter(v => v.channelId === channelIdToShow && !v.isFeatureVideo);
         switch (filter) {
            case 'Popular':
                return filtered.sort((a, b) => b.views - a.views);
            case 'Latest':
                return filtered.sort((a, b) => (b.releaseDate.year * 52 + b.releaseDate.week) - (a.releaseDate.year * 52 + a.releaseDate.week));
            case 'Oldest':
                return filtered.sort((a, b) => (a.releaseDate.year * 52 + a.releaseDate.week) - (b.releaseDate.year * 52 + a.releaseDate.week));
        }
    }, [videos, filter, channelIdToShow]);

    const handleVideoClick = (videoId: string) => {
        dispatch({ type: 'SELECT_VIDEO', payload: videoId });
        dispatch({ type: 'CHANGE_VIEW', payload: 'youtubeVideoDetail' });
    };

    const handleVisitStore = () => {
        if (youtubeStoreUnlocked) {
            dispatch({ type: 'CHANGE_VIEW', payload: 'merchStore' });
        } else {
            alert(`Store unlocks at ${formatNumber(SUBSCRIBER_THRESHOLD_STORE)} subscribers!`);
        }
    };

    return (
        <div className="bg-[#0f0f0f] text-white h-full overflow-y-auto pb-16">
            <header className="p-4 flex items-center gap-4 sticky top-0 bg-[#0f0f0f]/80 backdrop-blur-sm z-10 border-b border-white/10">
                <button onClick={handleBack} className="p-2 rounded-full hover:bg-white/10">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold">YouTube</h1>
            </header>

            <div className="h-24 md:h-32 bg-zinc-700">
                <img src={channelData.banner} alt="Banner" className="w-full h-full object-cover" />
            </div>
            
            <div className="px-4">
                <div className="flex items-end -mt-10">
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                    <button onClick={triggerFileInput} className={`relative group ${channelData.isPersonal ? 'cursor-pointer' : ''}`}>
                        <img src={channelData.avatar} alt={channelData.name} className="w-20 h-20 rounded-full border-4 border-[#0f0f0f] object-cover" />
                        {channelData.isPersonal && (
                            <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <CameraIcon className="w-8 h-8 text-white" />
                            </div>
                        )}
                    </button>
                </div>

                <div className="mt-4">
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold">{channelData.name}</h2>
                        {channelData.isVerified && <CheckCircleIcon className="w-5 h-5 text-zinc-400" />}
                    </div>
                    <div className="text-zinc-400 text-sm flex items-center gap-2">
                        <span>{channelData.handle}</span>
                        <span>•</span>
                        <span>{formatNumber(channelData.subscribers)} subscribers</span>
                        <span>•</span>
                        <span>{displayedVideos.length} videos</span>
                    </div>
                    <p className="text-zinc-400 text-sm mt-1">{channelData.bio}</p>
                </div>

                {canSwitchToLabelChannel && !isViewingPastLabel && (
                    <div className="mt-4 p-1 bg-zinc-800 rounded-full flex">
                        <button onClick={() => dispatch({type: 'SWITCH_YOUTUBE_CHANNEL', payload: 'artist'})} className={`flex-1 py-1.5 rounded-full text-sm font-semibold ${!isLabelView ? 'bg-zinc-600' : 'hover:bg-zinc-700'}`}>Personal</button>
                        <button onClick={() => dispatch({type: 'SWITCH_YOUTUBE_CHANNEL', payload: 'label'})} className={`flex-1 py-1.5 rounded-full text-sm font-semibold ${isLabelView ? 'bg-zinc-600' : 'hover:bg-zinc-700'}`}>Label</button>
                    </div>
                )}

                <div className="mt-4 flex flex-col gap-2">
                    <button className="w-full bg-white text-black font-semibold py-2 rounded-full">Subscribe</button>
                    {channelData.isPersonal && (
                        <>
                        <button onClick={handleVisitStore} className={`w-full font-semibold py-2 rounded-full ${youtubeStoreUnlocked ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-zinc-800/50 text-zinc-500 cursor-not-allowed'}`}>
                            Visit store
                        </button>
                         <button onClick={() => dispatch({ type: 'CHANGE_VIEW', payload: 'youtubeStudio' })} className="w-full font-semibold py-2 rounded-full bg-zinc-800 hover:bg-zinc-700">
                            YouTube Studio
                        </button>
                        </>
                    )}
                </div>
            </div>

            <div className="mt-4 border-y border-white/10">
                 
                 <div className="flex gap-4 px-4 overflow-x-auto">
                    <button className="py-3 text-sm font-semibold text-zinc-400">Home</button>
                    <button onClick={() => setChannelTab('Videos')} className={`py-3 text-sm font-semibold ${channelTab === 'Videos' ? 'border-b-2 border-white text-white' : 'text-zinc-400'}`}>Videos</button>
                    <button className="py-3 text-sm font-semibold text-zinc-400">Shorts</button>
                    <button className="py-3 text-sm font-semibold text-zinc-400">Live</button>
                    <button className="py-3 text-sm font-semibold text-zinc-400">Releases</button>
                    {(gameState.podcasts || []).filter(p => p.host === channelData.name).length > 0 && (
                        <button onClick={() => setChannelTab('Podcasts')} className={`py-3 text-sm font-semibold ${channelTab === 'Podcasts' ? 'border-b-2 border-white text-white' : 'text-zinc-400'}`}>Podcasts</button>
                    )}
                </div>
             
            </div>
            
            <main className="p-4 space-y-4">
                {channelTab === 'Podcasts' ? (
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold">Podcasts</h3>
                        {(gameState.podcasts || []).filter(p => p.host === channelData.name).map(podcast => (
                            <div key={podcast.id} className="flex gap-3 bg-zinc-800/50 p-2 rounded-lg cursor-pointer hover:bg-zinc-800 transition" onClick={() => {
                                dispatch({ type: 'UPDATE_GAME_STATE', payload: { currentView: 'spotifyPodcasts' } });
                                // We also need to set selected podcast, maybe it's better to just open it via spotifyPodcasts?
                            }}>
                                <img src={podcast.coverArt || channelData.avatar} className="w-32 h-32 rounded-lg object-cover flex-shrink-0" />
                                <div className="flex flex-col py-1">
                                    <h4 className="font-bold text-xl leading-tight line-clamp-2">{podcast.name}</h4>
                                    <p className="text-sm text-zinc-400 mt-1 line-clamp-2">{podcast.description}</p>
                                    <p className="text-xs text-zinc-500 mt-auto">{podcast.episodes.length} episodes</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (<>
                
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold">Videos</h3>
                    <button onClick={() => dispatch({type: 'CHANGE_VIEW', payload: 'createVideo'})} className="bg-red-600 text-white text-sm font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                        Create Video
                    </button>
                </div>
                <div className="flex gap-2">
                    {(['Latest', 'Popular', 'Oldest'] as const).map(f => (
                        <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-sm rounded-lg ${filter === f ? 'bg-white text-black' : 'bg-zinc-800 hover:bg-zinc-700'}`}>
                            {f}
                        </button>
                    ))}
                </div>

                {displayedVideos.length > 0 ? (
                    <div className="space-y-4">
                        {displayedVideos.map(video => (
                            <button key={video.id} onClick={() => handleVideoClick(video.id)} className="w-full text-left flex gap-3 group">
                                <div className="w-1/3 aspect-video rounded-lg overflow-hidden relative group-hover:opacity-80 transition-opacity">
                                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                                     {video.type === 'Genius Verified' && (
                                        <div className="absolute bottom-1 right-1 bg-yellow-300 p-0.5 rounded-sm">
                                            <GeniusIcon className="w-4 h-4 text-black" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-grow w-2/3">
                                    <h4 className="font-semibold leading-tight line-clamp-2">{video.title}</h4>
                                    <p className="text-xs text-zinc-400">{video.isScheduled ? 'Scheduled for ' + video.releaseDate.year + ' W' + video.releaseDate.week : formatNumber(video.views) + ' views • ' + formatTimeAgo(video.releaseDate, date)}</p>
                                </div>
                                <div className="self-start">
                                    <DotsVerticalIcon className="w-5 h-5 text-zinc-400"/>
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-zinc-800 rounded-lg">
                        <p className="text-zinc-400">No videos yet.</p>
                        <p className="text-zinc-500 text-sm">Create your first video to build your channel!</p>
                    </div>
                )}
            </>)}</main>
        </div>
    );
};

const YouTubeBottomNav: React.FC<{ activeTab: 'home' | 'channels'; onTabChange: (tab: 'home' | 'channels') => void }> = ({ activeTab, onTabChange }) => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 h-16 bg-black border-t border-zinc-800 flex justify-around items-center z-30">
            <button onClick={() => onTabChange('home')} className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-white' : 'text-zinc-400'}`}>
                <HomeIcon className="w-6 h-6" />
                <span className="text-xs">Home</span>
            </button>
            <button onClick={() => onTabChange('channels')} className={`flex flex-col items-center gap-1 ${activeTab === 'channels' ? 'text-white' : 'text-zinc-400'}`}>
                <UserGroupIcon className="w-6 h-6" />
                <span className="text-xs">Channels</span>
            </button>
        </nav>
    );
};

const YouTubeView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'home' | 'channels'>('home');

    return (
        <div className="bg-[#0f0f0f] text-white h-full overflow-y-auto">
            <div className="pb-16"> {/* Padding for bottom nav */}
                {activeTab === 'home' ? <YouTubeHome /> : <YouTubeChannelView />}
            </div>
            <YouTubeBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
    );
};

export default YouTubeView;
