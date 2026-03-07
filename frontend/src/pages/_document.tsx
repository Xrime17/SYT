import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ru">
      <Head>
        <meta name="description" content="Трекер задач, повторений и напоминаний в Telegram" />
        <link rel="preconnect" href="https://telegram.org" />
        <link rel="dns-prefetch" href="https://telegram.org" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
