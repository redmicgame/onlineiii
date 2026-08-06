import re

with open('components/InstagramView.tsx', 'r') as f:
    content = f.read()

old_feed = """                            myPosts.slice(0, 5).map(post => (
                                <InstagramFeedPost key={post.id} post={post} username={username} userAvatar={activeArtist.image} isVerified={isVerified} />
                            ))"""

new_feed = """                            myPosts.slice(0, 5).map(post => (
                                <InstagramFeedPost key={post.id} post={post} username={username} userAvatar={activeArtist.image} isVerified={isVerified} onDelete={() => dispatch({ type: 'DELETE_INSTAGRAM_POST', payload: { postId: post.id } })} />
                            ))"""

content = content.replace(old_feed, new_feed)

old_reel_feed = """                        {myReels.length > 0 ? (
                            myReels.map(reel => (
                                <div key={reel.id} className="w-full h-full shrink-0 snap-center relative">
                                    <InstagramReelPost reel={reel} username={username} userAvatar={activeArtist.image} isVerified={isVerified} />
                                </div>
                            ))
                        ) : ("""

new_reel_feed = """                        {myReels.length > 0 ? (
                            myReels.map(reel => (
                                <div key={reel.id} className="w-full h-full shrink-0 snap-center relative">
                                    <InstagramReelPost reel={reel} username={username} userAvatar={activeArtist.image} isVerified={isVerified} onDelete={() => dispatch({ type: 'DELETE_INSTAGRAM_REEL', payload: { reelId: reel.id } })} />
                                </div>
                            ))
                        ) : ("""

content = content.replace(old_reel_feed, new_reel_feed)

with open('components/InstagramView.tsx', 'w') as f:
    f.write(content)
