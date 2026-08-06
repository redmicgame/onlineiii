import re

with open('components/RedMicProDashboardView.tsx', 'r') as f:
    content = f.read()

new_component = """const CustomFeatureBuilder: React.FC = () => {
    const { gameState, dispatch } = useGame();
    const [name, setName] = useState('');
    const [cost, setCost] = useState('');

    const handleAdd = () => {
        if (!name.trim()) return;
        dispatch({ type: 'ADD_CUSTOM_FEATURE', payload: { name: name.trim(), cost: parseInt(cost) || 0 } });
        setName('');
        setCost('');
    };

    const handleRemove = (featureName: string) => {
        dispatch({ type: 'REMOVE_CUSTOM_FEATURE', payload: { name: featureName } });
    };

    return (
        <div className="bg-zinc-800 p-4 rounded-lg space-y-3">
            <h2 className="text-lg font-bold">Custom Feature Artists</h2>
            <p className="text-sm text-zinc-400">Add custom artists to appear in your Studio collaboration list. You can set them as free ($0) or priced.</p>
            
            <div className="flex gap-2">
                <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    placeholder="Artist Name"
                    className="flex-grow bg-zinc-700 p-2 rounded-md text-white"
                />
                <input 
                    type="number" 
                    value={cost} 
                    onChange={e => setCost(e.target.value)} 
                    placeholder="Cost ($)"
                    className="w-24 bg-zinc-700 p-2 rounded-md text-white"
                />
                <button 
                    onClick={handleAdd} 
                    className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-md"
                >
                    Add
                </button>
            </div>

            {gameState.customFeatures && gameState.customFeatures.length > 0 && (
                <div className="mt-4 space-y-2">
                    {gameState.customFeatures.map(f => (
                        <div key={f.name} className="flex items-center justify-between bg-zinc-700/50 p-2 rounded-md">
                            <div>
                                <p className="font-bold">{f.name}</p>
                                <p className="text-xs text-green-400">${(f.cost || 0).toLocaleString()}</p>
                            </div>
                            <button 
                                onClick={() => handleRemove(f.name)}
                                className="text-red-400 hover:text-red-300 text-sm font-bold"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const CustomAwardShowBuilder: React.FC = () => {"""

content = content.replace("const CustomAwardShowBuilder: React.FC = () => {", new_component)

content = content.replace("<CustomAwardShowBuilder />", "<CustomFeatureBuilder />\n\n                <CustomAwardShowBuilder />")

with open('components/RedMicProDashboardView.tsx', 'w') as f:
    f.write(content)
