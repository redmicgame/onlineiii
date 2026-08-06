import React from 'react';
import { useGame, formatNumber } from '../context/GameContext';
import { XPost, XUser } from '../types';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import UserVerifiedBadge from './icons/UserVerifiedBadge';
import MessageIcon from './icons/MessageIcon';
import CommentIcon from './icons/CommentIcon';
import RetweetIcon from './icons/RetweetIcon';
import HeartIcon from './icons/HeartIcon';
import ChartBarIcon from './icons/ChartBarIcon';
import { ComposeXPostModal, Post } from './XView';

const XProfileView: React.FC = () => {
    const { gameState, dispatch, activeArtistData } = useGame();
    const [quotePostTarget, setQuotePostTarget] = React.useState<XPost | null>(null);
    const [showAbout, setShowAbout] = React.useState(false);
    const [showPremiumModal, setShowPremiumModal] = React.useState(false);
    const [isEditing, setIsEditing] = React.useState(false);
    const [editName, setEditName] = React.useState('');
    const [editBio, setEditBio] = React.useState('');
    const [editHeader, setEditHeader] = React.useState('');
    const [editAvatar, setEditAvatar] = React.useState('');
    const { selectedXUserId } = gameState;
    const { xUsers, xPosts, xFollowingIds, xSuspensionStatus, selectedPlayerXUserId } = activeArtistData!;

    const user = xUsers.find(u => u.id === selectedXUserId);
    const playerUser = selectedPlayerXUserId ? xUsers.find(u => u.id === selectedPlayerXUserId) : xUsers.find(u => u.isPlayer);
    const userPosts = xPosts
        .filter(p => p.authorId === selectedXUserId)
        .sort((a, b) => {
            const dateA = a.date.year * 52 + a.date.week;
            const dateB = b.date.year * 52 + b.date.week;
            return dateB - dateA;
        }).slice(0, 20);

    const isFollowing = user ? xFollowingIds.includes(user.id) : false;

    const handleFollow = () => {
        if (!user) return;
        if (isFollowing) {
            dispatch({ type: 'UNFOLLOW_X_USER', payload: user.id });
        } else {
            dispatch({ type: 'FOLLOW_X_USER', payload: user.id });
        }
    };
    
    const handleEditProfile = () => {
        if (!user) return;
        setEditName(user.name);
        setEditBio(user.bio || '');
        setEditHeader(user.headerImage || '');
        setEditAvatar(user.avatar || '');
        setIsEditing(true);
    };

    const handleSaveProfile = () => {
        if (!user) return;
        dispatch({ type: 'EDIT_X_PROFILE', payload: { userId: user.id, name: editName, bio: editBio, headerImage: editHeader, avatar: editAvatar } });
        setIsEditing(false);
    };

    const handleMessage = () => {
        if (!user || !isFollowing) return;
        const chat = activeArtistData!.xChats.find(c => !c.isGroup && c.participants.includes(user.id));
        if (chat) {
            dispatch({ type: 'VIEW_X_CHAT', payload: chat.id });
        } else {
            // Future: Implement DM creation
            alert("No direct message found with this user.");
        }
    };

    if (!user) {
        return <div className="p-4">User not found. <button onClick={() => dispatch({ type: 'CHANGE_VIEW', payload: 'x' })}>Back</button></div>;
    }

    return (
        <div className="bg-black text-white h-full overflow-y-auto w-full pb-24">
            <header className="sticky top-0 bg-black/80 backdrop-blur-sm z-20 p-3 flex items-center gap-4">
                <button onClick={() => dispatch({ type: 'CHANGE_VIEW', payload: 'x' })} className="p-2 rounded-full hover:bg-zinc-800">
                    <ArrowLeftIcon className="w-5 h-5" />
                </button>
                <div>
                    <h2 className="font-bold text-lg">{user.name}</h2>
                    <p className="text-xs text-zinc-500">{userPosts.length} posts</p>
                </div>
            </header>
            
            {user.isPlayer && xSuspensionStatus?.isSuspended && xSuspensionStatus.accountId === user.id && (
                <div className="bg-zinc-800 p-3 text-center text-sm text-zinc-300">
                    <strong>Account suspended</strong>
                    <p className="text-xs">X suspends accounts which violate the X Rules.</p>
                </div>
            )}

            <div className="h-32 bg-zinc-800 relative bg-cover bg-center" style={{ backgroundImage: user.headerImage ? `url(${user.headerImage})` : undefined }}>
            </div>
            <div className="p-3">
                <div className="flex justify-between items-start -mt-14">
                    <img src={user.avatar} alt={user.name} className="w-28 h-28 rounded-full object-cover border-4 border-black relative z-10" />
                    <div className="flex items-center gap-2 pt-14">
                        {!user.isPlayer ? (
                             <>
                                {isFollowing && (
                                    <button onClick={handleMessage} className="border border-zinc-600 rounded-full p-2 hover:bg-zinc-800">
                                        <MessageIcon className="w-5 h-5"/>
                                    </button>
                                )}
                                <button 
                                    onClick={handleFollow}
                                    className={`font-bold px-4 py-1.5 rounded-full text-sm ${isFollowing ? 'bg-transparent text-white border border-zinc-600' : 'bg-white text-black'}`}
                                >
                                    {isFollowing ? 'Following' : 'Follow'}
                                </button>
                             </>
                        ) : (
                            <>
                                <button 
                                    onClick={handleEditProfile}
                                    className="border border-zinc-600 rounded-full px-4 py-1.5 font-bold text-sm hover:bg-zinc-800"
                                >
                                    Edit Profile
                                </button>
                                {!user.isVerified && (
                                    <button 
                                        onClick={() => setShowPremiumModal(true)}
                                        className="font-bold px-4 py-1.5 rounded-full text-sm text-black bg-white"
                                    >
                                        Get Verified
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>

                <div className="mt-3">
                    <div className="flex items-center gap-1">
                        <h1 className="text-xl font-bold">{user.name}</h1>
                                <UserVerifiedBadge isVerified={user.isVerified} className="w-5 h-5 flex-shrink-0" />
                    </div>
                    <button onClick={() => setShowAbout(true)} className="text-zinc-500 hover:text-white transition-colors">@{user.username}</button>
                    {user.bio && <p className="mt-2">{user.bio}</p>}
                    <div className="flex gap-4 text-sm text-zinc-500 mt-2">
                        <p><span className="font-bold text-white">{formatNumber(user.followingCount)}</span> Following</p>
                        <p><span className="font-bold text-white">{formatNumber(user.followersCount)}</span> Followers</p>
                    </div>
                    {user.isPlayer && (
                        <div className="flex gap-2 mt-3">
                            <button 
                                onClick={() => dispatch({ type: 'CHANGE_VIEW', payload: 'xAnalytics' })}
                                className="flex-1 flex items-center justify-center gap-2 border border-zinc-700 py-1.5 rounded-full text-sm font-bold hover:bg-zinc-900 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                                Analytics
                            </button>
                            <button 
                                onClick={() => dispatch({ type: 'CHANGE_VIEW', payload: 'xCreatorStudio' })}
                                className="flex-1 flex items-center justify-center gap-2 border border-zinc-700 py-1.5 rounded-full text-sm font-bold hover:bg-zinc-900 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Monetization
                            </button>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="border-b border-zinc-700/70 mt-3">
                <div className="flex justify-around">
                    <div className="flex-1 text-center font-bold p-3 border-b-2 border-blue-500">Posts</div>
                </div>
            </div>

            <div>
                {userPosts.map(post => <Post key={post.id} post={post} author={user} onQuote={setQuotePostTarget} />)}
            </div>

            {quotePostTarget && playerUser && (
                <ComposeXPostModal 
                    user={playerUser}
                    quotePost={quotePostTarget}
                    onClose={() => setQuotePostTarget(null)}
                    onPost={(payload) => {
                        dispatch({ type: 'POST_ON_X', payload });
                        setQuotePostTarget(null);
                    }}
                />
            )}

            {showAbout && (
                <div className="fixed inset-0 bg-black/80 flex justify-center items-center p-4 z-50">
                    <div className="bg-black border border-zinc-800 rounded-3xl w-full max-w-sm flex flex-col">
                        <header className="p-4 flex items-center gap-6 pb-2">
                            <button onClick={() => setShowAbout(false)}><ArrowLeftIcon className="w-5 h-5 text-white"/></button>
                            <h2 className="font-bold text-xl">About this account</h2>
                        </header>
                        <div className="flex flex-col items-center mt-6">
                            <img src={user.avatar} className="w-20 h-20 rounded-full object-cover filter grayscale" alt={user.name} />
                            <h3 className="font-bold text-lg mt-3 flex items-center gap-1">{user.name} <UserVerifiedBadge isVerified={user.isVerified} className="w-5 h-5" /></h3>
                            <p className="text-zinc-500">@{user.username}</p>
                            <p className="font-bold text-xl mt-3">𝕏.com</p>
                        </div>
                        <div className="mt-8 p-4 space-y-6">
                            <div className="flex items-center gap-4">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                <div>
                                    <p className="font-bold text-white text-lg">Date joined</p>
                                    <p className="text-zinc-500">{['January', 'March', 'August', 'October', 'December'][(user.username.charCodeAt(0) || 0) % 5]} {(2008 + (user.id.charCodeAt(1) || 0) % 15)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                <div className="flex-grow">
                                    <p className="font-bold text-white text-lg">Account based in</p>
                                    <p className="text-zinc-500">{user.country || ['United States', 'United Kingdom', 'Canada', 'Brazil', 'Philippines'][(user.id.charCodeAt(0) || 0) % 5]}</p>
                                </div>
                            </div>
                            {user.isVerified && (
                                <div className="flex items-center gap-4">
                                    <UserVerifiedBadge isVerified={user.isVerified} className="w-6 h-6" />
                                    <div>
                                        <p className="font-bold text-white text-lg">Verified</p>
                                        <p className="text-zinc-500">Since {user.verifiedSince || `August ${(2010 + (user.id.charCodeAt(0) || 0) % 13)}`}</p>
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center gap-4 pb-6">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
                                <div>
                                    <p className="font-bold text-white text-lg">Connected via</p>
                                    <p className="text-zinc-500">{['X for Android', 'X for iPhone', 'X Web App', 'United States App Store'][(user.username.length || 0) % 4]}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showPremiumModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-sm p-6 text-center">
                        <h2 className="text-2xl font-bold mb-2">Upgrade to Premium</h2>
                        <p className="text-zinc-400 mb-6">Choose your verification tier.</p>
                        
                        <div className="space-y-4">
                            <button 
                                onClick={() => {
                                    if(activeArtistData && activeArtistData.money >= 25000) {
                                        dispatch({ type: 'BUY_X_VERIFICATION', payload: { accountId: user.id, tier: 'blue', cost: 25000 }});
                                        setShowPremiumModal(false);
                                    } else {
                                        alert('Not enough funds!');
                                    }
                                }}
                                className="w-full bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 border border-[#1DA1F2] p-4 rounded-2xl flex flex-col items-center transition-colors"
                            >
                                <UserVerifiedBadge isVerified="blue" className="w-10 h-10 mb-2" />
                                <span className="font-bold text-lg text-[#1DA1F2]">Blue</span>
                                <span className="text-zinc-300 text-sm">$25K / month</span>
                            </button>
                            
                            <button 
                                onClick={() => {
                                    if(activeArtistData && activeArtistData.money >= 250000) {
                                        dispatch({ type: 'BUY_X_VERIFICATION', payload: { accountId: user.id, tier: 'gold', cost: 250000 }});
                                        setShowPremiumModal(false);
                                    } else {
                                        alert('Not enough funds!');
                                    }
                                }}
                                className="w-full bg-yellow-400/10 hover:bg-yellow-400/20 border border-yellow-400 p-4 rounded-2xl flex flex-col items-center transition-colors"
                            >
                                <UserVerifiedBadge isVerified="gold" className="w-10 h-10 mb-2" />
                                <span className="font-bold text-lg text-yellow-400">Gold</span>
                                <span className="text-zinc-300 text-sm">$250K / month</span>
                            </button>
                        </div>
                        
                        <button onClick={() => setShowPremiumModal(false)} className="mt-6 font-bold text-zinc-500 hover:text-white">Cancel</button>
                    </div>
                </div>
            )}
            {isEditing && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="bg-black w-full max-w-md rounded-2xl overflow-hidden border border-zinc-800 flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setIsEditing(false)} className="text-white hover:bg-zinc-800 p-2 rounded-full">
                                    <ArrowLeftIcon className="w-5 h-5" />
                                </button>
                                <h2 className="text-xl font-bold">Edit profile</h2>
                            </div>
                            <button onClick={handleSaveProfile} className="bg-white text-black font-bold px-4 py-1.5 rounded-full text-sm">Save</button>
                        </div>
                        <div className="p-4 overflow-y-auto space-y-4">
                            <div>
                                <label className="text-xs text-zinc-500 block">Name</label>
                                <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="w-full bg-black border-b border-zinc-700 text-white p-2 focus:border-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="text-xs text-zinc-500 block">Bio</label>
                                <textarea value={editBio} onChange={e => setEditBio(e.target.value)} className="w-full bg-black border-b border-zinc-700 text-white p-2 focus:border-blue-500 outline-none resize-none h-20" maxLength={160} />
                            </div>
                            <div>
                                <label className="text-xs text-zinc-500 block mb-2">Header Image (Optional)</label>
                                {editHeader && <img src={editHeader} className="w-full h-24 object-cover mb-2 rounded-md" alt="Header Preview" />}
                                <input type="file" accept="image/*" onChange={e => {
                                    if (e.target.files && e.target.files[0]) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => setEditHeader(reader.result as string);
                                        reader.readAsDataURL(e.target.files[0]);
                                    }
                                }} className="w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700" />
                            </div>
                            <div>
                                <label className="text-xs text-zinc-500 block mb-2">Avatar Image (Optional)</label>
                                {editAvatar && <img src={editAvatar} className="w-16 h-16 object-cover mb-2 rounded-full border border-zinc-700" alt="Avatar Preview" />}
                                <input type="file" accept="image/*" onChange={e => {
                                    if (e.target.files && e.target.files[0]) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => setEditAvatar(reader.result as string);
                                        reader.readAsDataURL(e.target.files[0]);
                                    }
                                }} className="w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default XProfileView;