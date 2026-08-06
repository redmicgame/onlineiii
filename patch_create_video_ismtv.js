import fs from 'fs';
let code = fs.readFileSync('components/CreateVideoView.tsx', 'utf8');

const oldVideoObj = `const newVideo: Video = {
            id: crypto.randomUUID(),
            songId,
            title: videoTitle,
            type: videoType,
            views: 0,
            likes: 0,
            dislikes: 0,
            comments: [],
            releaseDate: date,
            thumbnail: thumbnail || song?.coverArt || '',
            description,
            mentionedNpcs,
        };`;

const newVideoObj = `const newVideo: Video = {
            id: crypto.randomUUID(),
            songId,
            title: videoTitle,
            type: videoType,
            views: 0,
            likes: 0,
            dislikes: 0,
            comments: [],
            releaseDate: date,
            thumbnail: thumbnail || song?.coverArt || '',
            description,
            mentionedNpcs,
            isMtv: gameState.date.year <= 2007 && (videoType === 'Music Video' || videoType === 'Live Performance'),
        };`;

code = code.replace(oldVideoObj, newVideoObj);
fs.writeFileSync('components/CreateVideoView.tsx', code);
