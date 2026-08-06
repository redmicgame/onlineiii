import re

with open('components/SpotifyView.tsx', 'r') as f:
    content = f.read()

# Add getSpotifyRank at the top or inside the file
get_spotify_rank_code = """
const getSpotifyRank = (listeners: number) => {
    if (listeners < 30000000) return null;
    if (listeners >= 148000000) return 1;
    const rank = Math.round(200 - ((listeners - 30000000) / (118000000 / 199)));
    return Math.max(1, Math.min(200, rank));
};

const VerifiedModal: React.FC<{ isOpen: boolean; onClose: () => void; sinceYear: number; releasesCount: number; playlists: string[] }> ="""

content = content.replace("const VerifiedModal: React.FC<{ isOpen: boolean; onClose: () => void; sinceYear: number; releasesCount: number; playlists: string[] }> =", get_spotify_rank_code)

# Patch AboutModal
old_about_modal = """                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-3xl font-black mb-1">{listeners}</p>
                                <p className="text-sm text-zinc-400 font-semibold uppercase tracking-wider">Monthly Listeners</p>
                            </div>
                        </div>"""

new_about_modal = """                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                {getSpotifyRank(artistData.monthlyListeners) !== null && (
                                    <div className="mb-4">
                                        <p className="text-5xl font-black mb-1">#{getSpotifyRank(artistData.monthlyListeners)}</p>
                                        <p className="text-sm text-zinc-300 font-medium">in the world</p>
                                    </div>
                                )}
                                <p className="text-3xl font-black mb-1">{artistData.monthlyListeners.toLocaleString()}</p>
                                <p className="text-sm text-zinc-400 font-semibold uppercase tracking-wider">Monthly Listeners</p>
                            </div>
                        </div>"""

content = content.replace(old_about_modal, new_about_modal)

# Patch main view
old_main_about = """                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-1">
                                    <h3 className="text-xl font-bold">{activeArtist.name}</h3>
                                    {activeArtistData.isSpotifyVerified && (
                                        <div className="ml-1 flex items-center">
                                            <VerifiedBadgeIcon className="w-5 h-5 text-[#A0D9B1]" />
                                        </div>
                                    )}
                                </div>
                                <button className="border border-zinc-400 rounded-full px-4 py-1 text-sm font-semibold hover:border-white">
                                    Follow
                                </button>
                            </div>
                            <p className="text-sm text-zinc-400 mb-4">{monthlyListeners >= 1000000 ? `${(monthlyListeners / 1000000).toFixed(1).replace(/\.0$/, '')}M` : monthlyListeners.toLocaleString()} monthly listeners</p>"""

new_main_about = """                            {getSpotifyRank(monthlyListeners) !== null && (
                                <p className="text-sm font-semibold mb-1">#{getSpotifyRank(monthlyListeners)} in Top Artists</p>
                            )}
                            <div className="flex justify-between items-center mb-1">
                                <div className="flex items-center gap-1">
                                    <h3 className="text-xl font-bold">{activeArtist.name}</h3>
                                    {activeArtistData.isSpotifyVerified && (
                                        <div className="ml-1 flex items-center">
                                            <VerifiedBadgeIcon className="w-5 h-5 text-[#A0D9B1]" />
                                        </div>
                                    )}
                                </div>
                                <button className="border border-zinc-400 rounded-full px-4 py-1 text-sm font-semibold hover:border-white">
                                    Follow
                                </button>
                            </div>
                            <p className="text-sm text-zinc-400 mb-4">{monthlyListeners >= 1000000 ? `${(monthlyListeners / 1000000).toFixed(1).replace(/\.0$/, '')}M` : monthlyListeners.toLocaleString()} monthly listeners</p>"""

content = content.replace(old_main_about, new_main_about)

with open('components/SpotifyView.tsx', 'w') as f:
    f.write(content)

