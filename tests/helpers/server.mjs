import { spawn } from 'node:child_process';
import { once } from 'node:events';

export async function startServer(t) {
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

