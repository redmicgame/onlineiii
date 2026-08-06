import fs from 'fs';

let code = fs.readFileSync('components/AppsTab.tsx', 'utf8');

const appsToAdd = `            { name: 'Spotify Podcasts', description: 'Top podcasts', icon: <SpotifyIcon className="w-8 h-8 text-[#1ed760]"/>, view: 'spotifyPodcasts', bgColor: '#1ed760' },
            { name: 'Spotify for Creators', description: 'Manage podcasts', icon: <SpotifyIcon className="w-8 h-8"/>, view: 'spotifyForCreators', bgColor: '#000000' },`;

code = code.replace("{ name: 'Spotify for Artists',", appsToAdd + "\n            { name: 'Spotify for Artists',");

fs.writeFileSync('components/AppsTab.tsx', code);
