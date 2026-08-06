import React, { useState } from 'react';
import { useGame, formatNumber } from '../context/GameContext';
import { ChartEntry, GameDate } from '../types';
import ArrowUpIcon from './icons/ArrowUpIcon';
import ArrowDownIcon from './icons/ArrowDownIcon';

const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>;
const InfoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>;
const ShareIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>;
const StarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="black" stroke="black" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const PlusIcon = ({ expanded }: { expanded: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${expanded ? 'rotate-45' : ''}`}>
        <circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/>
    </svg>
);
const RightArrowIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;


const ChartEntryItem: React.FC<{ entry: any, isAlbumChart?: boolean }> = ({ entry, isAlbumChart }) => {
    const { rank, lastWeek, peak, weeksOnChart, title, artist, coverArt } = entry;
    const isPlayerItem = isAlbumChart ? entry.isPlayerAlbum : entry.isPlayerSong;
    const weeklyStreams = isAlbumChart ? entry.weeklyActivity : (entry.weeklyStreams || 0);
    const [expanded, setExpanded] = useState(false);
    const { gameState } = useGame();
    
    const renderMovement = () => {
        const isNewEntry = lastWeek === null && weeksOnChart === 1;

        if (isNewEntry) {
            return (
                <div className="bg-[#12FF80] text-black text-[10px] font-black px-1 py-0.5 rounded-sm tracking-wider mt-1 w-full text-center">
                    NEW
                </div>
            );
        }

        if (lastWeek === null) {
            return <div className="mt-1"><RightArrowIcon /></div>;
        }
        if (rank < lastWeek) {
            return <div className="mt-1"><ArrowUpIcon className="w-5 h-5 text-black" /></div>;
        }
        if (rank > lastWeek) {
            return <div className="mt-1"><ArrowDownIcon className="w-5 h-5 text-black" /></div>;
        }
        return <div className="mt-1"><RightArrowIcon /></div>;
    };

    let boost = 1;
    if (entry.isPlayerSong && entry.songId) {
        for (const artistId in gameState.artistsData) {
            const aData = gameState.artistsData[artistId];
            const song = aData.songs.find(s => s.id === entry.songId);
            if (song) {
                const pushWeek = aData.lastPushToItunesWeek;
                const currentWeek = gameState.date.year * 52 + gameState.date.week;
                if (aData.lastPushedSongId === entry.songId && pushWeek && currentWeek - pushWeek <= 1) {
                    boost = 5 + Math.random() * 5;
                }
                break;
            }
        }
    }
    const hash = (entry.uniqueId || entry.albumId || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const divisor = 750 + (hash % 250);
    const digitalSales = isAlbumChart ? (entry.weeklySales || 0) : Math.floor(weeklyStreams / divisor) * boost;

    return (
        <div className="w-full relative bg-[#f4f4f4] mb-2 shadow-sm rounded-sm overflow-hidden flex flex-col transition-all">
            <div 
                className={`w-full flex items-center p-3 gap-3 bg-white cursor-pointer relative z-10`}
                onClick={() => setExpanded(!expanded)}
            >
                <div className="w-12 flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-black">{rank}</span>
                    {renderMovement()}
                </div>
                
                <img src={coverArt} alt={title} className="w-[84px] h-[84px] object-cover bg-zinc-200 border border-zinc-100 flex-shrink-0" />
                
                <div className="flex-grow flex flex-col justify-center min-w-0 pr-2">
                    <h3 className={`text-xl font-black mt-1 leading-tight truncate ${isPlayerItem ? 'text-red-600' : 'text-black'}`}>{title}</h3>
                    <p className="text-[15px] text-zinc-800 truncate mb-1">{artist}</p>
                    
                    <div className="flex items-center text-[10px] text-zinc-500 font-semibold tracking-wider gap-3">
                        <span>LW <span className="text-zinc-800">{lastWeek ?? '-'}</span></span>
                        <span>PEAK <span className="text-zinc-800">{peak}</span></span>
                        <span>WEEKS <span className="text-zinc-800">{weeksOnChart}</span></span>
                    </div>
                </div>

                <div className="flex flex-col h-full gap-4 items-center justify-between flex-shrink-0">
                    <button className="text-zinc-400 hover:text-black mt-1 p-1">
                        <PlusIcon expanded={expanded} />
                    </button>
                    {isPlayerItem && (
                        <div className="mb-1"><StarIcon /></div>
                    )}
                </div>
            </div>

            <div className={`overflow-hidden transition-all duration-300 ease-in-out bg-[#f4f4f4] ${expanded ? 'max-h-40 opacity-100 py-3' : 'max-h-0 opacity-0'}`}>
                {isAlbumChart ? (
                    <div className="flex px-4 items-center justify-around">
                        <div className="text-center">
                            <p className="text-[10px] font-bold text-zinc-400 tracking-wider">PURE SALES</p>
                            <p className="text-lg font-black text-black">{entry.weeklyPureSales || entry.weeklySales > 0 ? formatNumber(Math.floor(entry.weeklyPureSales || entry.weeklySales)) : '0'}</p>
                        </div>
                        {gameState.date.year >= 2008 && (
                            <>
                                <div className="w-px h-8 bg-zinc-300"></div>
                                <div className="text-center">
                                    <p className="text-[10px] font-bold text-zinc-400 tracking-wider">STREAMING EQUIVALENT (SES)</p>
                                    <p className="text-lg font-black text-black">{formatNumber(entry.weeklySES || 0)}</p>
                                </div>
                            </>
                        )}
                        <div className="w-px h-8 bg-zinc-300"></div>
                        <div className="text-center">
                            <p className="text-[10px] font-bold text-zinc-400 tracking-wider">TOTAL SPS</p>
                            <p className="text-lg font-black text-black">{formatNumber(entry.weeklyActivity || 0)}</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex px-4 items-center justify-around">
                        <div className="text-center">
                            <p className="text-[10px] font-bold text-zinc-400 tracking-wider">SALES</p>
                            <p className="text-lg font-black text-black">{digitalSales > 0 ? formatNumber(Math.floor(digitalSales)) : 'N/A'}</p>
                        </div>
                        <div className="w-px h-8 bg-zinc-300"></div>
                        <div className="text-center">
                            <p className="text-[10px] font-bold text-zinc-400 tracking-wider">AIRPLAY</p>
                            <p className="text-lg font-black text-black">{entry.radioImpressions ? formatNumber(Math.floor(entry.radioImpressions)) : 'N/A'}</p>
                        </div>
                        {gameState.date.year >= 2008 && (
                            <>
                                <div className="w-px h-8 bg-zinc-300"></div>
                                <div className="text-center">
                                    <p className="text-[10px] font-bold text-zinc-400 tracking-wider">STREAMS</p>
                                    <p className="text-lg font-black text-black">{formatNumber(weeklyStreams || 0)}</p>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

type SubChart = 'hot100' | 'bubblingUnder' | 'topAlbums' | 'hotPop' | 'hotRap' | 'electronic' | 'country' | 'spotify';

const BillboardView: React.FC = () => {
    const { gameState, dispatch } = useGame();
    const { billboardHot100, billboardBubblingUnder25, billboardTopAlbums, hotPopSongs, hotRapRnb, electronicChart, countryChart, spotifyGlobal = [], date } = gameState;
    const [selectedChart, setSelectedChart] = useState<SubChart>('hot100');
    const [showSelector, setShowSelector] = useState(false);

    const getWeekDate = (d: GameDate) => {
        const dateObj = new Date(d.year, 0, (d.week - 1) * 7 + 1);
        const month = dateObj.toLocaleString('en-US', { month: 'long' });
        const day = dateObj.getDate();
        return `${month} ${day}, ${d.year}`;
    }

    const chartsData: Record<SubChart, { title: string, data: ChartEntry[], isAlbum?: boolean }> = {
        hot100: { title: 'BILLBOARD HOT 100™', data: billboardHot100 },
        bubblingUnder: { title: 'BUBBLING UNDER HOT 100™', data: billboardBubblingUnder25 || [] },
        topAlbums: { title: 'BILLBOARD 200™', data: billboardTopAlbums as any, isAlbum: true },
        hotPop: { title: 'HOT POP SONGS™', data: hotPopSongs },
        hotRap: { title: 'HOT RAP & R&B SONGS™', data: hotRapRnb },
        electronic: { title: 'HOT DANCE/ELECTRONIC SONGS™', data: electronicChart },
        country: { title: 'HOT COUNTRY SONGS™', data: countryChart },
        spotify: { title: 'SPOTIFY GLOBAL 50', data: spotifyGlobal },
    };

    const currentChart = chartsData[selectedChart];

    return (
        <div className="bg-[#e4e4e4] h-full font-sans relative pb-24 text-black overflow-y-auto">
            <header className="bg-white">
                <div className="flex items-center justify-between p-4 border-b-4 border-black relative">
                    <button 
                        onClick={() => {
                            dispatch({type: 'CHANGE_TAB', payload: 'Charts'});
                            dispatch({type: 'CHANGE_VIEW', payload: 'game'});
                        }}
                        className="text-black p-1 hover:bg-zinc-100 rounded flex gap-1 items-center font-bold text-xs"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                        BACK
                    </button>
                    <h1 className="text-4xl font-extrabold tracking-tighter absolute left-1/2 -translate-x-1/2" style={{ fontFamily: 'Impact, sans-serif' }}>
                        billboard
                    </h1>
                    <button className="text-black p-1 hover:bg-zinc-100 rounded">
                        <SearchIcon />
                    </button>
                </div>
                <div className="bg-black w-full py-2 px-4 flex justify-end relative">
                    <button 
                        onClick={() => setShowSelector(!showSelector)}
                        className="text-[#12FF80] uppercase font-bold text-xs border border-[#12FF80] px-3 py-1 tracking-wider hover:bg-[#12FF80]/10"
                    >
                        ALL CHARTS
                    </button>
                    
                    {showSelector && (
                        <div className="absolute top-10 right-4 bg-white shadow-2xl border border-zinc-200 z-50 flex flex-col min-w-[240px]">
                            {Object.entries(chartsData).map(([key, info]) => (
                                <button 
                                    key={key} 
                                    onClick={() => { setSelectedChart(key as SubChart); setShowSelector(false); }}
                                    className={`px-4 py-3 text-left border-b border-zinc-100 uppercase tracking-widest text-xs font-bold hover:bg-zinc-50 ${selectedChart === key ? 'text-[#12FF80] bg-black hover:bg-black' : 'text-black'}`}
                                >
                                    {info.title.replace('™', '')}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <div className="bg-[#fcfcfc] w-full text-center py-6 border-b border-zinc-200 shadow-sm relative overflow-hidden">
                    <h2 className="text-[32px] sm:text-5xl font-black tracking-tighter text-black" style={{ fontFamily: 'Impact, sans-serif'}}>{currentChart.title}</h2>
                    <p className="text-xs font-bold tracking-widest text-black mt-2">WEEK OF {getWeekDate(date).toUpperCase()}</p>
                </div>
                <div className="bg-[#12FF80] w-full py-2 flex justify-center gap-12 border-b border-black">
                    <button className="hover:scale-110 transition-transform"><CalendarIcon /></button>
                    <button className="hover:scale-110 transition-transform"><InfoIcon /></button>
                    <button className="hover:scale-110 transition-transform"><ShareIcon /></button>
                </div>
            </header>
            
            <main className="mx-auto max-w-3xl pt-2 px-2 relative z-0">
                {currentChart.data.length > 0 ? (
                    currentChart.data.map(entry => (
                        <ChartEntryItem key={entry.uniqueId} entry={entry} isAlbumChart={currentChart.isAlbum} />
                    ))
                ) : (
                    <div className="text-center py-20 text-zinc-500 bg-white rounded-md mt-4 shadow-sm border border-gray-200">
                        <p className="font-bold text-black text-xl">Chart is empty</p>
                        <p className="text-sm mt-2 font-medium">Release music and wait for the week to pass.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default BillboardView;