import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

interface VersionEntry {
  version: string
  description: string
  highlight: 'featured' | 'latest' | null
  audioFile: string
}

function VersionChangelog({ versions }: { versions: VersionEntry[] }) {
  if (versions.length === 0) return null
  return (
    <>
      <hr style={{ border: 'none', borderTop: '1px solid #bbb', margin: '24px 0' }} />
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {versions.map(entry => (
        <li key={entry.version} style={{ marginBottom: '24px' }}>
          <div>
            <span style={{ fontWeight: 600 }}>{entry.version}</span>
            {entry.highlight && (
              <span style={{
                fontSize: '0.7rem',
                padding: '1px 6px',
                borderRadius: '9999px',
                background: '#e8e8e8',
                color: '#555',
                marginLeft: '6px',
              }}>
                {entry.highlight}
              </span>
            )}
            {entry.audioFile && (
              <a
                href={entry.audioFile}
                download
                style={{ fontSize: '0.7rem', marginLeft: '10px', padding: '1px 6px', borderRadius: '9999px', background: '#ddeeff', color: '#3366cc', textDecoration: 'none' }}
              >
                download
              </a>
            )}
          </div>
          {entry.description && (
            <div style={{ color: '#666', fontSize: '0.9rem', marginTop: '2px' }}>
              {entry.description}
            </div>
          )}
          {entry.audioFile && (
            <audio
              controls
              src={entry.audioFile}
              style={{ width: '100%', marginTop: '8px' }}
            />
          )}
        </li>
      ))}
      </ul>
    </>
  )
}

export async function getStaticPaths() {
  const musicDir = path.join(process.cwd(), 'content/music')
  const dirs = fs.readdirSync(musicDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
  return {
    paths: dirs.map(song => ({ params: { song } })),
    fallback: false,
  }
}

export async function getStaticProps({ params }: { params: { song: string } }) {
  const dir = path.join(process.cwd(), 'content/music', params.song)
  const files = fs.readdirSync(dir)
    .filter(f => f.endsWith('.mdx'))
    .sort()
    .map(f => path.join(dir, f))
  const parsed = files.map((file) => {
    const { data } = matter(fs.readFileSync(file, 'utf8'))
    return { data, name: data.version || path.basename(file, '.mdx') }
  }).reverse()

  const featuredIndex = parsed.findIndex(p => p.data.featured)
  const hasFeatured = featuredIndex >= 0
  const latestIndex = 0

  const versions: VersionEntry[] = parsed.map((p, i) => {
    let highlight: VersionEntry['highlight'] = null
    if (p.data.featured) {
      highlight = 'featured'
    } else if (!hasFeatured && i === latestIndex) {
      highlight = 'latest'
    }
    return {
      version: p.name,
      description: p.data.description || '',
      highlight,
      audioFile: p.data.audio_file || '',
    }
  })

  return { props: { pageTitle: parsed[0].data.name, versions } }
}

export default function SongPage({
  pageTitle,
  versions,
}: {
  pageTitle: string
  versions: VersionEntry[]
}) {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>{pageTitle}</h1>
      <VersionChangelog versions={versions} />
    </div>
  )
}
