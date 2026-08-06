import fs from 'fs';
let code = fs.readFileSync('components/AchievementsView.tsx', 'utf8');

const isStreamingEra = "gameState.date.year >= 2008";

code = code.replace(
    /<p className="font-semibold text-zinc-400">Total Streams<\/p>/g,
    `<p className="font-semibold text-zinc-400">{${isStreamingEra} ? "Total Streams" : "Total Sales"}</p>`
);

code = code.replace(
    /title="Top First Week Streams"/g,
    `title={${isStreamingEra} ? "Top First Week Streams" : "Top First Week Sales"}`
);

code = code.replace(
    /title="Top First Week Album\/EP Streams"/g,
    `title={${isStreamingEra} ? "Top First Week Album/EP Streams" : "Top First Week Album/EP Sales"}`
);

code = code.replace(
    /title="Most Streamed Projects"/g,
    `title={${isStreamingEra} ? "Most Streamed Projects" : "Highest Selling Projects"}`
);

// We should also replace the empty messages that mention streams.
code = code.replace(
    /emptyMessage="No streamed projects yet."/g,
    `emptyMessage={${isStreamingEra} ? "No streamed projects yet." : "No selling projects yet."}`
);

code = code.replace(
    /emptyMessage="No songs have had artificial streams removed yet."/g,
    `emptyMessage={${isStreamingEra} ? "No songs have had artificial streams removed yet." : "No songs have had artificial sales removed yet."}`
);

fs.writeFileSync('components/AchievementsView.tsx', code);
