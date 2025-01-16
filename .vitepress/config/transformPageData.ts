export default {
  transformPageData(pageData) {
    const canonicalUrl = `https://honodev.pages.dev/${pageData.relativePath}`
      .replace(/index\.md$/, '')
      .replace(/\.md$/, '/')

    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push([
      'link',
      { rel: 'canonical', href: canonicalUrl }
    ])
  }
} 