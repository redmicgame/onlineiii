
import React, { useState, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { LABELS } from '../constants';
import { Release, SoundtrackAlbum } from '../types';
import ChevronLeftIcon from './icons/ChevronLeftIcon';

const getIndependentLabelName = (id: string) => {
    const hash = Array.from(id).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const dkNumber = (hash * 1234567 % 9000000) + 1000000;
    return `${Math.abs(dkNumber)} Records DK`;
};

const ReleaseItem: React.FC<{ release: Release, large?: boolean, onClick: () => void }> = ({ release, large = false, onClick }) => {
    const { activeArtistData } = useGame();
    const size = large ? 'w-24 h-24' : 'w-16 h-16';
    const titleSize = large ? 'text-xl' : 'text-lg';

    let labelName = getIndependentLabelName(release.id);
    if (release.rightsOwnerLabelId && release.rightsSoldPercent && release.rightsSoldPercent > 50) {
        const ownerLabel = LABELS.find(l => l.id === release.rightsOwnerLabelId);
        if (ownerLabel) labelName = ownerLabel.name;
    } else if (release.releasingLabel) {
        labelName = release.releasingLabel.name;
    }

    const featureSong = activeArtistData?.songs.find(s => release.songIds.includes(s.id) && s.isFeatureToNpc);
    const isFeature = release.type !== 'Live Album' && (release.isFeatureToNpc || !!featureSong);
    const featureArtistName = release.npcArtistName || featureSong?.npcArtistName;

    const subText = isFeature 
        ? `${release.type.replace(" (Deluxe)", "")} • ${featureArtistName}`
        : `${release.releaseDate.year} • ${labelName}`;

    return (
        <button onClick={onClick} className="w-full text-left flex items-center gap-4 group cursor-pointer">
            <img src={release.coverArt} alt={release.title} className={`${size} rounded-md object-cover`} />
            <div>
                <p className={`font-bold text-white ${titleSize}`}>{release.title}</p>
                <p className="text-sm text-zinc-400">{subText}</p>
            </div>
        </button>
    );
};

const CompilationItem: React.FC<{ compilation: SoundtrackAlbum, large?: boolean, onClick: () => void }> = ({ compilation, large = false, onClick }) => {
    const size = large ? 'w-24 h-24' : 'w-16 h-16';
    const titleSize = large ? 'text-xl' : 'text-lg';

    return (
        <button onClick={onClick} className="w-full text-left flex items-center gap-4 group cursor-pointer">
            <img src={compilation.coverArt} alt={compilation.title} className={`${size} rounded-md object-cover`} />
            <div>
                <p className={`font-bold text-white ${titleSize}`}>{compilation.title}</p>
                <p className="text-sm text-zinc-400">{compilation.releaseDate.year} • Compilation</p>
            </div>
        </button>
    );
};


const SpotifyDiscographyView: React.FC<{ onBack: () => void; onSelectRelease: (releaseId: string) => void; onSelectCompilation: (compilationId: string) => void; }> = ({ onBack, onSelectRelease, onSelectCompilation }) => {
    const { gameState, activeArtistData } = useGame();
    const { soundtrackAlbums } = gameState;
    const [filter, setFilter] = useState<'Albums' | 'Singles and EPs' | 'Compilations' | 'Featured'>('Albums');

    if (!activeArtistData) return null;
    const { releases } = activeArtistData;

    const sortedReleases = useMemo(() => {
        return [...releases]
            .filter(r => !r.soundtrackInfo && r.songIds.some(id => activeArtistData.songs.find(s => s.id === id)?.isAvailableOnStreaming === true))
            .sort((a, b) => (b.releaseDate.year * 52 + b.releaseDate.week) - (a.releaseDate.year * 52 + a.releaseDate.week));
    }, [releases, activeArtistData.songs]);

    const latestRelease = sortedReleases.length > 0 ? sortedReleases[0] : null;

    const filteredReleases = useMemo(() => {
        const isFeature = (r: Release) => r.type !== 'Live Album' && (r.isFeatureToNpc || r.songIds.some(id => activeArtistData?.songs.find(s => s.id === id)?.isFeatureToNpc));
        
        if (filter === 'Albums') {
            return sortedReleases.filter(r => (r.type === 'Album' || r.type === 'Album (Deluxe)' || r.type === 'Compilation' || r.type === 'Live Album') && !isFeature(r));
        }
        if (filter === 'Singles and EPs') {
            return sortedReleases.filter(r => (r.type === 'Single' || r.type === 'EP') && !isFeature(r));
        }
        if (filter === 'Featured') {
            const playerFeatureReleases: Release[] = [];
            const activeArtist = gameState.soloArtist?.id === gameState.activeArtistId 
                ? gameState.soloArtist 
                : gameState.group?.id === gameState.activeArtistId 
                    ? gameState.group
                    : gameState.extraPlayableArtists?.find(a => a.id === gameState.activeArtistId)
                        || gameState.group?.members.find(m => m.id === gameState.activeArtistId);

            if (activeArtist) {
                Object.entries(gameState.artistsData).forEach(([artistId, data]) => {
                    if (artistId === activeArtist.id) return;
                    data.releases.forEach(r => {
                        if (!r.isTakenDown && !r.soundtrackInfo) {
                            const hasFeature = r.songIds.some(songId => {
                                const song = data.songs.find(s => s.id === songId);
                                return song?.collaboration?.artistName === activeArtist.name || (song?.features && song.features.includes(activeArtist.name));
                            });
                            if (hasFeature && !playerFeatureReleases.find(existing => existing.id === r.id)) {
                                playerFeatureReleases.push(r);
                            }
                        }
                    });
                });
            }
            const mockFeatureReleases = activeArtistData.songs
                .filter(s => s.isFeatureToNpc && !s.releaseId)
                .map(s => ({
                    id: 'mock_rel_' + s.id,
                    title: s.title,
                    type: 'Single' as const,
                    coverArt: s.coverArt,
                    releaseDate: s.releaseDate || {year: 0, week: 0},
                    songIds: [s.id],
                    isFeatureToNpc: true,
                    npcArtistName: s.npcArtistName,
                    totalStreams: s.streams,
                    lastWeekStreams: s.lastWeekStreams,
                    marketingBudget: 0,
                    marketingSpent: 0,
                    artistId: s.artistId,
                    labelId: undefined
                }));
            const allFeatures = [...sortedReleases.filter(r => isFeature(r)), ...playerFeatureReleases, ...mockFeatureReleases];
            return allFeatures.sort((a, b) => (b.releaseDate.year * 52 + b.releaseDate.week) - (a.releaseDate.year * 52 + a.releaseDate.week));
        }
        // Placeholder for other filters
        return [];
    }, [sortedReleases, filter, activeArtistData?.songs, gameState.activeArtistId, gameState.artistsData, gameState.soloArtist, gameState.group, gameState.extraPlayableArtists]);
    
    const mainList = useMemo(() => {
        const list = filteredReleases;
        // If the latest release would be the first item in the filtered list, slice it out so it's not duplicated
        if (latestRelease && list.length > 0 && list[0].id === latestRelease.id) {
            return list.slice(1);
        }
        return list;
    }, [filteredReleases, latestRelease]);
    
    const filterButtons: Array<'Albums' | 'Singles and EPs' | 'Compilations' | 'Featured'> = ['Albums', 'Singles and EPs', 'Compilations', 'Featured'];

    return (
        <div className="bg-black text-white h-full overflow-y-auto pb-24">
            <header className="sticky top-0 bg-black z-10 p-4 flex items-center gap-6">
                <button 
                    onClick={onBack} 
                    className="p-1"
                    aria-label="Go back"
                >
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-lg font-bold">Releases</h1>
            </header>

            <div className="px-4 pb-4">
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {filterButtons.map(btn => (
                        <button 
                            key={btn}
                            onClick={() => {
                                if (btn === 'Albums' || btn === 'Singles and EPs' || btn === 'Compilations' || btn === 'Featured') {
                                    setFilter(btn)
                                }
                            }}
                            className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                                filter === btn ? 'bg-white text-black' : 'bg-[#2a2a2a] hover:bg-[#3f3f3f]'
                            }`}
                        >
                            {btn}
                        </button>
                    ))}
                </div>
            </div>

            <main className="p-4 space-y-8">
                {filter !== 'Compilations' && latestRelease && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold">Latest release</h2>
                        <ReleaseItem release={latestRelease} large onClick={() => onSelectRelease(latestRelease.id)} />
                    </div>
                )}
                
                {filter !== 'Compilations' && filteredReleases.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold">{filter}</h2>
                        {mainList.length > 0 ? (
                             <div className="space-y-5">
                                {mainList.map(release => (
                                    <ReleaseItem key={release.id} release={release} onClick={() => onSelectRelease(release.id)} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-zinc-400 text-sm">No other {filter.toLowerCase()} to display.</p>
                        )}
                    </div>
                )}
                
                {filter === 'Compilations' && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold">Compilations</h2>
                        {soundtrackAlbums.length > 0 ? (
                            <div className="space-y-5">
                                {soundtrackAlbums.map(compilation => (
                                    <CompilationItem key={compilation.id} compilation={compilation} onClick={() => onSelectCompilation(compilation.id)} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-zinc-400 text-sm">You haven't appeared on any compilations yet.</p>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default SpotifyDiscographyView;
