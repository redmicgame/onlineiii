const fs = require('fs');
let content = fs.readFileSync('App.tsx', 'utf8');

// Import
content = content.replace(
  "import SwitchSaveView from './components/SwitchSaveView';",
  "import SwitchSaveView from './components/SwitchSaveView';\nimport LiveLeaderboardView from './components/LiveLeaderboardView';"
);

// Switch case
content = content.replace(
  "            case 'switchSave':\n                return <SwitchSaveView />;",
  "            case 'switchSave':\n                return <SwitchSaveView />;\n            case 'leaderboard':\n                return <LiveLeaderboardView />;"
);

fs.writeFileSync('App.tsx', content);

let miscContent = fs.readFileSync('components/MiscTab.tsx', 'utf8');

const targetMisc = `<div className="flex items-center justify-between mb-4 border-b border-zinc-700 pb-4">`;

const replacementMisc = `<div className="flex items-center justify-between mb-4 border-b border-zinc-700 pb-4">
                        <div>
                            <p className="font-bold">Live Leaderboard</p>
                            <p className="text-xs text-zinc-400">Compete with other players worldwide in different categories.</p>
                        </div>
                        <button 
                            onClick={() => dispatch({ type: 'CHANGE_VIEW', payload: 'leaderboard' })}
                            className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm font-bold transition-colors"
                        >
                            View
                        </button>
                    </div>
                    <div className="flex items-center justify-between mb-4 border-b border-zinc-700 pb-4">`;

miscContent = miscContent.replace(targetMisc, replacementMisc);
fs.writeFileSync('components/MiscTab.tsx', miscContent);

