import express from 'express';

const app = express();

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.get('/api/patreon/url', (req, res) => {
    const origin = req.query.origin;
    if (!origin) return res.status(400).json({error: 'origin required'});
    const redirectUri = origin + '/api/patreon/callback';
    
    const params = new URLSearchParams({
        client_id: process.env.PATREON_CLIENT_ID || 'EZDVY8KjKxZ8G95-TNEi4IC_hXWF5Ua4WWaVDjoag4ZSiUBghbete1kth_1qWVWH',
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'identity identity.memberships',
        state: origin as string
    });
    
    const authUrl = `https://www.patreon.com/oauth2/authorize?${params}`;
    res.json({ url: authUrl });
});

app.get(['/api/patreon/callback', '/api/patreon/callback/'], async (req, res) => {
    const { code, state } = req.query;
    if (!code) return res.send('No code provided');
    let origin = typeof state === 'string' ? state : undefined;
    if (!origin) {
         return res.send('No state provided (origin tracking lost)');
    }
    
    const redirectUri = origin + '/api/patreon/callback';
    try {
        const tokenResponse = await fetch('https://www.patreon.com/api/oauth2/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code: code.toString(),
                grant_type: 'authorization_code',
                client_id: process.env.PATREON_CLIENT_ID || 'EZDVY8KjKxZ8G95-TNEi4IC_hXWF5Ua4WWaVDjoag4ZSiUBghbete1kth_1qWVWH',
                client_secret: process.env.PATREON_CLIENT_SECRET || 'KlXXkWOlXwyEkWsM736d-xV5nPYPu3NEXgy74551Q645YizqEN4-xEz9KT2iw2RF',
                redirect_uri: redirectUri
            })
        });
        const tokenData = await tokenResponse.json();
        if (tokenData.error) {
            return res.send(`OAuth Error: ${tokenData.error} - ${tokenData.error_description}`);
        }
        
        const userResp = await fetch('https://www.patreon.com/api/oauth2/v2/identity?include=memberships.campaign&fields[member]=patron_status', {
            headers: { Authorization: `Bearer ${tokenData.access_token}` }
        });
        const userData = await userResp.json();
        
        let isPro = false;
        if (userData.included) {
             const activeMembership = userData.included.find((inc: any) => inc.type === 'member' && inc.attributes && inc.attributes.patron_status === 'active_patron');
             if (activeMembership) {
                  isPro = true;
             }
        }
        res.send(`
          <html>
            <body>
              <script>
                if (window.opener) {
                  window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', isPro: ${isPro} }, '*');
                  window.close();
                } else {
                  window.location.href = '/';
                }
              </script>
              <p>Authentication successful. You can close this window now.</p>
            </body>
          </html>
        `);
    } catch (e: any) {
        res.send(`Server Error: ${e.message}`);
    }
});

app.get('/api/spotify/album', async (req, res) => {
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
});

export default app;
