// home.js — Chargement dynamique des projets en page d'accueil

async function loadHomeProjects() {
  const grid = document.querySelector(".projects-preview");
  if (!grid) return;

  try {
    const response = await fetch("data/projects.json");
    const data = await response.json();

    // Trier du plus récent au plus ancien, afficher les 2 premiers
    const projects = data.projects
      .sort((a, b) => parseInt(b.year) - parseInt(a.year))
      .slice(0, 2);

    grid.innerHTML = projects.map((p) => `
      <article class="project-card" data-cursor="hover">
        <div class="project-media">
          <div class="project-image-wrapper">
            <img
              src="${p.image}"
              alt="${p.title}"
              class="project-image"
              loading="lazy"
            />
            <div class="project-overlay">
              <a href="${p.link}" class="view-project" aria-label="Voir le projet ${p.title}">
                Voir le projet →
              </a>
            </div>
          </div>
          <div class="project-tags">
            ${p.tags.slice(0, 3).map((tag) => `<span class="tag">${tag}</span>`).join("")}
          </div>
        </div>
        <div class="project-content">
          <h3>${p.title}</h3>
          <p>${p.description}</p>
        </div>
        <a href="${p.link}" class="project-link" aria-label="Accéder au projet ${p.title}"></a>
      </article>
    `).join("");
  } catch (e) {
    console.error("Erreur chargement projets accueil :", e);
  }
}

document.addEventListener("DOMContentLoaded", loadHomeProjects);
