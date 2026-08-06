
import { Label, Manager, SecurityTeam, TalentAgency } from './types';
import { ArtistData } from './types';

export const INITIAL_MONEY = 100000;

export const GENRES = ['Pop', 'Hip Hop', 'R&B', 'Rock', 'Electronic', 'Indie', 'Country', 'Christmas', 'K-Pop', 'Latin', 'Afrobeats', 'Reggae'];
export const SUBGENRES = ['None', 'Teen Pop Boyband', 'Ringtone Rap', 'Electro-Pop', 'EDM', 'Festival', 'Trap', 'Alt-Pop', 'Singer-Songwriter'];


export const STUDIOS = [
    { name: 'Voice Memos', cost: 0, qualityRange: [1, 5] },
    { name: 'Bedroom Studio', cost: 5000, qualityRange: [10, 50] },
    { name: 'Local Studio', cost: 20000, qualityRange: [30, 70] },
    { name: 'Pro Studio', cost: 80000, qualityRange: [50, 90] },
    { name: 'Legendary Studio', cost: 250000, qualityRange: [70, 100] },
];

export const REVIEW_COST = 1000;

export const REVIEWER_NAMES = [
    'Jianna Dominguez',
    'Marcus Finch',
    'Corinne Bailey',
    'Leo Valdez',
    'Simone Dubois',
    'Rich Juzwiak',
    'Elena Petrova',
    'Samir Gupta'
];

// YouTube Constants
export const VIDEO_COSTS = {
    'Visualizer': 5000,
    'Lyric Video': 15000,
    'Music Video': 50000,
    'Custom': 2500,
};

export const SUBSCRIBER_THRESHOLD_STORE = 500000;
export const SUBSCRIBER_THRESHOLD_VERIFIED = 1000000;
export const VIEWS_THRESHOLD_VERIFIED = 10000000;

// Merch Constants
export const MERCH_PRODUCT_LIMIT = 30;

// Economy Constants
export const STREAM_INCOME_MULTIPLIER = 0.004; // $0.004 per stream
export const VIEW_INCOME_MULTIPLIER = 0.001; // $0.001 per view
export const CATALOG_VALUE_MULTIPLIER = 0.5; // Catalog is worth $0.50 per total stream

export const TIER_LEVELS: { [key in Label['tier']]: number } = {
    'Low': 1,
    'Mid-Low': 2,
    'Mid-high': 3,
    'Top': 4,
};


// Promotion Constants
export const getPromotionPackages = (year: number) => {
    const packages: any = {
        song: [],
        video: [],
        resurgence: []
    };

    // --- SONG PROMOTIONS ---
    
    // Core physical/radio era
    if (year < 2010) {
        packages.song.push({ name: 'Street Team Flyers', weeklyCost: 500, boost: 1.2, description: 'Pay kids to hand out flyers and bootlegs at shows.', requiredTier: 'Low' });
        packages.song.push({ name: 'Radio Payola', weeklyCost: 15000, boost: 3.0, description: 'Under-the-table money to ensure spins.', requiredTier: 'Mid-Low' });
    }

    if (year >= 2003 && year < 2012) {
        packages.song.push({ name: 'MySpace Profile Blast', weeklyCost: 2500, boost: 1.8, description: 'Message blast local scene kids to put your song on their profile.', requiredTier: 'Low' });
    }

    if (year >= 2012) {
        packages.song.push({ name: 'Algorithmic Placement', weeklyCost: 10000, boost: 2.0, description: 'Guaranteed streaming playlist placement.', requiredTier: 'Low' });
    }

    if (year >= 2010 && year < 2020) {
        packages.song.push({ name: 'Twitter PR Beef', weeklyCost: 40000, boost: 3.5, description: 'Manufacture a beef online to drive song streams.', requiredTier: 'Mid-high' });
    }

    if (year >= 2018) {
        packages.song.push({ name: 'TikTok Dance Challenge', weeklyCost: 80000, boost: 5.0, description: 'Pay influencers to make your hook go viral.', requiredTier: 'Mid-high' });
    }

    // Modern super-tier
    packages.song.push({ name: 'Industry Plant Initiative', weeklyCost: 150000, boost: 8.0, description: 'The label covers the world with your face.', requiredTier: 'Top' });

    // --- VIDEO PROMOTIONS ---
    if (year < 2010) {
        packages.video.push({ name: 'MTV TRL Manipulation', weeklyCost: 20000, boost: 3.0, description: 'Pay kids to call in to request the video hourly.' });
    } else {
        packages.video.push({ name: 'Homepage Hijack', weeklyCost: 8000, boost: 2.0, description: 'Front page video placement.' });
        packages.video.push({ name: 'Algorithmic Manipulation', weeklyCost: 25000, boost: 3.5, description: 'Force your video into the recommendation engine.' });
        packages.video.push({ name: 'Bot Farm Boost', weeklyCost: 100000, boost: 8.0, description: 'Simulate viral engagement with our network.' });
    }
    
    // --- RESURGENCE ---
    packages.resurgence.push({ name: 'Memory Machine', weeklyCost: 31250, boost: 10, description: 'Revive a classic with a modern "organic" trend.' });
    if (year >= 2018) {
        packages.resurgence.push({ name: 'TikTok Sound Rebirth', weeklyCost: 150000, boost: 40, description: 'Your old acoustic bridge becomes the #1 global trend.' });
    } else {
        packages.resurgence.push({ name: 'Feature Film Sync', weeklyCost: 125000, boost: 25, description: 'Get your old song featured in a blockbuster teen drama.' });
    }

    return packages;
};

// Spotify Constants
export const PLAYLIST_PITCH_COST = 5000;
export const PLAYLIST_PITCH_SUCCESS_RATE = 0.5; // 50%
export const PLAYLIST_BOOST_MULTIPLIER = 1.2;
export const PLAYLIST_BOOST_WEEKS = 2;


// Chart Constants
export const NPC_ARTIST_NAMES = [
    'Taylor Swift', 'Ariana Grande', 'Billie Eilish', 'The Weeknd', 'Drake', 
    'Justin Bieber', 'Ed Sheeran', 'Beyoncé', 'Rihanna', 'Adele', 
    'Post Malone', 'Dua Lipa', 'Olivia Rodrigo', 'Harry Styles', 'Bad Bunny',
    'Kendrick Lamar', 'J. Cole', 'Travis Scott', 'Doja Cat', 'SZA',
    'Lana Del Rey', 'Frank Ocean', 'Tyler, the Creator', 'Lil Nas X', 'Cardi B',
    'Nicki Minaj', 'Megan Thee Stallion', 'Kanye West', 'Jay-Z', 'Eminem',
    'Lady Gaga', 'Bruno Mars', 'Miley Cyrus', 'Selena Gomez', 'Demi Lovato',
    'Shawn Mendes', 'Camila Cabello', 'Halsey', 'Lorde', 'Charli XCX',
    'Coldplay', 'Imagine Dragons', 'Maroon 5', 'OneRepublic', 'Arctic Monkeys',
    'The 1975', 'Tame Impala', 'Glass Animals', 'FINNEAS', 'Jack Harlow',
    'Sabrina Carpenter', 'Tate McRae', 'Chappell Roan', 'Ice Spice', '21 Savage',
    'Future', 'Metro Boomin', 'Morgan Wallen', 'Luke Combs', 'Zach Bryan',
    'Peso Pluma', 'Karol G', 'Shakira', 'Rauw Alejandro', 'Anitta',
    // Added for more collaboration options
    // Female Rappers
    'Latto', 'GloRilla', 'Sexyy Red', 'Coi Leray', 'Flo Milli',
    'Charlie Puth', 'Katy Perry', 'Troye Sivan', 'ZAYN', 'Conan Gray', 'Kesha',
    'Playboi Carti', 'Lil Uzi Vert', 'Young Thug', 'A$AP Rocky', 'Lil Yachty', 
    'Pop Smoke', 'Juice WRLD', 'Gunna', 'Lil Baby',
    // K-Pop Artists
    'BTS', 'BLACKPINK', 'NewJeans', 'Stray Kids', 'TWICE', 'SEVENTEEN', 'LE SSERAFIM', '(G)I-DLE', 'Jungkook', 'Jennie', 'Lisa', 'aespa',
    // Latin Artists
    'J Balvin', 'Maluma', 'Rosalía', 'Feid', 'Myke Towers', 'Young Miko', 'Ozuna', 'Bizarrap',
    // Electronic Artists
    'Calvin Harris', 'David Guetta', 'Skrillex', 'Diplo', 'Zedd', 'Martin Garrix',
    // Reggae Artists
    'Bob Marley', 'Sean Paul', 'Koffee', 'Shaggy', 'Popcaan',
    // Afrobeats Artists
    'Burna Boy', 'Wizkid', 'Davido', 'Rema', 'Tems', 'Asake', 'Omah Lay',
    // Indie Artists
    
];

export const NPC_ARTIST_GENRES: Record<string, string> = {
    'Taylor Swift': 'Pop', 'Ariana Grande': 'Pop', 'Billie Eilish': 'Pop', 'The Weeknd': 'Pop', 'Drake': 'Hip Hop', 
    'Justin Bieber': 'Pop', 'Ed Sheeran': 'Pop', 'Beyoncé': 'R&B', 'Rihanna': 'Pop', 'Adele': 'Pop', 
    'Post Malone': 'Hip Hop', 'Dua Lipa': 'Pop', 'Olivia Rodrigo': 'Pop', 'Harry Styles': 'Pop', 'Bad Bunny': 'Latin',
    'Kendrick Lamar': 'Hip Hop', 'J. Cole': 'Hip Hop', 'Travis Scott': 'Hip Hop', 'Doja Cat': 'Hip Hop', 'SZA': 'R&B',
    'Lana Del Rey': 'Indie', 'Frank Ocean': 'R&B', 'Tyler, the Creator': 'Hip Hop', 'Lil Nas X': 'Hip Hop', 'Cardi B': 'Hip Hop',
    'Nicki Minaj': 'Hip Hop', 'Megan Thee Stallion': 'Hip Hop', 'Kanye West': 'Hip Hop', 'Jay-Z': 'Hip Hop', 'Eminem': 'Hip Hop',
    'Lady Gaga': 'Pop', 'Bruno Mars': 'Pop', 'Miley Cyrus': 'Pop', 'Selena Gomez': 'Pop', 'Demi Lovato': 'Pop',
    'Shawn Mendes': 'Pop', 'Camila Cabello': 'Pop', 'Halsey': 'Pop', 'Lorde': 'Indie', 'Charli XCX': 'Pop',
    'Coldplay': 'Rock', 'Imagine Dragons': 'Rock', 'Maroon 5': 'Pop', 'OneRepublic': 'Pop', 'Arctic Monkeys': 'Rock',
    'The 1975': 'Rock', 'Tame Impala': 'Indie', 'Glass Animals': 'Indie', 'FINNEAS': 'Indie', 'Jack Harlow': 'Hip Hop',
    'Sabrina Carpenter': 'Pop', 'Tate McRae': 'Pop', 'Chappell Roan': 'Pop', 'Ice Spice': 'Hip Hop', '21 Savage': 'Hip Hop',
    'Future': 'Hip Hop', 'Metro Boomin': 'Hip Hop', 'Morgan Wallen': 'Country', 'Luke Combs': 'Country', 'Zach Bryan': 'Country',
    'Peso Pluma': 'Latin', 'Karol G': 'Latin', 'Shakira': 'Latin', 'Rauw Alejandro': 'Latin', 'Anitta': 'Latin',
    'Latto': 'Hip Hop', 'GloRilla': 'Hip Hop', 'Sexyy Red': 'Hip Hop', 'Coi Leray': 'Hip Hop', 'Flo Milli': 'Hip Hop',
    'Charlie Puth': 'Pop', 'Katy Perry': 'Pop', 'Troye Sivan': 'Pop', 'ZAYN': 'Pop', 'Conan Gray': 'Pop', 'Kesha': 'Pop',
    'Playboi Carti': 'Hip Hop', 'Lil Uzi Vert': 'Hip Hop', 'Young Thug': 'Hip Hop', 'A$AP Rocky': 'Hip Hop', 'Lil Yachty': 'Hip Hop',
    'Pop Smoke': 'Hip Hop', 'Juice WRLD': 'Hip Hop', 'Gunna': 'Hip Hop', 'Lil Baby': 'Hip Hop',
    'BTS': 'K-Pop', 'BLACKPINK': 'K-Pop', 'NewJeans': 'K-Pop', 'Stray Kids': 'K-Pop', 'TWICE': 'K-Pop', 'SEVENTEEN': 'K-Pop', 'LE SSERAFIM': 'K-Pop', '(G)I-DLE': 'K-Pop', 'Jungkook': 'K-Pop', 'Jennie': 'K-Pop', 'Lisa': 'K-Pop', 'aespa': 'K-Pop',
    'J Balvin': 'Latin', 'Maluma': 'Latin', 'Rosalía': 'Latin', 'Feid': 'Latin', 'Myke Towers': 'Latin', 'Young Miko': 'Latin', 'Ozuna': 'Latin', 'Bizarrap': 'Latin',
    'Calvin Harris': 'Electronic', 'David Guetta': 'Electronic', 'Skrillex': 'Electronic', 'Diplo': 'Electronic', 'Zedd': 'Electronic', 'Martin Garrix': 'Electronic',
    'Bob Marley': 'Reggae', 'Sean Paul': 'Reggae', 'Koffee': 'Reggae', 'Shaggy': 'Reggae', 'Popcaan': 'Reggae',
    'Burna Boy': 'Afrobeats', 'Wizkid': 'Afrobeats', 'Davido': 'Afrobeats', 'Rema': 'Afrobeats', 'Tems': 'Afrobeats', 'Asake': 'Afrobeats', 'Omah Lay': 'Afrobeats',
    
};
export const NPC_SONG_ADJECTIVES = ['Golden', 'Ordinary', 'What I', 'Your', 'Midnight', 'Electric', 'Fading', 'Broken', 'Summer', 'Winter', 'Lost', 'Found', 'Starlight', 'City', 'Velvet', 'Crystal', 'Silent', 'Cosmic', 'Wild', 'Sweet', 'Bitter'];
export const NPC_SONG_NOUNS = ['Idol', 'Want', 'Dreams', 'Rain', 'Lights', 'Hearts', 'Echoes', 'Sky', 'Moon', 'Sun', 'Stars', 'Ocean', 'River', 'Memories', 'Secrets', 'Lies', 'Truth', 'Flames', 'Sparks', 'Ghosts'];
export const NPC_COVER_ART = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6I2NjY2NjYztzdG9wLW9wYWNpdHk6MSIgLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojOTk5OTk5O3N0b3Atb3BhY2l0eToxIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9InVybCgjZykiIC8+CiAgPHRleHQgeD0iNTAlIiB5PSI1NCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iIzAwMCI+YmlsbGJvYXJkPC90ZXh0Pgo8L3N2Zz4=';


