/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    env: {
        BASE_URL: process.env.BASE_URL,
        OPEN_AI_KEY: process.env.OPEN_AI_KEY,
    },
    images: {
        domains: (() => {
            const domain = process.env.IMAGE_DOMAINS
            return domain.split(",")
        })(),
    },
}

module.exports = nextConfig

