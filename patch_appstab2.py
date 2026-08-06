with open('components/AppsTab.tsx', 'r') as f:
    content = f.read()

content = content.replace("appName === 'Spotify for Artists'", "appName === 'Spotify for Artists' || appName === 'Spotify Charts'")
content = content.replace("['Spotify', 'Spotify for Artists', 'Catalog', 'X']", "['Spotify', 'Spotify for Artists', 'Spotify Charts', 'Catalog', 'X']")

with open('components/AppsTab.tsx', 'w') as f:
    f.write(content)
