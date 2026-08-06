import re

with open('components/MiscTab.tsx', 'r') as f:
    content = f.read()

ui = """                    <div className="flex items-center justify-between mb-4 border-b border-zinc-700 pb-4">
                        <div className="flex-grow pr-4">
                            <p className="font-bold">Artist Location</p>
                            <p className="text-xs text-zinc-400">Where you are currently based. Affects tax rates. You can only move once every 8 weeks.</p>
                            <p className="text-[10px] text-zinc-500 mt-1">
                                Taxes: US 15%, Canada 18%, UK 21%, Asia 7%, Latin America 9%
                            </p>
                        </div>
                        <select 
                            value={activeArtistData?.location || (gameState.soloArtist?.country || gameState.group?.country || "US")}
                            onChange={(e) => {
                                const lastMove = activeArtistData?.lastMoveDate;
                                if (lastMove) {
                                    const weeksSinceMove = (gameState.date.year - lastMove.year) * 52 + (gameState.date.week - lastMove.week);
                                    if (weeksSinceMove < 8) {
                                        alert(`You cannot move yet. You must wait ${8 - weeksSinceMove} more weeks.`);
                                        return;
                                    }
                                }
                                dispatch({ type: 'CHANGE_LOCATION', payload: { location: e.target.value as any } });
                            }}
                            className="bg-zinc-700 border-zinc-600 rounded-md shadow-sm h-10 px-3 text-sm min-w-[120px]"
                        >
                            <option value="US">US</option>
                            <option value="Canada">Canada</option>
                            <option value="UK">UK</option>
                            <option value="Asia">Asia</option>
                            <option value="Latin America">Latin America</option>
                        </select>
                    </div>
"""

content = content.replace('                    <div className="flex items-center justify-between mb-4">\n                        <div>\n                            <p className="font-bold">Switch Save</p>', ui + '                    <div className="flex items-center justify-between mb-4">\n                        <div>\n                            <p className="font-bold">Switch Save</p>')

with open('components/MiscTab.tsx', 'w') as f:
    f.write(content)
