
import React from 'react';
import { useGame } from '../context/GameContext';
import ChevronRightIcon from './icons/ChevronRightIcon';
import BriefcaseIcon from './icons/BriefcaseIcon';

const BusinessTab: React.FC = () => {
    const { dispatch } = useGame();

    return (
        <div className="p-4 space-y-6">
            <h1 className="text-3xl font-bold text-red-500">Business</h1>

            <button 
                onClick={() => dispatch({ type: 'CHANGE_VIEW', payload: 'management' })}
                className="w-full bg-zinc-800 p-4 rounded-lg text-left hover:bg-zinc-700 transition-colors flex justify-between items-center"
            >
                <div>
                    <h3 className="font-bold text-lg">Management</h3>
                    <p className="text-sm text-zinc-400">Hire a manager to boost your career.</p>
                </div>
                <ChevronRightIcon className="w-6 h-6 text-zinc-500" />
            </button>

            <button 
                onClick={() => dispatch({ type: 'CHANGE_VIEW', payload: 'security' })}
                className="w-full bg-zinc-800 p-4 rounded-lg text-left hover:bg-zinc-700 transition-colors flex justify-between items-center"
            >
                <div>
                    <h3 className="font-bold text-lg">Security</h3>
                    <p className="text-sm text-zinc-400">Protect your unreleased music from leaks.</p>
                </div>
                <ChevronRightIcon className="w-6 h-6 text-zinc-500" />
            </button>
        </div>
    );
};

export default BusinessTab;
