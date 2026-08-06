import React, { useState } from 'react';
import { useGame, formatNumber } from '../context/GameContext';

const RadioDashView: React.FC = () => {
    const { gameState, dispatch } = useGame();
    const [selectedTab, setSelectedTab] = useState<'manage' | 'charts'>('manage');
    const [selectedChart, setSelectedChart] = useState<'overall' | 'pop' | 'urban' | 'rhythmic' | 'country' | 'christmas'>('overall');
    const [promoSongId, setPromoSongId] = useState<string | null>(null);
    const [promoAmount, setPromoAmount] = useState<number>(10000);
    const [promoSource, setPromoSource] = useState<'personal' | 'label'>('personal');

    const activeArtistData = gameState.activeArtistId ? gameState.artistsData[gameState.activeArtistId] : null;

    const getActiveLabel = () => {
        if (!activeArtistData?.contract) return null;
        return activeArtistData.contract.labelId;
    };

    const getMaxRadioSongs = (labelId: string | null) => {
        if (!labelId) return 0;
        if (labelId === 'island' || labelId === 'atlantic' || labelId === 'tde') return 1;
        if (labelId === 'rca' || labelId === 'columbia' || labelId === 'quality_control') return 2;
        if (labelId === 'umg' || labelId === 'republic' || labelId === 'interscope' || labelId === 'epic' || labelId === 'roc_nation') return 3;
        if (labelId.includes('custom_')) return 5; 
        return 3; 
    };

    const labelId = getActiveLabel();
    const maxSongs = getMaxRadioSongs(labelId);

    if (activeArtistData?.isBlacklistedByLabel) {
        return (
            <div className="flex flex-col h-full bg-zinc-900 text-white">
                <header className="flex items-center p-4 bg-zinc-800 shrink-0 gap-4">
                    <button onClick={() => dispatch({type: 'CHANGE_VIEW', payload: 'game'})} className="p-2 rounded-full hover:bg-white/10">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    </button>
                    <h1 className="text-2xl font-bold">Radio</h1>
                </header>
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <h2 className="text-2xl font-bold text-red-500 mb-4">Blacklisted by Label</h2>
                    <p className="text-zinc-400">Your label has blacklisted you and pulled all your music from radio rotation.</p>
                </div>
            </div>
        );
    }
    
    const songsOnRadioCount = activeArtistData?.songs.filter(s => s.isOnRadio || s.isOnUkRadio).length || 0;

    const handleWithdraw = (songId: string, format: string, region: 'US'|'UK' = 'US') => {
        dispatch({ type: 'WITHDRAW_FROM_RADIO', payload: { songId, format, region } });
    };

    const [selectedRegion, setSelectedRegion] = useState<'US'|'UK'>('US');

    const handleSubmit = (songId: string, format: string, region: 'US'|'UK' = 'US') => {
        const onRadioCount = activeArtistData?.songs.filter(s => region === 'US' ? s.isOnRadio : s.isOnUkRadio).length || 0;
        if (onRadioCount >= maxSongs) {
            alert(`Your label restricts you to ${maxSongs} concurrent song(s) on ${region} radio.`);
            return;
        }
        dispatch({ type: 'SUBMIT_TO_RADIO', payload: { songId, format, region } });
    };

    const handlePromote = (songId: string, format: string, region: 'US'|'UK' = 'US') => {
        const activePayolaCount = activeArtistData?.songs.filter(s => s.hasRadioPromo || s.hasUkRadioPromo).length || 0;
        if (gameState.difficultyMode === 'hard' && activePayolaCount >= 2) {
            alert('You can only have 2 songs active in payola on Hard mode.');
            return;
        }
        if (gameState.difficultyMode === 'extreme' && activePayolaCount >= 1) {
            alert('You can only have 1 song active in payola on Extreme mode.');
            return;
        }

        if (promoSource === 'personal' && (activeArtistData?.money || 0) < promoAmount) {
            alert("Not enough personal funds.");
            return;
        }
        if (promoSource === 'label' && (!activeArtistData?.contract || activeArtistData.contract.marketingBudget < promoAmount)) {
            alert("Not enough label marketing budget.");
            return;
        }
        dispatch({ type: 'PROMOTE_RADIO', payload: { songId, format, amount: promoAmount, source: promoSource, region } });
        setPromoSongId(null);
        alert(`Successfully invested $${formatNumber(promoAmount)} in radio promotion!`);
    };

    const renderManage = () => {
        if (!activeArtistData) return null;

        const usRadioSongs = activeArtistData.songs.filter(s => s.isOnRadio).map(s => ({...s, _region: 'US' as 'US'|'UK', _key: s.id + '_us'}));
        const ukRadioSongs = activeArtistData.songs.filter(s => s.isOnUkRadio).map(s => ({...s, _region: 'UK' as 'US'|'UK', _key: s.id + '_uk'}));
        const activeRadioSongs = [...usRadioSongs, ...ukRadioSongs];

        if (maxSongs === 0) {
            return (
                <div className="p-4 flex flex-col items-center text-center justify-center h-64 text-zinc-500">
                    <p className="font-bold text-xl mb-2 text-black">NO LABEL AFFILIATION</p>
                    <p>You must be signed to a label to submit songs for radio airplay.</p>
                </div>
            );
        }

        return (
            <div className="p-4 space-y-6">
                <div>
                    <h2 className="text-xl font-bold mb-2">My Airplay</h2>
                    <p className="text-sm text-zinc-500 mb-4">Capacity: {songsOnRadioCount} / {maxSongs} active campaigns</p>
                    {activeRadioSongs.map(song => (
                        <div key={song._key} className="bg-white p-3 rounded-lg border border-black shadow mb-3 flex flex-col">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <img src={song.coverArt} className="w-12 h-12 object-cover border border-black" />
                                    <div>
                                        <p className="font-bold text-sm truncate w-40">{song.title}</p>
                                        <p className="text-xs text-zinc-500 pt-1">
                                            Plays: {formatNumber(song._region === 'US' ? (song.radioPlays || 0) : (song.ukRadioPlays || 0))} TW • Format: {(song._region === 'US' ? song.radioFormat : song.ukRadioFormat)?.toUpperCase()} • Region: {song._region}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <button 
                                        onClick={() => setPromoSongId(promoSongId === song.id ? null : song.id)} 
                                        disabled={song._region === 'US' ? song.hasRadioPromo : song.hasUkRadioPromo}
                                        className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded uppercase disabled:opacity-50">
                                        {(song._region === 'US' ? song.hasRadioPromo : song.hasUkRadioPromo) ? 'Promoted' : promoSongId === song.id ? 'Cancel' : 'Promote'}
                                    </button>
                                    <button onClick={() => handleWithdraw(song.id, song._region === 'US' ? (song.radioFormat || 'pop') : (song.ukRadioFormat || 'pop'), song._region)} className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded uppercase">Withdraw</button>
                                </div>
                            </div>
                            {promoSongId === song.id && (
                                <div className="mt-4 pt-4 border-t border-zinc-200">
                                    <h4 className="font-bold text-sm mb-2 text-blue-800">Radio Promotion (Payola)</h4>
                                    {(gameState.difficultyMode === 'hard' && (activeArtistData?.songs.filter(s => s.hasRadioPromo || s.hasUkRadioPromo).length || 0) >= 2) || (gameState.difficultyMode === 'extreme' && (activeArtistData?.songs.filter(s => s.hasRadioPromo || s.hasUkRadioPromo).length || 0) >= 1) ? (
                                        <p className="text-sm text-red-600 font-bold mb-2">Payola limit reached for {gameState.difficultyMode === 'extreme' ? 'Extreme' : 'Hard'} Mode. Remove a song's promotion to add more.</p>
                                    ) : (
                                        <>
                                    <p className="text-xs text-zinc-600 mb-4">Invest money to boost spins and impressions this week.</p>
                                    <div className="mb-4">
                                        <label className="text-xs font-bold text-zinc-700">Amount: ${formatNumber(promoAmount)}</label>
                                        <input 
                                            type="range" 
                                            min="1000" 
                                            max="1000000" 
                                            step="1000"
                                            value={promoAmount} 
                                            onChange={(e) => setPromoAmount(parseInt(e.target.value))}
                                            className="w-full accent-blue-600 h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer mt-2" 
                                        />
                                    </div>
                                    <div className="flex gap-2 mb-4">
                                        <button 
                                            onClick={() => setPromoSource('personal')} 
                                            className={`flex-1 py-2 text-xs font-bold rounded ${promoSource === 'personal' ? 'bg-black text-white' : 'bg-zinc-200 text-black'}`}
                                        >
                                            Personal Funds<br/>
                                            <span className="text-[10px] opacity-80">${formatNumber(activeArtistData.money)}</span>
                                        </button>
                                        <button 
                                            onClick={() => setPromoSource('label')} 
                                            disabled={!activeArtistData.contract}
                                            className={`flex-1 py-2 text-xs font-bold rounded disabled:opacity-50 ${promoSource === 'label' ? 'bg-black text-white' : 'bg-zinc-200 text-black'}`}
                                        >
                                            Label Budget<br/>
                                            <span className="text-[10px] opacity-80">{activeArtistData.contract ? `$${formatNumber(activeArtistData.contract.marketingBudget)}` : 'N/A'}</span>
                                        </button>
                                    </div>
                                    <button 
                                        onClick={() => handlePromote(song.id, song._region === 'US' ? (song.radioFormat || 'pop') : (song.ukRadioFormat || 'pop'), song._region)} 
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-2 rounded shadow text-sm uppercase tracking-wide transition-colors"
                                    >
                                        Confirm Campaign
                                    </button>
                                    </>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                    {songsOnRadioCount === 0 && <p className="text-zinc-400 text-sm italic">No active radio campaigns.</p>}
                </div>

                <div>
                    <div className="flex justify-between items-center mb-4 pt-4 border-t border-zinc-200">
                        <h2 className="text-xl font-bold">Submit New Track</h2>
                        <select 
                            value={selectedRegion}
                            onChange={(e) => setSelectedRegion(e.target.value as 'US'|'UK')}
                            className="bg-zinc-800 text-white px-3 py-1 rounded border border-zinc-700"
                        >
                            <option value="US">US Radio</option>
                            <option value="UK">UK Radio</option>
                        </select>
                    </div>
                    {activeArtistData.songs.filter(s => !(selectedRegion === 'US' ? s.isOnRadio : s.isOnUkRadio) && s.isReleased && !s.remixOfSongId).map(song => (
                        <div key={song.id} className="bg-white p-3 rounded border border-zinc-300 mb-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                            <div className="flex items-center w-full gap-3">
                                <img src={song.coverArt} className="w-10 h-10 object-cover border border-zinc-200" />
                                <p className="font-bold text-sm truncate flex-1">{song.title}</p>
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <button onClick={() => handleSubmit(song.id, 'pop', selectedRegion)} className="bg-blue-600 flex-1 text-white text-[10px] sm:text-xs font-bold px-2 py-1.5 rounded uppercase whitespace-nowrap">Pop</button>
                                <button onClick={() => handleSubmit(song.id, 'urban', selectedRegion)} className="bg-orange-500 flex-1 text-white text-[10px] sm:text-xs font-bold px-2 py-1.5 rounded uppercase whitespace-nowrap">Urban</button>
                                <button onClick={() => handleSubmit(song.id, 'rhythmic', selectedRegion)} className="bg-purple-500 flex-1 text-white text-[10px] sm:text-xs font-bold px-2 py-1.5 rounded uppercase whitespace-nowrap">Rhythm</button>
                                <button onClick={() => handleSubmit(song.id, 'country', selectedRegion)} className="bg-green-600 flex-1 text-white text-[10px] sm:text-xs font-bold px-2 py-1.5 rounded uppercase whitespace-nowrap">Country</button>
                                {(gameState.date.week > 40 || gameState.date.week < 2) && (
                                    <button onClick={() => handleSubmit(song.id, 'christmas', selectedRegion)} className="bg-red-600 flex-1 text-white text-[10px] sm:text-xs font-bold px-2 py-1.5 rounded uppercase whitespace-nowrap">Holiday</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderCharts = () => {
        let title = "ALL RADIO";
        let chartData = gameState.radioOverallChart || [];
        if (selectedChart === 'pop') { title = "POP RADIO"; chartData = gameState.radioPopChart || []; }
        if (selectedChart === 'urban') { title = "URBAN AC & HIP HOP"; chartData = gameState.radioUrbanChart || []; }
        if (selectedChart === 'rhythmic') { title = "RHYTHMIC"; chartData = gameState.radioRhythmicChart || []; }
        if (selectedChart === 'country') { title = "COUNTRY"; chartData = gameState.radioCountryChart || []; }
        if (selectedChart === 'christmas') { title = "HOLIDAY / CHRISTMAS"; chartData = gameState.radioChristmasChart || []; }

        const isInChristmasSeason = gameState.date.week > 40 || gameState.date.week < 2;

        return (
            <div className="p-0">
                <div className="flex overflow-x-auto p-4 gap-2 border-b border-zinc-200 bg-white items-center hide-scrollbar">
                    {['overall', 'pop', 'urban', 'rhythmic', 'country', isInChristmasSeason ? 'christmas' : null].filter(Boolean).map(c => (
                        <button key={c} onClick={() => setSelectedChart(c as any)} 
                                className={`px-3 py-1.5 whitespace-nowrap rounded font-bold text-xs uppercase ${selectedChart === c ? 'bg-black text-white' : 'bg-transparent text-zinc-500 border border-zinc-300'}`}>
                            {c}
                        </button>
                    ))}
                </div>
                <div className="p-4 bg-[#f8f9fa] min-h-[50vh]">
                    <h2 className="font-black text-xl mb-4 italic tracking-tight uppercase flex items-center justify-between">
                        <span>{title}</span>
                        <span className="text-red-600 text-xs text-right pr-2">MEDIABASE</span>
                    </h2>
                    {chartData.map((entry, idx) => (
                        <div key={idx} className="flex bg-white border border-zinc-200 mb-2 p-2 items-center">
                            <div className="w-8 text-center font-black text-zinc-800">{idx + 1}</div>
                            <img src={entry.coverArt} className="w-12 h-12 object-cover border border-zinc-100 mx-3" />
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-sm truncate">{entry.title}</p>
                                <p className="text-xs text-zinc-500 truncate">{entry.artist}</p>
                            </div>
                            <div className="text-right text-xs">
                                <p className="font-mono font-bold text-zinc-800">{formatNumber(entry.radioPlays || 0)}</p>
                                <p className="text-[9px] text-zinc-400">PLAYS TW</p>
                            </div>
                        </div>
                    ))}
                    {chartData.length === 0 && <p className="text-center text-zinc-500 py-10">Chart currently building...</p>}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white h-full overflow-y-auto font-sans pb-24 text-black">
            <header className="bg-black text-white p-4 sticky top-0 z-10 flex items-center justify-between">
                <button onClick={() => dispatch({type: 'CHANGE_VIEW', payload: 'game'})} className="font-bold text-sm">&larr; BACK</button>
                <div className="font-black italic tracking-widest text-lg ml-auto mr-auto pl-4">HITS</div>
            </header>

            <div className="flex border-b-2 border-black sticky top-14 bg-white z-10">
                <button 
                    onClick={() => setSelectedTab('manage')} 
                    className={`flex-1 py-3 text-sm font-black uppercase tracking-wider ${selectedTab === 'manage' ? 'border-b-4 border-black text-black' : 'text-zinc-400 border-b-4 border-transparent'}`}
                >
                    Manage
                </button>
                <button 
                    onClick={() => setSelectedTab('charts')} 
                    className={`flex-1 py-3 text-sm font-black uppercase tracking-wider ${selectedTab === 'charts' ? 'border-b-4 border-black text-black' : 'text-zinc-400 border-b-4 border-transparent'}`}
                >
                    Building Charts
                </button>
            </div>

            {selectedTab === 'manage' ? renderManage() : renderCharts()}
        </div>
    );
};

export default RadioDashView;
