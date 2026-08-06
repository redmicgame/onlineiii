import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

const CreateTvInterviewView: React.FC = () => {
    const { gameState, dispatch } = useGame();
    const [answers, setAnswers] = useState<Record<number, string>>({});
    
    const offer = gameState.activeInterviewOffer;
    if (!offer || offer.interviewType !== 'tv') return null;

    const handleAnswer = (questionIndex: number, type: string) => {
        setAnswers(prev => ({ ...prev, [questionIndex]: type }));
    };

    const handleSubmit = () => {
        const answersArray = Object.values(answers);
        dispatch({ type: 'SUBMIT_INTERVIEW', payload: { answers: answersArray } });
    };

    const questions = [
        "Welcome to the show. Let's get right into it. Your recent release has caused quite a stir.",
        "Critics say your new direction is controversial. How do you respond?",
        "Final question. Where do you see your career going from here?"
    ];

    const options = [
        { text: "I appreciate the fans for sticking with me.", type: "good" },
        { text: "I think the work speaks for itself.", type: "neutral" },
        { text: "The critics don't know what they're talking about.", type: "poor" }
    ];

    return (
        <div className="h-full w-full bg-zinc-900 overflow-y-auto">
            <header className="p-4 flex items-center gap-4 sticky top-0 bg-red-900/80 backdrop-blur-sm z-10 border-b border-red-700/50">
                <button onClick={() => dispatch({type: 'CANCEL_INTERVIEW_OFFER'})} className="p-2 rounded-full hover:bg-white/10">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold truncate">{offer.outletName} Live Interview</h1>
            </header>
            <main className="p-4 space-y-6">
                <div className="p-6 bg-zinc-800 rounded-lg space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center animate-pulse">
                            <div className="w-4 h-4 bg-white rounded-full"></div>
                        </div>
                        <div>
                            <p className="text-red-500 font-bold uppercase tracking-widest text-sm">Live Broadcast</p>
                            <p className="text-zinc-400 text-xs">Millions are watching.</p>
                        </div>
                    </div>
                    
                    {questions.map((q, i) => (
                        <div key={i} className="space-y-3">
                            <h3 className="font-bold text-lg text-blue-300">Host: "{q}"</h3>
                            <div className="space-y-2">
                                {options.map(opt => (
                                    <button
                                        key={opt.type}
                                        onClick={() => handleAnswer(i, opt.type)}
                                        className={`w-full p-3 text-left rounded-lg border-2 transition-colors ${answers[i] === opt.type ? 'border-red-500 bg-red-900/30' : 'border-zinc-700 hover:border-zinc-500'}`}
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
                        className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg disabled:bg-zinc-700 disabled:text-zinc-500 transition-colors"
                    >
                        End Broadcast
                    </button>
                </div>
            </main>
        </div>
    );
};

export default CreateTvInterviewView;
