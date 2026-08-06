import React, { useState } from 'react';
import { useGame, formatNumber } from '../context/GameContext';

const CancelIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const TOPIC_OPTIONS = [
    "New Music Teasers",
    "Touring & Live Shows",
    "Navigating Fame",
    "Personal Life & Dating",
    "Fan Interactions",
    "Childhood & Early Influences",
    "Creative Process & Songwriting",
    "Dealing with Haters"
];

const PromoInterviewView: React.FC = () => {
    const { gameState, dispatch, activeArtistData } = useGame();
    const offer = gameState.activePromoInterviewOffer;
    const [selectedSongId, setSelectedSongId] = useState<string>('');
    const [thumbnail, setThumbnail] = useState<string>('');
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    
    if (!offer || !activeArtistData) return null;

    const songs = activeArtistData.songs.filter(s => s.isReleased);

    const handleTopicToggle = (topic: string) => {
        if (selectedTopics.includes(topic)) {
            setSelectedTopics(selectedTopics.filter(t => t !== topic));
        } else {
            if (selectedTopics.length < 3) {
                setSelectedTopics([...selectedTopics, topic]);
            }
        }
    };

    const handleSubmit = () => {
        if (!selectedSongId || !thumbnail || selectedTopics.length === 0) return;
        dispatch({
            type: 'SUBMIT_PROMO_INTERVIEW',
            payload: {
                songId: selectedSongId,
                thumbnail: thumbnail,
                topics: selectedTopics
            }
        });
    };

    return (
        <div className="h-full w-full bg-zinc-900 overflow-y-auto text-white">
            <header className="p-4 flex flex-col gap-2 sticky top-0 bg-zinc-900 z-10 border-b border-zinc-700">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-bold flex items-center gap-2">
                        Promo: {offer.source}
                    </h1>
                    <button 
                        onClick={() => dispatch({type: 'DECLINE_PROMO_INTERVIEW', payload: { emailId: offer.emailId }})}
                        className="bg-red-500/20 text-red-500 px-3 py-1 rounded text-sm font-bold flex items-center gap-1"
                    >
                        <CancelIcon className="w-4 h-4"/> Decline
                    </button>
                </div>
            </header>
            
            <main className="p-4 space-y-6 max-w-lg mx-auto">
                <p className="text-zinc-400 text-sm">
                    You have secured an interview slot on <strong>{offer.source}</strong>! Configure your appearance below.
                </p>

                <div className="space-y-4 bg-zinc-800 p-4 rounded-lg border border-zinc-700">
                    <div>
                        <label className="block text-sm font-bold mb-2">Thumbnail (Upload)</label>
                        <input 
                            type="file" 
                            accept="image/*"
                            className="w-full bg-zinc-900 border border-zinc-600 rounded p-2 text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700" 
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                        setThumbnail(reader.result as string);
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }}
                        />
                        {thumbnail && (
                            <img src={thumbnail} className="mt-2 w-full h-auto rounded border border-zinc-700 max-h-48 object-cover" />
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-2">Song to Promote</label>
                        <p className="text-xs text-zinc-400 mb-2">This song will receive a 10% streaming boost for 4 weeks.</p>
                        <select 
                            className="w-full bg-zinc-900 border border-zinc-600 rounded p-2 text-white"
                            value={selectedSongId}
                            onChange={e => setSelectedSongId(e.target.value)}
                        >
                            <option value="">Select a Released Song</option>
                            {songs.map(song => (
                                <option key={song.id} value={song.id}>{song.title}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-2">Talking Points (Select up to 3)</label>
                        <div className="flex flex-wrap gap-2">
                            {TOPIC_OPTIONS.map(topic => (
                                <button
                                    key={topic}
                                    onClick={() => handleTopicToggle(topic)}
                                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        selectedTopics.includes(topic) 
                                            ? 'bg-blue-600 text-white' 
                                            : 'bg-zinc-700 text-zinc-300'
                                    }`}
                                >
                                    {topic}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <button 
                    onClick={handleSubmit} 
                    disabled={!thumbnail || !selectedSongId || selectedTopics.length === 0}
                    className="w-full bg-blue-600 text-white p-3 rounded font-bold uppercase tracking-wider disabled:opacity-50"
                >
                    Submit Appearance
                </button>
            </main>
        </div>
    );
};

export default PromoInterviewView;
