/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
        pathname: "/f/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/order",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
