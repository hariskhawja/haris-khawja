const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createRoyaleHandler } = require('../royale.cjs');

async function request(handler, method = 'GET') {
  const result = { headers: {} };
  const response = {
    setHeader(name, value) {
      result.headers[name] = value;
    },
    writeHead(status, headers = {}) {
      result.status = status;
      Object.assign(result.headers, headers);
    },
    end(body = '') {
      result.body = body;
    },
  };
  await handler({ method }, response);
  return result;
}

test('unconfigured connection never calls upstream or exposes configuration', async () => {
  const handler = createRoyaleHandler({
    env: {},
    fetchImpl: () => {
      throw new Error('Unexpected upstream call');
    },
  });
  const result = await request(handler);
  assert.equal(result.status, 503);
  assert.deepEqual(JSON.parse(result.body), {
    available: false,
    reason: 'not_configured',
  });
});

test('live response exposes only intended public fields and caches concurrent requests', async () => {
  let calls = 0;
  const handler = createRoyaleHandler({
    env: { CLASH_ROYALE_TOKEN: 'test-token' },
    fetchImpl: async (url, options) => {
      calls++;
      assert.ok(url.endsWith('/players/%23RJCUR8L9U'));
      assert.equal(options.headers.Authorization, 'Bearer test-token');
      return {
        ok: true,
        json: async () => ({
          name: 'Player',
          tag: '#RJCUR8L9U',
          trophies: 9000,
          bestTrophies: 9500,
          currentDeck: [
            { name: 'Knight', iconUrls: { medium: 'https://example.com/knight.png' } },
          ],
          privateUnexpectedField: 'do-not-return',
        }),
      };
    },
  });
  const results = await Promise.all([
    request(handler),
    request(handler),
    request(handler),
  ]);
  assert.equal(calls, 1);
  for (const result of results) {
    assert.equal(result.status, 200);
    const body = JSON.parse(result.body);
    assert.equal(body.trophies, 9000);
    assert.equal(body.deck[0].name, 'Knight');
    assert.equal(body.available, true);
    assert.ok(body.updatedAt);
    assert.ok(!result.body.includes('test-token'));
    assert.ok(!result.body.includes('privateUnexpectedField'));
  }
});

test('upstream errors are sanitized and a failed fetch can be retried', async () => {
  let calls = 0;
  const handler = createRoyaleHandler({
    env: { CLASH_ROYALE_TOKEN: 'test-token' },
    fetchImpl: async () => {
      calls++;
      throw new Error('Sensitive upstream detail');
    },
  });
  for (let attempt = 0; attempt < 2; attempt++) {
    const result = await request(handler);
    assert.equal(result.status, 502);
    assert.deepEqual(JSON.parse(result.body), {
      available: false,
      reason: 'temporarily_unavailable',
    });
    assert.ok(!result.body.includes('Sensitive'));
  }
  assert.equal(calls, 2);
});

test('invalid configured tags are rejected and writes are not allowed', async () => {
  const handler = createRoyaleHandler({
    env: { CLASH_ROYALE_TOKEN: 'test-token', CLASH_ROYALE_PLAYER_TAG: '../../invalid' },
  });
  assert.equal((await request(handler)).status, 503);
  const result = await request(handler, 'POST');
  assert.equal(result.status, 405);
  assert.equal(result.headers.Allow, 'GET');
});
