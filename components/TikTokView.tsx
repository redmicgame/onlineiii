import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useGame, formatNumber } from '../context/GameContext';
import PlusIcon from './icons/PlusIcon';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import HeartIcon from './icons/HeartIcon';
import CommentIcon from './icons/CommentIcon';
import ShareIcon from './icons/ShareIcon';
import MusicNoteIcon from './icons/MusicNoteIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';
import PlayIcon from './icons/PlayIcon';
import UserIcon from './icons/UserIcon';
import HomeIcon from './icons/HomeIcon';
import TikTokIcon from './icons/TikTokIcon';
import ChartBarIcon from './icons/ChartBarIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';
import VideoIcon from './icons/VideoIcon';
import { TikTokVideo, TikTokPromoteOrder } from '../types';

// Currencies definition and detection
const CURRENCIES = [
    { code: 'CAD', symbol: 'CA$', rate: 1.35, label: 'Canada (CA$)' },
    { code: 'USD', symbol: 'USD$', rate: 1.0, label: 'United States (USD$)' },
    { code: 'GBP', symbol: '£', rate: 0.78, label: 'United Kingdom (£)' },
    { code: 'EUR', symbol: '€', rate: 0.92, label: 'Europe (€)' },
    { code: 'AUD', symbol: 'AU$', rate: 1.50, label: 'Australia (AU$)' },
    { code: 'JPY', symbol: 'JP¥', rate: 155.0, label: 'Japan (JP¥)' },
];

function detectDefaultCurrency() {
    try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
        const lang = navigator.language || '';
        if (tz.includes('Canada') || tz.includes('Toronto') || tz.includes('Vancouver') || tz.includes('Edmonton') || tz.includes('Winnipeg') || lang.includes('CA')) {
            return CURRENCIES[0]; // CAD
        }
        if (tz.includes('London') || lang.includes('GB')) {
            return CURRENCIES[2]; // GBP
        }
        if (tz.includes('Europe') || tz.includes('Paris') || tz.includes('Berlin') || tz.includes('Rome') || tz.includes('Madrid') || lang.includes('FR') || lang.includes('DE')) {
            return CURRENCIES[3]; // EUR
        }
        if (tz.includes('Australia') || tz.includes('Sydney') || tz.includes('Melbourne') || lang.includes('AU')) {
            return CURRENCIES[4]; // AUD
        }
        if (tz.includes('Tokyo') || lang.includes('JP')) {
            return CURRENCIES[5]; // JPY
        }
    } catch (e) {}
    return CURRENCIES[0]; // CA$ as default matching screenshots
}

