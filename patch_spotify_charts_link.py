import re

with open('components/SpotifyView.tsx', 'r') as f:
    content = f.read()

old_code = """                {/* Listeners and Actions */}
                <div>
                    <p className="text-zinc-400 text-sm">
                        {monthlyListeners >= 1000000 
                            ? `${(monthlyListeners / 1000000).toFixed(1).replace(/\.0$/, '')}M` 
                            : monthlyListeners.toLocaleString()} monthly listeners
                    </p>"""

new_code = """                {/* Charts Button */}
                <button onClick={() => dispatch({type: 'CHANGE_VIEW', payload: 'spotifyChart'})} className="w-full bg-gradient-to-r from-emerald-800 to-emerald-900 p-4 rounded-xl flex items-center justify-between group hover:scale-[1.02] transition-transform shadow-lg border border-emerald-700/50">
                    <div className="flex items-center gap-3">
                        <SpotifyIcon className="w-8 h-8 text-[#1DB954]" />
                        <div className="text-left">
                            <p className="font-bold text-white text-lg leading-tight">Spotify Charts</p>
                            <p className="text-xs text-zinc-300">Top 50 Global & Countdowns</p>
                        </div>
                    </div>
                    <ChevronRightIcon className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
                </button>

                {/* Listeners and Actions */}
                <div>
                    <p className="text-zinc-400 text-sm">
                        {monthlyListeners >= 1000000 
                            ? `${(monthlyListeners / 1000000).toFixed(1).replace(/\.0$/, '')}M` 
                            : monthlyListeners.toLocaleString()} monthly listeners
                    </p>"""

content = content.replace(old_code, new_code)

with open('components/SpotifyView.tsx', 'w') as f:
    f.write(content)
