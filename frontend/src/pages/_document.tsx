import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ru">
      <Head>
        <title>Syt — Трекер задач</title>
        <meta name="description" content="Трекер задач, повторений и напоминаний в Telegram" />
      </Head>
      <body className="antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){if(window.self!==window.top){var s=document.createElement("script");s.src="https://telegram.org/js/telegram-web-app.js";s.async=true;document.head.appendChild(s);}})();`,
          }}
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
