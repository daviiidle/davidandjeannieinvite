const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '..', 'dist');
const appIndexPath = path.join(distDir, 'index.html');

if (!fs.existsSync(appIndexPath)) {
  console.error('Missing dist/index.html. Run the Vite build first.');
  process.exit(1);
}

const appIndex = fs.readFileSync(appIndexPath, 'utf8');

const appRoutes = [
  'en',
  'vi',
];

const shareImageUrl = 'https://davidandjeanniewedding.site/images/share-image.jpg?v=20260103';

const metaByLocale = {
  en: {
    htmlLang: 'en-AU',
    title: 'David &amp; Jeannie — Wedding Invitation',
    description:
      '3rd of October, 2026 • Melbourne, Victoria. Please visit the link, scroll down, and enter your details.',
    url: 'https://davidandjeanniewedding.site/en/',
    locale: 'en_AU',
    localeAlternate: 'vi_VN',
  },
  vi: {
    htmlLang: 'vi-VN',
    title: 'David &amp; Jeannie — Lễ Thành Hôn',
    description:
      'Kính mời quý khách truy cập đường dẫn bên dưới và vui lòng điền thông tin để nhận thêm cập nhật về lễ cưới.',
    url: 'https://davidandjeanniewedding.site/vi/',
    locale: 'vi_VN',
    localeAlternate: 'en_AU',
  },
};

const applyMeta = (html, meta) => {
  const replacements = [
    [/lang="[^"]*"/, `lang="${meta.htmlLang}"`],
    [/name="description" content="[^"]*"/, `name="description" content="${meta.description}"`],
    [/property="og:title" content="[^"]*"/, `property="og:title" content="${meta.title}"`],
    [/property="og:description" content="[^"]*"/, `property="og:description" content="${meta.description}"`],
    [/property="og:url" content="[^"]*"/, `property="og:url" content="${meta.url}"`],
    [/property="og:image" content="[^"]*"/, `property="og:image" content="${shareImageUrl}"`],
    [/property="og:image:secure_url" content="[^"]*"/, `property="og:image:secure_url" content="${shareImageUrl}"`],
    [/property="og:locale" content="[^"]*"/, `property="og:locale" content="${meta.locale}"`],
    [/property="og:locale:alternate" content="[^"]*"/, `property="og:locale:alternate" content="${meta.localeAlternate}"`],
    [/name="twitter:title" content="[^"]*"/, `name="twitter:title" content="${meta.title}"`],
    [/name="twitter:description" content="[^"]*"/, `name="twitter:description" content="${meta.description}"`],
    [/name="twitter:image" content="[^"]*"/, `name="twitter:image" content="${shareImageUrl}"`],
    [/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${meta.url}" />`],
    [/<title>[^<]*<\/title>/, `<title>${meta.title}</title>`],
  ];

  return replacements.reduce((acc, [pattern, replacement]) => acc.replace(pattern, replacement), html);
};

for (const route of appRoutes) {
  const dir = path.join(distDir, route);
  fs.mkdirSync(dir, { recursive: true });
  const locale = route === 'vi' ? 'vi' : 'en';
  const localizedIndex = applyMeta(appIndex, metaByLocale[locale]);
  fs.writeFileSync(path.join(dir, 'index.html'), localizedIndex);
}

const metaTagBlock = (meta) => `    <meta name="description" content="${meta.description}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="David &amp; Jeannie Wedding">
    <meta property="og:title" content="${meta.title}">
    <meta property="og:description" content="${meta.description}">
    <meta property="og:url" content="${meta.url}">
    <meta property="og:image" content="${shareImageUrl}">
    <meta property="og:image:secure_url" content="${shareImageUrl}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:type" content="image/jpeg">
    <meta property="og:image:alt" content="David &amp; Jeannie Wedding Invitation">
    <meta property="og:locale" content="${meta.locale}">
    <meta property="og:locale:alternate" content="${meta.localeAlternate}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${meta.title}">
    <meta name="twitter:description" content="${meta.description}">
    <meta name="twitter:image" content="${shareImageUrl}">`;

const redirectTemplate = (target, meta = metaByLocale.en) => `<!doctype html>
<html lang="${meta.htmlLang}">
  <head>
    <meta charset="utf-8">
    <title>${meta.title}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
${metaTagBlock(meta)}
    <meta http-equiv="refresh" content="0; url=${target}">
    <link rel="canonical" href="${meta.url}">
    <script>
      (function () {
        var target = "${target}";

        if (window.location.pathname !== target) {
          window.location.replace(target + window.location.search + window.location.hash);
        }
      })();
    </script>
  </head>
  <body>
    <p>Redirecting to <a href="${target}">Wedding Invitation</a>...</p>
  </body>
</html>
`;

fs.writeFileSync(path.join(distDir, 'index.html'), redirectTemplate('/en/'));

const enDir = path.join(distDir, 'en');
const viDir = path.join(distDir, 'vi');
fs.mkdirSync(enDir, { recursive: true });
fs.mkdirSync(viDir, { recursive: true });

fs.writeFileSync(path.join(enDir, 'index.html'), applyMeta(appIndex, metaByLocale.en));
fs.writeFileSync(path.join(viDir, 'index.html'), applyMeta(appIndex, metaByLocale.vi));

// Preserve old save-the-date links by redirecting them to the current localized entry points.
const legacyRoutes = [
  { route: 'save-the-date', target: '/en/' },
  { route: path.join('en', 'save-the-date'), target: '/en/' },
  { route: path.join('vi', 'save-the-date'), target: '/vi/' },
];

for (const { route, target } of legacyRoutes) {
  const dir = path.join(distDir, route);
  const locale = target.startsWith('/vi') ? 'vi' : 'en';
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), redirectTemplate(target, metaByLocale[locale]));
}
