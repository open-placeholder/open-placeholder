/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(process.env.NEXT_OUTPUT_STANDALONE === 'true' && {
    output: 'standalone',
  }),
}

module.exports = nextConfig
