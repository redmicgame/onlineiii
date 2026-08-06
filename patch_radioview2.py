import re

with open('components/RadioDashView.tsx', 'r') as f:
    content = f.read()

old_code = """                                    <button onClick={() => setPromoSongId(promoSongId === song.id ? null : song.id)} className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded uppercase">
                                        {promoSongId === song.id ? 'Cancel' : 'Promote'}
                                    </button>"""

new_code = """                                    <button 
                                        onClick={() => setPromoSongId(promoSongId === song.id ? null : song.id)} 
                                        disabled={song.hasRadioPromo}
                                        className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded uppercase disabled:opacity-50">
                                        {song.hasRadioPromo ? 'Promoted' : promoSongId === song.id ? 'Cancel' : 'Promote'}
                                    </button>"""

content = content.replace(old_code, new_code)

with open('components/RadioDashView.tsx', 'w') as f:
    f.write(content)
