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

for (const route of appRoutes) {
  const dir = path.join(distDir, route);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), appIndex);
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
