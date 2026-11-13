const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createLeetCodeHandler } = require('../leetcode.cjs');

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

test('public stats are normalized and concurrent requests share a cached response', async () => {
  let calls = 0;
  const handler = createLeetCodeHandler({
    fetchImpl: async () => {
      calls++;
      return {
        ok: true,
        json: async () => ({
          data: {
            matchedUser: {
              profile: { ranking: 42 },
              submitStatsGlobal: {
                acSubmissionNum: [
                  { difficulty: 'All', count: 6 },
                  { difficulty: 'Easy', count: 1 },
                  { difficulty: 'Medium', count: 2 },
                  { difficulty: 'Hard', count: 3 },
                ],
              },
            },
          },
        }),
      };
    },
  });
  const results = await Promise.all([request(handler), request(handler)]);
  assert.equal(calls, 1);
  assert.equal(JSON.parse(results[0].body).total, 6);
  assert.equal(JSON.parse(results[1].body).ranking, 42);
  await request(handler);
  assert.equal(calls, 1);
});
test('invalid profiles and upstream errors return an honest unavailable state', async () => {
  for (const fetchImpl of [
    async () => ({ ok: true, json: async () => ({ data: { matchedUser: null } }) }),
    async () => {
      throw Error('private upstream detail');
    },
  ]) {
    const result = await request(createLeetCodeHandler({ fetchImpl }));
    assert.equal(result.status, 502);
    assert.deepEqual(JSON.parse(result.body), { available: false });
  }
});
test('non-GET requests never contact upstream', async () => {
  const result = await request(
    createLeetCodeHandler({
      fetchImpl: () => {
        throw Error('unexpected');
      },
    }),
    'POST',
  );
  assert.equal(result.status, 405);
});
