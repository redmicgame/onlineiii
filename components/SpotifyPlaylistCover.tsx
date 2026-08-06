import React from 'react';

interface SpotifyPlaylistCoverProps {
    name: string;
    imageUrl?: string;
    artistName?: string;
    className?: string;
    size?: 'small' | 'large';
}

export const SpotifyPlaylistCover: React.FC<SpotifyPlaylistCoverProps> = ({ 
    name, 
    imageUrl, 
    artistName,
    className = '',
    size = 'small'
}) => {
    const isLarge = size === 'large';
    
    // Viral Hits
    if (name.toLowerCase() === 'viral hits') {
        return (
            <div className={`relative w-full h-full bg-gradient-to-br from-[#3b82f6] via-[#10b981] to-[#3b82f6] overflow-hidden flex items-center justify-center ${className}`}>
                {/* Simulated wavy lines pattern in background */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-radial-gradient(circle at 0 0, transparent 0, #000 10px), repeating-linear-gradient(#00f, #00f)' }}></div>
                
                <h2 className={`${isLarge ? 'text-7xl md:text-9xl' : 'text-3xl'} font-black text-[#1ed760] px-4 text-center z-10 leading-none`} 
                    style={{
                        textShadow: '3px 3px 0 #000, 6px 6px 0 #fbbf24, 9px 9px 0 #ef4444, 12px 12px 0 #a855f7',
                        fontFamily: "'Space Grotesk', sans-serif"
                    }}>
                    <span className="block -mb-2 italic">Viral</span>
                    <span className="block italic">Hits</span>
                </h2>
            </div>
        );
    }

    // Top 50 - Global
    if (name.toLowerCase().includes('top 50 - global')) {
        return (
            <div className={`relative w-full h-full bg-gradient-to-b from-[#148a8c] to-[#142c5c] flex flex-col items-center justify-center ${className}`}>
                <div className="w-full flex-1 flex items-center justify-center">
                    <h2 className={`${isLarge ? 'text-6xl md:text-8xl' : 'text-2xl'} font-bold text-white text-center tracking-tight`}>
                        Top 50
                    </h2>
                </div>
                <div className="w-1/2 h-[1px] bg-white/30 mb-4"></div>
                <div className={`${isLarge ? 'pb-12 text-sm md:text-base' : 'pb-4 text-[10px]'} uppercase font-bold text-white tracking-[0.2em]`}>
                    Global
                </div>
            </div>
        );
    }

    // Today's Top Hits
    if (name.toLowerCase() === "today's top hits" && imageUrl) {
        return (
            <div className={`relative w-full h-full bg-zinc-900 overflow-hidden group ${className}`}>
                <img 
                    src={imageUrl} 
                    alt="Today's Top Hits" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Yellow overlay with TTH */}
                <div className="absolute bottom-0 left-0 right-0 p-4 pt-12 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                    <div className="relative">
                        <div className="absolute -top-12 -left-2 text-[#fbef3a] font-black italic opacity-90" style={{ fontSize: isLarge ? '12rem' : '4rem', lineHeight: 0.8, letterSpacing: '-0.05em' }}>
                            TTH
                        </div>
                        <h2 className={`${isLarge ? 'text-4xl' : 'text-lg'} font-black text-[#fbef3a] relative z-10 italic uppercase leading-none mt-4 text-right mb-1`}>
                            Today's<br/>Top<br/>Hits
                        </h2>
                    </div>
                </div>
            </div>
        );
    }

    // This Is [Artist]
    if (name.toLowerCase().startsWith('this is ') && imageUrl) {
        const artist = name.substring(8); // Remove "This is "
        return (
            <div className={`relative w-full h-full bg-white flex flex-col ${className}`}>
                <div className={`${isLarge ? 'pt-8 pb-6' : 'pt-3 pb-2'} bg-white text-black text-center`}>
                    <h2 className={`${isLarge ? 'text-4xl md:text-5xl' : 'text-lg'} font-black uppercase tracking-tighter`}>THIS IS</h2>
                </div>
                <div className="flex-1 relative bg-zinc-900 border-x-4 border-white" style={{ borderWidth: isLarge ? '12px' : '4px', borderTopWidth: 0, borderBottomWidth: 0 }}>
                    <img src={imageUrl} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" alt={artist} />
                </div>
                <div className={`${isLarge ? 'pt-6 pb-8' : 'pt-2 pb-3'} bg-[#fbef3a] text-black text-center`}>
                    <h2 className={`${isLarge ? 'text-4xl md:text-5xl' : 'text-lg'} font-black truncate px-2`}>{artist}</h2>
                </div>
            </div>
        );
    }

    // Default Playlist Cover
    return (
        <div className={`relative w-full h-full bg-[#282828] overflow-hidden group ${className}`}>
            <img 
                src={imageUrl} 
                alt={name} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                <span className={`${isLarge ? 'text-4xl md:text-6xl drop-shadow-lg' : 'text-sm'} text-white font-black uppercase tracking-tighter leading-tight line-clamp-3`}>
                    {name}
                </span>
            </div>
        </div>
    );
};
