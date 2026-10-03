import assert from 'node:assert/strict';
import test from 'node:test';
import { startServer } from './helpers/server.mjs';
import { readPng } from './helpers/png.mjs';

test('colors render, explicit colors override palettes, and invalid values fall back', async (t) => {
  const baseUrl = await startServer(t);
  const path = '600x400/Hello';
  const baseline = await readPng(baseUrl, path);
  for (const query of [
    'bg=111827',
    'fg=ffffff',
    'palette=slate',
    'palette=indigo',
    'palette=sunset',
  ]) {
    assert.notDeepEqual(
      await readPng(baseUrl, `${path}?${query}`),
      baseline,
      query,
    );
  }
  const colors = 'bg=abc&fg=123456';
  assert.deepEqual(
    await readPng(baseUrl, `${path}?palette=slate&${colors}`),
    await readPng(baseUrl, `${path}?${colors}`),
  );
  assert.deepEqual(
    await readPng(baseUrl, `${path}?bg=red&fg=invalid&palette=unknown`),
    baseline,
  );
});

test('layout presets render on dimensions, shortcuts, and tiny images', async (t) => {
  const baseUrl = await startServer(t);
  const baseline = await readPng(baseUrl, '600x400/Hello');
  for (const layout of ['hero', 'badge', 'split', 'poster']) {
    assert.notDeepEqual(
      await readPng(baseUrl, `600x400/Hello?layout=${layout}`),
      baseline,
      layout,
    );
    await readPng(
      baseUrl,
      `og/Hello?layout=${layout}&theme=gradient`,
      1200,
      630,
    );
    await readPng(baseUrl, `1x1/Hello?layout=${layout}`, 1, 1);
    await readPng(baseUrl, `1x4000/Hello?layout=${layout}`, 1, 4000);
  }
  assert.deepEqual(
    await readPng(baseUrl, '600x400/Hello?layout=unknown'),
    baseline,
  );
});

test('themes render and color overrides take precedence', async (t) => {
  const baseUrl = await startServer(t);
  const path = '600x400/Hello';
  const baseline = await readPng(baseUrl, path);
  for (const theme of ['light', 'dark', 'mono', 'gradient']) {
    assert.notDeepEqual(
      await readPng(baseUrl, `${path}?theme=${theme}`),
      baseline,
      theme,
    );
  }
  for (const override of ['palette=slate', 'bg=abc&fg=123456']) {
    assert.deepEqual(
      await readPng(baseUrl, `${path}?theme=gradient&${override}`),
      await readPng(baseUrl, `${path}?${override}`),
    );
  }
  assert.deepEqual(await readPng(baseUrl, `${path}?theme=unknown`), baseline);
});
