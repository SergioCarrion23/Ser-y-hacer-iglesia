import { build } from 'esbuild';
import { readFile, writeFile } from 'node:fs/promises';

await build({
  entryPoints: ['pastor-motion.js'],
  outfile: 'assets/pastor-motion.js',
  bundle: true,
  minify: true,
  format: 'iife',
  target: ['es2020'],
  banner: { js: '/* Framer Motion speaker feature. Licenses: motion-licenses.txt */' }
});

const packages = ['framer-motion', 'motion-dom', 'motion-utils'];
const licenses = await Promise.all(packages.map(async name =>
  `${name}\n${await readFile(`node_modules/${name}/LICENSE.md`, 'utf8')}`
));
await writeFile('assets/motion-licenses.txt', licenses.join('\n\n'));
