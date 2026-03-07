import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { UserProvider } from '@/context/UserContext';
import { TelegramUserLoader } from '@/components/TelegramUserLoader';

function ApiPreconnect() {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url || url.startsWith('http://localhost')) return null;
  try {
    const origin = new URL(url).origin;
    return (
      <Head>
        <link rel="preconnect" href={origin} />
        <link rel="dns-prefetch" href={origin} />
      </Head>
    );
  } catch {
    return null;
  }
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <ApiPreconnect />
      <TelegramUserLoader />
      <Component {...pageProps} />
    </UserProvider>
  );
}
