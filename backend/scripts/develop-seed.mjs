import { spawn } from 'node:child_process';

const isWindows = process.platform === 'win32';
const command = isWindows ? 'npm.cmd' : 'npm';

const child = spawn(command, ['run', 'develop'], {
  stdio: 'inherit',
  shell: isWindows,
  env: {
    ...process.env,
    SEED_DEMO_DATA: 'true',
  },
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});

child.on('error', (error) => {
  console.error('Strapi seed process could not be started:', error);
  process.exit(1);
});