import React, { useState } from 'react';
import { useGame, formatNumber } from '../context/GameContext';
import { ActingRole } from '../types';

const ImdbView: React.FC = () => {
    const { activeArtist, activeArtistData, dispatch, gameState } = useGame();
    const [isEditing, setIsEditing] = useState(false);
    const [editBio, setEditBio] = useState('');
    const [editBirthDate, setEditBirthDate] = useState('');

    if (!activeArtist || !activeArtistData) return null;

    const profile = activeArtistData.imdbProfile || {};
    const roles = activeArtistData.actingRoles || [];
    const soundtracksSingles = (activeArtistData.songs || []).filter(s => s.soundtrackTitle).map(s => ({
        id: s.id,
        title: s.soundtrackTitle!,
        type: 'Soundtrack',
        roleName: `Performer: "${s.title}"`,
        year: s.releaseDate?.year || 2024,
        status: 'Released' as const
    }));

    const soundtracksAlbums = (activeArtistData.releases || []).filter(r => r.soundtrackInfo).map(r => ({
        id: r.id,
        title: r.soundtrackInfo!.albumTitle,
        type: 'Soundtrack',
        roleName: `Composer/Performer`,
        year: r.releaseDate?.year || 2024,
        status: 'Released' as const
    }));

    const soundtracks = [...soundtracksSingles, ...soundtracksAlbums];

        const podcastRoles = (gameState.podcasts || []).filter(p => p.host === activeArtist.name).map(p => ({
        id: p.id,
        title: p.name,
        type: 'TV Show',
        roleName: 'Host (Self)',
        year: p.episodes.length > 0 ? p.episodes[0].releaseDate.year : 2024,
        status: 'Released' as const,
        coverUrl: p.coverArt,
        rating: p.imdbRating
    }));
    
    const guestPodcasts = (gameState.podcasts || []).filter(p => p.episodes.some(ep => ep.guestName === activeArtist.name)).map(p => ({
        id: p.id + "_guest",
        title: p.name,
        type: 'TV Show',
        roleName: 'Guest (Self)',
        year: p.episodes.find(ep => ep.guestName === activeArtist.name)?.releaseDate.year || 2024,
        status: 'Released' as const,
        coverUrl: p.coverArt,
        rating: p.imdbRating
    }));

    const allCredits = [...roles, ...soundtracks, ...podcastRoles, ...guestPodcasts].sort((a, b) => b.year - a.year);

    const releasedTrailers = roles.filter(r => !!r.trailerUrl);
    const latestTrailer = releasedTrailers.length > 0 ? releasedTrailers[0] : null;

    const hasSoundtrack = soundtracks.length > 0;

    let subTags = [];
    if ((activeArtistData.songs || []).length > 0 || (activeArtistData.releases || []).length > 0) subTags.push("Musical Artist");
    if (roles.some(r => r.type === 'Movie' || r.type === 'TV Show')) subTags.push("Actress");
    if (roles.some(r => r.type === 'Voice Acting')) subTags.push("Voice Actress");
    if (hasSoundtrack) subTags.push("Composer");
    
    if (subTags.length === 0) subTags.push("Musical Artist");

    const handleSave = () => {
        dispatch({
            type: 'UPDATE_IMDB_PROFILE',
            payload: { bio: editBio, birthDate: editBirthDate }
        });
        setIsEditing(false);
    };

    const handleEditClick = () => {
        setEditBio(profile.bio || '');
        setEditBirthDate(profile.birthDate || '');
        setIsEditing(true);
    };

    return (
        <div className="h-full flex flex-col bg-[#121212] text-white overflow-hidden max-w-[400px] mx-auto border-x border-zinc-800">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-[#1f1f1f] shadow-md z-10 shrink-0">
                <button onClick={() => dispatch({ type: 'CHANGE_VIEW', payload: 'socials' })} className="text-zinc-400 hover:text-white">
                    <svg fill="currentColor" viewBox="0 0 24 24" width="24" height="24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path></svg>
                </button>
                <div className="font-bold text-lg flex items-center gap-1">
                    <span className="text-[#f5c518] font-black">IMDb</span>
                </div>
                <div className="w-6"></div>
            </div>

            <div className="flex-1 overflow-y-auto hide-scrollbar">
                {/* Title Section */}
                <div className="p-4 pb-0">
                    <h1 className="text-3xl font-semibold mb-1">{activeArtist.name}</h1>
                    <p className="text-sm text-zinc-400">{subTags.join(' • ')}</p>
                </div>

                {/* Main Media/Trailer */}
                <div className="w-full relative mt-4 aspect-video bg-zinc-900 border-y border-zinc-800">
                    {latestTrailer ? (
                        <>
                            <img src={latestTrailer.trailerUrl} alt="Trailer" className="w-full h-full object-cover opacity-80" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-16 rounded-full bg-black/60 border-2 border-white flex items-center justify-center pl-1 cursor-pointer hover:bg-black/80">
                                    <svg fill="white" viewBox="0 0 24 24" width="32" height="32"><path d="M8 5v14l11-7z"></path></svg>
                                </div>
                            </div>
                            <div className="absolute bottom-2 left-4 text-white drop-shadow-md">
                                <p className="font-bold">Play trailer 1:02</p>
                                <p className="text-sm">{latestTrailer.title} ({latestTrailer.year})</p>
                            </div>
                        </>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-600 font-medium">
                            No Trailers Available
                        </div>
                    )}
                </div>

                {/* Profile Card */}
                <div className="p-4 flex gap-4">
                    <div className="w-24 shrink-0">
                        <img src={activeArtist.image} className="w-full aspect-[2/3] object-cover rounded-md" alt="Profile" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                        {isEditing ? (
                            <div className="space-y-2">
                                <textarea 
                                    className="w-full bg-zinc-800 text-sm p-2 rounded text-white resize-none" 
                                    placeholder="Short bio..." 
                                    value={editBio} 
                                    onChange={e => setEditBio(e.target.value)}
                                    rows={3}
                                />
                                <input 
                                    type="text" 
                                    className="w-full bg-zinc-800 text-sm p-2 rounded text-white" 
                                    placeholder="Born (e.g., August 26, 1986)" 
                                    value={editBirthDate} 
                                    onChange={e => setEditBirthDate(e.target.value)}
                                />
                                <div className="flex gap-2">
                                    <button onClick={() => setIsEditing(false)} className="flex-1 text-xs py-1 bg-zinc-700 rounded">Cancel</button>
                                    <button onClick={handleSave} className="flex-1 text-xs py-1 bg-[#f5c518] text-black font-bold rounded">Save</button>
                                </div>
                            </div>
                        ) : (
                            <div className="relative group">
                                <button onClick={handleEditClick} className="absolute -top-1 -right-1 p-1 bg-zinc-800 rounded opacity-0 group-hover:opacity-100 transition-opacity text-xs"><svg fill="currentColor" width="12" height="12" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg></button>
                                <p className="text-sm line-clamp-4 leading-snug">{profile.bio || "No biography available. Click edit to add."}</p>
                                <div className="mt-2 text-sm">
                                    <span className="font-bold">Born</span> {profile.birthDate || "Unknown"}
                                </div>
                            </div>
                        )}
                        <div className="mt-4">
                            <button className="w-full bg-[#f5c518] text-black font-bold py-2 rounded-sm flex items-center justify-center gap-2">
                                <svg fill="currentColor" width="20" height="20" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>
                                Add to favorite people
                            </button>
                        </div>
                    </div>
                </div>

                {/* Credits Section */}
                <div className="mt-2 p-4 pt-0">
                    <div className="flex items-center justify-between mb-4 border-l-4 border-[#f5c518] pl-2">
                        <h2 className="text-xl font-bold">Credits</h2>
                    </div>

                    <div className="space-y-6">
                        {allCredits.length > 0 ? allCredits.map(credit => (
                            <div key={credit.id + credit.roleName} className="flex gap-4 items-start pb-4 border-b border-zinc-800">
                                <label className="w-12 h-16 shrink-0 bg-zinc-800 rounded overflow-hidden cursor-pointer relative block group">
                                    {(credit as any).coverUrl ? (
                                        <img src={(credit as any).coverUrl} className="w-full h-full object-cover" />
                                    ) : (credit as any).trailerUrl ? (
                                        <img src={(credit as any).trailerUrl} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs text-zinc-500">{credit.type.substring(0,2)}</div>
                                    )}
                                    <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center">
                                        <svg fill="white" viewBox="0 0 24 24" width="16" height="16"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg>
                                    </div>
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file && (credit as any).id) {
                                                const reader = new FileReader();
                                                reader.onload = (event) => {
                                                    const result = event.target?.result as string;
                                                    dispatch({ type: 'SET_ACTING_COVER_URL', payload: { roleId: (credit as any).id, coverUrl: result } });
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                </label>
                                <div className="flex-1">
                                    <h3 className="font-bold text-[15px]">{credit.title}</h3>
                                    <p className="text-sm text-zinc-400">{credit.roleName}</p>
                                    <p className="text-xs text-zinc-500 mt-1">{credit.year} • {credit.type}</p>
                                </div>
                                {(credit as any).rating && (
                                    <div className="flex items-center gap-1 shrink-0 text-sm">
                                        <svg fill="#f5c518" viewBox="0 0 24 24" width="16" height="16"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                                        <span className="text-zinc-300">{(credit as any).rating.toFixed(1)}</span>
                                    </div>
                                )}
                            </div>
                        )) : (
                            <div className="text-center text-zinc-500 py-8">
                                No credits yet. Request acting gigs from your manager.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImdbView;
