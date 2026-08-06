const fs = require('fs');

let content = fs.readFileSync('components/TourDetailView.tsx', 'utf8');

// We need to add state for editing setlist
const stateImports = `import React, { useState } from 'react';`;
content = content.replace(/import React from 'react';/, stateImports);

// Inside TourDetailView:
// const [isEditingSetlist, setIsEditingSetlist] = useState(false);
// const [tempSetlist, setTempSetlist] = useState<string[]>([]);
const stateDecl = `    const { dispatch, activeArtistData, activeTourId } = useGame();
    const [isEditingSetlist, setIsEditingSetlist] = useState(false);
    const [tempSetlist, setTempSetlist] = useState<string[]>([]);`;
content = content.replace(/    const \{ dispatch, activeArtistData, activeTourId \} = useGame\(\);/, stateDecl);

// Handler for saving
const saveHandler = `    const handleSaveSetlist = () => {
        const added = tempSetlist.filter(id => !tour.setlist.includes(id));
        const removed = tour.setlist.filter(id => !tempSetlist.includes(id));
        if (added.length > 0 || removed.length > 0) {
            dispatch({
                type: 'EDIT_TOUR_SETLIST',
                payload: {
                    tourId: tour.id,
                    newSetlist: tempSetlist,
                    addedSongs: added,
                    removedSongs: removed
                }
            });
        }
        setIsEditingSetlist(false);
    };

    const toggleSong = (songId: string) => {
        if (tempSetlist.includes(songId)) {
            setTempSetlist(tempSetlist.filter(id => id !== songId));
        } else {
            setTempSetlist([...tempSetlist, songId]);
        }
    };
    
    const handleStartEditSetlist = () => {
        setTempSetlist(tour.setlist);
        setIsEditingSetlist(true);
    };`;

content = content.replace(/    const handleStartTour = \(\) => \{/, saveHandler + '\n\n    const handleStartTour = () => {');

// The UI
const uiReplace = `                 <div className="space-y-3 pt-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Setlist Details</h2>
                        {tour.status === 'active' && (
                            <button onClick={handleStartEditSetlist} className="px-3 py-1 bg-zinc-800 rounded-md text-sm hover:bg-zinc-700">
                                Edit
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                    {setlistSongs.map(song => song && (
                        <div key={song.id} className="bg-zinc-800 p-2 rounded-md flex items-center gap-2">
                             <img src={song.coverArt} className="w-8 h-8 rounded-sm object-cover"/>
                             <p className="text-sm font-semibold truncate">{song.title}</p>
                        </div>
                    ))}
                    </div>
                </div>`;

content = content.replace(/                 <div className="space-y-3 pt-4">\s*<h2 className="text-xl font-bold">Setlist Details<\/h2>\s*<div className="grid grid-cols-2 gap-2">\s*\{setlistSongs\.map\(song => song && \(\s*<div key=\{song\.id\} className="bg-zinc-800 p-2 rounded-md flex items-center gap-2">\s*<img src=\{song\.coverArt\} className="w-8 h-8 rounded-sm object-cover"\/>\s*<p className="text-sm font-semibold truncate">\{song\.title\}<\/p>\s*<\/div>\s*\)\)\}\s*<\/div>\s*<\/div>/g, uiReplace);

// The Modal
const modalHtml = `
            {isEditingSetlist && (
                <div className="fixed inset-0 bg-black/80 z-50 flex flex-col p-4 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-white">Edit Setlist</h2>
                        <button onClick={() => setIsEditingSetlist(false)} className="p-2 text-zinc-400 hover:text-white">
                            ✕
                        </button>
                    </div>
                    
                    <div className="flex-grow overflow-y-auto space-y-2 mb-4 pr-2">
                        {songs.map(song => {
                            if (!song.isReleased) return null;
                            const isSelected = tempSetlist.includes(song.id);
                            return (
                                <button
                                    key={song.id}
                                    onClick={() => toggleSong(song.id)}
                                    className={\`w-full flex items-center p-3 rounded-lg border transition-colors \${isSelected ? 'bg-indigo-600/20 border-indigo-500' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'}\`}
                                >
                                    <img src={song.coverArt} alt="" className="w-12 h-12 rounded object-cover mr-4" />
                                    <div className="text-left flex-grow">
                                        <div className="font-bold text-white">{song.title}</div>
                                        <div className="text-sm text-zinc-400">
                                            {(song.streams / 1000000).toFixed(1)}M streams
                                        </div>
                                    </div>
                                    <div className={\`w-6 h-6 rounded-full border-2 flex items-center justify-center \${isSelected ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-zinc-600'}\`}>
                                        {isSelected && "✓"}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <div className="bg-zinc-900 p-4 rounded-xl space-y-4">
                        <div className="flex justify-between text-zinc-400">
                            <span>Selected Songs</span>
                            <span className="font-bold text-white">{tempSetlist.length}</span>
                        </div>
                        <button
                            onClick={handleSaveSetlist}
                            disabled={tempSetlist.length < 5}
                            className="w-full py-3 bg-white text-black font-bold rounded-lg disabled:opacity-50"
                        >
                            Save Setlist
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
`;

content = content.replace(/        <\/div>\s*\);\s*\};\s*export default TourDetailView;/g, modalHtml + '\nexport default TourDetailView;');

fs.writeFileSync('components/TourDetailView.tsx', content);

