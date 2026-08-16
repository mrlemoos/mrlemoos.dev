<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
  version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom"
>
  <xsl:output method="html" encoding="UTF-8" indent="yes" />

  <xsl:template match="/">
    <html lang="en-GB">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, follow" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <title><xsl:value-of select="/rss/channel/title" /> — RSS feed</title>
        <style>
          :root {
            color-scheme: light dark;
            --bg: #fafafa;
            --fg: #18181b;
            --muted: #71717a;
            --border: #e4e4e7;
            --panel: #f4f4f5;
          }
          @media (prefers-color-scheme: dark) {
            :root {
              --bg: #09090b;
              --fg: #fafafa;
              --muted: #a1a1aa;
              --border: #27272a;
              --panel: #18181b;
            }
          }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            padding: 3rem 1rem 5rem;
            background: var(--bg);
            color: var(--fg);
            font-family: Geist, ui-sans-serif, system-ui, sans-serif;
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
          }
          .wrap { margin: 0 auto; max-width: 44rem; }
          h1 {
            margin: 0 0 0.5rem;
            font-family: "Instrument Serif", ui-serif, Georgia, serif;
            font-size: clamp(2rem, 5vw, 2.75rem);
            font-weight: 400;
            letter-spacing: -0.02em;
          }
          .lede { margin: 0 0 2rem; color: var(--muted); }
          .note {
            margin-bottom: 3rem;
            padding: 1.25rem;
            border: 1px solid var(--border);
            border-radius: 0.75rem;
            background: var(--panel);
          }
          .note p { margin: 0 0 0.75rem; font-size: 0.9375rem; }
          .note p:last-child { margin-bottom: 0; }
          .url {
            display: block;
            overflow-wrap: anywhere;
            padding: 0.625rem 0.75rem;
            border: 1px solid var(--border);
            border-radius: 0.5rem;
            background: var(--bg);
            font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
            font-size: 0.875rem;
          }
          .kicker {
            margin: 0 0 1rem;
            color: var(--muted);
            font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
            font-size: 0.75rem;
            letter-spacing: 0.14em;
            text-transform: uppercase;
          }
          .item {
            padding: 1.5rem 0;
            border-top: 1px solid var(--border);
          }
          .item h2 {
            margin: 0 0 0.35rem;
            font-size: 1.25rem;
            font-weight: 500;
            letter-spacing: -0.01em;
          }
          .item p { margin: 0; color: var(--muted); }
          .date {
            margin: 0 0 0.5rem;
            color: var(--muted);
            font-size: 0.8125rem;
          }
          a { color: inherit; text-underline-offset: 0.2em; }
          a:hover { text-decoration-thickness: 2px; }
          footer { margin-top: 3rem; color: var(--muted); font-size: 0.875rem; }
        </style>
      </head>
      <body>
        <div class="wrap">
          <p class="kicker">RSS feed</p>
          <h1><xsl:value-of select="/rss/channel/title" /></h1>
          <p class="lede"><xsl:value-of select="/rss/channel/description" /></p>

          <div class="note">
            <p>
              This is a web feed, meant for a feed reader rather than a browser.
              Copy the address below and paste it into your reader to be
              notified when a new post goes up.
            </p>
            <code class="url">
              <xsl:value-of select="/rss/channel/atom:link/@href" />
            </code>
          </div>

          <p class="kicker">
            Latest posts
          </p>
          <xsl:for-each select="/rss/channel/item">
            <div class="item">
              <h2>
                <a href="{link}"><xsl:value-of select="title" /></a>
              </h2>
              <p class="date"><xsl:value-of select="pubDate" /></p>
              <p><xsl:value-of select="description" /></p>
            </div>
          </xsl:for-each>

          <footer>
            <a href="{/rss/channel/link}">Back to the site</a>
          </footer>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
