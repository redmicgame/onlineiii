import React, { useState } from 'react';
import { useGame } from '../context/GameContext';

const CreateFifaWorldCupView: React.FC = () => {
    const { gameState, dispatch } = useGame();
    const [title, setTitle] = useState('');
    const [coverArt, setCoverArt] = useState<string | null>(null);
    const [error, setError] = useState('');

    const offer = gameState.activeFifaOffer;
    if (!offer) return null;

    const handleCoverArtUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverArt(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!coverArt) {
            setError('Soundtrack cover art is required.'); return;
        }
        dispatch({ type: 'CREATE_FIFA_CONTRIBUTION', payload: { title, coverArt } });
    };

    const handleCancel = () => {
        dispatch({ type: 'CANCEL_FIFA_OFFER' });
    };

    return (
        <div className="h-full w-full bg-[#121212] text-white flex flex-col">
            <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 pb-24">
            <h1 className="text-3xl font-bold mb-6 text-white text-center">FIFA World Cup Soundtrack</h1>
            
            <div className="bg-[#18181b] border border-zinc-800 rounded-xl p-6 max-w-2xl mx-auto shadow-2xl">
                <p className="text-zinc-400 mb-6 text-center">
                    You have been invited to create a World Cup anthem featuring 
                    <span className="text-white font-bold ml-1">{offer.collabs.join(" & ")}</span>.
                    The single will drop on week 23, ahead of the full soundtrack release on week 25.
                </p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && <div className="p-3 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm">{error}</div>}

                    <div>
                        <label className="block text-sm font-semibold text-zinc-300 mb-2">Song Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            placeholder="e.g. Game Time"
                            className="w-full bg-[#27272a] border border-zinc-700 rounded-lg p-3 text-white focus:outline-none focus:border-green-500 transition-colors"
                        />
                    </div>
                    
                    <div className="flex flex-col items-center gap-2">
                        <label className="block text-sm font-semibold text-zinc-300 mb-2 self-start">Cover Art</label>
                        <label htmlFor="cover-art" className="cursor-pointer group relative">
                            <div className={`w-48 h-48 rounded-lg shadow-xl border-2 border-dashed flex items-center justify-center transition-all ${coverArt ? 'border-transparent' : 'border-zinc-700 group-hover:border-green-500'}`}>
                                {coverArt ? (
                                    <img src={coverArt} alt="Cover Art" className="w-full h-full rounded-lg object-cover" />
                                ) : (
                                    <span className="text-zinc-400 text-sm text-center">Upload Cover Art</span>
                                )}
                            </div>
                        </label>
                        <input id="cover-art" type="file" accept="image/*" className="hidden" onChange={handleCoverArtUpload} />
                        <p className="text-xs text-zinc-500 mt-2 self-start">Upload a custom cover art for this single release.</p>
                    </div>

                    <div className="flex justify-end gap-3 mt-8">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-6 py-2 rounded-full font-bold text-sm bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!title}
                            className="px-6 py-2 rounded-full font-bold text-sm bg-green-500 hover:bg-green-400 text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Confirm Release
                        </button>
                    </div>
                </form>
            </div>
            </div>
        </div>
    );
};

export default CreateFifaWorldCupView;
