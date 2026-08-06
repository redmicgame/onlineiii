import re

with open('components/RedMicProDashboardView.tsx', 'r') as f:
    content = f.read()

old_editor = """const QualityEditor: React.FC<{ song: Song }> = ({ song }) => {
    const { dispatch } = useGame();
    const [quality, setQuality] = useState(song.quality);
    const [trait, setTrait] = useState<string>(song.trait || 'Normal');

    const handleUpdate = () => {
        dispatch({ type: 'UPDATE_SONG_QUALITY', payload: { songId: song.id, newQuality: quality } });
        dispatch({ type: 'UPDATE_SONG_TRAIT', payload: { songId: song.id, newTrait: trait } });
    };

    return (
        <div className="flex items-center gap-3">
            <div className="flex-grow">
                <p className="font-semibold">{song.title}</p>
            </div>
            <select
                value={trait}
                onChange={e => {
                    setTrait(e.target.value);
                    dispatch({ type: 'UPDATE_SONG_TRAIT', payload: { songId: song.id, newTrait: e.target.value } });
                }}
                className="w-32 bg-zinc-700 p-1 rounded-md text-xs"
            >
                <option value="Normal">Normal</option>
                <option value="Smash Hit">Smash Hit</option>
                <option value="TikTok Hit">TikTok Hit</option>
                <option value="Slow Burner">Slow Burner</option>
                <option value="Radio Hit">Radio Hit</option>
                <option value="Flop">Flop</option>
            </select>
            <input 
                type="number" 
                value={quality || ''} 
                onChange={e => setQuality(parseInt(e.target.value) || 0)}
                onBlur={handleUpdate}
                min="0" max="100"
                className="w-16 bg-zinc-700 p-1 rounded-md text-center"
            />
        </div>
    );
};"""

new_editor = """const QualityEditor: React.FC<{ song: Song }> = ({ song }) => {
    const { dispatch } = useGame();
    const [quality, setQuality] = useState(song.quality);
    const [trait, setTrait] = useState<string>(song.trait || 'Normal');

    React.useEffect(() => {
        setQuality(song.quality);
        setTrait(song.trait || 'Normal');
    }, [song.quality, song.trait]);

    const handleUpdate = () => {
        dispatch({ type: 'UPDATE_SONG_QUALITY', payload: { songId: song.id, newQuality: quality } });
        dispatch({ type: 'UPDATE_SONG_TRAIT', payload: { songId: song.id, newTrait: trait } });
    };

    return (
        <div className="flex items-center gap-3">
            <div className="flex-grow">
                <p className="font-semibold">{song.title}</p>
            </div>
            <select
                value={trait}
                onChange={e => {
                    setTrait(e.target.value);
                }}
                className="w-32 bg-zinc-700 p-1 rounded-md text-xs"
            >
                <option value="Normal">Normal</option>
                <option value="Smash Hit">Smash Hit</option>
                <option value="TikTok Hit">TikTok Hit</option>
                <option value="Slow Burner">Slow Burner</option>
                <option value="Radio Hit">Radio Hit</option>
                <option value="Flop">Flop</option>
            </select>
            <input 
                type="number" 
                value={quality || ''} 
                onChange={e => setQuality(parseInt(e.target.value) || 0)}
                min="0" max="100"
                className="w-16 bg-zinc-700 p-1 rounded-md text-center"
            />
            <button 
                onClick={handleUpdate} 
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-1 px-3 rounded text-xs"
            >
                Confirm
            </button>
        </div>
    );
};"""

content = content.replace(old_editor, new_editor)

with open('components/RedMicProDashboardView.tsx', 'w') as f:
    f.write(content)
