

import React, { useState, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { GoogleGenAI } from '@google/genai';
import type { Release, Review, Song } from '../types';
import { REVIEW_COST, REVIEWER_NAMES } from '../constants';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import MenuIcon from './icons/MenuIcon';
import SearchIcon from './icons/SearchIcon';

const getAI = () => {
    const key = process.env.API_KEY;
    if (!key) throw new Error("API key not configured");
    return new GoogleGenAI({ apiKey: key });
};

const ReviewDisplay: React.FC<{ release: Release; onBack: () => void }> = ({ release, onBack }) => {
    const { activeArtist, activeArtistData } = useGame();

    if (!release.review || !activeArtist || !activeArtistData) {
        return <p>Review not found.</p>;
    }

    const { songs } = activeArtistData;
    const releaseSongs = songs.filter(s => release.songIds.includes(s.id));
    const genres = [...new Set(releaseSongs.map(s => s.genre))].join('/');
    const date = new Date(release.releaseDate.year, 0, (release.releaseDate.week - 1) * 7 + 1);
    const formattedDate = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    
    let labelText: string;
    if (release.releasingLabel) {
        labelText = release.releasingLabel.name;
        if (release.releasingLabel.dealWithMajor) {
            labelText += `, a division of ${release.releasingLabel.dealWithMajor}`;
        }
    } else {
        labelText = 'Independent';
    }

    return (
        <div className="bg-white text-black h-full w-full overflow-y-auto pb-24">
            <header className="flex justify-between items-center p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
                <MenuIcon className="w-6 h-6"/>
                <svg className="h-6" viewBox="0 0 146 24" fill="currentColor"><path d="M42.2.33v23.34H37.6V.33h4.6zM24 .33c3.3 0 5.4 1.5 5.4 4.2V23.67h-4.6V4.53c0-1.74-1.29-2.31-2.07-2.31-.69 0-1.12.3-1.12.72v1.1l-4.6.02V4.53c0-2.7 2.1-4.2 5.4-4.2zM6 15.87V.33h4.6v12.24c0 1.74 1.29 2.31 2.07 2.31.69 0 1.12-.3 1.12-.72 0-.54-.5-.69-1.13-.84l-2.18-.5C7.78 12.3 6 13.5 6 15.87zm12.6-3.32c0-2.415-1.2-3.63-3.51-4.17l-2.19-.495c-.63-.15-1.125-.3-1.125-.84 0-.42.435-.72 1.125-.72.78 0 2.07.57 2.07 2.31v.1h4.6V4.53c0-2.7-2.1-4.2-5.4-4.2-3.3 0-5.4 1.5-5.4 4.2v3.32c0 2.415 1.2 3.63 3.51 4.17l2.19.495c.63.15 1.125.3 1.125.84 0 .42-.435-.72-1.125-.72-.78 0-2.07-.57-2.07-2.31v-.1h-4.6v11.9c0 2.7 2.1 4.2 5.4 4.2 3.3 0 5.4-1.5 5.4-4.2v-3.375zM58.7 12.57V.33h4.6v12.24c0 2.22 1.26 3.75 4.59 3.75 2.925 0 4.2-1.2 4.2-3.75V.33h4.6v12.51c0 3.315-2.73 4.155-5.61 4.155-2.715 0-5.415-.81-5.415-4.155zM88.9.33v23.34h-4.6V.33h4.6zM106.3 15.87V.33h4.6v12.24c0 1.74 1.29 2.31 2.07 2.31.69 0 1.12-.3 1.12-.72 0-.54-.5-.69-1.13-.84l-2.18-.5c-2.31-.525-4.095 1.2-4.095 3.66zm12.6-3.32c0-2.415-1.2-3.63-3.51-4.17l-2.19-.495c-.63-.15-1.125-.3-1.125-.84 0-.42.435-.72 1.125-.72.78 0 2.07.57 2.07 2.31v.1h4.6V4.53c0-2.7-2.1-4.2-5.4-4.2-3.3 0-5.4 1.5-5.4 4.2v3.32c0 2.415 1.2 3.63 3.51 4.17l2.19.495c.63.15 1.125.3 1.125.84 0 .42-.435-.72-1.125-.72-.78 0-2.07-.57-2.07-2.31v-.1h-4.6v11.9c0 2.7 2.1 4.2 5.4 4.2 3.3 0 5.4-1.5 5.4-4.2v-3.375zM141.4.33v23.34h-4.6V.33h4.6z"></path></svg>
                <div className="flex items-center gap-4">
                    <span className="text-xs font-bold tracking-widest">SIGN IN</span>
                    <SearchIcon className="w-5 h-5"/>
                </div>
            </header>

            <main className="max-w-3xl mx-auto p-4 md:p-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tighter uppercase">{release.title}</h1>
                    <a href="#" className="text-xl md:text-2xl underline hover:no-underline mt-2 inline-block">{activeArtist.name}</a>
                    <p className="text-gray-500 text-sm mt-4">{release.releaseDate.year}</p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8 mb-8">
                    <div className="md:col-span-1">
                        <img src={release.coverArt} alt={release.title} className="w-full aspect-square" />
                    </div>
                    <div className="md:col-span-2 flex items-center justify-center">
                        <div className="w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-black flex items-center justify-center">
                            <span className="text-5xl md:text-6xl font-bold">{release.review.score.toFixed(1)}</span>
                        </div>
                    </div>
                </div>

                <div className="text-center text-xs text-gray-500 mb-8">
                    By {release.review.reviewer}
                </div>
                
                <div className="grid grid-cols-3 text-xs uppercase tracking-widest font-semibold text-center mb-8">
                    <div><span className="text-gray-500">Genre:</span><br/> {genres}</div>
                    <div><span className="text-gray-500">Label:</span><br/> {labelText}</div>
                    <div><span className="text-gray-500">Reviewed:</span><br/> {formattedDate}</div>
                </div>

                <div className="text-lg leading-relaxed space-y-4">
                    <p>{release.review.text}</p>
                </div>
                
                 <button onClick={onBack} className="mt-12 w-full text-center text-sm text-gray-500 hover:text-black">
                    &larr; Back to all releases
                </button>
            </main>
        </div>
    );
};


const PitchforkView: React.FC = () => {
    const { dispatch, activeArtist, activeArtistData, gameState } = useGame();
    const [selectedRelease, setSelectedRelease] = useState<Release | null>(null);
    const [loadingReview, setLoadingReview] = useState<string | null>(null);
    const [error, setError] = useState('');

    if (!activeArtist || !activeArtistData) return null;

    if (activeArtistData.isBlacklistedByLabel) {
        return (
            <div className="flex flex-col h-full bg-zinc-900 text-white">
                <header className="flex items-center p-4 bg-zinc-800 shrink-0 gap-4">
                    <button onClick={() => dispatch({type: 'CHANGE_VIEW', payload: 'game'})} className="p-2 rounded-full hover:bg-white/10">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    </button>
                    <h1 className="text-2xl font-bold">Pitchfork Reviews</h1>
                </header>
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <h2 className="text-2xl font-bold text-red-500 mb-4">Blacklisted by Label</h2>
                    <p className="text-zinc-400">Your label is refusing to pitch your releases to reviewers.</p>
                </div>
            </div>
        );
    }
    const { releases, money, songs } = activeArtistData;

    const handleSubmitForReview = async (release: Release) => {
        setError('');
        if (money < REVIEW_COST) {
            setError("Not enough money to submit for review.");
            return;
        }
        setLoadingReview(release.id);
        
        try {
            const releaseSongs = songs.filter(s => release.songIds.includes(s.id));
            const avgQuality = releaseSongs.reduce((sum, s) => sum + s.quality, 0) / releaseSongs.length;
            const genres = [...new Set(releaseSongs.map(s => s.genre))].join('/');
            
            const baseScore = isNaN(avgQuality) ? 5 : avgQuality / 10;
            const randomFactor = (Math.random() * 3) - 1.5;
            let finalScore = Math.max(1, Math.min(10, baseScore + randomFactor));
            finalScore = Math.round(finalScore * 10) / 10;
            
            let reviewText = '';
            if (gameState.offlineMode || !activeArtistData?.redMicPro?.unlocked) {
                if (finalScore >= 8) {
                    reviewText = `A stunning and bold effort from ${activeArtist.name}. The production is crisp and the artistic vision is fully realized, cementing this release as one of the standout moments of the year.`;
                } else if (finalScore >= 5) {
                    reviewText = `${activeArtist.name} delivers a competent but somewhat uneven project. While there are undeniable highlights, it occasionally struggles to maintain momentum from front to back.`;
                } else {
                    reviewText = `Unfortunately, this release feels entirely derivative. ${activeArtist.name} appears stuck in a creative rut, offering little more than uninspired rehashes of better ideas.`;
                }
            } else {
                const prompt = `You are a music critic for Pitchfork. Write a short, one-paragraph review for a ${release.type.toLowerCase().replace(" (deluxe)", "")} titled "${release.title}" by ${activeArtist.name}. The genre is ${genres}. The ${release.type.toLowerCase().replace(" (deluxe)", "")} received a score of ${finalScore}/10. The review text must reflect this score. If the score is high (7.5+), be positive and praiseworthy. If it's mid (4-7.4), be mixed or lukewarm. If it's low (under 4), be critical or dismissive. Keep the review concise, opinionated, and in the high-brow, analytical style of a Pitchfork review. Do not mention the score in the text.`;
                
                const aiClient = getAI();
                const response = await aiClient.models.generateContent({
                  model: 'gemini-2.5-flash',
                  contents: prompt
                });
                reviewText = response.text;
            }
            
            const newReview: Review = {
                publication: 'Pitchfork',
                score: finalScore,
                text: reviewText,
                reviewer: REVIEWER_NAMES[Math.floor(Math.random() * REVIEWER_NAMES.length)],
            };
            
            dispatch({ type: 'ADD_REVIEW', payload: { releaseId: release.id, review: newReview, cost: REVIEW_COST, artistId: activeArtist.id } });

        } catch (err: any) {
            console.error(err);
            setError(err?.message ? `Failed: ${err.message}` : 'Failed to generate review. Please try again.');
        } finally {
            setLoadingReview(null);
        }
    };

    const sortedReleases = useMemo(() => {
        return [...releases].sort((a, b) => (b.releaseDate.year * 52 + b.releaseDate.week) - (a.releaseDate.year * 52 + a.releaseDate.week));
    }, [releases]);

    if (selectedRelease) {
        return <ReviewDisplay release={selectedRelease} onBack={() => setSelectedRelease(null)} />;
    }

    return (
        <div className="h-full w-full bg-zinc-900 overflow-y-auto">
            <header className="p-4 flex items-center gap-4 sticky top-0 bg-zinc-900/80 backdrop-blur-sm z-10 border-b border-zinc-700/50">
                <button onClick={() => dispatch({type: 'CHANGE_VIEW', payload: 'game'})} className="p-2 rounded-full hover:bg-white/10">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold">Pitchfork Reviews</h1>
            </header>
            <div className="p-4">
                {error && <p className="text-red-400 text-center mb-4">{error}</p>}
                {sortedReleases.length > 0 ? (
                    <div className="space-y-4">
                        {sortedReleases.map(release => (
                            <div key={release.id} className="bg-zinc-800 p-3 rounded-lg flex items-center gap-4">
                                <img src={release.coverArt} alt={release.title} className="w-16 h-16 rounded-md object-cover"/>
                                <div className="flex-grow">
                                    <p className="font-bold">{release.title}</p>
                                    <p className="text-sm text-zinc-400">{release.type.replace(" (Deluxe)", "")} &bull; {release.releaseDate.year}</p>
                                </div>
                                {release.review ? (
                                    <div className="text-center">
                                        <p className="text-xs text-zinc-400">Score</p>
                                        <p className="text-2xl font-bold">{release.review.score.toFixed(1)}</p>
                                        <button onClick={() => setSelectedRelease(release)} className="text-xs text-red-500 hover:underline">View</button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handleSubmitForReview(release)}
                                        disabled={money < REVIEW_COST || loadingReview !== null}
                                        className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:bg-zinc-600 disabled:cursor-not-allowed"
                                    >
                                        {loadingReview === release.id ? 'Loading...' : `Submit (-$${REVIEW_COST.toLocaleString()})`}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-zinc-800 rounded-lg">
                        <p className="text-zinc-400">No releases yet.</p>
                        <p className="text-zinc-500 text-sm">Release a Single, EP, or Album to submit it for review.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PitchforkView;