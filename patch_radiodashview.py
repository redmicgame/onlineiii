import re

with open('components/RadioDashView.tsx', 'r') as f:
    content = f.read()

target_render = """    const renderManage = () => {
        if (!activeArtistData) return null;

        if (maxSongs === 0) {"""
replacement_render = """    const renderManage = () => {
        if (!activeArtistData) return null;

        const usRadioSongs = activeArtistData.songs.filter(s => s.isOnRadio).map(s => ({...s, _region: 'US' as 'US'|'UK', _key: s.id + '_us'}));
        const ukRadioSongs = activeArtistData.songs.filter(s => s.isOnUkRadio).map(s => ({...s, _region: 'UK' as 'US'|'UK', _key: s.id + '_uk'}));
        const activeRadioSongs = [...usRadioSongs, ...ukRadioSongs];

        if (maxSongs === 0) {"""
content = content.replace(target_render, replacement_render)

target_map = """                    {activeArtistData.songs.filter(s => s.isOnRadio).map(song => (
                        <div key={song.id} className="bg-white p-3 rounded-lg border border-black shadow mb-3 flex flex-col">"""
replacement_map = """                    {activeRadioSongs.map(song => (
                        <div key={song._key} className="bg-white p-3 rounded-lg border border-black shadow mb-3 flex flex-col">"""
content = content.replace(target_map, replacement_map)

target_count = """const songsOnRadioCount = activeArtistData?.songs.filter(s => s.isOnRadio).length || 0;"""
replacement_count = """const songsOnRadioCount = activeArtistData?.songs.filter(s => s.isOnRadio || s.isOnUkRadio).length || 0;"""
content = content.replace(target_count, replacement_count)

with open('components/RadioDashView.tsx', 'w') as f:
    f.write(content)
