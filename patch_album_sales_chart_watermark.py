import re

with open('components/AlbumSalesChartView.tsx', 'r') as f:
    content = f.read()

old_code = """    const { dispatch, activeArtist, activeArtistData } = useGame();"""

new_code = """    const { gameState, dispatch, activeArtist, activeArtistData } = useGame();"""

content = content.replace(old_code, new_code)

old_code_2 = """                     <div>
                        <h1 className="text-xl font-black tracking-tighter">{activeArtist.name.toUpperCase()}'S ALBUM SALES BAR CHART</h1>
                        <h2 className="text-lg font-bold">{formatNumber(totalUnits).toUpperCase()} UNITS SOLD</h2>
                        <p className="text-sm text-zinc-600 font-semibold">@Red Mic</p>
                     </div>"""

new_code_2 = """                     <div>
                        <h1 className="text-xl font-black tracking-tighter">{activeArtist.name.toUpperCase()}'S ALBUM SALES BAR CHART</h1>
                        <h2 className="text-lg font-bold">{formatNumber(totalUnits).toUpperCase()} UNITS SOLD</h2>
                        <div className="flex items-center gap-2">
                            <p className="text-sm text-zinc-600 font-semibold">@Red Mic</p>
                            {gameState.difficultyMode && (
                                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                                    {gameState.difficultyMode} MODE
                                </p>
                            )}
                        </div>
                     </div>"""

content = content.replace(old_code_2, new_code_2)

with open('components/AlbumSalesChartView.tsx', 'w') as f:
    f.write(content)
