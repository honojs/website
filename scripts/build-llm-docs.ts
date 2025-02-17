import fs from 'node:fs'
import path from 'node:path'
import { glob } from 'node:fs/promises'

const frontmatterRegex = /^\n*---(\n.+)*?\n---\n/

const docsDir = path.resolve('docs')

async function generateLLMDocs() {
  const outputListFile = path.resolve('public/llms.txt')

  fs.writeFileSync(
    outputListFile,
    [
      '# Hono',
      '',
      '> Hono - means flame🔥 in Japanese - is a small, simple, and ultrafast web framework built on Web Standards. It works on any JavaScript runtime: Cloudflare Workers, Fastly Compute, Deno, Bun, Vercel, Netlify, AWS Lambda, Lambda@Edge, and Node.js.',
      '',
      'Important notes:',
      '',
      '- Although it takes some inspiration from express, but the syntax is not interchangeable.',
      '- It is designed primarily with the edge environment in mind, but will run on any environment.',
      '',
      '## Docs',
      '',
      '- [Full Docs](https://hono.dev/llms-full.txt) Full documentation of Hono. (without examples)',
      '- [Tiny Docs](https://hono.dev/llms-small.txt): Tiny documentation of Hono. (includes only desciption of core)',
      '',
      '## Examples',
      '',
      '- [Examples](https://github.com/honojs/website/tree/main/examples): List of example files.',
    ].join('\n'),
    'utf-8'
  )

  const outputFullFile = path.resolve('public/llms-full.txt')

  const files = await glob('**/*.md', { cwd: docsDir })

  const fullContent = await generateContent(
    files,
    docsDir,
    '<SYSTEM>This is the full developer documentation for Hono.</SYSTEM>\n\n'
  )

  fs.writeFileSync(outputFullFile, fullContent, 'utf-8')
  console.log(`< Output '${outputFullFile}' `)

  const outputTinyFile = path.resolve('public/llms-small.txt')

  const tinyExclude = ['concepts', 'helpers', 'middleware']
  const tinyFiles = await glob('**/*.md', {
    cwd: docsDir,
    exclude: (filename: string) => tinyExclude.includes(filename),
  })

  const tinyContent = await generateContent(
    tinyFiles,
    docsDir,
    '<SYSTEM>This is the tiny developer documentation for Hono.</SYSTEM>\n\n'
  )

  fs.writeFileSync(outputTinyFile, tinyContent, 'utf-8')
  console.log(`< Output '${outputTinyFile}' `)
}

async function generateContent(
  files: NodeJS.AsyncIterator<string>,
  docsDir: string,
  header: string
): Promise<string> {
  let content = header + '# Start of Hono documentation\n'

  for await (const file of files) {
    console.log(`> Writing '${file}' `)
    const fileContent = fs.readFileSync(
      path.resolve(docsDir, file),
      'utf-8'
    )
    content += fileContent.replace(frontmatterRegex, '') + '\n\n'
  }

  return content
}

generateLLMDocs().catch(console.error)
