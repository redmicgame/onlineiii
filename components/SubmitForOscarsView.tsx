import React, { useState, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { Song, OscarAward } from '../types';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

type CategoryName = OscarAward['category'];

const SubmitForOscarsView: React.FC = () => {
    const { gameState, dispatch, activeArtist, activeArtistData } = useGame();
    const { date } = gameState;

    const [songSelection, setSongSelection] = useState<string>('');
    const [leadingSelection, setLeadingSelection] = useState<string>('');
    const [supportingSelection, setSupportingSelection] = useState<string>('');
    const [voiceSelection, setVoiceSelection] = useState<string>('');

    if (!activeArtistData || !activeArtist) return null;

    const eligibleSongs = useMemo(() => {
        const previousYearReleases = activeArtistData.releases.filter(r => r.releaseDate?.year === date.year - 1);
        const songIdsFromPreviousYear = new Set(previousYearReleases.flatMap(r => r.songIds || []));
        const previousYearReleaseIds = new Set(previousYearReleases.map(r => r.id));
        const prevYearSongs = activeArtistData.songs.filter(s => 
            s.soundtrackTitle && (
                (s.releaseId && previousYearReleaseIds.has(s.releaseId)) ||
                songIdsFromPreviousYear.has(s.id)
            )
        );
        if (prevYearSongs.length > 0) return prevYearSongs;
        return activeArtistData.songs.filter(s => s.soundtrackTitle);
    }, [activeArtistData.releases, activeArtistData.songs, date.year]);
    
    const eligibleActingRoles = useMemo(() => {
        const roles = activeArtistData.actingRoles || [];
        const lastYearRoles = roles.filter(r => 
            (r.year === date.year - 1 || !r.year) && 
            (r.status === 'Released' || r.status === 'Completed')
        );
        if (lastYearRoles.length > 0) return lastYearRoles;
        return roles.filter(r => r.status === 'Released' || r.status === 'Completed');
    }, [activeArtistData.actingRoles, date.year]);
    
    const eligibleLeading = useMemo(() => {
        const leading = eligibleActingRoles.filter(r => r.type !== 'Voice Acting' && r.roleType !== 'Supporting Role');
        return leading.length > 0 ? leading : eligibleActingRoles.filter(r => r.type !== 'Voice Acting');
    }, [eligibleActingRoles]);

    const eligibleSupporting = useMemo(() => {
        const supporting = eligibleActingRoles.filter(r => r.type !== 'Voice Acting' && r.roleType !== 'Leading Role');
        return supporting.length > 0 ? supporting : eligibleActingRoles.filter(r => r.type !== 'Voice Acting');
    }, [eligibleActingRoles]);

    const eligibleVoice = useMemo(() => {
        const voice = eligibleActingRoles.filter(r => r.type === 'Voice Acting');
        return voice.length > 0 ? voice : eligibleActingRoles;
    }, [eligibleActingRoles]);

    const handleSubmit = () => {
        const submissions: any[] = [];
        if (songSelection) {
            const song = activeArtistData.songs.find(s => s.id === songSelection);
            if (song) submissions.push({ artistId: activeArtist.id, category: 'Best Original Song' as CategoryName, itemId: song.id, itemName: song.title });
        }
        if (leadingSelection) {
            const role = (activeArtistData.actingRoles || []).find(r => r.id === leadingSelection);
            if (role) submissions.push({ artistId: activeArtist.id, category: 'Best Actor/Actress' as CategoryName, itemId: role.id, itemName: role.title });
        }
        if (supportingSelection) {
            const role = (activeArtistData.actingRoles || []).find(r => r.id === supportingSelection);
            if (role) submissions.push({ artistId: activeArtist.id, category: 'Best Supporting Actor/Actress' as CategoryName, itemId: role.id, itemName: role.title });
        }
        if (voiceSelection) {
            const role = (activeArtistData.actingRoles || []).find(r => r.id === voiceSelection);
            if (role) submissions.push({ artistId: activeArtist.id, category: 'Best Voice Actor/Actress' as CategoryName, itemId: role.id, itemName: role.title });
        }
        
        if (submissions.length === 0) return;
        
        const emailId = activeArtistData.inbox.find(e => e.offer?.type === 'oscarSubmission' && !e.offer.isSubmitted)?.id || '';
        dispatch({ type: 'SUBMIT_FOR_OSCARS', payload: { submissions, emailId } });
    };

    const hasAnySelection = !!songSelection || !!leadingSelection || !!supportingSelection || !!voiceSelection;

    return (
         <div className="h-full w-full bg-zinc-900 flex flex-col">
            <header className="p-4 flex items-center gap-4 sticky top-0 bg-zinc-900/80 backdrop-blur-sm z-10 border-b border-zinc-700/50">
                <button onClick={() => dispatch({type: 'CHANGE_VIEW', payload: 'inbox'})} className="p-2 rounded-full hover:bg-white/10">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold">Oscar Submissions</h1>
            </header>
            
            <main className="flex-grow p-4 space-y-6 overflow-y-auto">
                <div>
                    <label htmlFor="best-original-song" className="block text-lg font-bold text-[#d4af37]">Best Original Song</label>
                    <p className="text-sm text-zinc-400 mb-2">Only songs written for a film soundtrack are eligible.</p>
                    {eligibleSongs.length === 0 ? (
                        <div className="mt-1 text-sm text-zinc-500 bg-zinc-800 p-3 rounded-md">No eligible soundtrack songs from the previous year.</div>
                    ) : (
                        <select 
                            id="best-original-song"
                            value={songSelection}
                            onChange={e => setSongSelection(e.target.value)}
                            className="mt-1 block w-full bg-zinc-700 border-zinc-600 rounded-md shadow-sm focus:ring-[#d4af37] focus:border-[#d4af37] sm:text-sm h-12 px-3 text-white"
                        >
                            <option value="">-- Select a song --</option>
                            {eligibleSongs.map(opt => <option key={opt.id} value={opt.id}>{opt.title}</option>)}
                        </select>
                    )}
                </div>
                
                <div>
                    <label htmlFor="best-leading" className="block text-lg font-bold text-[#d4af37]">Best Actor/Actress</label>
                    <p className="text-sm text-zinc-400 mb-2">Submit your leading roles in Movies and TV Shows.</p>
                    {eligibleLeading.length === 0 ? (
                        <div className="mt-1 text-sm text-zinc-500 bg-zinc-800 p-3 rounded-md">No eligible leading roles from the previous year.</div>
                    ) : (
                        <select 
                            id="best-leading"
                            value={leadingSelection}
                            onChange={e => setLeadingSelection(e.target.value)}
                            className="mt-1 block w-full bg-zinc-700 border-zinc-600 rounded-md shadow-sm focus:ring-[#d4af37] focus:border-[#d4af37] sm:text-sm h-12 px-3 text-white"
                        >
                            <option value="">-- Select a leading role --</option>
                            {eligibleLeading.map(opt => <option key={opt.id} value={opt.id}>{opt.title} ({opt.type})</option>)}
                        </select>
                    )}
                </div>
                
                <div>
                    <label htmlFor="best-supporting" className="block text-lg font-bold text-[#d4af37]">Best Supporting Actor/Actress</label>
                    <p className="text-sm text-zinc-400 mb-2">Submit your supporting roles in Movies and TV Shows.</p>
                    {eligibleSupporting.length === 0 ? (
                        <div className="mt-1 text-sm text-zinc-500 bg-zinc-800 p-3 rounded-md">No eligible supporting roles from the previous year.</div>
                    ) : (
                        <select 
                            id="best-supporting"
                            value={supportingSelection}
                            onChange={e => setSupportingSelection(e.target.value)}
                            className="mt-1 block w-full bg-zinc-700 border-zinc-600 rounded-md shadow-sm focus:ring-[#d4af37] focus:border-[#d4af37] sm:text-sm h-12 px-3 text-white"
                        >
                            <option value="">-- Select a supporting role --</option>
                            {eligibleSupporting.map(opt => <option key={opt.id} value={opt.id}>{opt.title} ({opt.type})</option>)}
                        </select>
                    )}
                </div>
                <div>
                    <label htmlFor="best-voice" className="block text-lg font-bold text-[#d4af37]">Best Voice Actor/Actress</label>
                    <p className="text-sm text-zinc-400 mb-2">Submit your Voice Acting roles.</p>
                    {eligibleVoice.length === 0 ? (
                        <div className="mt-1 text-sm text-zinc-500 bg-zinc-800 p-3 rounded-md">No eligible voice acting roles from the previous year.</div>
                    ) : (
                        <select 
                            id="best-voice"
                            value={voiceSelection}
                            onChange={e => setVoiceSelection(e.target.value)}
                            className="mt-1 block w-full bg-zinc-700 border-zinc-600 rounded-md shadow-sm focus:ring-[#d4af37] focus:border-[#d4af37] sm:text-sm h-12 px-3 text-white"
                        >
                            <option value="">-- Select a voice acting role --</option>
                            {eligibleVoice.map(opt => <option key={opt.id} value={opt.id}>{opt.title} ({opt.type})</option>)}
                        </select>
                    )}
                </div>
            </main>

            <div className="p-4 border-t border-zinc-700/50">
                <button onClick={handleSubmit} disabled={!hasAnySelection} className="w-full h-12 bg-[#d4af37] hover:bg-[#c4a132] text-black font-bold py-2 px-4 rounded-lg transition-colors shadow-lg shadow-[#d4af37]/20 disabled:bg-zinc-600 disabled:text-zinc-400">
                    Submit to The Academy
                </button>
            </div>
        </div>
    );
};

export default SubmitForOscarsView;
