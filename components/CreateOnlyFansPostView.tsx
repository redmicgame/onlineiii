import React, { useState } from 'react';
import { useGame, formatNumber } from '../context/GameContext';
import { OnlyFansPost } from '../types';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

const CreateOnlyFansPostView: React.FC = () => {
    const { dispatch, gameState, activeArtistData } = useGame();
    if (!activeArtistData || !activeArtistData.onlyfans) {
        // Should not happen, but for safety
        dispatch({ type: 'CHANGE_VIEW', payload: 'game' });
        return null;
    }
    const { date } = gameState;
    const { onlyfans } = activeArtistData;

    const [caption, setCaption] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [price, setPrice] = useState(0);
    const [error, setError] = useState('');

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handlePost = () => {
        if (!image) {
            setError("An image or video is required for a post.");
            return;
        }

        const newPost: OnlyFansPost = {
            id: crypto.randomUUID(), // Will be overwritten by reducer, but needed for type
            date: date, // Will be overwritten
            caption,
            image,
            price,
            likes: 0, // Will be calculated by reducer
            comments: 0, // Will be calculated by reducer
            tips: 0, // Will be calculated by reducer
        };
        
        dispatch({ type: 'CREATE_ONLYFANS_POST', payload: { post: newPost } });
        dispatch({ type: 'CHANGE_VIEW', payload: 'onlyfans' });
    };

    const prices = [0, 2.99, 4.99, 7.99];

    return (
        <div className="h-full w-full bg-zinc-900 overflow-y-auto">
            <header className="p-4 flex items-center gap-4 sticky top-0 bg-zinc-900/80 backdrop-blur-sm z-10 border-b border-zinc-700/50">
                <button onClick={() => dispatch({type: 'CHANGE_VIEW', payload: 'onlyfans'})} className="p-2 rounded-full hover:bg-white/10">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold">New OnlyFans Post</h1>
            </header>
            <main className="p-4 space-y-6">
                <label htmlFor="image-upload" className="w-full cursor-pointer">
                    <div className="w-full aspect-square bg-zinc-800 rounded-lg border-2 border-dashed border-zinc-600 flex items-center justify-center hover:border-blue-500">
                        {image ? (
                            <img src={image} alt="Post preview" className="w-full h-full object-cover rounded-lg"/>
                        ) : (
                            <span className="text-zinc-400">Upload Image / Video</span>
                        )}
                    </div>
                </label>
                <input type="file" id="image-upload" accept="image/*,video/*" onChange={handleImageUpload} className="hidden" />

                <div>
                    <label htmlFor="caption" className="block text-sm font-medium text-zinc-300">Caption</label>
                    <textarea id="caption" value={caption} onChange={e => setCaption(e.target.value)} rows={3} className="mt-1 block w-full bg-zinc-700 p-2 rounded-md"></textarea>
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-300">Post Price</label>
                    <div className="mt-2 grid grid-cols-4 gap-2">
                        {prices.map(p => (
                            <button 
                                key={p}
                                type="button" 
                                onClick={() => setPrice(p)} 
                                className={`py-2 rounded-md font-semibold ${price === p ? 'bg-red-600' : 'bg-zinc-700 hover:bg-zinc-600'}`}
                            >
                                {p === 0 ? 'Free' : `$${p.toFixed(2)}`}
                            </button>
                        ))}
                    </div>
                </div>

                {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                <button onClick={handlePost} className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">
                    Post to Profile
                </button>
            </main>
        </div>
    );
};
export default CreateOnlyFansPostView;