import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { CustomAwardShowCategory } from '../types';

export const CustomAwardShowBuilder: React.FC = () => {
    const { gameState: state, dispatch } = useGame();
    
    const existing = state.customAwardShow;

    const [name, setName] = useState(existing?.name || '');
    const [submissionWeek, setSubmissionWeek] = useState(existing?.submissionWeek || 5);
    const [nominationWeek, setNominationWeek] = useState(existing?.nominationWeek || 8);
    const [ceremonyWeek, setCeremonyWeek] = useState(existing?.ceremonyWeek || 10);
    const [categories, setCategories] = useState<any[]>(existing?.categories || []);

    const handleSave = () => {
        if (!name.trim()) return alert("Needs a name");
        if (categories.length === 0) return alert("Add at least one category");

        dispatch({
            type: 'CREATE_CUSTOM_AWARD_SHOW',
            payload: {
                customAwardShow: {
                    name,
                    submissionWeek,
                    nominationWeek,
                    ceremonyWeek,
                    categories
                }
            }
        });
        alert("Custom award show configured! Submissions will happen on week " + submissionWeek);
    };

    const addCategory = () => {
        setCategories([...categories, { id: Math.random().toString(), name: 'New Category', eligibility: 'song', genreFilter: '' }]);
    };

    const updateCategory = (id: string, field: string, value: string) => {
        setCategories(categories.map(c => c.id === id ? { ...c, [field]: value } : c));
    };

    const removeCategory = (id: string) => {
        setCategories(categories.filter(c => c.id !== id));
    };

    const setWinner = (categoryId: string, nomineeItemId: string) => {
        if (!state.customAwardNominations) return;
        const updated = state.customAwardNominations.map(cat => {
            if (cat.categoryId === categoryId) {
                return {
                    ...cat,
                    nominees: cat.nominees.map(n => ({
                        ...n,
                        isWinner: n.itemId === nomineeItemId
                    }))
                };
            }
            return cat;
        });
        dispatch({ type: 'JUDGE_CUSTOM_AWARDS', payload: { nominations: updated } });
    };

    return (
        <div className="bg-zinc-800 p-4 rounded-lg space-y-4">
            <h2 className="text-lg font-bold text-red-400">Custom Award Show Builder</h2>
            <p className="text-sm text-zinc-400">Create your own award show, define the categories, and choose the winners when the time comes.</p>
            
            <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400">Award Show Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-zinc-700 p-2 rounded" placeholder="e.g. The Global Music Awards" />
            </div>

            <div className="grid grid-cols-3 gap-2">
                <div>
                    <label className="text-xs font-semibold text-zinc-400">Submission Wk</label>
                    <input type="number" min="1" max="52" value={submissionWeek || ''} onChange={e => setSubmissionWeek(parseInt(e.target.value) || 0)} className="w-full bg-zinc-700 p-2 rounded" />
                </div>
                <div>
                    <label className="text-xs font-semibold text-zinc-400">Nomination Wk</label>
                    <input type="number" min="1" max="52" value={nominationWeek || ''} onChange={e => setNominationWeek(parseInt(e.target.value) || 0)} className="w-full bg-zinc-700 p-2 rounded" />
                </div>
                <div>
                    <label className="text-xs font-semibold text-zinc-400">Ceremony Wk</label>
                    <input type="number" min="1" max="52" value={ceremonyWeek || ''} onChange={e => setCeremonyWeek(parseInt(e.target.value) || 0)} className="w-full bg-zinc-700 p-2 rounded" />
                </div>
            </div>

            <div className="space-y-2 pt-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Categories</h3>
                    <button onClick={addCategory} className="bg-zinc-700 px-3 py-1 rounded text-sm hover:bg-zinc-600">+ Add</button>
                </div>
                {categories.map((cat, i) => (
                    <div key={cat.id} className="bg-zinc-900/50 p-3 rounded border border-zinc-700 space-y-2 relative group">
                        <button onClick={() => removeCategory(cat.id)} className="absolute top-2 right-2 text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            ✕
                        </button>
                        <input type="text" value={cat.name} onChange={e => updateCategory(cat.id, 'name', e.target.value)} className="w-full bg-zinc-700 p-2 rounded" placeholder="Category Name" />
                        <div className="flex gap-2">
                            <select value={cat.eligibility} onChange={e => updateCategory(cat.id, 'eligibility', e.target.value)} className="flex-1 bg-zinc-700 p-2 rounded text-sm">
                                <option value="song">Song / Single</option>
                                <option value="album">Album / EP</option>
                                <option value="artist">Artist</option>
                            </select>
                            <input type="text" value={cat.genreFilter || ''} onChange={e => updateCategory(cat.id, 'genreFilter', e.target.value)} className="flex-1 bg-zinc-700 p-2 rounded text-sm" placeholder="Genre Filter (Optional)" />
                        </div>
                    </div>
                ))}
            </div>

            <button onClick={handleSave} className="w-full bg-red-600 hover:bg-red-500 font-bold py-2 rounded mt-4">
                {existing ? 'Update Award Show' : 'Create Award Show'}
            </button>
            
            {existing && (
                <div className="mt-2 text-xs text-zinc-500 text-center">
                    (Your award show is currently active and running in the background)
                </div>
            )}

            {state.customAwardNominations && (
                <div className="mt-6 space-y-4">
                    <h3 className="font-bold text-red-400">Pick Winners (Week {existing?.ceremonyWeek})</h3>
                    {state.customAwardNominations.map(catNom => {
                        const cat = existing?.categories.find(c => c.id === catNom.categoryId);
                        if (!cat) return null;
                        return (
                            <div key={catNom.categoryId} className="bg-zinc-900/50 p-3 rounded border border-zinc-700">
                                <h4 className="font-semibold mb-2">{cat.name}</h4>
                                <div className="space-y-1">
                                    {catNom.nominees.map(nom => (
                                        <div key={nom.itemId} className="flex items-center justify-between text-sm">
                                            <span>{nom.itemName} - {nom.artistName}</span>
                                            <button 
                                                onClick={() => setWinner(catNom.categoryId, nom.itemId)}
                                                className={`px-3 py-1 rounded text-xs font-bold ${nom.isWinner ? 'bg-yellow-500 text-black' : 'bg-zinc-700 hover:bg-zinc-600'}`}
                                            >
                                                {nom.isWinner ? 'WINNER' : 'Pick'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
