import re
with open('components/YouTubeView.tsx', 'r') as f:
    content = f.read()

pattern = r'''            <div className="w-full aspect-video rounded-lg overflow-hidden bg-zinc-800">
                <img src=\{video\.thumbnail\} alt=\{video\.title\} className="w-full h-full object-cover" />
            </div>'''
replacement = '''            <div className="w-full aspect-video rounded-lg overflow-hidden bg-zinc-800 relative">
                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                {video.isLive && (
                    <div className="absolute bottom-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span> LIVE
                    </div>
                )}
            </div>'''
content = content.replace(pattern, replacement)

pattern2 = r'''\{channel\?\.name\} • \{video\.isScheduled \? 'Scheduled for ' \+ video\.releaseDate\.year \+ ' W' \+ video\.releaseDate\.week : formatNumber\(video\.views\) \+ ' views • ' \+ formatTimeAgo\(video\.releaseDate, date\)\}'''
replacement2 = '''{channel?.name} • {video.isLive ? `${formatNumber(video.liveViewers || 0)} watching` : (video.isScheduled ? 'Scheduled for ' + video.releaseDate.year + ' W' + video.releaseDate.week : formatNumber(video.views) + ' views • ' + formatTimeAgo(video.releaseDate, date))}'''
content = content.replace(pattern2, replacement2)

with open('components/YouTubeView.tsx', 'w') as f:
    f.write(content)
