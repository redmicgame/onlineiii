import re

with open('components/ImdbView.tsx', 'r') as f:
    content = f.read()

target1 = """    const hasActing = roles.length > 0;
    const hasSoundtrack = soundtracks.length > 0;

    let subTags = [];
    if (hasActing) subTags.push("Actress");
    if (hasSoundtrack) subTags.push("Composer", "Soundtrack");
    if (subTags.length === 0) subTags.push("Musical Artist");"""

replacement1 = """    const hasSoundtrack = soundtracks.length > 0;

    let subTags = [];
    if ((activeArtistData.songs || []).length > 0 || (activeArtistData.releases || []).length > 0) subTags.push("Musical Artist");
    if (roles.some(r => r.type === 'Movie' || r.type === 'TV Show')) subTags.push("Actress");
    if (roles.some(r => r.type === 'Voice Acting')) subTags.push("Voice Actress");
    if (hasSoundtrack) subTags.push("Composer");
    
    if (subTags.length === 0) subTags.push("Musical Artist");"""

content = content.replace(target1, replacement1)

target2 = """                                <div className="w-12 h-16 shrink-0 bg-zinc-800 rounded overflow-hidden">
                                    {(credit as any).trailerUrl ? (
                                        <img src={(credit as any).trailerUrl} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs text-zinc-500">{credit.type.substring(0,2)}</div>
                                    )}
                                </div>"""

replacement2 = """                                <label className="w-12 h-16 shrink-0 bg-zinc-800 rounded overflow-hidden cursor-pointer relative block group">
                                    {(credit as any).coverUrl ? (
                                        <img src={(credit as any).coverUrl} className="w-full h-full object-cover" />
                                    ) : (credit as any).trailerUrl ? (
                                        <img src={(credit as any).trailerUrl} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs text-zinc-500">{credit.type.substring(0,2)}</div>
                                    )}
                                    <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center">
                                        <svg fill="white" viewBox="0 0 24 24" width="16" height="16"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>
                                    </div>
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file && (credit as any).id) {
                                                const reader = new FileReader();
                                                reader.onload = (event) => {
                                                    const result = event.target?.result as string;
                                                    dispatch({ type: 'SET_ACTING_COVER_URL', payload: { roleId: (credit as any).id, coverUrl: result } });
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                </label>"""

content = content.replace(target2, replacement2)

with open('components/ImdbView.tsx', 'w') as f:
    f.write(content)
print("Replaced!")
