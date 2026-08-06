import re

with open('components/TikTokView.tsx', 'r') as f:
    content = f.read()

old_feed_def = """const TikTokFeedVideo: React.FC<{ video: TikTokVideo & { username: string, userAvatar: string, songName?: string, isVerified?: boolean } }> = ({ video }) => {"""
new_feed_def = """const TikTokFeedVideo: React.FC<{ video: TikTokVideo & { username: string, userAvatar: string, songName?: string, isVerified?: boolean }, onDelete?: () => void }> = ({ video, onDelete }) => {
    const [showOptions, setShowOptions] = useState(false);"""

content = content.replace(old_feed_def, new_feed_def)

old_actions = """            {/* Right side actions */}
            <div className="absolute right-4 bottom-28 z-10 flex flex-col items-center gap-6">
                <div className="relative">
                    <img src={video.userAvatar} className="w-12 h-12 rounded-full border-2 border-white object-cover" />
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center">
                        <PlusIcon className="w-3 h-3 text-white" />
                    </div>
                </div>"""

new_actions = """            {/* Delete Menu */}
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
                </div>"""

content = content.replace(old_actions, new_actions)

old_feed_render = """                                <TikTokFeedVideo video={v} />"""
new_feed_render = """                                <TikTokFeedVideo video={v} onDelete={v.authorId === activeArtistId ? () => dispatch({ type: 'DELETE_TIKTOK_VIDEO', payload: { videoId: v.id } }) : undefined} />"""

content = content.replace(old_feed_render, new_feed_render)

old_profile_render = """                        {activeArtistData.tiktokVideos.map((video, i) => (
                            <div key={i} className="aspect-[3/4] bg-zinc-800 relative">
                                <img src={video.thumbnail || userAvatar} className={`w-full h-full object-cover ${!video.thumbnail ? 'opacity-50' : ''}`} />
                                <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-xs font-semibold">
                                    <PlayIcon className="w-4 h-4" /> {formatNumber(video.views || 0)}
                                </div>
                            </div>
                        ))}"""
new_profile_render = """                        {activeArtistData.tiktokVideos.map((video, i) => (
                            <div key={i} className="aspect-[3/4] bg-zinc-800 relative group cursor-pointer" onClick={() => {
                                if (window.confirm("Delete this video?")) {
                                    dispatch({ type: 'DELETE_TIKTOK_VIDEO', payload: { videoId: video.id } });
                                }
                            }}>
                                <img src={video.thumbnail || userAvatar} className={`w-full h-full object-cover ${!video.thumbnail ? 'opacity-50' : ''}`} />
                                <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-xs font-semibold">
                                    <PlayIcon className="w-4 h-4" /> {formatNumber(video.views || 0)}
                                </div>
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-500 font-bold transition-opacity">
                                    DELETE
                                </div>
                            </div>
                        ))}"""

content = content.replace(old_profile_render, new_profile_render)

with open('components/TikTokView.tsx', 'w') as f:
    f.write(content)