// Record Label Constants
export const LABELS: Label[] = [
    { 
        id: 'umg', 
        name: 'UMG', 
        tier: 'Top',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIzMiIgY3k9IjMyIiByPSIzMiIgZmlsbD0iIzE5MTkxOSIvPjxwYXRoIGQ9Ik0zMiA1Mi4yODhjLTExLjIxMyAwLTIwLjI4OC05LjA3NS0yMC4yODgtMjAuMjg4IDAtMTEuMjEzIDkuMDc1LTIwLjI4OCAyMC4yODgtMjAuMjg4IDExLjIxMyAwIDIwLjI4OCA5LjA3NSAyMC4yODggMjAuMjg4IDAgMTEuMjEzLTkuMDc1IDIwLjI4OC0yMC4yODggMjAuMjg4ek0zMiAxNS43ODhjLTYuNzUgMC0xMi4yMjUgNS40NzYtMTIuMjI1IDEyLjIyNCAwIDYuNzUgNS40NzUgMTIuMjI1IDEyLjIyNSAxMi4yIjc1IDYuNzQ4IDAgMTIuMjI0LTUuNDc1IDEyLjIyNC0xMi4yMjUgMC02Ljc0OC01LjQ3NC0xMi4yMjQtMTIuMjI0LTEyLjIyNHoiIGZpbGw9IndoaXRlIi8+PC9zdmc+', 
        promotionMultiplier: 2.0, 
        creativeControl: 80,
        minQuality: 68,
        streamRequirement: 1_000_000_000,
        youtubeChannel: {
            name: 'Universal Music Group',
            handle: '@universalmusicgroup',
            subscribers: 58_000_000,
            banner: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
        }
    },
    { 
        id: 'interscope', 
        name: 'Interscope Records', 
        tier: 'Mid-high',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIzMiIgY3k9IjMyIiByPSIzMiIgZmlsbD0iYmxhY2siLz48cGF0aCBkPSJNMjggMjBIMzZWMjRIMjhWMjBaIiBmaWxsPSJ3aGl0ZSIvPjxwYXRoIGQ9Ik0zMCAyNkgzNFY0NEgzMFYyNloiIGZpbGw9IndoaXRlIi8+PC9zdmc+', 
        promotionMultiplier: 1.7, 
        creativeControl: 70,
        minQuality: 60,
        streamRequirement: 750_000_000,
    },
    { 
        id: 'republic', 
        name: 'Republic Records', 
        tier: 'Mid-high',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHJ4PSI4IiBmaWxsPSIjRkZGRkZGIi8+PHBhdGggZD0iTTMyIDYuMzk4YzQuMjY0IDAgOC40NTYgMS40MyAxMS45NDQgNC4wNDVMOC4zNiAzMS4xMjhWMTAuNDQzQzE1MjIgNy44MyAyMy4yNTYgNi40IDMyIDYuNHpNMzIgNTcuNmMtNC4yNjQgMC04LjQ1Ni0xLjQzLTExLjk0NC00LjA0NUw1NS42NCAzMi44NzJ2MjAuNjg1Yy02LjgtMi42MTItMTQuODU2LTQuMDQzLTIzLjY0LTQuMDQzeiIgZmlsbD0iIzAwMCIvPjwvc3ZnPg==', 
        promotionMultiplier: 1.5, 
        creativeControl: 60,
        minQuality: 50,
        streamRequirement: 500_000_000,
    },
    { 
        id: 'columbia', 
        name: 'Columbia Records', 
        tier: 'Mid-Low',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9ImJsYWNrIi8+PHBhdGggZD0iTTMyIDE2QzE2IDE2IDggMzIgOCAzMkM4IDMyIDE2IDQ4IDMyIDQ4QzQ4IDQ4IDU2IDMyIDU2IDMyQzU2IDMyIDQ4IDE2IDMyIDE2WiIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSI0Ii8+PGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iOCIgZmlsbD0id2hpdGUiLz48L3N2Zz4=', 
        promotionMultiplier: 1.4, 
        creativeControl: 50,
        minQuality: 45,
        streamRequirement: 275_000_000,
        youtubeChannel: {
            name: 'Columbia Records',
            handle: '@columbiarecords',
            subscribers: 12_500_000,
            banner: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
        }
    },
    { 
        id: 'rca', 
        name: 'RCA Records', 
        tier: 'Mid-Low',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIzMiIgY3k9IjMyIiByPSIzMiIgZmlsbD0iIzAwMCIvPjxwYXRoIGQ9Ik0zMiA1MC42NjdjLTEwLjMxIDAtMTguNjY3LTguMzU3LTE4LjY2Ny0xOC42NjdzOC4zNTctMTguNjY3IDE4LjY2Ny0xOC42NjcgMTguNjY3IDguMzU3IDE4LjY2NyAxOC42NjctOC4zNTcgMTguNjY3LTE4LjY2NyAxOC42Njd6IiBmaWxsPSIjRTQxRTI3Ii8+PHBhdGggZD0iTTMyIDE4LjY2N2MtMi43NTIgMC01LjM5IDEuMTU1LTYuNTM0IDMuMzQybC0uMDA4LjAxM2MtLjE0OS4yNTYtLjIyNi41NTYtLjIyNi44NjggMCAuNzY1LjYxOCAxLjM4MyAxLjM4MyAxLjM4My4zMTIgMCAuNjA3LS4xMDMuODU1LS4yNzggMS40NjgtMS4wMzQgMy4xODUtMS41OTQgNC44NzUtMS42MS4wNTQgMCAuMTA2LjAwMi4xNi4wMDJhMS4zNjggMS4zNjggMCAwMC44MTMtLjU0MyAxLjM4MiAxLjM4MiAwIDAwLjM2OC0xLjYyNWMtLjA1My0uMDk1LS4xMTYtLjE4My0uMTg4LS4yNjQtLjk4LTEuMzMtMi40Ny0yLjA3NC00LjA5NS0yLjA3NHptLTkuMDI2IDE0LjYyNWMxLjQ0OC4wMDQgMi44OTU-.27IDQuMjM1LS44MDJsLjEyNC0uMDQ4Yy4yMDctLjA3OC40My0uMTE4LjY1LS4xMTguNzc1IDAgMS40MDQuNjMgMS40MDQgMS40MDQgMCAuMjE4LS4wNTIuNDM1LS4xNDguNjM0bC0uMDIuMDQyYy0xLjgwNyAzLjA0Mi00LjQ4IDQuNzctNy4xNzQgNC43Ny0zLjQ0NyAwLTYuNTYtMi4zNDYtNy42NzMtNS44MDgtLjA1NC0uMTcxLS4wODQtLjM1LS4wODQtLjUzNCAwLS43NzUuNjMtMS40MDQgMS40MDQtMS40MDQuMjM1IDAgLjQ2LjA2LjY2LjE2OGwxLjQ5LjY3OGMxLjMyLjYgMi43NS45MzYgNC4yNDIuOTM2em0xOC45MDgtMi40MjJjLTEuMjgtLjg4OC0yLjczLTEuMzk0LTQuMjYtMS40MDgtMi4zOTgtLjAyLTIuNTU4LS4wMi00LjY2Ni4wMDItLjg3NS4wMDItMS42NzctLjMxMi0yLjQ5LS44NzUtMS44MTctMS4yNi0yLjQxNy0zLjM4My0xLjczNC01LjU4LjU1NC0xLjc3NiAyLjA1OC0zLjA2NyAzLjg1NC0zLjQ0OC4yMS0uMDQ0LjQzLS4wNjYuNjUtLjA2Ni43NzUgMCAxLjQwNC42MyAxLjQwNCAxLjQwNCAwIC4yOS0uMDkgLjU2OC0uMjQ4LjgwMmwtLjQzMi42NDhjLS40MTcuNjI0LS45OC45OTYtMS42MTguOTk2LS4zMSAwLS41OTgtLjA3OC0uODYyLS4yMzZsLS4xMy0uMDhjLS4xOC0uMTE1LS4yODMtLjMxMi0uMjgzLS41MiAwLS4zMTIuMTY0LS42LjQyNC0uNzY2bC4wNTctLjAzNWMuNTE0LS4zMiAxLjA3My0uNDggMS42Ni0uNDgucDEuNzM4Yy4zOTIgMCAuNzU3LjE1NSAxLjAyNC40MzZsLjAzNi4wMzRjLjI2LjI1LjM5Ny41OTIuMzk3Ljk1IDAgLjM2LS4xNDIuNzA4LS4zOTcuOTYybC0uMDc0LjA3Yy0uNTU0LjUzNC0xLjI4NC44My0yLjA1LjgzLS4wMiAwIDAgMCAwIDBsLTMuMTQ4LjAwMmMtLjMxMiAwLS42LS4xMi0uODI4LS4zMjgtLjIzLS4yMi0uMzYtLjUxLS4zNi0uODI2IDAtLjI4OC4xLS4wNjIuMjgzLS43NzZsLjAxLS4wMTJjLjc3NS0uOTEyIDEuODQtMS40MTggMi45Ny0xLjQxOCAxLjI5IDAgMi40NjIuNTggMy4yMzggMS41MzZsLjA0Mi4wNTFjLjM4LjQ2LjU4MyAxLjA0LjU4MyAxLjY0IDAgLjYtLjIwMyAxLjE4LS41OSAxLjY0eiIgZmlsbD0iI0ZGRiIvPjwvc3ZnPg==',
        promotionMultiplier: 1.2, 
        creativeControl: 40,
        minQuality: 40,
        streamRequirement: 200_000_000,
    },
    { 
        id: 'atlantic', 
        name: 'Atlantic Records', 
        tier: 'Mid-Low',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIzMiIgY3k9IjMyIiByPSIzMiIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSIzMiIgY3k9IjMyIiByPSIyOCIgZmlsbD0iYmxhY2siLz48cGF0aCBkPSJNMzIgMTZMNDQgNDhIMzlMMzUuNSAzOEgyOC41TDI1IDQ4SDIwTDMyIDE2Wk0zMCAzNEgzNEwzMiAyOEwzMCAzNFoiIGZpbGw9IndoaXRlIi8+PC9zdmc+',
        promotionMultiplier: 1.15, 
        creativeControl: 30,
        minQuality: 30,
        streamRequirement: 50_000_000,
    },
    { 
        id: 'epic', 
        name: 'Epic Records', 
        tier: 'Low',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9ImJsYWNrIi8+PHBhdGggZD0iTTIwIDIwSDQ0VjI2SDIwVjIwWiIgZmlsbD0id2hpdGUiLz48cGF0aCBkPSJNMjAgMzBIMzhWMzZIMjBWMzBaIiBmaWxsPSJ3aGl0ZSIvPjxwYXRoIGQ9Ik0yMCA0MEg0NFY0NkgMjBWMDRaIiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==', 
        promotionMultiplier: 1.12, 
        creativeControl: 25,
        minQuality: 20,
        streamRequirement: 10_000_000,
        youtubeChannel: {
            name: 'Epic Records',
            handle: '@epicrecords',
            subscribers: 9_200_000,
            banner: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
        }
    },
    { 
        id: 'island', 
        name: 'Island Records', 
        tier: 'Low',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNjQgMzJDMjguNjU0IDMyIDAgMzIgMCAzMiIgZmlsbD0id2hpdGUiLz48cGF0aCBkPSJNMCAzMkM1IDMyIDMyIDU5IDMyIDU5IiBmaWxsPSJ3aGl0ZSIvPjxwYXRoIGQ9Ik02NCAzMkM1OSA0MSAzMiA1OSAzMiA1OSIgZmlsbD0iIzAwQjk5RiIvPjxwYXRoIGQ9Ik0wIDMyQzUgMjMgMzIgNSAzMiA1IiBmaWxsPSIjRkZBMDNDIi8+PHBhdGggZD0iTTY0IDMyQzU5IDIzIDMyIDUgMzIgNSIgZmlsbD0id2hpdGUiLz48cGF0aCBkPSJNMCAzMkMzLjUgMzIgMzIgMzIgMzIgMzIiIGZpbGw9IiMwMEI5OUYiLz48L3N2Zz4=',
        promotionMultiplier: 1.1, 
        creativeControl: 20,
        minQuality: 0,
        streamRequirement: 1_000_000,
        youtubeChannel: {
            name: 'Island Records',
            handle: '@islandrecords',
            subscribers: 5_100_000,
            banner: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
        }
    },
    { 
        id: 'quality_control', 
        name: 'Quality Control Music', 
        tier: 'Mid-high',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIzMiIgY3k9IjMyIiByPSIzMiIgZmlsbD0iYmxhY2siLz48dGV4dCB4PSIzMiIgeT0iMzciIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC1zaXplPSIyNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5RQzwvdGV4dD48L3N2Zz4=',
        promotionMultiplier: 1.6, 
        creativeControl: 65,
        minQuality: 70,
        streamRequirement: 0,
        contractType: 'petty'
    },
    { 
        id: 'tde', 
        name: 'Top Dawg Entertainment', 
        tier: 'Top',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIzMiIgY3k9IjMyIiByPSIzMiIgZmlsbD0iYmxhY2siLz48dGV4dCB4PSIzMiIgeT0iMzciIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjIyIiBmb250LXdlaWdodD0iOTAwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VERFPC90ZXh0Pjwvc3ZnPg==',
        promotionMultiplier: 1.8, 
        creativeControl: 85,
        minQuality: 70,
        streamRequirement: 0,
        contractType: 'petty'
    },
    { 
        id: 'roc_nation', 
        name: 'Roc Nation', 
        tier: 'Top',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIzMiIgY3k9IjMyIiByPSIzMiIgZmlsbD0iYmxhY2siLz48cGF0aCBkPSJNMjEuNSA0MC41TDUwLjUgMTguNUwzMi41IDM0LjVMMzggNDUuNUwyMS41IDQwLjVaIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==',
        promotionMultiplier: 1.9, 
        creativeControl: 80,
        minQuality: 70,
        streamRequirement: 0,
        contractType: 'petty'
    },
{
    "id": "def_jam",
    "name": "Def Jam Recordings",
    "tier": "Mid-high",
    "logo": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiMxMTEiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjRkZGIj5ERUYgSkFNPC90ZXh0Pjwvc3ZnPg==",
    "promotionMultiplier": 1.6,
    "creativeControl": 65,
    "minQuality": 50,
    "streamRequirement": 350000000
},
{
    "id": "bad_boy",
    "name": "Bad Boy Records",
    "tier": "Mid-Low",
    "logo": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiMwMDAiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjRkZGIj5CQUQgQk9ZPC90ZXh0Pjwvc3ZnPg==",
    "promotionMultiplier": 1.3,
    "creativeControl": 60,
    "minQuality": 40,
    "streamRequirement": 10000,
    "activeFromYear": 1998,
    "activeUntilYear": 2013
},
{
    "id": "polydor",
    "name": "Polydor Records",
    "tier": "Mid-Low",
    "logo": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiNEMDAiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjRkZGIj5QT0xZRE9SPC90ZXh0Pjwvc3ZnPg==",
    "promotionMultiplier": 1.2,
    "creativeControl": 50,
    "minQuality": 40,
    "streamRequirement": 0,
    "activeFromYear": 2013
},
{
    "id": "nice_life",
    "name": "Nice Life",
    "tier": "Low",
    "logo": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiNGOTAiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjRkZGIj5OSUNFIExJRkU8L3RleHQ+PC9zdmc+",
    "promotionMultiplier": 1.1,
    "creativeControl": 80,
    "minQuality": 30,
    "streamRequirement": 0,
    "activeFromYear": 2018,
    "isDistributionOnly": true
},
{
    "id": "sony",
    "name": "Sony Music",
    "tier": "Top",
    "logo": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiNEMDAiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjRkZGIj5TT05ZPC90ZXh0Pjwvc3ZnPg==",
    "promotionMultiplier": 2,
    "creativeControl": 75,
    "minQuality": 65,
    "streamRequirement": 5000000000
},
{
    "id": "capitol",
    "name": "Capitol Records",
    "tier": "Mid-Low",
    "logo": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiMwMDkiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjRkZGIj5DQVBJVE9MPC90ZXh0Pjwvc3ZnPg==",
    "promotionMultiplier": 1.3,
    "creativeControl": 55,
    "minQuality": 45,
    "streamRequirement": 1000000
},
{
    "id": "motown",
    "name": "Motown Records",
    "tier": "Low",
    "logo": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiMwMDUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjRkZGIj5NT1RPV048L3RleHQ+PC9zdmc+",
    "promotionMultiplier": 1.1,
    "creativeControl": 40,
    "minQuality": 30,
    "streamRequirement": 0
},
{
    "id": "geffen",
    "name": "Geffen Records",
    "tier": "Mid-Low",
    "logo": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiMyMjIiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjRkZGIj5HRUZGRU48L3RleHQ+PC9zdmc+",
    "promotionMultiplier": 1.4,
    "creativeControl": 60,
    "minQuality": 40,
    "streamRequirement": 3000000
},
{
    "id": "empire",
    "name": "EMPIRE",
    "tier": "Low",
    "logo": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiNGRkYiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjMDAwIj5FTVBJUkU8L3RleHQ+PC9zdmc+",
    "promotionMultiplier": 1.15,
    "creativeControl": 90,
    "minQuality": 25,
    "streamRequirement": 0,
    "isDistributionOnly": true
},
{
    "id": "virgin",
    "name": "Virgin Music Group",
    "tier": "Low",
    "logo": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiNFMDAiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjRkZGIj5WSVJHSU48L3RleHQ+PC9zdmc+",
    "promotionMultiplier": 1.2,
    "creativeControl": 50,
    "minQuality": 30,
    "streamRequirement": 0
},
];

export const CUSTOM_LABEL_TIERS = {
    'Indie': { cost: 50000, promotionMultiplier: 1.1, requiredStreams: 0 },
    'Mid': { cost: 500000, promotionMultiplier: 1.35, requiredStreams: 100_000_000 },
    'High': { cost: 1000000, promotionMultiplier: 1.75, requiredStreams: 350_000_000 },
};

// Tour Constants
export const TOUR_TIER_REQUIREMENTS: { [key: string]: number } = {
    'Small Halls': 20,
    'Large Halls': 40,
    'Arenas': 60,
    'Stadiums': 80,
};

export const TOUR_TICKET_PRICE_SUGGESTIONS: { [key: string]: number } = {
    'Small Halls': 25,
    'Large Halls': 45,
    'Arenas': 75,
    'Stadiums': 120,
};

