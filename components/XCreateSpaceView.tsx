import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

const XCreateSpaceView: React.FC = () => {
    const { dispatch, activeArtistData, gameState } = useGame();
    const [topic, setTopic] = useState('');
    const [recordSpace, setRecordSpace] = useState(false);
    const [enableVideo, setEnableVideo] = useState(false);
    
    if (!activeArtistData) return null;
    const { xSuspensionStatus } = activeArtistData;
    const isSuspended = xSuspensionStatus?.isSuspended;

    const handleStartSpace = () => {
        if (!topic) {
            alert('Please enter a topic.');
            return;
        }
        dispatch({ type: 'START_X_SPACE', payload: { topic, recordSpace, enableVideo } });
        dispatch({ type: 'CHANGE_VIEW', payload: 'xActiveSpace' });
    };

    return (
        <div className="bg-black h-full overflow-y-auto text-white flex flex-col pt-safe px-4 pb-24">
            <header className="flex items-center justify-between py-4">
                <button onClick={() => dispatch({ type: 'CHANGE_VIEW', payload: 'x' })} className="text-white text-lg">Cancel</button>
                <h1 className="font-bold text-xl">Create your Space</h1>
                <div className="w-10"></div>
            </header>

            <div className="flex-1 mt-6">
                <input 
                    type="text" 
                    placeholder="What do you want to talk about?" 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full bg-transparent text-2xl font-bold border-none outline-none placeholder-zinc-700 placeholder-opacity-50"
                    maxLength={60}
                    disabled={isSuspended}
                />

                <button disabled={isSuspended} className="mt-6 text-[#7F56D9] font-bold text-lg flex items-center gap-2">
                    <span className="text-2xl">+</span> Add Topics
                </button>

                <div className="mt-12 space-y-6">
                    <div className="flex items-center justify-between">
                        <span className="text-lg">Record Space</span>
                        <button disabled={isSuspended} onClick={() => setRecordSpace(!recordSpace)} className={`w-12 h-6 rounded-full p-1 transition-colors ${recordSpace ? 'bg-[#7F56D9]' : 'bg-zinc-700'}`}>
                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${recordSpace ? 'translate-x-6' : ''}`}></div>
                        </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <span className="text-lg">Enable video</span>
                        <button disabled={isSuspended} onClick={() => setEnableVideo(!enableVideo)} className={`w-12 h-6 rounded-full p-1 transition-colors ${enableVideo ? 'bg-[#7F56D9]' : 'bg-zinc-700'}`}>
                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${enableVideo ? 'translate-x-6' : ''}`}></div>
                        </button>
                    </div>
                </div>
            </div>

            <div className="pb-10 pt-4 flex flex-col items-center">
                <div className="w-full flex gap-4">
                    <button 
                        onClick={handleStartSpace}
                        disabled={isSuspended || !topic}
                        className="flex-1 bg-[#7F56D9] text-white font-bold text-lg py-4 rounded-full disabled:opacity-50"
                    >
                        Start now
                    </button>
                    <button className="w-14 h-14 border border-zinc-700 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </button>
                </div>
                <button className="text-[#7F56D9] mt-6 font-bold">Get to know Spaces</button>
            </div>
        </div>
    );
};

export default XCreateSpaceView;
