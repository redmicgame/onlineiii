import fs from 'fs';
let code = fs.readFileSync('components/YouTubeView.tsx', 'utf8');

code = code.replace(
  "const allVideos = Object.values(artistsData).flatMap(data => data.videos);",
  "let allVideos = Object.values(artistsData).flatMap(data => data.videos);\n        allVideos = allVideos.filter(v => !(v.channelId === 'mtv' && date.year < 2010));"
);

fs.writeFileSync('components/YouTubeView.tsx', code);
