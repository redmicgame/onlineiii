import re

with open('server.ts', 'r') as f:
    content = f.read()

old_code = """  app.get('/api/spotify/album', async (req, res) => {
    try {
        const url = req.query.url;
        if (!url || typeof url !== 'string') return res.status(400).json({ error: 'URL is required' });
        
        const data = await spotify.getData(url);
        const preview = await spotify.getPreview(url);
        
        res.json({
            title: data.title,
            artist: data.subtitle,
            image: preview.image,
            tracks: data.trackList.map(t => ({ title: t.title, duration: t.duration }))
        });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
  });"""

new_code = """  app.get('/api/spotify/album', async (req, res) => {
    try {
        const url = req.query.url;
        if (!url || typeof url !== 'string') return res.status(400).json({ error: 'URL is required' });
        
        const response = await fetch(`https://embed.spotify.com/?uri=${encodeURIComponent(url)}`);
        const text = await response.text();
        const match = text.match(/<script id="__NEXT_DATA__" type="application\/json"[^>]*>([\s\S]*?)<\/script>/);
        
        if (!match) {
             return res.status(500).json({ error: 'Could not extract data from Spotify' });
        }
        
        const json = JSON.parse(match[1]);
        const entity = json.props?.pageProps?.state?.data?.entity;
        
        if (!entity) {
             return res.status(500).json({ error: 'Data shape not recognized from Spotify' });
        }
        
        const images = entity.coverArt?.sources || entity.images || entity.visualIdentity?.image;
        let image = '';
        if (Array.isArray(images) && images.length > 0) {
             image = images[0]?.url || '';
        }

        const tracks = entity.trackList ? entity.trackList.map((t: any) => ({ title: t.title, duration: t.duration })) : [{ title: entity.name, duration: entity.duration }];
        
        res.json({
            title: entity.name,
            artist: entity.subtitle,
            image: image,
            tracks: tracks
        });
    } catch (e: any) {
        res.status(500).json({ error: e.message || String(e) });
    }
  });"""

if old_code in content:
    content = content.replace(old_code, new_code)
    print("Patched successfully!")
else:
    print("Match not found!")

with open('server.ts', 'w') as f:
    f.write(content)
