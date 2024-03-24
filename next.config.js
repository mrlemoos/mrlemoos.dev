/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'avatars.githubusercontent.com',
				pathname: '/u/**',
			},
			{
				protocol: 'https',
				hostname: 'images.ctfassets.net',
				pathname: '/**',
			},
		],
	},
};

module.exports = nextConfig;
