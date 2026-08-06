import re

with open('components/MiscTab.tsx', 'r') as f:
    content = f.read()

old_encounters = """                <div className="bg-zinc-800 p-4 rounded-lg flex items-center justify-between mb-4">
                    <div>
                        <h3 className="font-bold text-lg">Disable Random Encounters</h3>
                        <p className="text-sm text-zinc-400">Turn off random events and interruptions.</p>
                    </div>
                    <button 
                        onClick={toggleEncounters}
                        className={`w-14 h-8 rounded-full p-1 transition-colors ${!gameState.disableEncounters ? 'bg-red-500' : 'bg-zinc-600'}`}
                    >
                        <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${!gameState.disableEncounters ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </button>
                </div>"""

new_encounters = """                <div className="bg-zinc-800 p-4 rounded-lg flex items-center justify-between mb-4">
                    <div>
                        <h3 className="font-bold text-lg">Disable Random Encounters</h3>
                        <p className="text-sm text-zinc-400">Turn off random events and interruptions.</p>
                    </div>
                    <button 
                        onClick={toggleEncounters}
                        className={`w-14 h-8 rounded-full p-1 transition-colors ${!gameState.disableEncounters ? 'bg-red-500' : 'bg-zinc-600'}`}
                    >
                        <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${!gameState.disableEncounters ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </button>
                </div>

                <div className="bg-zinc-800 p-4 rounded-lg flex items-center justify-between mb-4">
                    <div>
                        <h3 className="font-bold text-lg">Disable Loading Screens</h3>
                        <p className="text-sm text-zinc-400">Skip loading animations when saving or advancing weeks.</p>
                        <p className="text-xs text-red-400 font-bold mt-1">WARNING: Only recommended for high-end devices.</p>
                    </div>
                    <button 
                        onClick={() => dispatch({ type: 'UPDATE_GAME_STATE', payload: { disableLoadingScreens: !gameState.disableLoadingScreens } })}
                        className={`w-14 h-8 rounded-full p-1 transition-colors ${gameState.disableLoadingScreens ? 'bg-red-500' : 'bg-zinc-600'}`}
                    >
                        <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${gameState.disableLoadingScreens ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </button>
                </div>"""

content = content.replace(old_encounters, new_encounters)

with open('components/MiscTab.tsx', 'w') as f:
    f.write(content)
