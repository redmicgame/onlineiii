import re

with open('components/StudioView.tsx', 'r') as f:
    content = f.read()

# Add fetch function
fetch_func = """
    const handleFetchSpotify = async () => {
        setIsFetchingSpotify(true);
        setAutoWriteError('');
        try {
            const res = await fetch(`/api/spotify/album?url=${encodeURIComponent(spotifyLink)}`);
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setAutoWriteData(data);
        } catch (e: any) {
            setAutoWriteError(e.message || 'Failed to fetch Spotify data');
        } finally {
            setIsFetchingSpotify(false);
        }
    };

    const handleAutoWriteSubmit = () => {
        if (!autoWriteData) return;
        
        let customImageUploads: {songTitle: string, coverArt: string}[] = [];
        let totalCost = 0;
        let finalSongs = [];
        
        for (const track of autoWriteData.tracks) {
            // Deduct cost per song
            totalCost += selectedStudio.cost;
            const newSong: Song = {
                id: crypto.randomUUID(),
                title: track.title,
                genre,
                subgenre,
                quality: selectedStudio.qualityMultiplier,
                streams: 0,
                sales: 0,
                coverArt: autoWriteData.image || undefined,
                features: [],
                samples: [],
                isExplicit: false,
                revenue: 0,
                weeksAtNumberOne: 0,
                isLeadSingle: false,
                producers: [],
                songwriters: [],
                engineers: [],
                anr: [],
                costToProduce: selectedStudio.cost,
            };
            if (autoWriteData.image) {
                customImageUploads.push({ songTitle: track.title, coverArt: autoWriteData.image });
            }
            finalSongs.push(newSong);
        }
        
        if (money < totalCost) {
            setAutoWriteError(`Not enough money. Need $${formatNumber(totalCost)} for ${autoWriteData.tracks.length} tracks.`);
            return;
        }

        if (customImageUploads.length > 0) {
            dispatch({ type: 'UPDATE_CUSTOM_IMAGES', payload: customImageUploads });
        }
        
        for (const song of finalSongs) {
            dispatch({ type: 'RECORD_SONG', payload: { song, cost: selectedStudio.cost } });
        }
        dispatch({ type: 'CHANGE_VIEW', payload: 'game' });
    };
"""

content = content.replace("const handleAddSample = (artistName: string, type: 'Sample' | 'Interpolation') => {", fetch_func + "\n    const handleAddSample = (artistName: string, type: 'Sample' | 'Interpolation') => {")

# Add UI block
ui_block = """
                {mode === 'autoWrite' && (
                    <>
                        <h2 className="text-xl font-bold mb-4">Auto Write from Spotify</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-1">Spotify Album/Single Link</label>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        value={spotifyLink} 
                                        onChange={e => setSpotifyLink(e.target.value)} 
                                        className="flex-1 block w-full bg-zinc-700 border-zinc-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm h-10 px-3"
                                        placeholder="https://open.spotify.com/album/..."
                                    />
                                    <button 
                                        onClick={handleFetchSpotify}
                                        disabled={!spotifyLink || isFetchingSpotify}
                                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:bg-zinc-600"
                                    >
                                        {isFetchingSpotify ? 'Fetching...' : 'Fetch'}
                                    </button>
                                </div>
                                {autoWriteError && <p className="text-red-400 text-sm mt-2">{autoWriteError}</p>}
                            </div>

                            {autoWriteData && (
                                <div className="bg-zinc-800 p-4 rounded-lg flex gap-4 items-center">
                                    {autoWriteData.image && (
                                        <div 
                                            className="w-24 h-24 rounded-md bg-zinc-700 shrink-0 bg-cover bg-center cursor-pointer" 
                                            style={{backgroundImage: `url(${autoWriteData.image})`}}
                                            onClick={() => {
                                                const newImg = prompt("Enter new cover art URL:", autoWriteData.image);
                                                if (newImg) setAutoWriteData({...autoWriteData, image: newImg});
                                            }}
                                            title="Click to change cover"
                                        />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-lg truncate">{autoWriteData.title}</h3>
                                        <p className="text-zinc-400 text-sm truncate">{autoWriteData.artist}</p>
                                        <p className="text-zinc-400 text-sm">{autoWriteData.tracks.length} tracks</p>
                                    </div>
                                </div>
                            )}

                            {autoWriteData && (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-zinc-300 mb-1">Genre</label>
                                            <select value={genre} onChange={e => { setGenre(e.target.value); setSubgenre(SUBGENRES_BY_GENRE[e.target.value]?.[0] || SUBGENRES[0]); }} className="block w-full bg-zinc-700 border-zinc-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm h-10 px-3">
                                                {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-zinc-300 mb-1">Subgenre</label>
                                            <select value={subgenre} onChange={e => setSubgenre(e.target.value)} className="block w-full bg-zinc-700 border-zinc-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm h-10 px-3">
                                                {(SUBGENRES_BY_GENRE[genre] || SUBGENRES).map(sg => <option key={sg} value={sg}>{sg}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h3 className="block text-sm font-medium text-zinc-300 mb-2">Select Studio (Cost per track: ${formatNumber(selectedStudio.cost)})</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            {STUDIOS.map((studio, index) => (
                                                <button key={studio.name} onClick={() => setStudioIndex(index)} className={`p-4 rounded-lg text-left transition-all border-2 ${studioIndex === index ? 'border-red-500 bg-red-500/10' : 'border-zinc-700 bg-zinc-800 hover:border-zinc-600'}`}>
                                                    <p className="font-bold">{studio.name}</p>
                                                    <p className="text-sm text-green-400">-${studio.cost.toLocaleString()}/track</p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <button 
                                        onClick={handleAutoWriteSubmit} 
                                        className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-lg shadow-red-600/20 disabled:bg-zinc-600 disabled:shadow-none"
                                        disabled={money < (selectedStudio.cost * autoWriteData.tracks.length)}
                                    >
                                        Record All Tracks (-${formatNumber(selectedStudio.cost * autoWriteData.tracks.length)})
                                    </button>
                                </>
                            )}
                        </div>
                    </>
                )}
"""

content = content.replace("            </div>\n        </div>\n    );\n};\n\nexport default StudioView;", ui_block + "            </div>\n        </div>\n    );\n};\n\nexport default StudioView;")

with open('components/StudioView.tsx', 'w') as f:
    f.write(content)
