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
            'blog',
            'about',
            'contact',
        ];
        return [
            // Avtomobil satışı dayandırılıb: köhnə ünvanlar şarj stansiyalarına yönəlir
            { source: '/electric-vehicles/:path*', destination: '/az/charging-stations', permanent: true },
            { source: '/:locale(az|en|ru)/electric-vehicles/:path*', destination: '/:locale/charging-stations', permanent: true },
            // İnvertor brendi QD-dən MOGOWIN-ə dəyişib: köhnə məhsul linkləri yeni ünvana yönəlir
            { source: '/az/inverters/hibrid-invertorlar-qd-:rest', destination: '/az/inverters/hibrid-invertorlar-mogowin-:rest', permanent: true },
            { source: '/en/inverters/hybrid-inverters-qd-:rest', destination: '/en/inverters/hybrid-inverters-mogowin-:rest', permanent: true },
            { source: '/ru/inverters/gibridnye-invertory-qd-:rest', destination: '/ru/inverters/gibridnye-invertory-mogowin-:rest', permanent: true },
            // Silinmiş məqalənin köhnə linkləri yerinə yazılan məqaləyə yönəlir
            { source: '/az/blog/cinden-getirilmis-elektromobili-azerbaycanda-nece-sarj-etmek-olar', destination: '/az/blog/gunes-paneli-nece-secilir-ev-ve-biznes-ucun-praktik-beledci', permanent: true },
            { source: '/en/blog/how-to-charge-a-chinese-imported-electric-car-in-azerbaijan', destination: '/en/blog/how-to-choose-solar-panels-a-practical-guide-for-homes-and-businesses', permanent: true },
            { source: '/ru/blog/kak-zaryazhat-privezyonnyj-iz-kitaya-elektromobil-v-azerbajdzhane', destination: '/ru/blog/kak-vybrat-solnechnye-paneli-prakticheskoe-rukovodstvo-dlya-doma-i-biznesa', permanent: true },
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