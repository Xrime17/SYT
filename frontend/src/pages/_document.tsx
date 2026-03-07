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
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){if(window.self!==window.top){var l=document.createElement("link");l.rel="preconnect";l.href="https://telegram.org";document.head.appendChild(l);var s=document.createElement("script");s.src="https://telegram.org/js/telegram-web-app.js";s.async=true;document.head.appendChild(s);}})();`,
          }}
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
