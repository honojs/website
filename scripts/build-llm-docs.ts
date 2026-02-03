import fs from 'node:fs'
import path from 'node:path'
import { glob } from 'node:fs/promises'

const frontmatterRegex = /^\n*---(\n.+)*?\n---\n/

const docsDir = path.resolve('docs')

const sliceExt = (file: string) => {
  return file.split('.').slice(0, -1).join('.')
}

const extractLabel = (file: string) => {
  return sliceExt(file.split('/').pop() || '')
}

function capitalizeDelimiter(str: string) {
  return str
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('-')
}

async function generateLLMDocs() {
  const outputListFile = path.resolve('public/llms.txt')

  const optionalFiles: string[] = []
  for await (const file of glob('**/*.md', { cwd: docsDir })) {
    optionalFiles.push(file)
  }
  optionalFiles.sort()

  const optionals = optionalFiles.map(
    (file) =>
      `- [${capitalizeDelimiter(extractLabel(file)).replace(/-/, ' ')}](https://hono.dev/docs/${sliceExt(file)})`
  )

  fs.writeFileSync(
    outputListFile,
    [
      '# Hono',
      '',
      '> Hono - means flame🔥 in Japanese - is a small, simple, and ultrafast web framework built on Web Standards. It works on any JavaScript runtime: Cloudflare Workers, Fastly Compute, Deno, Bun, Vercel, Netlify, AWS Lambda, Lambda@Edge, and Node.js.',
      '',
      '## Docs',
      '',
      '- [Full Docs](https://hono.dev/llms-full.txt) Full documentation of Hono. (without examples)',
      '- [Tiny Docs](https://hono.dev/llms-small.txt): Tiny documentation of Hono. (includes only desciption of core)',
      '',
      '## Examples',
      '',
      '- [Examples](https://github.com/honojs/website/tree/main/examples): List of example files.',
      '',
      '## Optional',
      '',
      ...optionals,
    ].join('\n'),
    'utf-8'
  )
  console.log(`< Output '${outputListFile}' `)

  const outputFullFile = path.resolve('public/llms-full.txt')
  const fullFiles: string[] = []
  for await (const file of glob('**/*.md', { cwd: docsDir })) {
    fullFiles.push(file)
  }
  fullFiles.sort()

  const fullContent = await generateContent(
    fullFiles,
    docsDir,
    '<SYSTEM>This is the full developer documentation for Hono.</SYSTEM>\n\n'
  )

  fs.writeFileSync(outputFullFile, fullContent, 'utf-8')
  console.log(`< Output '${outputFullFile}' `)

  const outputTinyFile = path.resolve('public/llms-small.txt')

  // Note: glob's `exclude` option doesn't work in Bun runtime
  // so we manually filter the files instead
  const tinyExclude = ['concepts', 'helpers', 'middleware']
  const tinyFiles: string[] = []
  for await (const file of glob('**/*.md', { cwd: docsDir })) {
    if (!tinyExclude.some((exc) => file.startsWith(`${exc}/`))) {
      tinyFiles.push(file)
    }
  }
  tinyFiles.sort()

  const tinyContent = await generateContent(
    tinyFiles,
    docsDir,
    '<SYSTEM>This is the tiny developer documentation for Hono.</SYSTEM>\n\n'
  )

  fs.writeFileSync(outputTinyFile, tinyContent, 'utf-8')
  console.log(`< Output '${outputTinyFile}' `)
}

async function generateContent(
  files: AsyncIterable<string> | string[],
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
