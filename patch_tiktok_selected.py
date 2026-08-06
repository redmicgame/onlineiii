import re

with open('components/TikTokView.tsx', 'r') as f:
    content = f.read()

old_selected = """                <TikTokFeedVideo video={{
                    ...selectedVideo,
                    username: activeArtist.name.replace(/\s/g, '').toLowerCase(),
                    userAvatar: activeArtist.image,
                    isVerified: (activeArtistData.tiktokFollowers || 0) >= 100000,
                    songName: selectedVideo.songId ? activeArtistData.songs.find(s => s.id === selectedVideo.songId)?.title : undefined
                }} />"""

new_selected = """                <TikTokFeedVideo video={{
                    ...selectedVideo,
                    username: activeArtist.name.replace(/\s/g, '').toLowerCase(),
                    userAvatar: activeArtist.image,
                    isVerified: (activeArtistData.tiktokFollowers || 0) >= 100000,
                    songName: selectedVideo.songId ? activeArtistData.songs.find(s => s.id === selectedVideo.songId)?.title : undefined
                }} onDelete={() => { dispatch({ type: 'DELETE_TIKTOK_VIDEO', payload: { videoId: selectedVideo.id } }); setSelectedVideo(null); }} />"""

content = content.replace(old_selected, new_selected)

with open('components/TikTokView.tsx', 'w') as f:
    f.write(content)
