import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { SITE_NAME, SITE_URL } from "@/config/site";
import { alternatesFor } from "@/lib/seo";
import { organizationJsonLd } from "@/config/organization";
import { notFound } from "next/navigation";
import { routing } from "../../i18n/routing";
import { ThemeProvider } from "next-themes";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import CustomCursor from "./components/common/CustomCursor";
import { PrimeReactProvider } from "primereact/api";
import NextTopLoader from "nextjs-toploader";

const nunitoSans = Nunito_Sans({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-nunito-sans",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.default" });

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t("title"),
      template: `%s | ${SITE_NAME}`,
    },
    description: t("description"),
    alternates: alternatesFor(locale, "/"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${SITE_URL}/${locale}`,
      siteName: SITE_NAME,
      type: "website",
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${nunitoSans.variable} font-sans antialiased dark:bg-background dark:text-foreground`}
      >
        <PrimeReactProvider value={{ ripple: true }}>
          <ThemeProvider attribute="class" enableSystem defaultTheme="light">
            <NextIntlClientProvider locale={locale || 'az'}>
              <NextTopLoader showSpinner={false} color="#006965" />
              <Header />
              <CustomCursor />
              {children}
              <Footer />
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify(organizationJsonLd),
                }}
              />
            </NextIntlClientProvider>
          </ThemeProvider>
        </PrimeReactProvider>
      </body>
    </html>
  );
}
