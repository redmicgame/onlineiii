import React, { useEffect, useState, useRef } from 'react';
import { useGame, formatNumber } from '../context/GameContext';
import { db, getActiveSaveId, setActiveSaveId, separateMediaFromState } from '../db/db';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import TrashIcon from './icons/TrashIcon'; // need this? Or use button text

const SwitchSaveView: React.FC = () => {
    const { gameState, dispatch } = useGame();
    const [saves, setSaves] = useState<Record<number, any>>({});
    const activeSaveId = getActiveSaveId();
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadMsg, setUploadMsg] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const loadSaves = async () => {
        const allSaves = await db.saves.toArray();
        const savesMap: Record<number, any> = {};
        allSaves.forEach(save => {
            if (save.id !== undefined) {
                savesMap[save.id] = save.state;
            }
        });
        setSaves(savesMap);
    };

    useEffect(() => {
        loadSaves();
    }, []);

    const handleSwitch = (id: number) => {
        setActiveSaveId(id);
        window.location.reload();
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this save? This action cannot be undone.')) {
            await db.saves.delete(id);
            if (id === activeSaveId) {
                dispatch({ type: 'RESET_GAME' });
            } else {
                await loadSaves();
            }
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, slotId: number) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setUploadProgress(10);
        setUploadMsg("Reading file...");

        try {
            // Artificial delay based on file size to prevent UI freeze and give user feedback
            if (file.size > 185 * 1024 * 1024) { // 185MB+
                for (let i = 10; i < 30; i += 2) {
                    setUploadProgress(i);
                    await new Promise(r => setTimeout(r, 400));
                }
            } else if (file.size > 100 * 1024 * 1024) { // 100MB+
                for (let i = 10; i < 30; i += 5) {
                    setUploadProgress(i);
                    await new Promise(r => setTimeout(r, 200));
                }
            } else {
                await new Promise(r => setTimeout(r, 100));
            }
            
            const content = await file.text();
            
            setUploadProgress(30);
            setUploadMsg("Parsing save file...");
            
            if (file.size > 185 * 1024 * 1024) {
                await new Promise(r => setTimeout(r, 2000));
            } else if (file.size > 100 * 1024 * 1024) {
                await new Promise(r => setTimeout(r, 1000));
            } else {
                await new Promise(r => setTimeout(r, 100));
            }

            const parsedState = JSON.parse(content);

            if (parsedState && parsedState.date && parsedState.careerMode) {
                setUploadProgress(50);
                setUploadMsg("Extracting media and saving...");

                const processedState = await separateMediaFromState(parsedState, (prog, msg) => {
                    setUploadProgress(50 + Math.floor(prog / 2));
                    if (msg) setUploadMsg(msg);
                });

                await db.saves.put({ id: slotId, state: processedState });

                if (slotId === activeSaveId) {
                    window.location.reload();
                } else {
                    await loadSaves();
                    setUploadProgress(100);
                    setUploadMsg("Done!");
                    await new Promise(r => setTimeout(r, 500));
                }
            } else {
                alert('Invalid save file format.');
            }
        } catch (err) {
            console.error(err);
            alert('Error parsing save file. It might be corrupt.');
        } finally {
            setIsUploading(false);
        }
    };

    const maxSlots = 6;
    const slots = Array.from({ length: maxSlots }, (_, i) => i + 1);

    if (isUploading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center">
                <svg viewBox="0 0 24 24" className="w-16 h-16 fill-current text-[#1ed760] mb-6 animate-pulse" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.996 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12 12 12 0 0 0-12-12zm5.772 17.27a.754.754 0 0 1-1.037.248c-2.842-1.735-6.42-2.127-10.638-1.164a.755.755 0 0 1-.341-1.47c4.61-1.054 8.56-.607 11.768 1.35.372.227.491.716.248 1.036zm1.471-3.284a.94.94 0 0 1-1.294.305c-3.242-1.991-8.225-2.584-12.029-1.428a.941.941 0 0 1-.555-1.802c4.341-1.317 9.873-.655 13.573 1.62.43.264.566.837.305 1.295l-.001.01zm.105-3.41c-3.921-2.327-10.37-2.54-14.122-1.405a1.127 1.127 0 1 1-.652-2.155c4.321-1.31 11.455-1.055 16.023 1.656a1.127 1.127 0 1 1-1.25 1.904z"/>
                </svg>
                <h2 className="text-xl font-bold mb-4">Uploading Save File...</h2>
                <p className="text-zinc-400 mb-6">{uploadMsg}</p>
                <div className="w-full max-w-md bg-zinc-800 rounded-full h-2.5 overflow-hidden">
                    <div 
                        className="bg-[#1ed760] h-2.5 rounded-full transition-all duration-300 ease-out" 
                        style={{ width: `${uploadProgress}%` }}
                    ></div>
                </div>
                <p className="text-xs text-zinc-500 mt-4 uppercase tracking-widest">{uploadProgress}% Complete</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-20 p-4">
             <div className="flex items-center space-x-4 mb-6">
                <button onClick={() => dispatch({ type: 'CHANGE_VIEW', payload: 'game' })} className="p-2 bg-zinc-800 rounded-full hover:bg-zinc-700">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold">Switch Save</h2>
            </div>
            
            <p className="text-zinc-400 text-sm">Manage up to {maxSlots} separate game saves. Click Switch to load a save or create a new one.</p>

            <div className="space-y-4">
                {slots.map(slotId => {
                    const saveState = saves[slotId];
                    const isActive = slotId === activeSaveId;

                    return (
                        <div key={slotId} className={`p-4 rounded-xl border-2 ${isActive ? 'bg-red-900/20 border-red-500' : 'bg-zinc-800 border-zinc-700'}`}>
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold text-lg">Save Slot {slotId} {isActive && <span className="ml-2 text-xs bg-red-500 text-white px-2 py-1 rounded-full uppercase tracking-wider">Active</span>}</h3>
                                    {saveState ? (
                                        <div className="text-sm text-zinc-400 space-y-1 mt-2">
                                            {saveState.careerMode === 'solo' && saveState.soloArtist && (
                                                <p>Artist: <span className="text-white font-medium">{saveState.soloArtist.name}</span></p>
                                            )}
                                            {saveState.careerMode === 'group' && saveState.group && (
                                                <p>Group: <span className="text-white font-medium">{saveState.group.name}</span></p>
                                            )}
                                            <p>Date: Year {saveState.date?.year}, Week {saveState.date?.week}</p>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-zinc-500 mt-2">Empty Slot</p>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2 items-end">
                                    {saveState ? (
                                        <>
                                            {!isActive && (
                                                <button onClick={() => handleSwitch(slotId)} className="px-4 py-2 bg-white text-black font-bold rounded-lg hover:bg-zinc-200 transition-colors text-sm">
                                                    Load Save
                                                </button>
                                            )}
                                            <button onClick={() => handleDelete(slotId)} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors text-sm">
                                                Delete
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => handleSwitch(slotId)} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors text-sm">
                                                Create New Game
                                            </button>
                                            <label className="cursor-pointer px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white font-bold rounded-lg transition-colors text-sm">
                                                Upload Save File
                                                <input
                                                    type="file"
                                                    accept=".json"
                                                    className="hidden"
                                                    onChange={(e) => handleFileUpload(e, slotId)}
                                                />
                                            </label>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SwitchSaveView;
