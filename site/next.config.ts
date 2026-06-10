import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
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