import re

with open('components/InstagramView.tsx', 'r') as f:
    content = f.read()

old_grid = """                                {myPosts.map(post => (
                                    <div key={post.id} className="aspect-square bg-zinc-900 relative cursor-pointer group">
                                        <img src={post.imageUrls?.[0] || post.imageUrl} className="w-full h-full object-cover" />
                                        {post.imageUrls && post.imageUrls.length > 1 && (
                                            <div className="absolute top-2 right-2 text-white">
                                                <svg aria-label="Carousel" fill="currentColor" height="22" viewBox="0 0 48 48" width="22"><path d="M34.8 29.7V11c0-2.9-2.3-5.2-5.2-5.2H11c-2.9 0-5.2 2.3-5.2 5.2v18.7c0 2.9 2.3 5.2 5.2 5.2h18.7c2.8-.1 5.1-2.4 5.1-5.2zM39.2 15v16.1c0 4.5-3.7 8.2-8.2 8.2H14.9c-.6 0-1.1.5-1.1 1.1 0 .6.5 1.1 1.1 1.1h16.1c5.8 0 10.5-4.7 10.5-10.5V15c0-.6-.5-1.1-1.1-1.1-.6 0-1.2.5-1.2 1.1z"></path></svg>
                                            </div>
                                        )}
                                    </div>
                                ))}"""

new_grid = """                                {myPosts.map(post => (
                                    <div key={post.id} className="aspect-square bg-zinc-900 relative cursor-pointer group" onClick={() => dispatch({ type: 'DELETE_INSTAGRAM_POST', payload: { postId: post.id } })}>
                                        <img src={post.imageUrls?.[0] || post.imageUrl} className="w-full h-full object-cover" />
                                        {post.imageUrls && post.imageUrls.length > 1 && (
                                            <div className="absolute top-2 right-2 text-white">
                                                <svg aria-label="Carousel" fill="currentColor" height="22" viewBox="0 0 48 48" width="22"><path d="M34.8 29.7V11c0-2.9-2.3-5.2-5.2-5.2H11c-2.9 0-5.2 2.3-5.2 5.2v18.7c0 2.9 2.3 5.2 5.2 5.2h18.7c2.8-.1 5.1-2.4 5.1-5.2zM39.2 15v16.1c0 4.5-3.7 8.2-8.2 8.2H14.9c-.6 0-1.1.5-1.1 1.1 0 .6.5 1.1 1.1 1.1h16.1c5.8 0 10.5-4.7 10.5-10.5V15c0-.6-.5-1.1-1.1-1.1-.6 0-1.2.5-1.2 1.1z"></path></svg>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-500 font-bold transition-opacity">
                                            DELETE
                                        </div>
                                    </div>
                                ))}"""

content = content.replace(old_grid, new_grid)

old_reels = """                                {myReels.map(reel => (
                                    <div key={reel.id} className="aspect-[9/16] bg-zinc-900 relative cursor-pointer group">
                                        <img src={reel.videoUrl} className="w-full h-full object-cover" />
                                        <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white font-semibold text-xs">
                                            <svg aria-label="Play" fill="currentColor" height="12" viewBox="0 0 24 24" width="12"><path d="M16.394 12.001 8.542 16.59V7.41l7.852 4.591ZM21.996 12A10.005 10.005 0 1 1 12 1.996 10.016 10.016 0 0 1 21.996 12Z"></path></svg>
                                            {formatNumber(reel.views)}
                                        </div>
                                    </div>
                                ))}"""

new_reels = """                                {myReels.map(reel => (
                                    <div key={reel.id} className="aspect-[9/16] bg-zinc-900 relative cursor-pointer group" onClick={() => dispatch({ type: 'DELETE_INSTAGRAM_REEL', payload: { reelId: reel.id } })}>
                                        <img src={reel.videoUrl} className="w-full h-full object-cover" />
                                        <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white font-semibold text-xs">
                                            <svg aria-label="Play" fill="currentColor" height="12" viewBox="0 0 24 24" width="12"><path d="M16.394 12.001 8.542 16.59V7.41l7.852 4.591ZM21.996 12A10.005 10.005 0 1 1 12 1.996 10.016 10.016 0 0 1 21.996 12Z"></path></svg>
                                            {formatNumber(reel.views)}
                                        </div>
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-500 font-bold transition-opacity">
                                            DELETE
                                        </div>
                                    </div>
                                ))}"""

content = content.replace(old_reels, new_reels)

with open('components/InstagramView.tsx', 'w') as f:
    f.write(content)
