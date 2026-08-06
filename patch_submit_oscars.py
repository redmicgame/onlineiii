import re

with open('components/SubmitForOscarsView.tsx', 'r') as f:
    content = f.read()

old_code = """    const [leadingSelection, setLeadingSelection] = useState<string>('');
    const [supportingSelection, setSupportingSelection] = useState<string>('');

    if (!activeArtistData || !activeArtist) return null;

    const eligibleSongs = useMemo(() => {
        const previousYearReleases = activeArtistData.releases.filter(r => r.releaseDate.year === date.year - 1);
        const songIdsFromPreviousYear = new Set(previousYearReleases.flatMap(r => r.songIds));
        return activeArtistData.songs.filter(s => songIdsFromPreviousYear.has(s.id) && s.soundtrackTitle);
    }, [activeArtistData.releases, activeArtistData.songs, date.year]);
    
    const eligibleActingRoles = useMemo(() => {
        return (activeArtistData.actingRoles || []).filter(r => r.year === date.year - 1 && r.status === 'Released');
    }, [activeArtistData.actingRoles, date.year]);
    
    const eligibleLeading = eligibleActingRoles.filter(r => !r.roleType || r.roleType === 'Leading Role');
    const eligibleSupporting = eligibleActingRoles.filter(r => r.roleType === 'Supporting Role');"""

new_code = """    const [leadingSelection, setLeadingSelection] = useState<string>('');
    const [supportingSelection, setSupportingSelection] = useState<string>('');
    const [voiceSelection, setVoiceSelection] = useState<string>('');

    if (!activeArtistData || !activeArtist) return null;

    const eligibleSongs = useMemo(() => {
        const previousYearReleases = activeArtistData.releases.filter(r => r.releaseDate.year === date.year - 1);
        const songIdsFromPreviousYear = new Set(previousYearReleases.flatMap(r => r.songIds));
        return activeArtistData.songs.filter(s => songIdsFromPreviousYear.has(s.id) && s.soundtrackTitle);
    }, [activeArtistData.releases, activeArtistData.songs, date.year]);
    
    const eligibleActingRoles = useMemo(() => {
        return (activeArtistData.actingRoles || []).filter(r => r.year === date.year - 1 && r.status === 'Released');
    }, [activeArtistData.actingRoles, date.year]);
    
    const eligibleLeading = eligibleActingRoles.filter(r => (!r.roleType || r.roleType === 'Leading Role') && r.type !== 'Voice Acting');
    const eligibleSupporting = eligibleActingRoles.filter(r => r.roleType === 'Supporting Role' && r.type !== 'Voice Acting');
    const eligibleVoice = eligibleActingRoles.filter(r => r.type === 'Voice Acting');"""

content = content.replace(old_code, new_code)

old_code2 = """        if (leadingSelection) {
            const role = eligibleLeading.find(r => r.id === leadingSelection);
            if (role) submissions.push({ artistId: activeArtist.id, category: 'Best Actor/Actress (Leading Role)' as CategoryName, itemId: role.id, itemName: role.title });
        }
        if (supportingSelection) {
            const role = eligibleSupporting.find(r => r.id === supportingSelection);
            if (role) submissions.push({ artistId: activeArtist.id, category: 'Best Supporting Actor/Actress (Supporting Role)' as CategoryName, itemId: role.id, itemName: role.title });
        }
        
        if (submissions.length === 0) return;"""

new_code2 = """        if (leadingSelection) {
            const role = eligibleLeading.find(r => r.id === leadingSelection);
            if (role) submissions.push({ artistId: activeArtist.id, category: 'Best Actor/Actress' as CategoryName, itemId: role.id, itemName: role.title });
        }
        if (supportingSelection) {
            const role = eligibleSupporting.find(r => r.id === supportingSelection);
            if (role) submissions.push({ artistId: activeArtist.id, category: 'Best Supporting Actor/Actress' as CategoryName, itemId: role.id, itemName: role.title });
        }
        if (voiceSelection) {
            const role = eligibleVoice.find(r => r.id === voiceSelection);
            if (role) submissions.push({ artistId: activeArtist.id, category: 'Best Voice Actor/Actress' as CategoryName, itemId: role.id, itemName: role.title });
        }
        
        if (submissions.length === 0) return;"""

content = content.replace(old_code2, new_code2)

old_code3 = """    const hasAnySelection = !!songSelection || !!leadingSelection || !!supportingSelection;"""
new_code3 = """    const hasAnySelection = !!songSelection || !!leadingSelection || !!supportingSelection || !!voiceSelection;"""
content = content.replace(old_code3, new_code3)

old_code4 = """                <div>
                    <label htmlFor="best-leading" className="block text-lg font-bold text-[#d4af37]">Best Actor/Actress (Leading Role)</label>"""
new_code4 = """                <div>
                    <label htmlFor="best-leading" className="block text-lg font-bold text-[#d4af37]">Best Actor/Actress</label>"""
content = content.replace(old_code4, new_code4)

old_code5 = """                <div>
                    <label htmlFor="best-supporting" className="block text-lg font-bold text-[#d4af37]">Best Supporting Actor/Actress (Supporting Role)</label>"""
new_code5 = """                <div>
                    <label htmlFor="best-supporting" className="block text-lg font-bold text-[#d4af37]">Best Supporting Actor/Actress</label>"""
content = content.replace(old_code5, new_code5)

new_voice_ui = """                <div>
                    <label htmlFor="best-voice" className="block text-lg font-bold text-[#d4af37]">Best Voice Actor/Actress</label>
                    <p className="text-sm text-zinc-400 mb-2">Submit your Voice Acting roles.</p>
                    {eligibleVoice.length === 0 ? (
                        <div className="mt-1 text-sm text-zinc-500 bg-zinc-800 p-3 rounded-md">No eligible voice acting roles from the previous year.</div>
                    ) : (
                        <select 
                            id="best-voice"
                            value={voiceSelection}
                            onChange={e => setVoiceSelection(e.target.value)}
                            className="mt-1 block w-full bg-zinc-700 border-zinc-600 rounded-md shadow-sm focus:ring-[#d4af37] focus:border-[#d4af37] sm:text-sm h-12 px-3 text-white"
                        >
                            <option value="">-- Select a voice acting role --</option>
                            {eligibleVoice.map(opt => <option key={opt.id} value={opt.id}>{opt.title} ({opt.type})</option>)}
                        </select>
                    )}
                </div>
            </main>"""
content = content.replace('            </main>', new_voice_ui)

with open('components/SubmitForOscarsView.tsx', 'w') as f:
    f.write(content)
