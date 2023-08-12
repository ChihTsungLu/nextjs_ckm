/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        domains: ['lh3.googleusercontent.com', 'res.cloudinary.com']
    },
    experimental:{
        serverComponentsExternalPackages: ['cloudinary','graphql-request'] //solve upload 404 error
    }   //Dependencies used inside Server Components and Route Handlers will automatically be bundled by Next.js.
}

module.exports = nextConfig
