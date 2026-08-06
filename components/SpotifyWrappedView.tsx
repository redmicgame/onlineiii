
import React, { useState, useMemo } from 'react';
import { useGame, formatNumber } from '../context/GameContext';
import { Song, Release } from '../types';
import ChevronRightIcon from './icons/ChevronRightIcon';

const SpotifyWrappedView: React.FC = () => {
    const { dispatch, activeArtist, activeArtistData, gameState } = useGame();
    const [slideIndex, setSlideIndex] = useState(0);

    const wrappedData = useMemo(() => {
        if (!activeArtistData || !activeArtist) return null;
        
        const releasedSongs = activeArtistData.songs.filter(s => s.isReleased);
        const totalStreams = releasedSongs.reduce((sum, s) => sum + s.streams, 0);
        const totalListeners = Math.floor(totalStreams * 0.1);

        const topSongs = [...releasedSongs].sort((a,b) => b.streams - a.streams).slice(0, 10);
        const topSong = topSongs[0];

        const topAlbums = activeArtistData.releases
            .filter(r => r.type !== 'Single' && !r.soundtrackInfo)
            .map(album => {
                const streams = album.songIds.reduce((sum, songId) => {
                    const song = activeArtistData.songs.find(s => s.id === songId);
                    return sum + (song?.streams || 0);
                }, 0);
                return { ...album, streams };
            })
            .sort((a, b) => b.streams - a.streams)
            .slice(0, 5);
            
        const personaSongs: { song: Song, persona: string, description: string }[] = [];
        const availableSongs = [...releasedSongs].sort(() => 0.5 - Math.random());
        const personas = [
            { title: "The Night Owl", description: "A track that fans leaned on after dark." },
            { title: "The Early Riser", description: "A fan favorite for starting the day." },
            { title: "The Party Starter", description: "The song that tends to kick off the weekend." },
            { title: "The Shared Treasure", description: "The song that fans were more likely to share with others." },
        ];
        
        for (let i = 0; i < Math.min(availableSongs.length, personas.length); i++) {
            personaSongs.push({ song: availableSongs[i], ...personas[i] });
        }

        return {
            year: gameState.date.year,
            totalStreams,
            totalListeners,
            topSongs,
            topSong,
            topAlbums,
            personaSongs,
            artistName: activeArtist.name,
            artistImage: activeArtist.image,
            latestAlbumCover: topAlbums[0]?.coverArt || activeArtist.image,
        };
    }, [activeArtistData, activeArtist, gameState.date.year]);

    if (!wrappedData) {
        return <div className="bg-[#F3F0EC] text-black h-full flex items-center justify-center">Loading your Wrapped...</div>;
    }

    const { year, artistName, latestAlbumCover, totalStreams, totalListeners, topSong, topSongs, topAlbums, personaSongs } = wrappedData;

    const slides = [
        // Slide 1: Intro
        <div className="flex flex-col justify-between h-full p-8 text-center">
            <div>
                <div className="bg-black text-white font-bold text-2xl inline-block px-4 py-2">{artistName}</div>
                <div className="absolute top-10 right-10 flex flex-col gap-2">
                    <div className="w-5 h-5 bg-[#FE3617] rounded-full"></div>
                    <div className="w-5 h-5 bg-[#FE3617] rounded-full"></div>
                    <div className="w-5 h-5 bg-[#FE3617] rounded-full"></div>
                </div>
            </div>
            <div className="flex flex-col items-center">
                <div className="w-64 h-64 border-4 border-black p-2">
                    <img src={latestAlbumCover} alt="Artist" className="w-full h-full object-cover"/>
                </div>
                <p className="font-bold text-2xl mt-8">Your</p>
                <p className="font-anton text-7xl">{year} Wrapped</p>
                <p className="font-bold text-2xl">is here.</p>
            </div>
            <button onClick={() => setSlideIndex(s => s + 1)} className="bg-black text-white font-bold py-3 px-8 rounded-full self-center">Let's go</button>
        </div>,
        // Slide 2 & 3: Stats
        ...[
            { label: 'Total streams', value: formatNumber(totalStreams) },
            { label: 'Total listeners', value: formatNumber(totalListeners) }
        ].map(stat => (
            <div key={stat.label} className="flex flex-col justify-center items-center h-full text-center p-8">
                 <div className="w-48 h-48 border-4 border-black p-2">
                    <img src={latestAlbumCover} alt="Artist" className="w-full h-full object-cover"/>
                </div>
                <p className="font-bold text-3xl mt-8">{stat.label}</p>
                <p className="font-anton text-8xl md:text-9xl text-[#FE3617] leading-none mt-2">{stat.value}</p>
            </div>
        )),
        // Slide 4: Top Song
        topSong && <div className="flex flex-col justify-center items-center h-full text-center p-4">
            <div className="bg-white border-4 border-black p-4 rotate-[-3deg] shadow-lg">
                <p className="font-bold text-xl">Your #1 song of {year}</p>
                <p className="font-anton text-5xl my-2">{topSong.title}</p>
                 <div className="w-48 h-48 border-2 border-black p-1 mx-auto">
                    <img src={topSong.coverArt} alt={topSong.title} className="w-full h-full object-cover"/>
                </div>
                <div className="flex justify-around mt-4">
                    <div>
                        <p className="font-anton text-4xl text-[#FE3617]">{formatNumber(topSong.streams)}</p>
                        <p className="font-bold">Streams</p>
                    </div>
                     <div>
                        <p className="font-anton text-4xl text-[#FE3617]">{formatNumber(topSong.streams * 0.1)}</p>
                        <p className="font-bold">Listeners</p>
                    </div>
                </div>
            </div>
        </div>,
        // Slide 5: Top 10 Songs
        <div className="flex flex-col justify-center h-full p-4">
            <div className="bg-white border-4 border-black p-4 w-full max-w-md mx-auto">
                <p className="font-bold text-2xl mb-4">Your Top Songs of {year}</p>
                <div className="space-y-2">
                    {topSongs.map((song, i) => (
                        <div key={song.id} className="flex items-center gap-2">
                            <span className="font-anton text-2xl w-8">#{i+1}</span>
                            <div>
                                <p className="font-bold leading-tight">{song.title}</p>
                                <p className="text-sm font-semibold">{formatNumber(song.streams)} Streams</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>,
        // Slide 6: Top Albums
        <div className="flex flex-col justify-center h-full p-4 text-center">
            <p className="text-lg leading-tight max-w-xs mx-auto">We tallied the streams of the songs from your top albums.</p>
            <p className="text-lg leading-tight max-w-xs mx-auto font-bold mt-2">Here's how they stacked up.</p>
            <div className="mt-8 space-y-4 max-w-sm mx-auto">
                {topAlbums.map((album, i) => (
                    <div key={album.id} className="flex items-center gap-4">
                        <img src={album.coverArt} className="w-20 h-20 object-cover" />
                        <div className="bg-black text-white p-2 text-left">
                            <p className="font-anton text-2xl">0{i+1}</p>
                            <p className="font-bold text-lg leading-tight">{album.title}</p>
                            <p className="text-sm">{formatNumber(album.streams)} Streams</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>,
        // Persona Slides
        ...personaSongs.map(({ song, persona, description }) => (
            <div key={song.id} className="h-full flex flex-col justify-center items-center text-center p-4">
                <div className="relative w-48 h-48">
                     <img src={song.coverArt} className="w-full h-full object-cover transform rotate-[-8deg] border-4 border-black"/>
                </div>
                <p className="font-anton text-5xl text-[#A99AFF] mt-8">{persona}</p>
                <p className="font-bold text-xl mt-2">{song.title}</p>
                <p className="mt-2 max-w-xs">{description}</p>
            </div>
        ))
    ].filter(Boolean);

    const handleClose = () => dispatch({ type: 'CHANGE_VIEW', payload: 'spotifyForArtists' });

    return (
        <div className="fixed inset-0 bg-[#F3F0EC] text-[#191414] z-40 font-sans overflow-hidden">
            <div className="absolute top-0 left-0 right-0 p-4 z-20">
                <div className="flex items-center gap-2">
                    {slides.map((_, i) => (
                        <div key={i} className="flex-1 h-1 bg-black/20 rounded-full">
                            <div className={`h-1 bg-black rounded-full transition-all duration-300 ${i <= slideIndex ? 'w-full' : 'w-0'}`} />
                        </div>
                    ))}
                </div>
                <button onClick={handleClose} className="absolute top-2 right-2 text-3xl font-bold">&times;</button>
            </div>
            
            <div className="h-full">
                {slides[slideIndex]}
            </div>

            <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-between">
                <button onClick={() => setSlideIndex(s => Math.max(0, s - 1))} disabled={slideIndex === 0} className="font-bold text-lg disabled:opacity-30">Back</button>
                {slideIndex < slides.length - 1 && (
                    <button onClick={() => setSlideIndex(s => Math.min(slides.length - 1, s + 1))} className="font-bold text-lg">Next</button>
                )}
            </div>
        </div>
    );
};

export default SpotifyWrappedView;
