/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            "avatars.githubusercontent.com",
            "lh3.googleusercontent.com",
            "res.cloudinary.com",
        ]
    },
    env: {
        JWT_SECRET: process.env.JWT_SECRET, // Thêm biến môi trường JWT_SECRET
    }
}

module.exports = nextConfig
