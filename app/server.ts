import { showRoutes } from 'hono/dev'
import { createApp } from 'honox/server'

const app = createApp({
  ROUTES: import.meta.glob('/(app/routes/**/[!_]*.(ts|tsx|mdx)|(?!.vscode|app|public)**/*.mdx)', {
    eager: true,
  }),
})

showRoutes(app)

export default app
