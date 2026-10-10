import { cp, mkdir, copyFile } from 'node:fs/promises'
import { context } from 'esbuild'
import { startServer } from '../server.js'
import { define } from './buildConfig.js'

await mkdir('dist/assets', { recursive: true })
await copyFile('index.html', 'dist/index.html')
await cp('public', 'dist', { recursive: true })

const ctx = await context({
  entryPoints: ['src/main.jsx'],
  bundle: true,
  outdir: 'dist/assets',
  entryNames: 'main',
  assetNames: 'assets/[name]-[hash]',
  loader: { '.png': 'file', '.jpg': 'file', '.jpeg': 'file', '.svg': 'file', '.webp': 'file' },
  jsx: 'automatic',
  sourcemap: true,
  define,
})

await ctx.watch()
await startServer()
console.log('Watching React files for changes.')