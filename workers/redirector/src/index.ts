import { Hono } from 'hono'
import { getPathFromURL } from 'hono/utils/url'
import { rules } from './rules'
import { logger } from 'hono/logger'

const app = new Hono()
app.use('*', logger())

app.all('*', (c) => {
  let path = getPathFromURL(c.req.url)

  const match = rules.find((rule) => rule.from === path)
  if (match) path = match.to

  const url = `https://hono.dev${path}`
  return c.redirect(url, 301)
})

export default app
