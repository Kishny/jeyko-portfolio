// projects.js - Gestion premium des projets

class ProjectsManager {
  constructor() {
    this.projectsGrid = document.getElementById("projects-grid");
    this.filterButtons = document.querySelectorAll(".filter-btn");
    this.searchInput = document.querySelector(".search-input");
    this.loadMoreBtn = document.getElementById("load-more");
    this.projects = [];
    this.filteredProjects = [];
    this.currentFilter = "all";
    this.currentSearch = "";
    this.page = 1;
    this.loading = false;

    this.init();
  }

  init() {
    this.loadProjects();
    this.setupEventListeners();
    this.setupMouseEffects();
    this.setupCounterAnimations();
    this.setupLazyLoading();
  }

  // Charger les projets (simuler depuis JSON)
  async loadProjects() {
    try {
      this.setLoading(true);

      const response = await fetch("data/projects.json");
      const data = await response.json();

      this.projects = data.projects.sort((a, b) => parseInt(b.year) - parseInt(a.year));
      this.filteredProjects = [...this.projects];

      this.updateProjectsCounter(this.projects.length);
      this.renderProjects();
      this.setLoading(false);
    } catch (error) {
      console.error("Erreur de chargement des projets:", error);
      this.showError();
    }
  }

  // Setup des événements
  setupEventListeners() {
    // Filtres
    this.filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.filterButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        this.currentFilter = btn.dataset.filter;
        this.applyFilters();
      });
    });

    // Recherche
    this.searchInput.addEventListener("input", (e) => {
      this.currentSearch = e.target.value.toLowerCase();
      this.applyFilters();
    });

    // Load more
    if (this.loadMoreBtn) {
      this.loadMoreBtn.addEventListener("click", () => this.loadMoreProjects());
    }

    // Effets de survol avancés
    document.querySelectorAll(".project-card").forEach((card) => {
      card.addEventListener("mousemove", this.handleMouseMove.bind(this));
    });

    // Scroll animations
    this.setupScrollAnimations();
  }

  // Effets de souris avancés
  setupMouseEffects() {
    const cards = document.querySelectorAll(".project-card");

    cards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const glow = card.querySelector(".project-glow");
        if (glow) {
          glow.style.setProperty("--mouse-x", `${(x / rect.width) * 100}%`);
          glow.style.setProperty("--mouse-y", `${(y / rect.height) * 100}%`);
        }
      });
    });
  }

  // Animation des compteurs
  setupCounterAnimations() {
    const counters = document.querySelectorAll(".stat-number");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animateCounter(entry.target, parseInt(entry.target.dataset.count));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((counter) => observer.observe(counter));
  }

  animateCounter(el, target) {
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current);
      }
    }, 16);
  }

  // Mettre à jour le compteur "Projets réalisés" dynamiquement
  updateProjectsCounter(count) {
    const stats = document.querySelectorAll(".stat");
    stats.forEach((stat) => {
      const label = stat.querySelector(".stat-label");
      if (label && label.textContent.includes("Projets")) {
        const counter = stat.querySelector(".stat-number");
        if (counter) {
          counter.dataset.count = count;
          this.animateCounter(counter, count);
        }
      }
    });
  }

  // Lazy loading des images
  setupLazyLoading() {
    const images = document.querySelectorAll('.project-image[loading="lazy"]');

    const imageObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.add("loaded");
            observer.unobserve(img);
          }
        });
      },
      { rootMargin: "50px" }
    );

    images.forEach((img) => imageObserver.observe(img));
  }

  // Appliquer les filtres
  applyFilters() {
    this.filteredProjects = this.projects.filter((project) => {
      // Filtre par catégorie
      const categoryMatch =
        this.currentFilter === "all" ||
        project.categories.includes(this.currentFilter);

      // Filtre par recherche
      const searchMatch =
        !this.currentSearch ||
        project.title.toLowerCase().includes(this.currentSearch) ||
        project.description.toLowerCase().includes(this.currentSearch) ||
        project.tags.some((tag) =>
          tag.toLowerCase().includes(this.currentSearch)
        );

      return categoryMatch && searchMatch;
    });

    this.renderProjects();
    this.updateResultsCount();
  }

  // Afficher les projets
  renderProjects() {
    if (!this.projectsGrid) return;

    this.projectsGrid.innerHTML = "";

    if (this.filteredProjects.length === 0) {
      this.showNoResults();
      return;
    }

    // Afficher les projets visibles (pagination)
    const visibleProjects = this.filteredProjects.slice(0, this.page * 6);

    visibleProjects.forEach((project, index) => {
      const card = this.createProjectCard(project, index);
      this.projectsGrid.appendChild(card);
    });

    // Afficher/masquer le bouton Load More
    if (this.loadMoreBtn) {
      this.loadMoreBtn.style.display =
        visibleProjects.length < this.filteredProjects.length
          ? "block"
          : "none";
    }

    // Réappliquer les effets et observer les nouvelles cartes
    setTimeout(() => {
      this.setupMouseEffects();
      this.setupLazyLoading();

      // Les cartes sont injectées après le fetch : l'observer de scroll.js
      // ne les a jamais vues. On crée un observer dédié pour les rendre visibles.
      const newCards = this.projectsGrid.querySelectorAll(".project-card.reveal:not(.visible)");
      const cardObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              cardObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08 }
      );
      newCards.forEach((card) => cardObserver.observe(card));
    }, 100);
  }

  // Créer une carte de projet
  createProjectCard(project, index) {
    const card = document.createElement("article");
    card.className = "project-card reveal";
    card.dataset.category = project.categories.join(" ");
    card.dataset.cursor = "hover";
    card.style.animationDelay = `${index * 0.1}s`;

    // Structure HTML de la carte
    card.innerHTML = `
            <div class="project-badge">
                <span class="badge-text">${project.badge}</span>
                <div class="badge-glow"></div>
            </div>
            
            <div class="project-media">
                <div class="project-image-wrapper">
                    <img 
                        src="${project.image}" 
                        alt="${project.title}"
                        class="project-image"
                        loading="lazy"
                    />
                    <div class="project-overlay">
                        <div class="overlay-content">
                            <span class="view-project">Découvrir le projet →</span>
                            <div class="project-links">
                                ${
                                  project.demo
                                    ? `
                                <a href="${project.demo}" class="project-link" aria-label="Voir la démo" target="_blank" rel="noopener">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                                        <polyline points="15 3 21 3 21 9"/>
                                        <line x1="10" y1="14" x2="21" y2="3"/>
                                    </svg>
                                </a>
                                `
                                    : ""
                                }
                                ${
                                  project.github
                                    ? `
                                <a href="${project.github}" class="project-link" aria-label="Voir le code source" target="_blank" rel="noopener">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                                    </svg>
                                </a>
                                `
                                    : ""
                                }
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="project-tags">
                    ${project.tags
                      .map((tag) => `<span class="tag">${tag}</span>`)
                      .join("")}
                </div>
            </div>

            <div class="project-content">
                <div class="project-header">
                    <h3 class="project-title">${project.title}</h3>
                    <span class="project-year">${project.year}</span>
                </div>
                
                <p class="project-description">${project.description}</p>

                <div class="project-meta">
                    <div class="meta-item">
                        <span class="meta-label">Client</span>
                        <span class="meta-value">${project.client}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Durée</span>
                        <span class="meta-value">${project.duration}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Stack</span>
                        <span class="meta-value">${project.stack}</span>
                    </div>
                </div>

                <a href="${
                  project.link
                }" class="project-btn" data-cursor="hover">
                    <span class="btn-text">Explorer le projet</span>
                    <span class="btn-arrow">→</span>
                    <div class="btn-shine"></div>
                </a>
            </div>
            
            <div class="project-glow"></div>
        `;

    return card;
  }

  // Charger plus de projets
  loadMoreProjects() {
    if (this.loading) return;

    this.page++;
    this.setLoading(true);

    // Simuler un chargement asynchrone
    setTimeout(() => {
      this.renderProjects();
      this.setLoading(false);

      // Animation de scroll doux vers les nouveaux projets
      const newProjects = document.querySelectorAll(".project-card");
      if (newProjects.length > 0) {
        const lastProject = newProjects[newProjects.length - 1];
        lastProject.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, 800);
  }

  // Mettre à jour le compteur de résultats
  updateResultsCount() {
    const countElement = document.querySelector(".results-count");
    if (countElement) {
      countElement.textContent = `${this.filteredProjects.length} projets`;
    }
  }

  // Afficher "aucun résultat"
  showNoResults() {
    this.projectsGrid.innerHTML = `
            <div class="no-results">
                <h3 class="no-results-title">Aucun projet trouvé</h3>
                <p class="no-results-description">
                    Essayez avec d'autres mots-clés ou une autre catégorie.
                </p>
                <button class="btn ghost reset-filters">
                    Réinitialiser les filtres
                </button>
            </div>
        `;

    // Bouton reset
    const resetBtn = this.projectsGrid.querySelector(".reset-filters");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        this.currentFilter = "all";
        this.currentSearch = "";
        this.searchInput.value = "";
        this.filterButtons.forEach((btn) => {
          btn.classList.toggle("active", btn.dataset.filter === "all");
        });
        this.applyFilters();
      });
    }
  }

  // Afficher une erreur
  showError() {
    if (this.projectsGrid) {
      this.projectsGrid.innerHTML = `
                <div class="no-results">
                    <h3 class="no-results-title">Erreur de chargement</h3>
                    <p class="no-results-description">
                        Impossible de charger les projets. Veuillez réessayer.
                    </p>
                    <button class="btn ghost retry-loading">
                        Réessayer
                    </button>
                </div>
            `;

      const retryBtn = this.projectsGrid.querySelector(".retry-loading");
      if (retryBtn) {
        retryBtn.addEventListener("click", () => this.loadProjects());
      }
    }
  }

  // Gérer l'état de chargement
  setLoading(isLoading) {
    this.loading = isLoading;

    if (this.loadMoreBtn) {
      if (isLoading) {
        this.loadMoreBtn.classList.add("loading");
        this.loadMoreBtn.disabled = true;
        this.loadMoreBtn.innerHTML = `
                    <span class="btn-text">Chargement...</span>
                    <div class="loading-spinner mini"></div>
                `;
      } else {
        this.loadMoreBtn.classList.remove("loading");
        this.loadMoreBtn.disabled = false;
        this.loadMoreBtn.innerHTML = `
                    <span class="btn-text">Charger plus de projets</span>
                    <span class="btn-arrow">↓</span>
                `;
      }
    }
  }

  // Animations au scroll
  setupScrollAnimations() {
    const revealElements = document.querySelectorAll(".reveal");

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");

            // Animation en cascade pour les cartes
            if (entry.target.classList.contains("project-card")) {
              const delay = parseFloat(
                entry.target.style.animationDelay || "0"
              );
              entry.target.style.transitionDelay = `${delay}s`;
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  }

  // Gestion du mouvement de souris
  handleMouseMove(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  }
}

