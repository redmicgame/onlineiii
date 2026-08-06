import re

with open('components/ChartHistoryView.tsx', 'r') as f:
    content = f.read()

target_type = "type ChartType = 'billboardHot100' | 'billboardTopAlbums' | 'hotPopSongs' | 'hotRapRnb' | 'electronicChart' | 'countryChart';"
replacement_type = "type ChartType = 'billboardHot100' | 'billboardTopAlbums' | 'hotPopSongs' | 'hotRapRnb' | 'electronicChart' | 'countryChart' | 'ukSinglesChart';"
content = content.replace(target_type, replacement_type)

target_chart_opts = """<option value="countryChart">Hot Country Songs</option>
                    </select>"""
replacement_chart_opts = """<option value="countryChart">Hot Country Songs</option>
                        {gameState.date.year >= 2016 && <option value="ukSinglesChart">UK Official Singles Chart</option>}
                    </select>"""
content = content.replace(target_chart_opts, replacement_chart_opts)

target_get_history = """    const getHistoryData = () => {
        if (selectedChart === 'billboardTopAlbums') {
            return gameState.albumChartHistory || {};
        }
        if (selectedChart === 'hotPopSongs') {
            return gameState.hotPopSongsHistory || {};
        }
        if (selectedChart === 'hotRapRnb') {
            return gameState.hotRapRnbHistory || {};
        }
        if (selectedChart === 'electronicChart') {
            return gameState.electronicChartHistory || {};
        }
        if (selectedChart === 'countryChart') {
            return gameState.countryChartHistory || {};
        }
        return gameState.chartHistory || {};
    };"""

replacement_get_history = """    const getHistoryData = () => {
        if (selectedChart === 'billboardTopAlbums') return gameState.albumChartHistory || {};
        if (selectedChart === 'hotPopSongs') return gameState.hotPopSongsHistory || {};
        if (selectedChart === 'hotRapRnb') return gameState.hotRapRnbHistory || {};
        if (selectedChart === 'electronicChart') return gameState.electronicChartHistory || {};
        if (selectedChart === 'countryChart') return gameState.countryChartHistory || {};
        if (selectedChart === 'ukSinglesChart') return gameState.ukSinglesChartHistory || {};
        return gameState.chartHistory || {};
    };"""
content = content.replace(target_get_history, replacement_get_history)

with open('components/ChartHistoryView.tsx', 'w') as f:
    f.write(content)
