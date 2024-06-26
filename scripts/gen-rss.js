const { promises: fs } = require('fs')
const path = require('path')
const RSS = require('rss')
const matter = require('gray-matter')
const { glob } = require( 'glob' )


async function generate() {
  const feed = new RSS({
    title: 'Raaid Arshad',
    site_url: 'https://raaid.xyz',
    feed_url: 'https://raaid.xyz/feed.xml'
  })

  const fullPaths = await glob(`pages/posts/**/*.md`)
  const posts = fullPaths.map((fp) => path.basename(fp))

  await Promise.all(
    fullPaths.map(async (fp) => {

      const content = await fs.readFile(fp)
      const frontmatter = matter(content)
      const parentDir = path.basename(path.dirname(fp))

      feed.item({
        title: frontmatter.data.title,
        url: '/posts/' + parentDir + '/' + path.basename(fp).replace(/\.mdx?/, ''),
        date: frontmatter.data.date,
        description: frontmatter.data.description,
        categories: frontmatter.data.tag.split(', '),
        author: frontmatter.data.author
      })
    })
  )

  await fs.writeFile('./public/feed.xml', feed.xml({ indent: true }))
}

generate()
