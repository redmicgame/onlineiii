import re

with open('components/RadioDashView.tsx', 'r') as f:
    content = f.read()

old_code = """                                    <button
                                        onClick={() => setPromoSongId(promoSongId === song.id ? null : song.id)}
                                        className="text-xs bg-black text-white px-3 py-1 rounded font-bold uppercase tracking-wider"
                                    >
                                        Boost
                                    </button>"""

new_code = """                                    <button
                                        onClick={() => setPromoSongId(promoSongId === song.id ? null : song.id)}
                                        disabled={song.hasRadioPromo}
                                        className="text-xs bg-black text-white px-3 py-1 rounded font-bold uppercase tracking-wider disabled:opacity-50"
                                    >
                                        {song.hasRadioPromo ? 'Boosted' : 'Boost'}
                                    </button>"""

content = content.replace(old_code, new_code)

with open('components/RadioDashView.tsx', 'w') as f:
    f.write(content)
