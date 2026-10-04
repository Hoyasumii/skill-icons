import { execFileSync } from 'node:child_process';

/**
 * Angular components can't be transformed by esbuild, so tests run the same partially compiled
 * output that gets published (linked at runtime by the JIT compiler), built into a cache dir.
 */
export default function setup() {
  execFileSync(
    'bunx',
    ['ngc', '-p', 'tsconfig.angular.json', '--outDir', 'node_modules/.cache/angular-test'],
    { stdio: 'inherit' },
  );
}
