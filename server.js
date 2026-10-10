import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { createServer as createHttpServer } from 'node:http'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const City = require('country-state-city/lib/cjs/city.js').default
const root = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.join(root, 'dist')
const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
}

export function startServer() {
  const port = Number(process.env.PORT || 4174)
  const server = createHttpServer(async (request, response) => {
    const requestUrl = new URL(request.url, 'http://localhost')
    if (requestUrl.pathname === '/api/cities') {
      const countryCode = (requestUrl.searchParams.get('country') || '').toUpperCase()
      const query = (requestUrl.searchParams.get('q') || '').trim().toLocaleLowerCase()

      if (!/^[A-Z]{2}$/.test(countryCode)) {
        response.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' })
        response.end(JSON.stringify({ error: 'A valid country code is required.' }))
        return
      }

      const cities = City.getCitiesOfCountry(countryCode) || []
      const matches = (query
        ? cities.filter((city) => city.name.toLocaleLowerCase().includes(query))
        : cities
      ).slice(0, 50).map(({ name, stateCode }) => ({ name, stateCode }))

      response.setHeader('Content-Type', 'application/json; charset=utf-8')
      response.end(JSON.stringify(matches))
      return
    }

    const pathname = decodeURIComponent(requestUrl.pathname)
    const requestedPath = path.resolve(distDir, `.${pathname}`)
    const safePath = requestedPath.startsWith(`${distDir}${path.sep}`) || requestedPath === distDir
    let filePath = safePath ? requestedPath : path.join(distDir, 'index.html')

    try {
      const fileInfo = await stat(filePath)
      if (!fileInfo.isFile()) filePath = path.join(distDir, 'index.html')
    } catch {
      filePath = path.join(distDir, 'index.html')
    }

    response.setHeader('Content-Type', contentTypes[path.extname(filePath)] || 'application/octet-stream')
    createReadStream(filePath).pipe(response)
  })

  server.listen(port, () => console.log(`React app available at http://localhost:${port}`))
  return server
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  startServer()
}