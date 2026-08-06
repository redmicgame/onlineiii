import fs from 'fs';
let code = fs.readFileSync('components/CreateVideoView.tsx', 'utf8');

const isMtvEra = `const isMtvEra = gameState.date.year <= 2007;`;

const oldChannelId = `const channelId = activeYoutubeChannel === 'label' && hasLabelChannel
            ? (activeArtistData.label || 'Vevo')
            : activeArtistId;`;

const newChannelId = `const channelId = isMtvEra && (videoType === 'Music Video' || videoType === 'Live Performance')
            ? 'mtv'
            : (activeYoutubeChannel === 'label' && hasLabelChannel
                ? (activeArtistData.label || 'Vevo')
                : activeArtistId);`;

code = code.replace(oldChannelId, newChannelId);
fs.writeFileSync('components/CreateVideoView.tsx', code);
