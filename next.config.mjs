/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Sous-chemin optionnel (ex. "/jml" pour picodesign.fr/jml). Fixé au build.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
}

export default nextConfig
