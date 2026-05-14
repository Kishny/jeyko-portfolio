// about.js - Fonctionnalités premium pour la page "À Propos"

class AboutPageManager {
  constructor() {
    this.init();
  }

  init() {
    this.initCounterAnimations();
    this.initProgressBars();
    this.initTooltips();
    this.initTimelineAnimations();
    this.initScrollAnimations();
    this.initPortraitEffects();
    this.initStackHoverEffects();
  }

  // Animation des compteurs
  initCounterAnimations() {
    const counters = document.querySelectorAll(".stat-number");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const counter = entry.target;
            const target = parseInt(counter.dataset.count);
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const timer = setInterval(() => {
              current += step;
              if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
              } else {
                counter.textContent = Math.floor(current);
              }
            }, 16);

            observer.unobserve(counter);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((counter) => observer.observe(counter));
  }

  // Animation des barres de progression
  initProgressBars() {
    const progressItems = document.querySelectorAll(".progress-fill");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const fill = entry.target;
            const width = fill.dataset.width;

            setTimeout(() => {
              fill.style.width = `${width}%`;
            }, 300);

            observer.unobserve(fill);
          }
        });
      },
      { threshold: 0.3 }
    );

    progressItems.forEach((item) => observer.observe(item));
  }

  // Tooltips pour les technologies
  initTooltips() {
    const stackItems = document.querySelectorAll(".stack-item");

    stackItems.forEach((item) => {
      item.addEventListener("mouseenter", (e) => {
        const tooltip = item.getAttribute("data-tooltip");
        if (!tooltip) return;

        // Créer le tooltip s'il n'existe pas
        let tooltipEl = document.querySelector(".stack-tooltip");
        if (!tooltipEl) {
          tooltipEl = document.createElement("div");
          tooltipEl.className = "stack-tooltip";
          document.body.appendChild(tooltipEl);
        }

        tooltipEl.textContent = tooltip;
        tooltipEl.style.opacity = "1";

        // Positionner le tooltip
        const rect = item.getBoundingClientRect();
        tooltipEl.style.left = `${rect.left + rect.width / 2}px`;
        tooltipEl.style.top = `${rect.top - 10}px`;
        tooltipEl.style.transform = "translate(-50%, -100%)";
      });

      item.addEventListener("mouseleave", () => {
        const tooltipEl = document.querySelector(".stack-tooltip");
        if (tooltipEl) {
          tooltipEl.style.opacity = "0";
        }
      });
    });
  }

  // Animations de la timeline
  initTimelineAnimations() {
    const timelineItems = document.querySelectorAll(".timeline-item");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("visible");
            }, index * 200);
          }
        });
      },
      { threshold: 0.1 }
    );

    timelineItems.forEach((item) => observer.observe(item));
  }

  // Animations au scroll
  initScrollAnimations() {
    const revealElements = document.querySelectorAll(".reveal");

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");

            // Animation en cascade pour les cartes
            if (
              entry.target.classList.contains("philosophy-card") ||
              entry.target.classList.contains("expertise-card")
            ) {
              const delay =
                Array.from(revealElements).indexOf(entry.target) * 0.1;
              entry.target.style.transitionDelay = `${delay}s`;
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  }

  // Effets sur le portrait
  initPortraitEffects() {
    const portraitWrapper = document.querySelector(".portrait-wrapper");
    if (!portraitWrapper) return;

    portraitWrapper.addEventListener("mousemove", (e) => {
      const rect = portraitWrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const rotateY = (x / rect.width - 0.5) * 10;
      const rotateX = (y / rect.height - 0.5) * -10;

      portraitWrapper.style.transform = `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
    });

    portraitWrapper.addEventListener("mouseleave", () => {
      portraitWrapper.style.transform =
        "perspective(1000px) rotateY(-5deg) rotateX(5deg)";
    });
  }

  // Effets de survol sur les cartes stack
  initStackHoverEffects() {
    const stackCategories = document.querySelectorAll(".stack-category");

    stackCategories.forEach((category) => {
      category.addEventListener("mouseenter", () => {
        const items = category.querySelectorAll(".stack-item");
        items.forEach((item, index) => {
          setTimeout(() => {
            item.classList.add("hover");
          }, index * 50);
        });
      });

      category.addEventListener("mouseleave", () => {
        const items = category.querySelectorAll(".stack-item");
        items.forEach((item) => {
          item.classList.remove("hover");
        });
      });
    });
  }

  // Animation des orbites du portrait
  initOrbitAnimations() {
    const orbits = document.querySelectorAll(".orbit");

    orbits.forEach((orbit, index) => {
      orbit.style.animationDelay = `${index * 2}s`;
    });
  }

  // Effet de parallaxe léger
  initParallaxEffect() {
    const heroBackground = document.querySelector(".hero-background");
    if (!heroBackground) return;

    document.addEventListener("mousemove", (e) => {
      const moveX = (e.clientX / window.innerWidth - 0.5) * 20;
      const moveY = (e.clientY / window.innerHeight - 0.5) * 20;

      heroBackground.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
  }

  // Gestion des badges interactifs
  initInteractiveBadges() {
    const badges = document.querySelectorAll(".badge");

    badges.forEach((badge) => {
      badge.addEventListener("mouseenter", () => {
        const icon = badge.querySelector("i");
        if (icon) {
          icon.style.transform = "scale(1.2) rotate(10deg)";
          icon.style.transition = "transform 0.3s ease";
        }
      });

      badge.addEventListener("mouseleave", () => {
        const icon = badge.querySelector("i");
        if (icon) {
          icon.style.transform = "scale(1) rotate(0deg)";
        }
      });
    });
  }

  // Animation des icônes
  initIconsAnimations() {
    const icons = document.querySelectorAll(".card-icon i");

    icons.forEach((icon) => {
      icon.addEventListener("mouseenter", () => {
        icon.style.animation = "icon-bounce 0.5s ease";
      });

      icon.addEventListener("animationend", () => {
        icon.style.animation = "";
      });
    });
  }
}

// Initialiser quand le DOM est chargé
document.addEventListener("DOMContentLoaded", () => {
  const aboutPage = new AboutPageManager();

  // Ajouter des styles pour les animations
  const style = document.createElement("style");
  style.textContent = `
        @keyframes icon-bounce {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
        }
        
        .stack-tooltip {
            position: fixed;
            background: rgba(11, 13, 18, 0.95);
            color: var(--text-main);
            padding: 0.5rem 1rem;
            border-radius: var(--radius-sm);
            font-size: 0.75rem;
            pointer-events: none;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
            border: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            white-space: nowrap;
        }
        
        .timeline-item {
            opacity: 0;
            transform: translateX(-20px);
            transition: all 0.6s var(--ease);
        }
        
        .timeline-item.visible {
            opacity: 1;
            transform: translateX(0);
        }
        
        .stack-item.hover {
            transform: translateY(-5px) !important;
            background: rgba(142, 122, 181, 0.2) !important;
        }
    `;
  document.head.appendChild(style);

  // Initialiser les effets supplémentaires
  aboutPage.initOrbitAnimations();
  aboutPage.initParallaxEffect();
  aboutPage.initInteractiveBadges();
  aboutPage.initIconsAnimations();

  // Gestion du scroll indicator
  const scrollIndicator = document.querySelector(".scroll-indicator");
  if (scrollIndicator) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        scrollIndicator.style.opacity = "0";
        scrollIndicator.style.pointerEvents = "none";
      } else {
        scrollIndicator.style.opacity = "0.7";
        scrollIndicator.style.pointerEvents = "auto";
      }
    });

    scrollIndicator.addEventListener("click", () => {
      window.scrollTo({
        top: window.innerHeight,
        behavior: "smooth",
      });
    });
  }

  // Effet de glitch au survol des titres
  const glitchTexts = document.querySelectorAll(".glitch-text");
  glitchTexts.forEach((text) => {
    text.addEventListener("mouseenter", () => {
      text.classList.add("glitching");
      setTimeout(() => {
        text.classList.remove("glitching");
      }, 500);
    });
  });
});

// Export pour les modules ES6
if (typeof module !== "undefined" && module.exports) {
  module.exports = AboutPageManager;
}


