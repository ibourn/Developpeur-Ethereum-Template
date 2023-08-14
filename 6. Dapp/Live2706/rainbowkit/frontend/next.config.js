const {
  getModuleBuildInfo,
} = require("next/dist/build/webpack/loaders/get-module-build-info");

/** @type {import('next').NextConfig} */
const nextConfig = {};

// module.exports = {
//   webpack: (config, { isServer }) => {
//     // depend on 'fs' module
//     if (!isServer) {
//       // config.node = {
//       //     fs: 'empty',
//       // }
//       //dont resolve fs module on the client to prevent this error on build --> error can't resolve 'fs'
//       config.resolve.fallback = {
//         fs: false,
//         net: false,
//         tls: false,
//       };
//     }
//   },
// };
module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // don't resolve 'fs' module on the client to prevent this error on build --> Error: Can't resolve 'fs'
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },
};
module.exports = nextConfig;
