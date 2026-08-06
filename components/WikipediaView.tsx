
import React, { useState, useEffect, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { LABELS } from '../constants';
import { GoogleGenAI } from '@google/genai';
import { Release, GameDate, Song } from '../types';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

const getAI = () => {
    const key = process.env.API_KEY;
    if (!key) throw new Error("API key not configured");
    return new GoogleGenAI({ apiKey: key });
};

const formatGameDate = (gameDate: GameDate) => {
    const date = new Date(gameDate.year, 0, (gameDate.week - 1) * 7 + 1);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

const WikipediaView: React.FC = () => {
    const { gameState, dispatch, activeArtistData, allPlayerArtists } = useGame();
    const { selectedReleaseId } = gameState;
    
    const [summary, setSummary] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { releases, songs, videos } = activeArtistData!;
    const release = useMemo(() => releases.find(r => r.id === selectedReleaseId), [releases, selectedReleaseId]);

    useEffect(() => {
        const generateSummary = async () => {
            if (!release || release.wikipediaSummary) return;

            setIsLoading(true);
            try {
                const artist = allPlayerArtists.find(a => a.id === release.artistId);
                if (!artist) throw new Error("Artist not found");

                const releaseSongs = release.songIds.map(id => songs.find(s => s.id === id)).filter((s): s is Song => !!s);
                
                const features = new Set<string>();
                const featureRegex = /\(feat\. (.*?)\)/i;
                const songList = releaseSongs.map(s => {
                    const match = s.title.match(featureRegex);
                    if (match && match[1]) {
                        features.add(match[1]);
                    }
                    return s.title;
                }).join(', ');
                
                const singles = songs
                    .filter(s => s.isPreReleaseSingle && release.songIds.includes(s.id))
                    .map(s => {
                        const singleRelease = releases.find(r => r.type === 'Single' && r.songIds.length === 1 && r.songIds[0] === s.id);
                        return singleRelease ? { title: s.title, releaseDate: singleRelease.releaseDate } : null;
                    })
                    .filter((s): s is { title: string; releaseDate: GameDate } => !!s)
                    .sort((a,b) => (a.releaseDate.year * 52 + a.releaseDate.week) - (b.releaseDate.year * 52 + b.releaseDate.week));
                
                let singlesInfo = '';
                if (singles.length > 0) {
                    singlesInfo = `The following songs were released as pre-release singles:\n` + singles.map(s => `- "${s.title}" released on ${formatGameDate(s.releaseDate)}`).join('\n');
                     if (singles.length > 1) {
                        const toTotalWeeks = (d: GameDate) => d.year * 52 + d.week;
                        const gaps = [];
                        for(let i=1; i < singles.length; i++) {
                            gaps.push(toTotalWeeks(singles[i].releaseDate) - toTotalWeeks(singles[i-1].releaseDate));
                        }
                        const avgGap = gaps.reduce((sum, g) => sum + g, 0) / gaps.length;
                        if (avgGap <= 3) {
                            singlesInfo += `\nThe singles were released in quick succession.`;
                        } else if (avgGap > 8) {
                            singlesInfo += `\nThe singles were spread out over several months.`;
                        }
                    }
                }
                
                const promos: string[] = [];
                const geniusVideo = videos.find(v => v.type === 'Genius Verified' && release.songIds.includes(v.songId));
                if (geniusVideo) {
                    promos.push(`- A Genius 'Verified' interview for "${songs.find(s=>s.id === geniusVideo.songId)?.title}".`);
                }
                const fallonVideo = videos.find(v => v.title.includes('Fallon') && release.songIds.includes(v.songId));
                 if (fallonVideo) {
                    promos.push(`- A live performance of "${songs.find(s=>s.id === fallonVideo.songId)?.title}" on The Tonight Show Starring Jimmy Fallon.`);
                }

                let labelInfo = release.releasingLabel ? `under ${release.releasingLabel.name}${release.releasingLabel.dealWithMajor ? ` via ${release.releasingLabel.dealWithMajor}` : ''}` : 'independently';
                if (release.rightsOwnerLabelId && release.rightsSoldPercent && release.rightsSoldPercent > 50) {
                    const ownerLabel = LABELS.find(l => l.id === release.rightsOwnerLabelId);
                    if (ownerLabel) {
                        labelInfo = `under ${ownerLabel.name}`;
                    }
                }

                const artistProjects = releases
                    .filter(r => r.artistId === release.artistId && (r.type === 'Album' || r.type === 'EP' || r.type === 'Album (Deluxe)' || r.type === 'Compilation' || r.type === 'Live Album'))
                    .sort((a,b) => (a.releaseDate.year * 52 + a.releaseDate.week) - (b.releaseDate.year * 52 + b.releaseDate.week));

                const projectIndex = artistProjects.findIndex(p => p.id === release.id);
                let projectNumberString = '';
                if (projectIndex === 0) {
                    projectNumberString = 'debut';
                } else if (projectIndex > 0) {
                    const numberWords = ['second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'];
                    projectNumberString = `${numberWords[projectIndex - 1] || `${projectIndex + 1}th`}`;
                    
                    const previousProject = artistProjects[projectIndex - 1];
                    const yearsBetween = release.releaseDate.year - previousProject.releaseDate.year;
                    if (yearsBetween >= 3) {
                        projectNumberString += `, marking a comeback after a ${yearsBetween}-year hiatus`;
                    }
                }
                projectNumberString += ` studio ${release.type.toLowerCase().replace(" (deluxe)", "")}`;

                const controversies: string[] = [];
                const fraudulentStreams = releaseSongs.reduce((sum, s) => sum + (s.removedStreams || 0), 0);
                if (fraudulentStreams > 1000000) {
                    controversies.push(`The release was accompanied by controversy when over ${Math.round(fraudulentStreams / 1e6)} million streams were identified as artificial and removed from platforms.`);
                }

                // Gather Awards
                const grammyPlays = activeArtistData?.grammyHistory || [];
                const amaPlays = activeArtistData?.amaHistory || [];
                const oscarPlays = activeArtistData?.oscarHistory || [];
                const goldenGlobePlays = activeArtistData?.goldenGlobeHistory || [];

                const relatedGrammys = grammyPlays.filter(g => g.itemId === release.id || release.songIds.includes(g.itemId));
                const relatedAmas = amaPlays.filter(a => a.itemId === release.id || release.songIds.includes(a.itemId));
                const relatedOscars = oscarPlays.filter(o => release.songIds.includes(o.itemId));
                const relatedGlobes = goldenGlobePlays.filter(g => g.itemId === release.id || release.songIds.includes(g.itemId));

                const wins: string[] = [];
                const noms: string[] = [];
                [...relatedGrammys, ...relatedAmas, ...relatedGlobes].forEach(award => {
                    const awardString = `${award.category} ${'year' in award ? `(${award.year})` : ''} for "${award.itemName}"`;
                    if (award.isWinner) wins.push(awardString);
                    else noms.push(awardString);
                });
                relatedOscars.forEach(award => {
                    const awardString = `Academy Award for ${award.category} ${'year' in award ? `(${award.year})` : ''} for "${award.itemName}"`;
                    if (award.isWinner) wins.push(awardString);
                    else noms.push(awardString);
                });

                // Gather Tours
                const relatedTours = (activeArtistData?.tours || []).filter(t => t.setlist.some(sId => release.songIds.includes(sId)));
                let tourInfo = '';
                if (relatedTours.length > 0) {
                    tourInfo = `The era was supported by the ${relatedTours.map(t => `${t.name} (grossing $${Math.round(t.totalRevenue).toLocaleString()})`).join(' and ')}.`;
                }

                // Gather Streaming Stats & Chart Stats
                const totalStreams = releaseSongs.reduce((sum, s) => sum + s.streams, 0);
                const albumChartRank = gameState.albumChartHistory[release.id];
                
                let statsInfo = `The ${release.type.toLowerCase()} has accumulated ${(totalStreams / 1e9).toFixed(2)} billion global streams. `;
                if (albumChartRank) {
                    statsInfo += `It peaked at number ${albumChartRank.peak} on the Billboard 200, charting for ${albumChartRank.weeksOnChart} weeks. `;
                }

                const chartSongs = releaseSongs.map(s => ({ title: s.title, chart: gameState.chartHistory[s.id] })).filter(s => s.chart);
                const top10Songs = chartSongs.filter(s => s.chart.peak <= 10).sort((a,b) => a.chart.peak - b.chart.peak);
                if (top10Songs.length > 0) {
                    statsInfo += `It spawned ${top10Songs.length} top-10 hits on the Hot 100, including ${top10Songs.map(s => `"${s.title}" (peaking at number ${s.chart.peak})`).join(', ')}. `;
                }

                let newSummary = '';
                if (gameState.offlineMode || !activeArtistData?.redMicPro?.unlocked) {
                    newSummary = `"${release.title}" is the ${projectNumberString} by ${artist.name}. Released on ${formatGameDate(release.releaseDate)} ${labelInfo}, the ${release.type.toLowerCase().replace(" (deluxe)", "")} contains ${releaseSongs.length} tracks. ${features.size > 0 ? `It features guest appearances by ${Array.from(features).join(', ')}.` : ''} ${singles.length > 0 ? `The release was supported by the singles ${singles.map(s => `"${s.title}"`).join(', ')}.` : ''}`;
                    if (statsInfo) newSummary += `\n\n${statsInfo}`;
                    if (tourInfo) newSummary += `\n\n${tourInfo}`;
                } else {
                    const prompt = `You are a music historian writing a Wikipedia article. Write a lead section for the ${release.type} "${release.title}" by artist "${artist.name}".
It is their ${projectNumberString}. It was released on ${formatGameDate(release.releaseDate)} ${labelInfo}.

The tracklist includes: ${songList}.
${singlesInfo ? `Info about singles:\n${singlesInfo}` : ''}
${promos.length > 0 ? `Promotional activities included:\n${promos.join('\n')}` : ''}
${features.size > 0 ? `It includes features from ${Array.from(features).join(', ')}.` : ''}
${statsInfo ? `Commercial Performance:\n${statsInfo}` : ''}
${wins.length > 0 ? `It won the following awards:\n- ${wins.join('\n- ')}` : ''}
${noms.length > 0 ? `It received nominations for:\n- ${noms.join('\n- ')}` : ''}
${tourInfo ? `Touring:\n${tourInfo}` : ''}
${controversies.length > 0 ? `Controversies during this era include:\n- ${controversies.join('\n- ')}` : ''}

Based on all this detailed information, write a comprehensive, neutral, and encyclopedic summary for the album's Wikipedia page lead section (3-4 concise paragraphs). Integrate all details, stats, awards, singles and tours naturally. Describe the era as a whole. Do not use markdown lists.`;

                    const aiClient = getAI();
                    const response = await aiClient.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
                    newSummary = response.text;
                }
                setSummary(newSummary);
                dispatch({ type: 'UPDATE_WIKIPEDIA_SUMMARY', payload: { releaseId: release.id, summary: newSummary }});

            } catch (error) {
                console.error("Failed to generate Wikipedia summary:", error);
                setSummary("Error generating summary. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        if (release && !release.wikipediaSummary) {
            generateSummary();
        } else if (release) {
            setSummary(release.wikipediaSummary || '');
        }
    }, [release, dispatch, allPlayerArtists, songs, videos, releases]);

    const artist = useMemo(() => release ? allPlayerArtists.find(a => a.id === release.artistId) : null, [release, allPlayerArtists]);

    const previousRelease = useMemo(() => {
        if (!release) return null;
        return releases
            .filter(r => r.artistId === release.artistId && (r.type === 'Album' || r.type === 'EP' || r.type === 'Album (Deluxe)' || r.type === 'Compilation' || r.type === 'Live Album'))
            .filter(r => (r.releaseDate.year * 52 + r.releaseDate.week) < (release.releaseDate.year * 52 + release.releaseDate.week))
            .sort((a,b) => (b.releaseDate.year * 52 + b.releaseDate.week) - (a.releaseDate.year * 52 + a.releaseDate.week))[0];
    }, [releases, release]);

    const singlesList = useMemo(() => {
        if (!release) return [];
        return songs
            .filter(s => s.isPreReleaseSingle && release.songIds.includes(s.id))
            .map(s => {
                const singleRelease = releases.find(r => r.type === 'Single' && r.songIds.length === 1 && r.songIds[0] === s.id);
                return { title: s.title, releaseDate: singleRelease?.releaseDate };
            })
            .filter((s): s is { title: string; releaseDate: GameDate } => !!s.releaseDate);
    }, [songs, releases, release]);

    if (!release || !artist) return <div className="bg-white text-black h-full overflow-y-auto p-4">Loading article...</div>;

    return (
        <div className="bg-white text-black h-full w-full overflow-y-auto pb-24 font-sans">
            <header className="p-4 border-b border-zinc-200 sticky top-0 bg-white z-10">
                 <button onClick={() => dispatch({type: 'CHANGE_VIEW', payload: 'catalog'})} className="flex items-center gap-2 text-blue-700 hover:underline">
                    <ArrowLeftIcon className="w-5 h-5" />
                    Back to Catalog
                </button>
            </header>
            <main className="max-w-4xl mx-auto p-4 flex flex-col md:flex-row-reverse gap-8">
                <div className="w-full md:w-[22em] flex-shrink-0 border border-zinc-300 bg-[#f8f9fa] p-2 text-sm self-start">
                    <h2 className="text-center font-bold text-lg mb-2">{release.title}</h2>
                    <img src={release.coverArt} alt={release.title} className="w-full aspect-square object-cover border border-zinc-300" />
                    <table className="w-full my-2 infobox-table">
                        <tbody>
                            <tr>
                                <th className="text-left py-1 pr-2">Studio album by</th>
                                <td className="py-1"><a href="#" className="text-blue-700 hover:underline">{artist.name}</a></td>
                            </tr>
                            <tr>
                                <th className="text-left py-1 pr-2">Released</th>
                                <td className="py-1">{formatGameDate(release.releaseDate)}</td>
                            </tr>
                        </tbody>
                    </table>
                    
                    {singlesList.length > 0 && (
                        <>
                        <div className="bg-[#eaf3ff] text-center font-bold py-1">Singles from <em>{release.title}</em></div>
                        <ol className="list-decimal list-inside p-2 space-y-2">
                            {singlesList.map(s => (
                                <li key={s.title}>
                                    "{s.title}"<br/>
                                    <small className="text-zinc-700">Released: {formatGameDate(s.releaseDate)}</small>
                                </li>
                            ))}
                        </ol>
                        </>
                    )}

                    <div className="bg-[#eaf3ff] text-center font-bold py-1 mt-2">{artist.name} chronology</div>
                    <table className="w-full text-center mt-2 text-xs">
                        <tbody>
                            <tr>
                                <td className="w-1/3 p-1 align-top">
                                    {previousRelease && <><em>{previousRelease.title}</em><br/>({previousRelease.releaseDate.year})</>}
                                </td>
                                <td className="w-1/3 p-1 align-top">
                                    <strong><em>{release.title}</em><br/>({release.releaseDate.year})</strong>
                                </td>
                                <td className="w-1/3 p-1 align-top">
                                    {/* Next album placeholder */}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="w-full">
                    <h1 className="text-3xl font-serif border-b border-zinc-300 pb-2 mb-4">{release.title}</h1>
                    <div className="leading-relaxed space-y-4 text-black">
                        {isLoading ? (
                            <div className="animate-pulse space-y-3">
                                <div className="h-4 bg-zinc-200 rounded w-full"></div>
                                <div className="h-4 bg-zinc-200 rounded w-5/6"></div>
                                <div className="h-4 bg-zinc-200 rounded w-3/4"></div>
                            </div>
                        ) : (
                            summary.split('\n').map((paragraph, i) => <p key={i}>{paragraph}</p>)
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default WikipediaView;
