import re

with open('components/StudioView.tsx', 'r') as f:
    content = f.read()

# Replace renderMultiSelect
old_render = """    const renderMultiSelect = (label: string, state: string[], setState: React.Dispatch<React.SetStateAction<string[]>>, options: string[]) => (
        <div className="mt-4">
            <label className="block text-sm font-medium text-zinc-300">{label}</label>
            <div className="flex flex-wrap gap-2 mt-2">
                {state.map(item => (
                    <span key={item} className="bg-zinc-600 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                        {item}
                        <button onClick={() => setState(s => s.filter(i => i !== item))} className="hover:text-red-400">×</button>
                    </span>
                ))}
            </div>
            {state.length < 20 && (
                <select 
                    value="" 
                    onChange={e => {
                        if (e.target.value && !state.includes(e.target.value)) {
                            setState(s => [...s, e.target.value]);
                        }
                    }} 
                    className="mt-2 block w-full bg-zinc-700 border-zinc-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm h-10 px-3"
                >
                    <option value="">Add {label}...</option>
                    {options.filter(c => !state.includes(c)).map(name => (
                        <option key={name} value={name}>{name}</option>
                    ))}
                </select>
            )}
        </div>
    );"""

new_render = """    const renderMultiSelect = (label: string, state: string[], setState: React.Dispatch<React.SetStateAction<string[]>>, options: string[]) => {
        return (
            <div className="mt-4">
                <label className="block text-sm font-medium text-zinc-300">{label}</label>
                <div className="flex flex-wrap gap-2 mt-2">
                    {state.map(item => (
                        <span key={item} className="bg-zinc-600 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                            {item}
                            <button onClick={() => setState(s => s.filter(i => i !== item))} className="hover:text-red-400">×</button>
                        </span>
                    ))}
                </div>
                {state.length < 20 && (
                    <div className="flex flex-col sm:flex-row gap-2 mt-2">
                        <select 
                            value="" 
                            onChange={e => {
                                if (e.target.value && !state.includes(e.target.value)) {
                                    setState(s => [...s, e.target.value]);
                                }
                            }} 
                            className="flex-1 block w-full bg-zinc-700 border-zinc-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm h-10 px-3"
                        >
                            <option value="">Add {label}...</option>
                            {options.filter(c => !state.includes(c)).map(name => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </select>
                        {activeArtistData.redMicPro?.unlocked && (
                            <div className="flex gap-2 w-full sm:w-auto">
                                <input 
                                    type="text" 
                                    placeholder={`Custom ${label}...`}
                                    className="flex-1 bg-zinc-700 border-zinc-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm h-10 px-3"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            const val = e.currentTarget.value.trim();
                                            if (val && !state.includes(val)) {
                                                setState(s => [...s, val]);
                                                e.currentTarget.value = '';
                                            }
                                        }
                                    }}
                                />
                            </div>
                        )}
                    </div>
                )}
                {activeArtistData.redMicPro?.unlocked && state.length > 0 && (
                    <div className="mt-2 text-xs text-zinc-400">
                        <div className="flex flex-wrap gap-2 mt-1">
                            {state.filter(item => !options.includes(item)).map(item => (
                                <div key={item} className="flex items-center gap-2 bg-zinc-800 p-1 rounded">
                                    <span>{item}</span>
                                    {customImageUploads[item] ? (
                                        <img src={customImageUploads[item]} alt={item} className="w-6 h-6 rounded-full object-cover" />
                                    ) : (
                                        <input type="file" accept="image/*" className="text-xs w-48 bg-zinc-700 rounded p-1" onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onload = (ev) => {
                                                    setCustomImageUploads(prev => ({...prev, [item]: ev.target?.result as string}));
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };"""

content = content.replace(old_render, new_render)

old_ui_header = """                        <div className="pt-4 border-t border-zinc-700/50 mt-4 space-y-2">
                            <h3 className="text-lg font-bold">Contributors (SongDNA)</h3>
                            <p className="text-xs text-zinc-400">Add up to 20 for each category.</p>"""

new_ui_header = """                        <div className="pt-4 border-t border-zinc-700/50 mt-4 space-y-2">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                <div>
                                    <h3 className="text-lg font-bold">Contributors (SongDNA)</h3>
                                    <p className="text-xs text-zinc-400">Add up to 20 for each category.</p>
                                </div>
                                <div className="flex bg-zinc-800 rounded-lg p-1">
                                    <button 
                                        onClick={() => setContributorPaymentMethod('split')}
                                        className={`px-3 py-1 text-xs rounded-md font-semibold transition-colors ${contributorPaymentMethod === 'split' ? 'bg-red-500 text-white' : 'text-zinc-400 hover:text-white'}`}
                                    >
                                        Give % Split
                                    </button>
                                    <button 
                                        onClick={() => setContributorPaymentMethod('upfront')}
                                        className={`px-3 py-1 text-xs rounded-md font-semibold transition-colors ${contributorPaymentMethod === 'upfront' ? 'bg-red-500 text-white' : 'text-zinc-400 hover:text-white'}`}
                                    >
                                        Pay Upfront (${(CONTRIBUTOR_UPFRONT_COST).toLocaleString()}/each)
                                    </button>
                                </div>
                            </div>"""

content = content.replace(old_ui_header, new_ui_header)

with open('components/StudioView.tsx', 'w') as f:
    f.write(content)
