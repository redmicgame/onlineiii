import React, { useState, useMemo } from 'react';
import { useGame, formatNumber } from '../context/GameContext';

const UsersIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z" />
    </svg>
);

const PlayIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
    </svg>
);

const MySpaceView: React.FC = () => {
    const { gameState, dispatch, activeArtist } = useGame();
    const [bulletinText, setBulletinText] = useState('');
    const [blogText, setBlogText] = useState('');
    const [selectedSongId, setSelectedSongId] = useState('');

    const activeData = gameState.artistsData[activeArtist?.id || ''];
    const releasedSongs = activeData?.songs.filter(s => s.isReleased && !s.remixOfSongId) || [];
    const mySpaceData = activeData?.mySpaceData;
    
    const profileSong = mySpaceData?.profileSongId ? releasedSongs.find(s => s.id === mySpaceData.profileSongId) : null;

    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editMood, setEditMood] = useState(mySpaceData?.mood || '');
    const [editGeneralInterests, setEditGeneralInterests] = useState(mySpaceData?.generalInterests || '');
    const [editMusicInterests, setEditMusicInterests] = useState(mySpaceData?.musicInterests || '');
    
    const potentialFriends = useMemo(() => [
        ...gameState.npcs.filter(n => n?.name).map(n => ({ id: n.id, name: n.name, image: n.image })),
        ...(activeData?.xUsers || []).filter(u => u?.name).map(u => ({ id: u.id, name: u.name, image: u.avatar }))
    ], [gameState.npcs, activeData?.xUsers]);

    const defaultTop8 = useMemo(() => gameState.npcs.filter(n => n?.name).slice(0, 8).map(n => ({ id: n.id, name: n.name, image: n.image })), [gameState.npcs]);
    const [editTop8Friends, setEditTop8Friends] = useState<{id: string; name: string; image: string}[]>(mySpaceData?.top8Friends || defaultTop8);
    const [friendSearch, setFriendSearch] = useState('');

    const top8FriendsList = mySpaceData?.top8Friends || defaultTop8;

    const handlePostBulletin = () => {
        if (!bulletinText.trim()) return;
        dispatch({ type: 'POST_ON_MYSPACE', payload: { type: 'bulletin', content: bulletinText } });
        setBulletinText('');
    };

    const handlePostBlog = () => {
        if (!blogText.trim()) return;
        dispatch({ type: 'POST_ON_MYSPACE', payload: { type: 'blog', content: blogText } });
        setBlogText('');
    };

    const handleUpdateProfileSong = () => {
        if (!selectedSongId) return;
        dispatch({ type: 'POST_ON_MYSPACE', payload: { type: 'profile_song', songId: selectedSongId } });
        setSelectedSongId('');
    };

    const handleSaveProfile = () => {
        dispatch({
            type: 'UPDATE_MYSPACE_PROFILE',
            payload: {
                mood: editMood,
                generalInterests: editGeneralInterests,
                musicInterests: editMusicInterests,
                top8Friends: editTop8Friends
            }
        });
        setIsEditingProfile(false);
    };

    const toggleTop8Friend = (friend: {id: string; name: string; image: string}) => {
        if (editTop8Friends.find(f => f.id === friend.id)) {
            setEditTop8Friends(editTop8Friends.filter(f => f.id !== friend.id));
        } else {
            if (editTop8Friends.length < 8) {
                setEditTop8Friends([...editTop8Friends, friend]);
            }
        }
    };

    const filteredPotentialFriends = potentialFriends.filter(f => f?.name?.toLowerCase().includes((friendSearch || '').toLowerCase()));

    return (
        <div className="bg-[#e9e9e9] h-full overflow-y-auto text-black font-sans pb-24">
            <header className="bg-[#003399] p-2 flex justify-between items-center text-white">
                <div className="flex items-center gap-2">
                    <button onClick={() => dispatch({type: 'CHANGE_VIEW', payload: 'game'})} className="px-2 py-1 bg-[#6699cc] text-xs font-bold rounded border border-blue-300 hover:bg-[#4d7ca6]">Back</button>
                    <h1 className="font-bold tracking-tight">MySpace</h1>
                </div>
                <div className="text-xs">
                    <a href="#" className="underline">Home</a> | <a href="#" className="underline">Browse</a> | <a href="#" className="underline">Search</a>
                </div>
            </header>

            <main className="max-w-5xl mx-auto p-4 flex flex-col md:flex-row gap-6">
                <aside className="w-full md:w-1/3">
                    <h2 className="text-xl font-bold mb-2">{activeArtist?.name}</h2>
                    <img src={activeArtist?.image} alt={activeArtist?.name} className="w-full max-w-[200px] border border-gray-400 mb-2" />
                    <p className="text-sm font-semibold">"{activeArtist?.name} is in your extended network"</p>
                    
                    {mySpaceData?.mood && <p className="text-xs font-bold mt-2">Mood: <span className="font-normal">{mySpaceData.mood}</span></p>}
                    <p className="text-xs font-bold mt-1">Profile Views: <span className="font-normal">{formatNumber(mySpaceData?.profileViews || 0)}</span></p>

                    <button onClick={() => setIsEditingProfile(true)} className="mt-2 text-xs bg-gray-200 border border-gray-400 px-2 py-1 hover:bg-gray-300">Edit Profile</button>
                    
                    <div className="bg-white border text-sm mt-4 p-2 shadow-sm flex items-center gap-4">
                         <div className="w-16 h-16 bg-gray-200 border border-gray-400 flex items-center justify-center">
                             {profileSong ? <img src={profileSong.coverArt} className="w-full h-full object-cover" /> : <PlayIcon className="w-8 h-8 text-gray-400" />}
                         </div>
                         <div>
                             <p className="font-bold text-[#003399]">{profileSong ? profileSong.title : 'No Profile Song'}</p>
                             <p className="text-xs">{activeArtist?.name}</p>
                         </div>
                    </div>

                    <div className="bg-white border border-[#003399] mt-4 p-2">
                        <h3 className="bg-[#6699cc] text-white p-1 text-sm font-bold">Contacting {activeArtist?.name}</h3>
                        <div className="grid grid-cols-2 gap-2 text-xs text-blue-800 mt-2">
                            <a href="#" className="flex items-center gap-1 hover:underline"><UsersIcon className="w-3 h-3"/> Add to Friends</a>
                            <a href="#" className="flex items-center gap-1 hover:underline"><UsersIcon className="w-3 h-3"/> Send Message</a>
                            <a href="#" className="flex items-center gap-1 hover:underline"><UsersIcon className="w-3 h-3"/> Add to Group</a>
                            <a href="#" className="flex items-center gap-1 hover:underline"><UsersIcon className="w-3 h-3"/> Block User</a>
                        </div>
                    </div>

                    <div className="bg-white border border-[#003399] mt-4">
                        <h3 className="bg-[#6699cc] text-white p-1 text-sm font-bold">Interests</h3>
                        <div className="p-2 text-xs">
                            <p className="font-bold text-[#6699cc]">General</p>
                            <p className="mb-2 whitespace-pre-wrap">{mySpaceData?.generalInterests || 'None specified.'}</p>
                            <p className="font-bold text-[#6699cc]">Music</p>
                            <p className="whitespace-pre-wrap">{mySpaceData?.musicInterests || 'None specified.'}</p>
                        </div>
                    </div>
                </aside>

                <section className="w-full md:w-2/3 space-y-6">
                    <div className="flex gap-4 p-4 bg-white border border-gray-300 shadow-sm items-start">
                        <div className="flex-1 space-y-4">
                             <div>
                                <label className="text-xs font-bold text-gray-700">Update Profile Song (Boosts Streams & Hype)</label>
                                <div className="flex gap-2 mt-1">
                                    <select value={selectedSongId} onChange={e => setSelectedSongId(e.target.value)} className="text-sm p-1 border border-gray-400 flex-1">
                                        <option value="">Select a released song...</option>
                                        {releasedSongs.map(s => (
                                            <option key={s.id} value={s.id}>{s.title}</option>
                                        ))}
                                    </select>
                                    <button onClick={handleUpdateProfileSong} disabled={!selectedSongId} className="px-3 py-1 bg-[#003399] hover:bg-[#002266] text-white font-bold text-xs rounded disabled:opacity-50">Set</button>
                                </div>
                             </div>

                             <div>
                                <label className="text-xs font-bold text-gray-700">Post Bulletin (Quick hype boost)</label>
                                <div className="flex gap-2 mt-1">
                                    <input type="text" value={bulletinText} onChange={e => setBulletinText(e.target.value)} maxLength={100} className="text-sm p-1 border border-gray-400 flex-1" placeholder="What are you doing right now?" />
                                    <button onClick={handlePostBulletin} disabled={!bulletinText.trim()} className="px-3 py-1 bg-[#003399] hover:bg-[#002266] text-white font-bold text-xs rounded disabled:opacity-50">Post</button>
                                </div>
                             </div>

                             <div>
                                 <label className="text-xs font-bold text-gray-700">Write Blog (Bigger hype & popularity boost)</label>
                                 <textarea value={blogText} onChange={e => setBlogText(e.target.value)} rows={3} className="text-sm p-1 border border-gray-400 w-full mt-1 resize-none" placeholder="Write to your fans..."></textarea>
                                 <button onClick={handlePostBlog} disabled={!blogText.trim()} className="w-full mt-2 px-3 py-1 bg-[#003399] hover:bg-[#002266] text-white font-bold text-xs rounded disabled:opacity-50">Publish Blog</button>
                             </div>
                        </div>
                    </div>

                    {gameState.date.year < 2012 && (
                        <div className="flex gap-4 p-4 bg-white border border-gray-300 shadow-sm items-start">
                            <div className="flex-1 space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-700">Push to iTunes</label>
                                    <p className="text-[10px] text-zinc-500 mb-1">Direct your MySpace friends to buy your song on iTunes. (Can only push once per week)</p>
                                    <div className="flex gap-2">
                                        <select value={selectedSongId} onChange={e => setSelectedSongId(e.target.value)} className="text-sm p-1 border border-gray-400 flex-1">
                                            <option value="">Select a released song...</option>
                                            {releasedSongs.map(s => (
                                                <option key={s.id} value={s.id}>{s.title}</option>
                                            ))}
                                        </select>
                                        <button 
                                            onClick={() => {
                                                if (!selectedSongId) return;
                                                dispatch({ type: 'POST_ON_MYSPACE', payload: { type: 'push', songId: selectedSongId, content: `Buy ${releasedSongs.find(s=>s.id===selectedSongId)?.title || 'my new song'} on iTunes!` } });
                                                setSelectedSongId('');
                                            }} 
                                            disabled={!selectedSongId || (activeData.lastPushToItunesWeek === gameState.date.year * 52 + gameState.date.week)} 
                                            className="px-3 py-1 bg-[#003399] hover:bg-[#002266] text-white font-bold text-xs rounded disabled:opacity-50 tracking-wider">
                                            PUSH TO ITUNES
                                        </button>
                                    </div>
                                    {activeData.lastPushToItunesWeek === gameState.date.year * 52 + gameState.date.week && (
                                        <p className="text-xs text-red-500 mt-1">You already pushed a song to iTunes this week.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-white border border-[#003399]">
                        <h3 className="bg-[#ffcc99] text-[#cc6600] p-1 text-sm font-bold mb-2">MySpace Blog</h3>
                        <div className="p-4 space-y-4">
                            {mySpaceData?.blogPosts && mySpaceData.blogPosts.length > 0 ? (
                                mySpaceData.blogPosts.map((post, idx) => (
                                    <div key={idx} className="mb-4 border-b border-gray-200 pb-2">
                                        <h4 className="font-bold text-base text-[#003399]">{post.title}</h4>
                                        <p className="text-[10px] text-gray-500 mb-2">Posted Week {post.week}, {post.year}</p>
                                        <p className="text-sm text-gray-800 whitespace-pre-wrap">{post.content}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500">No blog posts yet.</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-white border border-[#003399]">
                        <h3 className="bg-[#ffcc99] text-[#cc6600] p-1 text-sm font-bold mb-2">Recent Bulletins</h3>
                        <div className="p-4 space-y-2">
                             {mySpaceData?.bulletins && mySpaceData.bulletins.length > 0 ? (
                                mySpaceData.bulletins.map((bull, idx) => (
                                    <p key={idx} className="text-sm text-gray-800 border-b border-gray-100 pb-1">
                                        <span className="text-[#003399] font-bold mr-2">Week {bull.week}:</span>
                                        {bull.content}
                                    </p>
                                ))
                             ) : (
                                 <p className="text-sm text-gray-500">No bulletins posted.</p>
                             )}
                        </div>
                    </div>

                    <div className="mt-6">
                        <h3 className="text-[#ff6600] text-lg font-bold mb-2">{activeArtist?.name}'s Friend Space</h3>
                        <p className="font-bold text-sm mb-2">{activeArtist?.name} has <span className="text-[#ff0000]">{Math.floor(activeData?.popularity * 1000).toLocaleString()}</span> friends.</p>
                        
                        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                            {top8FriendsList.map(friend => (
                                <div key={friend.id} className="text-center">
                                    <h4 className="text-xs font-bold text-[#003399] truncate">{friend.name}</h4>
                                    <div className="bg-white shadow aspect-square mt-1 border border-gray-300 flex items-center justify-center p-1">
                                        <img src={friend.image} alt={friend.name} className="w-full h-full object-cover" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {isEditingProfile && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white max-w-2xl w-full p-4 border-2 border-[#003399] max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
                            <h2 className="text-xl font-bold text-[#003399]">Edit Profile</h2>
                            <button onClick={() => setIsEditingProfile(false)} className="text-gray-500 hover:text-black">X</button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold">Mood</label>
                                <input type="text" value={editMood} onChange={e => setEditMood(e.target.value)} className="w-full border border-gray-300 p-1 text-sm" placeholder="e.g. happy, excited, working..." />
                            </div>
                            <div>
                                <label className="block text-sm font-bold">General Interests</label>
                                <textarea value={editGeneralInterests} onChange={e => setEditGeneralInterests(e.target.value)} rows={3} className="w-full border border-gray-300 p-1 text-sm"></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-bold">Music Interests</label>
                                <textarea value={editMusicInterests} onChange={e => setEditMusicInterests(e.target.value)} rows={3} className="w-full border border-gray-300 p-1 text-sm"></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-bold">Select Top 8 Friends ({editTop8Friends.length}/8)</label>
                                <input type="text" placeholder="Search friends..." value={friendSearch} onChange={e => setFriendSearch(e.target.value)} className="w-full border border-gray-300 p-1 text-sm mb-2" />
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto border border-gray-300 p-2">
                                    {filteredPotentialFriends.map(friend => {
                                        const isSelected = editTop8Friends.some(f => f.id === friend.id);
                                        return (
                                            <div 
                                                key={friend.id} 
                                                onClick={() => toggleTop8Friend(friend)}
                                                className={`cursor-pointer border p-1 text-center text-xs flex flex-col items-center gap-1 ${isSelected ? 'bg-blue-100 border-blue-500' : 'bg-gray-50 border-transparent hover:bg-gray-200'}`}
                                            >
                                                <img src={friend.image} className="w-10 h-10 object-cover border border-gray-400" />
                                                <span className="truncate w-full">{friend.name}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end gap-2">
                            <button onClick={() => setIsEditingProfile(false)} className="px-4 py-1 border border-gray-400 bg-gray-200 text-sm hover:bg-gray-300">Cancel</button>
                            <button onClick={handleSaveProfile} className="px-4 py-1 bg-[#003399] text-white font-bold text-sm hover:bg-blue-800">Save Changes</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MySpaceView;
