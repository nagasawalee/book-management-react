/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['antd'],
  async rewrites() {
    return [{
      source: '/api/:path*',
      //mock api
      //destination: 'https://mock.apifox.com/m1/3852138-0-default/api/:path*'
      //本地接口
      destination: 'http://localhost:3005/api/:path*'
    }]
  }

}

module.exports = nextConfig