const TikTokFeedVideo: React.FC<{ video: TikTokVideo & { username: string, userAvatar: string, songName?: string, isVerified?: boolean }, onDelete?: () => void }> = ({ video, onDelete }) => {
    const [showOptions, setShowOptions] = useState(false);
    return (
        <div className="relative w-full h-full overflow-y-auto bg-black snap-start flex-shrink-0 flex flex-col justify-end text-white pb-20 px-4">
            {/* Background "video" placeholder */}
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-800 to-zinc-900 opacity-50 z-0 flex items-center justify-center overflow-hidden">
                <img src={video.thumbnail || video.userAvatar} className={`w-full h-full object-cover ${!video.thumbnail ? 'blur-sm opacity-30' : 'opacity-80'}`} />
            </div>

            {/* Delete Menu */}
            {onDelete && (
                <div className="absolute top-16 right-4 z-50">
                    <div className="flex gap-1 cursor-pointer p-2 drop-shadow-md" onClick={() => setShowOptions(!showOptions)}>
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                    {showOptions && (
                        <div className="absolute top-8 right-0 bg-zinc-800 rounded-lg shadow-lg overflow-hidden w-32 border border-zinc-700">
                            <button onClick={() => { onDelete(); setShowOptions(false); }} className="w-full text-left px-4 py-3 text-red-500 font-semibold text-sm hover:bg-zinc-700">Delete Video</button>
                        </div>
                    )}
                </div>
            )}
            {/* Right side actions */}
            <div className="absolute right-4 bottom-28 z-10 flex flex-col items-center gap-6">
                <div className="relative">
                    <img src={video.userAvatar} className="w-12 h-12 rounded-full border-2 border-white object-cover" />
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center">
                        <PlusIcon className="w-3 h-3 text-white" />
                    </div>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <button className="bg-zinc-800/50 p-2.5 rounded-full"><HeartIcon className="w-7 h-7 text-white" /></button>
                    <span className="text-xs font-semibold">{formatNumber(video.likes)}</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <button className="bg-zinc-800/50 p-2.5 rounded-full"><CommentIcon className="w-7 h-7 text-white" /></button>
                    <span className="text-xs font-semibold">{formatNumber(video.comments)}</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <button className="bg-zinc-800/50 p-2.5 rounded-full"><ShareIcon className="w-7 h-7 text-white" /></button>
                    <span className="text-xs font-semibold">Share</span>
                </div>
                <div className="mt-4 rounded-full border-8 border-zinc-800 animate-spin" style={{ animationDuration: '3s' }}>
                    <img src={video.userAvatar} className="w-6 h-6 rounded-full" />
                </div>
            </div>

            {/* Bottom info */}
            <div className="relative z-10 pr-20 pb-4">
                <div className="flex items-center gap-1 mb-1">
                    <p className="font-bold text-base">@{video.username}</p>
                    {video.isVerified && <CheckCircleIcon className="w-4 h-4 text-[#20D5EC]" />}
                </div>
                <p className="text-sm mb-3">
                    {video.content}
                </p>
                <div className="flex items-center gap-2 mb-2">
                    <MusicNoteIcon className="w-4 h-4" />
                    <div className="w-48 overflow-hidden whitespace-nowrap">
                        <div className="inline-block animate-[marquee_10s_linear_infinite]">
                            {video.songName || "Original Sound - " + video.username}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TikTokView: React.FC = () => {
    const { activeArtist, activeArtistData, dispatch, gameState } = useGame();
    const [currentTab, setCurrentTab] = useState<'foryou' | 'profile' | 'create' | 'charts' | 'promote'>('profile');
    const [profileTab, setProfileTab] = useState<'videos' | 'sounds' | 'liked'>('videos');
    const [chartsTab, setChartsTab] = useState<'top50' | 'viral50'>('top50');
    
    // Promote state
    const [promoteSubTab, setPromoteSubTab] = useState<'create' | 'dashboard' | 'mine'>('create');
    const [selectedCurrency, setSelectedCurrency] = useState(detectDefaultCurrency());
    const [showCurrencyModal, setShowCurrencyModal] = useState(false);
    
    // Goal & Targeting state
    const [goalCategory, setGoalCategory] = useState<'boost_account' | 'get_sales' | 'get_leads'>('boost_account');
    const [selectedGoal, setSelectedGoal] = useState<'likes' | 'views' | 'followers' | 'profile_views'>('likes');
    const [selectedVideoId, setSelectedVideoId] = useState<string>('');
    const [isCustomMode, setIsCustomMode] = useState(false);
    
    // Packs mode state
    const [selectedPackIndex, setSelectedPackIndex] = useState<number>(1); // default Pack 2 (Most Popular)
    
    // Custom mode state
    const [customAudience, setCustomAudience] = useState<'default' | 'custom'>('default');
    const [customBudgetPerDay, setCustomBudgetPerDay] = useState<number>(20); // in USD base
    const [customDurationDays, setCustomDurationDays] = useState<number>(7);
    
    const [showPriceDetails, setShowPriceDetails] = useState(false);
    const [showGoalInfo, setShowGoalInfo] = useState(false);
    const [dashboardFilter, setDashboardFilter] = useState<'60' | '30' | '7'>('60');
    const [dashboardTabMode, setDashboardTabMode] = useState<'video' | 'live'>('video');
    const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'pending' | 'under_review' | 'active' | 'completed'>('all');

    const [createContent, setCreateContent] = useState('');
    const [createSongId, setCreateSongId] = useState<string>('');
    const [createThumbnail, setCreateThumbnail] = useState<string>('');

    const [fypVideos, setFypVideos] = useState<any[]>([]);

    useEffect(() => {
        if (currentTab === 'foryou' && fypVideos.length === 0) {
            const newFypVideos = [];
            const playerSongs = activeArtistData?.songs?.filter(s => s.isReleased) || [];
            const npcSongs = gameState.npcs || [];
            const allSongs = [...playerSongs, ...npcSongs];
            
            const artistCaptions = [
                "dancing to my new song 🕺",
                "pov: you just released the song of the summer",
                "can't stop listening to this",
                "behind the scenes of the music video!",
                "drafts 🤪",
                "obsessed with this sound",
                "is it giving??",
                "make sure to stream my new single!!",
                "tour rehearsals 🎤"
            ];

            const fanCaptions = [
                "obsessed with this part 😭",
                "the bridge is heavenly",
                "POV: you're listening to the song of the year",
                "choreography time! ✨",
                "my new favorite song",
                "they put something in this song fr",
                "wait this is a bop",
                "i cant stop playing this",
                "stan twitter found its new anthem"
            ];

            const fanUsernames = [
                "popcraved", "musicfanatic", "stanaccount123", "daily_updates",
                "chartdata_fan", "themusictea", "pop_icon", "starlight_22", 
                "moonlight_babe", "vibe_check", "music_lover99", "tayvoodoo"
            ];
            
            const fanPhotos = activeArtistData?.paparazziPhotos?.filter(p => p.category === 'TikTok Fan') || [];

            for (let i = 0; i < 20; i++) {
                const isFan = Math.random() > 0.4 && playerSongs.length > 0;
                let song;
                let artistName = "";
                let username = "";
                let avatar = "";
                let thumbnail = "";
                let isVerified = false;
                let content = "";
                
                if (isFan) {
                    song = playerSongs[Math.floor(Math.random() * playerSongs.length)];
                    artistName = activeArtist?.name || "Unknown";
                    username = fanUsernames[Math.floor(Math.random() * fanUsernames.length)] + Math.floor(Math.random() * 100);
                    
                    avatar = `https://ui-avatars.com/api/?name=${username[0]}&background=random`;
                    if (fanPhotos.length > 0) {
                        const randomPhoto = fanPhotos[Math.floor(Math.random() * fanPhotos.length)];
                        thumbnail = randomPhoto.image;
                    } else {
                        thumbnail = activeArtist?.image || "https://ui-avatars.com/api/?name=F&background=random"; 
                    }
                    content = fanCaptions[Math.floor(Math.random() * fanCaptions.length)];
                    isVerified = false;
                } else {
                    song = allSongs[Math.floor(Math.random() * allSongs.length)];
                    if (!song) continue;
                    
                    const isPlayerSong = song.hasOwnProperty('streams');
                    artistName = isPlayerSong ? (activeArtist?.name || "") : (song.artist || "Unknown");
                    const defaultAvatar = "https://ui-avatars.com/api/?name=F&background=random";
                    avatar = isPlayerSong 
                        ? (activeArtist?.imageUrl || activeArtist?.image || defaultAvatar) 
                        : (gameState.npcImages?.[artistName] || defaultAvatar);
                    
                    thumbnail = avatar;
                    if (artistName === "Taylor Swift") {
                        thumbnail = "https://cdn-images.dzcdn.net/images/artist/e528e270424103b527f8a27ac625563b/500x500-000000-80-0-0.jpg";
                    }
                    
                    username = artistName.replace(/\s+/g, '').toLowerCase();
                    content = artistCaptions[Math.floor(Math.random() * artistCaptions.length)];
                    isVerified = Math.random() > 0.2;
                }

                newFypVideos.push({
                    id: `fyp_${Date.now()}_${i}`,
                    username: username,
                    userAvatar: avatar,
                    content: content,
                    songName: `${song.title || "Original"} - ${artistName}`,
                    thumbnail: thumbnail,
                    likes: Math.floor(Math.random() * (isFan ? 1000000 : 5000000)) + 1000,
                    comments: Math.floor(Math.random() * (isFan ? 20000 : 100000)) + 100,
                    views: Math.floor(Math.random() * (isFan ? 5000000 : 20000000)) + 10000,
                    isVerified: isVerified
                });
            }
            setFypVideos(newFypVideos);
        }
    }, [currentTab, fypVideos.length, activeArtist, activeArtistData, gameState.npcs, gameState.npcImages]);

    const viralNpcSongs = useMemo(() => {
        return gameState.spotifyGlobal.slice(0, 50).filter(entry => entry.isNpc);
    }, [gameState.spotifyGlobal]);

    const releasedSongs = useMemo(() => {
        if (!activeArtistData) return [];
        return activeArtistData.songs.filter(s => s.isReleased).sort((a,b) => b.streams! - a.streams!);
    }, [activeArtistData]);

    const myVideos = activeArtistData?.tiktokVideos || [];

    // Auto select first video for promote creative if not selected
    useEffect(() => {
        if (!selectedVideoId && myVideos.length > 0) {
            setSelectedVideoId(myVideos[0].id);
        }
    }, [myVideos, selectedVideoId]);

    const handleCreateTikTok = () => {
        if (!createContent.trim()) return;
        dispatch({ type: 'CREATE_TIKTOK', payload: { content: createContent, songId: createSongId || undefined, thumbnail: createThumbnail || undefined } });
        setCreateContent('');
        setCreateSongId('');
        setCreateThumbnail('');
        setCurrentTab('profile');
    };

    const [selectedVideo, setSelectedVideo] = useState<TikTokVideo | null>(null);

    const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCreateThumbnail(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const videosBySongMap = useMemo(() => {
        const map = new Map<string, any[]>();
        myVideos.forEach(v => {
            if (v.songId) {
                if (!map.has(v.songId)) map.set(v.songId, []);
                map.get(v.songId)!.push(v);
            }
        });
        map.forEach((videos, key) => {
            map.set(key, videos.sort((a,b) => b.likes - a.likes));
        });
        return map;
    }, [myVideos]);

    const top50 = useMemo(() => {
        return (gameState.spotifyGlobal || []).slice(0, 50).map((entry, index) => ({
            ...entry,
            rank: index + 1,
            tiktokVideos: videosBySongMap.get(entry.uniqueId) || [],
            isNew: entry.lastWeek === null
        }));
    }, [gameState.spotifyGlobal, videosBySongMap]);

    const viral50 = useMemo(() => {
        if (!gameState.spotifyGlobal) return [];
        let entries = (gameState.spotifyGlobal || []).map(entry => {
            const videos = videosBySongMap.get(entry.uniqueId) || [];
            const likes = videos.reduce((sum, v) => sum + v.likes, 0);
            return {
                ...entry,
                tiktokVideos: videos,
                score: likes > 0 ? likes * 100 : (entry.lastWeek === null ? 50000 : Math.random() * 20000),
                isNew: entry.lastWeek === null || likes > 0
            };
        });
        
        if (activeArtistData) {
            activeArtistData.songs.forEach(song => {
                if (videosBySongMap.has(song.id)) {
                    const hasEntry = entries.find(e => e.uniqueId === song.id);
                    if (!hasEntry) {
                        const videos = videosBySongMap.get(song.id)!;
                        const likes = videos.reduce((sum, v) => sum + v.likes, 0);
                        entries.push({
                            uniqueId: song.id,
                            title: song.title,
                            artist: activeArtist?.name || "",
                            coverArt: song.coverArt || activeArtist?.image || "",
                            rank: 0,
                            isPlayerSong: true,
                            tiktokVideos: videos,
                            score: likes * 100,
                            isNew: true,
                            lastWeek: null,
                            weeksOnChart: 1,
                            peak: 1,
                            weeklyStreams: 0
                        });
                    }
                }
            });
        }
        
        return entries.sort((a,b) => b.score - a.score).slice(0, 50).map((e, index) => ({...e, rank: index + 1}));
    }, [gameState.spotifyGlobal, activeArtistData, videosBySongMap, activeArtist?.name, activeArtist?.image]);

    // Format currency amount based on selected currency
    const formatPrice = (usdAmount: number) => {
        const converted = usdAmount * selectedCurrency.rate;
        if (selectedCurrency.code === 'JPY') {
            return `${selectedCurrency.symbol}${Math.round(converted).toLocaleString()}`;
        }
        return `${selectedCurrency.symbol}${converted.toFixed(2)}`;
    };

    // Calculate Promote Packs data
    const PACKS = useMemo(() => {
        if (selectedGoal === 'likes') {
            return [
                { min: 534, max: 3840, label: 'likes & comments in 12 hours', usdCost: 10.37, stars: 1, isPopular: false },
                { min: 992, max: 7140, label: 'likes & comments in 12 hours', usdCost: 19.26, stars: 2, isPopular: true },
                { min: 1720, max: 12350, label: 'likes & comments in 12 hours', usdCost: 33.33, stars: 3, isPopular: false },
            ];
        } else if (selectedGoal === 'views') {
            return [
                { min: 2500, max: 15000, label: 'video views in 12 hours', usdCost: 8.00, stars: 1, isPopular: false },
                { min: 6000, max: 35000, label: 'video views in 12 hours', usdCost: 16.00, stars: 2, isPopular: true },
                { min: 15000, max: 80000, label: 'video views in 12 hours', usdCost: 30.00, stars: 3, isPopular: false },
            ];
        } else if (selectedGoal === 'followers') {
            return [
                { min: 150, max: 800, label: 'followers in 24 hours', usdCost: 12.00, stars: 1, isPopular: false },
                { min: 400, max: 2200, label: 'followers in 24 hours', usdCost: 25.00, stars: 2, isPopular: true },
                { min: 1000, max: 5500, label: 'followers in 24 hours', usdCost: 50.00, stars: 3, isPopular: false },
            ];
        } else {
            return [
                { min: 800, max: 4500, label: 'profile views in 12 hours', usdCost: 9.00, stars: 1, isPopular: false },
                { min: 2000, max: 12000, label: 'profile views in 12 hours', usdCost: 18.00, stars: 2, isPopular: true },
                { min: 5000, max: 30000, label: 'profile views in 12 hours', usdCost: 35.00, stars: 3, isPopular: false },
            ];
        }
    }, [selectedGoal]);

    // Custom calculation
    const customTotalUsd = customBudgetPerDay * customDurationDays;
    const customEstMin = Math.floor(customTotalUsd * (selectedGoal === 'likes' ? 250 : selectedGoal === 'views' ? 1200 : selectedGoal === 'followers' ? 20 : 100));
    const customEstMax = Math.floor(customTotalUsd * (selectedGoal === 'likes' ? 1800 : selectedGoal === 'views' ? 8500 : selectedGoal === 'followers' ? 140 : 700));

    // Handle Payment
    const handlePayPromote = () => {
        if (!activeArtistData) return;

        let costInUSD = 0;
        let estMin = 0;
        let estMax = 0;
        let duration = 1;

        if (isCustomMode) {
            costInUSD = customTotalUsd;
            estMin = customEstMin;
            estMax = customEstMax;
            duration = customDurationDays;
        } else {
            const pack = PACKS[selectedPackIndex] || PACKS[0];
            costInUSD = pack.usdCost;
            estMin = pack.min;
            estMax = pack.max;
            duration = 1;
        }

        if ((activeArtistData.money || 0) < costInUSD) {
            alert(`Insufficient funds! You need $${costInUSD.toFixed(2)} USD in artist balance (Current balance: $${(activeArtistData.money || 0).toLocaleString()}).`);
            return;
        }

        dispatch({
            type: 'PURCHASE_TIKTOK_PROMOTE',
            payload: {
                goal: selectedGoal,
                goalTypeCategory: goalCategory,
                targetType: selectedVideoId ? 'video' : 'account',
                videoId: selectedVideoId || undefined,
                adCost: costInUSD,
                currencySymbol: selectedCurrency.symbol,
                originalCurrencyCost: costInUSD * selectedCurrency.rate,
                estimatedResultsMin: estMin,
                estimatedResultsMax: estMax,
                durationDays: duration
            }
        });

        alert(`Promotion started successfully! Paid ${formatPrice(costInUSD)} over ${duration} day(s). Check your Dashboard tab for live performance analytics.`);
        setPromoteSubTab('dashboard');
    };

    if (!activeArtist || !activeArtistData) return null;

    // Filter user promote orders
    const promotesList: TikTokPromoteOrder[] = activeArtistData.tiktokPromotes || [];
    const filteredPromotes = promotesList.filter(p => {
        if (orderStatusFilter === 'all') return true;
        return p.status === orderStatusFilter;
    });

    // Dashboard aggregated stats
    const totalAdCostUsd = promotesList.reduce((sum, p) => sum + (p.adCost || 0), 0);
    const totalViewsGained = promotesList.reduce((sum, p) => sum + (p.viewsGained || 0), 0);
    const totalFollowersGained = promotesList.reduce((sum, p) => sum + (p.followersGained || 0), 0);
    const totalProfileViewsGained = promotesList.reduce((sum, p) => sum + (p.profileViewsGained || 0), 0);

    if (selectedVideo) {
        return (
            <div className="h-full w-full bg-black relative max-w-[400px] mx-auto overflow-hidden">
                <button 
                    onClick={() => setSelectedVideo(null)} 
                    className="absolute top-4 left-4 z-50 text-white drop-shadow-md bg-black/30 p-2 rounded-full"
                >
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <TikTokFeedVideo video={{
                    ...selectedVideo,
                    username: activeArtist.name.replace(/\s/g, '').toLowerCase(),
                    userAvatar: activeArtist.image,
                    isVerified: (activeArtistData.tiktokFollowers || 0) >= 100000,
                    songName: selectedVideo.songId ? activeArtistData.songs.find(s => s.id === selectedVideo.songId)?.title : undefined
                }} onDelete={() => { dispatch({ type: 'DELETE_TIKTOK_VIDEO', payload: { videoId: selectedVideo.id } }); setSelectedVideo(null); }} />
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-black text-white relative font-sans max-w-[400px] mx-auto overflow-hidden">
            {/* Top Bar for Standard TikTok Views */}
            {currentTab !== 'foryou' && currentTab !== 'charts' && currentTab !== 'promote' && (
               <div className="absolute top-0 w-full z-20 flex justify-between items-center px-4 py-4 bg-black">
                   <button onClick={() => dispatch({ type: 'CHANGE_VIEW', payload: 'game' })} className="text-white flex items-center">
                       <ArrowLeftIcon className="w-6 h-6 mr-1" />
                   </button>
                   <h1 className="text-lg font-bold">
                        {currentTab === 'profile' ? activeArtist.name : 'Create Video'}
                   </h1>
                   <div className="flex items-center gap-3">
                       <button 
                            onClick={() => { setCurrentTab('promote'); setPromoteSubTab('create'); }}
                            className="text-white text-xl hover:scale-110 transition-transform p-1"
                            title="Promote"
                       >
                           🔥
                       </button>
                       <button onClick={() => setCurrentTab('charts')} className="text-white">
                            <ChartBarIcon className="w-6 h-6" />
                       </button>
                   </div>
               </div>
            )}

            {currentTab === 'foryou' && (
                <div className="absolute top-0 w-full z-20 flex justify-center items-center py-4 text-gray-300 font-semibold gap-4">
                    <span>Following</span>
                    <span className="text-white border-b-2 border-white pb-1">For You</span>
                    <button 
                        onClick={() => { setCurrentTab('promote'); setPromoteSubTab('create'); }}
                        className="absolute right-4 text-xl hover:scale-110 transition-transform"
                        title="Promote"
                    >
                        🔥
                    </button>
                </div>
            )}

            {/* Currency Selector Modal */}
            {showCurrencyModal && (
                <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="bg-zinc-900 rounded-2xl p-5 w-full max-w-xs border border-zinc-700 shadow-2xl">
                        <div className="flex justify-between items-center mb-4 border-b border-zinc-800 pb-2">
                            <h3 className="font-bold text-lg text-white">Select Currency</h3>
                            <button onClick={() => setShowCurrencyModal(false)} className="text-zinc-400 font-bold">✕</button>
                        </div>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {CURRENCIES.map(curr => (
                                <button
                                    key={curr.code}
                                    onClick={() => { setSelectedCurrency(curr); setShowCurrencyModal(false); }}
                                    className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between font-semibold text-sm transition-colors ${selectedCurrency.code === curr.code ? 'bg-[#FE2C55] text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}
                                >
                                    <span>{curr.label}</span>
                                    <span className="font-bold">{curr.symbol}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Price Details Modal */}
            {showPriceDetails && (
                <div className="absolute inset-0 bg-black/80 z-50 flex items-end">
                    <div className="bg-zinc-900 rounded-t-2xl p-6 w-full border-t border-zinc-800 animate-in slide-in-from-bottom duration-200">
                        <div className="flex justify-between items-center mb-4 border-b border-zinc-800 pb-2">
                            <h3 className="font-bold text-lg">Price details</h3>
                            <button onClick={() => setShowPriceDetails(false)} className="text-zinc-400 font-bold">✕</button>
                        </div>
                        <div className="space-y-3 text-sm text-zinc-300">
                            <div className="flex justify-between">
                                <span>Ad budget</span>
                                <span>{formatPrice(isCustomMode ? customTotalUsd : (PACKS[selectedPackIndex]?.usdCost || 10))}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Estimated Tax (0%)</span>
                                <span>{formatPrice(0)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>TikTok Service Fee</span>
                                <span className="text-green-400 font-semibold">Included</span>
                            </div>
                            <div className="border-t border-zinc-800 pt-3 flex justify-between font-bold text-white text-base">
                                <span>Total Price</span>
                                <span className="text-[#FE2C55]">{formatPrice(isCustomMode ? customTotalUsd : (PACKS[selectedPackIndex]?.usdCost || 10))}</span>
                            </div>
                        </div>
                        <button onClick={() => setShowPriceDetails(false)} className="w-full mt-6 bg-zinc-800 text-white font-bold py-3 rounded-xl">Close</button>
                    </div>
                </div>
            )}

            {/* Content Area */}
            <div className="flex-1 flex flex-col overflow-y-scroll snap-y snap-mandatory hide-scrollbar relative">
                {/* TIKTOK PROMOTE VIEW */}
                {currentTab === 'promote' && (
                    <div className="w-full h-full bg-black text-white flex flex-col relative overflow-y-auto">
                        {/* Top Navigation */}
                        <div className="sticky top-0 z-30 bg-black/95 backdrop-blur-md border-b border-zinc-800">
                            <div className="flex justify-between items-center px-4 pt-3 pb-2">
                                <button onClick={() => setCurrentTab('profile')} className="text-white p-1">
                                    <ArrowLeftIcon className="w-6 h-6" />
                                </button>
                                <h1 className="text-lg font-bold flex items-center gap-1.5">
                                    <span>Promote</span>
                                    <span className="text-xs bg-[#FE2C55]/20 text-[#FE2C55] px-1.5 py-0.5 rounded font-mono font-bold">PRO</span>
                                </h1>
                                <button 
                                    onClick={() => setShowCurrencyModal(true)} 
                                    className="bg-zinc-800 hover:bg-zinc-700 px-2.5 py-1 rounded-full text-xs font-bold text-zinc-300 flex items-center gap-1 border border-zinc-700"
                                >
                                    <span>{selectedCurrency.symbol}</span>
                                    <ChevronDownIcon className="w-3 h-3 opacity-70" />
                                </button>
                            </div>

                            {/* Promote Tabs */}
                            <div className="flex text-center text-sm font-bold text-zinc-400 relative">
                                <button 
                                    onClick={() => setPromoteSubTab('create')} 
                                    className={`flex-1 py-3 transition-colors relative ${promoteSubTab === 'create' ? 'text-white font-extrabold' : 'hover:text-zinc-200'}`}
                                >
                                    Create
                                    {promoteSubTab === 'create' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white mx-auto w-12 rounded-full"></div>}
                                </button>
                                <button 
                                    onClick={() => setPromoteSubTab('dashboard')} 
                                    className={`flex-1 py-3 transition-colors relative ${promoteSubTab === 'dashboard' ? 'text-white font-extrabold' : 'hover:text-zinc-200'}`}
                                >
                                    Dashboard
                                    {promoteSubTab === 'dashboard' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white mx-auto w-16 rounded-full"></div>}
                                </button>
                                <button 
                                    onClick={() => setPromoteSubTab('mine')} 
                                    className={`flex-1 py-3 transition-colors relative ${promoteSubTab === 'mine' ? 'text-white font-extrabold' : 'hover:text-zinc-200'}`}
                                >
                                    <span className="relative inline-block">
                                        Mine
                                        <span className="absolute -top-0.5 -right-2 w-2 h-2 bg-[#FE2C55] rounded-full"></span>
                                    </span>
                                    {promoteSubTab === 'mine' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white mx-auto w-10 rounded-full"></div>}
                                </button>
                            </div>
                        </div>

                        {/* SUBTAB 1: CREATE */}
                        {promoteSubTab === 'create' && (
                            <div className="p-4 pb-32 space-y-6">
                                {/* Choose your goal */}
                                <div>
                                    <div className="flex items-center gap-1.5 mb-3">
                                        <h2 className="text-base font-bold">Choose your goal</h2>
                                        <button onClick={() => setShowGoalInfo(!showGoalInfo)} className="text-zinc-400 text-xs hover:text-white">ⓘ</button>
                                    </div>

                                    {showGoalInfo && (
                                        <div className="mb-3 p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-300">
                                            Select what you want to achieve with this promotion campaign. TikTok algorithm optimizes distribution accordingly.
                                        </div>
                                    )}

                                    {/* Category Pills */}
                                    <div className="flex gap-2 mb-4">
                                        <button 
                                            onClick={() => setGoalCategory('boost_account')} 
                                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${goalCategory === 'boost_account' ? 'border-[#FE2C55] text-[#FE2C55] bg-[#FE2C55]/10' : 'border-zinc-800 text-zinc-400 bg-zinc-900'}`}
                                        >
                                            Boost account
                                        </button>
                                        <button 
                                            onClick={() => setGoalCategory('get_sales')} 
                                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${goalCategory === 'get_sales' ? 'border-[#FE2C55] text-[#FE2C55] bg-[#FE2C55]/10' : 'border-zinc-800 text-zinc-400 bg-zinc-900'}`}
                                        >
                                            Get sales
                                        </button>
                                        <button 
                                            onClick={() => setGoalCategory('get_leads')} 
                                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${goalCategory === 'get_leads' ? 'border-[#FE2C55] text-[#FE2C55] bg-[#FE2C55]/10' : 'border-zinc-800 text-zinc-400 bg-zinc-900'}`}
                                        >
                                            Get leads
                                        </button>
                                    </div>

                                    {/* Radio List Goals */}
                                    <div className="space-y-3">
                                        {/* Goal 1: Likes */}
                                        <div 
                                            onClick={() => setSelectedGoal('likes')}
                                            className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 hover:bg-zinc-900 cursor-pointer border border-zinc-900 transition-all"
                                        >
                                            <div className="flex items-center gap-3">
                                                <HeartIcon className="w-5 h-5 text-white opacity-80" />
                                                <span className="text-sm font-semibold">More likes & comments</span>
                                            </div>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedGoal === 'likes' ? 'border-[#FE2C55]' : 'border-zinc-600'}`}>
                                                {selectedGoal === 'likes' && <div className="w-2.5 h-2.5 bg-[#FE2C55] rounded-full"></div>}
                                            </div>
                                        </div>

                                        {/* Goal 2: Video views */}
                                        <div 
                                            onClick={() => setSelectedGoal('views')}
                                            className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 hover:bg-zinc-900 cursor-pointer border border-zinc-900 transition-all"
                                        >
                                            <div className="flex items-center gap-3">
                                                <PlayIcon className="w-5 h-5 text-white opacity-80" />
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-semibold">More video views</span>
                                                    <span className="bg-[#FE2C55]/20 text-[#FE2C55] text-[10px] font-bold px-1.5 py-0.2 rounded">Upgraded</span>
                                                </div>
                                            </div>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedGoal === 'views' ? 'border-[#FE2C55]' : 'border-zinc-600'}`}>
                                                {selectedGoal === 'views' && <div className="w-2.5 h-2.5 bg-[#FE2C55] rounded-full"></div>}
                                            </div>
                                        </div>

                                        {/* Goal 3: Followers */}
                                        <div 
                                            onClick={() => setSelectedGoal('followers')}
                                            className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 hover:bg-zinc-900 cursor-pointer border border-zinc-900 transition-all"
                                        >
                                            <div className="flex items-center gap-3">
                                                <UserIcon className="w-5 h-5 text-white opacity-80" />
                                                <span className="text-sm font-semibold">More followers</span>
                                            </div>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedGoal === 'followers' ? 'border-[#FE2C55]' : 'border-zinc-600'}`}>
                                                {selectedGoal === 'followers' && <div className="w-2.5 h-2.5 bg-[#FE2C55] rounded-full"></div>}
                                            </div>
                                        </div>

                                        {/* Goal 4: Profile views */}
                                        <div 
                                            onClick={() => setSelectedGoal('profile_views')}
                                            className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 hover:bg-zinc-900 cursor-pointer border border-zinc-900 transition-all"
                                        >
                                            <div className="flex items-center gap-3">
                                                <svg className="w-5 h-5 text-white opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                <span className="text-sm font-semibold">More profile views</span>
                                            </div>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedGoal === 'profile_views' ? 'border-[#FE2C55]' : 'border-zinc-600'}`}>
                                                {selectedGoal === 'profile_views' && <div className="w-2.5 h-2.5 bg-[#FE2C55] rounded-full"></div>}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Select creatives */}
                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <h2 className="text-base font-bold">Select creatives</h2>
                                        <span className="text-xs text-zinc-400">1 creative &gt;</span>
                                    </div>

                                    {myVideos.length > 0 ? (
                                        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                                            {myVideos.map(vid => (
                                                <div 
                                                    key={vid.id} 
                                                    onClick={() => setSelectedVideoId(vid.id)}
                                                    className={`relative aspect-[3/4] w-28 bg-zinc-900 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer border-2 transition-all ${selectedVideoId === vid.id ? 'border-[#FE2C55] scale-105' : 'border-transparent opacity-80 hover:opacity-100'}`}
                                                >
                                                    <img src={vid.thumbnail || activeArtist.image} className="w-full h-full object-cover" />
                                                    {/* Top right circle checkbox */}
                                                    <div className="absolute top-1.5 right-1.5">
                                                        {selectedVideoId === vid.id ? (
                                                            <div className="w-5 h-5 bg-[#FE2C55] rounded-full flex items-center justify-center shadow">
                                                                <span className="text-white text-xs font-bold">✓</span>
                                                            </div>
                                                        ) : (
                                                            <div className="w-5 h-5 border-2 border-white/80 rounded-full bg-black/30"></div>
                                                        )}
                                                    </div>
                                                    {/* Play count */}
                                                    <div className="absolute bottom-1 left-1.5 text-[10px] font-bold text-white drop-shadow flex items-center gap-1">
                                                        <PlayIcon className="w-3 h-3" />
                                                        <span>{formatNumber(vid.views)}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-4 bg-zinc-900 rounded-xl text-center text-xs text-zinc-400">
                                            No videos created yet. Post a video on TikTok first to select as a creative.
                                        </div>
                                    )}
                                </div>

                                {/* Choose promotion pack vs Custom Mode */}
                                {!isCustomMode ? (
                                    <div>
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <h2 className="text-base font-bold">Choose a promotion pack</h2>
                                            <span className="text-zinc-400 text-xs">ⓘ</span>
                                        </div>
                                        <p className="text-xs text-zinc-400 mb-4">Results shown are estimates</p>

                                        {/* Packs list */}
                                        <div className="space-y-3">
                                            {PACKS.map((pack, idx) => (
                                                <div 
                                                    key={idx}
                                                    onClick={() => setSelectedPackIndex(idx)}
                                                    className={`relative p-4 rounded-xl border transition-all cursor-pointer ${selectedPackIndex === idx ? 'bg-[#FE2C55]/10 border-[#FE2C55]' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'}`}
                                                >
                                                    {pack.isPopular && (
                                                        <span className="absolute -top-2.5 right-3 bg-[#FE2C55] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                                                            Most popular
                                                        </span>
                                                    )}
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            {/* Star & Icon graphic */}
                                                            <div className="flex items-center gap-1 text-[#20D5EC]">
                                                                <span className="text-sm">{"★".repeat(pack.stars)}</span>
                                                                <span className="text-lg">👍</span>
                                                            </div>
                                                            <div>
                                                                <p className="font-extrabold text-lg leading-tight">
                                                                    {pack.min.toLocaleString()} - {pack.max >= 1000 ? (pack.max/1000).toFixed(2) + 'K' : pack.max.toLocaleString()}
                                                                </p>
                                                                <p className="text-xs text-zinc-400">{pack.label}</p>
                                                            </div>
                                                        </div>
                                                        <div className="font-bold text-base text-white">
                                                            {formatPrice(pack.usdCost)}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Customize button */}
                                        <div className="mt-5 text-center">
                                            <button 
                                                onClick={() => setIsCustomMode(true)}
                                                className="bg-zinc-800 hover:bg-zinc-700 text-white px-5 py-2.5 rounded-full text-xs font-bold inline-flex items-center gap-2 border border-zinc-700 transition-all"
                                            >
                                                <span>✨ Customize</span>
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    /* CUSTOM PROMOTION MODE */
                                    <div className="space-y-5">
                                        <div className="flex justify-between items-center">
                                            <h2 className="text-base font-bold">Custom promotion</h2>
                                            <button 
                                                onClick={() => setIsCustomMode(false)} 
                                                className="text-xs text-[#FE2C55] font-bold hover:underline"
                                            >
                                                📋 Choose pre-made pack
                                            </button>
                                        </div>
                                        <p className="text-xs text-zinc-400 -mt-3">Results shown are estimates</p>

                                        {/* Estimation Display Box */}
                                        <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800 text-center">
                                            <p className="text-2xl font-black text-white tracking-tight">
                                                {customEstMin.toLocaleString()} - {customEstMax.toLocaleString()}
                                            </p>
                                            <p className="text-xs text-zinc-400 mt-1 capitalize">
                                                {selectedGoal === 'likes' ? 'likes & comments' : selectedGoal}
                                            </p>
                                        </div>

                                        {/* Define audience */}
                                        <div>
                                            <h3 className="text-sm font-bold mb-2">Define your audience ⓘ</h3>
                                            <div className="space-y-2">
                                                <div 
                                                    onClick={() => setCustomAudience('default')}
                                                    className="flex items-center justify-between p-3 bg-zinc-950 rounded-xl border border-zinc-900 cursor-pointer"
                                                >
                                                    <span className="text-xs font-semibold text-zinc-200">Default audience (TikTok chooses for you)</span>
                                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${customAudience === 'default' ? 'border-[#FE2C55]' : 'border-zinc-600'}`}>
                                                        {customAudience === 'default' && <div className="w-2 h-2 bg-[#FE2C55] rounded-full"></div>}
                                                    </div>
                                                </div>

                                                <div 
                                                    onClick={() => setCustomAudience('custom')}
                                                    className="flex items-center justify-between p-3 bg-zinc-950 rounded-xl border border-zinc-900 cursor-pointer"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-semibold text-zinc-200">Create your own</span>
                                                        <span className="bg-[#20D5EC]/20 text-[#20D5EC] text-[10px] font-bold px-1.5 py-0.2 rounded">Updated</span>
                                                    </div>
                                                    <span className="text-xs text-zinc-500">&gt;</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Set budget and duration */}
                                        <div>
                                            <h3 className="text-sm font-bold mb-3">Set budget and duration ⓘ</h3>
                                            
                                            {/* Budget Slider */}
                                            <div className="mb-4 bg-zinc-950 p-4 rounded-xl border border-zinc-900">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-xs font-semibold text-zinc-400">Budget</span>
                                                    <span className="text-xs font-bold text-white flex items-center gap-1">
                                                        {formatPrice(customBudgetPerDay)} Per day ✏️
                                                    </span>
                                                </div>
                                                <input 
                                                    type="range"
                                                    min={5}
                                                    max={1000}
                                                    step={5}
                                                    value={customBudgetPerDay}
                                                    onChange={e => setCustomBudgetPerDay(Number(e.target.value))}
                                                    className="w-full accent-[#FE2C55] cursor-pointer"
                                                />
                                                <div className="mt-2 p-2 bg-zinc-900/80 rounded-lg text-[11px] text-zinc-300 flex items-center gap-1.5">
                                                    <span>👍</span>
                                                    <span>This budget helps drive better performance.</span>
                                                </div>
                                            </div>

                                            {/* Duration Slider */}
                                            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-900">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-xs font-semibold text-zinc-400">Duration</span>
                                                    <span className="text-xs font-bold text-white">
                                                        {customDurationDays} days
                                                    </span>
                                                </div>
                                                <input 
                                                    type="range"
                                                    min={1}
                                                    max={30}
                                                    step={1}
                                                    value={customDurationDays}
                                                    onChange={e => setCustomDurationDays(Number(e.target.value))}
                                                    className="w-full accent-[#FE2C55] cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Terms Notice */}
                                <div className="pt-2 text-[10px] text-zinc-500 space-y-2 border-t border-zinc-900">
                                    <h4 className="font-bold text-zinc-400">Terms</h4>
                                    <p>By continuing, you agree to the TikTok Promote Program and the Payment Terms and Advertising Policy.</p>
                                    <p>TikTok does not allow paid political ads or ads by political figures/entities. I declare any post complies with all Advertising Policies.</p>
                                </div>
                            </div>
                        )}

                        {/* SUBTAB 2: DASHBOARD */}
                        {promoteSubTab === 'dashboard' && (
                            <div className="p-4 pb-28 space-y-6">
                                {/* Results overview */}
                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="flex items-center gap-1">
                                            <h2 className="text-base font-bold">Results overview</h2>
                                            <span className="text-xs text-zinc-400">ⓘ</span>
                                        </div>
                                        <button className="text-xs text-zinc-400 hover:text-white">See more &gt;</button>
                                    </div>

                                    {/* Filters Bar */}
                                    <div className="flex justify-between items-center mb-4">
                                        <select 
                                            value={dashboardFilter} 
                                            onChange={(e: any) => setDashboardFilter(e.target.value)}
                                            className="bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-semibold px-2.5 py-1.5 text-zinc-300 outline-none"
                                        >
                                            <option value="60">Last 60 days</option>
                                            <option value="30">Last 30 days</option>
                                            <option value="7">Last 7 days</option>
                                        </select>

                                        <div className="flex bg-zinc-900 p-0.5 rounded-full border border-zinc-800 text-xs font-semibold">
                                            <button 
                                                onClick={() => setDashboardTabMode('video')} 
                                                className={`px-3 py-1 rounded-full transition-all ${dashboardTabMode === 'video' ? 'bg-zinc-700 text-white' : 'text-zinc-400'}`}
                                            >
                                                Video
                                            </button>
                                            <button 
                                                onClick={() => setDashboardTabMode('live')} 
                                                className={`px-3 py-1 rounded-full transition-all ${dashboardTabMode === 'live' ? 'bg-zinc-700 text-white' : 'text-zinc-400'}`}
                                            >
                                                LIVE
                                            </button>
                                        </div>
                                    </div>

                                    {/* 2x2 Grid Stats */}
                                    <div className="grid grid-cols-2 gap-3">
                                        {/* Card 1: Ad cost */}
                                        <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-900">
                                            <p className="text-xs text-zinc-400 mb-1">Ad cost</p>
                                            <p className="text-xl font-bold mb-2">
                                                {formatPrice(totalAdCostUsd)}
                                            </p>
                                            <div className="flex items-center text-xs font-bold text-sky-400 gap-1">
                                                <span className="w-3.5 h-3.5 bg-sky-500/20 text-sky-400 rounded-full flex items-center justify-center text-[10px]">↑</span>
                                                <span>{formatPrice(totalAdCostUsd)}</span>
                                            </div>
                                        </div>

                                        {/* Card 2: Video views */}
                                        <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-900">
                                            <p className="text-xs text-zinc-400 mb-1">Video views</p>
                                            <p className="text-xl font-bold mb-2">
                                                {formatNumber(totalViewsGained)}
                                            </p>
                                            <div className="flex items-center text-xs font-bold text-sky-400 gap-1">
                                                <span className="w-3.5 h-3.5 bg-sky-500/20 text-sky-400 rounded-full flex items-center justify-center text-[10px]">↑</span>
                                                <span>{formatNumber(totalViewsGained)}</span>
                                            </div>
                                        </div>

                                        {/* Card 3: New followers */}
                                        <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-900">
                                            <p className="text-xs text-zinc-400 mb-1">New followers</p>
                                            <p className="text-xl font-bold mb-2">
                                                {formatNumber(totalFollowersGained)}
                                            </p>
                                            <div className="flex items-center text-xs font-bold text-sky-400 gap-1">
                                                <span className="w-3.5 h-3.5 bg-sky-500/20 text-sky-400 rounded-full flex items-center justify-center text-[10px]">↑</span>
                                                <span>{formatNumber(totalFollowersGained)}</span>
                                            </div>
                                        </div>

                                        {/* Card 4: Profile views */}
                                        <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-900">
                                            <p className="text-xs text-zinc-400 mb-1">Profile views</p>
                                            <p className="text-xl font-bold mb-2">
                                                {formatNumber(totalProfileViewsGained)}
                                            </p>
                                            <div className="flex items-center text-xs font-bold text-sky-400 gap-1">
                                                <span className="w-3.5 h-3.5 bg-sky-500/20 text-sky-400 rounded-full flex items-center justify-center text-[10px]">↑</span>
                                                <span>{formatNumber(totalProfileViewsGained)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Order History */}
                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <h2 className="text-base font-bold">Order history</h2>
                                        <button className="text-xs text-zinc-400 hover:text-white">See more &gt;</button>
                                    </div>

                                    {/* Status Pills */}
                                    <div className="flex gap-2 overflow-x-auto pb-3 hide-scrollbar text-xs font-semibold">
                                        {['all', 'pending', 'under_review', 'active', 'completed'].map(st => (
                                            <button
                                                key={st}
                                                onClick={() => setOrderStatusFilter(st as any)}
                                                className={`px-3 py-1.5 rounded-lg capitalize border transition-all whitespace-nowrap ${orderStatusFilter === st ? 'bg-zinc-800 border-zinc-600 text-white' : 'bg-zinc-950 border-zinc-900 text-zinc-400 hover:text-white'}`}
                                            >
                                                {st.replace('_', ' ')}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Orders List */}
                                    <div className="space-y-4 mt-2">
                                        {/* User Active & Completed Orders */}
                                        {filteredPromotes.map(order => (
                                            <div key={order.id} className="bg-zinc-950 p-4 rounded-xl border border-zinc-900 space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <span className={`text-xs font-bold capitalize px-2 py-0.5 rounded ${order.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                                        {order.status}
                                                    </span>
                                                    <span className="text-xs text-zinc-400">
                                                        {order.goal === 'likes' ? 'More likes & comments' : order.goal === 'views' ? 'More video views' : order.goal === 'followers' ? 'More followers' : 'More profile views'}, {order.startDate}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <div className="w-16 h-16 bg-zinc-900 rounded-lg overflow-hidden flex-shrink-0 relative">
                                                        <img src={order.videoThumbnail || activeArtist.image} className="w-full h-full object-cover" />
                                                    </div>

                                                    <div className="flex-1 text-xs space-y-1">
                                                        <div className="flex justify-between">
                                                            <span className="text-zinc-400">Ad cost</span>
                                                            <span className="font-bold text-white">{formatPrice(order.adCost)}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-zinc-400">Video views</span>
                                                            <span className="font-bold text-white">{formatNumber(order.viewsGained)}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-zinc-400">New followers</span>
                                                            <span className="font-bold text-white">{formatNumber(order.followersGained)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Initial Default Sample Order if no orders exist */}
                                        {promotesList.length === 0 && (
                                            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-900 space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs font-bold capitalize px-2 py-0.5 rounded bg-green-500/20 text-green-400">
                                                        Completed
                                                    </span>
                                                    <span className="text-xs text-zinc-400">
                                                        More followers, 04/17/2024
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <div className="w-16 h-16 bg-zinc-900 rounded-lg overflow-hidden flex-shrink-0 relative">
                                                        <img src={activeArtist.image} className="w-full h-full object-cover" />
                                                    </div>

                                                    <div className="flex-1 text-xs space-y-1">
                                                        <div className="flex justify-between">
                                                            <span className="text-zinc-400">Ad cost</span>
                                                            <span className="font-bold text-white">{formatPrice(3)}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-zinc-400">Video views</span>
                                                            <span className="font-bold text-white">704</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-zinc-400">New followers</span>
                                                            <span className="font-bold text-white">5</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SUBTAB 3: MINE */}
                        {promoteSubTab === 'mine' && (
                            <div className="p-4 pb-28 space-y-5">
                                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-900 space-y-3">
                                    <h3 className="font-bold text-sm text-white">Promote Coupons & Credits</h3>
                                    <div className="p-3 bg-zinc-900 rounded-lg flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-xs text-[#20D5EC]">{formatPrice(10)} Promo Credit</p>
                                            <p className="text-[10px] text-zinc-400">Valid for new campaigns</p>
                                        </div>
                                        <button className="bg-[#FE2C55] text-white text-xs font-bold px-3 py-1 rounded-full">
                                            Claimed
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-900 space-y-3">
                                    <h3 className="font-bold text-sm text-white">Payment Method</h3>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-zinc-400">Artist Balance</span>
                                        <span className="font-bold text-white">${formatNumber(activeArtistData.money || 0)} USD</span>
                                    </div>
                                </div>

                                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-900 space-y-2 text-xs">
                                    <h3 className="font-bold text-sm text-white mb-2">Promote Settings</h3>
                                    <div className="py-2 border-b border-zinc-900 flex justify-between text-zinc-300">
                                        <span>Advertiser ID</span>
                                        <span className="font-mono text-zinc-500">TK-PRO-88921</span>
                                    </div>
                                    <div className="py-2 border-b border-zinc-900 flex justify-between text-zinc-300">
                                        <span>Tax Information</span>
                                        <span className="text-zinc-500">Provided</span>
                                    </div>
                                    <div className="py-2 flex justify-between text-zinc-300">
                                        <span>Advertising Policies</span>
                                        <span className="text-[#20D5EC]">&gt;</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Sticky Pay Bottom Bar for Create Tab */}
                        {promoteSubTab === 'create' && (
                            <div className="fixed bottom-0 left-0 right-0 max-w-[400px] mx-auto bg-black/95 border-t border-zinc-800 p-4 z-40 flex justify-between items-center">
                                <div>
                                    <p className="text-xl font-black text-white">
                                        {formatPrice(isCustomMode ? customTotalUsd : (PACKS[selectedPackIndex]?.usdCost || 10))}
                                    </p>
                                    <button 
                                        onClick={() => setShowPriceDetails(true)} 
                                        className="text-[11px] text-zinc-400 flex items-center gap-0.5 hover:text-white"
                                    >
                                        <span>See price details</span>
                                        <span>⌃</span>
                                    </button>
                                </div>

                                <button 
                                    onClick={handlePayPromote}
                                    className="bg-[#FE2C55] hover:bg-[#E0264B] text-white font-extrabold px-8 py-3 rounded-full shadow-lg shadow-red-500/30 transition-all text-sm"
                                >
                                    Pay
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* FOR YOU TAB */}
                {currentTab === 'foryou' && fypVideos.length > 0 && fypVideos.map(video => (
                    <TikTokFeedVideo key={video.id} video={video} />
                ))}
                {currentTab === 'foryou' && fypVideos.length === 0 && (
                   <div className="h-full w-full bg-black flex flex-col items-center justify-center text-center px-8 relative">
                        <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-6 animate-pulse">
                            <TikTokIcon className="w-8 h-8 text-white" />
                        </div>
                   </div>
                )}

                {/* CREATE TAB */}
                {currentTab === 'create' && (
                    <div className="pt-20 px-6 pb-24 w-full h-full flex-shrink-0 bg-zinc-900 overflow-y-auto">
                        <textarea 
                            value={createContent}
                            onChange={(e) => setCreateContent(e.target.value)}
                            placeholder="Caption your TikTok..."
                            className="w-full h-32 bg-zinc-800 rounded-xl p-4 text-white resize-none outline-none focus:ring-1 focus:ring-[#25F4EE] mb-6"
                        />
                        
                        <div className="mb-6">
                            <label className="block text-sm font-semibold mb-2">Add Sound (Optional)</label>
                            <select 
                                value={createSongId} 
                                onChange={e => setCreateSongId(e.target.value)}
                                className="w-full bg-zinc-800 p-4 rounded-xl text-white outline-none focus:ring-1 focus:ring-[#25F4EE] appearance-none"
                            >
                                <option value="">Original Sound</option>
                                <optgroup label="Your Songs">
                                    {releasedSongs.map(s => (
                                        <option key={s.id} value={s.id}>{s.title}</option>
                                    ))}
                                </optgroup>
                                {viralNpcSongs.length > 0 && (
                                    <optgroup label="Viral TikTok Sounds">
                                        {viralNpcSongs.map(s => (
                                            <option key={s.uniqueId} value={`npc_${s.uniqueId}`}>{s.title} - {s.artist}</option>
                                        ))}
                                    </optgroup>
                                )}
                            </select>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-semibold mb-2">Thumbnail Upload (Optional) 9:16</label>
                            <label className="w-full flex-col flex items-center justify-center p-6 border-2 border-dashed border-zinc-700 bg-zinc-800 rounded-xl cursor-pointer hover:border-[#25F4EE] hover:bg-zinc-800/80 transition-all cursor-pointer">
                                <span className="text-zinc-400 text-sm mb-2">{createThumbnail ? 'Change Thumbnail' : 'Click to Upload Thumbnail'}</span>
                                <input 
                                    type="file"
                                    accept="image/*"
                                    onChange={handleThumbnailUpload}
                                    className="hidden"
                                />
                            </label>
                            {createThumbnail && (
                                <img src={createThumbnail} className="mt-4 w-32 aspect-[9/16] object-cover rounded-lg border border-zinc-700" alt="Thumbnail Preview" />
                            )}
                        </div>
                        
                        <button 
                            onClick={handleCreateTikTok}
                            disabled={!createContent.trim()}
                            className="w-full bg-[#FE2C55] disabled:bg-zinc-700 disabled:text-zinc-400 font-bold py-4 rounded-xl hover:bg-[#E0264B] transition-colors"
                        >
                            Post Video
                        </button>
                    </div>
                )}

                {/* PROFILE TAB */}
                {currentTab === 'profile' && (
                    <div className="pt-16 pb-20 overflow-y-auto w-full h-full flex-shrink-0 text-center">
                        <div className="mt-4">
                             <img src={activeArtist.image} className="w-24 h-24 mx-auto rounded-full object-cover border-2 border-black" />
                             <div className="mt-3 flex items-center justify-center gap-1">
                                 <p className="font-bold text-xl">@{activeArtist.name.replace(/\s/g, '').toLowerCase()}</p>
                                 {(activeArtistData.tiktokFollowers || 0) >= 100000 && (
                                     <CheckCircleIcon className="w-5 h-5 text-[#20D5EC]" />
                                 )}
                             </div>
                             
                             <div className="flex justify-center gap-6 mt-4">
                                 <div className="flex flex-col items-center">
                                     <span className="font-bold text-lg">0</span>
                                     <span className="text-xs text-zinc-400">Following</span>
                                 </div>
                                 <div className="flex flex-col items-center">
                                     <span className="font-bold text-lg">{formatNumber(activeArtistData.tiktokFollowers || 0)}</span>
                                     <span className="text-xs text-zinc-400">Followers</span>
                                 </div>
                                 <div className="flex flex-col items-center">
                                     <span className="font-bold text-lg">{formatNumber(myVideos.reduce((sum, v) => sum + v.likes, 0))}</span>
                                     <span className="text-xs text-zinc-400">Likes</span>
                                 </div>
                             </div>

                             <div className="mt-6 flex justify-center gap-2 px-8">
                                 <button className="flex-1 bg-zinc-800 py-2.5 rounded text-sm font-semibold hover:bg-zinc-700">Edit profile</button>
                                 <button onClick={() => { setCurrentTab('promote'); setPromoteSubTab('create'); }} className="bg-[#FE2C55] text-white px-3 py-2.5 rounded text-sm font-bold flex items-center justify-center gap-1 hover:bg-[#E0264B]">🔥 Promote</button>
                                 <button className="bg-zinc-800 px-3 rounded flex items-center justify-center hover:bg-zinc-700"><ShareIcon className="w-5 h-5"/></button>
                             </div>
                        </div>

                        {/* Profile Tabs */}
                        <div className="flex border-b border-zinc-800 mt-6 text-sm font-semibold relative text-zinc-500">
                            <button onClick={() => setProfileTab('videos')} className={`flex-1 py-3 flex justify-center border-b-2 ${profileTab === 'videos' ? 'border-white text-white' : 'border-transparent hover:text-gray-300'}`}>
                                <svg width="24" height="24" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M16 6H8C6.89543 6 6 6.89543 6 8V16C6 17.1046 6.89543 18 8 18H16C17.1046 18 18 17.1046 18 16V8C18 6.89543 17.1046 6 16 6Z" stroke="currentColor" strokeWidth="4" strokeLinejoin="round"/><path d="M16 30H8C6.89543 30 6 30.8954 6 32V40C6 41.1046 6.89543 42 8 42H16C17.1046 42 18 41.1046 18 40V32C18 30.8954 17.1046 30 16 30Z" stroke="currentColor" strokeWidth="4" strokeLinejoin="round"/><path d="M40 30H32C30.8954 30 30 30.8954 30 32V40C30 41.1046 30.8954 42 32 42H40C41.1046 42 42 41.1046 42 40V32C42 30.8954 41.1046 30 40 30Z" stroke="currentColor" strokeWidth="4" strokeLinejoin="round"/><path d="M40 6H32C30.8954 6 30 6.89543 30 8V16C30 17.1046 30.8954 18 32 18H40C41.1046 18 42 17.1046 42 16V8C42 6.89543 41.1046 6 40 6Z" stroke="currentColor" strokeWidth="4" strokeLinejoin="round"/></svg>
                            </button>
                            <button onClick={() => setProfileTab('sounds')} className={`flex-1 py-3 flex justify-center border-b-2 ${profileTab === 'sounds' ? 'border-white text-white' : 'border-transparent hover:text-gray-300'}`}>
                                <MusicNoteIcon className="w-6 h-6" />
                            </button>
                            <button onClick={() => setProfileTab('liked')} className={`flex-1 py-3 flex justify-center border-b-2 ${profileTab === 'liked' ? 'border-white text-white' : 'border-transparent hover:text-gray-300'}`}>
                                <HeartIcon className="w-6 h-6" />
                            </button>
                        </div>

                        {profileTab === 'videos' && (
                            <>
                                <div className="grid grid-cols-3 gap-0.5">
                                    {myVideos.map(video => (
                                        <div key={video.id} className="aspect-[3/4] bg-zinc-900 relative cursor-pointer group" onClick={() => setSelectedVideo(video)}>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 flex items-end p-1">
                                                <div className="flex items-center text-xs font-semibold gap-1">
                                                    <PlayIcon className="w-3 h-3"/>
                                                    <span>{formatNumber(video.views)}</span>
                                                </div>
                                            </div>
                                            <div className="w-full h-full bg-cover bg-center opacity-70 group-hover:opacity-90 transition-opacity" style={{ backgroundImage: `url(${video.thumbnail || activeArtist.image})` }}></div>
                                        </div>
                                    ))}
                                </div>
                                {myVideos.length === 0 && (
                                    <div className="mt-20 flex flex-col items-center text-center px-8">
                                        <p className="font-bold text-lg mb-1">No videos yet</p>
                                        <p className="text-zinc-500 text-sm">Post a video to get started</p>
                                    </div>
                                )}
                            </>
                        )}

                        {profileTab === 'sounds' && (
                            <div className="flex flex-col gap-4 p-4 text-left">
                                {releasedSongs.map(song => (
                                    <div key={song.id} className="flex items-center gap-3 bg-zinc-900 p-3 rounded-lg border border-zinc-800 hover:bg-zinc-800 transition-colors">
                                        <div className="w-12 h-12 bg-zinc-800 rounded flex items-center justify-center shrink-0 border border-zinc-700 aspect-square overflow-hidden">
                                            <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${activeArtistData.releases.find(r => r.id === song.releaseId)?.coverArt || activeArtist.image})` }}></div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm truncate text-white">{song.title}</p>
                                            <p className="text-xs text-zinc-400 mt-1">{formatNumber(Math.max(1, Math.floor((song.streams || 0) * 0.005)))} videos</p>
                                        </div>
                                    </div>
                                ))}
                                {releasedSongs.length === 0 && (
                                    <div className="mt-12 flex flex-col items-center text-center px-8 text-zinc-500">
                                        <MusicNoteIcon className="w-12 h-12 mb-2 opacity-50" />
                                        <p className="font-bold text-lg mb-1">No sounds yet</p>
                                        <p className="text-sm">Release songs to see them here</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {profileTab === 'liked' && (
                            <div className="mt-20 flex flex-col items-center text-center px-8 text-zinc-500">
                                <HeartIcon className="w-12 h-12 mb-2 opacity-50" />
                                <p className="font-bold text-lg mb-1">Only you can see which videos you liked</p>
                            </div>
                        )}
                    </div>
                )}

                {/* CHARTS TAB */}
                {currentTab === 'charts' && (
                    <div className="w-full h-full bg-white text-black overflow-y-auto flex-shrink-0">
                        {/* Header */}
                        <div className="flex flex-col px-4 pt-10 pb-2 relative overflow-hidden">
                            <button onClick={() => setCurrentTab('profile')} className="mb-6 relative z-10 w-fit"><ArrowLeftIcon className="w-7 h-7 text-black drop-shadow-md" /></button>
                            <div className="flex relative z-10 w-full mb-2">
                                <div>
                                    <h1 className="text-5xl font-black leading-none tracking-tight flex flex-col items-start gap-1">
                                        <div className="flex items-center text-lg gap-1 border-b-2 border-black pb-1 mb-1 font-sans font-bold">
                                            <TikTokIcon className="w-5 h-5 text-black"/> TikTok
                                        </div>
                                        <span>Music</span>
                                        <span>Charts</span>
                                    </h1>
                                </div>
                                <div className="absolute right-[-10px] top-[-30px] w-40 h-40 opacity-90">
                                    <img src={activeArtist.image} className="w-full h-full object-cover" style={{ borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%' }} />
                                </div>
                            </div>
                        </div>
                        
                        {/* Tabs */}
                        <div className="flex px-4 border-b border-zinc-200 text-lg font-bold gap-6 mt-2 relative">
                            <button onClick={() => setChartsTab('top50')} className={`pb-2 transition-colors ${chartsTab === 'top50' ? 'border-b-2 border-black text-black' : 'text-zinc-400 hover:text-zinc-600'}`}>Top 50</button>
                            <button onClick={() => setChartsTab('viral50')} className={`pb-2 transition-colors ${chartsTab === 'viral50' ? 'border-b-2 border-black text-black' : 'text-zinc-400 hover:text-zinc-600'}`}>Viral 50</button>
                            <div className="ml-auto text-sm text-zinc-600 font-semibold flex items-center justify-center bg-zinc-100 rounded-full h-8 px-4 cursor-pointer mt-0 mb-2 border border-zinc-200">
                                US <ChevronDownIcon className="w-4 h-4 ml-1 opacity-70" />
                            </div>
                        </div>
                        
                        {/* List */}
                        <div className="pb-24">
                            {(chartsTab === 'top50' ? top50 : viral50).map(entry => (
                                <div key={entry.uniqueId} className="py-4 border-b border-zinc-100 px-4">
                                    <div className="flex items-center">
                                        <div className="w-8 flex flex-col items-center mr-2 relative z-10">
                                            <span className="font-bold text-lg leading-tight">{entry.rank}</span>
                                            {entry.isNew ? (
                                                <span className="text-[#25F4EE] text-3xl leading-[0] mt-[-10px] drop-shadow-sm">.</span>
                                            ) : (
                                                <span className="text-zinc-300 text-3xl leading-[0] mt-[-10px]">-</span>
                                            )}
                                        </div>
                                        <img src={entry.coverArt} className="w-14 h-14 rounded-lg object-cover mr-3 bg-zinc-100 shadow-sm" />
                                        <div className="flex-1 min-w-0 pr-2 pb-1">
                                            <p className="font-bold truncate text-[17px] leading-tight text-black">{entry.title}</p>
                                            <div className="flex items-center gap-2 text-sm mt-0.5">
                                                <span className="truncate text-zinc-500 font-medium">{entry.artist}</span>
                                                {entry.isNew && <span className="text-[#FE2C55] font-bold text-[11px] tracking-wider uppercase ml-1">New</span>}
                                            </div>
                                        </div>
                                        <button className="bg-[#FE2C55] p-2.5 rounded-xl flex-shrink-0 ml-1 shadow-md shadow-red-500/20 hover:bg-[#E0264B] transition-colors relative">
                                            <VideoIcon className="w-6 h-6 text-white" />
                                        </button>
                                    </div>
                                    
                                    {entry.tiktokVideos && entry.tiktokVideos.length > 0 && (
                                        <div className="mt-4 flex gap-2 overflow-hidden w-full pl-12 pr-2">
                                            {entry.tiktokVideos.slice(0, 2).map((v: any, idx: number) => (
                                                <div key={idx} className="relative flex-1 aspect-[9/16] bg-zinc-900 rounded-xl overflow-hidden group shadow-md cursor-pointer" onClick={() => setSelectedVideo(v)}>
                                                    <img src={v.thumbnail || activeArtist.image} className="w-full h-full object-cover opacity-90 transition-transform group-hover:scale-105 duration-300" />
                                                    <div className="absolute bottom-2 left-2 flex items-center text-xs font-bold text-white drop-shadow-md z-10">
                                                        <HeartIcon className="w-4 h-4 mr-1 text-white opacity-90 drop-shadow-sm" />
                                                        {formatNumber(v.likes)}
                                                    </div>
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-90 pointer-events-none"></div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                            {chartsTab === 'top50' && top50.length === 0 && (
                                <div className="p-8 text-center text-zinc-500 font-semibold mt-10">Chart calculating...</div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Nav */}
            <div className="absolute bottom-0 w-full bg-black border-t border-zinc-800 z-30 px-2 py-2 flex justify-between items-center text-xs font-semibold text-zinc-400">
                <button onClick={() => setCurrentTab('foryou')} className={`flex flex-col items-center flex-1 ${currentTab === 'foryou' ? 'text-white' : ''}`}>
                    <HomeIcon className="w-6 h-6 mb-1"/>
                    Home
                </button>
                <div className="flex-1"></div>
                <button onClick={() => setCurrentTab('create')} className="flex flex-col items-center flex-shrink-0 relative top-[-10px]">
                    <div className="bg-[#25F4EE] w-[46px] h-[30px] rounded-lg absolute -left-1"></div>
                    <div className="bg-[#FE2C55] w-[46px] h-[30px] rounded-lg absolute -right-1"></div>
                    <div className="bg-white w-[46px] h-[30px] rounded-lg relative z-10 flex items-center justify-center text-black">
                        <PlusIcon className="w-5 h-5"/>
                    </div>
                </button>
                <div className="flex-1"></div>
                <button onClick={() => setCurrentTab('profile')} className={`flex flex-col items-center flex-1 ${currentTab === 'profile' ? 'text-white' : ''}`}>
                    <UserIcon className="w-6 h-6 mb-1"/>
                    Profile
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

export default TikTokView;