// Initialiser quand le DOM est chargé
document.addEventListener("DOMContentLoaded", () => {
  window.projectsManager = new ProjectsManager();
});

// Export pour les modules ES6
if (typeof module !== "undefined" && module.exports) {
  module.exports = ProjectsManager;
}

// =========================================================
// Accordéon mobile pour les cards projets
// - Ajoute automatiquement un bouton de dépliage à chaque carte
// - Sur mobile, une seule carte peut rester ouverte à la fois
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
  const setupProjectAccordions = () => {
    const projectCards = document.querySelectorAll(".project-card");

    projectCards.forEach((card, index) => {
      // Évite de créer plusieurs fois le bouton si le script se relance
      if (card.querySelector(".project-accordion-trigger")) return;

      const titleElement = card.querySelector(".project-title");
      const mediaElement = card.querySelector(".project-media");

      if (!titleElement || !mediaElement) return;

      const title = titleElement.textContent.trim() || "Voir le projet";

      const trigger = document.createElement("button");
      trigger.className = "project-accordion-trigger";
      trigger.type = "button";
      trigger.setAttribute("aria-expanded", "false");

      trigger.innerHTML = `
        <span class="project-accordion-title">${title}</span>
        <span class="project-accordion-icon">+</span>
      `;

      // On place le bouton juste après l'image
      mediaElement.insertAdjacentElement("afterend", trigger);

      // Option : première carte ouverte par défaut sur mobile
      if (index === 0 && window.innerWidth <= 768) {
        card.classList.add("open");
        trigger.setAttribute("aria-expanded", "true");
      }

      trigger.addEventListener("click", () => {
        const isOpen = card.classList.contains("open");

        // Ferme les autres cards sur mobile pour garder une page compacte
        if (window.innerWidth <= 768) {
          projectCards.forEach((otherCard) => {
            if (otherCard !== card) {
              otherCard.classList.remove("open");

              const otherTrigger = otherCard.querySelector(
                ".project-accordion-trigger"
              );

              if (otherTrigger) {
                otherTrigger.setAttribute("aria-expanded", "false");
              }
            }
          });
        }

        card.classList.toggle("open", !isOpen);
        trigger.setAttribute("aria-expanded", String(!isOpen));
      });
    });
  };

  setupProjectAccordions();

  // Si tes projets sont injectés dynamiquement après chargement,
  // on relance une fois après un court délai.
  setTimeout(setupProjectAccordions, 500);
});
