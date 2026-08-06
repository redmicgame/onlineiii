import re

with open('components/StudioView.tsx', 'r') as f:
    content = f.read()

old_state = """    const [feature1, setFeature1] = useState<{ artistName: string; cost: number } | null>(null);
    const [feature2, setFeature2] = useState<{ artistName: string; cost: number } | null>(null);"""

new_state = """    const [feature1, setFeature1] = useState<{ artistName: string; cost: number } | null>(null);
    const [feature2, setFeature2] = useState<{ artistName: string; cost: number } | null>(null);
    const [isCustomFeature1, setIsCustomFeature1] = useState(false);
    const [isCustomFeature2, setIsCustomFeature2] = useState(false);"""
content = content.replace(old_state, new_state)

old_f1 = """                                            <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-700">
                                                <label htmlFor="feature1" className="block text-sm font-medium text-zinc-300">Feature 1 Artist</label>
                                                <select id="feature1" onChange={handleFeature1Change} className="mt-1 block w-full bg-zinc-700 border-zinc-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm h-10 px-3">
                                                    <option value="">None</option>
                                                    {potentialCollaborators.map(name => <option key={name} value={name}>{name}</option>)}
                                                </select>
                                                {feature1 && (
                                                    <p className="text-sm text-yellow-400 mt-2">Feature Cost: ${formatNumber(feature1.cost)}</p>
                                                )}
                                            </div>"""

new_f1 = """                                            <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-700">
                                                <div className="flex justify-between items-center mb-1">
                                                    <label htmlFor="feature1" className="block text-sm font-medium text-zinc-300">Feature 1 Artist</label>
                                                    {gameState.hasRedMicPro && (
                                                        <button onClick={() => { setIsCustomFeature1(!isCustomFeature1); setFeature1(null); }} className="text-xs text-blue-400 font-bold hover:underline">
                                                            {isCustomFeature1 ? 'Choose Existing' : 'Custom Feature'}
                                                        </button>
                                                    )}
                                                </div>
                                                {!isCustomFeature1 ? (
                                                    <select id="feature1" onChange={handleFeature1Change} className="mt-1 block w-full bg-zinc-700 border-zinc-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm h-10 px-3">
                                                        <option value="">None</option>
                                                        {potentialCollaborators.map(name => <option key={name} value={name}>{name}</option>)}
                                                    </select>
                                                ) : (
                                                    <div className="space-y-2 mt-1">
                                                        <input 
                                                            type="text" 
                                                            placeholder="Artist Name" 
                                                            value={feature1?.artistName || ''}
                                                            onChange={e => setFeature1({ artistName: e.target.value, cost: feature1?.cost || 0 })}
                                                            className="block w-full bg-zinc-700 border-zinc-600 rounded-md shadow-sm focus:ring-red-500 sm:text-sm h-10 px-3 text-white"
                                                        />
                                                        <input 
                                                            type="number" 
                                                            placeholder="Cost ($)" 
                                                            value={feature1?.cost ?? ''}
                                                            onChange={e => setFeature1({ artistName: feature1?.artistName || '', cost: parseInt(e.target.value) || 0 })}
                                                            className="block w-full bg-zinc-700 border-zinc-600 rounded-md shadow-sm focus:ring-red-500 sm:text-sm h-10 px-3 text-white"
                                                        />
                                                    </div>
                                                )}
                                                {feature1 && !isCustomFeature1 && (
                                                    <p className="text-sm text-yellow-400 mt-2">Feature Cost: ${formatNumber(feature1.cost)}</p>
                                                )}
                                            </div>"""

content = content.replace(old_f1, new_f1)

old_f2 = """                                            <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-700">
                                                <label htmlFor="feature2" className="block text-sm font-medium text-zinc-300">Feature 2 Artist</label>
                                                <select id="feature2" onChange={handleFeature2Change} className="mt-1 block w-full bg-zinc-700 border-zinc-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm h-10 px-3">
                                                    <option value="">None</option>
                                                    {potentialCollaborators.map(name => <option key={name} value={name}>{name}</option>)}
                                                </select>
                                                {feature2 && (
                                                    <p className="text-sm text-yellow-400 mt-2">Feature Cost: ${formatNumber(feature2.cost)}</p>
                                                )}
                                            </div>"""

new_f2 = """                                            <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-700">
                                                <div className="flex justify-between items-center mb-1">
                                                    <label htmlFor="feature2" className="block text-sm font-medium text-zinc-300">Feature 2 Artist</label>
                                                    {gameState.hasRedMicPro && (
                                                        <button onClick={() => { setIsCustomFeature2(!isCustomFeature2); setFeature2(null); }} className="text-xs text-blue-400 font-bold hover:underline">
                                                            {isCustomFeature2 ? 'Choose Existing' : 'Custom Feature'}
                                                        </button>
                                                    )}
                                                </div>
                                                {!isCustomFeature2 ? (
                                                    <select id="feature2" onChange={handleFeature2Change} className="mt-1 block w-full bg-zinc-700 border-zinc-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm h-10 px-3">
                                                        <option value="">None</option>
                                                        {potentialCollaborators.map(name => <option key={name} value={name}>{name}</option>)}
                                                    </select>
                                                ) : (
                                                    <div className="space-y-2 mt-1">
                                                        <input 
                                                            type="text" 
                                                            placeholder="Artist Name" 
                                                            value={feature2?.artistName || ''}
                                                            onChange={e => setFeature2({ artistName: e.target.value, cost: feature2?.cost || 0 })}
                                                            className="block w-full bg-zinc-700 border-zinc-600 rounded-md shadow-sm focus:ring-red-500 sm:text-sm h-10 px-3 text-white"
                                                        />
                                                        <input 
                                                            type="number" 
                                                            placeholder="Cost ($)" 
                                                            value={feature2?.cost ?? ''}
                                                            onChange={e => setFeature2({ artistName: feature2?.artistName || '', cost: parseInt(e.target.value) || 0 })}
                                                            className="block w-full bg-zinc-700 border-zinc-600 rounded-md shadow-sm focus:ring-red-500 sm:text-sm h-10 px-3 text-white"
                                                        />
                                                    </div>
                                                )}
                                                {feature2 && !isCustomFeature2 && (
                                                    <p className="text-sm text-yellow-400 mt-2">Feature Cost: ${formatNumber(feature2.cost)}</p>
                                                )}
                                            </div>"""
content = content.replace(old_f2, new_f2)

with open('components/StudioView.tsx', 'w') as f:
    f.write(content)