export const VENUES = {
    'Small Halls': [
        { name: 'The Roxy', city: 'Los Angeles', capacity: 500, region: 'North America' }, { name: 'The Bowery Ballroom', city: 'New York', capacity: 575, region: 'North America' }, { name: 'The Independent', city: 'San Francisco', capacity: 500, region: 'North America' }, { name: 'Lincoln Hall', city: 'Chicago', capacity: 500, region: 'North America' }, { name: 'The Masquerade', city: 'Atlanta', capacity: 1000, region: 'North America' },
        { name: 'The Fillmore', city: 'San Francisco', capacity: 1315, region: 'North America' }, { name: '9:30 Club', city: 'Washington D.C.', capacity: 1200, region: 'North America' }, { name: 'First Avenue', city: 'Minneapolis', capacity: 1550, region: 'North America' }, { name: 'The Showbox', city: 'Seattle', capacity: 1150, region: 'North America' }, { name: "Stubb's BBQ", city: 'Austin', capacity: 1800, region: 'North America' },
        { name: 'The Fonda Theatre', city: 'Los Angeles', capacity: 1200, region: 'North America' }, { name: 'Brooklyn Steel', city: 'Brooklyn', capacity: 1800, region: 'North America' }, { name: 'Paradise Rock Club', city: 'Boston', capacity: 933, region: 'North America' }, { name: 'The Metro', city: 'Chicago', capacity: 1100, region: 'North America' }, { name: 'Ogden Theatre', city: 'Denver', capacity: 1600, region: 'North America' },
        { name: 'The Tabernacle', city: 'Atlanta', capacity: 2600, region: 'North America' }, { name: 'House of Blues', city: 'New Orleans', capacity: 843, region: 'North America' }, { name: 'The Wiltern', city: 'Los Angeles', capacity: 1850, region: 'North America' }, { name: "King Tut's Wah Wah Hut", city: 'Glasgow', capacity: 300, region: 'Europe' }, { name: 'The Troubadour', city: 'London', capacity: 550, region: 'Europe' },
        { name: 'Soweto Theatre', city: 'Johannesburg', capacity: 450, region: 'Africa' }, { name: 'Rolling Stone', city: 'Seoul', capacity: 800, region: 'Asia' }, { name: 'Anghami Lab', city: 'Riyadh', capacity: 400, region: 'Middle East' }
    ],
    'Large Halls': [
        { name: 'Hollywood Palladium', city: 'Los Angeles', capacity: 3700, region: 'North America' }, { name: 'Hammerstein Ballroom', city: 'New York', capacity: 3500, region: 'North America' }, { name: 'Aragon Ballroom', city: 'Chicago', capacity: 5000, region: 'North America' }, { name: 'The Anthem', city: 'Washington D.C.', capacity: 6000, region: 'North America' }, { name: 'Ryman Auditorium', city: 'Nashville', capacity: 2362, region: 'North America' },
        { name: 'Radio City Music Hall', city: 'New York', capacity: 6015, region: 'North America' }, { name: 'Greek Theatre', city: 'Los Angeles', capacity: 5870, region: 'North America' }, { name: 'Red Rocks Amphitheatre', city: 'Morrison', capacity: 9525, region: 'North America' }, { name: 'Bill Graham Civic Auditorium', city: 'San Francisco', capacity: 8500, region: 'North America' }, { name: 'The Met', city: 'Philadelphia', capacity: 3500, region: 'North America' },
        { name: 'O2 Academy Brixton', city: 'London', capacity: 4921, region: 'Europe' }, { name: 'Eventim Apollo', city: 'London', capacity: 5300, region: 'Europe' }, { name: "L'Olympia", city: 'Paris', capacity: 2000, region: 'Europe' }, { name: 'Massey Hall', city: 'Toronto', capacity: 2752, region: 'North America' }, { name: 'Fox Theater', city: 'Oakland', capacity: 2800, region: 'North America' },
        { name: 'The Chicago Theatre', city: 'Chicago', capacity: 3600, region: 'North America' }, { name: 'The Armory', city: 'Minneapolis', capacity: 8400, region: 'North America' }, { name: 'ACL Live at The Moody Theater', city: 'Austin', capacity: 2750, region: 'North America' }, { name: 'WaMu Theater', city: 'Seattle', capacity: 7000, region: 'North America' }, { name: 'The Fillmore', city: 'Detroit', capacity: 2900, region: 'North America' },
        { name: 'Dubai Opera', city: 'Dubai', capacity: 2000, region: 'Middle East' }, { name: 'Zepp DiverCity', city: 'Tokyo', capacity: 2500, region: 'Asia' }, { name: 'Grand Arena', city: 'Cape Town', capacity: 5000, region: 'Africa' }
    ],
    'Arenas': [

{ name: "Madison Square Garden", city: "New York", capacity: 19500, region: "North America" },
{ name: "Staples Center", city: "Los Angeles", capacity: 20000, region: "North America" },
{ name: "United Center", city: "Chicago", capacity: 23500, region: "North America" },
{ name: "Wells Fargo Center", city: "Philadelphia", capacity: 21000, region: "North America" },
{ name: "TD Garden", city: "Boston", capacity: 19580, region: "North America" },
{ name: "State Farm Arena", city: "Atlanta", capacity: 21000, region: "North America" },
{ name: "American Airlines Center", city: "Dallas", capacity: 20000, region: "North America" },
{ name: "Chase Center", city: "San Francisco", capacity: 18064, region: "North America" },
{ name: "O2 Arena", city: "London", capacity: 20000, region: "Europe" },
{ name: "Accor Arena", city: "Paris", capacity: 20300, region: "Europe" },
{ name: "Lanxess Arena", city: "Cologne", capacity: 20000, region: "Europe" },
{ name: "Mercedes-Benz Arena", city: "Berlin", capacity: 17000, region: "Europe" },
{ name: "Ziggo Dome", city: "Amsterdam", capacity: 17000, region: "Europe" },
{ name: "O2 Arena Prague", city: "Prague", capacity: 18000, region: "Europe" },
{ name: "Wiener Stadthalle", city: "Vienna", capacity: 16152, region: "Europe" },
{ name: "Palau Sant Jordi", city: "Barcelona", capacity: 17000, region: "Europe" },
{ name: "Wizink Center", city: "Madrid", capacity: 17453, region: "Europe" },
{ name: "Jeunesse Arena", city: "Rio de Janeiro", capacity: 18000, region: "South America" },
{ name: "Allianz Parque", city: "Sao Paulo", capacity: 43713, region: "South America" }, // Wait, this is a stadium, but maybe arena size configuration
{ name: "Movistar Arena", city: "Santiago", capacity: 15000, region: "South America" },
{ name: "Movistar Arena", city: "Buenos Aires", capacity: 15000, region: "South America" },
{ name: "Movistar Arena", city: "Bogota", capacity: 14000, region: "South America" },
{ name: "Saitama Super Arena", city: "Saitama", capacity: 36500, region: "Asia" },
{ name: "Yokohama Arena", city: "Yokohama", capacity: 17000, region: "Asia" },
{ name: "KSPO Dome", city: "Seoul", capacity: 15000, region: "Asia" },
{ name: "Impact Arena", city: "Bangkok", capacity: 11000, region: "Asia" },
{ name: "Philippine Arena", city: "Bulacan", capacity: 51898, region: "Asia" }, // Huge arena
{ name: "Mall of Asia Arena", city: "Manila", capacity: 15000, region: "Asia" },
{ name: "Singapore Indoor Stadium", city: "Singapore", capacity: 12000, region: "Asia" },
{ name: "Coca-Cola Arena", city: "Dubai", capacity: 17000, region: "Middle East" },
,
        { name: 'Madison Square Garden', city: 'New York', capacity: 20000, region: 'North America' }, { name: 'The Forum', city: 'Los Angeles', capacity: 17500, region: 'North America' }, { name: 'United Center', city: 'Chicago', capacity: 23500, region: 'North America' }, { name: 'American Airlines Arena', city: 'Miami', capacity: 21000, region: 'North America' }, { name: 'The O2', city: 'London', capacity: 20000, region: 'Europe' },
        { name: 'Crypto.com Arena', city: 'Los Angeles', capacity: 19067, region: 'North America' }, { name: 'Barclays Center', city: 'Brooklyn', capacity: 17732, region: 'North America' }, { name: 'Scotiabank Arena', city: 'Toronto', capacity: 19800, region: 'North America' }, { name: 'Lanxess Arena', city: 'Cologne', capacity: 20000, region: 'Europe' }, { name: 'Accor Arena', city: 'Paris', capacity: 20300, region: 'Europe' },
        { name: '3Arena', city: 'Dublin', capacity: 13000, region: 'Europe' }, { name: 'Rod Laver Arena', city: 'Melbourne', capacity: 14820, region: 'Oceania' }, { name: 'Qudos Bank Arena', city: 'Sydney', capacity: 21032, region: 'Oceania' }, { name: 'TD Garden', city: 'Boston', capacity: 19580, region: 'North America' }, { name: 'Capital One Arena', city: 'Washington D.C.', capacity: 20356, region: 'North America' },
        { name: 'American Airlines Center', city: 'Dallas', capacity: 20000, region: 'North America' }, { name: 'State Farm Arena', city: 'Atlanta', capacity: 21000, region: 'North America' }, { name: 'Wells Fargo Center', city: 'Philadelphia', capacity: 21000, region: 'North America' }, { name: 'Chase Center', city: 'San Francisco', capacity: 18064, region: 'North America' }, { name: 'Climate Pledge Arena', city: 'Seattle', capacity: 18100, region: 'North America' },
        { name: 'Coca-Cola Arena', city: 'Dubai', capacity: 17000, region: 'Middle East' }, { name: 'Gocheok Sky Dome', city: 'Seoul', capacity: 16744, region: 'Asia' }, { name: 'Ticketpro Dome', city: 'Johannesburg', capacity: 20000, region: 'Africa' }
    ],
    'Stadiums': [

{ name: "Estadio Nacional", city: "Lima", capacity: 50000, region: "South America" },
{ name: "Estadio Monumental U", city: "Lima", capacity: 80000, region: "South America" },
{ name: "Estadio Monumental", city: "Buenos Aires", capacity: 84567, region: "South America" },
{ name: "Estadio Unico de La Plata", city: "La Plata", capacity: 53000, region: "South America" },
{ name: "Estadio Nacional", city: "Santiago", capacity: 48665, region: "South America" },
{ name: "Estadio El Campin", city: "Bogota", capacity: 39000, region: "South America" },
{ name: "Estadio Atanasio Girardot", city: "Medellin", capacity: 40043, region: "South America" },
{ name: "Estadio Azteca", city: "Mexico City", capacity: 87523, region: "North America" },
{ name: "Foro Sol", city: "Mexico City", capacity: 65000, region: "North America" },
{ name: "Estadio BBVA", city: "Monterrey", capacity: 51000, region: "North America" },
{ name: "Estadio Akron", city: "Guadalajara", capacity: 49850, region: "North America" },
{ name: "Rogers Centre", city: "Toronto", capacity: 49282, region: "North America" },
{ name: "BC Place", city: "Vancouver", capacity: 54500, region: "North America" },
{ name: "Commonwealth Stadium", city: "Edmonton", capacity: 56302, region: "North America" },
{ name: "Olympic Stadium", city: "Montreal", capacity: 56040, region: "North America" },
{ name: "Lumen Field", city: "Seattle", capacity: 68740, region: "North America" },
{ name: "Levi's Stadium", city: "Santa Clara", capacity: 68500, region: "North America" },
{ name: "Rose Bowl", city: "Pasadena", capacity: 92542, region: "North America" },
{ name: "SoFi Stadium", city: "Inglewood", capacity: 70240, region: "North America" },
{ name: "Allegiant Stadium", city: "Las Vegas", capacity: 65000, region: "North America" },
{ name: "State Farm Stadium", city: "Glendale", capacity: 63400, region: "North America" },
{ name: "AT&T Stadium", city: "Arlington", capacity: 80000, region: "North America" },
{ name: "NRG Stadium", city: "Houston", capacity: 72220, region: "North America" },
{ name: "Caesars Superdome", city: "New Orleans", capacity: 73208, region: "North America" },
{ name: "Mercedes-Benz Stadium", city: "Atlanta", capacity: 71000, region: "North America" },
{ name: "Hard Rock Stadium", city: "Miami Gardens", capacity: 64767, region: "North America" },
{ name: "Raymond James Stadium", city: "Tampa", capacity: 65890, region: "North America" },
{ name: "Bank of America Stadium", city: "Charlotte", capacity: 74867, region: "North America" },
{ name: "Nissan Stadium", city: "Nashville", capacity: 69143, region: "North America" },
{ name: "Soldier Field", city: "Chicago", capacity: 61500, region: "North America" },
{ name: "Ford Field", city: "Detroit", capacity: 65000, region: "North America" },
{ name: "Lucas Oil Stadium", city: "Indianapolis", capacity: 67000, region: "North America" },
{ name: "Paycor Stadium", city: "Cincinnati", capacity: 65515, region: "North America" },
{ name: "Cleveland Browns Stadium", city: "Cleveland", capacity: 67431, region: "North America" },
{ name: "Acrisure Stadium", city: "Pittsburgh", capacity: 68400, region: "North America" },
{ name: "Lincoln Financial Field", city: "Philadelphia", capacity: 69796, region: "North America" },
{ name: "MetLife Stadium", city: "East Rutherford", capacity: 82500, region: "North America" },
{ name: "Gillette Stadium", city: "Foxborough", capacity: 65878, region: "North America" },
{ name: "Wembley Stadium", city: "London", capacity: 90000, region: "Europe" },
{ name: "Tottenham Hotspur Stadium", city: "London", capacity: 62850, region: "Europe" },
{ name: "London Stadium", city: "London", capacity: 60000, region: "Europe" },
{ name: "Principality Stadium", city: "Cardiff", capacity: 74500, region: "Europe" },
{ name: "Murrayfield Stadium", city: "Edinburgh", capacity: 67144, region: "Europe" },
{ name: "Aviva Stadium", city: "Dublin", capacity: 51700, region: "Europe" },
{ name: "Croke Park", city: "Dublin", capacity: 82300, region: "Europe" },
{ name: "Stade de France", city: "Paris", capacity: 80698, region: "Europe" },
{ name: "Groupama Stadium", city: "Lyon", capacity: 59186, region: "Europe" },
{ name: "Orange Vélodrome", city: "Marseille", capacity: 67394, region: "Europe" },
{ name: "Olympiastadion", city: "Berlin", capacity: 74475, region: "Europe" },
{ name: "Olympiastadion", city: "Munich", capacity: 69250, region: "Europe" },
{ name: "Allianz Arena", city: "Munich", capacity: 75024, region: "Europe" },
{ name: "Deutsche Bank Park", city: "Frankfurt", capacity: 51500, region: "Europe" },
{ name: "Merkur Spiel-Arena", city: "Dusseldorf", capacity: 54600, region: "Europe" },
{ name: "RheinEnergieStadion", city: "Cologne", capacity: 50000, region: "Europe" },
{ name: "Volksparkstadion", city: "Hamburg", capacity: 57000, region: "Europe" },
{ name: "Johan Cruyff Arena", city: "Amsterdam", capacity: 55500, region: "Europe" },
{ name: "Koning Boudewijnstadion", city: "Brussels", capacity: 50093, region: "Europe" },
{ name: "San Siro", city: "Milan", capacity: 75923, region: "Europe" },
{ name: "Stadio Olimpico", city: "Rome", capacity: 70634, region: "Europe" },
{ name: "Santiago Bernabéu", city: "Madrid", capacity: 81044, region: "Europe" },
{ name: "Estadio Metropolitano", city: "Madrid", capacity: 70460, region: "Europe" },
{ name: "Camp Nou", city: "Barcelona", capacity: 99354, region: "Europe" },
{ name: "Estadi Olímpic Lluís Companys", city: "Barcelona", capacity: 55926, region: "Europe" },
{ name: "PGE Narodowy", city: "Warsaw", capacity: 58145, region: "Europe" },
{ name: "Friends Arena", city: "Stockholm", capacity: 50622, region: "Europe" },
{ name: "Ullevi", city: "Gothenburg", capacity: 43000, region: "Europe" },
{ name: "Telenor Arena", city: "Oslo", capacity: 25000, region: "Europe" }, // technically an arena but acts as stadium
{ name: "Parken", city: "Copenhagen", capacity: 38065, region: "Europe" },
{ name: "Luzhniki Stadium", city: "Moscow", capacity: 81000, region: "Europe" },
{ name: "Tokyo Dome", city: "Tokyo", capacity: 55000, region: "Asia" },
{ name: "Ajinomoto Stadium", city: "Tokyo", capacity: 49970, region: "Asia" },
{ name: "Nissan Stadium", city: "Yokohama", capacity: 72327, region: "Asia" },
{ name: "Yanai Stadium", city: "Osaka", capacity: 47000, region: "Asia" },
{ name: "Kyocera Dome", city: "Osaka", capacity: 36477, region: "Asia" },
{ name: "Mizuho Stadium", city: "Nagoya", capacity: 27000, region: "Asia" },
{ name: "Fukuoka PayPay Dome", city: "Fukuoka", capacity: 38561, region: "Asia" },
{ name: "Sapporo Dome", city: "Sapporo", capacity: 41484, region: "Asia" },
{ name: "Seoul Olympic Stadium", city: "Seoul", capacity: 69950, region: "Asia" },
{ name: "Seoul World Cup Stadium", city: "Seoul", capacity: 66704, region: "Asia" },
{ name: "Gocheok Sky Dome", city: "Seoul", capacity: 16744, region: "Asia" }, // smaller but often stadium acts play here
{ name: "National Stadium", city: "Beijing", capacity: 80000, region: "Asia" },
{ name: "Shanghai Stadium", city: "Shanghai", capacity: 56842, region: "Asia" },
{ name: "Hong Kong Stadium", city: "Hong Kong", capacity: 40000, region: "Asia" },
{ name: "Taipei Dome", city: "Taipei", capacity: 40000, region: "Asia" },
{ name: "National Stadium", city: "Kaohsiung", capacity: 55000, region: "Asia" },
{ name: "Rajamangala Stadium", city: "Bangkok", capacity: 51552, region: "Asia" },
{ name: "National Stadium", city: "Bukit Jalil", capacity: 87411, region: "Asia" },
{ name: "Gelora Bung Karno Stadium", city: "Jakarta", capacity: 77193, region: "Asia" },
{ name: "Philippine Sports Stadium", city: "Bocaue", capacity: 25000, region: "Asia" },
{ name: "Singapore National Stadium", city: "Singapore", capacity: 55000, region: "Asia" },
{ name: "DY Patil Stadium", city: "Mumbai", capacity: 55000, region: "Asia" },
{ name: "Jawaharlal Nehru Stadium", city: "Delhi", capacity: 60000, region: "Asia" },
{ name: "King Fahd International Stadium", city: "Riyadh", capacity: 68000, region: "Middle East" },
{ name: "Lusail Stadium", city: "Lusail", capacity: 88966, region: "Middle East" },
{ name: "Zayed Sports City Stadium", city: "Abu Dhabi", capacity: 45000, region: "Middle East" },
{ name: "FNB Stadium", city: "Johannesburg", capacity: 94736, region: "Africa" },
{ name: "Cape Town Stadium", city: "Cape Town", capacity: 55000, region: "Africa" },
{ name: "Moses Mabhida Stadium", city: "Durban", capacity: 54000, region: "Africa" },
{ name: "Cairo International Stadium", city: "Cairo", capacity: 75000, region: "Africa" },
{ name: "MCG", city: "Melbourne", capacity: 100024, region: "Oceania" },
{ name: "Marvel Stadium", city: "Melbourne", capacity: 53359, region: "Oceania" },
{ name: "Accor Stadium", city: "Sydney", capacity: 83500, region: "Oceania" },
{ name: "Allianz Stadium", city: "Sydney", capacity: 42500, region: "Oceania" },
{ name: "Suncorp Stadium", city: "Brisbane", capacity: 52500, region: "Oceania" },
{ name: "Optus Stadium", city: "Perth", capacity: 60000, region: "Oceania" },
{ name: "Adelaide Oval", city: "Adelaide", capacity: 53583, region: "Oceania" },
{ name: "Eden Park", city: "Auckland", capacity: 50000, region: "Oceania" }
,
        { name: 'SoFi Stadium', city: 'Los Angeles', capacity: 70000, region: 'North America' }, { name: 'MetLife Stadium', city: 'New York', capacity: 82500, region: 'North America' }, { name: 'Wembley Stadium', city: 'London', capacity: 90000, region: 'Europe' }, { name: 'AT&T Stadium', city: 'Dallas', capacity: 80000, region: 'North America' }, { name: 'Mercedes-Benz Stadium', city: 'Atlanta', capacity: 71000, region: 'North America' },
        { name: 'Rose Bowl', city: 'Pasadena', capacity: 92542, region: 'North America' }, { name: 'Soldier Field', city: 'Chicago', capacity: 61500, region: 'North America' }, { name: 'Gillette Stadium', city: 'Foxborough', capacity: 65878, region: 'North America' }, { name: 'Lincoln Financial Field', city: 'Philadelphia', capacity: 69796, region: 'North America' }, { name: "Levi's Stadium", city: 'Santa Clara', capacity: 68500, region: 'North America' },
        { name: 'NRG Stadium', city: 'Houston', capacity: 72220, region: 'North America' }, { name: 'Hard Rock Stadium', city: 'Miami', capacity: 64767, region: 'North America' }, { name: 'Estadio Azteca', city: 'Mexico City', capacity: 87523, region: 'North America' }, { name: 'Maracanã Stadium', city: 'Rio de Janeiro', capacity: 78838, region: 'South America' }, { name: 'Stade de France', city: 'Paris', capacity: 80698, region: 'Europe' },
        { name: 'Allianz Arena', city: 'Munich', capacity: 75024, region: 'Europe' }, { name: 'Tokyo Dome', city: 'Tokyo', capacity: 55000, region: 'Asia' }, { name: 'Anfield', city: 'Liverpool', capacity: 61000, region: 'Europe' }, { name: 'Old Trafford', city: 'Manchester', capacity: 74310, region: 'Europe' }, { name: 'Melbourne Cricket Ground', city: 'Melbourne', capacity: 100024, region: 'Oceania' },
        { name: 'King Fahd International Stadium', city: 'Riyadh', capacity: 68000, region: 'Middle East' }, { name: 'National Stadium', city: 'Singapore', capacity: 55000, region: 'Asia' }, { name: 'FNB Stadium', city: 'Johannesburg', capacity: 94000, region: 'Africa' }
    ],
};

// Business Constants
export const MANAGERS: Manager[] = [
    { id: 'm1', name: 'Tara Keys', bio: 'Sweet but serious during business', yearlyCost: 150000, popularityBoost: 2, autoGigsPerWeek: 1, unlocksTier: 5 },
    { id: 'm2', name: 'Leanna Almanzar', bio: 'An experienced hand who knows everybody and gets things done efficiently.', yearlyCost: 500000, popularityBoost: 5, autoGigsPerWeek: 2, unlocksTier: 6 },
    { id: 'm3', name: 'OJ Kingston', bio: "Fierce negotiator who doesn't take no for an answer, bringing you to the top.", yearlyCost: 2000000, popularityBoost: 10, autoGigsPerWeek: 3, unlocksTier: 7 },
];

export const SECURITY_TEAMS: SecurityTeam[] = [
    { id: 's1', name: 'Mall Cop Security', weeklyCost: 5000, leakProtection: 0.75 },
    { id: 's2', name: 'Ex-Cop Bodyguards', weeklyCost: 25000, leakProtection: 0.40 },
    { id: 's3', name: 'Elite Private Security', weeklyCost: 100000, leakProtection: 0.10 },
];

export const GIGS = [
    { name: 'Open Mic Night', description: 'Perform at a local coffee shop.', cashRange: [100, 500], hype: 2, isAvailable: (state: ArtistData) => true, requirements: 'None' },
    { name: 'Local Bar Show', description: 'A proper gig at a downtown bar.', cashRange: [500, 2000], hype: 5, isAvailable: (state: ArtistData) => state.songs.some(s => s.isReleased), requirements: 'Requires 1+ released song' },
    { name: 'Opening Act', description: 'Open for an established local band.', cashRange: [2000, 5000], hype: 10, isAvailable: (state: ArtistData) => state.songs.filter(s => s.isReleased).length >= 3 && state.monthlyListeners > 10000, requirements: '3+ released songs & 10K listeners' },
    { name: 'Headlining Small Venue', description: 'Your own show at a 200-cap venue.', cashRange: [5000, 15000], hype: 15, isAvailable: (state: ArtistData) => state.releases.some(r => r.type === 'EP' || r.type === 'Album') && state.monthlyListeners > 50000, requirements: 'EP/Album & 50K listeners' },
    { name: 'College Music Festival', description: 'Headline a university music fest.', cashRange: [20000, 50000], hype: 20, isAvailable: (state: ArtistData) => state.manager && MANAGERS.find(m => m.id === state.manager!.id)!.unlocksTier >= 5, requirements: 'Requires a Tier 1 Manager' },
    { name: 'Late Night Show Performance', description: 'Perform on a major late-night TV show.', cashRange: [50000, 100000], hype: 35, isAvailable: (state: ArtistData) => state.manager && MANAGERS.find(m => m.id === state.manager!.id)!.unlocksTier >= 6, requirements: 'Requires a Tier 2 Manager' },
    { name: 'Major Festival Slot', description: 'Perform at a world-renowned festival like Coachella.', cashRange: [150000, 400000], hype: 60, isAvailable: (state: ArtistData) => state.manager && MANAGERS.find(m => m.id === state.manager!.id)!.unlocksTier >= 7, requirements: 'Requires a Tier 3 Manager' },
];

export const TALENT_AGENCIES: TalentAgency[] = [
    { id: 'ta1', name: 'Creative Artists Agency (CAA)', feePercent: 10, minPopularity: 80, perks: ['Top tier Movie/TV roles', 'High payouts'] },
    { id: 'ta2', name: 'William Morris Endeavor (WME)', feePercent: 15, minPopularity: 60, perks: ['Great brand deals', 'Solid TV roles'] },
    { id: 'ta3', name: 'United Talent Agency (UTA)', feePercent: 20, minPopularity: 40, perks: ['Entry level Voice Acting', 'Indie Movies'] }
];

