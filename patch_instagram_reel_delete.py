import re

with open('components/InstagramView.tsx', 'r') as f:
    content = f.read()

old_reel = """const InstagramReelPost: React.FC<{ reel: InstagramReel, username: string, userAvatar: string, isVerified: boolean }> = ({ reel, username, userAvatar, isVerified }) => {
    return (
        <div className="w-full h-full bg-black text-white relative">
            <img src={reel.videoUrl} className="w-full h-full object-cover opacity-80" />"""

new_reel = """const InstagramReelPost: React.FC<{ reel: InstagramReel, username: string, userAvatar: string, isVerified: boolean, onDelete?: () => void }> = ({ reel, username, userAvatar, isVerified, onDelete }) => {
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
            </div>"""

content = content.replace(old_reel, new_reel)

old_reel_map = """                            {activeArtistData.instagramReels.map((reel, i) => (
                                <div key={i} className="h-full w-full shrink-0 snap-center">
                                    <InstagramReelPost reel={reel} username={username} userAvatar={userAvatar} isVerified={isVerified} />
                                </div>
                            ))}"""

new_reel_map = """                            {activeArtistData.instagramReels.map((reel, i) => (
                                <div key={i} className="h-full w-full shrink-0 snap-center">
                                    <InstagramReelPost reel={reel} username={username} userAvatar={userAvatar} isVerified={isVerified} onDelete={() => dispatch({ type: 'DELETE_INSTAGRAM_REEL', payload: { reelId: reel.id } })} />
                                </div>
                            ))}"""

content = content.replace(old_reel_map, new_reel_map)

with open('components/InstagramView.tsx', 'w') as f:
    f.write(content)
