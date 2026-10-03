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

test('themes render and color overrides take precedence', async (t) => {
  const baseUrl = await startServer(t);
  const path = '600x400/Hello';
  const baseline = await readPng(baseUrl, path);
  for (const theme of ['light', 'dark', 'mono', 'gradient']) {
    assert.notDeepEqual(await readPng(baseUrl, `${path}?theme=${theme}`), baseline, theme);
  }
  for (const override of ['palette=slate', 'bg=abc&fg=123456']) {
    assert.deepEqual(await readPng(baseUrl, `${path}?theme=gradient&${override}`), await readPng(baseUrl, `${path}?${override}`));
  }
  assert.deepEqual(await readPng(baseUrl, `${path}?theme=unknown`), baseline);
});
