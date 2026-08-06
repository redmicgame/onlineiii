import React, { useState, useEffect } from 'react';
import { useGame, formatNumber } from '../context/GameContext';
import { useFirebase } from '../context/FirebaseContext';
import { 
    getOnlinePlayers, 
    registerOnlinePlayer, 
    publishGlobalSong, 
    getGlobalSongs, 
    subscribeToGlobalSongs,
    publishGlobalPost, 
    getGlobalPosts, 
    createContractOffer, 
    getContractOffers, 
    updateContractOffer, 
    publishMediaArticle, 
    getMediaArticles,
    resetAllGameAccountsAndData
} from '../firebase';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import GlobeAltIcon from './icons/GlobeAltIcon';

type SubTab = 'players' | 'releases' | 'marketplace' | 'media';

const OnlineHubView: React.FC = () => {
    const { gameState, activeArtist, activeArtistData, dispatch } = useGame();
    const { user, login } = useFirebase();

    const [activeSubTab, setActiveSubTab] = useState<SubTab>('players');
    const [loading, setLoading] = useState(false);

    // 1. Players Directory
    const [onlinePlayers, setOnlinePlayers] = useState<any[]>([]);
    const [roleFilter, setRoleFilter] = useState('All');
    const [selectedPlayer, setSelectedPlayer] = useState<any | null>(null);

    // 1b. Global Releases
    const [globalReleases, setGlobalReleases] = useState<any[]>([]);

    useEffect(() => {
        const unsub = subscribeToGlobalSongs((songs) => {
            if (songs) {
                setGlobalReleases(songs);
            }
        });
        return () => unsub();
    }, []);

    // 2. Contracts & Offers
    const [receivedContracts, setReceivedContracts] = useState<any[]>([]);
    const [showNewOfferModal, setShowNewOfferModal] = useState(false);
    const [offerTargetPlayer, setOfferTargetPlayer] = useState<any | null>(null);
    const [offerType, setOfferType] = useState<'Label Deal' | 'Beat License' | 'Feature Request' | 'Promo Campaign'>('Label Deal');
    const [offerAdvance, setOfferAdvance] = useState(100000);
    const [offerRoyalty, setOfferRoyalty] = useState(20);
    const [offerDetails, setOfferDetails] = useState('');

    // 3. Media & Press
    const [mediaArticles, setMediaArticles] = useState<any[]>([]);
    const [showNewArticleModal, setShowNewArticleModal] = useState(false);
    const [articlePublication, setArticlePublication] = useState('Pitchfork');
    const [articleHeadline, setArticleHeadline] = useState('');
    const [articleBody, setArticleBody] = useState('');
    const [articleTargetArtist, setArticleTargetArtist] = useState('');
    const [articleRating, setArticleRating] = useState(8.5);

    // Register / Update online player on load
    useEffect(() => {
        if (user && activeArtist) {
            registerOnlinePlayer(user.uid, {
                name: activeArtist.name,
                roles: ['Musician', 'Producer'],
                country: activeArtist.country || 'US',
                fandomName: activeArtist.fandomName,
                avatar: activeArtist.image,
                email: user.email || ''
            });
        }
    }, [user, activeArtist]);

    // Load tab data
    const loadData = async () => {
        setLoading(true);
        if (activeSubTab === 'players') {
            const players = await getOnlinePlayers();
            setOnlinePlayers(players);
        } else if (activeSubTab === 'marketplace') {
            if (user) {
                const contracts = await getContractOffers(user.uid);
                setReceivedContracts(contracts);
            }
        } else if (activeSubTab === 'media') {
            const articles = await getMediaArticles(30);
            setMediaArticles(articles);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, [activeSubTab, user]);

    // Send Contract Offer
    const handleSendOffer = async () => {
        if (!user || !offerTargetPlayer) return;
        await createContractOffer({
            fromUserId: user.uid,
            fromName: activeArtist?.name || 'Anonymous Artist',
            fromRole: 'Musician/Label',
            toUserId: offerTargetPlayer.userId || offerTargetPlayer.id,
            toName: offerTargetPlayer.name,
            type: offerType,
            advanceAmount: offerAdvance,
            royaltySplit: offerRoyalty,
            details: offerDetails
        });
        alert(`Offer sent to ${offerTargetPlayer.name}!`);
        setShowNewOfferModal(false);
        setOfferDetails('');
    };

    // Accept or Decline Contract
    const handleContractAction = async (contractId: string, status: 'accepted' | 'declined', advance: number) => {
        await updateContractOffer(contractId, status);
        if (status === 'accepted') {
            dispatch({ type: 'UPDATE_MONEY', payload: advance });
            dispatch({ type: 'ADD_MESSAGE', payload: `Accepted contract offer and received $${formatNumber(advance)} advance!` });
        }
        loadData();
    };

    // Publish song to global billboard
    const handlePublishSong = async (song: any) => {
        if (!user || !activeArtist) return;
        setPublishingSong(true);
        await publishGlobalSong({
            title: song.title,
            artistName: activeArtist.name,
            artistId: user.uid,
            genre: song.genre || 'Pop',
            coverUrl: song.coverArt || activeArtist.image,
            streams: song.streams || 0,
            weeklyStreams: song.lastWeekStreams || song.streams || 10000,
            releaseYear: gameState.date.year,
            releaseWeek: gameState.date.week
        });
        alert(`"${song.title}" is now published to the Global Billboard Charts!`);
        setPublishingSong(false);
        loadData();
    };

    // Create Live Social Post
    const handlePostSocial = async () => {
        if (!user || !postContent.trim() || !activeArtist) return;
        await publishGlobalPost({
            authorId: user.uid,
            authorName: activeArtist.name,
            authorHandle: `@${activeArtist.name.toLowerCase().replace(/\s/g, '')}`,
            authorAvatar: activeArtist.image,
            platform: postPlatform,
            content: postContent,
            mediaUrl: activeArtist.image
        });
        setPostContent('');
        loadData();
    };

    // Create Media Article
    const handlePublishArticle = async () => {
        if (!user || !articleHeadline.trim() || !articleBody.trim() || !activeArtist) return;
        await publishMediaArticle({
            authorId: user.uid,
            authorName: activeArtist.name,
            publicationName: articlePublication,
            headline: articleHeadline,
            body: articleBody,
            targetPlayerName: articleTargetArtist,
            rating: articleRating,
            coverUrl: activeArtist.image
        });
        setShowNewArticleModal(false);
        setArticleHeadline('');
        setArticleBody('');
        setArticleTargetArtist('');
        loadData();
    };

    const filteredPlayers = onlinePlayers.filter(p => {
        if (roleFilter === 'All') return true;
        return (p.roles || []).includes(roleFilter);
    });

    return (
        <div className="flex flex-col h-full bg-zinc-950 text-white">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => dispatch({ type: 'CHANGE_VIEW', payload: 'game' })}
                        className="p-2 -ml-2 rounded-full hover:bg-zinc-800 transition-colors"
                    >
                        <ChevronLeftIcon className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-lg font-black tracking-tight flex items-center gap-2">
                            <GlobeAltIcon className="w-5 h-5 text-red-500 animate-pulse" /> Global Online World
                        </h1>
                        <p className="text-[11px] text-zinc-400">Live multi-player network & marketplace</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={async () => {
                            if (window.confirm("Are you sure you want to reset all accounts and server data to start fresh?")) {
                                await resetAllGameAccountsAndData();
                                window.location.reload();
                            }
                        }}
                        className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold px-3 py-1.5 rounded-lg border border-zinc-700 transition-all"
                    >
                        🔄 Reset Server Data
                    </button>
                    {!user && (
                        <button 
                            onClick={login}
                            className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md transition-all"
                        >
                            Sign In to Sync
                        </button>
                    )}
                </div>
            </div>

            {/* Sub-Tab Selector */}
            <div className="flex border-b border-zinc-800 bg-zinc-900/60 overflow-x-auto no-scrollbar">
                {[
                    { id: 'players', label: '🌐 Directory', desc: 'Online Players' },
                    { id: 'releases', label: '🎵 Global Releases', desc: 'Online Music Drops' },
                    { id: 'marketplace', label: '📜 Marketplace', desc: 'Contracts & Deals' },
                    { id: 'media', label: '📰 Media Press', desc: 'Reviews & News' },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveSubTab(tab.id as SubTab)}
                        className={`flex-1 min-w-[100px] py-2.5 px-3 text-center border-b-2 transition-all ${
                            activeSubTab === tab.id 
                                ? 'border-red-500 text-red-400 bg-red-950/20 font-bold' 
                                : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                        }`}
                    >
                        <span className="text-xs block font-extrabold whitespace-nowrap">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Main Tab Body */}
            <div className="flex-1 overflow-y-auto p-4 pb-24">
                {loading ? (
                    <div className="flex justify-center items-center h-48">
                        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <>
                        {/* TAB 1: ONLINE PLAYERS DIRECTORY */}
                        {activeSubTab === 'players' && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Filter Role</span>
                                    <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
                                        {['All', 'Musician', 'Producer', 'Label Head', 'Media'].map(role => (
                                            <button
                                                key={role}
                                                onClick={() => setRoleFilter(role)}
                                                className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-all ${
                                                    roleFilter === role 
                                                        ? 'bg-red-600 text-white shadow-md' 
                                                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                                                }`}
                                            >
                                                {role}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {filteredPlayers.length === 0 ? (
                                    <div className="text-center py-12 bg-zinc-900/50 rounded-2xl border border-zinc-800/80 p-6">
                                        <p className="text-zinc-400 text-sm font-medium">No players registered under this filter yet.</p>
                                        <p className="text-zinc-500 text-xs mt-1">Be the first to create music and register!</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {filteredPlayers.map(player => (
                                            <div key={player.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between hover:border-zinc-700 transition-all shadow-md">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="relative">
                                                        <img 
                                                            src={player.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(player.name)} 
                                                            alt="" 
                                                            className="w-12 h-12 rounded-full object-cover border-2 border-zinc-700"
                                                        />
                                                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-zinc-900 rounded-full"></span>
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h3 className="font-extrabold text-white text-sm truncate flex items-center gap-1.5">
                                                            {player.name}
                                                            {player.country && <span className="text-xs text-zinc-500 font-normal">({player.country})</span>}
                                                        </h3>
                                                        <div className="flex gap-1.5 mt-1 flex-wrap">
                                                            {(player.roles || ['Musician']).map((r: string) => (
                                                                <span key={r} className="text-[10px] bg-red-950/80 text-red-300 border border-red-800/50 px-1.5 py-0.5 rounded-md font-bold">
                                                                    {r}
                                                                </span>
                                                            ))}
                                                        </div>
                                                        {player.fandomName && (
                                                            <p className="text-[11px] text-zinc-400 mt-1 italic">Fans: {player.fandomName}</p>
                                                        )}
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => {
                                                        setOfferTargetPlayer(player);
                                                        setShowNewOfferModal(true);
                                                    }}
                                                    className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-3 py-2 rounded-xl transition-all shadow-lg shrink-0"
                                                >
                                                    Send Offer
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB 1b: GLOBAL ONLINE RELEASES */}
                        {activeSubTab === 'releases' && (
                            <div className="space-y-4">
                                <div className="bg-gradient-to-r from-red-950/60 to-zinc-900 border border-red-800/40 p-4 rounded-2xl flex justify-between items-center">
                                    <div>
                                        <h2 className="font-extrabold text-white text-base">🌐 Real-time Online Releases</h2>
                                        <p className="text-xs text-zinc-400 mt-0.5">Every song released by online players is synchronized live across all servers.</p>
                                    </div>
                                    <button 
                                        onClick={() => {
                                            if (!activeArtistData?.songs) return;
                                            const released = activeArtistData.songs.filter(s => s.isReleased);
                                            released.forEach(s => {
                                                publishGlobalSong({
                                                    id: s.id,
                                                    songId: s.id,
                                                    title: s.title,
                                                    artistName: activeArtist?.name || 'Online Player',
                                                    artistId: gameState.activeArtistId || 'player',
                                                    coverUrl: s.coverArt || activeArtistData.paparazziPhotos?.[0]?.url,
                                                    genre: s.genre || 'Pop',
                                                    streams: s.streams || 0,
                                                    weeklyStreams: s.lastWeekStreams || s.weeklyStreams || 10000,
                                                    releaseYear: gameState.date.year,
                                                    releaseWeek: gameState.date.week,
                                                    isOnlinePlayer: true
                                                });
                                            });
                                            alert(`Synced ${released.length} released songs to the global servers!`);
                                        }}
                                        className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all shadow-lg shrink-0 flex items-center gap-1.5"
                                    >
                                        <span>⚡</span> Sync My Songs
                                    </button>
                                </div>

                                {globalReleases.length === 0 ? (
                                    <div className="text-center py-12 bg-zinc-900/50 rounded-2xl border border-zinc-800/80 p-6">
                                        <p className="text-zinc-400 text-sm font-medium">No online player releases synced yet.</p>
                                        <p className="text-zinc-500 text-xs mt-1">Release a song or click "Sync My Songs" above to publish your music!</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2.5">
                                        {globalReleases.map((song, idx) => (
                                            <div key={song.id || song.songId || idx} className="bg-zinc-900 border border-zinc-800/90 rounded-2xl p-3.5 flex items-center justify-between hover:border-zinc-700 transition-all shadow-md">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <span className="text-xs font-black text-zinc-500 w-5 text-center">#{idx + 1}</span>
                                                    <img 
                                                        src={song.coverUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(song.artistName || 'Song')}&background=random&color=fff&size=150`} 
                                                        alt="" 
                                                        className="w-12 h-12 rounded-xl object-cover border border-zinc-700 shrink-0 shadow"
                                                    />
                                                    <div className="min-w-0">
                                                        <h3 className="font-extrabold text-white text-sm truncate flex items-center gap-2">
                                                            {song.title}
                                                            <span className="bg-red-500/20 text-red-400 text-[10px] px-1.5 py-0.5 rounded-md font-bold border border-red-500/30">
                                                                🎮 Online
                                                            </span>
                                                        </h3>
                                                        <p className="text-xs text-zinc-400 font-medium truncate">{song.artistName}</p>
                                                        <div className="flex items-center gap-3 text-[11px] text-zinc-500 mt-0.5">
                                                            <span>Genre: <strong className="text-zinc-300">{song.genre || 'Pop'}</strong></span>
                                                            {song.releaseYear && <span>Released: <strong className="text-zinc-300">W{song.releaseWeek}, {song.releaseYear}</strong></span>}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="text-right shrink-0">
                                                    <div className="text-sm font-black text-emerald-400">
                                                        {formatNumber(song.weeklyStreams || song.streams || 0)}
                                                    </div>
                                                    <div className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
                                                        Weekly Streams
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB 2: MARKETPLACE & CONTRACTS */}
                        {activeSubTab === 'marketplace' && (
                            <div className="space-y-4">
                                <div className="bg-gradient-to-r from-red-900/30 to-zinc-900 border border-red-800/40 p-4 rounded-2xl flex justify-between items-center">
                                    <div>
                                        <h2 className="font-extrabold text-white text-base">Player-to-Player Contract System</h2>
                                        <p className="text-xs text-zinc-400 mt-0.5">Offer label deals, beat licenses, and feature requests to online players worldwide.</p>
                                    </div>
                                    <button 
                                        onClick={() => {
                                            if (onlinePlayers.length > 0) {
                                                setOfferTargetPlayer(onlinePlayers[0]);
                                                setShowNewOfferModal(true);
                                            } else {
                                                alert("No online players available to receive offers right now.");
                                            }
                                        }}
                                        className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all shadow-lg shrink-0"
                                    >
                                        + New Offer
                                    </button>
                                </div>

                                <h3 className="font-bold text-sm text-zinc-300 uppercase tracking-wider mt-4">Inbox Offers</h3>
                                {receivedContracts.length === 0 ? (
                                    <div className="text-center py-12 bg-zinc-900/40 rounded-2xl border border-zinc-800 p-6 text-zinc-500 text-xs">
                                        No active contract offers received from other players yet.
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {receivedContracts.map(c => (
                                            <div key={c.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                                            {c.type}
                                                        </span>
                                                        <h4 className="font-extrabold text-white text-sm mt-1.5">From: {c.fromName}</h4>
                                                    </div>
                                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg capitalize ${
                                                        c.status === 'accepted' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                                                        c.status === 'declined' ? 'bg-red-950 text-red-400 border border-red-800' :
                                                        'bg-zinc-800 text-amber-400 border border-amber-500/30'
                                                    }`}>
                                                        {c.status}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-2 gap-2 bg-zinc-950/60 p-2.5 rounded-xl text-xs">
                                                    <div>
                                                        <span className="text-zinc-500 text-[10px] block">Advance</span>
                                                        <span className="font-bold text-emerald-400">${formatNumber(c.advanceAmount)}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-zinc-500 text-[10px] block">Royalty Share</span>
                                                        <span className="font-bold text-white">{c.royaltySplit}%</span>
                                                    </div>
                                                </div>

                                                {c.details && <p className="text-xs text-zinc-400 italic">"{c.details}"</p>}

                                                {c.status === 'pending' && (
                                                    <div className="flex gap-2 pt-1">
                                                        <button 
                                                            onClick={() => handleContractAction(c.id, 'accepted', c.advanceAmount)}
                                                            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 rounded-xl transition-all"
                                                        >
                                                            Accept & Sign
                                                        </button>
                                                        <button 
                                                            onClick={() => handleContractAction(c.id, 'declined', 0)}
                                                            className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs py-2 rounded-xl transition-all"
                                                        >
                                                            Decline
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB 3: MEDIA & PRESS NETWORK */}
                        {activeSubTab === 'media' && (
                            <div className="space-y-4">
                                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex justify-between items-center">
                                    <div>
                                        <h2 className="font-extrabold text-white text-base">Player Press & Media Network</h2>
                                        <p className="text-xs text-zinc-400">Publish or read player reviews on Pitchfork, Billboard, Rolling Stone & Vogue.</p>
                                    </div>
                                    <button 
                                        onClick={() => setShowNewArticleModal(true)}
                                        className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all shadow-lg shrink-0"
                                    >
                                        + Write Article
                                    </button>
                                </div>

                                {mediaArticles.length === 0 ? (
                                    <div className="text-center py-12 bg-zinc-900/40 rounded-2xl border border-zinc-800 p-6 text-zinc-500 text-xs">
                                        No player press articles published yet. Be the first journalist to review a player album!
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {mediaArticles.map(a => (
                                            <div key={a.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-950/60 border border-amber-800/40 px-2 py-0.5 rounded-md">
                                                        {a.publicationName}
                                                    </span>
                                                    {a.rating && (
                                                        <span className="text-xs font-black text-red-400 bg-red-950/50 border border-red-800/40 px-2 py-0.5 rounded-md">
                                                            ★ {a.rating} / 10
                                                        </span>
                                                    )}
                                                </div>

                                                <h3 className="font-extrabold text-white text-sm leading-snug">{a.headline}</h3>
                                                <p className="text-xs text-zinc-300 leading-relaxed">{a.body}</p>

                                                <div className="pt-2 border-t border-zinc-800/60 flex justify-between items-center text-[11px] text-zinc-500">
                                                    <span>By: {a.authorName}</span>
                                                    {a.targetPlayerName && <span>Subject: {a.targetPlayerName}</span>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* SEND CONTRACT OFFER MODAL */}
            {showNewOfferModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl">
                        <div className="flex justify-between items-center">
                            <h3 className="font-extrabold text-white text-base">Send Contract Offer</h3>
                            <button onClick={() => setShowNewOfferModal(false)} className="text-zinc-400 hover:text-white font-bold text-lg">✕</button>
                        </div>

                        <div>
                            <label className="text-xs text-zinc-400 font-bold block mb-1">Target Player</label>
                            <select 
                                value={offerTargetPlayer?.id || ''} 
                                onChange={e => {
                                    const found = onlinePlayers.find(p => p.id === e.target.value || p.userId === e.target.value);
                                    if (found) setOfferTargetPlayer(found);
                                }}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white"
                            >
                                {onlinePlayers.map(p => (
                                    <option key={p.id} value={p.id}>{p.name} ({p.country || 'Global'})</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-xs text-zinc-400 font-bold block mb-1">Contract Type</label>
                            <select 
                                value={offerType} 
                                onChange={e => setOfferType(e.target.value as any)}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white"
                            >
                                <option value="Label Deal">Label Record Deal</option>
                                <option value="Beat License">Beat License Sale</option>
                                <option value="Feature Request">Song Feature Request</option>
                                <option value="Promo Campaign">PR & Marketing Campaign</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs text-zinc-400 font-bold block mb-1">Advance ($)</label>
                                <input 
                                    type="number" 
                                    value={offerAdvance} 
                                    onChange={e => setOfferAdvance(Number(e.target.value))}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-zinc-400 font-bold block mb-1">Royalty Split (%)</label>
                                <input 
                                    type="number" 
                                    value={offerRoyalty} 
                                    onChange={e => setOfferRoyalty(Number(e.target.value))}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-zinc-400 font-bold block mb-1">Details / Terms</label>
                            <textarea 
                                value={offerDetails} 
                                onChange={e => setOfferDetails(e.target.value)}
                                placeholder="Describe contract requirements, album quota, or beats..."
                                rows={3}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white"
                            />
                        </div>

                        <div className="flex gap-2 pt-2">
                            <button 
                                onClick={handleSendOffer}
                                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold text-xs py-2.5 rounded-xl transition-all"
                            >
                                Confirm & Send
                            </button>
                            <button 
                                onClick={() => setShowNewOfferModal(false)}
                                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs px-4 py-2.5 rounded-xl transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* WRITE MEDIA ARTICLE MODAL */}
            {showNewArticleModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl">
                        <div className="flex justify-between items-center">
                            <h3 className="font-extrabold text-white text-base">Write Press Article</h3>
                            <button onClick={() => setShowNewArticleModal(false)} className="text-zinc-400 hover:text-white font-bold text-lg">✕</button>
                        </div>

                        <div>
                            <label className="text-xs text-zinc-400 font-bold block mb-1">Publication</label>
                            <select 
                                value={articlePublication} 
                                onChange={e => setArticlePublication(e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white"
                            >
                                <option>Pitchfork</option>
                                <option>Billboard</option>
                                <option>Rolling Stone</option>
                                <option>Vogue</option>
                                <option>TMZ</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-xs text-zinc-400 font-bold block mb-1">Headline</label>
                            <input 
                                type="text" 
                                value={articleHeadline} 
                                onChange={e => setArticleHeadline(e.target.value)}
                                placeholder="e.g. Album Review: A Groundbreaking Masterpiece"
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white"
                            />
                        </div>

                        <div>
                            <label className="text-xs text-zinc-400 font-bold block mb-1">Target Artist Name (Optional)</label>
                            <input 
                                type="text" 
                                value={articleTargetArtist} 
                                onChange={e => setArticleTargetArtist(e.target.value)}
                                placeholder="e.g. Drake, Taylor Swift, or Player Name"
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white"
                            />
                        </div>

                        <div>
                            <label className="text-xs text-zinc-400 font-bold block mb-1">Rating (out of 10)</label>
                            <input 
                                type="number" 
                                step="0.1" 
                                min="0" 
                                max="10" 
                                value={articleRating} 
                                onChange={e => setArticleRating(Number(e.target.value))}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white"
                            />
                        </div>

                        <div>
                            <label className="text-xs text-zinc-400 font-bold block mb-1">Article Content</label>
                            <textarea 
                                value={articleBody} 
                                onChange={e => setArticleBody(e.target.value)}
                                placeholder="Write your review or news article here..."
                                rows={4}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white"
                            />
                        </div>

                        <div className="flex gap-2 pt-2">
                            <button 
                                onClick={handlePublishArticle}
                                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold text-xs py-2.5 rounded-xl transition-all"
                            >
                                Publish Article
                            </button>
                            <button 
                                onClick={() => setShowNewArticleModal(false)}
                                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs px-4 py-2.5 rounded-xl transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OnlineHubView;
