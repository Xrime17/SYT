import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ru">
      <Head>
        <title>Syt — Трекер задач</title>
        <meta name="description" content="Трекер задач, повторений и напоминаний в Telegram" />
        <script src="https://telegram.org/js/telegram-web-app.js" async />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
