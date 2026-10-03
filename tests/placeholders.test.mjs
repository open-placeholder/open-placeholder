import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import test from 'node:test';

async function startServer(t) {
  if (process.env.PLACEHOLDER_BASE_URL) return process.env.PLACEHOLDER_BASE_URL;

  const server = spawn(
    process.execPath,
    [
      'node_modules/next/dist/bin/next',
      'start',
      '--hostname',
      '127.0.0.1',
      '--port',
      '0',
    ],
    { env: { ...process.env, FORCE_COLOR: '0' } }
  );

  t.after(async () => {
    if (server.exitCode === null && server.signalCode === null) {
      const exited = once(server, 'exit');
      // A rendering regression can block the server's event loop.
      server.kill('SIGKILL');
      await exited;
    }
  });

  let output = '';
  server.stderr.on('data', (data) => {
    output += data;
  });
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Server did not start within 10 seconds:\n${output}`));
    }, 10_000);
    server.once('error', (error) => {
      clearTimeout(timer);
      reject(error);
    });
    server.once('exit', (code, signal) => {
      clearTimeout(timer);
      reject(new Error(`Server exited with ${code ?? signal}:\n${output}`));
    });
    server.stdout.on('data', (data) => {
      output += data;
      const url = output.match(/http:\/\/127\.0\.0\.1:\d+/)?.[0];
      if (url && output.includes('Ready in')) {
        clearTimeout(timer);
        resolve(url);
      }
    });
  });
}

test('tiny placeholders return complete PNGs and leave the server responsive', {
  timeout: 60_000,
}, async (t) => {
  const baseUrl = await startServer(t);
  const cases = [
    ['600x400', 600, 400],
    // Cover the fixed-padding boundary and the smallest supported sizes.
    ...Array.from({ length: 50 }, (_, i) => [`${i + 1}x${i + 1}`, i + 1, i + 1]),
    ['79x79', 79, 79],
    ['80x80', 80, 80],
    ['81x81', 81, 81],
    ['1', 1, 1],
    ['2', 2, 2],
    ['1x4000', 1, 4000],
    ['4000x1', 4000, 1],
    ['40x400', 40, 400],
    ['400x40', 400, 40],
    ['1x1/Hello%20World', 1, 1],
    ['2x2/WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW', 2, 2],
    ['41x41/WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW', 41, 41],
    ['600x400/Hello%20World', 600, 400],
    ['512', 512, 512],
    ['og', 1200, 630],
    ['banner', 1200, 400],
    ['wide', 1600, 900],
    ['404', 404, 404],
    ['500', 500, 500],
    // A normal request after all the tiny requests must still complete.
    ['600x400', 600, 400],
  ];

  for (const [path, width, height] of cases) {
    const start = performance.now();
    const response = await fetch(`${baseUrl}/${path}`, {
      signal: AbortSignal.timeout(3000),
    });
    assert.equal(response.status, 200, path);
    assert.equal(response.headers.get('content-type'), 'image/png', path);
    assert.equal(
      response.headers.get('cache-control'),
      'public, max-age=31536000, immutable',
      path
    );
    assert.equal(
      response.headers.get('cdn-cache-control'),
      'public, max-age=31536000',
      path
    );

    const png = Buffer.from(await response.arrayBuffer());
    assert.deepEqual(
      png.subarray(0, 8),
      Buffer.from('89504e470d0a1a0a', 'hex'),
      path
    );
    assert.equal(png.toString('ascii', 12, 16), 'IHDR', path);
    assert.equal(png.readUInt32BE(16), width, path);
    assert.equal(png.readUInt32BE(20), height, path);
    assert.deepEqual(
      png.subarray(-12),
      Buffer.from('0000000049454e44ae426082', 'hex'),
      path
    );
    t.diagnostic(
      `/${path}: 200, ${width}x${height} PNG, ${Math.round(performance.now() - start)} ms`
    );
  }

  for (const path of ['0x1', '1x0', '4001x1', '1x4001', 'invalid']) {
    const response = await fetch(`${baseUrl}/${path}`, {
      signal: AbortSignal.timeout(3000),
    });
    assert.equal(response.status, 404, path);
    assert.equal(await response.text(), 'Not Found', path);
  }
});
