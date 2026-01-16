/** @type {import('next').NextConfig} */
const nextConfig = {images: {
    remotePatterns: [
      {
        protocol: 'https',
        // זו הכתובת הספציפית של הפרויקט שלך ב-Supabase (מהשגיאה ששלחת)
        hostname: 'umftbrpopdcabjjmowvg.supabase.co', 
        port: '',
        pathname: '/storage/v1/object/**',
      },
    ],
  },};

module.exports = nextConfig;
