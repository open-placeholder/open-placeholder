import assert from 'node:assert/strict';
import test from 'node:test';
import { startServer } from './helpers/server.mjs';
import { readPng } from './helpers/png.mjs';

test('colors render, explicit colors override palettes, and invalid values fall back', async (t) => {
  const baseUrl = await startServer(t);
  const path = '600x400/Hello';
  const baseline = await readPng(baseUrl, path);
  for (const query of ['bg=111827', 'fg=ffffff', 'palette=slate', 'palette=indigo', 'palette=sunset']) {
    assert.notDeepEqual(await readPng(baseUrl, `${path}?${query}`), baseline, query);
  }
  const colors = 'bg=abc&fg=123456';
  assert.deepEqual(
    await readPng(baseUrl, `${path}?palette=slate&${colors}`),
    await readPng(baseUrl, `${path}?${colors}`)
  );
  assert.deepEqual(await readPng(baseUrl, `${path}?bg=red&fg=invalid&palette=unknown`), baseline);
});
