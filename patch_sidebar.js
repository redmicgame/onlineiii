const fs = require('fs');
const content = fs.readFileSync('components/SpotifyForCreatorsView.tsx', 'utf-8');
const patched = content
    .replace('<nav className="flex flex-col gap-1 mb-8">', '<nav className="flex flex-row md:flex-col gap-2 mb-4 md:mb-8 overflow-x-auto pb-2 flex-shrink-0">')
    .replace('<div className="flex flex-col gap-2">', '<div className="flex flex-row md:flex-col gap-2 overflow-x-auto">')
    .replace('className={`flex items-center gap-3 px-3 py-2.5 rounded-md font-bold text-sm transition-colors ${activeTab === item.id ? \'bg-zinc-800 text-white\' : \'text-zinc-400 hover:text-white hover:bg-zinc-900\'}`}',
             'className={`flex items-center whitespace-nowrap gap-2 md:gap-3 px-3 py-2 md:py-2.5 rounded-md font-bold text-sm transition-colors ${activeTab === item.id ? \'bg-zinc-800 text-white\' : \'text-zinc-400 hover:text-white hover:bg-zinc-900\'}`}');
fs.writeFileSync('components/SpotifyForCreatorsView.tsx', patched);
