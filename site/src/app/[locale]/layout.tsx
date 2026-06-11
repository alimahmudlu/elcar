import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import { hasLocale, NextIntlClientProvider } from "next-intl";
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

export const metadata: Metadata = {
  title: "ELCAR",
  description: "Elcar",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  console.log(locale, params, 'locale');
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
            </NextIntlClientProvider>
          </ThemeProvider>
        </PrimeReactProvider>
      </body>
    </html>
  );
}
