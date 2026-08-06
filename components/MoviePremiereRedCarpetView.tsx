import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import CameraIcon from './icons/CameraIcon';

const MoviePremiereRedCarpetView: React.FC = () => {
    const { gameState, dispatch } = useGame();
    const { activeMoviePremiereOffer } = gameState;

    const [lookUrl, setLookUrl] = useState<string | null>(null);

    if (!activeMoviePremiereOffer) return <p>Error</p>;
    
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => setLookUrl(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const [location, setLocation] = useState<string>('Los Angeles');
    
    const locations = ["New York City", "Los Angeles", "Paris", "Dubai", "London", "Tokyo", "London Leicester Square", "Hollywood", "Cannes", "Venice"];

    const handleAttend = () => {
        if (lookUrl) {
            dispatch({ type: 'ACCEPT_MOVIE_PREMIERE_RED_CARPET', payload: { emailId: activeMoviePremiereOffer.emailId, lookUrl, location }});
        }
    };
    
    return (
        <div className="h-full w-full bg-zinc-900 flex flex-col">
             <header className="p-4 flex items-center gap-4 sticky top-0 bg-zinc-900/80 backdrop-blur-sm z-10 border-b border-zinc-700/50">
                <button onClick={() => dispatch({type: 'CHANGE_VIEW', payload: 'inbox'})} className="p-2 rounded-full hover:bg-white/10">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold">Movie Premiere Red Carpet</h1>
            </header>
            <main className="flex-grow p-4 flex flex-col justify-center items-center text-center space-y-4">
                <h2 className="text-3xl font-bold text-yellow-500">Premiere Red Carpet</h2>
                <p className="text-zinc-400 max-w-sm">Outlets want to post your movie premiere red carpet arrival. Upload an image or video still.</p>
                <div className="w-full max-w-sm text-left">
                    <label className="block text-sm font-medium text-zinc-300 mb-1">Select Premiere Location</label>
                    <select 
                        value={location} 
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 focus:ring-yellow-500 focus:border-yellow-500 text-white"
                    >
                        {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                    </select>
                </div>
                <label htmlFor="look-upload" className="cursor-pointer w-full max-w-sm">
                    <div className="w-full aspect-square rounded-lg bg-zinc-800 border-2 border-dashed border-zinc-600 flex items-center justify-center hover:border-yellow-400 transition-colors">
                        {lookUrl ? (
                            <img src={lookUrl} alt="Red Carpet Look" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                            <div className="text-zinc-400">
                                <CameraIcon className="w-12 h-12 mx-auto" />
                                <p>Upload</p>
                            </div>
                        )}
                    </div>
                </label>
                <input id="look-upload" type="file" accept="image/*,video/*" className="hidden" onChange={handleImageUpload} />
                 <button onClick={handleAttend} disabled={!lookUrl} className="w-full max-w-sm h-12 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg disabled:bg-zinc-600">
                    Attend & Post Look
                </button>
            </main>
        </div>
    );
};

export default MoviePremiereRedCarpetView;
