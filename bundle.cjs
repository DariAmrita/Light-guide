/**
 * Собирает index.html для GitHub: встраивает styles.css и script.js.
 * Редактируйте index.source.html, styles.css, script.js — затем:
 *   node bundle.cjs
 */
const fs = require('fs');
const path = require('path');

const dir = __dirname;
const sourcePath = path.join(dir, 'index.source.html');
const outPath = path.join(dir, 'index.html');
const cssPath = path.join(dir, 'styles.css');
const jsPath = path.join(dir, 'script.js');

function createSourceFromBundled() {
  const bundled = fs.readFileSync(outPath, 'utf8');
  const styleStart = bundled.indexOf('<style>');
  if (styleStart === -1) {
    console.error('В index.html нет <style> — нечего разбирать.');
    process.exit(1);
  }
  const head = bundled.slice(0, styleStart);
  const bodyStart = bundled.indexOf('<body>');
  const scriptStart = bundled.lastIndexOf('  <script>');
  if (bodyStart === -1 || scriptStart === -1) {
    console.error('Не найдена разметка body или script в index.html');
    process.exit(1);
  }
  const body = bundled.slice(bodyStart, scriptStart);
  const source =
    head +
    '  <link rel="stylesheet" href="styles.css">\n</head>\n' +
    body +
    '  <script src="script.js" defer></script>\n</body>\n</html>\n';
  fs.writeFileSync(sourcePath, source, 'utf8');
  console.log('Создан index.source.html');
}

if (process.argv.includes('--init')) {
  createSourceFromBundled();
  process.exit(0);
}

if (!fs.existsSync(sourcePath)) {
  console.error('Нет index.source.html. Запустите: node bundle.cjs --init');
  process.exit(1);
}

let html = fs.readFileSync(sourcePath, 'utf8');
html = html.replace(
  /\n?<!-- ЛОКАЛЬНАЯ ВЕРСИЯ:[\s\S]*?-->\n?/,
  '\n'
);
const css = fs.readFileSync(cssPath, 'utf8');
const js = fs.readFileSync(jsPath, 'utf8');

html = html.replace(
  /\s*<link rel="stylesheet" href="styles\.css">\s*/i,
  '\n  <style>\n' + css + '\n  </style>\n'
);

html = html.replace(
  /\s*<script src="script\.js" defer><\/script>\s*/i,
  '\n  <script>\n' + js + '\n  </script>\n'
);

const marker =
  '<!-- Daria Amrita | GitHub Pages | bundled ' +
  new Date().toISOString().slice(0, 10) +
  ' | НЕ загружайте index.source.html -->\n';
if (!html.startsWith(marker)) {
  html = html.replace('<!DOCTYPE html>', '<!DOCTYPE html>\n' + marker);
}

fs.writeFileSync(outPath, html, 'utf8');

const githubDir = path.join(dir, 'for-github');
fs.mkdirSync(githubDir, { recursive: true });
fs.copyFileSync(outPath, path.join(githubDir, 'index.html'));
fs.writeFileSync(path.join(githubDir, '.nojekyll'), '');

const sizeKb = Math.round(fs.statSync(outPath).size / 1024);
const hasStyle = html.includes('<style>');
const hasScript = html.includes('const TRANSLATIONS');

if (!hasStyle || !hasScript || sizeKb < 50) {
  console.error('Ошибка сборки: index.html неполный (' + sizeKb + ' KB)');
  process.exit(1);
}

console.log('Готово: index.html (' + sizeKb + ' KB) — готов для GitHub.');
console.log('Загрузите на github.com ТОЛЬКО файл: for-github/index.html');
console.log('(переименовывать не нужно — имя уже index.html)');
