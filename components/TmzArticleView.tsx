import React from 'react';
import { useGame } from '../context/GameContext';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

const TmzArticleView: React.FC = () => {
    const { gameState, dispatch } = useGame();
    const post = gameState.activeTmzPost;

    if (!post) {
        return null;
    }

    const { content, image } = post;
    const authorId = post.authorId;

    if (authorId !== 'tmz') {
        return null;
    }

    const handleBack = () => {
        dispatch({ type: 'CHANGE_VIEW', payload: 'game' });
        dispatch({ type: 'SET_ACTIVE_TMZ_POST', payload: null });
    };

    return (
        <div className="bg-white text-black h-full overflow-y-auto">
            <header className="flex items-center justify-between p-4 border-b border-gray-200">
                <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeftIcon className="w-6 h-6 " />
                </button>
                <div className="font-black text-red-600 text-3xl tracking-tighter">TMZ</div>
                <div className="w-10"></div>
            </header>

            <main className="max-w-2xl mx-auto p-4 space-y-6">
                <div>
                    <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-4 whitespace-pre-wrap">{content.toUpperCase()}</h1>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6 font-bold uppercase">
                        <span className="text-red-600">Exclusive</span>
                        <span>|</span>
                        <span>TMZ Staff</span>
                        <span>|</span>
                        <span>Week {post.date.week}, {post.date.year}</span>
                    </div>
                </div>

                {image && !post.billionsClubSongTitle && (
                    <div className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        <img src={image} alt="TMZ Article" className="w-full h-full object-cover" />
                    </div>
                )}

                {image && post.billionsClubSongTitle && (
                    <div className="w-full aspect-square bg-[#121212] flex flex-col items-center justify-center p-8 relative rounded-lg overflow-hidden shadow-2xl border-4 border-black">
                        {/* Background subtle Spotify logo pattern or texture could go here */}
                        <div className="absolute top-4 left-4">
                            {/* Spotify Logo placeholder */}
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center p-1.5">
                                <svg viewBox="0 0 24 24" fill="#1DB954" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.24 1.02zm1.44-3.3c-.301.42-.84.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.44-.539.18-1.08-.12-1.26-.66-.18-.54.12-1.08.66-1.26 4.32-1.26 9.72-.6 13.5 1.74.48.3.66.84.36 1.32zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.66.18-1.32-.18-1.5-.84-.18-.66.18-1.32.84-1.5 4.08-1.26 11.16-1.02 16.02 1.92.6.36.78 1.14.42 1.74-.36.6-1.14.78-1.74.42z"/>
                                </svg>
                            </div>
                        </div>
                        
                        {/* Circular Image frame like the reference */}
                        <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full border-4 border-white overflow-hidden z-10">
                             <img src={image} alt="Artist" className="w-full h-full object-cover grayscale" />
                        </div>
                        
                        {/* Subtle decorative arcs */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[60%] w-[320px] h-[320px] md:w-[400px] md:h-[400px] rounded-full border-[3px] border-zinc-700/50 z-0 pointer-events-none"></div>

                        <div className="mt-8 text-center z-10 w-full relative">
                            {/* The Billions Club Text */}
                            <h2 className="text-white text-4xl md:text-5xl font-black tracking-tight uppercase" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.1)'}}>
                                BILLIONS CLUB
                            </h2>
                            <div className="w-48 h-[2px] bg-white mx-auto mt-4 mb-2 opacity-80 rounded-full"></div>
                        </div>
                    </div>
                )}

                <div className="prose prose-lg max-w-none">
                    <p className="text-xl font-medium leading-relaxed">
                        Sources tell us that {content}
                    </p>
                    <p>
                        Our cameras caught the action exclusive, what do you think? Big news coming from the team! Things are looking crazy!
                    </p>
                </div>
            </main>
        </div>
    );
};

export default TmzArticleView;
