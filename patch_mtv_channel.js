import fs from 'fs';
let code = fs.readFileSync('components/MTVView.tsx', 'utf8');

code = code.replace(
  "const newVideo: Video = {",
  "const newVideo: Video = {"
);

code = code.replace(
  "channelId: isLabelMode ? label!.youtubeChannel! : activeArtist.id,",
  "channelId: 'mtv',"
);

fs.writeFileSync('components/MTVView.tsx', code);
