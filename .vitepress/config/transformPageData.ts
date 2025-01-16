const SUPPORTED_LANGS = ['zh']
const BASE_URL = 'https://honodev.pages.dev'

export default {
  transformPageData(pageData) {
    const canonicalUrl = `${BASE_URL}/${pageData.relativePath}`
      .replace(/index\.md$/, '')
      .replace(/\.md$/, '/')

    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push([
      'link',
      { rel: 'canonical', href: canonicalUrl }
    ])

    const path = pageData.relativePath
      .replace(/^[a-z]{2}\//, '')
      .replace(/index\.md$/, '')
      .replace(/\.md$/, '')
    SUPPORTED_LANGS.forEach(lang => {
      pageData.frontmatter.head.push([
        'link',
        {
          rel: 'alternate',
          href: `${BASE_URL}/${lang}/${path}`,
          hreflang: lang
        }
      ])
    })

    pageData.frontmatter.head.push([
      'link',
      {
        rel: 'alternate',
        href: `${BASE_URL}/${path}`,
        hreflang: 'en'
      }
    ])
  }
}