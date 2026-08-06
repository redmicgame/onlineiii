import { NPC_ARTIST_IMAGES } from "../constants";
import React, { useMemo } from 'react';
import { useGame, formatNumber, formatDuration } from '../context/GameContext';
import { getEraConfiguration } from '../utils/eraUtils';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';
import ChartBarIcon from './icons/ChartBarIcon';
import type { Song, ChartEntry } from '../types';
import { LABELS } from '../constants';

export const ChartPredictionsView: React.FC = () => {
    const { gameState, dispatch, activeArtistData, allPlayerArtists } = useGame();
    
    // Simulate real-time prediction
    const predictions = useMemo(() => {
        const entries: ChartEntry[] = [];
        
        let allContenders: {
            title: string;
            artist: string;
            weeklyStreams: number;
            coverArt: string;
            isPlayerSong: boolean;
            uniqueId: string;
        }[] = [];

        // Players songs
        for (const artistId in gameState.artistsData) {
            const aData = gameState.artistsData[artistId];
            const artist = allPlayerArtists.find(a => a.id === artistId);

            aData.songs.filter(s => s.isReleased && !s.remixOfSongId && !s.isTakenDown).forEach(song => {
                let totalWeeklyStreams = song.lastWeekStreams || 0;
                
                // Add estimated streams from active purchased playlists
                if (song.purchasedPlaylists && gameState.spotifyPlaylists) {
                    song.purchasedPlaylists.forEach(purchased => {
                        if (purchased.weeksRemaining > 0) {
                            const playlist = gameState.spotifyPlaylists!.find(p => p.id === purchased.playlistId);
                            if (playlist) {
                                let percentage = 0.001;
                                const position = purchased.position;
                                if (position === 1) percentage = 0.0735;
                                else if (position === 2) percentage = 0.0588;
                                else if (position === 3) percentage = 0.0529;
                                else if (position === 4) percentage = 0.0441;
                                else if (position === 5) percentage = 0.0382;
                                else if (position === 6) percentage = 0.0323;
                                else if (position === 7) percentage = 0.0294;
                                else if (position === 8) percentage = 0.0264;
                                else if (position === 9) percentage = 0.0235;
                                else if (position === 10) percentage = 0.0205;
                                else {
                                    const baseMin = 0.0205;
                                    const baseMax = 0.0352;
                                    const decay = Math.pow(0.95, position - 10);
                                    percentage = ((baseMin + baseMax) / 2) * decay;
                                }
                                totalWeeklyStreams += Math.floor(playlist.followers * percentage);
                            }
                        }
                    });
                }

                const remixes = aData.songs.filter(r => r.isReleased && r.remixOfSongId === song.id && !r.isTakenDown);
                remixes.forEach(remix => {
                    totalWeeklyStreams += remix.lastWeekStreams || 0;
                });

                if (totalWeeklyStreams === 0) {
                    // New release estimation
                    const baseStreams = Math.max(1000, Math.floor(Math.pow(aData.popularity || 0, 3) * 0.5));
                    let hypeMultiplier = 1 + (aData.hype / 100);
                    let labelMultiplier = aData.contract ? 1.5 : 1.0;
                    totalWeeklyStreams = Math.floor(baseStreams * hypeMultiplier * labelMultiplier * 1.5);
                }

                allContenders.push({
                    title: song.title,
                    artist: artist?.name || song.npcArtistName || 'Unknown',
                    weeklyStreams: totalWeeklyStreams, // This represents base engagement
                    coverArt: song.coverArt,
                    isPlayerSong: true,
                    uniqueId: song.id,
                });
            });
        }

        // NPCs
        gameState.npcs.forEach(npc => {
            const peak = gameState.chartHistory[npc.uniqueId]?.peak || 100;
            const weeks = gameState.chartHistory[npc.uniqueId]?.weeksOnChart || 0;
            let expectedWeeksSincePeak = npc.weeksSincePeak || 0;
            if (peak <= 20) expectedWeeksSincePeak += 1;
            
            let pop = npc.basePopularity;
            if (expectedWeeksSincePeak > 4 && weeks > 20) {
                pop = pop * 0.90;
            }
            if (weeks > 52) pop = pop * 0.70;

            const weeklyStreams = Math.floor(pop * 1.0); // 1.0 is expected value of Math.random()*0.4 + 0.8
            allContenders.push({
                title: npc.title,
                artist: npc.artist,
                weeklyStreams: weeklyStreams,
                coverArt: npc.coverArt,
                isPlayerSong: false,
                uniqueId: npc.uniqueId,
            });
        });

        // Formulate points
        allContenders.sort((a, b) => b.weeklyStreams - a.weeklyStreams);
        
        const hot100Contenders = allContenders.map((song, index) => {
            const hash = song.uniqueId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const divisor = 750 + (hash % 250);
            let boost = 1;
            let additionalItunesSales = 0;
            let additionalPhysicalSales = 0;
            let currentRadioPlays = 0;
            const eraConfigTemp = getEraConfiguration(gameState.date.year);

            const maxPlaysForRank = Math.max(0, Math.floor(15000 * Math.pow(0.95, index)));

            if (song.isPlayerSong) {
                for (const artistId in gameState.artistsData) {
                    const aData = gameState.artistsData[artistId];
                    const s = aData.songs.find(x => x.id === song.uniqueId);
                    if (s) {
                        const currentWeek = gameState.date.year * 52 + gameState.date.week;
                        const pushWeek = aData.lastPushToItunesWeek;
                        if (aData.lastPushedSongId === song.uniqueId && pushWeek && currentWeek - pushWeek <= 1) {
                            boost = 7.5; // Prediction avg for 5 + Math.random() * 5
                        }
                        
                        if (s.itunesPrice === '$0.69') boost *= 2.5;
                        else if (s.itunesPrice === '$0.99') boost *= 1.5;
                        else if (s.itunesPrice === '$1.29') boost *= 0.9;
                        
                        if (s.itunesVersions) {
                            s.itunesVersions.forEach(iv => {
                                const verBoost = boost * 1.05; // prediction avg
                                let vSales = Math.floor((song.weeklyStreams / divisor) * verBoost * 0.8);
                                if (vSales === 0 && song.weeklyStreams > 1000) vSales = 35; // prediction avg
                                additionalItunesSales += vSales;
                            });
                        }

                        // Add merch physical sales
                        const songMerch = aData.merch.filter(m => {
                            if (m.releaseId) {
                                const release = aData.releases.find(r => r.id === m.releaseId);
                                return release?.type === 'Single' && release.songIds.includes(song.uniqueId);
                            }
                            return false;
                        });
                        additionalPhysicalSales = songMerch.reduce((sum, item) => sum + (item._actualWeeklySales || 0), 0);

                        // Match radio logic perfectly
                        if (s.isOnRadio) {
                            let labelBoost = 1.0;
                            const contract = aData.contract;
                            if (contract) {
                                if (contract.isCustom) {
                                    const customLabel = gameState.customLabels?.find(l => l.id === contract.labelId);
                                    if (customLabel) labelBoost = Math.max(labelBoost, customLabel.promotionMultiplier || 1);
                                } else {
                                    const majorLabel = LABELS.find(l => l.id === contract.labelId);
                                    if (majorLabel) labelBoost = majorLabel.promotionMultiplier || 1;
                                    else labelBoost = 1.3; // avg
                                }
                            }
                            
                            const rFormat = s.radioFormat || 'pop';
                            const qualityBoost = (s.quality || 50) + (aData.popularity || 0);
                            
                            const isFormatCompatible = (genre: string, format: string) => {
                                const g = (genre || "").toLowerCase();
                                const f = (format || "").toLowerCase();
                                if (f === 'pop') {
                                    if (g.includes('hip hop') || g.includes('rap')) return 0.2;
                                    if (g.includes('country')) return 0.05;
                                    if (g.includes('hip hop') || g.includes('r&b') || g.includes('rap') || g.includes('pop') || g.includes('dance') || g.includes('k-pop') || g.includes('kpop') || g.includes('electronic')) return 1.0;
                                    return 0.1;
                                }
                                if (f === 'country') {
                                    if (g.includes('country')) return 1.0;
                                    return 0.05;
                                }
                                if (f === 'christmas') {
                                    if (g.includes('holiday') || g.includes('christmas')) return 1.0;
                                    return 0.01;
                                }
                                return 1.0; // fallback
                            };

                            const formatMultiplier = isFormatCompatible(s.genre || 'pop', rFormat);
                            const radioEraBoost = gameState.date.year < 2010 ? (gameState.date.year < 2000 ? 5.0 : 3.0) : 1.0;
                            
                            const previousPlays = s.radioPlays || 0;
                            const baseGrowth = 300 * (qualityBoost / 50) * labelBoost * formatMultiplier * radioEraBoost;
                            let targetPlays = previousPlays === 0 ? baseGrowth : previousPlays + baseGrowth;
                            
                            targetPlays += song.weeklyStreams * 0.0005; 
                            
                            const maxNaturalPlays = 25000 * formatMultiplier * radioEraBoost;
                            if (targetPlays > maxNaturalPlays) targetPlays = maxNaturalPlays;
                            
                            let dropLimit = -500;
                            if (previousPlays > targetPlays * 1.5) {
                                dropLimit = -Math.floor(previousPlays * 0.1); 
                            }

                            let rPlays = previousPlays + Math.max(dropLimit, Math.floor((targetPlays - previousPlays) * 0.2));
                            
                            let promoSpins = 0;
                            if (s.pendingRadioPromoSpins) {
                                promoSpins = s.pendingRadioPromoSpins;
                                rPlays += promoSpins;
                            }

                            if (rPlays < 0) rPlays = 0;

                            currentRadioPlays = rPlays;
                        }

                        break;
                    }
                }
            } else {
                const baseRadio = Math.floor(song.weeklyStreams * 0.005);
                const prevRadio = gameState.billboardHot100.find(x => x.uniqueId === song.uniqueId)?.radioPlays || 0;
                let rPlays = prevRadio > 0 ? (prevRadio + Math.max(-1000, Math.floor((baseRadio - prevRadio) * 0.3))) : baseRadio;
                if (rPlays > maxPlaysForRank) rPlays = maxPlaysForRank;
                if (rPlays < 0) rPlays = 0;
                currentRadioPlays = rPlays;
            }

            const sales = Math.floor(song.weeklyStreams / divisor) * boost + additionalItunesSales;
            
            const hasStreamingRights = true; // simplifying prediction
            const effectiveStreamingShare = hasStreamingRights ? eraConfigTemp.marketShare.streaming : 0;
            
            const streamPoints = (song.weeklyStreams * effectiveStreamingShare) * 0.5;
            const digitalPoints = (sales * eraConfigTemp.marketShare.digital) * 150 * 0.2;
            const physicalPoints = (sales * eraConfigTemp.marketShare.physical + additionalPhysicalSales) * 150 * 0.2;
            
            // Approximate impressions based on plays
            const currentRadioImpressions = currentRadioPlays * 5000;
            const radioPoints = currentRadioImpressions * eraConfigTemp.marketShare.radio * 0.25;
            
            const points = streamPoints + digitalPoints + physicalPoints + radioPoints;
            
            return {
                ...song,
                points: Math.floor(points),
                pointsDiff: 0, // removed arbitrary noise for 'high accuracy'
                sales: sales + additionalPhysicalSales,
                radioPlays: currentRadioPlays,
            };
        });

        hot100Contenders.sort((a, b) => b.points - a.points);
        return hot100Contenders.slice(0, 60);
    }, [gameState.artistsData, gameState.npcs, allPlayerArtists]);

    if (!activeArtistData) return null;

    if (!activeArtistData.chartPredictionsSubscription) {
        return (
            <div className="h-full w-full bg-zinc-900 text-white flex flex-col items-center justify-center p-8">
                <header className="absolute top-0 left-0 w-full p-4 flex items-center gap-4">
                    <button onClick={() => dispatch({type: 'CHANGE_VIEW', payload: 'catalog'})} className="p-2 rounded-full hover:bg-white/10">
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-bold">Talk of the Charts</h1>
                </header>
                <div className="bg-fuchsia-900/30 p-8 rounded-xl border border-fuchsia-500/50 max-w-sm text-center">
                    <ChartBarIcon className="w-16 h-16 text-fuchsia-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2 text-fuchsia-200">Early Hot 100 Predictions</h2>
                    <p className="text-zinc-300 mb-6 text-sm">Subscribe to see early predictions of the Hot 100 top 60, updating dynamically based on current trajectory.</p>
                    <button 
                        onClick={() => dispatch({ type: 'SUBSCRIBE_CHART_PREDICTIONS', payload: { cost: 1000 } })}
                        className="w-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold py-3 rounded-xl transition-colors"
                    >
                        Subscribe for $1,000 / week
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full w-full bg-gradient-to-b from-[#d99aff] via-fuchsia-200 to-indigo-600 overflow-y-auto text-black">
            <header className="p-4 flex items-center gap-4 sticky top-0 bg-white/20 backdrop-blur-md z-10 border-b border-white/20">
                <button onClick={() => dispatch({type: 'CHANGE_VIEW', payload: 'catalog'})} className="p-2 rounded-full hover:bg-black/10">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-2">
                    <div className="bg-black text-fuchsia-400 rounded-full w-6 h-6 flex items-center justify-center -rotate-90">
                        <ArrowLeftIcon className="w-4 h-4" />
                    </div>
                    <h1 className="text-xl font-bold text-black tracking-tight">@talkofthecharts</h1>
                </div>
            </header>
            
            <div className="p-4 space-y-6 max-w-4xl mx-auto pb-20">
                <div className="text-center mt-2 mb-6">
                    <h2 className="text-3xl font-black tracking-tight drop-shadow-md">Early Hot 100 Predictions</h2>
                    <p className="text-base font-medium opacity-80 uppercase mt-1">Week {gameState.date.week}, {gameState.date.year} chart</p>
                </div>

                <div className="bg-white/95 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-3xl border border-white/40">
                    <table className="w-full text-sm text-left font-medium p-2 block sm:table overflow-x-auto">
                        <thead className="text-xs uppercase tracking-wider text-black border-b-2 border-black">
                            <tr>
                                <th className="py-3 px-2 text-center w-8">Rank</th>
                                <th className="py-3 px-2 text-center w-10">+/-</th>
                                <th className="py-3 px-2 text-left">Song</th>
                                <th className="py-3 px-2 text-right">Sales</th>
                                <th className="py-3 px-2 text-right">Streams</th>
                                <th className="py-3 px-2 text-right">Radio</th>
                            </tr>
                        </thead>
                        <tbody>
                            {predictions.map((p, i) => {
                                const rank = i + 1;
                                const lastRank = gameState.billboardHot100.find(entry => entry.uniqueId === p.uniqueId)?.rank || null;
                                let diffStr: React.ReactNode = <span className="text-black font-bold">=</span>;
                                let diffColor = 'bg-transparent';
                                if (lastRank === null) {
                                    diffStr = <span className="text-zinc-500 font-bold">NEW</span>;
                                    diffColor = 'bg-zinc-100/50';
                                } else if (rank < lastRank) {
                                    const jump = lastRank - rank;
                                    diffStr = <span className="text-green-600 font-bold">+{jump}</span>;
                                    if (jump >= 20) diffColor = 'bg-green-400/50';
                                    else if (jump >= 10) diffColor = 'bg-green-300/40';
                                    else diffColor = 'bg-green-200/30';
                                } else if (rank > lastRank) {
                                    const drop = rank - lastRank;
                                    diffStr = <span className="text-red-500 font-bold">-{drop}</span>;
                                    if (drop >= 20) diffColor = 'bg-red-400/50';
                                    else if (drop >= 10) diffColor = 'bg-red-300/40';
                                    else diffColor = 'bg-red-200/30';
                                }

                                return (
                                    <tr key={p.uniqueId} className={`border-b border-zinc-200/50 ${diffColor}`}>
                                        <td className="py-2 px-2 text-center font-bold text-zinc-900">{rank}</td>
                                        <td className="py-2 px-2 text-center text-xs">{diffStr}</td>
                                        <td className="py-2 px-2">
                                            <div className="flex items-center gap-3">
                                                <img src={p.coverArt} className="w-10 h-10 object-cover shadow-sm grayscale-[0.2]" />
                                                <div className="flex flex-col">
                                                    <span className="font-extrabold text-black leading-tight truncate max-w-[140px] sm:max-w-[200px]">{p.title}</span>
                                                    <span className="text-xs text-zinc-600">{p.artist}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-2 px-2 text-right font-semibold text-zinc-800 bg-yellow-100/40">{formatNumber(Math.floor(p.sales))}</td>
                                        <td className="py-2 px-2 text-right font-semibold text-zinc-800 bg-green-100/40">{formatNumber(Math.floor(p.weeklyStreams))}</td>
                                        <td className="py-2 px-2 text-right font-semibold text-zinc-800 bg-blue-100/40">{formatNumber(Math.floor(p.radioPlays))}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <div className="p-4 text-center text-white bg-[#8651c6] font-bold tracking-widest uppercase text-xs">
                        Top 60 available to subscribers
                    </div>
                </div>
            </div>
        </div>
    );
};
