# CLAUDE.md — Portfolio Jeyko.dev

Portfolio de Jean Volcy (Jeyko.dev), développeur web & mobile freelance à Tours.
Site en ligne : https://jeyko.dev — hébergé sur Vercel (projet `portfolio`).
Langue du site et des échanges : **français**.

## Stack

- Site **statique** : HTML + CSS + JavaScript vanilla, aucun framework.
- Build : `build.js` (esbuild) minifie CSS/JS et copie HTML + `assets/` + `data/` dans `dist/`.
- Design « Piste E » (refonte de septembre 2026) : fond blanc, textes marron, accent rouge, petits
  dégradés rouge → marron sur les mots en italique. Maquettes : artefact « Portfolio Jeyko.dev — Refonte ».
- Polices (Google Fonts) : Instrument Serif (titres), Geist (texte), JetBrains Mono (libellés).
- Icônes : Font Awesome 6.4 (CDN cdnjs), chargé uniquement sur les pages projet.
- Logo : `assets/images/jeyko-logo-256.webp` (menu, pied de page) et `jeyko-emblem.webp` (accueil, À propos).
  On ne modifie pas le logo.

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
css/site.css                  # TOUT le style : tokens (couleurs, polices), composants, pages, responsive
js/site.js                    # menu mobile, apparitions, projets (accueil + Réalisations), formulaire de contact
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
   et adapter : `<title>`, meta description / OG / Twitter / canonical, badge, année, titre (`<span class="highlight">`
   pour la partie en italique rouge), tags, boutons démo, bloc `pd-overview`, image, « À propos »,
   fonctionnalités (`.features`, ajouter `features--2` s'il y en a 4), défi/solution, stack.
   Laisser le bloc `<nav class="pd-nav">` : il est régénéré.
4. **`npm run sync`** : met à jour la navigation précédent/suivant, `HTML_FILES` dans `build.js`,
   les URLs projets de `sitemap.xml` et les cartes projets écrites en dur dans `projects.html` / `index.html`
   (entre `<!-- projets:debut -->` et `<!-- projets:fin -->`, pour que Google voie les liens sans JavaScript).
5. Vérifier en local (`npm run dev`) : page Projets, filtres, accueil, page de détail.
6. Rien d'autre : les compteurs « projets livrés » (`data-project-total`) et l'accueil (3 projets les plus récents)
   se mettent à jour tout seuls depuis le JSON.

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

## Formulaire de contact

`js/site.js` → objet `EMAILJS` : tant que les 3 clés EmailJS sont vides, l'envoi ouvre la messagerie du
visiteur (mailto pré-rempli vers contact.jeyko.dev@gmail.com). Renseigner les clés pour un envoi direct.

## SEO

- Pages retirées : ajouter une redirection 301 dans `vercel.json` (`redirects`) vers `/projects.html`.
- `privacy.html` est en `noindex`. L'accueil contient des données structurées JSON-LD (ProfessionalService).
- Après une mise en ligne importante : Search Console → Sitemaps → renvoyer `sitemap.xml`, et « Demander l'indexation »
  pour l'accueil, Réalisations, Tarifs et les nouvelles pages projet.
