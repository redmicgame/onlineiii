import re

with open('components/ReleaseView.tsx', 'r') as f:
    content = f.read()

old_code = """    const handleAction = () => {
        setError('');
        if (!title.trim()) {"""

new_code = """    const [showComebackConfirm, setShowComebackConfirm] = useState(false);

    const handleAction = () => {
        if (activeArtistData.isHiatus && !showComebackConfirm) {
             setShowComebackConfirm(true);
             return;
        }

        setError('');
        if (!title.trim()) {"""

content = content.replace(old_code, new_code)

old_code_2 = """            dispatch({ type: 'RELEASE_PROJECT', payload: { release: newRelease } });
        }
        dispatch({ type: 'CHANGE_VIEW', payload: 'game' });
    };"""

new_code_2 = """            dispatch({ type: 'RELEASE_PROJECT', payload: { release: newRelease } });
        }
        
        if (activeArtistData.isHiatus) {
             const avgQuality = Array.from(selectedSongIds).reduce((sum, id) => sum + (songs.find(s => s.id === id)?.quality || 0), 0) / (selectedSongIds.size || 1);
             dispatch({ type: 'END_HIATUS_COMEBACK', payload: { isGood: avgQuality > 70 } });
        }

        dispatch({ type: 'CHANGE_VIEW', payload: 'game' });
    };"""

content = content.replace(old_code_2, new_code_2)

old_code_3 = """                </div>
            </div>
        </div>
    );"""

new_code_3 = """                </div>
            </div>
            
            {showComebackConfirm && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-sm w-full">
                        <h2 className="text-xl font-bold mb-2">Confirm Comeback</h2>
                        <p className="text-zinc-400 mb-6">You are currently on hiatus. Is this project your official comeback? You cannot release music otherwise.</p>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setShowComebackConfirm(false)}
                                className="flex-1 bg-zinc-800 hover:bg-zinc-700 font-bold p-3 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => handleAction()}
                                className="flex-1 bg-green-600 hover:bg-green-500 font-bold p-3 rounded-lg"
                            >
                                Yes, It's My Comeback
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );"""

content = content.replace(old_code_3, new_code_3)

with open('components/ReleaseView.tsx', 'w') as f:
    f.write(content)
