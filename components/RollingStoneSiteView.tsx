import React, { useState, useEffect } from 'react';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import { useGame } from '../context/GameContext';
import { GoogleGenAI } from '@google/genai';

const getAI = () => {
    const key = import.meta.env.VITE_GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!key) throw new Error("API key not configured");
    return new GoogleGenAI({ apiKey: key });
};

export const RollingStoneSiteView: React.FC<{ initialArticle?: any, onClose: () => void }> = ({ initialArticle, onClose }) => {
    const { activeArtistData } = useGame();
    const [selectedArticle, setSelectedArticle] = useState<any | null>(initialArticle || null);
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(!initialArticle);

    useEffect(() => {
        if (initialArticle) {
            setSelectedArticle(initialArticle);
            return;
        }
        
        const fetchArticles = async () => {
            try {
                const ai = getAI();
                const prompt = `Write 3 short music news article summaries for Rolling Stone magazine featuring the artist ${activeArtistData?.name}.
Return a JSON array of objects with 'title', 'headline', 'content', 'date'. Content should be at least 3 paragraphs of text. Do NOT use markdown in content.`;
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                    config: { responseMimeType: "application/json" }
                });
                
                const data = JSON.parse(response.text());
                setArticles(data);
            } catch (err) {
                console.error(err);
                setArticles([
                    { title: `${activeArtistData?.name}'s New Era`, headline: 'What to expect next', content: 'An inside look at the upcoming projects...', date: 'Just Now' }
                ]);
            }
            setLoading(false);
        };
        fetchArticles();
    }, [activeArtistData, initialArticle]);

    if (selectedArticle) {
        return (
            <div className="bg-red-600 text-white h-full overflow-y-auto font-serif relative pb-16">
                <header className="p-4 border-b border-red-800 sticky top-0 bg-red-600 z-20 w-full flex items-center">
                    <button onClick={() => initialArticle ? onClose() : setSelectedArticle(null)} className="p-2 mr-4 hover:bg-red-700 rounded-full transition-colors">
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                    <div className="font-black text-2xl tracking-tighter uppercase italic">
                        Rolling Stone
                    </div>
                </header>
                
                <main className="max-w-4xl mx-auto bg-white text-black min-h-screen">
                    <div className="px-6 py-10 md:px-12">
                        <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">{selectedArticle.title}</h1>
                        <p className="text-xl text-gray-600 mb-6 font-sans">{selectedArticle.headline}</p>
                        
                        <div className="flex items-center gap-4 border-y border-gray-300 py-3 mb-8">
                            <div className="font-bold text-sm uppercase text-red-600 font-sans">By Rolling Stone</div>
                            <div className="text-gray-500 text-sm font-sans">| {selectedArticle.date || 'Today'}</div>
                        </div>
                        
                        <div className="text-lg leading-relaxed text-gray-900 space-y-6">
                            {selectedArticle.content.split('\\n').filter((p: string) => p.trim()).map((paragraph: string, i: number) => (
                                <p key={i}>{paragraph}</p>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="bg-white text-black h-full overflow-y-auto font-sans relative pb-16">
            <header className="p-4 border-b-4 border-red-600 sticky top-0 bg-white z-20 w-full flex items-center justify-between">
                <button onClick={onClose} className="p-2 text-black hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <div className="font-black text-3xl md:text-4xl tracking-tighter text-red-600 uppercase italic">
                    Rolling Stone
                </div>
                <div className="w-10"></div>
            </header>
            
            <main className="max-w-5xl mx-auto p-4 md:p-8">
                <h2 className="text-2xl font-black mb-6 uppercase border-b-2 border-black pb-2">Latest News</h2>
                
                {loading ? (
                    <div className="flex justify-center p-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {articles.map((article, idx) => (
                            <div key={idx} className="cursor-pointer group" onClick={() => setSelectedArticle(article)}>
                                <div className="aspect-video bg-gray-200 mb-4 overflow-hidden relative">
                                    {activeArtistData?.artistImages?.[idx % activeArtistData.artistImages.length] ? (
                                        <img src={activeArtistData.artistImages[idx % activeArtistData.artistImages.length]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="News" />
                                    ) : (
                                        <div className="w-full h-full bg-zinc-300 flex items-center justify-center text-zinc-500 font-serif italic">RS</div>
                                    )}
                                    <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 uppercase">Music</div>
                                </div>
                                <h3 className="text-xl font-bold font-serif leading-tight group-hover:text-red-600 transition-colors mb-2">{article.title}</h3>
                                <p className="text-gray-600 text-sm line-clamp-2">{article.headline}</p>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default RollingStoneSiteView;
