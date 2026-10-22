const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "orentemist-backend.onrender.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;