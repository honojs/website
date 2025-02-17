import fs from 'fs';
import path from 'path';

/**
 * Collects all Markdown files within the specified directory recursively,
 * sorts them by relative path, and merges them.
 * The output file will only be rewritten if its content changes.
 *
 * @param {string} dir        The source directory path for merging
 * @param {string} outputFile The path of the output file
 */
function combineMarkdownFiles(dir, outputFile) {
  const markdownFiles = [];
  const excludedFiles = ['hono-docs.md']; // Files to be excluded

  // Function to recursively collect Markdown file paths
  function walkSync(currentDir) {
    const dirents = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const dirent of dirents) {
      const filePath = path.join(currentDir, dirent.name);

      // Check for excluded files
      if (excludedFiles.includes(path.basename(filePath))) {
        continue; // Skip to the next file
      }

      if (dirent.isDirectory()) {
        walkSync(filePath);
      } else if (dirent.isFile() && path.extname(dirent.name) === '.md') {
        markdownFiles.push(filePath);
      }
    }
  }

  walkSync(dir);

  // Sort the collected file paths by their relative paths from the root directory.
  // This ensures a consistent order each time the function is executed.
  markdownFiles.sort((a, b) => {
    const relativeA = path.relative(dir, a);
    const relativeB = path.relative(dir, b);
    return relativeA.localeCompare(relativeB);
  });

  // Read the content of each Markdown file and join them with two newline characters as a separator
  const combinedContent = markdownFiles
    .map(file => fs.readFileSync(file, 'utf8'))
    .join('\n\n');

  // Compare the content of the existing output file, and only rewrite it if there are changes
  let previousContent = '';
  if (fs.existsSync(outputFile)) {
    previousContent = fs.readFileSync(outputFile, 'utf8');
  }
  if (previousContent !== combinedContent) {
    fs.writeFileSync(outputFile, combinedContent);
    console.log(`Output updated: ${outputFile}`);
  } else {
    console.log('No changes detected. Output file remains unchanged.');
  }
}

combineMarkdownFiles(
  path.join(import.meta.dirname, '../docs'),
  path.join(import.meta.dirname, '../public/hono-docs.md')
);
