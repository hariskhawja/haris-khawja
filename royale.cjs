// Server-only integration. API credentials never enter a public JavaScript file.
function createRoyaleHandler({ env = process.env, fetchImpl = fetch } = {}) {
  let cached;
  let expires = 0;
  let pending;

  async function loadPlayer(tag, token) {
    const response = await fetchImpl(
      `https://api.clashroyale.com/v1/players/${encodeURIComponent(tag)}`,
      {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        signal: AbortSignal.timeout(9000),
      },
    );
    if (!response.ok) throw new Error('Player service unavailable');
    const player = await response.json();
    return {
      name: player.name,
      playerTag: player.tag,
      trophies: player.trophies,
      bestTrophies: player.bestTrophies,
      deck: (player.currentDeck || []).map((card) => ({
        name: card.name,
        icon: card.iconUrls?.medium,
      })),
      updatedAt: new Date().toISOString(),
    };
  }

  return async function handleRoyale(req, res) {
    if (req.method !== 'GET') {
      res.writeHead(405, { Allow: 'GET' });
      res.end();
      return;
    }
    const token = env.CLASH_ROYALE_TOKEN;
    const tag = (env.CLASH_ROYALE_PLAYER_TAG || '#RJCUR8L9U').trim().toUpperCase();
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    if (!token || !/^#[0289PYLQGRJCUV]{3,15}$/.test(tag)) {
      res.writeHead(503);
      res.end(JSON.stringify({ available: false, reason: 'not_configured' }));
      return;
    }
    try {
      if (!cached || Date.now() >= expires) {
        pending ||= loadPlayer(tag, token);
        try {
          cached = await pending;
          expires = Date.now() + 300000;
        } finally {
          pending = null;
        }
      }
      res.writeHead(200);
      res.end(JSON.stringify({ available: true, ...cached }));
    } catch {
      res.writeHead(502);
      res.end(JSON.stringify({ available: false, reason: 'temporarily_unavailable' }));
    }
  };
}

module.exports = { createRoyaleHandler };
