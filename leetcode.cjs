// Public LeetCode profile data, fetched on the server to avoid browser CORS limits.
function createLeetCodeHandler({ fetchImpl = fetch } = {}) {
  let cached;
  let expires = 0;
  let pending;
  async function load() {
    const response = await fetchImpl('https://leetcode.com/graphql/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Referer: 'https://leetcode.com/u/stormguardian01/',
      },
      body: JSON.stringify({
        query:
          'query { matchedUser(username:"stormguardian01") { profile { ranking } submitStatsGlobal { acSubmissionNum { difficulty count } } } }',
      }),
      signal: AbortSignal.timeout(9000),
    });
    if (!response.ok) throw new Error('Profile unavailable');
    const user = (await response.json()).data?.matchedUser;
    const counts = Object.fromEntries(
      (user?.submitStatsGlobal?.acSubmissionNum || []).map((item) => [
        item.difficulty,
        item.count,
      ]),
    );
    if (
      !['All', 'Easy', 'Medium', 'Hard'].every(
        (key) => Number.isInteger(counts[key]) && counts[key] >= 0,
      )
    )
      throw new Error('Invalid profile');
    return {
      total: counts.All,
      easy: counts.Easy,
      medium: counts.Medium,
      hard: counts.Hard,
      ranking: Number.isInteger(user.profile?.ranking) ? user.profile.ranking : null,
      updatedAt: new Date().toISOString(),
    };
  }
  return async function handleLeetCode(req, res) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    if (req.method !== 'GET') {
      res.writeHead(405, { Allow: 'GET' });
      res.end();
      return;
    }
    try {
      if (!cached || Date.now() >= expires) {
        pending ||= load();
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
      res.end(JSON.stringify({ available: false }));
    }
  };
}
module.exports = { createLeetCodeHandler };
