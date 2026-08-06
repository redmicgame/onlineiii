import re

with open('components/ChartsTab.tsx', 'r') as f:
    content = f.read()

target1 = """    const { billboardHot100, spotifyGlobal = [], billboardTopAlbums, hotPopSongs, hotRapRnb, electronicChart, countryChart } = gameState;"""
replacement1 = """    const { billboardHot100, spotifyGlobal = [], billboardTopAlbums, hotPopSongs, hotRapRnb, electronicChart, countryChart, ukSinglesChart = [] } = gameState;"""
content = content.replace(target1, replacement1)

target2 = """    const countryTop3 = countryChart.slice(0, 3);"""
replacement2 = """    const countryTop3 = countryChart.slice(0, 3);
    const ukTop3 = ukSinglesChart.slice(0, 3);"""
content = content.replace(target2, replacement2)

target3 = """            <div className="bg-zinc-800 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">Hot Pop Songs</h3>"""
replacement3 = """            {gameState.date.year >= 2016 && (
                <div className="bg-zinc-800 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg">Official Singles Chart (UK)</h3>
                        <button onClick={() => dispatch({ type: 'CHANGE_VIEW', payload: 'ukChart' })} className="text-sm text-red-400 flex items-center gap-1">
                            View Chart <ChevronRightIcon className="w-4 h-4" />
                        </button>
                    </div>
                    {ukTop3.length > 0 ? (
                        <div className="space-y-4">
                            {ukTop3.map(song => (
                                <ChartItemPreview key={song.uniqueId} rank={song.rank} coverArt={song.coverArt} title={song.title} artist={song.artist} />
                            ))}
                        </div>
                    ) : ( <div className="text-center py-6 text-zinc-400">Chart is empty.</div> )}
                </div>
            )}

            <div className="bg-zinc-800 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">Hot Pop Songs</h3>"""
content = content.replace(target3, replacement3)

with open('components/ChartsTab.tsx', 'w') as f:
    f.write(content)
