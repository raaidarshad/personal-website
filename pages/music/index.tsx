import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Link from 'next/link'
import MusicPlayer, { Track } from '../../components/MusicPlayer'
import { DATA_BASE_URL } from '../../lib/constants'

interface Song {
  slug: string
  name: string
  track: Track
  version: string
  audioFileUrl: string
  description: string
}

export async function getStaticProps() {
  const musicDir = path.join(process.cwd(), 'content/music')
  const songDirs = fs.readdirSync(musicDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .sort()

  const songMap: Record<string, { data: any; file: string }[]> = {}
  for (const slug of songDirs) {
    const dir = path.join(musicDir, slug)
    const mdxFiles = fs.readdirSync(dir)
      .filter(f => f.endsWith('.mdx'))
      .sort()
      .map(f => path.join(dir, f))
    for (const file of mdxFiles) {
      if (!songMap[slug]) songMap[slug] = []
      const { data } = matter(fs.readFileSync(file, 'utf8'))
      songMap[slug].push({ data, file })
    }
  }

  const songs: Song[] = Object.entries(songMap).map(([slug, versions], i) => {
    const picked = versions.find(v => v.data.featured) ?? versions[versions.length - 1]
    return {
      slug,
      name: picked.data.name,
      track: {
        name: picked.data.version
          ? `${picked.data.name} - ${picked.data.version}`
          : picked.data.name,
        writer: 'Raaid',
        img: '/images/raaid-logo.jpeg',
        src: picked.data.audio_file ? `${DATA_BASE_URL}/audio/${picked.data.audio_file}` : '',
        id: i + 1,
      },
      version: picked.data.version || '',
      audioFileUrl: picked.data.audio_file ? `${DATA_BASE_URL}/audio/${picked.data.audio_file}` : '',
      description: picked.data.description || '',
    }
  })

  return { props: { songs } }
}

export default function Music({ songs }: { songs: Song[] }) {
  const tracks = songs.map(s => s.track)
  return (
    <MusicPlayer tracks={tracks} title="My Songs">
      <div style={{ marginTop: '0' }}>
        <hr style={{ border: 'none', borderTop: '1px solid #bbb', margin: '24px 0' }} />
        <h2 style={{ fontSize: '1rem', marginBottom: '8px' }}>Latest versions</h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {songs.map(s => (
            <li key={s.slug} style={{ marginBottom: '10px' }}>
              <div>
                <span style={{ fontWeight: 600 }}>
                  {s.name}{s.version ? ` - ${s.version}` : ''}
                </span>
                {s.audioFileUrl && (
                  <a
                    href={s.audioFileUrl}
                    download
                    style={{ fontSize: '0.7rem', marginLeft: '10px', padding: '1px 6px',
                             borderRadius: '9999px', background: '#ddeeff', color: '#3366cc',
                             textDecoration: 'none' }}
                  >
                    download
                  </a>
                )}
                <Link
                  href={`/music/${s.slug}`}
                  style={{ fontSize: '0.7rem', marginLeft: '10px', padding: '1px 6px',
                           borderRadius: '9999px', background: '#e8e8e8', color: '#555',
                           textDecoration: 'none' }}
                >
                  all versions →
                </Link>
              </div>
              {s.description && (
                <div style={{ color: '#666', fontSize: '0.9rem', marginTop: '2px' }}>
                  {s.description}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </MusicPlayer>
  )
}
