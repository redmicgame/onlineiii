const fs = require('fs');

// Patch GameContext.tsx
let ctx = fs.readFileSync('context/GameContext.tsx', 'utf-8');
const updateSongCover = `
    case 'UPDATE_SONG_COVER_ART': {
        const { songId, newCoverArt } = action.payload;
        if (!state.activeArtistId) return state;
        const activeData = state.artistsData[state.activeArtistId];
        const updatedSongs = activeData.songs.map(s => s.id === songId ? { ...s, coverArt: newCoverArt } : s);
        return {
            ...state,
            artistsData: {
                ...state.artistsData,
                [state.activeArtistId]: {
                    ...activeData,
                    songs: updatedSongs
                }
            }
        };
    }
`;
if (!ctx.includes('UPDATE_SONG_COVER_ART')) {
    ctx = ctx.replace("case 'UPDATE_RELEASE_COVER_ART':", updateSongCover + "\n    case 'UPDATE_RELEASE_COVER_ART':");
    fs.writeFileSync('context/GameContext.tsx', ctx);
}

// Patch CatalogView.tsx
let cat = fs.readFileSync('components/CatalogView.tsx', 'utf-8');

cat = cat.replace("interface TrackItemProps {", "interface TrackItemProps {\n    onCoverChange: (songId: string, e: React.ChangeEvent<HTMLInputElement>) => void;");

// Update TrackItem signature
cat = cat.replace(
    "const TrackItem: React.FC<TrackItemProps> = ({ song, chartInfo, isExpanded, onToggleExpand, grammyWin, canTakeDown, onTakeDown, onBuyBack, isStreamingActive }) => {",
    "const TrackItem: React.FC<TrackItemProps> = ({ song, chartInfo, isExpanded, onToggleExpand, grammyWin, canTakeDown, onTakeDown, onBuyBack, isStreamingActive, onCoverChange }) => {"
);

// Update TrackItem render
const oldTrackItemImg = `<img src={song.coverArt} alt={song.title} className="w-10 h-10 rounded-sm object-cover" />`;
const newTrackItemImg = `<label htmlFor={\`song-cover-upload-\${song.id}\`} className="cursor-pointer group relative flex-shrink-0">
                    <img src={song.coverArt} alt={song.title} className="w-10 h-10 rounded-sm object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-sm">
                        <span className="text-white text-[8px] font-bold">Edit</span>
                    </div>
                    <input
                        type="file"
                        id={\`song-cover-upload-\${song.id}\`}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => onCoverChange(song.id, e)}
                    />
                </label>`;
if (cat.includes(oldTrackItemImg)) {
    cat = cat.replace(oldTrackItemImg, newTrackItemImg);
}

// Update CatalogView component
const handleSongCoverChangeCode = `
    const handleSongCoverArtChange = (songId: string, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const newCoverArt = reader.result as string;
                dispatch({ type: 'UPDATE_SONG_COVER_ART', payload: { songId, newCoverArt } });
            };
            reader.readAsDataURL(file);
        }
    };
`;
if (!cat.includes('handleSongCoverArtChange')) {
    cat = cat.replace("const handleCoverArtChange =", handleSongCoverChangeCode + "\n    const handleCoverArtChange =");
}

// Update instances of <TrackItem
cat = cat.replace(/<TrackItem\s+key={song.id}/g, `<TrackItem\n                                                                onCoverChange={handleSongCoverArtChange}\n                                                                key={song.id}`);

fs.writeFileSync('components/CatalogView.tsx', cat);
console.log('patched track covers');
