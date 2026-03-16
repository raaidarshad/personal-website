import nextra from 'nextra'
import { fileURLToPath } from 'url'
import { resolve, dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const withNextra = nextra({
  theme: 'nextra-theme-blog',
  themeConfig: './theme.config.js'
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['react-modern-audio-player'],
  webpack(config, { webpack }) {
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /^\.\/index\.css$/,
        (resource) => {
          if (resource.context.includes('react-modern-audio-player')) {
            resource.request = resolve(__dirname, 'styles/_audio-player-shim.js')
          }
        }
      )
    )
    return config
  }
}

export default withNextra(nextConfig)
