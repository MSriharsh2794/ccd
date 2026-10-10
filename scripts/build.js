import { cp, mkdir, rm, copyFile } from 'node:fs/promises'
import { build } from 'esbuild'
import { define } from './buildConfig.js'

await rm('dist', { recursive: true, force: true })
await mkdir('dist/assets', { recursive: true })
await copyFile('index.html', 'dist/index.html')
await cp('public', 'dist', { recursive: true })

await build({
  entryPoints: ['src/main.jsx'],
  bundle: true,
  minify: true,
  outdir: 'dist/assets',
  entryNames: 'main',
  assetNames: 'assets/[name]-[hash]',
  loader: { '.png': 'file', '.jpg': 'file', '.jpeg': 'file', '.svg': 'file', '.webp': 'file' },
  jsx: 'automatic',
  sourcemap: false,
  define,
})

console.log('React production bundle written to dist/.')