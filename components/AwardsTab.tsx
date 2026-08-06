
import React from 'react';
import { useGame } from '../context/GameContext';
import ChevronRightIcon from './icons/ChevronRightIcon';

const AwardsTab: React.FC = () => {
    const { dispatch } = useGame();
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-red-500">Awards</h2>
            <button 
                onClick={() => dispatch({ type: 'CHANGE_VIEW', payload: 'grammys' })}
                className="w-full bg-zinc-800 p-4 rounded-lg text-left hover:bg-zinc-700 transition-colors flex justify-between items-center"
            >
                <div>
                    <h3 className="font-bold text-lg">GRAMMY Awards</h3>
                    <p className="text-sm text-zinc-400">View nominations and wins.</p>
                </div>
                <ChevronRightIcon className="w-6 h-6 text-zinc-500" />
            </button>
        </div>
    );
};

export default AwardsTab;
