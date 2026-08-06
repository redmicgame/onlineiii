import React, {  useState , useEffect } from 'react';
import { useGame, formatNumber } from '../context/GameContext';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import SearchIcon from './icons/SearchIcon';
import { Artist, Group } from '../types';

export const VogueSiteView: React.FC<{ initialArticle?: any, onClose: () => void }> = ({ initialArticle, onClose }) => {
    const { gameState, activeArtistData } = useGame();
    const [currentView, setCurrentView] = useState<'home' | 'article'>('home');
    const [selectedArticle, setSelectedArticle] = useState<any | null>(initialArticle || null);

    const allPlayerArtistsAndGroups: (Artist | Group)[] = gameState.careerMode === 'solo' && gameState.soloArtist ? [gameState.soloArtist] : (gameState.group ? [gameState.group, ...gameState.group.members] : []);
    const artistProfile = allPlayerArtistsAndGroups.find(a => a.id === gameState.activeArtistId);

    // Mock past articles/covers based on artist level/hype
    const pastCovers = [
        {
            title: `The Style Evolution of ${artistProfile?.name}`,
            image: activeArtistData?.artistImages?.[0] || '',
            date: 'September Issue',
            content: `A deep dive into the fashion and aesthetic of ${artistProfile?.name}.\n\nOver the years, the visual presentation has shifted dramatically, marking distinct "eras" in the public eye. Let's rank the top 10 best looks.`
        },
        {
            title: `${artistProfile?.name}'s New Era: What to Expect`,
            image: activeArtistData?.artistImages?.[1 % (activeArtistData?.artistImages?.length || 1)] || '',
            date: 'Spring Fashion',
            content: `As ${artistProfile?.name} enters a new phase of their career, we examine the subtle wardrobe changes that signal a massive tonal shift in their upcoming music.`
        },
        {
            title: `Inside ${artistProfile?.name}'s Tour Wardrobe`,
            image: activeArtistData?.artistImages?.[2 % (activeArtistData?.artistImages?.length || 1)] || '',
            date: 'Met Gala Special',
            content: `Exclusive sketches and backstage fittings for ${artistProfile?.name}'s highly anticipated world tour.`
        }
    ];

    React.useEffect(() => {
        if (initialArticle) {
            setSelectedArticle(initialArticle);
            setCurrentView('article');
        }
    }, [initialArticle]);

    return (
        <div className="bg-[#faf9f6] text-zinc-900 h-full overflow-y-auto font-serif relative pb-16">
            {/* Nav */}
            <header className="px-4 py-6 border-b border-zinc-200 sticky top-0 bg-[#faf9f6]/95 backdrop-blur z-20 w-full flex items-center justify-between">
                <button onClick={onClose} className="p-2 text-zinc-600 hover:text-black transition-colors rounded-full hover:bg-zinc-200">
                    <ArrowLeftIcon className="w-5 h-5" />
                </button>
                <div 
                    className="font-serif text-4xl tracking-widest text-zinc-900 uppercase mx-auto cursor-pointer"
                    onClick={() => setCurrentView('home')}
                >
                    VOGUE
                </div>
                <div className="p-2 text-zinc-600">
                    <SearchIcon className="w-5 h-5" />
                </div>
            </header>

            <nav className="border-b border-zinc-200 bg-[#faf9f6] text-xs uppercase tracking-widest flex justify-center space-x-6 py-3 overflow-x-auto">
                <span className="cursor-pointer hover:text-red-700 font-bold">Fashion</span>
                <span className="cursor-pointer hover:text-red-700 font-bold">Beauty</span>
                <span className="cursor-pointer hover:text-red-700 font-bold">Culture</span>
                <span className="cursor-pointer hover:text-red-700 font-bold">Living</span>
                <span className="cursor-pointer hover:text-red-700 font-bold">Runway</span>
            </nav>

            {currentView === 'home' && (
                <main className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        {/* Main Cover Article */}
                        <div 
                            className="md:col-span-8 group cursor-pointer" 
                            onClick={() => { setSelectedArticle(pastCovers[0]); setCurrentView('article'); }}
                        >
                            <div className="overflow-hidden mb-4 relative aspect-[3/4] md:aspect-[4/3]">
                                {pastCovers[0].image ? (
                                    <img src={pastCovers[0].image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Main cover" />
                                ) : (
                                    <div className="w-full h-full bg-zinc-200 flex items-center justify-center text-zinc-400">No Image</div>
                                )}
                                <div className="absolute top-4 left-4 bg-red-700 text-white text-[10px] uppercase tracking-widest px-2 py-1 font-sans">
                                    {pastCovers[0].date}
                                </div>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-normal leading-tight group-hover:text-red-700 transition-colors mb-2">
                                {pastCovers[0].title}
                            </h2>
                            <p className="text-zinc-600 font-sans text-sm line-clamp-2">
                                {pastCovers[0].content}
                            </p>
                        </div>

                        {/* Sidebar Articles */}
                        <div className="md:col-span-4 space-y-8">
                            <h3 className="font-sans text-xs uppercase tracking-widest border-b border-zinc-900 pb-2 mb-4 font-bold">Latest Covers</h3>
                            {pastCovers.slice(1).map((article, i) => (
                                <div key={i} className="group cursor-pointer flex flex-col" onClick={() => { setSelectedArticle(article); setCurrentView('article'); }}>
                                    <div className="overflow-hidden mb-3 aspect-[4/5] w-full">
                                        {article.image ? (
                                            <img src={article.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Sidebar cover" />
                                        ) : (
                                            <div className="w-full h-full bg-zinc-200" />
                                        )}
                                    </div>
                                    <h4 className="text-xl font-normal group-hover:text-red-700 transition-colors leading-snug">
                                        {article.title}
                                    </h4>
                                    <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-sans mt-2">{article.date}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            )}

            {currentView === 'article' && selectedArticle && (
                <article className="max-w-3xl mx-auto px-4 py-8 lg:py-16 animate-fade-in">
                    <button onClick={() => setCurrentView('home')} className="mb-8 font-sans text-xs uppercase tracking-widest text-zinc-500 hover:text-zinc-900 flex items-center gap-2">
                        <ArrowLeftIcon className="w-3 h-3" /> Back to Home
                    </button>
                    
                    <h1 className="text-4xl md:text-6xl font-normal leading-tight text-center mb-6">
                        {selectedArticle.title}
                    </h1>
                    <p className="text-center font-sans tracking-widest text-xs uppercase text-zinc-500 mb-10 pb-8 border-b border-zinc-200">
                        By Vogue Editors • {selectedArticle.date || 'Exclusive'}
                    </p>
                    
                    {selectedArticle.image && (
                        <div className="mb-12">
                            <img src={selectedArticle.image} className="w-full h-auto object-cover shadow-sm" alt="Article image" />
                            <p className="text-right text-[10px] text-zinc-400 font-sans mt-2 uppercase tracking-wide">Photographed for Vogue</p>
                        </div>
                    )}
                    
                    <div className="text-lg md:text-xl leading-relaxed text-zinc-800 space-y-6 first-letter:text-7xl first-letter:float-left first-letter:pr-2 first-letter:font-serif first-letter:leading-[0.8]">
                        {(selectedArticle.content || '').split('\n').filter((p: string) => p.trim()).map((paragraph: string, i: number) => (
                            <p key={i}>{paragraph}</p>
                        ))}
                        <p>It's clear that the cultural trajectory of {artistProfile?.name} is just beginning to take shape. With a keen eye for aesthetics and a wardrobe that continues to turn heads, the music industry is watching to see what happens next.</p>
                        <p>For more exclusive fashion breakdowns, keep an eye on Vogue's rising stars coverage.</p>
                    </div>
                </article>
            )}
        </div>
    );
};

export default VogueSiteView;