export const NPC_ARTIST_IMAGES: Record<string, string> = {
  "Tyler, the Creator": "https://e-cdns-images.dzcdn.net/images/artist/5eceecd683beab6dd901a7931294a121/250x250-000000-80-0-0.jpg",
  "Aretha Franklin": "https://e-cdns-images.dzcdn.net/images/artist/b8110b6d21f8a846200257c70cbf73e9/250x250-000000-80-0-0.jpg",
  "Diana Ross": "https://e-cdns-images.dzcdn.net/images/artist/b6f1ca33fbe40d348a27d2194cf3eec9/250x250-000000-80-0-0.jpg",
  "Bee Gees": "https://e-cdns-images.dzcdn.net/images/artist/4ebef891bc86ff542b6f5cf1de36f875/250x250-000000-80-0-0.jpg",
  "The Rolling Stones": "https://e-cdns-images.dzcdn.net/images/artist/1e74880c54bb9b5f818fdfcb796b4121/250x250-000000-80-0-0.jpg",
  "Eagles": "https://e-cdns-images.dzcdn.net/images/artist/c1a6f8742cc65a8df241dcd79fcbd9fa/250x250-000000-80-0-0.jpg",
  "Donna Summer": "https://e-cdns-images.dzcdn.net/images/artist/7e4a77b311319dbf678cded0c67e1a38/250x250-000000-80-0-0.jpg",
  "David Bowie": "https://e-cdns-images.dzcdn.net/images/artist/d1297593da1e9cb1df1ff206a4a0f443/250x250-000000-80-0-0.jpg",
  "Elton John": "https://e-cdns-images.dzcdn.net/images/artist/3bb02db237f8f90ebbb8bb612f0b7ebc/250x250-000000-80-0-0.jpg",
  "Stevie Wonder": "https://e-cdns-images.dzcdn.net/images/artist/df24ed89759a22eb8e7345ee33e72eb4/250x250-000000-80-0-0.jpg",
  "Fleetwood Mac": "https://e-cdns-images.dzcdn.net/images/artist/99f187a7d4a234b6b6ec86eb58eefdd3/250x250-000000-80-0-0.jpg",
  "Queen": "https://e-cdns-images.dzcdn.net/images/artist/e51d953930b8d52367b140f0c05dd7de/250x250-000000-80-0-0.jpg",
  "ABBA": "https://e-cdns-images.dzcdn.net/images/artist/480456c66ee892d5475ee6f5054942d4/250x250-000000-80-0-0.jpg",
  "Pink Floyd": "https://e-cdns-images.dzcdn.net/images/artist/5be54c41fe701fa122dc4edc6e4e5ee5/250x250-000000-80-0-0.jpg",
  "Led Zeppelin": "https://e-cdns-images.dzcdn.net/images/artist/1e78eb322bfaeb9e78a6358dbfe91090/250x250-000000-80-0-0.jpg",
  "Tina Turner": "https://e-cdns-images.dzcdn.net/images/artist/f1fb89eb8e390c5003c20c0dcfe63f45/250x250-000000-80-0-0.jpg",
  "Cyndi Lauper": "https://e-cdns-images.dzcdn.net/images/artist/8cc53ff33be927164ccb6ce2ec9e4ba6/250x250-000000-80-0-0.jpg",
  "Cher": "https://e-cdns-images.dzcdn.net/images/artist/b28096f9bf11b66ebbb1296c6b412140/250x250-000000-80-0-0.jpg",
  "Def Leppard": "https://e-cdns-images.dzcdn.net/images/artist/f9630c33ad78a834c9c22eb430dcb989/250x250-000000-80-0-0.jpg",
  "AC/DC": "https://e-cdns-images.dzcdn.net/images/artist/b2fa8bc635583b27b3e839e9fc1f912a/250x250-000000-80-0-0.jpg",
  "Bruce Springsteen": "https://e-cdns-images.dzcdn.net/images/artist/b8110b6d21f8a846200257c70cbf73e9/250x250-000000-80-0-0.jpg",
  "U2": "https://e-cdns-images.dzcdn.net/images/artist/1e74880c54bb9b5f818fdfcb796b4121/250x250-000000-80-0-0.jpg",
  "George Michael": "https://e-cdns-images.dzcdn.net/images/artist/d8832a820b2d69ee016259b3f3630f9c/250x250-000000-80-0-0.jpg",
  "Phil Collins": "https://e-cdns-images.dzcdn.net/images/artist/20c52bb8e7345ee33e72eb41238eb243/250x250-000000-80-0-0.jpg",
  "Bon Jovi": "https://e-cdns-images.dzcdn.net/images/artist/57428fdf2b3d68ef21e90b848c21ef9a/250x250-000000-80-0-0.jpg",
  "Guns N' Roses": "https://e-cdns-images.dzcdn.net/images/artist/0aa9d669be4e7310b8647afae37ffaab/250x250-000000-80-0-0.jpg",
  "Janet Jackson": "https://e-cdns-images.dzcdn.net/images/artist/3fbf9a0937a89bc213ee8bdfcb78912e/250x250-000000-80-0-0.jpg",
  "Shania Twain": "https://e-cdns-images.dzcdn.net/images/artist/7e4a77b311319dbf678cded0c67e1a38/250x250-000000-80-0-0.jpg",
  "No Doubt": "https://e-cdns-images.dzcdn.net/images/artist/23c14d485ee414cae818bbd0a79040db/250x250-000000-80-0-0.jpg",
  "Aaliyah": "https://e-cdns-images.dzcdn.net/images/artist/81005a39626c8cd1cf9c9f28ecb3a2a6/250x250-000000-80-0-0.jpg",
  "Lauryn Hill": "https://e-cdns-images.dzcdn.net/images/artist/b6f1ca33fbe40d348a27d2194cf3eec9/250x250-000000-80-0-0.jpg",
  "Pearl Jam": "https://e-cdns-images.dzcdn.net/images/artist/43e74ff1f3bf78b4d08e56314ff9478e/250x250-000000-80-0-0.jpg",
  "Red Hot Chili Peppers": "https://e-cdns-images.dzcdn.net/images/artist/6b68596fde6be6ecab39cb32eefdd920/250x250-000000-80-0-0.jpg",
  "Oasis": "https://e-cdns-images.dzcdn.net/images/artist/6b539c3e21820dfa19b882eb727284b1/250x250-000000-80-0-0.jpg",
  "Radiohead": "https://e-cdns-images.dzcdn.net/images/artist/066fbc4b25dfed465814e59049a40fb0/250x250-000000-80-0-0.jpg",
  "Snoop Dogg": "https://e-cdns-images.dzcdn.net/images/artist/05175971939ecb0dc0e2eb4bcbb03960/250x250-000000-80-0-0.jpg",
  "Destiny's Child": "https://e-cdns-images.dzcdn.net/images/artist/2bf7019f86cc93e9ed8a834e565bf7ef/250x250-000000-80-0-0.jpg",
  "Christina Aguilera": "https://e-cdns-images.dzcdn.net/images/artist/3ff402daee9c78d5ce8084a77b75ecb0/250x250-000000-80-0-0.jpg",
  "Kelly Clarkson": "https://e-cdns-images.dzcdn.net/images/artist/7733cc50d87edfa15739c9df382fb2e4/250x250-000000-80-0-0.jpg",
  "Avril Lavigne": "https://e-cdns-images.dzcdn.net/images/artist/a1be2e68449c25f4ab36181b5fbce306/250x250-000000-80-0-0.jpg",
  "P!nk": "https://e-cdns-images.dzcdn.net/images/artist/b7a2d6742512f45037d453715c0a373b/250x250-000000-80-0-0.jpg",
  "Justin Timberlake": "https://e-cdns-images.dzcdn.net/images/artist/818fdfcb796b41217e74880c54bb9b5f/250x250-000000-80-0-0.jpg",
  "Missy Elliott": "https://e-cdns-images.dzcdn.net/images/artist/bdab4cc8dbad3a9dae88ff39ccb36ce9/250x250-000000-80-0-0.jpg",
  "Linkin Park": "https://e-cdns-images.dzcdn.net/images/artist/3fb10668f448c4125b203cbe31fa3831/250x250-000000-80-0-0.jpg",
  "Alicia Keys": "https://e-cdns-images.dzcdn.net/images/artist/0bf5d2db26be4ec0a69a589be282f183/250x250-000000-80-0-0.jpg",
  "Usher": "https://e-cdns-images.dzcdn.net/images/artist/90e5fa80c354e66c243ee2df448654a9/250x250-000000-80-0-0.jpg",
  "OutKast": "https://e-cdns-images.dzcdn.net/images/artist/1e74880c54bb9b5f818fdfcb796b4121/250x250-000000-80-0-0.jpg",
  "50 Cent": "https://e-cdns-images.dzcdn.net/images/artist/bf5bb97a7e8011c210086395b12ee96c/250x250-000000-80-0-0.jpg",
  "Green Day": "https://e-cdns-images.dzcdn.net/images/artist/33e74ee33e72eb41238eb243e8a7d362/250x250-000000-80-0-0.jpg",
  "The Beatles": "https://e-cdns-images.dzcdn.net/images/artist/7733cc50d87edfa15739c9df382fb2e4/250x250-000000-80-0-0.jpg",
  "The Beach Boys": "https://e-cdns-images.dzcdn.net/images/artist/23c14d485ee414cae818bbd0a79040db/250x250-000000-80-0-0.jpg",
  "The Supremes": "https://e-cdns-images.dzcdn.net/images/artist/b6f1ca33fbe40d348a27d2194cf3eec9/250x250-000000-80-0-0.jpg",
  "Jimi Hendrix": "https://e-cdns-images.dzcdn.net/images/artist/d1297593da1e9cb1df1ff206a4a0f443/250x250-000000-80-0-0.jpg",
  "Bob Dylan": "https://e-cdns-images.dzcdn.net/images/artist/066fbc4b25dfed465814e59049a40fb0/250x250-000000-80-0-0.jpg",
  "The Jackson 5": "https://e-cdns-images.dzcdn.net/images/artist/f1fb89eb8e390c5003c20c0dcfe63f45/250x250-000000-80-0-0.jpg",
  "Aerosmith": "https://e-cdns-images.dzcdn.net/images/artist/0aa9d669be4e7310b8647afae37ffaab/250x250-000000-80-0-0.jpg",
  "The Clash": "https://e-cdns-images.dzcdn.net/images/artist/43e74ff1f3bf78b4d08e56314ff9478e/250x250-000000-80-0-0.jpg",
  "Ramones": "https://e-cdns-images.dzcdn.net/images/artist/6b68596fde6be6ecab39cb32eefdd920/250x250-000000-80-0-0.jpg",
  "Blondie": "https://e-cdns-images.dzcdn.net/images/artist/8cc53ff33be927164ccb6ce2ec9e4ba6/250x250-000000-80-0-0.jpg",
  "Duran Duran": "https://e-cdns-images.dzcdn.net/images/artist/d8832a820b2d69ee016259b3f3630f9c/250x250-000000-80-0-0.jpg",
  "The Cure": "https://e-cdns-images.dzcdn.net/images/artist/066fbc4b25dfed465814e59049a40fb0/250x250-000000-80-0-0.jpg",
  "Depeche Mode": "https://e-cdns-images.dzcdn.net/images/artist/3fb10668f448c4125b203cbe31fa3831/250x250-000000-80-0-0.jpg",
  "The Smiths": "https://e-cdns-images.dzcdn.net/images/artist/6b539c3e21820dfa19b882eb727284b1/250x250-000000-80-0-0.jpg",
  "INXS": "https://e-cdns-images.dzcdn.net/images/artist/20c52bb8e7345ee33e72eb41238eb243/250x250-000000-80-0-0.jpg",
  "TLC": "https://e-cdns-images.dzcdn.net/images/artist/81005a39626c8cd1cf9c9f28ecb3a2a6/250x250-000000-80-0-0.jpg",
  "Spice Girls": "https://e-cdns-images.dzcdn.net/images/artist/2bf7019f86cc93e9ed8a834e565bf7ef/250x250-000000-80-0-0.jpg",
  "Backstreet Boys": "https://e-cdns-images.dzcdn.net/images/artist/3d8ed563d628c5c61ec4569d032ab682/250x250-000000-80-0-0.jpg",
  "NSYNC": "https://e-cdns-images.dzcdn.net/images/artist/818fdfcb796b41217e74880c54bb9b5f/250x250-000000-80-0-0.jpg",
  "The Notorious B.I.G.": "https://e-cdns-images.dzcdn.net/images/artist/1c9de578a8bc894563a620023a1eb1d7/250x250-000000-80-0-0.jpg",
  "Black Eyed Peas": "https://e-cdns-images.dzcdn.net/images/artist/bf5bb97a7e8011c210086395b12ee96c/250x250-000000-80-0-0.jpg",
  "Nelly": "https://e-cdns-images.dzcdn.net/images/artist/05175971939ecb0dc0e2eb4bcbb03960/250x250-000000-80-0-0.jpg",
  "XXXTENTACION": "https://cdn-images.dzcdn.net/images/artist/8d8316146026d7e6ce377e314536df62/250x250-000000-80-0-0.jpg",
  "Mac Miller": "https://cdn-images.dzcdn.net/images/artist/5eceecd683beab6dd901a7931294a121/250x250-000000-80-0-0.jpg",
  "Avicii": "https://cdn-images.dzcdn.net/images/artist/3o7aCUotvbVq8WZEzK/250x250-000000-80-0-0.jpg",
  "Amy Winehouse": "https://cdn-images.dzcdn.net/images/artist/8994d3be1a59a72f887f1f8afd2d4c6c/250x250-000000-80-0-0.jpg",
  "John Lennon": "https://cdn-images.dzcdn.net/images/artist/7733cc50d87edfa15739c9df382fb2e4/250x250-000000-80-0-0.jpg",
  "Freddie Mercury": "https://cdn-images.dzcdn.net/images/artist/e51d953930b8d52367b140f0c05dd7de/250x250-000000-80-0-0.jpg",
  "Chester Bennington": "https://cdn-images.dzcdn.net/images/artist/3fb10668f448c4125b203cbe31fa3831/250x250-000000-80-0-0.jpg",
  "Nipsey Hussle": "https://cdn-images.dzcdn.net/images/artist/be0a7c550567f4af0ed202d7235b74d6/250x250-000000-80-0-0.jpg",
  "Huda Mustafa": "https://cdn-images.dzcdn.net/images/artist/26b3660183a4a626bb185a7089f090b4/250x250-000000-80-0-0.jpg",
  "Sunshine Benzi": "https://cdn-images.dzcdn.net/images/artist/ed77e3a8268b3ae1e0b73183da3896e7/250x250-000000-80-0-0.jpg",
  "Stunna Sandy": "https://cdn-images.dzcdn.net/images/artist/af776cd99efbc010c3782030df0e7e1e/250x250-000000-80-0-0.jpg",
  "TRIM": "https://cdn-images.dzcdn.net/images/artist/fbcdfa1a7a00f2e0be5b84d436a5f782/250x250-000000-80-0-0.jpg",

  "Charlie Puth": "https://cdn-images.dzcdn.net/images/artist/9f38f83196c81faeab5a59f518e9cff2/250x250-000000-80-0-0.jpg",
  "Katy Perry": "https://cdn-images.dzcdn.net/images/artist/01a4bcbc8c3e8705f4305ec7cb6d31bb/250x250-000000-80-0-0.jpg",
  "Troye Sivan": "https://cdn-images.dzcdn.net/images/artist/d17b20de840938ff56a237f374edfc45/250x250-000000-80-0-0.jpg",
  "ZAYN": "https://cdn-images.dzcdn.net/images/artist/bcbebd7480a0fb9c656641e7d23d8c19/250x250-000000-80-0-0.jpg",
  "Conan Gray": "https://cdn-images.dzcdn.net/images/artist/cc5056e180d70ce379b1df092ff991d3/250x250-000000-80-0-0.jpg",
  "Kesha": "https://cdn-images.dzcdn.net/images/artist/08ff5f3e956e12e752945a0b74da17e0/250x250-000000-80-0-0.jpg",
  "Playboi Carti": "https://cdn-images.dzcdn.net/images/artist/fbcdfa1a7a00f2e0be5b84d436a5f782/250x250-000000-80-0-0.jpg",
  "Lil Uzi Vert": "https://cdn-images.dzcdn.net/images/artist/738df5b3a4a75ab280ec5e4277b960b7/250x250-000000-80-0-0.jpg",
  "Young Thug": "https://cdn-images.dzcdn.net/images/artist/ef8c5b058095da9d10eefcd6ec800201/250x250-000000-80-0-0.jpg",
  "A$AP Rocky": "https://cdn-images.dzcdn.net/images/artist/cf109c91f1cdb6ff8d8b9dce9ba4dfb2/250x250-000000-80-0-0.jpg",
  "Lil Yachty": "https://cdn-images.dzcdn.net/images/artist/43fc7dcdfb847e909a96e8140db79f64/250x250-000000-80-0-0.jpg",
  "Pop Smoke": "https://cdn-images.dzcdn.net/images/artist/a2a4c148e69d76e469d4a6e344ee4dff/250x250-000000-80-0-0.jpg",
  "Juice WRLD": "https://cdn-images.dzcdn.net/images/artist/bd126b89de9363065b21be3e4d9b6264/250x250-000000-80-0-0.jpg",
  "Gunna": "https://cdn-images.dzcdn.net/images/artist/e1b6f6f9479b03f0b2f7902d131ec5e9/250x250-000000-80-0-0.jpg",
  "Lil Baby": "https://cdn-images.dzcdn.net/images/artist/488d01115de62a742880099516639c00/250x250-000000-80-0-0.jpg",
  "Taylor Swift": "https://cdn-images.dzcdn.net/images/artist/e528e270424103b527f8a27ac625563b/250x250-000000-80-0-0.jpg",
  "Ariana Grande": "https://cdn-images.dzcdn.net/images/artist/3504ffe2519090026bc359b689d22e20/250x250-000000-80-0-0.jpg",
  "Billie Eilish": "https://cdn-images.dzcdn.net/images/artist/8eab1a9a644889aabaca1e193e05f984/250x250-000000-80-0-0.jpg",
  "The Weeknd": "https://cdn-images.dzcdn.net/images/artist/581693b4724a7fcfa754455101e13a44/250x250-000000-80-0-0.jpg",
  "Drake": "https://cdn-images.dzcdn.net/images/artist/eb0ed5b21d1ea5af021fc074ded0e91f/250x250-000000-80-0-0.jpg",
  "Justin Bieber": "https://cdn-images.dzcdn.net/images/artist/fe097f693cebf1f882e3da79e99e3bf9/250x250-000000-80-0-0.jpg",
  "Ed Sheeran": "https://cdn-images.dzcdn.net/images/artist/d6bb84390641d8ae9118228d9544e53d/250x250-000000-80-0-0.jpg",
  "Beyoncé": "https://cdn-images.dzcdn.net/images/artist/0aa9d669be4e7310b8647afae37ffaab/250x250-000000-80-0-0.jpg",
  "Rihanna": "https://cdn-images.dzcdn.net/images/artist/b78cdc205fae2641b89208e78b30e1b3/250x250-000000-80-0-0.jpg",
  "Adele": "https://cdn-images.dzcdn.net/images/artist/e5fc443d2abc03b487234ba4de65a001/250x250-000000-80-0-0.jpg",
  "Post Malone": "https://cdn-images.dzcdn.net/images/artist/a5a8cca44e7eab2db7d44e039bed2574/250x250-000000-80-0-0.jpg",
  "Dua Lipa": "https://cdn-images.dzcdn.net/images/artist/7375742a46dbebb6efc0ae362e18eb24/250x250-000000-80-0-0.jpg",
  "Olivia Rodrigo": "https://cdn-images.dzcdn.net/images/artist/2c9e480317183c037eaebcd7ba96daf4/250x250-000000-80-0-0.jpg",
  "Harry Styles": "https://cdn-images.dzcdn.net/images/artist/1151dba9b3edc0633adf35b64c21713f/250x250-000000-80-0-0.jpg",
  "Bad Bunny": "https://cdn-images.dzcdn.net/images/artist/45aaf836629158d714432ae37e552ee7/250x250-000000-80-0-0.jpg",
  "Kendrick Lamar": "https://cdn-images.dzcdn.net/images/artist/be0a7c550567f4af0ed202d7235b74d6/250x250-000000-80-0-0.jpg",
  "J. Cole": "https://cdn-images.dzcdn.net/images/artist/dc8d97f19855c8ea3f15ee6db784198e/250x250-000000-80-0-0.jpg",
  "Travis Scott": "https://cdn-images.dzcdn.net/images/artist/8d8316146026d7e6ce377e314536df62/250x250-000000-80-0-0.jpg",
  "Doja Cat": "https://cdn-images.dzcdn.net/images/artist/9e3a3b8792a04c4578da7b905ffeaf2b/250x250-000000-80-0-0.jpg",
  "SZA": "https://cdn-images.dzcdn.net/images/artist/8ced041da2bed70d5715f0860956169b/250x250-000000-80-0-0.jpg",
  "Lana Del Rey": "https://cdn-images.dzcdn.net/images/artist/8994d3be1a59a72f887f1f8afd2d4c6c/250x250-000000-80-0-0.jpg",
  "Frank Ocean": "https://cdn-images.dzcdn.net/images/artist/882155c08dc31d6464d6d580083c968c/250x250-000000-80-0-0.jpg",
  "Tyler, the Creator": "https://cdn-images.dzcdn.net/images/artist/5eceecd683beab6dd901a7931294a121/250x250-000000-80-0-0.jpg",
  "Lil Nas X": "https://cdn-images.dzcdn.net/images/artist/0f5f0e176c544db5f89b5cd837e279aa/250x250-000000-80-0-0.jpg",
  "Cardi B": "https://cdn-images.dzcdn.net/images/artist/af776cd99efbc010c3782030df0e7e1e/250x250-000000-80-0-0.jpg",
  "Nicki Minaj": "https://cdn-images.dzcdn.net/images/artist/cf30ba4b709168aee196dcf16f259f22/250x250-000000-80-0-0.jpg",
  "Megan Thee Stallion": "https://cdn-images.dzcdn.net/images/artist/55a20b812fec74d0a72d870545fc2123/250x250-000000-80-0-0.jpg",
  "Kanye West": "https://cdn-images.dzcdn.net/images/artist/bb76c2ee3b068726ab4c37b0aabdb57a/250x250-000000-80-0-0.jpg",
  "Jay-Z": "https://cdn-images.dzcdn.net/images/artist/a59aabd18e84d732ce3b9f6f5c4e5f50/250x250-000000-80-0-0.jpg",
  "Eminem": "https://cdn-images.dzcdn.net/images/artist/0f30bbd33a680030054af004d698d6ac/250x250-000000-80-0-0.jpg",
  "Lady Gaga": "https://cdn-images.dzcdn.net/images/artist/7565262f7661b0d762621a8d69ba6f49/250x250-000000-80-0-0.jpg",
  "Bruno Mars": "https://cdn-images.dzcdn.net/images/artist/90f0b5b11df4f87ee878f38569b5995b/250x250-000000-80-0-0.jpg",
  "Miley Cyrus": "https://cdn-images.dzcdn.net/images/artist/1125de234fd142a03ba849e9f90c0f7c/250x250-000000-80-0-0.jpg",
  "Selena Gomez": "https://cdn-images.dzcdn.net/images/artist/26b3660183a4a626bb185a7089f090b4/250x250-000000-80-0-0.jpg",
  "Demi Lovato": "https://cdn-images.dzcdn.net/images/artist/ed77e3a8268b3ae1e0b73183da3896e7/250x250-000000-80-0-0.jpg",
  "Shawn Mendes": "https://cdn-images.dzcdn.net/images/artist/3d8ed563d628c5c61ec4569d032ab682/250x250-000000-80-0-0.jpg",
  "Camila Cabello": "https://cdn-images.dzcdn.net/images/artist/4591e8a49868c2494652767f47695a90/250x250-000000-80-0-0.jpg",
  "Halsey": "https://cdn-images.dzcdn.net/images/artist/dbfcb38ac398f2c09d18b16868426f41/250x250-000000-80-0-0.jpg",
  "Lorde": "https://cdn-images.dzcdn.net/images/artist/c38f17b73ad22d280c5dfc8a8b3d1865/250x250-000000-80-0-0.jpg",
  "Charli XCX": "https://cdn-images.dzcdn.net/images/artist/5a4f593c65c71292b4389e871f76c023/250x250-000000-80-0-0.jpg",
  "Coldplay": "https://cdn-images.dzcdn.net/images/artist/3087954bca22f306324912e5ac8375c3/250x250-000000-80-0-0.jpg",
  "Imagine Dragons": "https://cdn-images.dzcdn.net/images/artist/1ba025c23cae3dee14b51152990285fc/250x250-000000-80-0-0.jpg",
  "Maroon 5": "https://cdn-images.dzcdn.net/images/artist/bbb526b9666c7e31dee295bcabbbdd8e/250x250-000000-80-0-0.jpg",
  "OneRepublic": "https://cdn-images.dzcdn.net/images/artist/36556d769dc4052d915eb78c8daf98fb/250x250-000000-80-0-0.jpg",
  "Arctic Monkeys": "https://cdn-images.dzcdn.net/images/artist/6c03e4c7c36800897fd468633286db24/250x250-000000-80-0-0.jpg",
  "The 1975": "https://cdn-images.dzcdn.net/images/artist/3408c43ed74f73c88281b37a62a51638/250x250-000000-80-0-0.jpg",
  "Tame Impala": "https://cdn-images.dzcdn.net/images/artist/879015e713cc6ad6ffaeec154c027505/250x250-000000-80-0-0.jpg",
  "Glass Animals": "https://cdn-images.dzcdn.net/images/artist/b2e9164dfa2a293330ce341905710034/250x250-000000-80-0-0.jpg",
  "FINNEAS": "https://cdn-images.dzcdn.net/images/artist/d4cf2dedbdf65c8b42050fe987358d0c/250x250-000000-80-0-0.jpg",
  "Jack Harlow": "https://cdn-images.dzcdn.net/images/artist/acf97ceb30d48a97e47afd1c3f9b68ce/250x250-000000-80-0-0.jpg",
  "Sabrina Carpenter": "https://cdn-images.dzcdn.net/images/artist/4a9cdc7737e2a0e59b4917b47884b859/250x250-000000-80-0-0.jpg",
  "Tate McRae": "https://cdn-images.dzcdn.net/images/artist/b3578bcbd54124c8125c9a9d52f38716/250x250-000000-80-0-0.jpg",
  "Chappell Roan": "https://cdn-images.dzcdn.net/images/artist/14ca3aea25950189f30efe0fa79ac4f9/250x250-000000-80-0-0.jpg",
  "Ice Spice": "https://cdn-images.dzcdn.net/images/artist/175bb716a4289c50e39c048ad35b491e/250x250-000000-80-0-0.jpg",
  "21 Savage": "https://cdn-images.dzcdn.net/images/artist/76b4cd56c7e94e8d2bdc3e2157e1080f/250x250-000000-80-0-0.jpg",
  "Future": "https://cdn-images.dzcdn.net/images/artist/c8c8fea7e2b8613b3ba7328d22d3016c/250x250-000000-80-0-0.jpg",
  "Metro Boomin": "https://cdn-images.dzcdn.net/images/artist/bc031b73f958987fa103031070be5c16/250x250-000000-80-0-0.jpg",
  "Morgan Wallen": "https://cdn-images.dzcdn.net/images/artist/75488d12757f5809b9e6c7f53e5bb455/250x250-000000-80-0-0.jpg",
  "Luke Combs": "https://cdn-images.dzcdn.net/images/artist/c2a8e5d0d293a06bf887bb2724a780bc/250x250-000000-80-0-0.jpg",
  "Zach Bryan": "https://cdn-images.dzcdn.net/images/artist/552d448a0c2cb72f40c3de3a384949bd/250x250-000000-80-0-0.jpg",
  "Peso Pluma": "https://cdn-images.dzcdn.net/images/artist/dde2bf89c1e8da0aeb94436681bc3aac/250x250-000000-80-0-0.jpg",
  "Karol G": "https://cdn-images.dzcdn.net/images/artist/dd8c6b3068d2761955eb6e432046ed91/250x250-000000-80-0-0.jpg",
  "Shakira": "https://cdn-images.dzcdn.net/images/artist/69c569506a8ff6ab0edfecbd1adf94b0/250x250-000000-80-0-0.jpg",
  "Rauw Alejandro": "https://cdn-images.dzcdn.net/images/artist/0e7b2b93b91789a054bc3f08bb3df3a8/250x250-000000-80-0-0.jpg",
  "Anitta": "https://cdn-images.dzcdn.net/images/artist/bab6017df606c55ba0b5418fc345c3ca/250x250-000000-80-0-0.jpg",
  "Latto": "https://cdn-images.dzcdn.net/images/artist/01a5b9598e1de78a0cfad893c0e4e161/250x250-000000-80-0-0.jpg",
  "GloRilla": "https://cdn-images.dzcdn.net/images/artist/6bccd80c250c642b7d5262480e8af617/250x250-000000-80-0-0.jpg",
  "Sexyy Red": "https://cdn-images.dzcdn.net/images/artist/5b4a7d84536a2f0edde7eca15469057d/250x250-000000-80-0-0.jpg",
  "Coi Leray": "https://cdn-images.dzcdn.net/images/artist/8aebf8da8832f87d840330bf994cfb59/250x250-000000-80-0-0.jpg",
  "Flo Milli": "https://cdn-images.dzcdn.net/images/artist/db4c9e92ebbb65eaca8d4f8ef5bf82d3/250x250-000000-80-0-0.jpg",
  "BTS": "https://cdn-images.dzcdn.net/images/artist/b5c64fa8216ca158e52b4d88bd9388ff/250x250-000000-80-0-0.jpg",
  "BLACKPINK": "https://cdn-images.dzcdn.net/images/artist/89675729453893a91be35bde691050ff/250x250-000000-80-0-0.jpg",
  "NewJeans": "https://cdn-images.dzcdn.net/images/artist/0866c2c1d7d00879f5db46ddc1250db8/250x250-000000-80-0-0.jpg",
  "Stray Kids": "https://cdn-images.dzcdn.net/images/artist/004d3950684af2157081072af2df192b/250x250-000000-80-0-0.jpg",
  "TWICE": "https://cdn-images.dzcdn.net/images/artist/1f4acadade675899b7f775ae4ac67faa/250x250-000000-80-0-0.jpg",
  "SEVENTEEN": "https://cdn-images.dzcdn.net/images/artist/f24702900c1454ea23c573a3eed5b149/250x250-000000-80-0-0.jpg",
  "LE SSERAFIM": "https://cdn-images.dzcdn.net/images/artist/e789ab2d16cad9a738cd83722940512b/250x250-000000-80-0-0.jpg",
  "(G)I-DLE": "https://cdn-images.dzcdn.net/images/artist/0b381aacaf9b4c4c1b60664431c815bf/250x250-000000-80-0-0.jpg",
  "Jungkook": "https://cdn-images.dzcdn.net/images/artist/7e8a65d06b7c0293ff33f44e34a8b7e6/250x250-000000-80-0-0.jpg",
  "Jennie": "https://cdn-images.dzcdn.net/images/artist/56c65ac9ea451119ddc8c0b02915d103/250x250-000000-80-0-0.jpg",
  "Lisa": "https://cdn-images.dzcdn.net/images/artist/040c7161f753b46331aad225cb8bac38/250x250-000000-80-0-0.jpg",
  "aespa": "https://cdn-images.dzcdn.net/images/artist/0031639b755895dc9d638628587c5459/250x250-000000-80-0-0.jpg",
  "J Balvin": "https://cdn-images.dzcdn.net/images/artist/325eaa46bc25052d0e3d549d60cc8225/250x250-000000-80-0-0.jpg",
  "Maluma": "https://cdn-images.dzcdn.net/images/artist/a1627f420e880b7229e52890b99626c9/250x250-000000-80-0-0.jpg",
  "Rosalía": "https://cdn-images.dzcdn.net/images/artist/96636156440182f1e7db3f77d39e6545/250x250-000000-80-0-0.jpg",
  "Feid": "https://cdn-images.dzcdn.net/images/artist/a37d75aa98b04da700412398a988c31a/250x250-000000-80-0-0.jpg",
  "Myke Towers": "https://cdn-images.dzcdn.net/images/artist/d3a7418b4e44bf8ee3ae268067a86f09/250x250-000000-80-0-0.jpg",
  "Young Miko": "https://cdn-images.dzcdn.net/images/artist/5912325ca89e72e925de22d05001ed4a/250x250-000000-80-0-0.jpg",
  "Ozuna": "https://cdn-images.dzcdn.net/images/artist/df2030b9e796f55f58d2c4b68aecb18f/250x250-000000-80-0-0.jpg",
  "Bizarrap": "https://cdn-images.dzcdn.net/images/artist/e121c1ef9b1135e6a5b71c1e65ab10b4/250x250-000000-80-0-0.jpg",
  "TRIM": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
  "Huda Mustafa": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
  "Sunshine Benzi": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
  "Stunna Sandy": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
  "Calvin Harris": "https://cdn-images.dzcdn.net/images/artist/a53031d02dc2f8a8eb15d117c015d5eb/250x250-000000-80-0-0.jpg",
  "David Guetta": "https://cdn-images.dzcdn.net/images/artist/2d527fa03e106ed82a28f161694278d3/250x250-000000-80-0-0.jpg",
  "Skrillex": "https://cdn-images.dzcdn.net/images/artist/0075f053766d7d0e12e4a7be22b85e6a/250x250-000000-80-0-0.jpg",
  "Diplo": "https://cdn-images.dzcdn.net/images/artist/e26fa83b67df45f262ce0181c3b86463/250x250-000000-80-0-0.jpg",
  "Zedd": "https://cdn-images.dzcdn.net/images/artist/6013ec7ad0b823306c3582e2792dd145/250x250-000000-80-0-0.jpg",
  "Martin Garrix": "https://cdn-images.dzcdn.net/images/artist/4cab1c0cbe0edc1b3d2234873abc485e/250x250-000000-80-0-0.jpg",
  "Bob Marley": "https://cdn-images.dzcdn.net/images/artist/c8241e15efdefa9465c7b470643efb3b/250x250-000000-80-0-0.jpg",
  "Sean Paul": "https://cdn-images.dzcdn.net/images/artist/043332be51a1a67cb0a363ea88475a41/250x250-000000-80-0-0.jpg",
  "Koffee": "https://cdn-images.dzcdn.net/images/artist/fa724e6edaae0359a9e8d63815ecc29d/250x250-000000-80-0-0.jpg",
  "Shaggy": "https://cdn-images.dzcdn.net/images/artist/2e74048a1d7271efc79b0d3a91fdf085/250x250-000000-80-0-0.jpg",
  "Popcaan": "https://cdn-images.dzcdn.net/images/artist/17a66041a82cd6ead846178a104ecdf4/250x250-000000-80-0-0.jpg",
  "Burna Boy": "https://cdn-images.dzcdn.net/images/artist/ad15b7f03325752d60db9e4d39c079ae/250x250-000000-80-0-0.jpg",
  "Wizkid": "https://cdn-images.dzcdn.net/images/artist/171332ffcaa66c2b5583d7630297be88/250x250-000000-80-0-0.jpg",
  "Davido": "https://cdn-images.dzcdn.net/images/artist/bb20fa59263d537ce7a27160b8471aed/250x250-000000-80-0-0.jpg",
  "Rema": "https://cdn-images.dzcdn.net/images/artist/45262002b65a0bb0157aff134106c72b/250x250-000000-80-0-0.jpg",
  "Tems": "https://cdn-images.dzcdn.net/images/artist/6afe2edff567600abf781c3d8a29344b/250x250-000000-80-0-0.jpg",
  "Asake": "https://cdn-images.dzcdn.net/images/artist/29baf235626c8cd1cdc782c6d467aca8/250x250-000000-80-0-0.jpg",
  "Omah Lay": "https://cdn-images.dzcdn.net/images/artist/e8ce64479eb3d7fc2853f7fd694cc999/250x250-000000-80-0-0.jpg"
};
export const NPC_ERAS: Record<string, { start: number, end: number, genre: string, image: string }> = {
  "Tyler, the Creator": {"start":2009,"end":2050,"genre":"Hip Hop","image":"https://e-cdns-images.dzcdn.net/images/artist/5eceecd683beab6dd901a7931294a121/250x250-000000-80-0-0.jpg"},
  "XXXTENTACION": {"start":2016,"end":2018,"genre":"Hip Hop","image":"https://cdn-images.dzcdn.net/images/artist/8d8316146026d7e6ce377e314536df62/250x250-000000-80-0-0.jpg"},
  "Mac Miller": {"start":2010,"end":2018,"genre":"Hip Hop","image":"https://cdn-images.dzcdn.net/images/artist/5eceecd683beab6dd901a7931294a121/250x250-000000-80-0-0.jpg"},
  "Avicii": {"start":2010,"end":2018,"genre":"Electronic","image":"https://cdn-images.dzcdn.net/images/artist/3o7aCUotvbVq8WZEzK/250x250-000000-80-0-0.jpg"},
  "Amy Winehouse": {"start":2003,"end":2011,"genre":"R&B","image":"https://cdn-images.dzcdn.net/images/artist/8994d3be1a59a72f887f1f8afd2d4c6c/250x250-000000-80-0-0.jpg"},
  "George Michael": {"start":1981,"end":2016,"genre":"Pop","image":"https://e-cdns-images.dzcdn.net/images/artist/d8832a820b2d69ee016259b3f3630f9c/250x250-000000-80-0-0.jpg"},
  "David Bowie": {"start":1967,"end":2016,"genre":"Rock","image":"https://e-cdns-images.dzcdn.net/images/artist/d1297593da1e9cb1df1ff206a4a0f443/250x250-000000-80-0-0.jpg"},
  "John Lennon": {"start":1960,"end":1980,"genre":"Rock","image":"https://cdn-images.dzcdn.net/images/artist/7733cc50d87edfa15739c9df382fb2e4/250x250-000000-80-0-0.jpg"},
  "Freddie Mercury": {"start":1970,"end":1991,"genre":"Rock","image":"https://cdn-images.dzcdn.net/images/artist/e51d953930b8d52367b140f0c05dd7de/250x250-000000-80-0-0.jpg"},
  "Chester Bennington": {"start":1996,"end":2017,"genre":"Rock","image":"https://cdn-images.dzcdn.net/images/artist/3fb10668f448c4125b203cbe31fa3831/250x250-000000-80-0-0.jpg"},
  "Nipsey Hussle": {"start":2008,"end":2019,"genre":"Hip Hop","image":"https://cdn-images.dzcdn.net/images/artist/be0a7c550567f4af0ed202d7235b74d6/250x250-000000-80-0-0.jpg"},
  "Elton John": {"start":1969,"end":2050,"genre":"Pop","image":"https://e-cdns-images.dzcdn.net/images/artist/3bb02db237f8f90ebbb8bb612f0b7ebc/250x250-000000-80-0-0.jpg"},
  "Stevie Wonder": {"start":1962,"end":2050,"genre":"R&B","image":"https://e-cdns-images.dzcdn.net/images/artist/df24ed89759a22eb8e7345ee33e72eb4/250x250-000000-80-0-0.jpg"},
  "Fleetwood Mac": {"start":1967,"end":2022,"genre":"Rock","image":"https://e-cdns-images.dzcdn.net/images/artist/99f187a7d4a234b6b6ec86eb58eefdd3/250x250-000000-80-0-0.jpg"},
  "Queen": {"start":1970,"end":1991,"genre":"Rock","image":"https://e-cdns-images.dzcdn.net/images/artist/e51d953930b8d52367b140f0c05dd7de/250x250-000000-80-0-0.jpg"},
  "ABBA": {"start":1972,"end":2050,"genre":"Pop","image":"https://e-cdns-images.dzcdn.net/images/artist/480456c66ee892d5475ee6f5054942d4/250x250-000000-80-0-0.jpg"},
  "Pink Floyd": {"start":1967,"end":2014,"genre":"Rock","image":"https://e-cdns-images.dzcdn.net/images/artist/5be54c41fe701fa122dc4edc6e4e5ee5/250x250-000000-80-0-0.jpg"},
  "Led Zeppelin": {"start":1968,"end":1980,"genre":"Rock","image":"https://e-cdns-images.dzcdn.net/images/artist/1e78eb322bfaeb9e78a6358dbfe91090/250x250-000000-80-0-0.jpg"},
  "Bruce Springsteen": {"start":1973,"end":2050,"genre":"Rock","image":"https://e-cdns-images.dzcdn.net/images/artist/b8110b6d21f8a846200257c70cbf73e9/250x250-000000-80-0-0.jpg"},
  "U2": {"start":1980,"end":2050,"genre":"Rock","image":"https://e-cdns-images.dzcdn.net/images/artist/1e74880c54bb9b5f818fdfcb796b4121/250x250-000000-80-0-0.jpg"},
  "Phil Collins": {"start":1981,"end":2050,"genre":"Pop","image":"https://e-cdns-images.dzcdn.net/images/artist/20c52bb8e7345ee33e72eb41238eb243/250x250-000000-80-0-0.jpg"},
  "Bon Jovi": {"start":1983,"end":2050,"genre":"Rock","image":"https://e-cdns-images.dzcdn.net/images/artist/57428fdf2b3d68ef21e90b848c21ef9a/250x250-000000-80-0-0.jpg"},
  "Guns N' Roses": {"start":1987,"end":2050,"genre":"Rock","image":"https://e-cdns-images.dzcdn.net/images/artist/0aa9d669be4e7310b8647afae37ffaab/250x250-000000-80-0-0.jpg"},
  "Janet Jackson": {"start":1982,"end":2050,"genre":"Pop","image":"https://e-cdns-images.dzcdn.net/images/artist/3fbf9a0937a89bc213ee8bdfcb78912e/250x250-000000-80-0-0.jpg"},
  "Oasis": {"start":1994,"end":2009,"genre":"Rock","image":"https://e-cdns-images.dzcdn.net/images/artist/6b539c3e21820dfa19b882eb727284b1/250x250-000000-80-0-0.jpg"},
  "Radiohead": {"start":1992,"end":2050,"genre":"Rock","image":"https://e-cdns-images.dzcdn.net/images/artist/066fbc4b25dfed465814e59049a40fb0/250x250-000000-80-0-0.jpg"},
  "Snoop Dogg": {"start":1992,"end":2050,"genre":"Hip Hop","image":"https://e-cdns-images.dzcdn.net/images/artist/05175971939ecb0dc0e2eb4bcbb03960/250x250-000000-80-0-0.jpg"},
  "Destiny's Child": {"start":1997,"end":2005,"genre":"R&B","image":"https://e-cdns-images.dzcdn.net/images/artist/2bf7019f86cc93e9ed8a834e565bf7ef/250x250-000000-80-0-0.jpg"},
  "Linkin Park": {"start":2000,"end":2017,"genre":"Rock","image":"https://e-cdns-images.dzcdn.net/images/artist/3fb10668f448c4125b203cbe31fa3831/250x250-000000-80-0-0.jpg"},
  "Alicia Keys": {"start":2001,"end":2050,"genre":"R&B","image":"https://e-cdns-images.dzcdn.net/images/artist/0bf5d2db26be4ec0a69a589be282f183/250x250-000000-80-0-0.jpg"},
  "Usher": {"start":1994,"end":2050,"genre":"R&B","image":"https://e-cdns-images.dzcdn.net/images/artist/90e5fa80c354e66c243ee2df448654a9/250x250-000000-80-0-0.jpg"},
  "OutKast": {"start":1994,"end":2006,"genre":"Hip Hop","image":"https://e-cdns-images.dzcdn.net/images/artist/1e74880c54bb9b5f818fdfcb796b4121/250x250-000000-80-0-0.jpg"},
  "50 Cent": {"start":2003,"end":2050,"genre":"Hip Hop","image":"https://e-cdns-images.dzcdn.net/images/artist/bf5bb97a7e8011c210086395b12ee96c/250x250-000000-80-0-0.jpg"},
  "Green Day": {"start":1994,"end":2050,"genre":"Rock","image":"https://e-cdns-images.dzcdn.net/images/artist/33e74ee33e72eb41238eb243e8a7d362/250x250-000000-80-0-0.jpg"},

  "Michael Jackson": {
    "start": 1964,
    "end": 2009,
    "genre": "Pop",
    "image": "https://cdn-images.dzcdn.net/images/artist/f1fb89eb8e390c5003c20c0dcfe63f45/250x250-000000-80-0-0.jpg"
  },
  "Prince": {
    "start": 1978,
    "end": 2016,
    "genre": "Pop",
    "image": "https://cdn-images.dzcdn.net/images/artist/e51d953930b8d52367b140f0c05dd7de/250x250-000000-80-0-0.jpg"
  },
  "Madonna": {
    "start": 1982,
    "end": 2050,
    "genre": "Pop",
    "image": "https://cdn-images.dzcdn.net/images/artist/5e5486cbab3a2283bf366c88f1766de3/250x250-000000-80-0-0.jpg"
  },
  "Whitney Houston": {
    "start": 1985,
    "end": 2012,
    "genre": "R&B",
    "image": "https://cdn-images.dzcdn.net/images/artist/dfd0d6118d09559ff10f92a1cfce28d6/250x250-000000-80-0-0.jpg"
  },
  "Nirvana": {
    "start": 1987,
    "end": 1994,
    "genre": "Rock",
    "image": "https://cdn-images.dzcdn.net/images/artist/bd1fc51c2069edcc63329cf8cd0fb69e/250x250-000000-80-0-0.jpg"
  },
  "Tupac": {
    "start": 1991,
    "end": 1996,
    "genre": "Hip Hop",
    "image": "https://cdn-images.dzcdn.net/images/artist/dbb2a59f518e9d5ab4cc8dbad3a9dae8/250x250-000000-80-0-0.jpg"
  },
  "The Notorious B.I.G.": {
    "start": 1993,
    "end": 1997,
    "genre": "Hip Hop",
    "image": "https://cdn-images.dzcdn.net/images/artist/1c9de578a8bc894563a620023a1eb1d7/250x250-000000-80-0-0.jpg"
  },
  "Britney Spears": {
    "start": 1998,
    "end": 2050,
    "genre": "Pop",
    "image": "https://cdn-images.dzcdn.net/images/artist/3ff402daee9c78d5ce8084a77b75ecb0/250x250-000000-80-0-0.jpg"
  },
  "Eminem": {
    "start": 1999,
    "end": 2050,
    "genre": "Hip Hop",
    "image": "https://cdn-images.dzcdn.net/images/artist/19cc38f9d69b352f718782e7a22f9c32/250x250-000000-80-0-0.jpg"
  },
  "Kanye West": {
    "start": 2004,
    "end": 2050,
    "genre": "Hip Hop",
    "image": "https://cdn-images.dzcdn.net/images/artist/733182eebe9455331e7cc4d8123df16d/250x250-000000-80-0-0.jpg"
  },
  "Drake": {
    "start": 2009,
    "end": 2050,
    "genre": "Hip Hop",
    "image": "https://cdn-images.dzcdn.net/images/artist/14299499876356c9a96e95c4794b1ef4/250x250-000000-80-0-0.jpg"
  },
  "Taylor Swift": {
    "start": 2006,
    "end": 2050,
    "genre": "Pop",
    "image": "https://cdn-images.dzcdn.net/images/artist/77332219463b7194f454a856a2bbca25/250x250-000000-80-0-0.jpg"
  },
  "Ariana Grande": {
    "start": 2013,
    "end": 2050,
    "genre": "Pop",
    "image": "https://cdn-images.dzcdn.net/images/artist/c1a6f8742cc65a8df241dcd79fcbd9fa/250x250-000000-80-0-0.jpg"
  },
  "Billie Eilish": {
    "start": 2017,
    "end": 2050,
    "genre": "Pop",
    "image": "https://cdn-images.dzcdn.net/images/artist/a22bfb8d5a7dffbfaad1cb93d7c2a728/250x250-000000-80-0-0.jpg"
  },
  "The Weeknd": {
    "start": 2011,
    "end": 2050,
    "genre": "Pop",
    "image": "https://cdn-images.dzcdn.net/images/artist/624b5d63428987ecfa4dcc6599b441da/250x250-000000-80-0-0.jpg"
  },
  "Justin Bieber": {
    "start": 2009,
    "end": 2050,
    "genre": "Pop",
    "image": "https://cdn-images.dzcdn.net/images/artist/818fdfcb796b41217e74880c54bb9b5f/250x250-000000-80-0-0.jpg"
  },
  "Ed Sheeran": {
    "start": 2011,
    "end": 2050,
    "genre": "Pop",
    "image": "https://cdn-images.dzcdn.net/images/artist/b068e42ff3ffbc12aa44ec5f4eeaf38e/250x250-000000-80-0-0.jpg"
  },
  "Beyoncé": {
    "start": 1997,
    "end": 2050,
    "genre": "Pop",
    "image": "https://cdn-images.dzcdn.net/images/artist/33e6604cb745ce3438a927a7c7847ee0/250x250-000000-80-0-0.jpg"
  },
  "Rihanna": {
    "start": 2005,
    "end": 2050,
    "genre": "Pop",
    "image": "https://cdn-images.dzcdn.net/images/artist/19446d33dc3d001099684126ea14b30e/250x250-000000-80-0-0.jpg"
  },
  "Adele": {
    "start": 2008,
    "end": 2050,
    "genre": "Pop",
    "image": "https://cdn-images.dzcdn.net/images/artist/64e83fdf089e5fc24c2d3a39e701968d/250x250-000000-80-0-0.jpg"
  },
  "Post Malone": {
    "start": 2015,
    "end": 2050,
    "genre": "Pop",
    "image": "https://cdn-images.dzcdn.net/images/artist/b8110b1a0f8bfd9472e35a9fcc96328a/250x250-000000-80-0-0.jpg"
  },
  "Dua Lipa": {
    "start": 2017,
    "end": 2050,
    "genre": "Pop",
    "image": "https://cdn-images.dzcdn.net/images/artist/e9d4df8e27c0c92f97fc18ab72df6c23/250x250-000000-80-0-0.jpg"
  },
  "Olivia Rodrigo": {
    "start": 2021,
    "end": 2050,
    "genre": "Pop",
    "image": "https://cdn-images.dzcdn.net/images/artist/2cc14cc45b0a373ff26fcd92c7333a46/250x250-000000-80-0-0.jpg"
  },
  "Harry Styles": {
    "start": 2010,
    "end": 2050,
    "genre": "Pop",
    "image": "https://cdn-images.dzcdn.net/images/artist/95a5fbc4ce12a45d064ff3156cfd8f5c/250x250-000000-80-0-0.jpg"
  },
  "Bad Bunny": {
    "start": 2017,
    "end": 2050,
    "genre": "Latin",
    "image": "https://cdn-images.dzcdn.net/images/artist/3ba7493b822295cfcc7484df7148a07f/250x250-000000-80-0-0.jpg"
  },
  "Kendrick Lamar": {
    "start": 2011,
    "end": 2050,
    "genre": "Hip Hop",
    "image": "https://cdn-images.dzcdn.net/images/artist/e71fba2ff4be2c488730999052b610c1/250x250-000000-80-0-0.jpg"
  },
  "J. Cole": {
    "start": 2010,
    "end": 2050,
    "genre": "Hip Hop",
    "image": "https://cdn-images.dzcdn.net/images/artist/36bebb5d3763f03b86026a267f8b9ecf/250x250-000000-80-0-0.jpg"
  },
  "Travis Scott": {
    "start": 2013,
    "end": 2050,
    "genre": "Hip Hop",
    "image": "https://cdn-images.dzcdn.net/images/artist/7db8087be82498db2da36ff69ff15dae/250x250-000000-80-0-0.jpg"
  },
  "Doja Cat": {
    "start": 2018,
    "end": 2050,
    "genre": "Hip Hop",
    "image": "https://cdn-images.dzcdn.net/images/artist/d12b0bb3198de7eeb88c1c01e66c9dbd/250x250-000000-80-0-0.jpg"
  },
  "SZA": {
    "start": 2014,
    "end": 2050,
    "genre": "R&B",
    "image": "https://cdn-images.dzcdn.net/images/artist/37e3d1ceee42fb2f6ef531fc801ed8fb/250x250-000000-80-0-0.jpg"
  },
  "Lana Del Rey": {
    "start": 2011,
    "end": 2050,
    "genre": "Indie",
    "image": "https://cdn-images.dzcdn.net/images/artist/57f1ca5ce892eb527d730aef245e3966/250x250-000000-80-0-0.jpg"
  },
  "Frank Ocean": {
    "start": 2011,
    "end": 2050,
    "genre": "R&B",
    "image": "https://cdn-images.dzcdn.net/images/artist/3c14c53ef8ddc5f6e3cceb6a67dae4ff/250x250-000000-80-0-0.jpg"
  },
  "Tyler, the Creator": {
    "start": 2011,
    "end": 2050,
    "genre": "Hip Hop",
    "image": "https://cdn-images.dzcdn.net/images/artist/11cbe28cb52c4ca7d5c907a4b0058b4b/250x250-000000-80-0-0.jpg"
  },
  "Lil Nas X": {
    "start": 2019,
    "end": 2050,
    "genre": "Hip Hop",
    "image": "https://cdn-images.dzcdn.net/images/artist/d0959f2c3eb2aab64a1387d853b0dfb9/250x250-000000-80-0-0.jpg"
  },
  "Cardi B": {
    "start": 2017,
    "end": 2050,
    "genre": "Hip Hop",
    "image": "https://cdn-images.dzcdn.net/images/artist/af776cd99efbc010c3782030df0e7e1e/250x250-000000-80-0-0.jpg"
  },
  "Nicki Minaj": {
    "start": 2010,
    "end": 2050,
    "genre": "Hip Hop",
    "image": "https://cdn-images.dzcdn.net/images/artist/53d53bdc676d1e4eb1bc10d8a57df38c/250x250-000000-80-0-0.jpg"
  },
  "Megan Thee Stallion": {
    "start": 2018,
    "end": 2050,
    "genre": "Hip Hop",
    "image": "https://cdn-images.dzcdn.net/images/artist/56c702a0a2df31c713b63200ff7343b2/250x250-000000-80-0-0.jpg"
  },
  "Jay-Z": {
    "start": 1996,
    "end": 2050,
    "genre": "Hip Hop",
    "image": "https://cdn-images.dzcdn.net/images/artist/ff684990c749aebeddb6e3c0b05b637f/250x250-000000-80-0-0.jpg"
  },
  "Lady Gaga": {
    "start": 2008,
    "end": 2050,
    "genre": "Pop",
    "image": "https://cdn-images.dzcdn.net/images/artist/c1ecfcd5b81bf66b3f20d82998ad5c4a/250x250-000000-80-0-0.jpg"
  },
  "Bruno Mars": {
    "start": 2010,
    "end": 2050,
    "genre": "Pop",
    "image": "https://cdn-images.dzcdn.net/images/artist/a05d8bc1955fbcd7428574102dc45495/250x250-000000-80-0-0.jpg"
  },
  "Miley Cyrus": {
    "start": 2007,
    "end": 2050,
    "genre": "Pop",
    "image": "https://cdn-images.dzcdn.net/images/artist/f104de0f4f9104085c88c7414df872eb/250x250-000000-80-0-0.jpg"
  },
  "Selena Gomez": {
    "start": 2009,
    "end": 2050,
    "genre": "Pop",
    "image": "https://cdn-images.dzcdn.net/images/artist/0ec3d2746c4f34657dcbb2e39b9bf8e0/250x250-000000-80-0-0.jpg"
  },
  "Demi Lovato": {
    "start": 2008,
    "end": 2050,
    "genre": "Pop",
    "image": "https://cdn-images.dzcdn.net/images/artist/06db3a30eb08331ffad09ed88f343868/250x250-000000-80-0-0.jpg"
  },
  "Shawn Mendes": {
    "start": 2014,
    "end": 2050,
    "genre": "Pop",
    "image": "https://cdn-images.dzcdn.net/images/artist/ce2fa255017df8edbe00f2e3be75a004/250x250-000000-80-0-0.jpg"
  },
  "Camila Cabello": {
    "start": 2017,
    "end": 2050,
    "genre": "Pop",
    "image": "https://cdn-images.dzcdn.net/images/artist/5e3b508f7ce19df1f7292215c2ec0fde/250x250-000000-80-0-0.jpg"
  },
  "Halsey": {
    "start": 2015,
    "end": 2050,
    "genre": "Pop",
    "image": "https://cdn-images.dzcdn.net/images/artist/81816f1c4e72be61f715dd7cbf0d769d/250x250-000000-80-0-0.jpg"
  },
  "Lorde": {
    "start": 2013,
    "end": 2050,
    "genre": "Pop",
    "image": "https://cdn-images.dzcdn.net/images/artist/e781eb894871e469deeddf1525f09ad9/250x250-000000-80-0-0.jpg"
  },
  "Charli XCX": {
    "start": 2013,
    "end": 2050,
    "genre": "Pop",
    "image": "https://cdn-images.dzcdn.net/images/artist/abf21eb757f59d240dce5a8508eb82f1/250x250-000000-80-0-0.jpg"
  },
  "Coldplay": {
    "start": 2000,
    "end": 2050,
    "genre": "Rock",
    "image": "https://cdn-images.dzcdn.net/images/artist/845115c5bd4a22c5e53be126742512f4/250x250-000000-80-0-0.jpg"
  },
  "Imagine Dragons": {
    "start": 2012,
    "end": 2050,
    "genre": "Rock",
    "image": "https://cdn-images.dzcdn.net/images/artist/683fb08d01d166ec7cda3a81763138b7/250x250-000000-80-0-0.jpg"
  },
  "Maroon 5": {
    "start": 2002,
    "end": 2050,
    "genre": "Pop",
    "image": "https://cdn-images.dzcdn.net/images/artist/230cc9eebfc8fc72e4ebef9eb98b4b74/250x250-000000-80-0-0.jpg"
  },
  "OneRepublic": {
    "start": 2007,
    "end": 2050,
    "genre": "Pop",
    "image": "https://cdn-images.dzcdn.net/images/artist/36556d769dc4052d915eb78c8daf98fb/250x250-000000-80-0-0.jpg"
  },
  "Arctic Monkeys": {
    "start": 2006,
    "end": 2050,
    "genre": "Rock",
    "image": "https://cdn-images.dzcdn.net/images/artist/6c03e4c7c36800897fd468633286db24/250x250-000000-80-0-0.jpg"
  },
  "The 1975": {
    "start": 2013,
    "end": 2050,
    "genre": "Rock",
    "image": "https://cdn-images.dzcdn.net/images/artist/3408c43ed74f73c88281b37a62a51638/250x250-000000-80-0-0.jpg"
  },
  "Tame Impala": {
    "start": 2010,
    "end": 2050,
    "genre": "Rock",
    "image": "https://cdn-images.dzcdn.net/images/artist/879015e713cc6ad6ffaeec154c027505/250x250-000000-80-0-0.jpg"
  },
  "Glass Animals": {
    "start": 2014,
    "end": 2050,
    "genre": "Indie",
    "image": "https://cdn-images.dzcdn.net/images/artist/b2e9164dfa2a293330ce341905710034/250x250-000000-80-0-0.jpg"
  },
  "FINNEAS": {
    "start": 2018,
    "end": 2050,
    "genre": "Pop",
    "image": "https://cdn-images.dzcdn.net/images/artist/d4cf2dedbdf65c8b42050fe987358d0c/250x250-000000-80-0-0.jpg"
  },
  "Jack Harlow": {
    "start": 2020,
    "end": 2050,
    "genre": "Hip Hop",
    "image": "https://cdn-images.dzcdn.net/images/artist/acf97ceb30d48a97e47afd1c3f9b68ce/250x250-000000-80-0-0.jpg"
  },
  "Sabrina Carpenter": {
    "start": 2015,
    "end": 2050,
    "genre": "Pop",
    "image": "https://cdn-images.dzcdn.net/images/artist/4a9cdc7737e2a0e59b4917b47884b859/250x250-000000-80-0-0.jpg"
  },
  "Tate McRae": {
    "start": 2020,
    "end": 2050,
    "genre": "Pop",
    "image": "https://cdn-images.dzcdn.net/images/artist/b3578bcbd54124c8125c9a9d52f38716/250x250-000000-80-0-0.jpg"
  },
  "Chappell Roan": {
    "start": 2022,
    "end": 2050,
    "genre": "Pop",
    "image": "https://cdn-images.dzcdn.net/images/artist/14ca3aea25950189f30efe0fa79ac4f9/250x250-000000-80-0-0.jpg"
  },
  "Ice Spice": {
    "start": 2022,
    "end": 2050,
    "genre": "Hip Hop",
    "image": "https://cdn-images.dzcdn.net/images/artist/175bb716a4289c50e39c048ad35b491e/250x250-000000-80-0-0.jpg"
  },
  "21 Savage": {
    "start": 2016,
    "end": 2050,
    "genre": "Hip Hop",
    "image": "https://cdn-images.dzcdn.net/images/artist/76b4cd56c7e94e8d2bdc3e2157e1080f/250x250-000000-80-0-0.jpg"
  },
  "Future": {
    "start": 2012,
    "end": 2050,
    "genre": "Hip Hop",
    "image": "https://cdn-images.dzcdn.net/images/artist/c8c8fea7e2b8613b3ba7328d22d3016c/250x250-000000-80-0-0.jpg"
  },
  "Metro Boomin": {
    "start": 2013,
    "end": 2050,
    "genre": "Hip Hop",
    "image": "https://cdn-images.dzcdn.net/images/artist/bc031b73f958987fa103031070be5c16/250x250-000000-80-0-0.jpg"
  },
  "Morgan Wallen": {
    "start": 2018,
    "end": 2050,
    "genre": "Country",
    "image": "https://cdn-images.dzcdn.net/images/artist/75488d12757f5809b9e6c7f53e5bb455/250x250-000000-80-0-0.jpg"
  },
  "Luke Combs": {
    "start": 2017,
    "end": 2050,
    "genre": "Country",
    "image": "https://cdn-images.dzcdn.net/images/artist/c2a8e5d0d293a06bf887bb2724a780bc/250x250-000000-80-0-0.jpg"
  },
  "Zach Bryan": {
    "start": 2021,
    "end": 2050,
    "genre": "Country",
    "image": "https://cdn-images.dzcdn.net/images/artist/552d448a0c2cb72f40c3de3a384949bd/250x250-000000-80-0-0.jpg"
  },
  "Peso Pluma": {
    "start": 2023,
    "end": 2050,
    "genre": "Latin",
    "image": "https://cdn-images.dzcdn.net/images/artist/dde2bf89c1e8da0aeb94436681bc3aac/250x250-000000-80-0-0.jpg"
  },
  "Karol G": {
    "start": 2017,
    "end": 2050,
    "genre": "Latin",
    "image": "https://cdn-images.dzcdn.net/images/artist/dd8c6b3068d2761955eb6e432046ed91/250x250-000000-80-0-0.jpg"
  },
  "Shakira": {
    "start": 1995,
    "end": 2050,
    "genre": "Latin",
    "image": "https://cdn-images.dzcdn.net/images/artist/69c569506a8ff6ab0edfecbd1adf94b0/250x250-000000-80-0-0.jpg"
  },
  "Rauw Alejandro": {
    "start": 2019,
    "end": 2050,
    "genre": "Latin",
    "image": "https://cdn-images.dzcdn.net/images/artist/0e7b2b93b91789a054bc3f08bb3df3a8/250x250-000000-80-0-0.jpg"
  },
  "Anitta": {
    "start": 2015,
    "end": 2050,
    "genre": "Latin",
    "image": "https://cdn-images.dzcdn.net/images/artist/bab6017df606c55ba0b5418fc345c3ca/250x250-000000-80-0-0.jpg"
  },
  "Latto": {
    "start": 2020,
    "end": 2050,
    "genre": "Hip Hop",
    "image": "https://cdn-images.dzcdn.net/images/artist/01a5b9598e1de78a0cfad893c0e4e161/250x250-000000-80-0-0.jpg"
  },
  "GloRilla": {
    "start": 2022,
    "end": 2050,
    "genre": "Hip Hop",
    "image": "https://cdn-images.dzcdn.net/images/artist/6bccd80c250c642b7d5262480e8af617/250x250-000000-80-0-0.jpg"
  },
  "Sexyy Red": {
    "start": 2023,
    "end": 2050,
    "genre": "Hip Hop",
    "image": "https://cdn-images.dzcdn.net/images/artist/5b4a7d84536a2f0edde7eca15469057d/250x250-000000-80-0-0.jpg"
  },
  "Coi Leray": {
    "start": 2021,
    "end": 2050,
    "genre": "Hip Hop",
    "image": "https://cdn-images.dzcdn.net/images/artist/8aebf8da8832f87d840330bf994cfb59/250x250-000000-80-0-0.jpg"
  },
  "Flo Milli": {
    "start": 2020,
    "end": 2050,
    "genre": "Hip Hop",
    "image": "https://cdn-images.dzcdn.net/images/artist/db4c9e92ebbb65eaca8d4f8ef5bf82d3/250x250-000000-80-0-0.jpg"
  },
  "Charlie Puth": {
    "start": 2015,
    "end": 2050,
    "genre": "Pop",
    "image": ""
  },
  "Katy Perry": {
    "start": 2008,
    "end": 2050,
    "genre": "Pop",
    "image": ""
  },
  "Troye Sivan": {
    "start": 2014,
    "end": 2050,
    "genre": "Pop",
    "image": ""
  },
  "ZAYN": {
    "start": 2016,
    "end": 2050,
    "genre": "Pop",
    "image": ""
  },
  "Conan Gray": {
    "start": 2020,
    "end": 2050,
    "genre": "Pop",
    "image": ""
  },
  "Kesha": {
    "start": 2009,
    "end": 2050,
    "genre": "Pop",
    "image": ""
  },
  "Playboi Carti": {
    "start": 2017,
    "end": 2050,
    "genre": "Hip Hop",
    "image": ""
  },
  "Lil Uzi Vert": {
    "start": 2016,
    "end": 2050,
    "genre": "Hip Hop",
    "image": ""
  },
  "Young Thug": {
    "start": 2014,
    "end": 2050,
    "genre": "Hip Hop",
    "image": ""
  },
  "A$AP Rocky": {
    "start": 2011,
    "end": 2050,
    "genre": "Hip Hop",
    "image": ""
  },
  "Lil Yachty": {
    "start": 2016,
    "end": 2050,
    "genre": "Hip Hop",
    "image": ""
  },
  "Pop Smoke": {
    "start": 2019,
    "end": 2020,
    "genre": "Hip Hop",
    "image": ""
  },
  "Juice WRLD": {
    "start": 2018,
    "end": 2019,
    "genre": "Hip Hop",
    "image": ""
  },
  "Gunna": {
    "start": 2018,
    "end": 2050,
    "genre": "Hip Hop",
    "image": ""
  },
  "Lil Baby": {
    "start": 2018,
    "end": 2050,
    "genre": "Hip Hop",
    "image": ""
  },
  "BTS": {
    "start": 2013,
    "end": 2050,
    "genre": "K-Pop",
    "image": "https://cdn-images.dzcdn.net/images/artist/b5c64fa8216ca158e52b4d88bd9388ff/250x250-000000-80-0-0.jpg"
  },
  "BLACKPINK": {
    "start": 2016,
    "end": 2050,
    "genre": "K-Pop",
    "image": "https://cdn-images.dzcdn.net/images/artist/89675729453893a91be35bde691050ff/250x250-000000-80-0-0.jpg"
  },
  "NewJeans": {
    "start": 2022,
    "end": 2050,
    "genre": "K-Pop",
    "image": "https://cdn-images.dzcdn.net/images/artist/0866c2c1d7d00879f5db46ddc1250db8/250x250-000000-80-0-0.jpg"
  },
  "Stray Kids": {
    "start": 2018,
    "end": 2050,
    "genre": "K-Pop",
    "image": "https://cdn-images.dzcdn.net/images/artist/004d3950684af2157081072af2df192b/250x250-000000-80-0-0.jpg"
  },
  "TWICE": {
    "start": 2015,
    "end": 2050,
    "genre": "K-Pop",
    "image": "https://cdn-images.dzcdn.net/images/artist/1f4acadade675899b7f775ae4ac67faa/250x250-000000-80-0-0.jpg"
  },
  "SEVENTEEN": {
    "start": 2015,
    "end": 2050,
    "genre": "K-Pop",
    "image": "https://cdn-images.dzcdn.net/images/artist/f24702900c1454ea23c573a3eed5b149/250x250-000000-80-0-0.jpg"
  },
  "LE SSERAFIM": {
    "start": 2022,
    "end": 2050,
    "genre": "K-Pop",
    "image": "https://cdn-images.dzcdn.net/images/artist/e789ab2d16cad9a738cd83722940512b/250x250-000000-80-0-0.jpg"
  },
  "(G)I-DLE": {
    "start": 2018,
    "end": 2050,
    "genre": "K-Pop",
    "image": "https://cdn-images.dzcdn.net/images/artist/0b381aacaf9b4c4c1b60664431c815bf/250x250-000000-80-0-0.jpg"
  },
  "Jungkook": {
    "start": 2013,
    "end": 2050,
    "genre": "K-Pop",
    "image": "https://cdn-images.dzcdn.net/images/artist/7e8a65d06b7c0293ff33f44e34a8b7e6/250x250-000000-80-0-0.jpg"
  },
  "Jennie": {
    "start": 2016,
    "end": 2050,
    "genre": "K-Pop",
    "image": "https://cdn-images.dzcdn.net/images/artist/56c65ac9ea451119ddc8c0b02915d103/250x250-000000-80-0-0.jpg"
  },
  "Lisa": {
    "start": 2016,
    "end": 2050,
    "genre": "K-Pop",
    "image": "https://cdn-images.dzcdn.net/images/artist/040c7161f753b46331aad225cb8bac38/250x250-000000-80-0-0.jpg"
  },
  "aespa": {
    "start": 2020,
    "end": 2050,
    "genre": "K-Pop",
    "image": "https://cdn-images.dzcdn.net/images/artist/0031639b755895dc9d638628587c5459/250x250-000000-80-0-0.jpg"
  },
  "J Balvin": {
    "start": 2009,
    "end": 2050,
    "genre": "Latin",
    "image": "https://cdn-images.dzcdn.net/images/artist/325eaa46bc25052d0e3d549d60cc8225/250x250-000000-80-0-0.jpg"
  },
  "Maluma": {
    "start": 2012,
    "end": 2050,
    "genre": "Latin",
    "image": "https://cdn-images.dzcdn.net/images/artist/a1627f420e880b7229e52890b99626c9/250x250-000000-80-0-0.jpg"
  },
  "Rosalía": {
    "start": 2017,
    "end": 2050,
    "genre": "Latin",
    "image": "https://cdn-images.dzcdn.net/images/artist/96636156440182f1e7db3f77d39e6545/250x250-000000-80-0-0.jpg"
  },
  "Feid": {
    "start": 2015,
    "end": 2050,
    "genre": "Latin",
    "image": "https://cdn-images.dzcdn.net/images/artist/a37d75aa98b04da700412398a988c31a/250x250-000000-80-0-0.jpg"
  },
  "Myke Towers": {
    "start": 2016,
    "end": 2050,
    "genre": "Latin",
    "image": "https://cdn-images.dzcdn.net/images/artist/d3a7418b4e44bf8ee3ae268067a86f09/250x250-000000-80-0-0.jpg"
  },
  "Young Miko": {
    "start": 2021,
    "end": 2050,
    "genre": "Latin",
    "image": "https://cdn-images.dzcdn.net/images/artist/5912325ca89e72e925de22d05001ed4a/250x250-000000-80-0-0.jpg"
  },
  "Ozuna": {
    "start": 2015,
    "end": 2050,
    "genre": "Latin",
    "image": "https://cdn-images.dzcdn.net/images/artist/df2030b9e796f55f58d2c4b68aecb18f/250x250-000000-80-0-0.jpg"
  },
  "Bizarrap": {
    "start": 2018,
    "end": 2050,
    "genre": "Latin",
    "image": "https://cdn-images.dzcdn.net/images/artist/e121c1ef9b1135e6a5b71c1e65ab10b4/250x250-000000-80-0-0.jpg"
  },
  "Calvin Harris": {
    "start": 2007,
    "end": 2050,
    "genre": "Electronic",
    "image": "https://cdn-images.dzcdn.net/images/artist/a53031d02dc2f8a8eb15d117c015d5eb/250x250-000000-80-0-0.jpg"
  },
  "David Guetta": {
    "start": 2002,
    "end": 2050,
    "genre": "Electronic",
    "image": "https://cdn-images.dzcdn.net/images/artist/2d527fa03e106ed82a28f161694278d3/250x250-000000-80-0-0.jpg"
  },
  "Skrillex": {
    "start": 2010,
    "end": 2050,
    "genre": "Electronic",
    "image": "https://cdn-images.dzcdn.net/images/artist/0075f053766d7d0e12e4a7be22b85e6a/250x250-000000-80-0-0.jpg"
  },
  "Diplo": {
    "start": 2004,
    "end": 2050,
    "genre": "Electronic",
    "image": "https://cdn-images.dzcdn.net/images/artist/e26fa83b67df45f262ce0181c3b86463/250x250-000000-80-0-0.jpg"
  },
  "Zedd": {
    "start": 2012,
    "end": 2050,
    "genre": "Electronic",
    "image": "https://cdn-images.dzcdn.net/images/artist/6013ec7ad0b823306c3582e2792dd145/250x250-000000-80-0-0.jpg"
  },
  "Martin Garrix": {
    "start": 2013,
    "end": 2050,
    "genre": "Electronic",
    "image": "https://cdn-images.dzcdn.net/images/artist/4cab1c0cbe0edc1b3d2234873abc485e/250x250-000000-80-0-0.jpg"
  },
  "Bob Marley": {
    "start": 1962,
    "end": 1981,
    "genre": "Reggae",
    "image": "https://cdn-images.dzcdn.net/images/artist/c8241e15efdefa9465c7b470643efb3b/250x250-000000-80-0-0.jpg"
  },
  "Sean Paul": {
    "start": 1996,
    "end": 2050,
    "genre": "Reggae",
    "image": "https://cdn-images.dzcdn.net/images/artist/043332be51a1a67cb0a363ea88475a41/250x250-000000-80-0-0.jpg"
  },
  "Koffee": {
    "start": 2018,
    "end": 2050,
    "genre": "Reggae",
    "image": "https://cdn-images.dzcdn.net/images/artist/fa724e6edaae0359a9e8d63815ecc29d/250x250-000000-80-0-0.jpg"
  },
  "Shaggy": {
    "start": 1993,
    "end": 2050,
    "genre": "Reggae",
    "image": "https://cdn-images.dzcdn.net/images/artist/2e74048a1d7271efc79b0d3a91fdf085/250x250-000000-80-0-0.jpg"
  },
  "Popcaan": {
    "start": 2010,
    "end": 2050,
    "genre": "Reggae",
    "image": "https://cdn-images.dzcdn.net/images/artist/17a66041a82cd6ead846178a104ecdf4/250x250-000000-80-0-0.jpg"
  },
  "Burna Boy": {
    "start": 2012,
    "end": 2050,
    "genre": "Afrobeats",
    "image": "https://cdn-images.dzcdn.net/images/artist/ad15b7f03325752d60db9e4d39c079ae/250x250-000000-80-0-0.jpg"
  },
  "Wizkid": {
    "start": 2010,
    "end": 2050,
    "genre": "Afrobeats",
    "image": "https://cdn-images.dzcdn.net/images/artist/171332ffcaa66c2b5583d7630297be88/250x250-000000-80-0-0.jpg"
  },
  "Davido": {
    "start": 2011,
    "end": 2050,
    "genre": "Afrobeats",
    "image": "https://cdn-images.dzcdn.net/images/artist/bb20fa59263d537ce7a27160b8471aed/250x250-000000-80-0-0.jpg"
  },
  "Rema": {
    "start": 2019,
    "end": 2050,
    "genre": "Afrobeats",
    "image": "https://cdn-images.dzcdn.net/images/artist/45262002b65a0bb0157aff134106c72b/250x250-000000-80-0-0.jpg"
  },
  "Tems": {
    "start": 2018,
    "end": 2050,
    "genre": "Afrobeats",
    "image": "https://cdn-images.dzcdn.net/images/artist/6afe2edff567600abf781c3d8a29344b/250x250-000000-80-0-0.jpg"
  },
  "Asake": {
    "start": 2020,
    "end": 2050,
    "genre": "Afrobeats",
    "image": "https://cdn-images.dzcdn.net/images/artist/29baf235626c8cd1cdc782c6d467aca8/250x250-000000-80-0-0.jpg"
  },
  "Omah Lay": {
    "start": 2020,
    "end": 2050,
    "genre": "Afrobeats",
    "image": "https://cdn-images.dzcdn.net/images/artist/e8ce64479eb3d7fc2853f7fd694cc999/250x250-000000-80-0-0.jpg"
  }
};




