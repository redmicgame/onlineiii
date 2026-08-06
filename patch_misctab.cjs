const fs = require('fs');
let content = fs.readFileSync('components/MiscTab.tsx', 'utf-8');

const oldCode = `                <div className="bg-zinc-800 p-4 rounded-lg">
                    <h3 className="font-bold text-lg mb-2">Options</h3>
                    <div className="flex items-center justify-between mb-4 border-b border-zinc-700 pb-4">`;

const newCode = `                <div className="bg-zinc-800 p-4 rounded-lg">
                    <h3 className="font-bold text-lg mb-2">Options</h3>
                    
                    <div className="flex items-center justify-between mb-4 border-b border-zinc-700 pb-4">
                        <div className="flex-grow pr-4">
                            <p className="font-bold">Spotify Snapshot Style</p>
                            <p className="text-xs text-zinc-400">Choose the visual style for your Spotify snapshot images.</p>
                        </div>
                        <select 
                            value={gameState.spotifySnapshotStyle || 'normal'}
                            onChange={(e) => {
                                dispatch({ type: 'TOGGLE_SPOTIFY_SNAPSHOT_STYLE', payload: e.target.value });
                            }}
                            className="bg-zinc-700 border-zinc-600 rounded-md shadow-sm h-10 px-3 text-sm min-w-[120px]"
                        >
                            <option value="normal">Normal Snapshot</option>
                            <option value="ugly">Ugly Snapshot</option>
                        </select>
                    </div>

                    <div className="flex items-center justify-between mb-4 border-b border-zinc-700 pb-4">`;

if (content.includes(oldCode)) {
  content = content.replace(oldCode, newCode);
  fs.writeFileSync('components/MiscTab.tsx', content);
  console.log('patched MiscTab');
} else {
  console.log('could not find target code in MiscTab');
}
