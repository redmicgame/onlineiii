import fs from 'fs';

let code = fs.readFileSync('components/ImdbView.tsx', 'utf8');

const podRoles = `    const podcastRoles = (gameState.podcasts || []).filter(p => p.host === activeArtist.name).map(p => ({
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

    const allCredits = [...roles, ...soundtracks, ...podcastRoles, ...guestPodcasts].sort((a, b) => b.year - a.year);`;

code = code.replace("const allCredits = [...roles, ...soundtracks].sort((a, b) => b.year - a.year);", podRoles);

fs.writeFileSync('components/ImdbView.tsx', code);
