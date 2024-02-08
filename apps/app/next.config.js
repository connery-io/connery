/** @type {import('next').NextConfig} */
const nextConfig = {
    redirects: async () => {
        return [
            {
                source: '/',
                destination: '/login',
                permanent: false,
            },
        ];
    },
};

module.exports = nextConfig;
