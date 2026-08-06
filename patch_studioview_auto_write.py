with open('components/StudioView.tsx', 'r') as f:
    content = f.read()

# Add mode state
content = content.replace("useState<'single' | 'remixPack' | 'rerecord' | 'remaster'>('single');", "useState<'single' | 'remixPack' | 'rerecord' | 'remaster' | 'autoWrite'>('single');")

# Add new states
import_line = "const [anr, setAnr] = useState<string[]>([]);"
new_states = """const [anr, setAnr] = useState<string[]>([]);
    const [spotifyLink, setSpotifyLink] = useState('');
    const [autoWriteData, setAutoWriteData] = useState<{ title: string, artist: string, image: string, tracks: {title: string, duration: number}[] } | null>(null);
    const [isFetchingSpotify, setIsFetchingSpotify] = useState(false);
    const [autoWriteError, setAutoWriteError] = useState('');
"""
content = content.replace(import_line, new_states)

# Add button to header
button_old = """                    <button
                        onClick={() => { setMode('remaster'); setError(''); }}
                        className={`px-4 py-1 rounded-md text-sm font-semibold transition-colors shrink-0 ${mode === 'remaster' ? 'bg-zinc-600 text-white' : 'text-zinc-400 hover:text-white'}`}
                    >
                        Remaster
                    </button>"""
button_new = button_old + """
                    <button
                        onClick={() => { setMode('autoWrite'); setError(''); }}
                        className={`px-4 py-1 rounded-md text-sm font-semibold transition-colors shrink-0 ${mode === 'autoWrite' ? 'bg-zinc-600 text-white' : 'text-zinc-400 hover:text-white'}`}
                    >
                        Auto Write (Spotify)
                    </button>"""
content = content.replace(button_old, button_new)

with open('components/StudioView.tsx', 'w') as f:
    f.write(content)
