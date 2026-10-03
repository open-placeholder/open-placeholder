import assert from 'node:assert/strict';

export async function readPng(baseUrl, path, width = 600, height = 400) {
  const response = await fetch(`${baseUrl}/${path}`, {
    signal: AbortSignal.timeout(3000),
  });
  assert.equal(response.status, 200, path);
  assert.equal(response.headers.get('content-type'), 'image/png', path);
  const png = Buffer.from(await response.arrayBuffer());
  assert.deepEqual(png.subarray(0, 8), Buffer.from('89504e470d0a1a0a', 'hex'), path);
  assert.equal(png.readUInt32BE(16), width, path);
  assert.equal(png.readUInt32BE(20), height, path);
  assert.deepEqual(png.subarray(-12), Buffer.from('0000000049454e44ae426082', 'hex'), path);
  return png;
}
