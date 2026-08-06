import React, { useState, useRef } from 'react';
import { useGame } from '../context/GameContext';
import CameraIcon from './icons/CameraIcon';

export const CreateFeatureVideoView: React.FC = () => {
    const { gameState, dispatch } = useGame();
    const [thumbnail, setThumbnail] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const offer = gameState.activeFeatureVideoOffer;

    if (!offer) {
        return null; // Safety check
    }

    const { npcArtistName } = offer;

    const handleCreate = () => {
        if (!thumbnail) return;
        dispatch({ type: 'CREATE_FEATURE_VIDEO', payload: { thumbnail } });
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 1280;
                    const MAX_HEIGHT = 720;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);

                    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
                    setThumbnail(compressedBase64);
                };
                img.src = result;
            };
            reader.readAsDataURL(file);
        }
    };

    const removeThumbnail = () => {
        setThumbnail('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-2xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Shoot Music Video</h1>
                    <p className="text-zinc-400">
                        {npcArtistName} is asking for your thumbnail for the music video!
                    </p>
                </div>

                <div className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-700/50 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">Video Thumbnail</label>
                        {!thumbnail ? (
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full aspect-video border-2 border-dashed border-zinc-600 rounded-lg flex flex-col items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-500 hover:bg-zinc-700/50 transition-colors"
                            >
                                <span className="font-semibold">Upload Image</span>
                                <span className="text-sm mt-1">16:9 Aspect Ratio Recommended</span>
                            </button>
                        ) : (
                            <div className="relative group aspect-video">
                                <img
                                    src={thumbnail}
                                    alt="Video thumbnail"
                                    className="w-full h-full object-cover rounded-lg"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-4 border border-zinc-600">
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="p-3 bg-zinc-800 rounded-full hover:bg-zinc-700 text-white transition-colors"
                                    >
                                        <CameraIcon className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={removeThumbnail}
                                        className="p-3 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                                    >
                                        X
                                    </button>
                                </div>
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleImageUpload}
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={() => dispatch({ type: 'CANCEL_FEATURE_VIDEO_OFFER' })}
                        className="flex-1 py-3 px-4 font-bold rounded-lg border border-zinc-700 hover:bg-zinc-800 text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreate}
                        disabled={!thumbnail}
                        className="flex-1 py-3 px-4 font-bold rounded-lg bg-red-600 hover:bg-red-500 text-white transition-colors shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Shoot Video
                    </button>
                </div>
            </div>
        </div>
    );
};
