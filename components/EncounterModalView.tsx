import React, { useState } from 'react';
import { useGame, formatNumber } from '../context/GameContext';

const EncounterModalView: React.FC = () => {
    const { gameState, dispatch } = useGame();
    const [imageUrl, setImageUrl] = useState('');

    const encounter = gameState.activeEncounter;
    if (!encounter) return null;

    const handleChoice = (choice: any) => {
        dispatch({ type: 'RESOLVE_ENCOUNTER', payload: { choice, imageUrl } });
        setImageUrl('');
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[1000] animate-in fade-in duration-300">
            <div className="bg-white text-black p-6 rounded-2xl w-full max-w-md shadow-2xl space-y-6">
                <div>
                    <h2 className="text-2xl font-black mb-2 tracking-tight">Public Encounter</h2>
                    <p className="text-zinc-600 font-medium leading-relaxed">{encounter.text}</p>
                </div>

                {encounter.requiresImage && (
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-zinc-700">Upload Image of Encounter (Required)</label>
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                        setImageUrl(reader.result as string);
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }}
                            className="w-full bg-zinc-100 border border-zinc-300 p-2 rounded-lg text-sm"
                        />
                         {imageUrl && (
                            <img src={imageUrl} alt="Encounter preview" className="w-full h-32 object-cover rounded-lg mt-2" />
                        )}
                    </div>
                )}

                <div className="space-y-3">
                    <p className="text-sm font-bold border-b pb-1 text-zinc-500 uppercase tracking-wider">How do you respond?</p>
                    {encounter.choices.map((choice, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleChoice(choice)}
                            disabled={encounter.requiresImage && !imageUrl}
                            className="w-full p-4 bg-zinc-100 hover:bg-black hover:text-white rounded-xl font-bold transition-all text-left flex justify-between items-center group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span>{choice.label}</span>
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-white text-black px-2 py-1 rounded-md shadow flex space-x-2">
                                <span className={choice.publicImageEffect >= 0 ? 'text-green-600' : 'text-red-500'}>
                                    IMG {choice.publicImageEffect > 0 ? '+' : ''}{choice.publicImageEffect}
                                </span>
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EncounterModalView;