// moreImages patch

Object.entries({"Charlie Puth":"https://cdn-images.dzcdn.net/images/artist/9f38f83196c81faeab5a59f518e9cff2/250x250-000000-80-0-0.jpg","Katy Perry":"https://cdn-images.dzcdn.net/images/artist/01a4bcbc8c3e8705f4305ec7cb6d31bb/250x250-000000-80-0-0.jpg","Troye Sivan":"https://cdn-images.dzcdn.net/images/artist/d17b20de840938ff56a237f374edfc45/250x250-000000-80-0-0.jpg","ZAYN":"https://cdn-images.dzcdn.net/images/artist/bcbebd7480a0fb9c656641e7d23d8c19/250x250-000000-80-0-0.jpg","Conan Gray":"https://cdn-images.dzcdn.net/images/artist/cc5056e180d70ce379b1df092ff991d3/250x250-000000-80-0-0.jpg","Kesha":"https://cdn-images.dzcdn.net/images/artist/11cc7c5a08bd2f7fa7fb2930eb5a6e25/250x250-000000-80-0-0.jpg","Playboi Carti":"https://cdn-images.dzcdn.net/images/artist/c17b8f0417934c9f131a4fa62baac816/250x250-000000-80-0-0.jpg","Lil Uzi Vert":"https://cdn-images.dzcdn.net/images/artist/c60010cc39f3ebc6731932ea48cf9f0e/250x250-000000-80-0-0.jpg","Young Thug":"https://cdn-images.dzcdn.net/images/artist/19eb2e0cfcd08534125b29b63486b72d/250x250-000000-80-0-0.jpg","A$AP Rocky":"https://cdn-images.dzcdn.net/images/artist/733979fdb23145d2e0523ed60912fbbd/250x250-000000-80-0-0.jpg","Lil Yachty":"https://cdn-images.dzcdn.net/images/artist/4ab0eb922c2a2dcff6d8cfd3d3a033ec/250x250-000000-80-0-0.jpg","Pop Smoke":"https://cdn-images.dzcdn.net/images/artist/230cc9eebfc8fc72e4ebef9eb98b4b74/250x250-000000-80-0-0.jpg","Juice WRLD":"https://cdn-images.dzcdn.net/images/artist/683fb08d01d166ec7cda3a81763138b7/250x250-000000-80-0-0.jpg","Gunna":"https://cdn-images.dzcdn.net/images/artist/6c03e4c7c36800897fd468633286db24/250x250-000000-80-0-0.jpg","Lil Baby":"https://cdn-images.dzcdn.net/images/artist/845115c5bd4a22c5e53be126742512f4/250x250-000000-80-0-0.jpg"}).forEach(([name, image]) => {
  if (image) {
    NPC_ARTIST_IMAGES[name] = image;
  }
});

