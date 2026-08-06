import fs from 'fs';
let code = fs.readFileSync('components/BillboardView.tsx', 'utf8');

// The STREAMS block:
const searchString = `                        <div className="text-center">
                            <p className="text-[10px] font-bold text-zinc-400 tracking-wider">STREAMS</p>
                            <p className="text-lg font-black text-black">{formatNumber(weeklyStreams || 0)}</p>
                        </div>`;
const replacementString = `                        {gameState.date.year >= 2008 && (
                            <>
                                <div className="w-px h-8 bg-zinc-300"></div>
                                <div className="text-center">
                                    <p className="text-[10px] font-bold text-zinc-400 tracking-wider">STREAMS</p>
                                    <p className="text-lg font-black text-black">{formatNumber(weeklyStreams || 0)}</p>
                                </div>
                            </>
                        )}`;

// we also need to remove the previous w-px div so it doesn't leave an empty divider
// Let's just do a manual replace of the w-px and text-center div.
code = code.replace(
    /<div className="w-px h-8 bg-zinc-300"><\/div>\s*<div className="text-center">\s*<p className="text-\[10px\] font-bold text-zinc-400 tracking-wider">STREAMS<\/p>\s*<p className="text-lg font-black text-black">\{formatNumber\(weeklyStreams \|\| 0\)\}<\/p>\s*<\/div>/g,
    `{gameState.date.year >= 2008 && (
                            <>
                                <div className="w-px h-8 bg-zinc-300"></div>
                                <div className="text-center">
                                    <p className="text-[10px] font-bold text-zinc-400 tracking-wider">STREAMS</p>
                                    <p className="text-lg font-black text-black">{formatNumber(weeklyStreams || 0)}</p>
                                </div>
                            </>
                        )}`
);

// For album streams (STREAMING EQUIVALENT)
code = code.replace(
    /<div className="w-px h-8 bg-zinc-300"><\/div>\s*<div className="text-center">\s*<p className="text-\[10px\] font-bold text-zinc-400 tracking-wider">STREAMING EQUIVALENT \(SES\)<\/p>\s*<p className="text-lg font-black text-black">\{formatNumber\(entry\.weeklySES \|\| 0\)\}<\/p>\s*<\/div>/g,
    `{gameState.date.year >= 2008 && (
                            <>
                                <div className="w-px h-8 bg-zinc-300"></div>
                                <div className="text-center">
                                    <p className="text-[10px] font-bold text-zinc-400 tracking-wider">STREAMING EQUIVALENT (SES)</p>
                                    <p className="text-lg font-black text-black">{formatNumber(entry.weeklySES || 0)}</p>
                                </div>
                            </>
                        )}`
);

fs.writeFileSync('components/BillboardView.tsx', code);
