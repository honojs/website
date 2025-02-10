import fs from 'node:fs'
import path from 'node:path'
import { glob } from 'node:fs/promises'

const frontmatterRegex = /^\n*---(\n.+)*?\n---\n/
const createTiny = (docs: string) => {
  return docs.replace(/(\n|\t)/g, ' ')
}

async function generateDocsText() {
  const docsDir = path.resolve('docs')
  const outputFile = path.resolve('public/llm.txt')
  const outputTinyFile = path.resolve('public/llm-tiny.txt')

  const files = await glob('**/*.md', { cwd: docsDir })

  if (!files) throw new Error('No Documentation files')

  let content =
    '<SYSTEM>This is the full developer documentation for Hono.</SYSTEM>\n\n'
  content += '# Start of Hono documentation\n\n'

  for await (const file of files) {
    console.log(`> Writing '${file}' `)
    const fileContent = fs.readFileSync(
      path.resolve('docs', file),
      'utf-8'
    )
    content += fileContent.replace(frontmatterRegex, '') + '\n\n'
  }

  fs.writeFileSync(outputFile, content, 'utf-8')
  console.log(`< Output '${outputFile}' `)
  fs.writeFileSync(outputTinyFile, createTiny(content), 'utf-8')
  console.log(`< Output '${outputTinyFile}' `)
}

generateDocsText().catch(console.error)