// Eras new additions
Object.assign(NPC_ERAS, {"Aretha Franklin":{"start":1961,"end":2018,"genre":"R&B","image":"https://e-cdns-images.dzcdn.net/images/artist/b8110b6d21f8a846200257c70cbf73e9/250x250-000000-80-0-0.jpg"},"Diana Ross":{"start":1970,"end":2050,"genre":"R&B","image":"https://e-cdns-images.dzcdn.net/images/artist/b6f1ca33fbe40d348a27d2194cf3eec9/250x250-000000-80-0-0.jpg"},"Bee Gees":{"start":1965,"end":2003,"genre":"Pop","image":"https://e-cdns-images.dzcdn.net/images/artist/4ebef891bc86ff542b6f5cf1de36f875/250x250-000000-80-0-0.jpg"},"The Rolling Stones":{"start":1962,"end":2050,"genre":"Rock","image":"https://e-cdns-images.dzcdn.net/images/artist/1e74880c54bb9b5f818fdfcb796b4121/250x250-000000-80-0-0.jpg"},"Eagles":{"start":1971,"end":2050,"genre":"Rock","image":"https://e-cdns-images.dzcdn.net/images/artist/c1a6f8742cc65a8df241dcd79fcbd9fa/250x250-000000-80-0-0.jpg"},"Donna Summer":{"start":1974,"end":2012,"genre":"Pop","image":"https://e-cdns-images.dzcdn.net/images/artist/7e4a77b311319dbf678cded0c67e1a38/250x250-000000-80-0-0.jpg"},"Tina Turner":{"start":1984,"end":2023,"genre":"Rock","image":"https://e-cdns-images.dzcdn.net/images/artist/f1fb89eb8e390c5003c20c0dcfe63f45/250x250-000000-80-0-0.jpg"},"Cyndi Lauper":{"start":1983,"end":2050,"genre":"Pop","image":"https://e-cdns-images.dzcdn.net/images/artist/8cc53ff33be927164ccb6ce2ec9e4ba6/250x250-000000-80-0-0.jpg"},"Cher":{"start":1965,"end":2050,"genre":"Pop","image":"https://e-cdns-images.dzcdn.net/images/artist/b28096f9bf11b66ebbb1296c6b412140/250x250-000000-80-0-0.jpg"},"Def Leppard":{"start":1980,"end":2050,"genre":"Rock","image":"https://e-cdns-images.dzcdn.net/images/artist/f9630c33ad78a834c9c22eb430dcb989/250x250-000000-80-0-0.jpg"},"AC/DC":{"start":1973,"end":2050,"genre":"Rock","image":"https://e-cdns-images.dzcdn.net/images/artist/b2fa8bc635583b27b3e839e9fc1f912a/250x250-000000-80-0-0.jpg"},"Shania Twain":{"start":1993,"end":2050,"genre":"Country","image":"https://e-cdns-images.dzcdn.net/images/artist/7e4a77b311319dbf678cded0c67e1a38/250x250-000000-80-0-0.jpg"},"No Doubt":{"start":1992,"end":2012,"genre":"Pop","image":"https://e-cdns-images.dzcdn.net/images/artist/23c14d485ee414cae818bbd0a79040db/250x250-000000-80-0-0.jpg"},"Aaliyah":{"start":1994,"end":2001,"genre":"R&B","image":"https://e-cdns-images.dzcdn.net/images/artist/81005a39626c8cd1cf9c9f28ecb3a2a6/250x250-000000-80-0-0.jpg"},"Lauryn Hill":{"start":1998,"end":2050,"genre":"R&B","image":"https://e-cdns-images.dzcdn.net/images/artist/b6f1ca33fbe40d348a27d2194cf3eec9/250x250-000000-80-0-0.jpg"},"Pearl Jam":{"start":1991,"end":2050,"genre":"Rock","image":"https://e-cdns-images.dzcdn.net/images/artist/43e74ff1f3bf78b4d08e56314ff9478e/250x250-000000-80-0-0.jpg"},"Red Hot Chili Peppers":{"start":1984,"end":2050,"genre":"Rock","image":"https://e-cdns-images.dzcdn.net/images/artist/6b68596fde6be6ecab39cb32eefdd920/250x250-000000-80-0-0.jpg"},"Eminem":{"start":1999,"end":2050,"genre":"Hip Hop","image":"https://e-cdns-images.dzcdn.net/images/artist/19cc38f9d69b352f718782e7a22f9c32/250x250-000000-80-0-0.jpg"},"Christina Aguilera":{"start":1999,"end":2050,"genre":"Pop","image":"https://e-cdns-images.dzcdn.net/images/artist/3ff402daee9c78d5ce8084a77b75ecb0/250x250-000000-80-0-0.jpg"},"Kelly Clarkson":{"start":2002,"end":2050,"genre":"Pop","image":"https://e-cdns-images.dzcdn.net/images/artist/7733cc50d87edfa15739c9df382fb2e4/250x250-000000-80-0-0.jpg"},"Avril Lavigne":{"start":2002,"end":2050,"genre":"Rock","image":"https://e-cdns-images.dzcdn.net/images/artist/a1be2e68449c25f4ab36181b5fbce306/250x250-000000-80-0-0.jpg"},"P!nk":{"start":2000,"end":2050,"genre":"Pop","image":"https://e-cdns-images.dzcdn.net/images/artist/b7a2d6742512f45037d453715c0a373b/250x250-000000-80-0-0.jpg"},"Justin Timberlake":{"start":2002,"end":2050,"genre":"Pop","image":"https://e-cdns-images.dzcdn.net/images/artist/818fdfcb796b41217e74880c54bb9b5f/250x250-000000-80-0-0.jpg"},"Missy Elliott":{"start":1997,"end":2050,"genre":"Hip Hop","image":"https://e-cdns-images.dzcdn.net/images/artist/bdab4cc8dbad3a9dae88ff39ccb36ce9/250x250-000000-80-0-0.jpg"}}, {
  "David Bowie": {
    "start": 1969,
    "end": 2016,
    "genre": "Rock",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/f1d7e2f5b4ed697ccabcf9163e8a4a58/250x250-000000-80-0-0.jpg"
  },
  "Elton John": {
    "start": 1969,
    "end": 2050,
    "genre": "Pop",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/a824706db6ed2a4176461b2fc8ad0dfc/250x250-000000-80-0-0.jpg"
  },
  "Stevie Wonder": {
    "start": 1962,
    "end": 2050,
    "genre": "R&B",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/b28096f9bf11b66ebbb1296c6b412140/250x250-000000-80-0-0.jpg"
  },
  "Fleetwood Mac": {
    "start": 1968,
    "end": 2050,
    "genre": "Rock",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/f9630c33ad78a834c9c22eb430dcb989/250x250-000000-80-0-0.jpg"
  },
  "Queen": {
    "start": 1973,
    "end": 2050,
    "genre": "Rock",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/23c14d485ee414cae818bbd0a79040db/250x250-000000-80-0-0.jpg"
  },
  "ABBA": {
    "start": 1972,
    "end": 1982,
    "genre": "Pop",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/d5ebf9fc325143a1a9e33d262df5846c/250x250-000000-80-0-0.jpg"
  },
  "Pink Floyd": {
    "start": 1967,
    "end": 2014,
    "genre": "Rock",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/8cc53ff33be927164ccb6ce2ec9e4ba6/250x250-000000-80-0-0.jpg"
  },
  "Led Zeppelin": {
    "start": 1969,
    "end": 1980,
    "genre": "Rock",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/43e74ff1f3bf78b4d08e56314ff9478e/250x250-000000-80-0-0.jpg"
  },
  "Bruce Springsteen": {
    "start": 1973,
    "end": 2050,
    "genre": "Rock",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/335805560940dcf16d470d04c4f9eb66/250x250-000000-80-0-0.jpg"
  },
  "U2": {
    "start": 1980,
    "end": 2050,
    "genre": "Rock",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/6b68596fde6be6ecab39cb32eefdd920/250x250-000000-80-0-0.jpg"
  },
  "George Michael": {
    "start": 1982,
    "end": 2016,
    "genre": "Pop",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/a1be2e68449c25f4ab36181b5fbce306/250x250-000000-80-0-0.jpg"
  },
  "Phil Collins": {
    "start": 1981,
    "end": 2050,
    "genre": "Pop",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/b06385d5ad198308cf2b170e7e1694c9/250x250-000000-80-0-0.jpg"
  },
  "Bon Jovi": {
    "start": 1984,
    "end": 2050,
    "genre": "Rock",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/b2fa8bc635583b27b3e839e9fc1f912a/250x250-000000-80-0-0.jpg"
  },
  "Guns N' Roses": {
    "start": 1987,
    "end": 2050,
    "genre": "Rock",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/7733cc50d87edfa15739c9df382fb2e4/250x250-000000-80-0-0.jpg"
  },
  "Janet Jackson": {
    "start": 1982,
    "end": 2050,
    "genre": "R&B",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/f1cc5bcba18a10b42f6c8d4512c1404c/250x250-000000-80-0-0.jpg"
  },
  "Mariah Carey": {
    "start": 1990,
    "end": 2050,
    "genre": "R&B",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/f56641e7d23d8c1995a329d675bb2f69/250x250-000000-80-0-0.jpg"
  },
  "Celine Dion": {
    "start": 1990,
    "end": 2050,
    "genre": "Pop",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/7e4a77b311319dbf678cded0c67e1a38/250x250-000000-80-0-0.jpg"
  },
  "Spice Girls": {
    "start": 1996,
    "end": 2000,
    "genre": "Pop",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/b7a2d6742512f45037d453715c0a373b/250x250-000000-80-0-0.jpg"
  },
  "TLC": {
    "start": 1992,
    "end": 2050,
    "genre": "R&B",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/81005a39626c8cd1cf9c9f28ecb3a2a6/250x250-000000-80-0-0.jpg"
  },
  "Oasis": {
    "start": 1994,
    "end": 2009,
    "genre": "Rock",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/735dbd26a2675713dfce0cfcd31a7836/250x250-000000-80-0-0.jpg"
  },
  "Radiohead": {
    "start": 1992,
    "end": 2050,
    "genre": "Rock",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/7c7a522dd4bb134958ce74e6f49dd9e8/250x250-000000-80-0-0.jpg"
  },
  "Snoop Dogg": {
    "start": 1992,
    "end": 2050,
    "genre": "Hip Hop",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/bdab4cc8dbad3a9dae88ff39ccb36ce9/250x250-000000-80-0-0.jpg"
  },
  "Jay-Z": {
    "start": 1996,
    "end": 2050,
    "genre": "Hip Hop",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/ecb18f081c7f9df8813a7c64a39b3cc1/250x250-000000-80-0-0.jpg"
  },
  "Destiny's Child": {
    "start": 1997,
    "end": 2006,
    "genre": "R&B",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/88b5668eeb1161d2d3e4e7303e3a479d/250x250-000000-80-0-0.jpg"
  },
  "Beyoncé": {
    "start": 2003,
    "end": 2050,
    "genre": "R&B",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/b6f5cf1de36f875323a7891bc86ff542/250x250-000000-80-0-0.jpg"
  },
  "Rihanna": {
    "start": 2005,
    "end": 2050,
    "genre": "Pop",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/33e382b68378619bcbb8f9ce136d8be6/250x250-000000-80-0-0.jpg"
  },
  "Coldplay": {
    "start": 2000,
    "end": 2050,
    "genre": "Rock",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/8d7fc4917462762a74c4dbb242e881dc/250x250-000000-80-0-0.jpg"
  },
  "Linkin Park": {
    "start": 2000,
    "end": 2050,
    "genre": "Rock",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/3cc3f8da08e9d8f3ea7f9e8557997672/250x250-000000-80-0-0.jpg"
  },
  "Alicia Keys": {
    "start": 2001,
    "end": 2050,
    "genre": "R&B",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/a232f01fbd8f168fbcfffc07153a5518/250x250-000000-80-0-0.jpg"
  },
  "Usher": {
    "start": 1994,
    "end": 2050,
    "genre": "R&B",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/1e7cc4d8123df16d5570bbcc671755fb/250x250-000000-80-0-0.jpg"
  },
  "OutKast": {
    "start": 1994,
    "end": 2014,
    "genre": "Hip Hop",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/b7ee0420b72a6b2259eb5607dbfa33f9/250x250-000000-80-0-0.jpg"
  },
  "50 Cent": {
    "start": 2003,
    "end": 2050,
    "genre": "Hip Hop",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/e7a22f9c3230a1334c9c7fecfa1cded3/250x250-000000-80-0-0.jpg"
  },
  "Green Day": {
    "start": 1994,
    "end": 2050,
    "genre": "Rock",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/bd3bba65b6f00dbba3b1d167ef088fa6/250x250-000000-80-0-0.jpg"
  },
  "Lady Gaga": {
    "start": 2008,
    "end": 2050,
    "genre": "Pop",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/d1ff8217bbba9c6f272a843916960cc2/250x250-000000-80-0-0.jpg"
  },
  "Katy Perry": {
    "start": 2008,
    "end": 2050,
    "genre": "Pop",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/01a4bcbc8c3e8705f4305ec7cb6d31bb/250x250-000000-80-0-0.jpg"
  },
  "Huda Mustafa": {
    "start": 2025,
    "end": 2050,
    "genre": "Pop",
    "image": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
  },
  "TRIM": {
    "start": 2025,
    "end": 2050,
    "genre": "Hip Hop",
    "image": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
  },
  "Sunshine Benzi": {
    "start": 2025,
    "end": 2050,
    "genre": "R&B",
    "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
  },
  "Stunna Sandy": {
    "start": 2025,
    "end": 2050,
    "genre": "Hip Hop",
    "image": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
  },
  "Charlie Puth": {
    "start": 2015,
    "end": 2050,
    "genre": "Pop",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/9f38f83196c81faeab5a59f518e9cff2/250x250-000000-80-0-0.jpg"
  },
  "Troye Sivan": {
    "start": 2014,
    "end": 2050,
    "genre": "Pop",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/d17b20de840938ff56a237f374edfc45/250x250-000000-80-0-0.jpg"
  },
  "ZAYN": {
    "start": 2016,
    "end": 2050,
    "genre": "Pop",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/bcbebd7480a0fb9c656641e7d23d8c19/250x250-000000-80-0-0.jpg"
  },
  "Conan Gray": {
    "start": 2018,
    "end": 2050,
    "genre": "Pop",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/cc5056e180d70ce379b1df092ff991d3/250x250-000000-80-0-0.jpg"
  },
  "Kesha": {
    "start": 2009,
    "end": 2050,
    "genre": "Pop",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/11cc7c5a08bd2f7fa7fb2930eb5a6e25/250x250-000000-80-0-0.jpg"
  },
  "Playboi Carti": {
    "start": 2017,
    "end": 2050,
    "genre": "Hip Hop",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/c17b8f0417934c9f131a4fa62baac816/250x250-000000-80-0-0.jpg"
  },
  "Lil Uzi Vert": {
    "start": 2015,
    "end": 2050,
    "genre": "Hip Hop",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/c60010cc39f3ebc6731932ea48cf9f0e/250x250-000000-80-0-0.jpg"
  },
  "Young Thug": {
    "start": 2014,
    "end": 2050,
    "genre": "Hip Hop",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/19eb2e0cfcd08534125b29b63486b72d/250x250-000000-80-0-0.jpg"
  },
  "A$AP Rocky": {
    "start": 2011,
    "end": 2050,
    "genre": "Hip Hop",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/733979fdb23145d2e0523ed60912fbbd/250x250-000000-80-0-0.jpg"
  },
  "Lil Yachty": {
    "start": 2016,
    "end": 2050,
    "genre": "Hip Hop",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/4ab0eb922c2a2dcff6d8cfd3d3a033ec/250x250-000000-80-0-0.jpg"
  },
  "Pop Smoke": {
    "start": 2019,
    "end": 2020,
    "genre": "Hip Hop",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/230cc9eebfc8fc72e4ebef9eb98b4b74/250x250-000000-80-0-0.jpg"
  },
  "Juice WRLD": {
    "start": 2018,
    "end": 2019,
    "genre": "Hip Hop",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/683fb08d01d166ec7cda3a81763138b7/250x250-000000-80-0-0.jpg"
  },
  "Gunna": {
    "start": 2018,
    "end": 2050,
    "genre": "Hip Hop",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/6c03e4c7c36800897fd468633286db24/250x250-000000-80-0-0.jpg"
  },
  "Lil Baby": {
    "start": 2017,
    "end": 2050,
    "genre": "Hip Hop",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/845115c5bd4a22c5e53be126742512f4/250x250-000000-80-0-0.jpg"
  }
});



