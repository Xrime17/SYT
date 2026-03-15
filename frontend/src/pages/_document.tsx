import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ru" className="dark" data-theme="dark">
      <Head>
        <meta name="description" content="Трекер задач, повторений и напоминаний в Telegram" />
        <link rel="preconnect" href="https://telegram.org" />
        <link rel="dns-prefetch" href="https://telegram.org" />
        <script src="https://telegram.org/js/telegram-web-app.js" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
