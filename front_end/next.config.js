/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  rewrites: () => {
    return [
      {
        source: "/api/:path*/",
        destination: "http://backendx:8000/:path*/",
      },
    ];
  }
}

module.exports = nextConfig