// Eras extra additions
Object.assign(NPC_ERAS, {
  "Aretha Franklin": {
    "start": 1961,
    "end": 2018,
    "genre": "R&B",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/b8110b6d21f8a846200257c70cbf73e9/250x250-000000-80-0-0.jpg"
  },
  "Diana Ross": {
    "start": 1970,
    "end": 2050,
    "genre": "R&B",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/b6f1ca33fbe40d348a27d2194cf3eec9/250x250-000000-80-0-0.jpg"
  },
  "Bee Gees": {
    "start": 1965,
    "end": 2003,
    "genre": "Pop",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/4ebef891bc86ff542b6f5cf1de36f875/250x250-000000-80-0-0.jpg"
  },
  "The Rolling Stones": {
    "start": 1962,
    "end": 2050,
    "genre": "Rock",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/1e74880c54bb9b5f818fdfcb796b4121/250x250-000000-80-0-0.jpg"
  },
  "Eagles": {
    "start": 1971,
    "end": 2050,
    "genre": "Rock",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/c1a6f8742cc65a8df241dcd79fcbd9fa/250x250-000000-80-0-0.jpg"
  },
  "Donna Summer": {
    "start": 1974,
    "end": 2012,
    "genre": "Pop",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/7e4a77b311319dbf678cded0c67e1a38/250x250-000000-80-0-0.jpg"
  },
  "Tina Turner": {
    "start": 1984,
    "end": 2023,
    "genre": "Rock",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/f1fb89eb8e390c5003c20c0dcfe63f45/250x250-000000-80-0-0.jpg"
  },
  "Cyndi Lauper": {
    "start": 1983,
    "end": 2050,
    "genre": "Pop",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/8cc53ff33be927164ccb6ce2ec9e4ba6/250x250-000000-80-0-0.jpg"
  },
  "Cher": {
    "start": 1965,
    "end": 2050,
    "genre": "Pop",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/b28096f9bf11b66ebbb1296c6b412140/250x250-000000-80-0-0.jpg"
  },
  "Def Leppard": {
    "start": 1980,
    "end": 2050,
    "genre": "Rock",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/f9630c33ad78a834c9c22eb430dcb989/250x250-000000-80-0-0.jpg"
  },
  "AC/DC": {
    "start": 1973,
    "end": 2050,
    "genre": "Rock",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/b2fa8bc635583b27b3e839e9fc1f912a/250x250-000000-80-0-0.jpg"
  },
  "Shania Twain": {
    "start": 1993,
    "end": 2050,
    "genre": "Country",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/7e4a77b311319dbf678cded0c67e1a38/250x250-000000-80-0-0.jpg"
  },
  "No Doubt": {
    "start": 1992,
    "end": 2012,
    "genre": "Pop",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/23c14d485ee414cae818bbd0a79040db/250x250-000000-80-0-0.jpg"
  },
  "Aaliyah": {
    "start": 1994,
    "end": 2001,
    "genre": "R&B",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/81005a39626c8cd1cf9c9f28ecb3a2a6/250x250-000000-80-0-0.jpg"
  },
  "Lauryn Hill": {
    "start": 1998,
    "end": 2050,
    "genre": "R&B",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/b6f1ca33fbe40d348a27d2194cf3eec9/250x250-000000-80-0-0.jpg"
  },
  "Pearl Jam": {
    "start": 1991,
    "end": 2050,
    "genre": "Rock",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/43e74ff1f3bf78b4d08e56314ff9478e/250x250-000000-80-0-0.jpg"
  },
  "Red Hot Chili Peppers": {
    "start": 1984,
    "end": 2050,
    "genre": "Rock",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/6b68596fde6be6ecab39cb32eefdd920/250x250-000000-80-0-0.jpg"
  },
  "Eminem": {
    "start": 1999,
    "end": 2050,
    "genre": "Hip Hop",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/19cc38f9d69b352f718782e7a22f9c32/250x250-000000-80-0-0.jpg"
  },
  "Christina Aguilera": {
    "start": 1999,
    "end": 2050,
    "genre": "Pop",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/3ff402daee9c78d5ce8084a77b75ecb0/250x250-000000-80-0-0.jpg"
  },
  "Kelly Clarkson": {
    "start": 2002,
    "end": 2050,
    "genre": "Pop",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/7733cc50d87edfa15739c9df382fb2e4/250x250-000000-80-0-0.jpg"
  },
  "Avril Lavigne": {
    "start": 2002,
    "end": 2050,
    "genre": "Rock",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/a1be2e68449c25f4ab36181b5fbce306/250x250-000000-80-0-0.jpg"
  },
  "P!nk": {
    "start": 2000,
    "end": 2050,
    "genre": "Pop",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/b7a2d6742512f45037d453715c0a373b/250x250-000000-80-0-0.jpg"
  },
  "Justin Timberlake": {
    "start": 2002,
    "end": 2050,
    "genre": "Pop",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/818fdfcb796b41217e74880c54bb9b5f/250x250-000000-80-0-0.jpg"
  },
  "Missy Elliott": {
    "start": 1997,
    "end": 2050,
    "genre": "Hip Hop",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/bdab4cc8dbad3a9dae88ff39ccb36ce9/250x250-000000-80-0-0.jpg"
  }
});



