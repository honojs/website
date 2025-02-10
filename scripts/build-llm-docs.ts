import fs from 'node:fs'
import path from 'node:path'
import { glob } from 'node:fs/promises'

const frontmatterRegex = /^\n*---(\n.+)*?\n---\n/

async function generateDocsText() {
  const docsDir = path.resolve('docs')
  const outputFile = path.resolve('public/llm.txt')
  const outputTinyFile = path.resolve('public/llm-tiny.txt')

  const files = await glob('**/*.md', { cwd: docsDir })
  const tinyExclude = ['concepts', 'helpers', 'middleware']
  const tinyFiles = await glob('**/*.md', {
    cwd: docsDir,
    exclude: (filename: string) => tinyExclude.includes(filename),
  })

  const fullContent = await generateContent(
    files,
    docsDir,
    '<SYSTEM>This is the full developer documentation for Hono.</SYSTEM>\n\n'
  )
  const tinyContent = await generateContent(
    tinyFiles,
    docsDir,
    '<SYSTEM>This is the tiny developer documentation for Hono.</SYSTEM>\n\n'
  )

  fs.writeFileSync(outputFile, fullContent, 'utf-8')
  console.log(`< Output '${outputFile}' `)
  fs.writeFileSync(outputTinyFile, tinyContent, 'utf-8')
  console.log(`< Output '${outputTinyFile}' `)
}

async function generateContent(
  files: NodeJS.AsyncIterator<string, any, any>,
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

generateDocsText().catch(console.error)
