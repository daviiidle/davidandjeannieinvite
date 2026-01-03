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
  'save-the-date',
  path.join('en', 'save-the-date'),
  path.join('vi', 'save-the-date'),
];

const shareImageUrl = 'https://davidandjeanniewedding.site/images/share-image.jpg?v=20260103';

const metaByLocale = {
  en: {
    htmlLang: 'en-AU',
    title: 'David &amp; Jeannie — Save the Date',
    description:
      'October 3, 2026 • Melbourne, Victoria. Please visit the link, scroll down, and enter your details to receive updates.',
    url: 'https://davidandjeanniewedding.site/en/save-the-date/',
    locale: 'en_AU',
    localeAlternate: 'vi_VN',
  },
  vi: {
    htmlLang: 'vi-VN',
    title: 'David &amp; Jeannie — Lễ Thành Hôn',
    description:
      '03 tháng 10 năm 2026 • Melbourne, Victoria. Sau khi truy cập, xin vui lòng kéo xuống và điền thông tin để nhận cập nhật về hôn lễ.',
    url: 'https://davidandjeanniewedding.site/vi/save-the-date/',
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
    [/property="og:locale" content="[^"]*"/, `property="og:locale" content="${meta.locale}"`],
    [/property="og:locale:alternate" content="[^"]*"/, `property="og:locale:alternate" content="${meta.localeAlternate}"`],
    [/name="twitter:title" content="[^"]*"/, `name="twitter:title" content="${meta.title}"`],
    [/name="twitter:description" content="[^"]*"/, `name="twitter:description" content="${meta.description}"`],
    [/name="twitter:image" content="[^"]*"/, `name="twitter:image" content="${shareImageUrl}"`],
    [/<title>[^<]*<\/title>/, `<title>${meta.title}</title>`],
  ];

  return replacements.reduce((acc, [pattern, replacement]) => acc.replace(pattern, replacement), html);
};

for (const route of appRoutes) {
  const dir = path.join(distDir, route);
  fs.mkdirSync(dir, { recursive: true });
  const locale = route.startsWith('vi') ? 'vi' : 'en';
  const localizedIndex = applyMeta(appIndex, metaByLocale[locale]);
  fs.writeFileSync(path.join(dir, 'index.html'), localizedIndex);
}

const redirectTemplate = (target) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Redirecting...</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="refresh" content="0; url=${target}">
    <link rel="canonical" href="${target}">
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
    <p>Redirecting to <a href="${target}">Save the Date</a>...</p>
  </body>
</html>
`;

fs.writeFileSync(path.join(distDir, 'index.html'), redirectTemplate('/en/save-the-date'));

const enDir = path.join(distDir, 'en');
const viDir = path.join(distDir, 'vi');
fs.mkdirSync(enDir, { recursive: true });
fs.mkdirSync(viDir, { recursive: true });

fs.writeFileSync(path.join(enDir, 'index.html'), redirectTemplate('/en/save-the-date'));
fs.writeFileSync(path.join(viDir, 'index.html'), redirectTemplate('/vi/save-the-date'));
