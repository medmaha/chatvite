/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,

    env: {
        BASE_URL: process.env.BASE_URL,
        OPEN_AI_KEY: process.env.OPEN_AI_KEY,
        WEBSOCKET_URL: process.env.WEBSOCKET_URL,
    },
    images: {
        domains: (() => {
            const domain = process.env.IMAGE_DOMAINS
            return domain.split(",")
        })(),
    },
}

module.exports = nextConfig
