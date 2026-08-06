import fs from 'fs';
let code = fs.readFileSync('App.tsx', 'utf8');

const youtubeCase = `            case 'youtube':
                return <YouTubeView />;`;

const mtvCase = `            case 'youtube':
                return <YouTubeView />;
            case 'mtv':
                return <MTVView />;`;

code = code.replace(youtubeCase, mtvCase);
fs.writeFileSync('App.tsx', code);
