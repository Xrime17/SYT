import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { UserProvider } from '@/context/UserContext';
import { TelegramUserLoader } from '@/components/TelegramUserLoader';

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

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Head>
        <title>Syt — Трекер задач</title>
      </Head>
      <ApiPreconnect />
      <TelegramUserLoader />
      <Component {...pageProps} />
    </UserProvider>
  );
}
