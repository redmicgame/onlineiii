import re

with open('components/InstagramView.tsx', 'r') as f:
    content = f.read()

old_post = """const InstagramFeedPost: React.FC<{ post: InstagramPost, username: string, userAvatar: string, isVerified: boolean }> = ({ post, username, userAvatar, isVerified }) => {
    return (
        <div className="w-full bg-black text-white mb-6">
            <div className="flex items-center justify-between px-3 py-2">
                <div className="flex items-center gap-2">
                    <img src={userAvatar} className="w-8 h-8 rounded-full object-cover border border-zinc-800" />
                    <span className="font-semibold text-[13px] flex items-center">{username} {isVerified && <VerifiedBadge />}</span>
                </div>
                <div className="flex gap-1">
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                </div>
            </div>"""

new_post = """const InstagramFeedPost: React.FC<{ post: InstagramPost, username: string, userAvatar: string, isVerified: boolean, onDelete?: () => void }> = ({ post, username, userAvatar, isVerified, onDelete }) => {
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
            )}"""

content = content.replace(old_post, new_post)

old_feed_map = """                    {activeArtistData.instagramPosts.map((post, i) => (
                        <InstagramFeedPost key={i} post={post} username={username} userAvatar={userAvatar} isVerified={isVerified} />
                    ))}"""

new_feed_map = """                    {activeArtistData.instagramPosts.map((post, i) => (
                        <InstagramFeedPost key={i} post={post} username={username} userAvatar={userAvatar} isVerified={isVerified} onDelete={() => dispatch({ type: 'DELETE_INSTAGRAM_POST', payload: { postId: post.id } })} />
                    ))}"""

content = content.replace(old_feed_map, new_feed_map)

with open('components/InstagramView.tsx', 'w') as f:
    f.write(content)
