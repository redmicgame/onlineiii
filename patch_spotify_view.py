import re

with open('components/SpotifyChartView.tsx', 'r') as f:
    content = f.read()

target = """                )}
                {date.year >= 2016 && gameState.ukSinglesChart && gameState.ukSinglesChart.length > 0 && (
                    <button onClick={() => dispatch({type: 'CHANGE_VIEW', payload: 'ukChart'})} className="w-full bg-blue-700 p-4 rounded-lg text-left mt-4 border border-blue-600">
                        <p className="font-bold text-lg">Official Singles Chart</p>
                        <p>United Kingdom</p>
                        <div className="mt-4 flex items-center gap-3">
                            <img src={gameState.ukSinglesChart[0].coverArt} className="w-16 h-16 rounded-md" />
                            <div>
                                <p className="font-bold text-sm">#1. {gameState.ukSinglesChart[0].title}</p>
                                <p className="text-xs">{gameState.ukSinglesChart[0].artist}</p>
                            </div>
                        </div>
                    </button>
                )}
            </main>"""

replacement = """                )}
            </main>"""
content = content.replace(target, replacement)
with open('components/SpotifyChartView.tsx', 'w') as f:
    f.write(content)
