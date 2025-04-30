// ui-client/next.config.ts

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https', // Protocol must be specified
        hostname: 'placehold.co', // The domain hosting the images
        port: '', // Optional: specify port if needed, usually empty for standard HTTPS
        pathname: '/**', // Allow any path on this domain (e.g., /64x64/...)
      },
      // If your actual item images come from another external domain, add it here too
      // Example:
      // {
      //   protocol: 'https',
      //   hostname: 'your-image-cdn.com',
      //   port: '',
      //   pathname: '/**',
      // },
    ],
    // If your item images are ONLY served locally from /public,
    // you might not need remotePatterns at all, unless using the placeholder.
  },
  // Add other Next.js configurations here if you have them
};

export default nextConfig;

// If you are using the .mjs extension instead:
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'placehold.co',
//         port: '',
//         pathname: '/**',
//       },
//     ],
//   },
// };
// export default nextConfig;
