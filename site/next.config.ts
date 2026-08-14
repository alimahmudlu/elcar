import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
    // localePrefix 'always'-ə keçdikdən sonra prefiksiz köhnə ünvanların
    // sınmaması üçün 301 yönləndirmələr. next-intl middleware kök "/" üçün
    // artıq yönləndirir; burada dərin səhifələr əhatə olunur.
    async redirects() {
        const paths = [
            'charging-stations',
            'connectors-accessories',
            'electric-vehicles',
            'blog',
            'about',
            'contact',
        ];
        return [
            // /charging-stations -> /az/charging-stations
            ...paths.map((p) => ({
                source: `/${p}`,
                destination: `/az/${p}`,
                permanent: true,
            })),
            // /charging-stations/slug -> /az/charging-stations/slug
            ...paths.map((p) => ({
                source: `/${p}/:slug`,
                destination: `/az/${p}/:slug`,
                permanent: true,
            })),
        ];
    },
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '3115',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'api.elcar.az',
                pathname: '/**',
            }
        ]
    }
}

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
export default withNextIntl(nextConfig);