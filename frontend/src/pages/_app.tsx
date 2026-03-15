import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { SWRConfig } from 'swr';
import { ThemeProvider } from '@/context/ThemeContext';
import { UserProvider } from '@/context/UserContext';
import { TelegramUserLoader } from '@/components/TelegramUserLoader';
import { CACHE_DISABLED } from '@/config';

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
      </Head>
      <ApiPreconnect />
      <TelegramUserLoader />
      <Component {...pageProps} />
    </>
  );

  return (
    <ThemeProvider>
      <UserProvider>
        {CACHE_DISABLED ? (
          <SWRConfig value={{ provider: () => emptyCache }}>{content}</SWRConfig>
        ) : (
          content
        )}
      </UserProvider>
    </ThemeProvider>
  );
}
