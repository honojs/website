import { jsxRenderer } from 'hono/jsx-renderer'

export default jsxRenderer(({ children, title, frontmatter }) => {
  const proseClass = [
    "prose px-6 pb-24 pt-8",
    "prose-h2:pt-6 prose-h2:border-t",
    "prose-pre:-mx-6 prose-pre:!bg-[rgb(246,_248,_250)] prose-pre:!rounded-none prose-pre:px-6 prose-pre:py-5",
    "prose-code:min-w-fit prose-code:inline prose-code:[&>pre]:block prose-code:before:!content-none prose-code:after:!content-none prose-code:px-2",
    "prose-li:my-0",
    "prose-a:text-[#e36002]"
  ].join(" ")
  return (
    <html lang='en'>
      <head>
        <meta charset='UTF-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        {<title>{title ?? frontmatter?.title ?? 'My Blog'}</title>}
        {import.meta.env.PROD ? (
          <link href='static/assets/style.css' rel='stylesheet' />
        ) : (
          <link href='/app/style.css' rel='stylesheet' />
        )}
      </head>
      <body>
        <header>
          <h1>
            <a href='/'>My Blog</a>
          </h1>
        </header>
        <main class={frontmatter?.title ? proseClass : undefined}>
          {children}
        </main>
        <br class="prose-l prose-a"/>
        <footer>
          <p>&copy; 2024 My Blog. All rights reserved.</p>
        </footer>
      </body>
    </html>
  )
})
