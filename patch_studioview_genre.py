import re

with open('components/StudioView.tsx', 'r') as f:
    content = f.read()

old_code1 = """<select value={genre} onChange={e => { setGenre(e.target.value); setSubgenre(SUBGENRES_BY_GENRE[e.target.value]?.[0] || SUBGENRES[0]); }} className="block w-full bg-zinc-700 border-zinc-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm h-10 px-3">"""
new_code1 = """<select value={genre} onChange={e => { setGenre(e.target.value); setSubgenre(SUBGENRES[0]); }} className="block w-full bg-zinc-700 border-zinc-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm h-10 px-3">"""

old_code2 = """{(SUBGENRES_BY_GENRE[genre] || SUBGENRES).map(sg => <option key={sg} value={sg}>{sg}</option>)}"""
new_code2 = """{SUBGENRES.map(sg => <option key={sg} value={sg}>{sg}</option>)}"""

if old_code1 in content and old_code2 in content:
    content = content.replace(old_code1, new_code1)
    content = content.replace(old_code2, new_code2)
    print("Patched successfully!")
else:
    print("Match not found!")
    if old_code1 not in content:
        print("Missing code 1")
    if old_code2 not in content:
        print("Missing code 2")

with open('components/StudioView.tsx', 'w') as f:
    f.write(content)
