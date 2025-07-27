const withNextra = require('nextra')('nextra-theme-blog', './theme.config.js')

/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['react-modern-audio-player'],
}

module.exports = withNextra(nextConfig)
