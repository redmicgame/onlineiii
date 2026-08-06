import fs from 'fs';

let code = fs.readFileSync('App.tsx', 'utf8');

const importStatement = `import SpotifyPodcastsView from './components/SpotifyPodcastsView';\nimport SpotifyForCreatorsView from './components/SpotifyForCreatorsView';\n`;

if (!code.includes('SpotifyPodcastsView')) {
    code = code.replace(/import SpotifyForArtistsView from '.\/components\/SpotifyForArtistsView';/, importStatement + `import SpotifyForArtistsView from './components/SpotifyForArtistsView';`);
    
    const caseStatement = `
            case 'spotifyPodcasts':
                return <SpotifyPodcastsView />;
            case 'spotifyForCreators':
                return <SpotifyForCreatorsView />;`;
                
    code = code.replace(/case 'spotifyForArtists':/, caseStatement.trim() + "\n            case 'spotifyForArtists':");
    
    fs.writeFileSync('App.tsx', code);
}
