import re
with open('components/YouTubeVideoDetailView.tsx', 'r') as f:
    content = f.read()

pattern1 = r'<span>\{formatNumber\(video\.views\)\} views</span>'
replacement1 = '<span>{video.isLive ? `${formatNumber(video.liveViewers || 0)} watching` : `${formatNumber(video.views)} views`}</span>'
content = content.replace(pattern1, replacement1)

pattern2 = r'<p className="font-bold text-lg">\{video\.views\.toLocaleString\(\)\}</p>\n                            <p className="text-xs text-zinc-400">Views</p>'
replacement2 = '<p className="font-bold text-lg">{video.isLive ? (video.liveViewers || 0).toLocaleString() : video.views.toLocaleString()}</p>\n                            <p className="text-xs text-zinc-400">{video.isLive ? "Watching" : "Views"}</p>'
content = content.replace(pattern2, replacement2)

with open('components/YouTubeVideoDetailView.tsx', 'w') as f:
    f.write(content)
