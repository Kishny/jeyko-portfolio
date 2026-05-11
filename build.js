// build.js — Génère dist/ avec CSS et JS minifiés
const esbuild = require("esbuild");
const fs = require("fs");
const path = require("path");

const DIST = "dist";

const CSS_FILES = [
  "css/variables.css",
  "css/base.css",
  "css/layout.css",
  "css/components.css",
  "css/animations.css",
  "css/effects.css",
  "css/components/world-map.css",
  "css/pages/home.css",
  "css/pages/about.css",
  "css/pages/projects.css",
  "css/pages/contact.css",
  "css/pages/project-detail.css",
];

const JS_FILES = [
  "js/main.js",
  "js/navigation.js",
  "js/scroll.js",
  "js/hover.js",
  "js/effects.js",
  "js/about.js",
  "js/projects.js",
  "js/contact.js",
  "js/home.js",
  "js/components/world-map.js",
  "js/components/world-map-advanced.js",
];

const HTML_FILES = [
  "index.html",
  "about.html",
  "projects.html",
  "contact.html",
  "projects/healthyfood.html",
  "projects/datacalc.html",
  "projects/mindful.html",
  "projects/fintech.html",
  "projects/ecotrack.html",
  "projects/artspace.html",
  "projects/jeyko-location.html",
  "projects/wara-secretariat.html",
  "projects/gaming-campus.html",
  "projects/elium.html",
  "projects/global-explorer.html",
  "projects/boxing-club.html",
  "projects/aura.html",
];

const STATIC_FILES = ["manifest.json", "robots.txt", "sitemap.xml"];
const STATIC_DIRS  = ["assets", "data"];

async function build() {
  // 1. Nettoyer et recréer dist/
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST);
  console.log("Cleaned dist/");

  // 2. Minifier CSS (structure préservée grâce à outbase)
  await esbuild.build({
    entryPoints: CSS_FILES,
    outbase: ".",
    outdir: DIST,
    minify: true,
    bundle: false,
    logLevel: "silent",
  });
  console.log(`Minified ${CSS_FILES.length} CSS files`);

  // 3. Minifier JS
  await esbuild.build({
    entryPoints: JS_FILES,
    outbase: ".",
    outdir: DIST,
    minify: true,
    bundle: false,
    target: ["es2017"],
    logLevel: "silent",
  });
  console.log(`Minified ${JS_FILES.length} JS files`);

  // 4. Copier les HTML
  HTML_FILES.forEach((file) => {
    const dest = path.join(DIST, file);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(file, dest);
  });
  console.log(`Copied ${HTML_FILES.length} HTML files`);

  // 5. Copier les dossiers statiques (assets/, data/)
  STATIC_DIRS.forEach((dir) => {
    if (fs.existsSync(dir)) {
      fs.cpSync(dir, path.join(DIST, dir), { recursive: true });
    }
  });

  // 6. Copier les fichiers statiques racine
  STATIC_FILES.forEach((file) => {
    if (fs.existsSync(file)) {
      fs.copyFileSync(file, path.join(DIST, file));
    }
  });
  console.log("Copied static assets");

  // 7. Rapport de taille
  const sizes = await getSizes();
  console.log("\nBuild complete → dist/");
  console.log(`  CSS  : ${sizes.srcCss} KB → ${sizes.distCss} KB  (${sizes.cssSaving}% saved)`);
  console.log(`  JS   : ${sizes.srcJs} KB → ${sizes.distJs} KB  (${sizes.jsSaving}% saved)`);
}

async function getSizes() {
  const kb = (files) =>
    Math.round(
      files
        .filter((f) => fs.existsSync(f))
        .reduce((acc, f) => acc + fs.statSync(f).size, 0) / 1024
    );

  const distCssFiles = CSS_FILES.map((f) => path.join(DIST, f));
  const distJsFiles  = JS_FILES.map((f) => path.join(DIST, f));

  const srcCss  = kb(CSS_FILES);
  const distCss = kb(distCssFiles);
  const srcJs   = kb(JS_FILES);
  const distJs  = kb(distJsFiles);

  return {
    srcCss,  distCss,  cssSaving: Math.round((1 - distCss / srcCss) * 100),
    srcJs,   distJs,   jsSaving:  Math.round((1 - distJs / srcJs)  * 100),
  };
}

build().catch((e) => {
  console.error("Build failed:", e.message);
  process.exit(1);
});
