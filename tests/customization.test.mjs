import assert from 'node:assert/strict';
import test from 'node:test';
import { startServer } from './helpers/server.mjs';
import { readPng } from './helpers/png.mjs';

test('patterns preserve defaults and compose with themes, palettes, and layouts', async (t) => {
  const baseUrl = await startServer(t);
  const path = '600x400/Hello';
  const baseline = await readPng(baseUrl, path);
  for (const pattern of ['grid', 'dots', 'stripes']) {
    assert.notDeepEqual(
      await readPng(baseUrl, `${path}?pattern=${pattern}`),
      baseline,
      pattern,
    );
    for (const style of ['theme=gradient', 'palette=indigo']) {
      assert.notDeepEqual(
        await readPng(baseUrl, `${path}?${style}&pattern=${pattern}`),
        await readPng(baseUrl, `${path}?${style}`),
      );
    }
  }
  for (const pattern of ['none', 'invalid']) {
    assert.deepEqual(
      await readPng(baseUrl, `${path}?pattern=${pattern}`),
      baseline,
    );
  }
  for (const layout of ['hero', 'badge', 'split', 'poster']) {
    await readPng(
      baseUrl,
      `1x1/Hello?layout=${layout}&pattern=grid&theme=gradient&subtitle=Soon&padding=80&size=72&weight=700&align=right&valign=bottom`,
      1,
      1,
    );
  }
});

test('typography uses real font weights and safe sizes', async (t) => {
  const baseUrl = await startServer(t);
  const path = '600x400/Hello';
  const baseline = await readPng(baseUrl, path);
  for (const query of ['size=72', 'weight=500', 'weight=600', 'weight=700']) {
    assert.notDeepEqual(
      await readPng(baseUrl, `${path}?${query}`),
      baseline,
      query,
    );
  }
  assert.deepEqual(await readPng(baseUrl, `${path}?weight=400`), baseline);
  assert.deepEqual(
    await readPng(baseUrl, `${path}?size=invalid&weight=999`),
    baseline,
  );
  assert.deepEqual(
    await readPng(baseUrl, `${path}?size=1000000`),
    await readPng(baseUrl, `${path}?size=512`),
  );
  for (const layout of ['hero', 'badge', 'split', 'poster']) {
    await readPng(
      baseUrl,
      `1x1/WWWW?layout=${layout}&subtitle=Soon&padding=1000&size=512&weight=700`,
      1,
      1,
    );
  }
});

test('alignment moves text and invalid values preserve defaults', async (t) => {
  const baseUrl = await startServer(t);
  const path = '600x400/Hello';
  const baseline = await readPng(baseUrl, path);
  for (const query of [
    'align=left',
    'align=right',
    'valign=top',
    'valign=bottom',
  ]) {
    assert.notDeepEqual(
      await readPng(baseUrl, `${path}?${query}`),
      baseline,
      query,
    );
  }
  assert.deepEqual(
    await readPng(baseUrl, `${path}?align=center&valign=center`),
    baseline,
  );
  assert.deepEqual(
    await readPng(baseUrl, `${path}?align=invalid&valign=invalid`),
    baseline,
  );
  for (const layout of ['hero', 'badge', 'split', 'poster']) {
    await readPng(
      baseUrl,
      `${path}?layout=${layout}&align=right&valign=bottom&subtitle=Soon`,
    );
  }
});

test('subtitles render across layouts and empty subtitles preserve the original', async (t) => {
  const baseUrl = await startServer(t);
  const path = '600x400/Hello';
  const baseline = await readPng(baseUrl, path);
  assert.notDeepEqual(
    await readPng(baseUrl, `${path}?subtitle=Shipping%20soon%20%26%20more`),
    baseline,
  );
  assert.deepEqual(await readPng(baseUrl, `${path}?subtitle=`), baseline);
  const subtitle = encodeURIComponent('Long subtitle '.repeat(30));
  for (const layout of ['hero', 'badge', 'split', 'poster']) {
    await readPng(
      baseUrl,
      `600x400/Hello?layout=${layout}&subtitle=${subtitle}`,
    );
    await readPng(baseUrl, `1x1/Hello?layout=${layout}&subtitle=Soon`, 1, 1);
  }
});

test('padding changes spacing and clamps safely on tiny images', async (t) => {
  const baseUrl = await startServer(t);
  const path = '600x400/WWWWWWWWWW';
  const baseline = await readPng(baseUrl, path);
  assert.notDeepEqual(await readPng(baseUrl, `${path}?padding=80`), baseline);
  assert.deepEqual(await readPng(baseUrl, `${path}?padding=invalid`), baseline);
  assert.deepEqual(
    await readPng(baseUrl, `${path}?padding=-1`),
    await readPng(baseUrl, `${path}?padding=0`),
  );
  assert.deepEqual(
    await readPng(baseUrl, `${path}?padding=1000000`),
    await readPng(baseUrl, `${path}?padding=100`),
  );
  for (const layout of ['hero', 'badge', 'split', 'poster']) {
    await readPng(baseUrl, `1x1/Hello?layout=${layout}&padding=80`, 1, 1);
  }
});

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
