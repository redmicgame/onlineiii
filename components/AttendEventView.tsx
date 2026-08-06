import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import CameraIcon from './icons/CameraIcon';

const AttendEventView: React.FC = () => {
    const { gameState, dispatch } = useGame();
    const { activeEventInvitation } = gameState;
    const [image, setImage] = useState<string | null>(null);
    const [error, setError] = useState('');

    if (!activeEventInvitation) {
        dispatch({ type: 'CHANGE_VIEW', payload: 'inbox' });
        return null;
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
                setError('');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleConfirm = () => {
        if (!image) {
            setError('Please upload an image of your look.');
            return;
        }
        dispatch({ type: 'CONFIRM_EVENT_ATTENDANCE', payload: { imageUrl: image } });
    };

    return (
        <div className="h-full bg-zinc-900 text-white flex flex-col items-center justify-center p-6 animate-fade-in relative">
            <button 
                onClick={() => dispatch({ type: 'CHANGE_VIEW', payload: 'inbox' })} 
                className="absolute top-6 left-6 p-2 rounded-full hover:bg-white/10 transition-colors"
                title="Back to inbox"
            >
                <ArrowLeftIcon className="w-8 h-8" />
            </button>

            <div className="max-w-md w-full space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold">Attend {activeEventInvitation.eventName}</h1>
                    <p className="text-zinc-400">Upload your stunning red carpet look for everyone to see.</p>
                </div>

                <div className="bg-zinc-800 p-6 rounded-2xl border border-zinc-700 shadow-xl space-y-6">
                    <div className="flex justify-center">
                        <label htmlFor="event-look" className="cursor-pointer group">
                            <div className={`w-64 h-80 rounded-xl flex items-center justify-center overflow-hidden border-2 border-dashed transition-colors relative ${image ? 'border-zinc-700' : 'border-zinc-500 hover:border-zinc-400'}`}>
                                {image ? (
                                    <>
                                        <img src={image} alt="Your Look" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <span className="text-white font-medium flex items-center gap-2"><CameraIcon className="w-5 h-5"/> Change Look</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-zinc-400 flex flex-col items-center gap-3">
                                        <CameraIcon className="w-10 h-10" />
                                        <span className="font-medium px-4 text-center">Upload Your Look</span>
                                    </div>
                                )}
                            </div>
                        </label>
                        <input id="event-look" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </div>

                    {error && <p className="text-red-400 text-sm text-center font-medium bg-red-400/10 py-2 rounded-lg">{error}</p>}

                    <div className="pt-2">
                        <button 
                            onClick={handleConfirm}
                            disabled={!image}
                            className="w-full h-12 font-bold py-2 px-4 rounded-lg transition-colors shadow-lg bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:text-zinc-500"
                        >
                            Walk the Red Carpet
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendEventView;
