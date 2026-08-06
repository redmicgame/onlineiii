import React, { useState } from 'react';
import { useGame, formatNumber } from '../context/GameContext';
import SearchIcon from './icons/SearchIcon';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';
import { Artist, Group } from '../types';
import VogueSiteView from './VogueSiteView';
import RedditSiteView from './RedditSiteView';
import BillboardSiteView from './BillboardSiteView';

export const GoogleView: React.FC = () => {
    const { gameState, activeArtistData, dispatch } = useGame();
    const [query, setQuery] = useState('');
    const [activeQuery, setActiveQuery] = useState('');
    const [expandedPaa, setExpandedPaa] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<'All' | 'Images' | 'News'>('All');
    const [readingArticle, setReadingArticle] = useState<{title: string, url: string, content: string, type?: 'wikipedia' | 'tmz' | 'generic' | 'reddit' | 'vogue' | 'rollingstone' | 'popcrave' | 'news', extraData?: any} | null>(null);

    const allPlayerArtistsAndGroups: (Artist | Group)[] = [
        ...(gameState.soloArtist ? [gameState.soloArtist] : []),
        ...(gameState.extraPlayableArtists || []),
        ...(gameState.group ? [gameState.group, ...gameState.group.members] : [])
    ];
    const artistProfile = allPlayerArtistsAndGroups.find(a => a.id === gameState.activeArtistId);

    if (!activeArtistData || !artistProfile) return null;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        setActiveQuery(query.trim());
        setExpandedPaa(null);
    };

    const lowerQuery = activeQuery.toLowerCase();
    const isMatchArtist = lowerQuery === artistProfile.name.toLowerCase();
    const isMatchTour = (lowerQuery.includes('tour') || lowerQuery.includes('tours')) && lowerQuery.includes(artistProfile.name.toLowerCase()) || lowerQuery === 'tour';
    const isMatchNetWorth = lowerQuery.includes('net worth') && lowerQuery.includes(artistProfile.name.toLowerCase());
    const isTmzQuery = lowerQuery.includes('tmz') || lowerQuery.includes('paparazzi');
    const isMatchTmzArtist = isTmzQuery && lowerQuery.includes(artistProfile.name.toLowerCase());
    const isMatchTmzGeneral = isTmzQuery && !isMatchTmzArtist;
    const isMatchBeef = (lowerQuery.includes('beef') || lowerQuery.includes('drama') || lowerQuery.includes('twitter') || lowerQuery.includes('x')) && lowerQuery.includes(artistProfile.name.toLowerCase());
    const isMatchDating = (lowerQuery.includes('dating') || lowerQuery.includes('boyfriend') || lowerQuery.includes('girlfriend') || lowerQuery.includes('relationships')) && lowerQuery.includes(artistProfile.name.toLowerCase());
    const isMatchUpcoming = (lowerQuery.includes('album countdown') || lowerQuery.includes('upcoming album') || lowerQuery.includes('new album') || lowerQuery.includes('upcoming release') || lowerQuery.includes('release')) && lowerQuery.includes(artistProfile.name.toLowerCase());
    const isMatchBillboard = lowerQuery.includes('billboard') && lowerQuery.includes(artistProfile.name.toLowerCase());
    const isMatchOnlyFans = (lowerQuery.includes('onlyfans') || lowerQuery.includes('of')) && lowerQuery.includes(artistProfile.name.toLowerCase());
    const isMatchCatalog = (lowerQuery.includes('catalog') || lowerQuery.includes('masters')) && lowerQuery.includes(artistProfile.name.toLowerCase());
    const isMatchAwards = (lowerQuery.includes('grammy') || lowerQuery.includes('award') || lowerQuery.includes('oscars') || lowerQuery.includes('amas') || lowerQuery.includes('vmas')) && lowerQuery.includes(artistProfile.name.toLowerCase());
    const isMatchCoachella = (lowerQuery.includes('coachella') || lowerQuery.includes('festival') || lowerQuery.includes('gigs')) && lowerQuery.includes(artistProfile.name.toLowerCase());
    const isMatchSpotifyCharts = (lowerQuery.includes('spotify chart') || lowerQuery.includes('spotify record') || lowerQuery.includes('spotify streams') || lowerQuery.includes('spotify')) && lowerQuery.includes(artistProfile.name.toLowerCase());
    const isMatchPayola = (lowerQuery.includes('payola') || lowerQuery.includes('buying streams') || lowerQuery.includes('scandal')) && lowerQuery.includes(artistProfile.name.toLowerCase());

    const isMatchWeather = lowerQuery.includes('weather');
    const isMatchCalc = lowerQuery.includes('calculator') || lowerQuery.includes('calc') || /^[0-9\s\+\-\*\/\(\)]+$/.test(lowerQuery);
    const isMatchStock = lowerQuery.includes('stock') || lowerQuery.includes('nasdaq') || lowerQuery.includes('nyse') || lowerQuery.includes('price');
    const isMatchTime = lowerQuery.includes('time') && lowerQuery.includes('in');
    const isMatchStopwatch = lowerQuery.includes('stopwatch') || lowerQuery.includes('timer');
    const isMatchDefine = lowerQuery.startsWith('define ') || lowerQuery.includes('meaning');
    const isMatchTranslate = lowerQuery.includes('translate');
    const isMatchFlights = lowerQuery.includes('flights') || lowerQuery.includes('tickets to');
    const isMatchCurrency = lowerQuery.includes('usd') || lowerQuery.includes('eur') || lowerQuery.includes('gbp') || lowerQuery.includes('currency') || lowerQuery.includes('to cad');
    const isMatchRecipe = lowerQuery.includes('recipe') || lowerQuery.includes('how to make');
    
    const isMatchBrandDeals = lowerQuery.includes('brand deal') || lowerQuery.includes('sponsor') || lowerQuery.includes('endorsement') || ['nike', 'gucci', 'calvin klein', 'pepsi', 'coca cola', 'apple', 'louis vuitton', 'mcdonalds'].some(b => lowerQuery.includes(b));
    const isMatchVideoGames = lowerQuery.includes('video game') || lowerQuery.includes('soundtrack') || ['gta 6', 'fortnite', 'fifa', 'nba 2k', 'cyberpunk', 'madden', 'call of duty', 'valorant'].some(g => lowerQuery.includes(g));

    const isMatchAnySpecial = isMatchArtist || isMatchTour || isMatchBrandDeals || isMatchVideoGames || isMatchNetWorth || isTmzQuery || isMatchBeef || isMatchDating || isMatchUpcoming || isMatchBillboard || isMatchOnlyFans || isMatchCatalog || isMatchAwards || isMatchCoachella || isMatchSpotifyCharts || isMatchPayola || isMatchWeather || isMatchCalc || isMatchStock || isMatchTime || isMatchStopwatch || isMatchDefine || isMatchTranslate || isMatchFlights || isMatchCurrency || isMatchRecipe;


    const popularSongs = (activeArtistData.songs || []).filter(s => s.isReleased && !s.remixOfSongId).sort((a, b) => (b.streams || 0) - (a.streams || 0)).slice(0, 3);

    const formatShortDate = (date?: { year: number, week: number }) => {
        if (!date) return 'Unknown';
        return `Week ${date.week}, ${date.year}`;
    };

    const estimatedNetWorth = Math.floor(activeArtistData.money + (activeArtistData.hype * 2000) + (activeArtistData.monthlyListeners * 1.5));

    const getPaaAnswer = (index: number) => {
        switch (index) {
            case 0:
                return `${artistProfile.name} rose to fame with their early releases, quickly gaining a massive following in the ${artistProfile.fandomName} fandom. Their unique style and consistent output have kept them relevant.`;
            case 1:
                if (popularSongs.length > 0) {
                    return `"${popularSongs[0].title}" is widely considered their biggest hit, reaching over ${formatNumber(popularSongs[0].streams)} streams globally and topping major charts.`;
                }
                return `${artistProfile.name} has several highly successful tracks, but definitive data on their absolute biggest hit is currently pending new chart updates.`;
            case 2:
                const hasTour = activeArtistData.tours && activeArtistData.tours.some(t => t.status === 'planning' || t.status === 'active');
                if (hasTour) {
                    const tourName = activeArtistData.tours.find(t => t.status === 'active' || t.status === 'planning')?.name;
                    return `Yes, ${artistProfile.name} is currently focused on their "${tourName}" tour, selling out arenas and stadiums around the world.`;
                }
                return `There are currently no official tour announcements for ${artistProfile.name}. Fans are eagerly awaiting news on future live dates.`;
            case 3:
                return `Details about ${artistProfile.name}'s extended family and personal relationships are kept mostly private to respect their boundaries.`;
            default:
                return '';
        }
    };

    if (readingArticle) {
        if (readingArticle.type === 'wikipedia') {
            return (
                <div className="bg-[#202124] text-black h-full overflow-y-auto font-sans relative pb-16">
                    <header className="p-4 border-b border-zinc-200 sticky top-0 bg-[#202124] z-10 w-full flex items-center justify-between">
                        <button onClick={() => setReadingArticle(null)} className="flex items-center gap-2 text-zinc-600 hover:text-black transition-colors">
                            <ArrowLeftIcon className="w-5 h-5" />
                        </button>
                        <div className="font-serif text-xl tracking-tight relative pr-4">
                            WIKIPEDIA<span className="text-xs absolute -right-0 top-0">®</span>
                        </div>
                    </header>
                    <main className="max-w-4xl mx-auto p-4 flex flex-col md:flex-row-reverse gap-8 mt-4">
                        <div className="w-full md:w-[22em] flex-shrink-0 border border-zinc-300 bg-[#f8f9fa] p-2 text-sm self-start">
                            <h2 className="text-center font-bold text-lg mb-2">{artistProfile.name}</h2>
                            {activeArtistData.artistImages && activeArtistData.artistImages.length > 0 ? (
                                <img src={activeArtistData.artistImages[0]} alt={artistProfile.name} className="w-full aspect-square object-cover border border-zinc-300" />
                            ) : (
                                <div className="w-full aspect-square border border-zinc-300 bg-zinc-700"></div>
                            )}
                            <table className="w-full my-2 infobox-table">
                                <tbody>
                                    <tr className="border-b border-zinc-200">
                                        <th className="text-left py-1 pr-2 align-top text-gray-200">Born</th>
                                        <td className="py-1 text-black">{artistProfile.age} years old</td>
                                    </tr>
                                    <tr className="border-b border-zinc-200">
                                        <th className="text-left py-1 pr-2 align-top text-gray-200">Occupations</th>
                                        <td className="py-1 text-black">Singer, songwriter, record producer</td>
                                    </tr>
                                    <tr>
                                        <th className="text-left py-1 pr-2 align-top text-gray-200">Labels</th>
                                        <td className="py-1 text-black">{readingArticle.extraData?.releasesLength > 0 ? 'Multiple' : 'Independent'}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="w-full">
                            <h1 className="text-3xl font-serif border-b border-zinc-300 pb-2 mb-4">{readingArticle.title}</h1>
                            <div className="leading-relaxed space-y-4 text-black text-[15px] max-w-[65ch]">
                                {readingArticle.content.split('\n').map((paragraph, i) => <p key={i}>{paragraph}</p>)}
                            </div>
                        </div>
                    </main>
                </div>
            );
        }

        if (readingArticle.type === 'tmz') {
            return (
                <div className="bg-black text-white h-full overflow-y-auto font-sans relative pb-16">
                    <header className="p-3 border-b-4 border-red-600 sticky top-0 bg-black z-10 w-full flex items-center justify-between shadow-2xl">
                        <button onClick={() => setReadingArticle(null)} className="p-2 text-white hover:text-red-500 transition-colors">
                            <ArrowLeftIcon className="w-6 h-6" />
                        </button>
                        <div className="font-black text-4xl tracking-tighter text-red-600 italic">TMZ</div>
                    </header>
                    <div className="max-w-2xl mx-auto p-4 sm:p-6 mt-4">
                        <div className="inline-block bg-red-600 text-white font-black px-3 py-1 text-sm uppercase tracking-widest mb-4 rotate-1">EXCLUSIVE</div>
                        <h1 className="text-4xl sm:text-5xl font-black text-white mb-6 uppercase leading-none tracking-tight">{readingArticle.title}</h1>
                        {activeArtistData.artistImages && activeArtistData.artistImages.length > 0 && (
                            <div className="w-full h-64 md:h-96 relative border-4 border-red-600 rotate-[-1deg] mb-6">
                                <img src={activeArtistData.artistImages[Math.floor(Math.random() * activeArtistData.artistImages.length)]} className="w-full h-full object-cover grayscale opacity-90 contrast-125" alt="Paparazzi shot" />
                                <div className="absolute inset-0 bg-red-600 mix-blend-color-burn opacity-20 pointer-events-none"></div>
                                <div className="absolute right-2 bottom-2 bg-black text-white font-black text-xs px-2 py-1 opacity-70">TMZ.COM</div>
                            </div>
                        )}
                        <div className="text-gray-200 whitespace-pre-wrap leading-relaxed text-xl font-medium tracking-wide">
                            {readingArticle.content}
                        </div>
                    </div>
                </div>
            );
        }

        if (readingArticle.type === 'vogue') {
            return <VogueSiteView initialArticle={readingArticle} onClose={() => setReadingArticle(null)} />;
        }

        if (readingArticle.type === 'rollingstone') {
            return (
                <div className="bg-[#202124] text-black h-full overflow-y-auto font-sans relative pb-16">
                    <header className="p-4 border-b-2 border-black sticky top-0 bg-[#202124] z-10 w-full flex items-center justify-between shadow-sm">
                        <button onClick={() => setReadingArticle(null)} className="p-2 text-red-600 hover:text-black transition-colors">
                            <ArrowLeftIcon className="w-6 h-6" />
                        </button>
                        <div className="font-serif font-black text-2xl md:text-3xl tracking-tighter text-red-600 uppercase mx-auto flex items-center flex-1 justify-center">
                            Rolling Stone
                        </div>
                        <div className="w-10"></div>
                    </header>
                    <main className="max-w-3xl mx-auto px-4 py-8">
                        <div className="flex gap-2 text-red-600 font-bold uppercase tracking-widest text-xs mb-4">
                            <span>Music</span> <span>•</span> <span>News</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6">{readingArticle.title}</h1>
                        <p className="font-bold text-gray-400 mb-6 uppercase tracking-wider text-sm border-b pb-4">By RS Staff</p>
                        
                        {activeArtistData.artistImages && activeArtistData.artistImages.length > 0 && (
                            <img src={activeArtistData.artistImages[0]} className="w-full aspect-[16/9] object-cover mb-8 shadow-sm" alt="Artist performance" />
                        )}
                        <div className="text-lg leading-relaxed text-gray-200 space-y-6">
                            {readingArticle.content.split('\n').filter(p => p.trim()).map((paragraph, i) => <p key={i}>{paragraph}</p>)}
                        </div>
                    </main>
                </div>
            );
        }

        if (readingArticle.type === 'reddit') {
            return <RedditSiteView initialPost={readingArticle} onClose={() => setReadingArticle(null)} />;
        }
        if (readingArticle.type === 'news') {
            return <BillboardSiteView initialArticle={readingArticle} onClose={() => setReadingArticle(null)} />;
        }

        if (readingArticle.type === 'popcrave') {
            return (
                <div className="bg-[#202124] text-black h-full overflow-y-auto font-sans relative pb-16">
                    <header className="px-4 py-3 border-b border-zinc-700 sticky top-0 bg-[#202124]/95 backdrop-blur z-10 w-full flex items-center shadow-sm">
                        <button onClick={() => setReadingArticle(null)} className="p-2 mr-4 text-black hover:bg-gray-100 rounded-full transition-colors">
                            <ArrowLeftIcon className="w-5 h-5" />
                        </button>
                        <div className="flex-1">
                            <div className="font-bold text-lg leading-tight tracking-tight">Pop Crave</div>
                            <div className="text-xs text-gray-400">12.5K posts</div>
                        </div>
                    </header>
                    <main className="max-w-xl mx-auto border-x border-zinc-700 h-full overflow-y-auto">
                        <div className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer">
                            <div className="flex gap-3">
                                <div className="w-12 h-12 bg-blue-600 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-xl uppercase italic">PC</div>
                                <div className="flex-1 pb-2">
                                    <div className="flex items-center gap-1 mb-1">
                                        <span className="font-bold text-[15px]">Pop Crave</span>
                                        <svg viewBox="0 0 24 24" aria-label="Verified account" role="img" className="w-[18px] h-[18px] fill-blue-500"><g><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.918-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.337 2.25c-.416-.165-.866-.25-1.336-.25-2.21 0-3.918 1.792-3.918 4 0 .495.084.965.238 1.4-1.273.65-2.148 2.02-2.148 3.6 0 1.46.74 2.748 1.87 3.407-.076.32-.122.65-.122.993 0 2.21 1.71 3.998 3.918 3.998.47 0 .92-.084 1.336-.25C9.182 21.585 10.49 22.5 12 22.5s2.816-.917 3.337-2.25c.416.165.866.25 1.336.25 2.21 0 3.918-1.792 3.918-4 0-.342-.046-.672-.122-.993 1.13-.659 1.87-1.947 1.87-3.407zm-10.5 4V12.75h1v3.75h-1zm.5-5a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z"></path></g></svg>
                                        <span className="text-gray-400">@PopCrave</span>
                                        <span className="text-gray-400">·</span>
                                        <span className="text-gray-400 hover:underline text-[#8ab4f8]">10m</span>
                                    </div>
                                    <div className="text-[15px] leading-snug mb-3 whitespace-pre-wrap">
                                        <span className="font-bold">{readingArticle.title}</span><br/><br/>
                                        {readingArticle.content}
                                    </div>
                                    {activeArtistData.artistImages && activeArtistData.artistImages.length > 0 && (
                                        <div className="mt-3 rounded-2xl overflow-hidden border border-zinc-700">
                                            <img src={activeArtistData.artistImages[0]} className="w-full aspect-[4/3] object-cover" alt="Post media" />
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center mt-3 text-gray-400 pr-8">
                                        <div className="flex items-center gap-2 hover:text-[#8ab4f8] group"><div className="p-2 rounded-full group-hover:bg-blue-50"><svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-current"><g><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.01-8.183-3.65-8.183-8.14zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.06h2.067v2.23l5.361-2.97c1.943-1.08 3.146-3.11 3.146-5.32C20.463 6.74 17.653 4 14.122 4h-4.366z"></path></g></svg></div> 2,143</div>
                                        <div className="flex items-center gap-2 hover:text-green-500 group"><div className="p-2 rounded-full group-hover:bg-green-50"><svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-current"><g><path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"></path></g></svg></div> 14.2K</div>
                                        <div className="flex items-center gap-2 hover:text-pink-500 group"><div className="p-2 rounded-full group-hover:bg-pink-50"><svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-current"><g><path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path></g></svg></div> 75.8K</div>
                                        <div className="flex items-center gap-2 hover:text-[#8ab4f8] group"><div className="p-2 rounded-full group-hover:bg-blue-50"><svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-current"><g><path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"></path></g></svg></div> 1.1M</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            );
        }

        return (
            <div className="bg-[#202124] text-gray-200 h-full overflow-y-auto flex flex-col font-sans relative pb-16">
                <header className="flex items-center p-3 border-b border-zinc-700 sticky top-0 bg-[#202124]/95 backdrop-blur z-10 w-full shadow-sm">
                    <button onClick={() => setReadingArticle(null)} className="p-2 mr-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeftIcon className="w-5 h-5 text-gray-200" />
                    </button>
                    <div className="text-sm font-medium text-gray-300 truncate flex-1 flex items-center bg-gray-100 py-1.5 px-3 rounded-full">
                        <svg className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" /></svg>
                        {readingArticle.url.replace(/^https?:\/\//, '')}
                    </div>
                </header>
                <main className="max-w-2xl mx-auto w-full xl:max-w-4xl p-4 sm:p-6 mt-2">
                    <div className="uppercase tracking-widest text-[10px] sm:text-xs font-bold text-gray-400 mb-4 flex items-center gap-2">
                        <span>Latest Update</span>
                        <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                        <span className="text-gray-400">Published Today</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-100 mb-6 leading-[1.15] tracking-tight">{readingArticle.title}</h1>
                    
                    <div className="flex items-center gap-3 mb-8 pb-8 border-b border-zinc-700">
                        <div className="w-10 h-10 bg-zinc-700 rounded-full flex items-center justify-center font-bold text-gray-400">
                            W
                        </div>
                        <div>
                            <div className="font-bold text-sm text-gray-100">Web Reporter</div>
                            <div className="text-xs text-gray-400">Contributing Writer</div>
                        </div>
                    </div>

                    {activeArtistData.artistImages && activeArtistData.artistImages.length > 0 && (
                        <figure className="mb-8 w-full">
                            <img src={activeArtistData.artistImages[0]} className="w-full h-auto aspect-video object-cover rounded-xl shadow-sm" alt="Article representative" />
                            <figcaption className="text-xs text-gray-400 mt-2 italic text-center">Images provided by official sources and press releases.</figcaption>
                        </figure>
                    )}

                    <div className="text-lg leading-relaxed text-gray-200 space-y-6 max-w-prose mx-auto">
                        {readingArticle.content.split('\n').filter(p => p.trim()).map((paragraph, i) => (
                            <p key={i}>{paragraph}</p>
                        ))}
                    </div>
                    
                    {/* Simulated Advertisement */}
                    <div className="my-12 p-4 border border-gray-100 bg-gray-50 rounded-xl relative overflow-hidden flex flex-col items-center justify-center text-center shadow-inner min-h-[250px]">
                        <div className="absolute top-2 right-3 text-[10px] text-gray-400 uppercase tracking-widest">Advertisement</div>
                        <div className="w-16 h-16 bg-blue-100 text-[#8ab4f8] rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <div className="font-bold text-xl mb-1 text-gray-100">Boost Your Profile</div>
                        <div className="text-gray-400 text-sm mb-4">Learn the industry secrets to massive chart success.</div>
                        <button className="px-6 py-2 bg-blue-600 text-white font-bold rounded-full text-sm">Learn More</button>
                    </div>

                </main>
            </div>
        );
    }

    return (
        <div className="bg-[#202124] text-gray-200 h-full overflow-y-auto flex flex-col font-sans relative pb-16">
            <header className="flex items-center p-3 border-b border-zinc-700 sticky top-0 bg-[#202124] z-10 w-full shadow-sm">
                <button onClick={() => dispatch({ type: 'CHANGE_VIEW', payload: 'game' })} className="p-2 mr-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeftIcon className="w-5 h-5 text-gray-400" />
                </button>
                <form onSubmit={handleSearch} className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2 shadow-inner border border-transparent focus-within:border-zinc-700 focus-within:bg-[#202124] focus-within:shadow-md transition-all">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search Google or type a URL"
                        className="bg-transparent outline-none flex-1 text-sm text-gray-200"
                    />
                    <button type="submit" className="ml-2 text-gray-400 hover:text-[#8ab4f8]">
                        <SearchIcon className="w-4 h-4" />
                    </button>
                </form>
            </header>

            {!activeQuery ? (
                <div className="flex-1 flex flex-col items-center justify-center p-6">
                    <div className="text-4xl font-bold mb-6 tracking-tighter">
                        <span className="text-[#8ab4f8]">G</span>
                        <span className="text-red-500">o</span>
                        <span className="text-yellow-500">o</span>
                        <span className="text-[#8ab4f8]">g</span>
                        <span className="text-green-500">l</span>
                        <span className="text-red-500">e</span>
                    </div>
                    <form onSubmit={handleSearch} className="w-full max-w-md bg-[#202124] border border-zinc-700 rounded-full px-4 py-3 flex items-center shadow-md hover:shadow-lg transition-shadow">
                        <SearchIcon className="w-5 h-5 text-gray-400 mr-3" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search Google"
                            className="flex-1 bg-transparent outline-none text-base"
                        />
                    </form>
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {/* Navigation Pills */}
                    <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                        {(['All', 'Images', 'News', 'Videos', 'Shopping'] as const).map((tab) => (
                            <button 
                                key={tab} 
                                onClick={() => setActiveTab(tab as any)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium border whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-blue-50 text-[#8ab4f8] border-blue-200' : 'bg-[#202124] text-gray-400 border-zinc-700 hover:bg-gray-50'}`}>
                                {tab}
                            </button>
                        ))}
                    </div>

                    {activeTab === 'Images' && (
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                            {(activeArtistData.artistImages || []).map((img, i) => (
                                <div key={i} className="rounded-lg overflow-hidden relative shadow-sm hover:shadow-md transition-shadow cursor-pointer aspect-square bg-gray-100 flex items-center justify-center">
                                    <img src={img} alt="Search result" className={`w-full h-full object-cover transition-all ${isMatchOnlyFans ? 'blur-xl scale-110' : ''}`} />
                                    {isMatchOnlyFans && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20">
                                            <span className="text-white font-black text-2xl border-4 border-white rounded-full w-14 h-14 flex items-center justify-center mb-1 drop-shadow-md">18+</span>
                                            <span className="text-white font-bold text-[10px] uppercase tracking-widest bg-black/50 px-2 py-0.5 rounded drop-shadow">Sensitive</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {/* Fill out some fake images if not enough */}
                            {Array.from({ length: Math.max(0, 12 - (activeArtistData.artistImages || []).length) }).map((_, i) => (
                                <div key={`empty-${i}`} className="rounded-lg overflow-hidden relative shadow-sm cursor-pointer aspect-square bg-gray-100 animate-pulse flex flex-col items-center justify-center border border-zinc-700">
                                    <SearchIcon className="w-8 h-8 text-gray-300 mb-2"/>
                                    <span className="text-gray-400 text-xs text-center px-2">Image result for "{activeQuery}"</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'News' && (
                        <div className="space-y-4">
                            <div className="border border-zinc-700 rounded-lg overflow-hidden shadow-sm bg-[#202124] p-4">
                                <p className="text-xs text-gray-400 mb-1 tracking-wider uppercase">Top Story</p>
                                <h3 className="text-xl font-medium text-[#8ab4f8] hover:underline text-[#8ab4f8] cursor-pointer mb-2" onClick={() => setReadingArticle({
                                    title: `${activeQuery} Breaks Internet With Latest Move`,
                                    url: 'https://www.variety.com/music/news/top-story',
                                    content: `The entire timeline is talking about ${activeQuery} right now.\n\nFollowing a series of highly analyzed moves, industry insiders suggest this might be part of a larger strategy. Millions of fans have flooded social media to share their thoughts.\n\n"We haven't seen anything like this in years," an expert reported.`,
                                    type: 'news'
                                })}>
                                    {activeQuery} Breaks Internet With Latest Move
                                </h3>
                                <p className="text-sm text-gray-400 mb-2">Fans are going wild after {activeQuery} was spotted making waves. Experts predict a huge impact on the charts.</p>
                                <div className="text-xs text-gray-400">2 hours ago</div>
                            </div>
                            <div className="border border-zinc-700 rounded-lg overflow-hidden shadow-sm bg-[#202124] p-4 flex gap-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-medium text-[#8ab4f8] hover:underline text-[#8ab4f8] cursor-pointer mb-1" onClick={() => setReadingArticle({title: `What's Next For ${activeQuery}?`, url: 'https://www.hollywoodreporter.com/news/music/speculation', content: `Rumors are swirling about upcoming announcements. Several insiders hint at a massive new project.`, type: 'news'})}>What's Next For {activeQuery}?</h3>
                                    <p className="text-sm text-gray-400 mb-2 line-clamp-2">Inside sources spill the details on what could be the biggest drop of the year.</p>
                                    <div className="text-xs text-gray-400">5 hours ago</div>
                                </div>
                            </div>
                            {isTmzQuery && (
                                <div className="border-l-4 border-red-600 rounded-lg overflow-hidden shadow-sm bg-gray-50 p-4 flex gap-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-black text-red-600 hover:underline text-[#8ab4f8] cursor-pointer mb-1" onClick={() => setReadingArticle({title: `EXCLUSIVE: The Truth About ${activeQuery}`, url: 'https://tmz.com/exclusive-truth', content: `TMZ has obtained exclusive footage that completely changes the narrative.\n\nThe drama is just beginning.`, type: 'tmz'})}>EXCLUSIVE: The Truth About {activeQuery}</h3>
                                        <p className="text-sm text-gray-200 font-medium mb-2 line-clamp-2">TMZ got the latest scoop on what's REALLY happening behind closed doors.</p>
                                        <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">TMZ • 10 mins ago</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'All' && isMatchArtist && (activeArtistData.publicImage ?? 80) <= 40 && (
                        <div className="border border-red-200 rounded-xl overflow-hidden shadow-sm bg-red-50 p-4 mb-4">
                            <h2 className="text-xl font-bold text-red-700 flex items-center gap-2 mb-2">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                Controversy
                            </h2>
                            <h3 className="text-lg font-bold text-red-900 hover:underline text-[#8ab4f8] cursor-pointer" onClick={() => setReadingArticle({
                                title: `Is ${artistProfile.name} Officially Canceled?`,
                                url: 'https://tmz.com/scandal',
                                content: `The internet has turned against ${artistProfile.name} in what appears to be the biggest backlash of their career.\n\nFollowing a string of highly controversial moves, the public image of the star is currently in freefall. Fans are abandoning ship and the hate is dominating social platforms.\n\nWill they ever recover from this? PR experts are highly doubtful.`,
                                type: 'tmz'
                            })}>
                                Why the Internet is "Canceling" {artistProfile.name}
                            </h3>
                            <p className="text-sm text-red-800 mt-2">
                                {(activeArtistData.publicImage ?? 80) <= 20 
                                    ? "The star is facing unprecedented backlash. Brand deals are reportedly in jeopardy, and public opinion has reached an all-time low." 
                                    : "Recent controversies have severely damaged the artist's reputation. Social media is flooded with criticism."}
                            </p>
                        </div>
                    )}

                    {activeTab === 'All' && isMatchArtist && (
                        <div className="border border-zinc-700 rounded-xl overflow-hidden shadow-sm">
                            <div className="flex space-x-1 p-2 overflow-x-auto bg-gray-50">
                                {(activeArtistData.artistImages || []).slice(0, 4).map((img, i) => (
                                    <div key={i} className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden relative">
                                        <img src={img} alt="artist" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 bg-[#202124]">
                                <h1 className="text-2xl font-normal text-gray-100 mb-1">{artistProfile.name}</h1>
                                <p className="text-sm text-gray-400 mb-4">{artistProfile.fandomName} fandom</p>
                                
                                <p className="text-sm text-gray-300 leading-relaxed line-clamp-3 mb-2">
                                    {artistProfile.name} is a global recording artist known for breaking chart records and defining the current era of popular music.
                                </p>
                                <a href="#" onClick={(e) => { e.preventDefault(); setReadingArticle({
                                    title: artistProfile.name,
                                    url: `https://en.wikipedia.org/wiki/${artistProfile.name.replace(/ /g, '_')}`,
                                    content: `${artistProfile.name} (born ${gameState.startYear - artistProfile.age}) is a widely recognized global recording artist. Known for a distinctive style and massive achievements on global charts.\n\nEarly Life and Career\nThe origins and early development of their career show a clear trajectory toward mainstream success. During the initial phases, ${artistProfile.name} established a core fanbase known as ${artistProfile.fandomName}.\n\nLegacy\nWith numerous albums under their belt, the cultural impact of ${artistProfile.name} is still being measured today, with numerous accolades and critical recognition across the music industry.`,
                                    type: 'wikipedia',
                                    extraData: { releasesLength: activeArtistData.releases?.length || 0 }
                                }); }} className="text-sm text-[#8ab4f8] hover:underline text-[#8ab4f8]">Wikipedia</a>

                                <div className="mt-4 border-t border-gray-100 pt-4 space-y-2">
                                    <div className="flex text-sm">
                                        <span className="font-bold w-24 text-gray-100">Born:</span>
                                        <span className="text-gray-400">{artistProfile.age} years old</span>
                                    </div>
                                    <div className="flex text-sm">
                                        <span className="font-bold w-24 text-gray-100">Albums:</span>
                                        <span className="text-[#8ab4f8] hover:underline text-[#8ab4f8]">{(activeArtistData.releases || []).filter(r => r.type === 'Album').length}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-[#202124] border-t border-gray-100 p-4">
                                <h3 className="font-medium text-lg mb-3">Top Songs</h3>
                                <div className="space-y-3">
                                    {popularSongs.map((s, i) => (
                                        <div key={i} className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded bg-zinc-700 flex-shrink-0 overflow-hidden">
                                                {s.coverArt && <img src={s.coverArt} alt="" className="w-full h-full object-cover"/>}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-100 truncate">{s.title}</p>
                                                <p className="text-xs text-gray-400">{formatShortDate(s.releaseDate)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'All' && isTmzQuery && (
                        <div className="space-y-4">
                            <h2 className="text-xl text-gray-200 font-medium">Gossip & News Results</h2>
                            {isMatchTmzArtist ? (
                                <div className="border border-zinc-700 rounded-xl overflow-hidden shadow-sm bg-[#202124] p-4">
                                    <h1 className="text-2xl font-bold text-red-600 mb-2">TMZ EXCLUSIVE</h1>
                                    <p className="text-gray-200 text-lg italic mb-2">"{artistProfile.name} Caught on Camera!"</p>
                                    <p className="text-sm text-gray-300 font-medium max-w-prose">
                                        See the latest photos and rumors surrounding the global superstar. Inside sources say {artistProfile.name} was spotted leaving a private party early this morning.
                                    </p>
                                    <button className="mt-4 px-4 py-2 bg-red-600 text-white font-bold text-sm uppercase hover:bg-black transition-colors" onClick={() => setReadingArticle({
                                        title: `${artistProfile.name} CAUGHT IN LA!`,
                                        url: 'https://www.tmz.com/exclusive',
                                        content: `We got ${artistProfile.name} out in Los Angeles and you won't believe what happened next.\n\nThe global superstar was seen leaving a highly exclusive afterparty surrounded by security. Fans were hounding the exit but our sources got the exclusive shots.\n\nIs ${artistProfile.name} preparing for a massive new release or just blowing off steam? We're hearing whispers of major label drama behind the scenes...`,
                                        type: 'tmz'
                                    })}>Read Full Article</button>
                                </div>
                            ) : (
                                <div className="border border-zinc-700 rounded-lg shadow-sm bg-[#202124] p-4">
                                    <h3 className="text-xl text-red-600 font-black mb-1" onClick={() => setReadingArticle({
                                        title: `HOLLYWOOD MELTDOWN`,
                                        url: 'https://www.tmz.com/latest',
                                        content: `Multiple A-Listers are currently in talks to restructure their teams after massive leaks.\n\nThe industry is shaken right now. Keep it locked on TMZ for the latest.`,
                                        type: 'tmz'
                                    })}>LATEST RED CARPET DISASTERS</h3>
                                    <p className="text-sm text-gray-400 line-clamp-2">The entertainment world is reeling from last night's events...</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'All' && isMatchBeef && (
                        <div className="border-t-4 border-black border border-zinc-700 rounded-xl overflow-hidden shadow-sm bg-[#202124] p-4 space-y-4">
                            <h2 className="text-2xl font-bold">Latest Drama & Beef</h2>
                            {activeArtistData.fanWarStatus ? (
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-lg font-medium text-[#8ab4f8] hover:underline text-[#8ab4f8] cursor-pointer" onClick={() => setReadingArticle({
                                        title: `${artistProfile.name} vs ${activeArtistData.fanWarStatus?.targetArtistName} Fan War Reaches Boiling Point!`,
                                        url: `https://www.popcrave.com/${artistProfile.name}-vs-${activeArtistData.fanWarStatus?.targetArtistName}`,
                                        content: `The timeline is in shambles as the stan bases of ${artistProfile.name} and ${activeArtistData.fanWarStatus?.targetArtistName} go head to head.\n\nIt all started after some shady subliminals and now the fanbases are fully mobilizing. The beef is officially ON and the memes are brutal.`,
                                        type: 'popcrave'
                                    })}>
                                        {artistProfile.name} vs {activeArtistData.fanWarStatus.targetArtistName} Fan War Reaches Boiling Point!
                                    </h3>
                                    <p className="text-sm text-gray-300 font-medium bg-gray-50 p-3 border-l-4 border-blue-500 rounded-r-lg">
                                        Active feud confirmed: Your fans are currently warring with {activeArtistData.fanWarStatus.targetArtistName}'s fan base. This will continue for {activeArtistData.fanWarStatus.weeksRemaining} more weeks.
                                    </p>
                                    <div className="text-xs text-gray-400 uppercase font-bold tracking-widest mt-2">{activeArtistData.fanWarStatus.targetArtistName} | Twitter Drama</div>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    <p className="text-sm text-gray-400 font-medium">Surprisingly, there are no active major feuds or twitter battles happening right now for {artistProfile.name}.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'All' && isMatchTour && (
                        <div className="space-y-4">
                            <h2 className="text-xl text-gray-200 font-medium">Tours Events</h2>
                            {activeArtistData.tours && activeArtistData.tours.length > 0 ? (
                                <div className="space-y-3">
                                    {activeArtistData.tours.map((t, i) => (
                                        <div key={i} className="bg-[#202124] border border-zinc-700 rounded-lg p-4 shadow-sm flex flex-col">
                                            <h3 className="font-semibold text-[#8ab4f8] hover:underline text-[#8ab4f8] cursor-pointer text-lg" onClick={() => setReadingArticle({
                                                title: `Inside ${artistProfile.name}'s Massive "${t.name}"`,
                                                url: 'https://www.pollstar.com/news',
                                                content: `The numbers are in for ${artistProfile.name}'s '${t.name}'.\n\nSelling out arenas and earning high gross revenues, this is shaping up to be one of the most successful live runs of the year.\n\nFans have praised the massive setlist and incredible visual production.`,
                                                type: 'rollingstone'
                                            })}>{t.name}</h3>
                                            <p className="text-[#81c995] text-sm">{formatNumber(t.ticketsSold)} tickets sold</p>
                                            <p className="text-sm text-gray-400 mt-1">{t.venues ? t.venues.length : 0} dates • {t.status === 'planning' ? 'Upcoming' : t.status === 'active' ? 'Ongoing' : 'Completed'}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400 text-sm">No tours found for this artist.</p>
                            )}
                        </div>
                    )}

                    {activeTab === 'All' && isMatchDating && (
                        <div className="border border-zinc-700 rounded-xl overflow-hidden shadow-sm bg-[#202124] p-4">
                            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">{artistProfile.name} Dating History</h2>
                            <h3 className="text-xl font-bold text-[#8ab4f8] hover:underline text-[#8ab4f8] cursor-pointer" onClick={() => setReadingArticle({
                                title: `Who is ${artistProfile.name} dating right now?`,
                                url: 'https://www.eonline.com/news',
                                content: `Fans have been tracking ${artistProfile.name}'s relationship status closely.\n\nRecent rumors suggest that the global superstar might be seeing someone new, although reps have declined to comment officially.\n\nFrom high-profile romances to quiet flings, this artist always keeps us guessing.`,
                                type: 'news'
                            })}>
                                Everything to know about {artistProfile.name}'s relationship status
                            </h3>
                            <p className="text-sm text-gray-300 mt-2">
                                Fans are constantly speculating about who the global star is currently seeing. From high-profile relationships to quiet flings, {artistProfile.name}'s dating life is highly publicized.
                            </p>
                            <button className="mt-3 text-sm font-medium text-[#8ab4f8] hover:text-[#8ab4f8]" onClick={() => setReadingArticle({
                                title: `A Complete Timeline of ${artistProfile.name}'s Dating History`,
                                url: 'https://www.usmagazine.com/celebrity-news',
                                content: `Let's take a look back at ${artistProfile.name}'s highly publicized romantic history.\n\nFrom their explosive first major public relationship to the quiet dating rumors of today, they've always captured headlines.`,
                                type: 'news'
                            })}>View Dating App</button>
                        </div>
                    )}

                    {activeTab === 'All' && isMatchUpcoming && (
                        <div className="border border-zinc-700 rounded-xl overflow-hidden shadow-sm bg-[#202124] p-4 space-y-2">
                            <h2 className="text-xl font-bold text-gray-100">Upcoming Releases</h2>
                            {activeArtistData.releases && activeArtistData.releases.filter(r => !r.isReleased).length > 0 ? (
                                <div className="space-y-3">
                                    {activeArtistData.releases.filter(r => !r.isReleased).slice(0, 3).map((r, i) => (
                                        <div key={i} className="flex gap-4 items-center">
                                            <div className="w-12 h-12 bg-zinc-700 rounded flex-shrink-0 flex items-center justify-center font-bold text-gray-400 text-xs">Unreleased</div>
                                            <div>
                                                <div className="font-semibold text-[#8ab4f8] hover:underline text-[#8ab4f8] cursor-pointer" onClick={() => setReadingArticle({
                                                    title: `${artistProfile.name} Teases Upcoming Release "${r.title}"`,
                                                    url: 'https://www.billboard.com/music-news',
                                                    content: `The highly anticipated release of "${r.title}" is officially on the horizon.\n\nFans have been dissecting every cryptic social media post for clues. Industry insiders believe this drop could shatter streaming records.\n\nStay tuned for the official date.`,
                                                    type: 'news'
                                                })}>{r.title}</div>
                                                <div className="text-xs text-gray-400">{r.type}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400">There are currently no official upcoming releases announced for {artistProfile.name}.</p>
                            )}
                        </div>
                    )}

                    {activeTab === 'All' && isMatchBillboard && (
                        <div className="border-t-4 border-blue-600 border border-zinc-700 rounded-xl overflow-hidden shadow-sm bg-[#202124] p-4">
                            <h1 className="text-2xl font-black uppercase tracking-widest text-[#8ab4f8] mb-2">Billboard</h1>
                            <h3 className="text-lg font-bold text-gray-100 hover:text-[#8ab4f8] cursor-pointer" onClick={() => setReadingArticle({
                                title: `${artistProfile.name} Achieves Major Milestone on Billboard Charts`,
                                url: 'https://www.billboard.com/charts',
                                content: `Chart history has been made again.\n\n${artistProfile.name} continues their streak of incredible charting hits. With this latest entry, they cement their status as one of the defining artists of the decade.`,
                                type: 'news'
                            })}>
                                {artistProfile.name} Chart History
                            </h3>
                            <p className="text-sm text-gray-400 mt-2">
                                Check out {artistProfile.name}'s peak positions, total weeks on chart, and all historic entries on the Hot 100.
                            </p>
                            <button className="mt-3 text-sm font-bold text-[#8ab4f8]" onClick={() => setReadingArticle({
                                title: `The Biggest Hits of ${artistProfile.name}'s Career`,
                                url: 'https://www.billboard.com/lists',
                                content: `A ranking of their absolute biggest smashes on the Billboard Hot 100.\n\nFrom their debut entries to their multi-week number one hits, ${artistProfile.name} has proven they know how to stay on top.`,
                                type: 'news'
                            })}>See Full Chart History</button>
                        </div>
                    )}

                    {activeTab === 'All' && isMatchOnlyFans && (
                        <div className="border border-zinc-700 rounded-xl overflow-hidden shadow-sm bg-[#202124] p-4 border-t-4 border-[#00AFF0]">
                            <h2 className="text-[#00AFF0] font-bold text-xl flex items-center gap-2 mb-2">
                                <span className="italic font-black">OnlyFans</span>
                            </h2>
                            {activeArtistData.onlyfans ? (
                                <div>
                                    <h3 className="font-semibold text-lg hover:underline text-[#8ab4f8] cursor-pointer" onClick={() => setReadingArticle({
                                        title: `${artistProfile.name} is Officially on OnlyFans!`,
                                        url: 'https://www.complex.com/music',
                                        content: `The news broke the internet.\n\n${artistProfile.name} has officially launched an OnlyFans account. Fans flocking to the platform can expect exclusive, behind-the-scenes content that they've never seen before.`,
                                        type: 'news'
                                    })}>
                                        Subscribe to {artistProfile.name}'s Official OnlyFans
                                    </h3>
                                    <p className="text-sm text-gray-300 mt-1">Exclusive behind-the-scenes content directly from the artist. Monthly subscription available now.</p>
                                    <button className="mt-3 px-4 py-2 bg-[#00AFF0] text-white font-bold rounded hover:bg-blue-600 transition-colors" onClick={() => setReadingArticle({
                                        title: `${artistProfile.name}'s Subscriber Count Explodes`,
                                        url: 'https://www.tmz.com/onlyfans',
                                        content: `Sources tell us ${artistProfile.name} is making massive bank on the platform.\n\nTheir recent content drop caused the site to briefly crash for several users.`,
                                        type: 'tmz'
                                    })}>View Profile</button>
                                </div>
                            ) : (
                                <div>
                                    <h3 className="font-semibold text-lg text-gray-200">Did {artistProfile.name} join OnlyFans?</h3>
                                    <p className="text-sm text-gray-400 mt-1">There is currently no official OnlyFans account for {artistProfile.name}. Many fans have requested it, but it remains unconfirmed.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'All' && isMatchCatalog && (
                        <div className="border border-zinc-700 rounded-xl overflow-hidden shadow-sm bg-[#202124]">
                            <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                                <span className="font-bold text-gray-200">Music Business News</span>
                                <span className="text-xs text-gray-400 uppercase tracking-widest">Industry</span>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-xl text-[#8ab4f8] hover:underline text-[#8ab4f8] cursor-pointer" onClick={() => setReadingArticle({
                                    title: `Inside the value of ${artistProfile.name}'s music catalog`,
                                    url: 'https://www.musicbusinessworldwide.com/news',
                                    content: `Music catalogs are booming assets right now.\n\nIndustry analysts state that ${artistProfile.name}'s master recordings could be valued in the hundreds of millions. Will they sell to an investment firm or retain independent ownership?\n\nThis decision could reshape their financial future forever.`,
                                    type: 'news'
                                })}>
                                    Inside the value of {artistProfile.name}'s music catalog
                                </h3>
                                <p className="text-sm text-gray-400 mt-2">
                                    With master recordings valued in the millions, industry analysts are speculating whether {artistProfile.name} will sell their entire catalog to an investment firm or retain full ownership.
                                </p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'All' && isMatchAwards && (
                        <div className="border border-zinc-700 rounded-xl overflow-hidden shadow-sm p-4 bg-gradient-to-br from-yellow-50 to-white border-t-4 border-yellow-500">
                            <h2 className="text-xl font-bold text-yellow-800 mb-2">Award History & Nominations</h2>
                            <p className="text-sm text-gray-300 mb-3">
                                {artistProfile.name} has been highly decorated throughout their career holding several prestigious awards.
                            </p>
                            <div className="space-y-2 mb-3">
                                <div className="flex justify-between items-center text-sm border-b pb-1">
                                    <span className="font-medium">GRAMMY Wins</span>
                                    <span className="font-bold">{activeArtistData.grammyHistory ? activeArtistData.grammyHistory.length : 0}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm border-b pb-1">
                                    <span className="font-medium">AMA Wins</span>
                                    <span className="font-bold">{activeArtistData.amaHistory ? activeArtistData.amaHistory.length : 0}</span>
                                </div>
                            </div>
                            <button className="text-sm font-bold text-yellow-700 hover:text-yellow-900 w-full text-center" onClick={() => setReadingArticle({
                                title: `${artistProfile.name}'s Historic Award Run`,
                                url: 'https://www.grammy.com/news',
                                content: `An unforgettable night for music.\n\n${artistProfile.name} swept major categories, proving their dominance in the industry space. Their heartfelt acceptance speech has already gone viral.\n\nFans are celebrating this massive milestone.`,
                                type: 'news'
                            })}>
                                View GRAMMYs
                            </button>
                        </div>
                    )}

                    {activeTab === 'All' && isMatchCoachella && (
                        <div className="border border-zinc-700 rounded-xl overflow-hidden shadow-sm bg-[#202124] p-4">
                            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-pink-500 mb-2">Coachella & Festivals</h2>
                            <h3 className="font-medium text-[#8ab4f8] hover:underline text-[#8ab4f8] cursor-pointer" onClick={() => setReadingArticle({
                                title: `${artistProfile.name} Rumored to Headline Major Festival`,
                                url: 'https://www.rollingstone.com/music-festivals',
                                content: `The rumors are getting stronger.\n\nMultiple sources report that ${artistProfile.name} is in final negotiations to headline one of the year's biggest music festivals.\n\nIf true, it will be their biggest live performance to date.`,
                                type: 'rollingstone'
                            })}>
                                Will {artistProfile.name} perform at Coachella this year?
                            </h3>
                            <p className="text-sm text-gray-400 mt-2 line-clamp-3">
                                Festival lineups are highly anticipated, and {artistProfile.name} is consistently one of the most requested headliners in the world. Check out upcoming gigs and festival bookings.
                            </p>
                        </div>
                    )}

                    {activeTab === 'All' && isMatchSpotifyCharts && (
                        <div className="border-t-4 border-[#1DB954] border border-zinc-700 rounded-xl overflow-hidden shadow-sm bg-[#202124] p-4">
                            <h2 className="text-[#1DB954] font-bold text-xl mb-2">Spotify Charts Data</h2>
                            <div className="grid grid-cols-2 gap-4 mb-3">
                                <div className="bg-gray-50 p-3 rounded">
                                    <div className="text-xs text-gray-400 font-bold uppercase">Monthly Listeners</div>
                                    <div className="text-xl font-black">{formatNumber(activeArtistData.monthlyListeners)}</div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded">
                                    <div className="text-xs text-gray-400 font-bold uppercase">Followers</div>
                                    <div className="text-xl font-black">{formatNumber(activeArtistData.followers || 0)}</div>
                                </div>
                            </div>
                            <button className="w-full py-2 bg-[#1DB954] text-white font-bold rounded-full hover:bg-green-600 transition-colors" onClick={() => setReadingArticle({
                                title: `${artistProfile.name} Breaks Spotify Streaming Record`,
                                url: 'https://newsroom.spotify.com',
                                content: `Numbers don't lie.\n\n${artistProfile.name} has just surpassed massive milestones on the platform. Earning millions of monthly listeners, they are officially one of the top trending artists globally this week.`,
                                type: 'news'
                            })}>
                                View Spotify For Artists
                            </button>
                        </div>
                    )}

                    {activeTab === 'All' && isMatchPayola && (
                        <div className="border border-red-300 bg-red-50 rounded-xl overflow-hidden shadow-sm p-4">
                            <h2 className="text-red-700 font-bold text-lg mb-2">Controversy Check</h2>
                            <h3 className="font-medium text-red-900 hover:underline text-[#8ab4f8] cursor-pointer" onClick={() => setReadingArticle({
                                title: `Investigating ${artistProfile.name}'s Streaming Numbers`,
                                url: `https://www.musicindustrywatch.com/scandal/${artistProfile.name.replace(/ /g, '-')}`,
                                content: `Are the numbers real? Several investigative journalists have started looking into widespread allegations of payola and "botting" streams across the industry.\n\nWhile representatives for ${artistProfile.name} have fiercely denied any wrongdoing, the rumors persist on social media timelines.`,
                                type: 'news'
                            })}>
                                Did {artistProfile.name} use payola for their latest hit?
                            </h3>
                            <p className="text-sm text-red-800 mt-2">
                                Allegations of buying streams or radio play (payola) frequently plague top artists trying to game the charts. Click to read the latest industry rumors and expert breakdowns.
                            </p>
                        </div>
                    )}

                    {/* Net Worth Snippet */}
                    {activeTab === 'All' && isMatchBrandDeals && (
                        <div className="border border-zinc-700 rounded-xl overflow-hidden shadow-sm bg-[#303134] p-4 mb-4">
                            <h2 className="text-xl font-medium text-gray-200 tracking-tight mb-4 flex items-center gap-2">
                                <span className="text-xl">🤝</span> Sign a Brand Deal
                            </h2>
                            <p className="text-sm text-gray-400 mb-4">You can negotiate and sign these brand deals if you meet the popularity and public image requirements.</p>
                            <div className="space-y-4">
                                {[
                                    { id: 'nike', name: 'Nike', cash: 20000000, reqPop: 80, reqImg: 60, desc: 'Global athletic footwear and apparel campaign.', hashtag: '#NikexArtist', brandImage: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg' },
                                    { id: 'gucci', name: 'Gucci', cash: 15000000, reqPop: 70, reqImg: 50, desc: 'High-fashion ambassador deal including runway appearances.', hashtag: '#GucciAmbassador', brandImage: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Gucci_logo.svg' },
                                    { id: 'pepsi', name: 'Pepsi', cash: 10000000, reqPop: 60, reqImg: 40, desc: 'Star in a major Super Bowl commercial.', hashtag: '#PepsiPartner', brandImage: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Pepsi_logo_2014.svg' },
                                    { id: 'calvinklein', name: 'Calvin Klein', cash: 5000000, reqPop: 40, reqImg: 30, desc: 'Underwear modeling campaign across billboards worldwide.', hashtag: '#MyCalvins', brandImage: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Calvin_Klein_logo.svg' },
                                    { id: 'loreal', name: 'L\'Oréal', cash: 8000000, reqPop: 55, reqImg: 50, desc: 'Global cosmetics and beauty ambassadorship.', hashtag: '#LorealPartner', brandImage: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/L%27Or%C3%A9al_logo.svg' },
                                    { id: 'spotify', name: 'Spotify', cash: 12000000, reqPop: 75, reqImg: 40, desc: 'Exclusive podcast and curated playlist partnership.', hashtag: '#SpotifyExclusive', brandImage: 'https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg' }
                                ].map(deal => {
                                    const canAfford = activeArtistData.popularity >= deal.reqPop && (activeArtistData.publicImage ?? 80) >= deal.reqImg;
                                    const isSigned = activeArtistData.signedBrandDeals?.includes(deal.id);
                                    return (
                                        <div key={deal.id} className="p-3 border rounded-lg flex items-center justify-between">
                                            <div>
                                                <h3 className="font-bold text-[#8ab4f8] text-lg">{deal.name}</h3>
                                                <p className="text-sm text-gray-300">{deal.desc}</p>
                                                <div className="text-xs text-gray-400 mt-1">Requires {deal.reqPop}+ Popularity • ${formatNumber(deal.cash)}</div>
                                            </div>
                                            <div>
                                                {isSigned ? (
                                                    <button disabled className="px-4 py-2 bg-zinc-700 text-gray-400 rounded font-bold text-sm">Signed</button>
                                                ) : (
                                                    <button
                                                        onClick={() => {
                                                            if (canAfford) {
                                                                dispatch({ type: 'SIGN_BRAND_DEAL', payload: { id: deal.id, name: deal.name, cash: deal.cash, hashtag: deal.hashtag, brandImage: deal.brandImage } });
                                                                alert(`You signed a ${formatNumber(deal.cash)} deal with ${deal.name}! Note: You are now required to post with ${deal.hashtag} on social media or you will be fined.`);
                                                            } else {
                                                                alert(`You need ${deal.reqPop}+ Popularity and ${deal.reqImg}+ Public Image to sign this.`);
                                                            }
                                                        }}
                                                        className={`px-4 py-2 rounded font-bold text-sm ${canAfford ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-zinc-700 text-gray-400 cursor-not-allowed'}`}
                                                    >
                                                        Negotiate & Sign
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {activeTab === 'All' && isMatchVideoGames && (
                        <div className="border border-zinc-700 rounded-xl overflow-hidden shadow-sm bg-[#202124] p-4 mb-4">
                            <h2 className="text-xl font-medium text-gray-200 tracking-tight mb-4">Video Game Features</h2>
                            <p className="text-sm text-gray-400 mb-4">License your songs for these major video game soundtracks.</p>
                            <div className="space-y-4">
                                {[
                                    { id: 'gta6', name: 'GTA 6 Soundtrack', cash: 5000000, reqPop: 85, desc: 'Get your song featured on the biggest entertainment launch in history.' },
                                    { id: 'fortnite', name: 'Fortnite In-Game Concert', cash: 15000000, reqPop: 90, desc: 'Perform a live concert event in Fortnite and release a skin.' },
                                    { id: 'fifa', name: 'EA Sports FC (FIFA)', cash: 2000000, reqPop: 50, desc: 'Feature on the global football soundtrack.' },
                                    { id: 'nba2k', name: 'NBA 2K', cash: 1000000, reqPop: 40, desc: 'Curate a playlist or feature on the basketball simulator.' },
                                ].map(game => {
                                    const canAfford = activeArtistData.popularity >= game.reqPop;
                                    const isSigned = activeArtistData.signedVideoGames?.includes(game.id);
                                    return (
                                        <div key={game.id} className="p-3 border rounded-lg flex items-center justify-between">
                                            <div>
                                                <h3 className="font-bold text-[#8ab4f8] text-lg">{game.name}</h3>
                                                <p className="text-sm text-gray-300">{game.desc}</p>
                                                <div className="text-xs text-gray-400 mt-1">Requires {game.reqPop}+ Popularity • ${formatNumber(game.cash)}</div>
                                            </div>
                                            <div>
                                                {isSigned ? (
                                                    <button disabled className="px-4 py-2 bg-zinc-700 text-gray-400 rounded font-bold text-sm">Signed</button>
                                                ) : (
                                                    <button
                                                        onClick={() => {
                                                            if (canAfford) {
                                                                dispatch({ type: 'SIGN_VIDEO_GAME_DEAL', payload: { id: game.id, cash: game.cash } });
                                                                alert(`You signed a $${formatNumber(game.cash)} deal with ${game.name}!`);
                                                            } else {
                                                                alert(`You need ${game.reqPop}+ Popularity to sign this.`);
                                                            }
                                                        }}
                                                        className={`px-4 py-2 rounded font-bold text-sm ${canAfford ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-zinc-700 text-gray-400 cursor-not-allowed'}`}
                                                    >
                                                        Negotiate & Feature
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {activeTab === 'All' && isMatchNetWorth && (
                        <div className="border border-zinc-700 rounded-xl overflow-hidden shadow-sm bg-[#202124] p-4">
                            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">{artistProfile.name} Net Worth</h2>
                            <div className="text-4xl font-light text-gray-100 mb-2">~${formatNumber(estimatedNetWorth)}</div>
                            <p className="text-sm text-gray-300">
                                Estimated net worth based on album sales, touring revenue, streaming, and brand partnerships. This figure involves significant market speculation and might not reflect private assets.
                            </p>
                        </div>
                    )}

                    {/* Utilities Snippets */}
                    {activeTab === 'All' && isMatchWeather && (
                        <div className="border border-zinc-700 rounded-xl overflow-hidden shadow-sm bg-[#202124] p-4">
                            <h2 className="text-gray-400 text-sm mb-2 uppercase tracking-wide">Weather</h2>
                            <div className="flex items-center gap-4">
                                <span className="text-5xl font-light text-gray-100">72°F</span>
                                <div className="text-gray-400 text-sm">
                                    <div className="font-bold">Sunny</div>
                                    <div>Precipitation: 0%</div>
                                    <div>Humidity: 45%</div>
                                    <div>Wind: 5 mph</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'All' && isMatchCalc && (
                        <div className="border border-zinc-700 rounded-xl overflow-hidden shadow-sm bg-[#202124] p-4">
                            <div className="text-right text-gray-400 text-sm mb-1">{activeQuery.replace(/[^0-9\+\-\*\/\(\)\.]/g, '') || '0'} =</div>
                            <div className="text-right text-4xl font-normal text-gray-100 mb-4">{
                                (() => {
                                    try {
                                        const mathStr = activeQuery.replace(/[^0-9\+\-\*\/\(\)\.]/g, '');
                                        return mathStr ? new Function(`return ${mathStr}`)() : 'Error';
                                    } catch(e) { return 'Error'; }
                                })()
                            }</div>
                            <div className="grid grid-cols-4 gap-2">
                                {['C','()','%','/','7','8','9','*','4','5','6','-','1','2','3','+','0','.','=',''].map((btn,i) => (
                                    <div key={i} className={`p-3 text-center border rounded ${btn === '=' ? 'bg-blue-500 text-white' : btn ? 'bg-gray-50 text-gray-200' : 'bg-transparent border-transparent'}`}>
                                        {btn}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'All' && isMatchStock && (
                        <div className="border border-zinc-700 rounded-xl overflow-hidden shadow-sm bg-[#202124] p-4">
                            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">Market Summary</h2>
                            <div className="text-3xl font-medium text-gray-100 mb-1">154.23 <span className="text-green-600 text-lg">+1.45 (0.95%)</span></div>
                            <p className="text-xs text-gray-400 mb-4">Closed: Today 4:00 PM EDT</p>
                            <div className="h-24 flex items-end border-b border-zinc-700 gap-1 pb-1">
                                {Array.from({length: 20}).map((_,i) => (
                                    <div key={i} className="flex-1 bg-green-500 rounded-t" style={{height: `${Math.random() * 80 + 20}%`}}></div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'All' && isMatchTime && (
                        <div className="border border-zinc-700 rounded-xl overflow-hidden shadow-sm bg-[#202124] p-4">
                            <div className="text-4xl font-light text-gray-100 mb-1">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                            <p className="text-sm text-gray-400">Local Time • {new Date().toLocaleDateString()}</p>
                        </div>
                    )}

                    {activeTab === 'All' && isMatchStopwatch && (
                        <div className="border border-zinc-700 rounded-xl overflow-hidden shadow-sm bg-[#202124] p-4 text-center">
                            <div className="flex justify-center gap-4 border-b border-gray-100 mb-4">
                                <button className="font-medium text-[#8ab4f8] border-b-2 border-blue-600 pb-2">Timer</button>
                                <button className="font-medium text-gray-400 pb-2 hover:text-gray-200">Stopwatch</button>
                            </div>
                            <div className="text-5xl font-light text-gray-100 mb-6">05:00:00</div>
                            <div className="flex justify-center gap-4">
                                <button className="px-6 py-2 bg-blue-600 text-white font-bold rounded-full text-sm">Start</button>
                                <button className="px-6 py-2 bg-gray-100 text-gray-200 font-bold rounded-full text-sm">Reset</button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'All' && isMatchDefine && (
                        <div className="border border-zinc-700 rounded-xl overflow-hidden shadow-sm bg-[#202124] p-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-gray-100 rounded-full"><svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9m-5.656 0a5 5 0 000 7.072m2.828-9.9a9 9 0 010 12.728M5.536 8.464a5 5 0 010-7.072m2.828 9.9a9 9 0 010-12.728"/></svg></div>
                                <h1 className="text-3xl font-serif text-gray-100 truncate">{activeQuery.replace('define ', '').replace(' meaning', '') || 'word'}</h1>
                            </div>
                            <p className="text-sm text-gray-400 italic mb-4">/ wərd /</p>
                            <div className="mb-2">
                                <span className="italic text-gray-400 font-serif mr-2">noun</span>
                                <ol className="list-decimal pl-5 space-y-1 mt-1 text-gray-200">
                                    <li>a single distinct meaningful element of speech or writing.</li>
                                    <li>a command, password, or signal.</li>
                                </ol>
                            </div>
                        </div>
                    )}

                    {activeTab === 'All' && isMatchTranslate && (
                        <div className="border border-zinc-700 rounded-xl overflow-hidden shadow-sm bg-[#202124] p-4">
                            <div className="flex divide-x divide-gray-200 border border-zinc-700 rounded mb-4">
                                <div className="flex-1 p-2 text-sm font-medium text-[#8ab4f8] text-center">English</div>
                                <div className="w-10 flex items-center justify-center p-2"><svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg></div>
                                <div className="flex-1 p-2 text-sm font-medium text-[#8ab4f8] text-center">Spanish</div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <textarea className="w-full h-20 p-2 border-0 resize-none outline-none text-xl" placeholder="Enter text" defaultValue={activeQuery.replace('translate ', '')}></textarea>
                                </div>
                                <div className="bg-gray-50 p-2 text-xl text-gray-200 break-words">
                                    [Translation]
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'All' && isMatchFlights && (
                        <div className="border border-zinc-700 rounded-xl overflow-hidden shadow-sm bg-[#202124] py-2">
                            <div className="px-4 py-2 flex items-center gap-2 border-b border-gray-100">
                                <svg className="w-5 h-5 text-[#8ab4f8]" fill="currentColor" viewBox="0 0 24 24"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>
                                <span className="font-bold text-gray-200">Flights</span>
                            </div>
                            <div className="p-4 grid grid-cols-2 gap-4">
                                <div className="border border-zinc-700 rounded p-2">
                                    <div className="text-xs text-gray-400 uppercase">From</div>
                                    <div className="font-bold">New York (NYC)</div>
                                </div>
                                <div className="border border-zinc-700 rounded p-2">
                                    <div className="text-xs text-gray-400 uppercase">To</div>
                                    <div className="font-bold">London (LHR)</div>
                                </div>
                            </div>
                            <div className="px-4 text-sm text-[#8ab4f8] font-medium hover:underline text-[#8ab4f8] cursor-pointer">View flights on Google Travel</div>
                        </div>
                    )}

                    {activeTab === 'All' && isMatchCurrency && (
                        <div className="border border-zinc-700 rounded-xl overflow-hidden shadow-sm bg-[#202124] p-4">
                             <div className="flex gap-4 items-center mb-4">
                                <div className="flex-1">
                                    <input type="text" className="w-full text-right text-3xl outline-none border-b border-zinc-700 pb-1" defaultValue="1" />
                                    <div className="text-sm text-gray-400 mt-2 font-medium">United States Dollar</div>
                                </div>
                                <div className="text-2xl text-gray-400">=</div>
                                <div className="flex-1">
                                    <input type="text" className="w-full text-right text-3xl outline-none border-b border-zinc-700 pb-1" defaultValue="0.92" readOnly />
                                    <div className="text-sm text-gray-400 mt-2 font-medium">Euro</div>
                                </div>
                             </div>
                             <p className="text-xs text-gray-400">Data provided by financial exchanges.</p>
                        </div>
                    )}

                    {activeTab === 'All' && isMatchRecipe && (
                        <div className="border border-zinc-700 rounded-xl overflow-hidden shadow-sm bg-[#202124] p-4">
                            <h2 className="text-xl font-bold mb-3 capitalize text-gray-100">{activeQuery.replace('recipe for ', '').replace('how to make ', '')} Recipe</h2>
                            <div className="flex gap-4">
                                <div className="w-24 h-24 bg-orange-100 rounded flex items-center justify-center text-4xl">🍲</div>
                                <div className="flex-1">
                                    <div className="font-bold text-sm mb-1">Ingredients:</div>
                                    <ul className="text-sm text-gray-400 space-y-1 pl-4 list-disc mb-2">
                                        <li>2 cups water</li>
                                        <li>1 cup main ingredient</li>
                                        <li>Pinch of salt</li>
                                    </ul>
                                    <div className="text-xs text-[#81c995] font-medium">★★★★☆ 4.8 (124 reviews) • 30 mins</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Standard Search Results */}

                    {activeTab === 'Videos' && (
                        <div className="space-y-4">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="flex gap-4 border border-zinc-700 rounded-lg overflow-hidden shadow-sm bg-[#202124] p-4">
                                    <div className="w-32 h-20 md:w-48 md:h-28 bg-zinc-700 rounded relative flex-shrink-0">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center"><svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div>
                                        </div>
                                        <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 rounded font-bold">3:42</div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-medium text-[#8ab4f8] line-clamp-2 hover:underline text-[#8ab4f8] cursor-pointer" onClick={() => setReadingArticle({title: `Video: ${activeQuery}`, url:'https://www.youtube.com/watch', content: 'Watching video stream...', type: 'generic'})}>{activeQuery} - Official Video {i+1}</h3>
                                        <div className="text-xs text-gray-400 font-bold mb-1">YouTube • Channel Name</div>
                                        <div className="text-xs text-gray-400 mb-2">1.2M views • 2 weeks ago</div>
                                        <p className="text-sm text-gray-400 line-clamp-1 hidden md:block">The highly anticipated video for {activeQuery}.</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'Shopping' && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[1,2,3,4,5,6,7,8].map((_, i) => (
                                <div key={i} className="border border-zinc-700 rounded-lg overflow-hidden shadow-sm bg-[#202124] flex flex-col cursor-pointer hover:shadow-md transition-shadow">
                                    <div className="w-full aspect-square bg-gray-100 flex items-center justify-center p-4">
                                        <div className="w-20 h-20 bg-gray-300 rounded-full opacity-50"></div>
                                    </div>
                                    <div className="p-3 flex-1 flex flex-col">
                                        <h3 className="text-sm font-medium text-gray-100 line-clamp-2 hover:text-[#8ab4f8]">{activeQuery} Merchandise {i+1}</h3>
                                        <div className="text-lg font-bold text-gray-100 mt-auto mb-1">${(Math.random() * 50 + 10).toFixed(2)}</div>
                                        <div className="text-xs text-[#81c995] font-bold mb-1">Free shipping</div>
                                        <div className="text-xs text-gray-400">Official Store</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {activeTab === 'All' && (
                         <div className="space-y-6 mt-6">
                            <div className="max-w-xl">
                                <p className="text-sm text-gray-200 mb-1">https://www.billboard.com › music › music-news</p>
                                <h3 className="text-xl text-[#8ab4f8] hover:underline text-[#8ab4f8] cursor-pointer leading-tight mb-1" onClick={() => setReadingArticle({
                                    title: `${activeQuery} - Latest News and Updates`,
                                    url: 'https://www.billboard.com/music/music-news',
                                    content: `In recent news, ${activeQuery} has been making headlines across the entertainment industry. Sources indicate that there are major announcements coming soon.\n\nFans have been eagerly awaiting new developments, with social media speculation reaching an all-time high. Stay tuned for exclusive interviews and behind-the-scenes coverage.`,
                                    type: 'news'
                                })}>
                                    {activeQuery} - Latest News and Updates
                                </h3>
                                <p className="text-sm text-gray-400 line-clamp-2">
                                    Find the latest breaking updates and information regarding {activeQuery}. Stay tuned for upcoming announcements.
                                </p>
                            </div>

                            <div className="max-w-xl">
                                <p className="text-sm text-gray-200 mb-1">https://en.wikipedia.org › wiki › {activeQuery.replace(/ /g, '_')}</p>
                                <h3 className="text-xl text-[#8ab4f8] hover:underline text-[#8ab4f8] cursor-pointer leading-tight mb-1" onClick={() => setReadingArticle({
                                    title: `${activeQuery} - Wikipedia`,
                                    url: `https://en.wikipedia.org/wiki/${activeQuery.replace(/ /g, '_')}`,
                                    content: `${activeQuery} is a broadly discussed topic in modern media. Content and cultural implications continue to evolve.\n\nEarly Life and Career\nThe origins and early development of ${activeQuery} show a clear trajectory toward mainstream success.\n\nLegacy\nThe cultural impact is still being measured today, with numerous accolades and critical recognition.`,
                                    type: 'wikipedia'
                                })}>
                                    {activeQuery} - Wikipedia
                                </h3>
                                <p className="text-sm text-gray-400 line-clamp-2">
                                    {activeQuery} is a broadly discussed topic in modern media. Content and cultural implications continue to evolve.
                                </p>
                            </div>

                            <div className="max-w-xl">
                                <p className="text-sm text-gray-200 mb-1">https://www.popcrave.com › latest › {activeQuery.replace(/ /g, '-')}</p>
                                <h3 className="text-xl text-[#8ab4f8] hover:underline text-[#8ab4f8] cursor-pointer leading-tight mb-1" onClick={() => setReadingArticle({
                                    title: `${activeQuery} Trending Worldwide`,
                                    url: 'https://www.popcrave.com/latest',
                                    content: `Social media is currently ablaze with discussions about ${activeQuery}.\n\nFans have driven the topic to the number one trending spot globally across multiple platforms. Here is what everyone is saying right now...`,
                                    type: 'popcrave'
                                })}>
                                    {activeQuery} - Pop Crave Trends
                                </h3>
                                <p className="text-sm text-gray-400 line-clamp-2">
                                    See why {activeQuery} is trending at #1 worldwide right now.
                                </p>
                            </div>

                            <div className="max-w-xl">
                                <p className="text-sm text-gray-200 mb-1">https://www.vogue.com › {activeQuery.replace(/ /g, '-')}</p>
                                <h3 className="text-xl text-[#8ab4f8] hover:underline text-[#8ab4f8] cursor-pointer leading-tight mb-1" onClick={() => setReadingArticle({
                                    title: `The Style Evolution of ${activeQuery}`,
                                    url: 'https://www.vogue.com',
                                    content: `A deep dive into the fashion and aesthetic of ${activeQuery}.\n\nOver the years, the visual presentation has shifted dramatically, marking distinct "eras" in the public eye. Let's rank the top 10 best looks.`,
                                    type: 'vogue'
                                })}>
                                    The Style Evolution of {activeQuery} | Vogue
                                </h3>
                                <p className="text-sm text-gray-400 line-clamp-2">
                                    Breaking down the fashion, looks, and cultural impacts of {activeQuery}'s most iconic moments.
                                </p>
                            </div>

                            {gameState.date.year >= 2012 && (<div className="max-w-xl">
                                <p className="text-sm text-gray-200 mb-1">https://www.reddit.com › r › popheads › comments</p>
                                <h3 className="text-xl text-[#8ab4f8] hover:underline text-[#8ab4f8] cursor-pointer leading-tight mb-1" onClick={() => setReadingArticle({
                                    title: `Discussion: Unpopular Opinions about ${activeQuery}?`,
                                    url: 'https://www.reddit.com/r/popheads',
                                    content: `*User_123:* I feel like their older work was way more cohesive than what they are putting out now. Does anyone else agree?\n\n*Stan_Forever:* Are you kidding? Their new stuff is completely redefining the genre. You just don't get the vision.`,
                                    type: 'reddit'
                                })}>
                                    Discussion: Unpopular Opinions about {activeQuery}? : r/popheads
                                </h3>
                                <p className="text-sm text-gray-400 line-clamp-2">
                                    I've been thinking a lot about the trajectory of {activeQuery} lately and wanted to see what the subreddit thinks. Let's discuss...
                                </p>
                            </div>)}

                            <div className="max-w-xl">
                                <p className="text-sm text-gray-200 mb-1">https://www.rollingstone.com › reviews › {activeQuery.replace(/ /g, '-')}</p>
                                <h3 className="text-xl text-[#8ab4f8] hover:underline text-[#8ab4f8] cursor-pointer leading-tight mb-1" onClick={() => setReadingArticle({
                                    title: `Rolling Stone: Retrospective Review of ${activeQuery}`,
                                    url: 'https://www.rollingstone.com/reviews',
                                    content: `Looking back, the impact of ${activeQuery} is undeniable.\n\nWhile criticized heavily upon launch, the cultural significance has only expanded over time. We revisit the moments that defined an entire generation of pop culture.`,
                                    type: 'rollingstone'
                                })}>
                                    Rolling Stone: Retrospective Review of {activeQuery}
                                </h3>
                                <p className="text-sm text-gray-400 line-clamp-2">
                                    Our editors look back at the lasting impact and legacy left behind by {activeQuery} and what it means for the future.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* People Also Ask Section */}
                    {activeTab === 'All' && (isMatchArtist || isMatchTour || activeQuery) && (
                        <div className="border border-zinc-700 rounded-xl overflow-hidden mt-6 bg-[#202124] shadow-sm">
                            <h3 className="font-medium text-lg p-4 border-b border-gray-100">People also ask</h3>
                            <div className="divide-y divide-gray-100">
                                {[
                                    `How did ${artistProfile.name} get famous?`,
                                    `What is ${artistProfile.name}'s biggest hit?`,
                                    `Is ${artistProfile.name} going on tour this year?`,
                                    `Who is ${artistProfile.name} related to?`
                                ].map((question, i) => (
                                    <div key={i} className="p-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setExpandedPaa(expandedPaa === i ? null : i)}>
                                        <div className="flex justify-between items-center text-gray-200">
                                            <span className="text-base">{question}</span>
                                            <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform ${expandedPaa === i ? 'rotate-180' : ''}`} />
                                        </div>
                                        {expandedPaa === i && (
                                            <div className="mt-4 pt-3 text-sm text-gray-400 border-t border-gray-100">
                                                {getPaaAnswer(i)}
                                                <div className="mt-4 text-xs font-semibold text-[#8ab4f8] hover:underline text-[#8ab4f8]" onClick={(e) => { e.stopPropagation(); setQuery(question.replace('?', '')); setActiveQuery(question.replace('?', '')); }}>Search for: {question}</div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Related Searches */}
                    {activeTab === 'All' && (isMatchArtist || isMatchTour || isMatchAnySpecial) && (
                        <div className="mt-8 pt-6 border-t border-zinc-700">
                            <h3 className="font-medium text-lg mb-4">Related searches</h3>
                            <div className="flex flex-wrap gap-2">
                                {[`${artistProfile.name} net worth`, `${artistProfile.name} dating`, `${artistProfile.name} newest album`, `${artistProfile.name} tour dates`, `${artistProfile.name} TMZ controversy`, `${artistProfile.name} twitter drama`, `${artistProfile.name} Spotify record`, `${artistProfile.name} masters catalog`].map((str, i) => (
                                    <button key={i} onClick={() => { setQuery(str); setActiveQuery(str); }} className="px-4 py-2 bg-gray-100 hover:bg-zinc-700 rounded-full text-sm text-gray-200 font-medium transition-colors flex items-center shadow-sm">
                                        <SearchIcon className="w-4 h-4 mr-2 text-gray-400"/>
                                        {str}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default GoogleView;
