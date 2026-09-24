// scripts/sync-projects.js
// Synchronise le site à partir de data/projects.json (source de vérité) :
//   1. trie les projets du plus récent au plus ancien et renumérote les id
//   2. régénère la navigation « Projet précédent / suivant » de chaque page projects/*.html
//   3. met à jour la liste HTML_FILES de build.js
//   4. régénère les URLs projets de sitemap.xml (lastmod = aujourd'hui)
// Usage : npm run sync   (puis npm run build)
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const JSON_PATH = path.join(ROOT, "data/projects.json");
const SITE = "https://jeyko.dev";
const ROOT_PAGES = ["index.html", "about.html", "projects.html", "contact.html", "tarifs.html", "privacy.html"];
const today = new Date().toISOString().slice(0, 10);

// 1. Trier (tri stable : l'ordre du fichier départage les projets d'une même année)
const data = JSON.parse(fs.readFileSync(JSON_PATH, "utf8"));
const projects = data.projects
  .map((p, i) => ({ p, i }))
  .sort((a, b) => parseInt(b.p.year) - parseInt(a.p.year) || a.i - b.i)
  .map(({ p }, i) => ({ ...p, id: i + 1 }));
fs.writeFileSync(JSON_PATH, JSON.stringify({ projects }, null, 2) + "\n");

const pages = projects.filter((p) => p.link && p.link.startsWith("projects/"));
const missing = pages.filter((p) => !fs.existsSync(path.join(ROOT, p.link)));
if (missing.length) {
  console.error("Pages manquantes :", missing.map((p) => p.link).join(", "));
  process.exit(1);
}

// 2. Navigation précédent / suivant (circulaire, dans l'ordre d'affichage)
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
pages.forEach((p, i) => {
  const prev = pages[(i - 1 + pages.length) % pages.length];
  const next = pages[(i + 1) % pages.length];
  const nav = `<nav class="pd-nav" aria-label="Navigation entre projets">
          <a class="prev" href="${path.basename(prev.link)}"><small>← Projet précédent</small><strong>${esc(prev.title)}</strong></a>
          <a class="next" href="${path.basename(next.link)}"><small>Projet suivant →</small><strong>${esc(next.title)}</strong></a>
        </nav>`;
  const file = path.join(ROOT, p.link);
  const html = fs.readFileSync(file, "utf8");
  const re = /<nav class="(?:project-nav|pd-nav)[^"]*"[^>]*>[\s\S]*?<\/nav>/;
  if (!re.test(html)) {
    console.warn(`⚠ Pas de <nav class="pd-nav"> dans ${p.link}`);
    return;
  }
  fs.writeFileSync(file, html.replace(re, nav));
});

// 3. build.js — liste HTML_FILES
const buildPath = path.join(ROOT, "build.js");
const htmlList = [...ROOT_PAGES, ...pages.map((p) => p.link)];
const build = fs.readFileSync(buildPath, "utf8").replace(
  /const HTML_FILES = \[[\s\S]*?\];/,
  `const HTML_FILES = [\n${htmlList.map((f) => `  "${f}",`).join("\n")}\n];`
);
fs.writeFileSync(buildPath, build);

// 4. sitemap.xml — section projets
const sitemapPath = path.join(ROOT, "sitemap.xml");
const urls = pages
  .map(
    (p) => `  <url>
    <loc>${SITE}/${p.link}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.6</priority>
  </url>`
  )
  .join("\n\n");
let sitemap = fs.readFileSync(sitemapPath, "utf8");
sitemap = sitemap.replace(
  /(<!-- Pages de détail projets -->)[\s\S]*?(<\/urlset>)/,
  `$1\n${urls}\n\n$2`
);
// les pages principales listent les projets : on met aussi leur lastmod à jour
sitemap = sitemap.replace(
  /(<loc>https:\/\/jeyko\.dev\/(?:projects\.html)?<\/loc>\s*<lastmod>)[^<]+/g,
  `$1${today}`
);
fs.writeFileSync(sitemapPath, sitemap);

console.log(`✓ ${projects.length} projets, ${pages.length} pages de détail synchronisées`);
