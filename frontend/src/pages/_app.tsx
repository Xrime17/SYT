import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { UserProvider } from '@/context/UserContext';
import { TelegramUserLoader } from '@/components/TelegramUserLoader';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <TelegramUserLoader />
      <Component {...pageProps} />
    </UserProvider>
  );
}
