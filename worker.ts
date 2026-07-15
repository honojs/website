import { Hono } from 'hono'

const app = new Hono<{
  Bindings: CloudflareBindings
}>()

app.use(async (c, next) => {
  const accept = c.req.header('Accept') || ''
  if (accept.includes('text/markdown')) {
    const path = c.req.path.replace(/\/$/, '')
    if (path === '' || path === '/index') {
      return c.env.ASSETS.fetch(
        new Request(new URL('/llms.txt', c.req.url), c.req.raw)
      )
    }
    const githubUrl = `https://raw.githubusercontent.com/honojs/website/main${path}.md`
    const res = await fetch(githubUrl)
    if (res.ok) {
      return c.body(await res.arrayBuffer(), {
        headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
      })
    }
  }
  await next()
})

app.all('*', (c) => {
  console.log('Serving asset:', c.req.url)
  return c.env.ASSETS.fetch(c.req.raw)
})

export default app
