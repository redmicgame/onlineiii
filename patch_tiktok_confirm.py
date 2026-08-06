import re

with open('components/TikTokView.tsx', 'r') as f:
    content = f.read()

content = content.replace('if (window.confirm("Delete this video?")) {\n                                    dispatch({ type: \'DELETE_TIKTOK_VIDEO\', payload: { videoId: video.id } });\n                                }', "dispatch({ type: 'DELETE_TIKTOK_VIDEO', payload: { videoId: video.id } });")

with open('components/TikTokView.tsx', 'w') as f:
    f.write(content)
