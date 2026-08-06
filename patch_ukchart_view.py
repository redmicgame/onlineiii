import re

with open('components/UKChartView.tsx', 'r') as f:
    content = f.read()

target = """                        const isUp = entry.lastWeekPosition && entry.currentPosition < entry.lastWeekPosition;
                        const isDown = entry.lastWeekPosition && entry.currentPosition > entry.lastWeekPosition;
                        const isSame = entry.lastWeekPosition && entry.currentPosition === entry.lastWeekPosition;
                        const isNew = !entry.lastWeekPosition;
                        
                        return (
                            <div key={entry.id + index} className="flex gap-4 items-center border-b border-zinc-200 pb-4">
                                <div className="flex flex-col items-center justify-center w-10">
                                    <span className="text-4xl font-black">{entry.currentPosition}</span>
                                    {isUp && <div className="text-pink-500 text-lg leading-none">▲</div>}
                                    {isDown && <div className="text-blue-600 text-lg leading-none">▼</div>}
                                    {isSame && <div className="text-zinc-400 text-lg leading-none">=</div>}
                                    {isNew && <div className="text-pink-500 text-[10px] font-bold uppercase mt-1">New</div>}
                                </div>
                                
                                <div className="relative">
                                    <img src={entry.coverArt} className="w-20 h-20 object-cover rounded shadow" alt="cover" />
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded">
                                        <PlayIcon className="w-10 h-10 text-white/80" />
                                    </div>
                                </div>
                                
                                <div className="flex-1 flex flex-col justify-center min-w-0">
                                    <h3 className="font-black text-xl uppercase truncate">{entry.title}</h3>
                                    <p className="italic text-sm truncate uppercase tracking-tight">{entry.artist}</p>
                                    
                                    <div className="text-[10px] mt-2 flex items-center gap-1">
                                        <span className="text-zinc-500">LW:</span> <span className="font-bold text-pink-500">{entry.lastWeekPosition || '-'}</span> 
                                        <span className="text-zinc-500 ml-1">Peak:</span> <span className="font-bold text-blue-800">{entry.peakPosition}</span> 
                                        <span className="text-zinc-500 ml-1">Weeks:</span> <span className="font-bold text-pink-500">{entry.weeksOnChart}</span>
                                    </div>"""

replacement = """                        const isUp = entry.lastWeek && entry.rank < entry.lastWeek;
                        const isDown = entry.lastWeek && entry.rank > entry.lastWeek;
                        const isSame = entry.lastWeek && entry.rank === entry.lastWeek;
                        const isNew = !entry.lastWeek;
                        
                        return (
                            <div key={entry.uniqueId} className="flex gap-4 items-center border-b border-zinc-200 pb-4">
                                <div className="flex flex-col items-center justify-center w-10">
                                    <span className="text-4xl font-black">{entry.rank}</span>
                                    {isUp && <div className="text-pink-500 text-lg leading-none">▲</div>}
                                    {isDown && <div className="text-blue-600 text-lg leading-none">▼</div>}
                                    {isSame && <div className="text-zinc-400 text-lg leading-none">=</div>}
                                    {isNew && <div className="text-pink-500 text-[10px] font-bold uppercase mt-1">New</div>}
                                </div>
                                
                                <div className="relative">
                                    <img src={entry.coverArt} className="w-20 h-20 object-cover rounded shadow" alt="cover" />
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded">
                                        <PlayIcon className="w-10 h-10 text-white/80" />
                                    </div>
                                </div>
                                
                                <div className="flex-1 flex flex-col justify-center min-w-0">
                                    <h3 className="font-black text-xl uppercase truncate">{entry.title}</h3>
                                    <p className="italic text-sm truncate uppercase tracking-tight">{entry.artist}</p>
                                    
                                    <div className="text-[10px] mt-2 flex items-center gap-1">
                                        <span className="text-zinc-500">LW:</span> <span className="font-bold text-pink-500">{entry.lastWeek || '-'}</span> 
                                        <span className="text-zinc-500 ml-1">Peak:</span> <span className="font-bold text-blue-800">{entry.peak}</span> 
                                        <span className="text-zinc-500 ml-1">Weeks:</span> <span className="font-bold text-pink-500">{entry.weeksOnChart}</span>
                                    </div>"""

content = content.replace(target, replacement)
with open('components/UKChartView.tsx', 'w') as f:
    f.write(content)
