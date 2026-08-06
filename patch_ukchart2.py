import re

with open('components/UKChartView.tsx', 'r') as f:
    content = f.read()

header_target = """                <div className="flex-1 flex justify-center gap-2 items-center text-xl font-bold">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13h-13L12 6.5z"/>
                    </svg>
                    Official Singles Chart
                </div>"""

header_replace = """                <div className="flex-1 flex justify-center gap-2 items-center text-2xl pr-8">
                    <svg className="w-8 h-8 text-white rotate-45" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M5 5h14v14H5z" />
                        <path d="M15 9l-6 6h6V9z" fill="#0024f0" />
                    </svg>
                    <span><span className="font-black">Official</span> <span className="font-light">Singles Chart</span></span>
                </div>"""
content = content.replace(header_target, header_replace)

main_target = """                <div className="flex items-center gap-2 mb-6 text-sm font-semibold border-b border-zinc-300 pb-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    view as cards
                </div>
                <div className="space-y-4">"""

main_replace = """                <div className="flex items-center gap-2 mb-6 text-lg border-b border-zinc-300 pb-2 text-black">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    view as cards
                </div>
                <div className="space-y-6">"""
content = content.replace(main_target, main_replace)

item_target = """                                <div className="flex flex-col items-center justify-center w-10">
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
                                    </div>
                                </div>"""

item_replace = """                                <div className="flex flex-col items-center justify-center w-12">
                                    <span className="text-6xl font-black">{entry.rank}</span>
                                    {isUp && <div className="text-pink-500 text-2xl leading-none mt-1">▲</div>}
                                    {isDown && <div className="text-blue-700 text-2xl leading-none mt-1">▼</div>}
                                    {isNew && <div className="text-pink-500 text-[10px] font-bold uppercase mt-1">New</div>}
                                </div>
                                
                                <div className="relative flex-shrink-0">
                                    <img src={entry.coverArt} className="w-24 h-24 object-cover rounded" alt="cover" />
                                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center rounded">
                                        <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center bg-white/30 backdrop-blur-sm">
                                            <PlayIcon className="w-6 h-6 text-white ml-1" />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex-1 flex flex-col justify-center min-w-0 pl-2">
                                    <h3 className="font-black text-xl uppercase truncate leading-tight tracking-tight">{entry.title}</h3>
                                    <p className="italic text-sm truncate uppercase tracking-tight text-zinc-800 mt-1">{entry.artist}</p>
                                    
                                    <div className="text-[12px] mt-3 flex items-center gap-1 font-light tracking-wide text-black">
                                        LW: <span className="font-bold text-pink-500">{entry.lastWeek || '-'}</span> 
                                        <span className="ml-1">Peak:</span> <span className="font-bold text-blue-800">{entry.peak}</span>,
                                        <span className="ml-1">Weeks:</span> <span className="font-bold text-pink-500">{entry.weeksOnChart}</span>
                                    </div>
                                </div>"""

content = content.replace(item_target, item_replace)

header_blue_target = """bg-blue-700"""
header_blue_replace = """bg-[#0024f0]"""
content = content.replace(header_blue_target, header_blue_replace)

with open('components/UKChartView.tsx', 'w') as f:
    f.write(content)
