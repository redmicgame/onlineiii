import fs from 'fs';
let code = fs.readFileSync('components/MTVView.tsx', 'utf8');

code = code.replace(/CreateVideoView/g, 'MTVView');

// Replace standard stuff
code = code.replace(
  /const hasLabelChannel = label && label.youtubeChannel;\n    const isLabelMode = activeYoutubeChannel === 'label' && hasLabelChannel;/,
  "const isLabelMode = true; // MTV is industry standard"
);

code = code.replace(
  /Publish to YouTube/g,
  "Release on MTV"
);

code = code.replace(
  "dispatch({ type: 'CREATE_VIDEO', payload: { video: newVideo } });",
  "dispatch({ type: 'CREATE_VIDEO', payload: { video: { ...newVideo, isMtv: true } } });"
);

// We should also replace the UI headers to look like MTV
code = code.replace(
  '<h1 className="text-xl font-bold">New Video</h1>',
  '<h1 className="text-2xl font-black italic">MTV</h1>'
);

code = code.replace(
  '<div className="h-screen w-full bg-zinc-900 flex flex-col">',
  '<div className="h-screen w-full bg-black text-white flex flex-col overflow-y-auto pb-20">'
);

fs.writeFileSync('components/MTVView.tsx', code);
