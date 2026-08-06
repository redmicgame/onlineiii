
import React from 'react';
import { useGame } from '../context/GameContext';
import VmaAwardIcon from './icons/VmaAwardIcon';

const VmaSubmissionSuccessView: React.FC = () => {
    const { dispatch } = useGame();

    return (
        <div className="h-full w-full bg-zinc-900 flex flex-col items-center justify-center text-center p-4">
            <VmaAwardIcon className="w-24 h-24 text-zinc-300 mb-6" />
            <h1 className="text-3xl font-bold">Submissions Sent!</h1>
            <p className="text-zinc-400 mt-2 max-w-sm">
                Your submissions for the MTV Video Music Awards have been received. Nominations will be announced in a few weeks. Good luck!
            </p>
            <button
                onClick={() => dispatch({ type: 'CHANGE_VIEW', payload: 'game' })}
                className="mt-8 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
                Return to Game
            </button>
        </div>
    );
};

export default VmaSubmissionSuccessView;
