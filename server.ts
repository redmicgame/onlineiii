import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

// Global Ticking Engine Configuration
// 15 minutes real-time = 1 in-game week
// Starting at Year 2018, Week 1
const START_EPOCH_MS = new Date('2018-01-01T00:00:00Z').getTime();
const MS_PER_WEEK = 15 * 60 * 1000; // 15 minutes in ms

export function calculateGlobalGameTime(nowMs: number = Date.now()) {
  const elapsedMs = Math.max(0, nowMs - START_EPOCH_MS);
  const elapsedWeeks = Math.floor(elapsedMs / MS_PER_WEEK);
  const nextTickMs = MS_PER_WEEK - (elapsedMs % MS_PER_WEEK);

  const startYear = 2018;
  const startWeek = 1;

  const totalWeeks = (startWeek - 1) + elapsedWeeks;
  const year = startYear + Math.floor(totalWeeks / 52);
  const week = (totalWeeks % 52) + 1;

  return {
    year,
    week,
    elapsedWeeks,
    nextTickInSeconds: Math.ceil(nextTickMs / 1000),
    minutesPerWeek: 15,
    epochStartedAt: new Date(START_EPOCH_MS).toISOString()
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Global Online Time Engine
  app.get('/api/global-clock', (req, res) => {
    const timeData = calculateGlobalGameTime();
    res.json(timeData);
  });

  app.get('/api/patreon/url', (req, res) => {
    const origin = req.query.origin;
    if (!origin) return res.status(400).json({error: 'origin required'});
    const redirectUri = origin + '/api/patreon/callback';
    
    // Pass origin via state so we can reconstruct the exact redirectUri in the callback
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

    // Get origin from state
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

        // Fetch User identity
        const userResp = await fetch('https://www.patreon.com/api/oauth2/v2/identity?include=memberships.campaign&fields[member]=patron_status', {
            headers: { Authorization: `Bearer ${tokenData.access_token}` }
        });
        const userData = await userResp.json();
        
        let isPro = false;
        // Check if user has an active patron status
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

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
