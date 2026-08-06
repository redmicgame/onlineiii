import re

with open('components/CatalogView.tsx', 'r') as f:
    content = f.read()

old_release = """                return { ...release, streams: releaseStreams, sales: releaseSales + merchUnits };"""
new_release = """                return { ...release, streams: releaseStreams, sales: releaseSales + merchUnits, hasDeluxe: !!deluxeVersion, deluxeSongIds: deluxeVersion?.songIds };"""
content = content.replace(old_release, new_release)

old_title = """<p className="font-bold text-lg">{project.title}</p>"""
new_title = """<p className="font-bold text-lg">{project.title} {(project as any).hasDeluxe ? '(Deluxe)' : ''}</p>"""
content = content.replace(old_title, new_title)

old_tracklist = """                                                <h4 className="font-semibold text-zinc-300">Tracklist</h4>
                                                {project.songIds.map(songId => {
                                                    const song = activeArtistData.songs.find(s => s.id === songId);
                                                    if (!song) return null;
                                                    const trackChartInfo = {
                                                        peak: chartHistory[song.id]?.peak ?? null,
                                                        current: billboardHot100.find(e => e.songId === song.id)?.rank ?? null
                                                    };
                                                    return (
                                                        <TrackItem
                                                            key={song.id}
                                                            song={song}
                                                            chartInfo={trackChartInfo}
                                                            isExpanded={expandedTrackId === song.id}
                                                            onToggleExpand={() => handleToggleTrackInfo(song.id)}
                                                            grammyWin={findGrammyWin(song.id, 'song')}
                                                            canTakeDown={canTakeDown}
                                                            onTakeDown={() => setTakeDownTarget({ type: 'song', id: song.id, title: song.title })}
                                                            onBuyBack={() => {
                                                                const totalRev = song.revenue || 0;
                                                                const cost = Math.floor(Math.max(500000, totalRev * 5 + (activeArtistData.popularity * 25000)));
                                                                if (activeArtistData.money < cost) {
                                                                    alert(`Not enough money. Costs $${formatNumber(cost)}.`);
                                                                    return;
                                                                }
                                                                setConfirmAction({
                                                                    title: 'Buy Back Song',
                                                                    message: `Are you sure you want to buy back "${song.title}" for $${formatNumber(cost)}? It will be 100% owned by you.`,
                                                                    confirmText: 'Buy Back',
                                                                    action: () => {
                                                                        dispatch({ type: 'BUY_BACK_SONG', payload: { songId: song.id, cost } });
                                                                    }
                                                                });
                                                            }}
                                                            isStreamingActive={eraConfig.streamingActive}
                                                        />
                                                    );
                                                })}"""

new_tracklist = """                                                {(project as any).hasDeluxe ? (
                                                    <>
                                                        <h4 className="font-semibold text-zinc-300">Disc 1</h4>
                                                        {project.songIds.map(songId => {
                                                            const song = activeArtistData.songs.find(s => s.id === songId);
                                                            if (!song) return null;
                                                            const trackChartInfo = { peak: chartHistory[song.id]?.peak ?? null, current: billboardHot100.find(e => e.songId === song.id)?.rank ?? null };
                                                            return (
                                                                <TrackItem
                                                                    key={song.id} song={song} chartInfo={trackChartInfo} isExpanded={expandedTrackId === song.id} onToggleExpand={() => handleToggleTrackInfo(song.id)}
                                                                    grammyWin={findGrammyWin(song.id, 'song')} canTakeDown={canTakeDown} onTakeDown={() => setTakeDownTarget({ type: 'song', id: song.id, title: song.title })}
                                                                    onBuyBack={() => {}} isStreamingActive={eraConfig.streamingActive}
                                                                />
                                                            );
                                                        })}
                                                        <h4 className="font-semibold text-zinc-300 mt-4">Disc 2</h4>
                                                        {((project as any).deluxeSongIds || []).filter((id: string) => !project.songIds.includes(id)).map((songId: string) => {
                                                            const song = activeArtistData.songs.find(s => s.id === songId);
                                                            if (!song) return null;
                                                            const trackChartInfo = { peak: chartHistory[song.id]?.peak ?? null, current: billboardHot100.find(e => e.songId === song.id)?.rank ?? null };
                                                            return (
                                                                <TrackItem
                                                                    key={song.id} song={song} chartInfo={trackChartInfo} isExpanded={expandedTrackId === song.id} onToggleExpand={() => handleToggleTrackInfo(song.id)}
                                                                    grammyWin={findGrammyWin(song.id, 'song')} canTakeDown={canTakeDown} onTakeDown={() => setTakeDownTarget({ type: 'song', id: song.id, title: song.title })}
                                                                    onBuyBack={() => {}} isStreamingActive={eraConfig.streamingActive}
                                                                />
                                                            );
                                                        })}
                                                    </>
                                                ) : (
                                                    <>
                                                        <h4 className="font-semibold text-zinc-300">Tracklist</h4>
                                                        {project.songIds.map(songId => {
                                                            const song = activeArtistData.songs.find(s => s.id === songId);
                                                            if (!song) return null;
                                                            const trackChartInfo = { peak: chartHistory[song.id]?.peak ?? null, current: billboardHot100.find(e => e.songId === song.id)?.rank ?? null };
                                                            return (
                                                                <TrackItem
                                                                    key={song.id} song={song} chartInfo={trackChartInfo} isExpanded={expandedTrackId === song.id} onToggleExpand={() => handleToggleTrackInfo(song.id)}
                                                                    grammyWin={findGrammyWin(song.id, 'song')} canTakeDown={canTakeDown} onTakeDown={() => setTakeDownTarget({ type: 'song', id: song.id, title: song.title })}
                                                                    onBuyBack={() => {}} isStreamingActive={eraConfig.streamingActive}
                                                                />
                                                            );
                                                        })}
                                                    </>
                                                )}"""

content = content.replace(old_tracklist, new_tracklist)

with open('components/CatalogView.tsx', 'w') as f:
    f.write(content)
