with open('components/LiveLeaderboardView.tsx', 'r') as f:
    content = f.read()

import re

# Add the new state variables
pattern1 = r'const \[syncing, setSyncing\] = useState\(false\);\s*const \[syncProgress, setSyncProgress\] = useState\(0\);'
new_state = r'const [syncing, setSyncing] = useState(false);\n    const [syncingImages, setSyncingImages] = useState(false);\n    const [syncProgress, setSyncProgress] = useState(0);'
content = re.sub(pattern1, new_state, content)

# Add the new function
handle_sync = '''
    const handleSyncImages = async () => {
        if (!user) return;
        setSyncingImages(true);
        setSyncProgress(0);

        try {
            const allSaves = await db.saves.toArray();
            const bestStats: Record<string, any> = {};

            for (let i = 0; i < allSaves.length; i++) {
                const save = allSaves[i];
                if (!save || !save.state) continue;
                
                let stateToAnalyze = save.state;
                // Force inject media to get the actual cover arts instead of UUIDs
                stateToAnalyze = await injectMediaIntoState(save.state);
                
                const mode = stateToAnalyze.difficultyMode || 'normal';
                
                let maxSongStreams = 0;
                let maxSongData: any = null;
                
                let maxAlbumSales = 0;
                let maxAlbumData: any = null;
                
                let maxGrammys = 0;
                let maxGrammyArtist = "";
                let maxGrammyImage = "";
                
                let maxFollowers = 0;
                let maxFollowerArtist = "";
                let maxFollowerImage = "";

                Object.keys(stateToAnalyze.artistsData || {}).forEach(artistId => {
                    const data = stateToAnalyze.artistsData[artistId];
                    if (!data) return;

                    const artistName = stateToAnalyze.soloArtist?.name || stateToAnalyze.group?.name || "Artist";
                    const artistImage = stateToAnalyze.soloArtist?.avatar || stateToAnalyze.group?.avatar || "";
                    
                    if (data.songs) {
                        data.songs.forEach((song: any) => {
                            if ((song.streams || 0) > maxSongStreams) {
                                maxSongStreams = song.streams;
                                maxSongData = { songName: song.title, cover: song.coverArt, artistName };
                            }
                        });
                    }
                    if (data.releases) {
                        data.releases.forEach((rel: any) => {
                            if (rel.type === 'Album' && (rel.sales || 0) > maxAlbumSales) {
                                maxAlbumSales = rel.sales;
                                maxAlbumData = { albumName: rel.title, cover: rel.coverArt, artistName };
                            }
                        });
                    }
                    if (data.grammyHistory && data.grammyHistory.length > maxGrammys) {
                        maxGrammys = data.grammyHistory.length;
                        maxGrammyArtist = artistName;
                        maxGrammyImage = artistImage;
                    }
                    if (data.instagramFollowers && data.instagramFollowers > maxFollowers) {
                        maxFollowers = data.instagramFollowers;
                        maxFollowerArtist = artistName;
                        maxFollowerImage = artistImage;
                    }
                });

                if (maxSongData && maxSongStreams > (bestStats[`${mode}_mostStreamedSong`]?.score || 0)) {
                    bestStats[`${mode}_mostStreamedSong`] = { score: maxSongStreams, ...maxSongData };
                }
                if (maxAlbumData && maxAlbumSales > (bestStats[`${mode}_bestSellingAlbum`]?.score || 0)) {
                    bestStats[`${mode}_bestSellingAlbum`] = { score: maxAlbumSales, ...maxAlbumData };
                }
                if (maxGrammys > (bestStats[`${mode}_mostGrammys`]?.score || 0)) {
                    bestStats[`${mode}_mostGrammys`] = { score: maxGrammys, artistName: maxGrammyArtist, cover: maxGrammyImage, itemName: "" };
                }
                if (maxFollowers > (bestStats[`${mode}_mostIgFollowers`]?.score || 0)) {
                    bestStats[`${mode}_mostIgFollowers`] = { score: maxFollowers, artistName: maxFollowerArtist, cover: maxFollowerImage, itemName: "" };
                }
                
                setSyncProgress(Math.floor(((i + 1) / allSaves.length) * 100));
            }

            for (const key of Object.keys(bestStats)) {
                const [mode, category] = key.split('_');
                const stat = bestStats[key];
                await uploadLeaderboardStats(
                    user.uid,
                    mode,
                    category,
                    stat.score,
                    stat.artistName,
                    stat.songName || stat.albumName || stat.itemName || "",
                    stat.cover || ""
                );
            }

            fetchLeaderboard();
        } catch (e) {
            console.error("Sync error", e);
            alert("Error syncing saves. They may be corrupted.");
        } finally {
            setSyncingImages(false);
            setSyncProgress(0);
        }
    };
'''

content = content.replace('    const handleSync = async () => {', handle_sync + '\n    const handleSync = async () => {')

# Add the new button
old_buttons = '''<div className="flex justify-between items-center mb-4">
                            <h2 className="font-bold text-lg">Top Players</h2>
                            <button
                                onClick={!user ? undefined : handleSync}
                                disabled={!user || syncing}
                                className={`px-4 py-2 rounded-lg text-sm font-bold ${!user ? 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed' : syncing ? 'bg-zinc-700 text-zinc-400' : 'bg-green-600 hover:bg-green-500 text-white'} transition-colors`}
                                title={!user ? "Sign in via Settings to sync saves" : ""}
                            >
                                {!user ? 'Sign in to Sync' : syncing ? `Syncing... ${syncProgress}%` : 'Sync My Saves'}
                            </button>
                        </div>'''

new_buttons = '''<div className="flex justify-between items-center mb-4">
                            <h2 className="font-bold text-lg">Top Players</h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={!user ? undefined : handleSyncImages}
                                    disabled={!user || syncing || syncingImages}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold ${!user ? 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed' : syncingImages ? 'bg-pink-900/50 text-pink-400' : 'bg-pink-600 hover:bg-pink-500 text-white'} transition-colors`}
                                    title={!user ? "Sign in via Settings to sync saves" : ""}
                                >
                                    {syncingImages ? `Syncing... ${syncProgress}%` : 'Sync Saves Images'}
                                </button>
                                <button
                                    onClick={!user ? undefined : handleSync}
                                    disabled={!user || syncing || syncingImages}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold ${!user ? 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed' : syncing ? 'bg-zinc-700 text-zinc-400' : 'bg-green-600 hover:bg-green-500 text-white'} transition-colors`}
                                    title={!user ? "Sign in via Settings to sync saves" : ""}
                                >
                                    {!user ? 'Sign in to Sync' : syncing ? `Syncing... ${syncProgress}%` : 'Sync My Saves'}
                                </button>
                            </div>
                        </div>'''

content = content.replace(old_buttons, new_buttons)

with open('components/LiveLeaderboardView.tsx', 'w') as f:
    f.write(content)

