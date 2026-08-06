with open('components/AppsTab.tsx', 'r') as f:
    content = f.read()

app_entry = """            { name: 'Spotify for Artists', description: 'Manage your artist profile', icon: <SpotifyIcon className="w-8 h-8"/>, view: 'spotifyForArtists', bgColor: '#000000' },"""
new_entry = """            { name: 'Spotify Charts', description: 'Top 50 Global', icon: <SpotifyIcon className="w-8 h-8"/>, view: 'spotifyChart', bgColor: '#1DB954', iconColor: '#000000' },"""

# Add it under Charts & Career
content = content.replace("            { name: 'Apple Music for Artists',", new_entry + "\n            { name: 'Apple Music for Artists',")

with open('components/AppsTab.tsx', 'w') as f:
    f.write(content)
