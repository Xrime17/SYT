import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Inter } from 'next/font/google';
import { SWRConfig } from 'swr';
import { ThemeProvider } from '@/context/ThemeContext';
import { UserProvider } from '@/context/UserContext';
import { TelegramUserLoader } from '@/components/TelegramUserLoader';
import { CACHE_DISABLED } from '@/config';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

function ApiPreconnect() {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url || url.startsWith('http://localhost')) return null;
  let origin: string;
  try {
    origin = new URL(url).origin;
  } catch {
    return null;
  }
  return (
    <Head>
      <link rel="preconnect" href={origin} />
      <link rel="dns-prefetch" href={origin} />
    </Head>
  );
}

const emptyCache = {
  get: () => undefined,
  set: () => {},
  delete: () => {},
  keys: function* () {},
};

export default function App({ Component, pageProps }: AppProps) {
  const content = (
    <>
      <Head>
        <title>Syt — Трекер задач</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
      </Head>
      <ApiPreconnect />
      <TelegramUserLoader />
      <Component {...pageProps} />
    </>
  );

  return (
    <ThemeProvider>
      <div className={inter.className}>
      <UserProvider>
        {CACHE_DISABLED ? (
          <SWRConfig value={{ provider: () => emptyCache }}>{content}</SWRConfig>
        ) : (
          content
        )}
      </UserProvider>
      </div>
    </ThemeProvider>
  );
}
