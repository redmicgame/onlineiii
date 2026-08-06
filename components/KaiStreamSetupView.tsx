import React, { useState, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import ImageIcon from './icons/ImageIcon';

const KaiStreamSetupView: React.FC = () => {
    const { gameState, dispatch, activeArtistData } = useGame();
    
    const [location, setLocation] = useState<string>('Disneyworld');
    const [songId, setSongId] = useState<string>('');
    const [promoBanner, setPromoBanner] = useState<string>('');
    const [ytThumbnail, setYtThumbnail] = useState<string>('');

    if (!activeArtistData) return null;

    const emailId = activeArtistData.inbox.find(e => e.offer?.type === 'kaiStreamSetup' && !e.offer.isSubmitted)?.id;

    const releasedSongs = useMemo(() => {
        return activeArtistData.songs.filter(s => s.isReleased && !s.isTakenDown);
    }, [activeArtistData.songs]);

    const handleSubmit = () => {
        if (!songId || !promoBanner || !ytThumbnail || !emailId) return;
        dispatch({
            type: 'SUBMIT_KAI_STREAM_DETAILS',
            payload: { emailId, location, songId, promoBanner, ytThumbnail }
        });
    };

    const handleImageUpload = (setter: React.Dispatch<React.SetStateAction<string>>) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e: any) => {
            const file = e.target.files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setter(e.target?.result as string);
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    };

    return (
        <div className="h-full w-full bg-zinc-900 text-white flex flex-col">
            <header className="p-4 flex items-center gap-4 bg-zinc-800 border-b border-zinc-700">
                <button onClick={() => dispatch({type: 'CHANGE_VIEW', payload: 'inbox'})} className="p-2 rounded-full hover:bg-white/10">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold text-[#9146FF]">Kai Cenat Stream Setup</h1>
            </header>
            
            <main className="flex-grow overflow-y-auto p-4 space-y-6">
                <div className="bg-[#9146FF]/10 border border-[#9146FF]/30 p-4 rounded-xl text-purple-100">
                    <p className="font-bold text-[#9146FF] mb-1">Twitch Stream Details</p>
                    <p className="text-sm">Kai Cenat will announce the stream next week and go live the week after. It provides a 30% stream boost to the selected song for 2 weeks.</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-zinc-400 mb-2">Location</label>
                        <select 
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white outline-none focus:border-[#9146FF]"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        >
                            <option value="Disneyworld">Disneyworld (US location)</option>
                            <option value="Normal Stream">Normal stream (at his house, US location)</option>
                            <option value="LA Pop Up">LA pop up stream (US location)</option>
                            <option value="Petting Zoo">Petting Zoo Stream (At Asia)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-zinc-400 mb-2">Promote Song</label>
                        <select 
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white outline-none focus:border-[#9146FF]"
                            value={songId}
                            onChange={(e) => setSongId(e.target.value)}
                        >
                            <option value="">Select a song...</option>
                            {releasedSongs.map(s => (
                                <option key={s.id} value={s.id}>{s.title}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-zinc-400 mb-2">Promo Banner (X Post)</label>
                            <button 
                                onClick={() => handleImageUpload(setPromoBanner)}
                                className="w-full h-40 bg-zinc-800 border-2 border-dashed border-zinc-600 rounded-xl flex flex-col items-center justify-center hover:border-[#9146FF] hover:bg-zinc-800/80 transition-colors relative overflow-hidden"
                            >
                                {promoBanner ? (
                                    <img src={promoBanner} className="w-full h-full object-cover" alt="Banner" />
                                ) : (
                                    <>
                                        <ImageIcon className="w-8 h-8 text-zinc-500 mb-2" />
                                        <span className="text-zinc-500 text-sm">Upload Image</span>
                                    </>
                                )}
                            </button>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-bold text-zinc-400 mb-2">YouTube Thumbnail</label>
                            <button 
                                onClick={() => handleImageUpload(setYtThumbnail)}
                                className="w-full h-40 bg-zinc-800 border-2 border-dashed border-zinc-600 rounded-xl flex flex-col items-center justify-center hover:border-[#9146FF] hover:bg-zinc-800/80 transition-colors relative overflow-hidden"
                            >
                                {ytThumbnail ? (
                                    <img src={ytThumbnail} className="w-full h-full object-cover" alt="Thumbnail" />
                                ) : (
                                    <>
                                        <ImageIcon className="w-8 h-8 text-zinc-500 mb-2" />
                                        <span className="text-zinc-500 text-sm">Upload Image</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-4 pb-12 flex justify-center">
                    <button 
                        onClick={handleSubmit}
                        disabled={!songId || !promoBanner || !ytThumbnail}
                        className="bg-[#9146FF] disabled:bg-zinc-700 disabled:text-zinc-500 text-white px-12 py-3 rounded-full font-bold shadow-lg shadow-[#9146FF]/20 hover:scale-105 active:scale-95 transition-all"
                    >
                        Confirm Details & Accept
                    </button>
                </div>
            </main>
        </div>
    );
};
export default KaiStreamSetupView;
