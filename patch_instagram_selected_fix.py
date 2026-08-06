import re

with open('components/InstagramView.tsx', 'r') as f:
    content = f.read()

render_inject = """    if (selectedPost) {
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

    return ("""

content = content.replace("    return (", render_inject, 1)

with open('components/InstagramView.tsx', 'w') as f:
    f.write(content)
