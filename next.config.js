/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'localhost',
      'dev.cms.AppName.baboons.tech',
      'cdn2.thecatapi.com',
      'loremflickr.com',
      'picsum.photos',
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      type: 'asset/resource',
    });
    config.module.rules.push({
      test: /\.(glb|gltf)$/i,
      type: 'asset/resource',
    });
    return config;
  },
};

module.exports = nextConfig
