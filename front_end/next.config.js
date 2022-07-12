/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  rewrites: () => {
    return [
      {
        source: "/api/:path*/",
        destination: `${process.env.SERVER_URL}/:path*/`,
      },
    ];
  }
}

module.exports = nextConfig
