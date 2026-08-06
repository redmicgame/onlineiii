import fs from 'fs';
let code = fs.readFileSync('components/AlbumPromoView.tsx', 'utf8');

const replacement = `
                    {/* Dynamic Promos */}
                    {[
                        ...(date.year >= 2009 ? ['genius'] : []),
                        ...(date.year >= 2014 ? ['fallon'] : (date.year >= 1968 ? ['tv_interview'] : [])),
                        'magazine'
                    ].map(type => {
                        const isGenius = type === 'genius';
                        const isMagazine = type === 'magazine';
                        const isFallon = type === 'fallon';
                        const isTv = type === 'tv_interview';
                        
                        let cost = 50000;
                        let title = "Magazine Interview";
                        let desc = "An in-depth feature discussing your new music.";
                        let requestedSongId = submission.magazineInterviewRequestedForSongId;
                        let icon = <span className="font-serif font-black text-2xl px-2 italic">M</span>;
                        let actionType = 'magazine';
                        let colorClass = 'bg-amber-100 text-amber-900 border-amber-500';
                        
                        if (isGenius) {
                            cost = 150000;
                            title = "Genius 'Verified'";
                            desc = "An official lyric breakdown video.";
                            requestedSongId = submission.geniusInterviewRequestedForSongId;
                            icon = <GeniusIcon className="w-10 h-10 text-yellow-300 flex-shrink-0" />;
                            actionType = 'genius';
                            colorClass = 'bg-yellow-300 text-black border-yellow-500';
                        } else if (isFallon) {
                            cost = 500000;
                            title = "Fallon Performance";
                            desc = "A high-profile live TV performance.";
                            requestedSongId = submission.fallonPerformanceRequestedForSongId;
                            icon = <TonightShowIcon className="w-10 h-10 flex-shrink-0" />;
                            actionType = 'fallon';
                            colorClass = 'bg-blue-500 text-white border-blue-500';
                        } else if (isTv) {
                            cost = 300000;
                            title = "60 Minutes Interview";
                            desc = "A prime-time investigative journalism interview.";
                            requestedSongId = submission.tvInterviewRequestedForSongId;
                            icon = <span className="font-sans font-black text-xl px-1">60</span>;
                            actionType = 'tv_interview';
                            colorClass = 'bg-red-600 text-white border-red-600';
                        }

                        return (
                            <div key={type} className={\`p-4 rounded-lg border-2 \${requestedSongId ? 'border-green-500 bg-green-900/30' : 'border-zinc-700 bg-zinc-800'}\`}>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-12 h-12 flex items-center justify-center bg-zinc-900 rounded-lg">
                                        {icon}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{title}</h3>
                                        <p className="text-sm text-zinc-400">{desc}</p>
                                    </div>
                                </div>
                                {!requestedSongId ? (
                                    <div className="space-y-2">
                                        <select
                                            onChange={(e) => setSelectedSongId(e.target.value)}
                                            defaultValue=""
                                            className="w-full bg-zinc-700 p-2 rounded-md text-sm"
                                        >
                                            <option value="" disabled>Select a song to feature...</option>
                                            {projectSongs.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                                        </select>
                                        <button
                                            onClick={() => handleAction(actionType as any)}
                                            disabled={!selectedSongId || budget - spent < cost}
                                            className={\`w-full h-10 font-bold rounded-lg text-sm \${colorClass} disabled:bg-zinc-600 disabled:text-zinc-400 disabled:border-transparent\`}
                                        >
                                            Request (-\${formatNumber(cost)})
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-center text-green-300 font-semibold p-2 bg-green-900/50 rounded-md">
                                        {title} for "{songs.find(s => s.id === requestedSongId)?.title}" requested.
                                    </p>
                                )}
                            </div>
                        )
                    })}
`;

const lines = code.split('\n');
const startIdx = lines.findIndex(l => l.includes('{/* Genius & Fallon Promos */}'));
const endIdx = lines.findIndex(l => l.includes('</main>')) - 1; // before closing main div

const newCode = lines.slice(0, startIdx).join('\n') + '\n' + replacement + '\n' + lines.slice(endIdx).join('\n');
fs.writeFileSync('components/AlbumPromoView.tsx', newCode);
