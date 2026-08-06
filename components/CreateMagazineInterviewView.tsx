import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

const CreateMagazineInterviewView: React.FC = () => {
    const { gameState, dispatch } = useGame();
    const [answers, setAnswers] = useState<Record<number, string>>({});
    
    const offer = gameState.activeInterviewOffer;
    if (!offer || offer.interviewType !== 'magazine') return null;

    const handleAnswer = (questionIndex: number, type: string) => {
        setAnswers(prev => ({ ...prev, [questionIndex]: type }));
    };

    const handleSubmit = () => {
        const answersArray = Object.values(answers);
        dispatch({ type: 'SUBMIT_INTERVIEW', payload: { answers: answersArray } });
    };

    const questions = [
        "Tell us about the inspiration behind your latest release.",
        "There's been a lot of rumors about your personal life lately. Care to comment?",
        "What's your message to the fans?"
    ];

    const options = [
        { text: "It was a deeply personal journey.", type: "good" },
        { text: "I'm just focused on the music.", type: "neutral" },
        { text: "I don't really care what people think, I just make hits.", type: "poor" }
    ];

    return (
        <div className="h-full w-full bg-zinc-900 overflow-y-auto">
            <header className="p-4 flex items-center gap-4 sticky top-0 bg-zinc-900/80 backdrop-blur-sm z-10 border-b border-zinc-700/50">
                <button onClick={() => dispatch({type: 'CANCEL_INTERVIEW_OFFER'})} className="p-2 rounded-full hover:bg-white/10">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold truncate">{offer.outletName} Interview</h1>
            </header>
            <main className="p-4 space-y-6">
                <div className="p-6 bg-zinc-800 rounded-lg space-y-6">
                    {questions.map((q, i) => (
                        <div key={i} className="space-y-3">
                            <h3 className="font-bold text-lg text-amber-200">Q: {q}</h3>
                            <div className="space-y-2">
                                {options.map(opt => (
                                    <button
                                        key={opt.type}
                                        onClick={() => handleAnswer(i, opt.type)}
                                        className={`w-full p-3 text-left rounded-lg border-2 transition-colors ${answers[i] === opt.type ? 'border-amber-500 bg-amber-900/30' : 'border-zinc-700 hover:border-zinc-500'}`}
                                    >
                                        {opt.text}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                    
                    <button
                        onClick={handleSubmit}
                        disabled={Object.keys(answers).length < questions.length}
                        className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg disabled:bg-zinc-700 disabled:text-zinc-500 transition-colors"
                    >
                        Publish Interview
                    </button>
                </div>
            </main>
        </div>
    );
};

export default CreateMagazineInterviewView;
