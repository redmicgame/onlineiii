import re

with open('components/StudioView.tsx', 'r') as f:
    content = f.read()

old_state = """    const [collaboration, setCollaboration] = useState<{ artistName: string; cost: number } | null>(null);"""
new_state = """    const [collaboration, setCollaboration] = useState<{ artistName: string; cost: number } | null>(null);
    const [isCustomCollab, setIsCustomCollab] = useState(false);"""
content = content.replace(old_state, new_state)

old_ui = """                         <div>
                            <label htmlFor="collaboration" className="block text-sm font-medium text-zinc-300">Collaboration (Optional)</label>
                            <select id="collaboration" onChange={handleCollaborationChange} className="mt-1 block w-full bg-zinc-700 border-zinc-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm h-10 px-3">
                                <option value="">None</option>
                                {potentialCollaborators.map(name => <option key={name} value={name}>{name}</option>)}
                            </select>
                            {collaboration && (
                                <p className="text-sm text-yellow-400 mt-2">Feature Cost: ${formatNumber(collaboration.cost)}</p>
                            )}
                        </div>"""

new_ui = """                         <div>
                            <div className="flex justify-between items-center mb-1">
                                <label htmlFor="collaboration" className="block text-sm font-medium text-zinc-300">Collaboration (Optional)</label>
                                {gameState.hasRedMicPro && (
                                    <button onClick={() => { setIsCustomCollab(!isCustomCollab); setCollaboration(null); }} className="text-xs text-blue-400 font-bold hover:underline">
                                        {isCustomCollab ? 'Choose Existing' : 'Custom Feature'}
                                    </button>
                                )}
                            </div>
                            
                            {!isCustomCollab ? (
                                <select id="collaboration" onChange={handleCollaborationChange} className="mt-1 block w-full bg-zinc-700 border-zinc-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm h-10 px-3">
                                    <option value="">None</option>
                                    {potentialCollaborators.map(name => <option key={name} value={name}>{name}</option>)}
                                </select>
                            ) : (
                                <div className="space-y-2 mt-1">
                                    <input 
                                        type="text" 
                                        placeholder="Artist Name" 
                                        value={collaboration?.artistName || ''}
                                        onChange={e => setCollaboration({ artistName: e.target.value, cost: collaboration?.cost || 0 })}
                                        className="block w-full bg-zinc-700 border-zinc-600 rounded-md shadow-sm focus:ring-red-500 sm:text-sm h-10 px-3 text-white"
                                    />
                                    <input 
                                        type="number" 
                                        placeholder="Cost ($)" 
                                        value={collaboration?.cost ?? ''}
                                        onChange={e => setCollaboration({ artistName: collaboration?.artistName || '', cost: parseInt(e.target.value) || 0 })}
                                        className="block w-full bg-zinc-700 border-zinc-600 rounded-md shadow-sm focus:ring-red-500 sm:text-sm h-10 px-3 text-white"
                                    />
                                </div>
                            )}

                            {collaboration && !isCustomCollab && (
                                <p className="text-sm text-yellow-400 mt-2">Feature Cost: ${formatNumber(collaboration.cost)}</p>
                            )}
                        </div>"""

content = content.replace(old_ui, new_ui)

with open('components/StudioView.tsx', 'w') as f:
    f.write(content)
