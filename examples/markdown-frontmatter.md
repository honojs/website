# Markdown + Frontmatter

Markdown is a popular lightweight markup language that is widely used for creating website content and documentation. Its simple and readable syntax makes it an excellent choice for writing web pages, blog posts, and technical documentation.

Here's an example of how to handle Markdown content with Hono:

## 🛠️ Installation
```sh
npm install unified remark-parse remark-extract-frontmatter remark-rehype remark-frontmatter rehype-stringify yaml
```

## 🚀 Setup

```ts
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { parse as parseYaml } from "yaml";

const parse = (markdownContent: string) => {
  const { value } = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(markdownContent);
  return { value }; 
}
```

## 📝 Frontmatter
Frontmatter is a section at the beginning of a Markdown file that contains metadata about the content. It's typically written in YAML format and enclosed between triple-dashes (`---`). This metadata can include information like title, date, author, tags, or any other custom fields you want to define.

Here's how you can extract Frontmatter

1. First install additionll dependencies
```sh
npm install remark-extract-frontmatter remark-frontmatter
```

2. Use `remark` plugins:
```ts
import remarkParse from "remark-parse";
import remarkExtractFrontmatter from "remark-extract-frontmatter";
import remarkFrontmatter from "remark-frontmatter";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { parse as parseYaml } from "yaml";

const parse = (markdownContent: string) => {
  const { data, value } = await unified()
    .use(remarkParse)
    .use(remarkExtractFrontmatter, { yaml: parseYaml })
    .use(remarkFrontmatter)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(markdownContent);
  return { data, value }; // { data: {}; value: string }
}
```

## 💡 Example usage
```tsx
const markdownContent = `---
title: Hello World
description: Hello World example page for hono documentation
nested:
  foo: bar
---

## Section A
Hello
`;

const parsedContent = parse(markdownContent);

console.log(parsedContent);
/* {
  data: {
    title: "Hello World",
    description: "Hello World example page for hono documentation",
    nested: {
      foo: "bar",
    },
  },
  value: "<h2>Section A</h2>\n<p>Hello</p>",
} */
```

## 🔗 See Also
- https://github.com/remarkjs/remark
- https://github.com/rehypejs/rehype
- https://github.com/unifiedjs/unified
- https://jekyllrb.com/docs/front-matter/
