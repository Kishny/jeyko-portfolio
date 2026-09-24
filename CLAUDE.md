# CLAUDE.md — Portfolio Jeyko.dev

Portfolio de Jean Volcy (Jeyko.dev), développeur web & mobile freelance à Tours.
Site en ligne : https://jeyko.dev — hébergé sur Vercel (projet `portfolio`).
Langue du site et des échanges : **français**.

## Stack

- Site **statique** : HTML + CSS + JavaScript vanilla, aucun framework.
- Build : `build.js` (esbuild) minifie CSS/JS et copie HTML + `assets/` + `data/` dans `dist/`.
- Icônes : Font Awesome 6.4 (CDN cdnjs). Polices : Inter + Space Grotesk (Google Fonts).

## Commandes

```bash
npm run dev     # serveur local (npx serve .)
npm run sync    # synchronise nav précédent/suivant, build.js et sitemap depuis data/projects.json
npm run build   # sync + build → dist/
```

## Structure

```
index.html, projects.html, about.html, tarifs.html, contact.html, privacy.html
projects/<slug>.html          # une page de détail par projet (écrite à la main)
data/projects.json            # SOURCE DE VÉRITÉ des projets (cartes, accueil, compteur)
data/about-data.json
js/projects.js                # grille, filtres, recherche, « charger plus » (6 par page)
js/home.js                    # accueil : affiche les 2 projets les plus récents
css/pages/project-detail.css  # styles des pages de détail
assets/images/projects/       # captures des projets, en .webp
design/captures-originales/   # captures PNG d'origine (non déployées)
scripts/sync-projects.js      # script de synchronisation
docs/projets-a-construire.md  # projets retirés du site, à construire plus tard (EcoTrack, ArtSpace VR)
docs/archive/                 # anciennes pages retirées
```

## Ajouter un projet (checklist)

1. **Capture** : PNG plein écran → `design/captures-originales/<slug>.png`, puis version web
   `assets/images/projects/<slug>.webp` (1600 px de large, qualité ~80) :
   ```bash
   python3 -c "from PIL import Image;im=Image.open('design/captures-originales/X.png').convert('RGB');im.resize((1600,round(im.height*1600/im.width))).save('assets/images/projects/X.webp','WEBP',quality=80,method=6)"
   ```
   Pour une app mobile (capture portrait) : créer un visuel paysage 1600×900 avec le téléphone centré
   sur un fond dégradé aux couleurs de la marque (voir `ebenora-app.webp`), sinon la carte le recadre mal.
2. **Données** : ajouter une entrée dans `data/projects.json` (mêmes champs que les autres :
   `title, description, year, client, duration, stack, image, thumbnail, link, demo, github, badge,
   categories, tags, features, challenge, solution`). Le champ `id` est renuméroté par le script.
   - `categories` ∈ `web`, `mobile`, `uiux`, `fullstack` (ce sont les filtres de la page Projets).
   - Pour que le projet apparaisse en tête (et sur l'accueil), le placer en haut du fichier :
     le tri se fait par année décroissante, puis dans l'ordre du fichier.
3. **Page de détail** : copier une page récente (ex. `projects/planora.html`) vers `projects/<slug>.html`
   et adapter : `<title>`, meta description / OG / Twitter / canonical, badge, année, titre (`<span class="highlight">`),
   tags, liens démo, bloc overview, image, « À propos », fonctionnalités (icônes Font Awesome),
   défi/solution, stack. Laisser le bloc `<nav class="project-nav">` : il est régénéré.
4. **`npm run sync`** : met à jour la navigation précédent/suivant, `HTML_FILES` dans `build.js`
   et les URLs projets de `sitemap.xml`.
5. Vérifier en local (`npm run dev`) : page Projets, filtres, accueil, page de détail.
6. Mettre à jour le compteur statique « Projets réalisés » dans `about.html` (`data-count`) si besoin
   (celui de `projects.html` est mis à jour automatiquement par le JS).

## Retirer un projet

Supprimer l'entrée du JSON, déplacer la page dans `docs/archive/`, noter les infos utiles dans
`docs/projets-a-construire.md` si le projet doit revenir, puis `npm run sync`.

## Conventions

- Textes en français, ton professionnel et premium ; pas de faux chiffres ni de faux liens
  (`github` vide si le code n'est pas public).
- Images : toujours en `.webp` optimisé, jamais de PNG de plusieurs Mo dans `assets/`.
- Les captures sont affichées cadrées depuis le haut (`object-position: top center`).
- `dist/` et `.vercel` sont ignorés par git ; ne pas modifier `dist/` à la main.

## À corriger plus tard (données héritées du template)

Certaines anciennes entrées contiennent des infos incohérentes : HealthyFood (stack/défi d'un autre projet,
faux liens démo/GitHub), « Mode & Motion » (pointe vers `mindful.html`, page d'une app bien-être),
« Country App » (pointe vers `fintech.html`), Data Calculator (faux liens). Les projets sources sont dans
`~/Projects/healthyfood2`, `~/Projects/country app`, `~/Projects/data calculator`.
