const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');

if (!content.includes("import YouTubeMusicView from './components/YouTubeMusicView';")) {
    content = content.replace(
        /import YouTubeView from '\.\/components\/YouTubeView';/,
        "import YouTubeView from './components/YouTubeView';\nimport YouTubeMusicView from './components/YouTubeMusicView';"
    );
}

if (!content.includes("case 'youtubeMusic':")) {
    content = content.replace(
        /case 'youtube':\s*return <YouTubeView \/>;/,
        "case 'youtube':\n                return <YouTubeView />;\n            case 'youtubeMusic':\n                return <YouTubeMusicView />;"
    );
}

fs.writeFileSync('App.tsx', content);
console.log('Patched App.tsx for YouTubeMusicView');
