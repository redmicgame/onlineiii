import fs from 'fs';

let code = fs.readFileSync('App.tsx', 'utf8');

const importStatement = `import ManagerPodcastsView from './components/ManagerPodcastsView';\n`;

if (!code.includes('ManagerPodcastsView')) {
    code = code.replace(/import SpotifyPodcastsView from '.\/components\/SpotifyPodcastsView';/, importStatement + `import SpotifyPodcastsView from './components/SpotifyPodcastsView';`);
    
    const caseStatement = `
            case 'managerPodcasts':
                return <ManagerPodcastsView />;`;
                
    code = code.replace(/case 'spotifyPodcasts':/, caseStatement.trim() + "\n            case 'spotifyPodcasts':");
    
    fs.writeFileSync('App.tsx', code);
}
