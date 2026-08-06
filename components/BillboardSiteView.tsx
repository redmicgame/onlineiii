import React from 'react';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import { useGame } from '../context/GameContext';

export const BillboardSiteView: React.FC<{ initialArticle: any, onClose: () => void }> = ({ initialArticle, onClose }) => {
    const { activeArtistData } = useGame();
    return (
        <div className="bg-white text-black h-full overflow-y-auto font-sans relative pb-16">
            <header className="p-4 border-b-4 border-black sticky top-0 bg-white z-20 w-full flex items-center justify-between">
                <button onClick={onClose} className="p-2 text-black hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <div className="font-black text-3xl md:text-4xl tracking-tighter text-black uppercase">
                    billboard
                </div>
                <div className="w-10"></div>
            </header>
            
            <main className="max-w-4xl mx-auto">
                <div className="bg-black text-white p-2 text-center text-xs font-bold tracking-widest uppercase mb-6">
                    Music News
                </div>
                <div className="px-4 md:px-8">
                    <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4 tracking-tight">{initialArticle.title}</h1>
                    <div className="flex items-center gap-4 border-b border-gray-200 pb-4 mb-6">
                        <div className="font-bold text-sm uppercase">By Billboard Staff</div>
                        <div className="text-gray-500 text-sm">| Just Now</div>
                    </div>
                    
                    {activeArtistData?.artistImages?.[0] && (
                        <div className="mb-8">
                            <img src={activeArtistData.artistImages[0]} className="w-full aspect-video object-cover" alt="Article main" />
                            <div className="text-xs text-gray-500 mt-2 text-right">Photo: Getty Images</div>
                        </div>
                    )}
                    
                    <div className="text-lg md:text-xl leading-relaxed text-gray-900 space-y-6 font-serif">
                        {initialArticle.content.split('\\n').filter((p: string) => p.trim()).map((paragraph: string, i: number) => (
                            <p key={i}>{paragraph}</p>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default BillboardSiteView;
