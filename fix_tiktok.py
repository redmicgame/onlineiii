import re
with open('components/TikTokView.tsx', 'r') as f:
    content = f.read()

# Add viralNpcSongs useMemo
import_pattern = r'const releasedSongs = useMemo\(\(\) => \{'
viral_memo = '''    const viralNpcSongs = useMemo(() => {
        return gameState.spotifyGlobal.slice(0, 50).filter(entry => entry.isNpc);
    }, [gameState.spotifyGlobal]);

    const releasedSongs = useMemo(() => {'''
content = content.replace('    const releasedSongs = useMemo(() => {', viral_memo)

# Update the select tag
select_pattern = r'<option value="">Original Sound</option>\s*\{releasedSongs\.map\(s => \(\s*<option key=\{s\.id\} value=\{s\.id\}>\{s\.title\}</option>\s*\)\)\}'
new_select = '''<option value="">Original Sound</option>
                                <optgroup label="Your Songs">
                                    {releasedSongs.map(s => (
                                        <option key={s.id} value={s.id}>{s.title}</option>
                                    ))}
                                </optgroup>
                                {viralNpcSongs.length > 0 && (
                                    <optgroup label="Viral TikTok Sounds">
                                        {viralNpcSongs.map(s => (
                                            <option key={s.uniqueId} value={`npc_${s.uniqueId}`}>{s.title} - {s.artist}</option>
                                        ))}
                                    </optgroup>
                                )}'''
content = re.sub(select_pattern, new_select, content)

with open('components/TikTokView.tsx', 'w') as f:
    f.write(content)
