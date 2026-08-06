import React, { useState, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { VoguePhotoshoot } from '../types';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import CameraIcon from './icons/CameraIcon';

const CreateVogueFeatureView: React.FC = () => {
    const { gameState, dispatch, activeArtist } = useGame();
    const { activeVogueOffer } = gameState;
    
    // Local state to manage the multi-step process
    const [step, setStep] = useState<'cover' | 'photos' | 'interview'>('cover');
    const [coverImage, setCoverImage] = useState<string | null>(null);
    const [photoshootImages, setPhotoshootImages] = useState<string[]>([]);
    const [answers, setAnswers] = useState<string[]>(['', '', '']);
    const [error, setError] = useState('');

    const questions = useMemo(() => [
        `What's the craziest rumor you have heard about yourself?`,
        `How has your style evolved over your career?`,
        `What can fans expect from your next musical era?`
    ], []);

    if (!activeVogueOffer || !activeArtist) {
        // Should not happen, but safe fallback
        dispatch({ type: 'CHANGE_VIEW', payload: 'inbox' });
        return null;
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setter(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleNextStep = () => {
        setError('');
        if (step === 'cover') {
            if (!coverImage) {
                setError('Please upload a cover image.');
                return;
            }
            setStep('photos');
        } else if (step === 'photos') {
            if (photoshootImages.length < 3) {
                setError('Please upload 3 photoshoot images.');
                return;
            }
            setStep('interview');
        }
    };

    const handlePublish = () => {
        setError('');
        if (answers.some(a => a.trim() === '')) {
            setError('Please answer all interview questions.');
            return;
        }

        const newPhotoshoot: VoguePhotoshoot = {
            id: crypto.randomUUID(),
            magazine: activeVogueOffer.magazine,
            coverImage: coverImage!,
            photoshootImages,
            interviewAnswers: questions.map((q, i) => ({ question: q, answer: answers[i] })),
            date: gameState.date,
        };

        dispatch({ type: 'CREATE_VOGUE_FEATURE', payload: { photoshoot: newPhotoshoot }});
    };

    const handleCancel = () => {
        dispatch({ type: 'CANCEL_VOGUE_OFFER' });
    };

    const renderStepContent = () => {
        switch (step) {
            case 'cover':
                return (
                    <div className="space-y-4 text-center">
                        <h2 className="text-xl font-bold">Step 1: Upload Your Cover</h2>
                        <label htmlFor="cover-upload" className="cursor-pointer w-full max-w-sm mx-auto block">
                            <div className="w-full aspect-[3/4] bg-zinc-800 rounded-lg border-2 border-dashed border-zinc-600 flex items-center justify-center hover:border-red-500">
                                {coverImage ? <img src={coverImage} alt="Cover" className="w-full h-full object-cover rounded-lg" /> : <CameraIcon className="w-12 h-12 text-zinc-500"/>}
                            </div>
                        </label>
                        <input id="cover-upload" type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, setCoverImage)} />
                    </div>
                );
            case 'photos':
                return (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-center">Step 2: Upload Photoshoot Images ({photoshootImages.length}/3)</h2>
                        <div className="grid grid-cols-3 gap-2">
                            {[0, 1, 2].map(index => (
                                <label key={index} htmlFor={`photo-upload-${index}`} className="cursor-pointer w-full aspect-square bg-zinc-800 rounded-lg border-2 border-dashed flex items-center justify-center">
                                    {photoshootImages[index] ? <img src={photoshootImages[index]} className="w-full h-full object-cover rounded-lg" /> : <CameraIcon className="w-8 h-8 text-zinc-500"/>}
                                </label>
                            ))}
                            <input id="photo-upload-0" type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, url => setPhotoshootImages(p => { const newP = [...p]; newP[0] = url; return newP; }))} />
                            <input id="photo-upload-1" type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, url => setPhotoshootImages(p => { const newP = [...p]; newP[1] = url; return newP; }))} />
                            <input id="photo-upload-2" type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, url => setPhotoshootImages(p => { const newP = [...p]; newP[2] = url; return newP; }))} />
                        </div>
                    </div>
                );
            case 'interview':
                return (
                     <div className="space-y-6">
                        <h2 className="text-xl font-bold text-center">Step 3: Answer Interview Questions</h2>
                        {questions.map((q, i) => (
                            <div key={i}>
                                <label className="block text-sm font-medium text-zinc-300 mb-1">{q}</label>
                                <textarea
                                    value={answers[i]}
                                    onChange={(e) => setAnswers(prev => { const newA = [...prev]; newA[i] = e.target.value; return newA; })}
                                    rows={3}
                                    className="w-full bg-zinc-700 p-2 rounded-md text-sm"
                                />
                            </div>
                        ))}
                    </div>
                );
        }
    };
    
    return (
        <div className="h-full w-full bg-zinc-900 overflow-y-auto">
            <header className="p-4 flex items-center gap-4 sticky top-0 bg-zinc-900/80 backdrop-blur-sm z-10 border-b border-zinc-700/50">
                <button onClick={handleCancel} className="p-2 rounded-full hover:bg-white/10">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold truncate">Vogue Feature: {activeVogueOffer.magazine}</h1>
            </header>
            <main className="flex-grow p-4 space-y-6">
                {error && <p className="text-red-400 text-center mb-4">{error}</p>}
                {renderStepContent()}
            </main>
             <div className="p-4 border-t border-zinc-700/50">
                {step !== 'interview' ? (
                    <button onClick={handleNextStep} className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg">Next</button>
                ) : (
                    <button onClick={handlePublish} className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg">Publish Feature</button>
                )}
            </div>
        </div>
    );
};

export default CreateVogueFeatureView;