// Patching 2025 artists

Object.assign(NPC_ERAS, {
  "Huda Mustafa": { ...NPC_ERAS["Huda Mustafa"], start: 2025 },
  "Stunna Sandy": { ...NPC_ERAS["Stunna Sandy"], start: 2025 },
  "Sunshine Benzi": { ...NPC_ERAS["Sunshine Benzi"], start: 2025 },
  "TRIM": { ...NPC_ERAS["TRIM"], start: 2025 },
});



// More era additions
Object.assign(NPC_ERAS, {
  "The Beatles": {
    "start": 1962,
    "end": 1970,
    "genre": "Rock",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/9c45c3ec047eb3ba7ad43dbbbf1025a7/250x250-000000-80-0-0.jpg"
  },
  "The Beach Boys": {
    "start": 1961,
    "end": 2012,
    "genre": "Pop",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/dfa473f6ed9100742f534fa889241b12/250x250-000000-80-0-0.jpg"
  },
  "The Supremes": {
    "start": 1959,
    "end": 1977,
    "genre": "R&B",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/8cc53ff33be927164ccb6ce2ec9e4ba6/250x250-000000-80-0-0.jpg"
  },
  "Jimi Hendrix": {
    "start": 1963,
    "end": 1970,
    "genre": "Rock",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/5cb1b702ec4cb03e4823db9dfd048d08/250x250-000000-80-0-0.jpg"
  },
  "Bob Dylan": {
    "start": 1961,
    "end": 2050,
    "genre": "Rock",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/23c14d485ee414cae818bbd0a79040db/250x250-000000-80-0-0.jpg"
  },
  "The Jackson 5": {
    "start": 1969,
    "end": 1989,
    "genre": "Pop",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/c1a6f8742cc65a8df241dcd79fcbd9fa/250x250-000000-80-0-0.jpg"
  },
  "Aerosmith": {
    "start": 1970,
    "end": 2050,
    "genre": "Rock",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/1e74880c54bb9b5f818fdfcb796b4121/250x250-000000-80-0-0.jpg"
  },
  "The Clash": {
    "start": 1976,
    "end": 1986,
    "genre": "Rock",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/f9630c33ad78a834c9c22eb430dcb989/250x250-000000-80-0-0.jpg"
  },
  "Ramones": {
    "start": 1974,
    "end": 1996,
    "genre": "Rock",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/b28096f9bf11b66ebbb1296c6b412140/250x250-000000-80-0-0.jpg"
  },
  "Blondie": {
    "start": 1974,
    "end": 2050,
    "genre": "Rock",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/7e4a77b311319dbf678cded0c67e1a38/250x250-000000-80-0-0.jpg"
  },
  "Duran Duran": {
    "start": 1978,
    "end": 2050,
    "genre": "Pop",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/8cc53ff33be927164ccb6ce2ec9e4ba6/250x250-000000-80-0-0.jpg"
  },
  "The Cure": {
    "start": 1978,
    "end": 2050,
    "genre": "Rock",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/43e74ff1f3bf78b4d08e56314ff9478e/250x250-000000-80-0-0.jpg"
  },
  "Depeche Mode": {
    "start": 1980,
    "end": 2050,
    "genre": "Electronic",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/6b68596fde6be6ecab39cb32eefdd920/250x250-000000-80-0-0.jpg"
  },
  "The Smiths": {
    "start": 1982,
    "end": 1987,
    "genre": "Rock",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/f1fb89eb8e390c5003c20c0dcfe63f45/250x250-000000-80-0-0.jpg"
  },
  "INXS": {
    "start": 1977,
    "end": 2012,
    "genre": "Rock",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/b6f1ca33fbe40d348a27d2194cf3eec9/250x250-000000-80-0-0.jpg"
  },
  "TLC": {
    "start": 1991,
    "end": 2050,
    "genre": "R&B",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/7733cc50d87edfa15739c9df382fb2e4/250x250-000000-80-0-0.jpg"
  },
  "Spice Girls": {
    "start": 1994,
    "end": 2000,
    "genre": "Pop",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/3ff402daee9c78d5ce8084a77b75ecb0/250x250-000000-80-0-0.jpg"
  },
  "Backstreet Boys": {
    "start": 1993,
    "end": 2050,
    "genre": "Pop",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/19cc38f9d69b352f718782e7a22f9c32/250x250-000000-80-0-0.jpg"
  },
  "NSYNC": {
    "start": 1995,
    "end": 2002,
    "genre": "Pop",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/81005a39626c8cd1cf9c9f28ecb3a2a6/250x250-000000-80-0-0.jpg"
  },
  "The Notorious B.I.G.": {
    "start": 1992,
    "end": 1997,
    "genre": "Hip Hop",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/23c14d485ee414cae818bbd0a79040db/250x250-000000-80-0-0.jpg"
  },
  "Black Eyed Peas": {
    "start": 1995,
    "end": 2050,
    "genre": "Pop",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/818fdfcb796b41217e74880c54bb9b5f/250x250-000000-80-0-0.jpg"
  },
  "Nelly": {
    "start": 1993,
    "end": 2050,
    "genre": "Hip Hop",
    "image": "https://e-cdns-images.dzcdn.net/images/artist/b7a2d6742512f45037d453715c0a373b/250x250-000000-80-0-0.jpg"
  }
});

// Merging Eras data into standard lists
Object.entries(NPC_ERAS).forEach(([name, data]) => {
  if (!NPC_ARTIST_NAMES.includes(name)) {
    NPC_ARTIST_NAMES.push(name);
  }
  if (!NPC_ARTIST_GENRES[name]) {
    NPC_ARTIST_GENRES[name] = data.genre;
  }
  if (!NPC_ARTIST_IMAGES[name] && data.image) {
    NPC_ARTIST_IMAGES[name] = data.image;
  }
});

export function getArtistImage(artistName?: string, coverArtFallback?: string): string {
  if (!artistName) return coverArtFallback || "https://ui-avatars.com/api/?name=Artist&background=random&color=fff&size=250";
  const name = artistName.trim();
  if (NPC_ARTIST_IMAGES[name]) return NPC_ARTIST_IMAGES[name];
  if (NPC_ERAS[name]?.image) return NPC_ERAS[name].image;

  let clean = name.split(/ feat\.? | featuring | & | x | X /i)[0].trim();
  if (NPC_ARTIST_IMAGES[clean]) return NPC_ARTIST_IMAGES[clean];
  if (NPC_ERAS[clean]?.image) return NPC_ERAS[clean].image;

  if (coverArtFallback) return coverArtFallback;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(clean)}&background=random&color=fff&size=250`;
}

