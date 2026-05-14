// =========================================================
// effects.js — Effets premium interactifs
// Projet : Jeyko.dev Portfolio
//
// Rôle :
// - Particules décoratives
// - Curseur personnalisé desktop
// - Écran de chargement
// - Formes morphing du CTA
// - Smooth scroll interne
// - Révélation avancée
// - Parallaxe légère
// - Animation subtile du header
//
// Corrections importantes :
// - Suppression définitive du transform sur body
// - Désactivation des effets lourds sur mobile
// - Particules limitées sur mobile
// - Aucun effet ne doit créer de scroll horizontal
// =========================================================

class PremiumEffects {
  constructor() {
    this.isMobile = window.innerWidth <= 768;
    this.isTouchDevice =
      window.matchMedia("(hover: none)").matches ||
      window.matchMedia("(pointer: coarse)").matches;

    this.prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    this.initParticles();
    this.initCustomCursor();
    this.initLoadingScreen();
    this.initMorphingShapes();
  }

  // =========================================================
  // 1. Système de particules
  // =========================================================

  initParticles() {
    const container = document.querySelector(".particles-container");
    if (!container) return;

    // On nettoie au cas où le script serait relancé.
    container.innerHTML = "";

    // Sur mobile, les particules peuvent créer des débordements.
    // On les réduit fortement, voire on peut les désactiver si besoin.
    const particleCount = this.isMobile ? 6 : 30;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";

      const size = this.isMobile
        ? Math.random() * 40 + 20
        : Math.random() * 100 + 50;

      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;

      // Important :
      // On évite 100vw exact + grosse taille, car ça peut dépasser du viewport.
      particle.style.left = `${Math.random() * 90}vw`;
      particle.style.top = `${Math.random() * 90}vh`;

      particle.style.animationDelay = `${Math.random() * 20}s`;
      particle.style.animationDuration = `${Math.random() * 20 + 20}s`;

      container.appendChild(particle);
    }
  }

  // =========================================================
  // 2. Curseur personnalisé
  // =========================================================

  initCustomCursor() {
    // Pas de curseur custom sur mobile / tablette tactile.
    if (this.isMobile || this.isTouchDevice || this.prefersReducedMotion) {
      document.body.classList.remove("cursor-hover");
      return;
    }

    const cursorDot = document.querySelector(".cursor-dot");
    const cursorOutline = document.querySelector(".cursor-outline");

    if (!cursorDot || !cursorOutline) return;

    let mouseX = 0;
    let mouseY = 0;

    let dotX = 0;
    let dotY = 0;

    let outlineX = 0;
    let outlineY = 0;

    let scale = 1;

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const hoverElements = document.querySelectorAll('[data-cursor="hover"]');

    hoverElements.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        document.body.classList.add("cursor-hover");
        scale = 1.5;
      });

      el.addEventListener("mouseleave", () => {
        document.body.classList.remove("cursor-hover");
        scale = 1;
      });
    });

    const animateCursor = () => {
      dotX += (mouseX - dotX) * 0.15;
      dotY += (mouseY - dotY) * 0.15;

      outlineX += (mouseX - outlineX) * 0.1;
      outlineY += (mouseY - outlineY) * 0.1;

      cursorDot.style.transform = `translate(${dotX}px, ${dotY}px)`;
      cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px) scale(${scale})`;

      requestAnimationFrame(animateCursor);
    };

    animateCursor();
  }

  // =========================================================
  // 3. Écran de chargement
  // =========================================================

  initLoadingScreen() {
    const loadingScreen = document.querySelector(".loading-screen");
    if (!loadingScreen) return;

    window.addEventListener("load", () => {
      setTimeout(() => {
        loadingScreen.classList.add("loaded");

        setTimeout(() => {
          loadingScreen.style.display = "none";
        }, 600);
      }, 700);
    });
  }

  // =========================================================
  // 4. Formes morphing pour le CTA
  // =========================================================

  initMorphingShapes() {
    const ctaSection = document.querySelector(".cta");
    const shapesContainer = document.querySelector(".cta-shapes");

    if (!ctaSection || !shapesContainer) return;

    // On nettoie pour éviter les doublons.
    shapesContainer.innerHTML = "";

    const shapeCount = this.isMobile ? 2 : 3;

    const colors = [
      "rgba(142, 122, 181, 0.1)",
      "rgba(0, 224, 255, 0.1)",
      "rgba(255, 107, 107, 0.1)",
    ];

    for (let i = 0; i < shapeCount; i++) {
      const shape = document.createElement("div");
      shape.className = `shape shape-${i + 1} morphing-shape`;

      const size = this.isMobile
        ? Math.random() * 90 + 70
        : Math.random() * 200 + 100;

      shape.style.width = `${size}px`;
      shape.style.height = `${size}px`;
      shape.style.background = colors[i];

      // On limite la position pour éviter les débordements horizontaux.
      shape.style.left = `${Math.random() * 65 + 10}%`;
      shape.style.top = `${Math.random() * 70 + 10}%`;

      shape.style.animationDelay = `${i * 2}s`;

      shapesContainer.appendChild(shape);
    }
  }

  // =========================================================
  // 5. Smooth scroll interne
  // =========================================================

  initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const href = this.getAttribute("href");

        if (!href || href === "#") return;

        const target = document.querySelector(href);

        if (!target) return;

        e.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    });
  }

  // =========================================================
  // 6. Révélation avancée
  // =========================================================

  initAdvancedReveal() {
    const revealElements = document.querySelectorAll(".reveal-text");

    if (!revealElements.length) return;

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("visible");

          const children = entry.target.querySelectorAll(".reveal-child");

          children.forEach((child, index) => {
            child.style.transitionDelay = `${index * 0.1}s`;
            child.classList.add("visible");
          });
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  }
}

// =========================================================
// Initialisation principale
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
  const effects = new PremiumEffects();

  effects.initSmoothScroll();
  effects.initAdvancedReveal();

  initParallaxEffect();
});

// =========================================================
// 7. Parallaxe légère
// Important :
// - Pas de parallaxe sur mobile
// - Aucun transform sur body
// =========================================================

function initParallaxEffect() {
  const isMobile =
    window.innerWidth <= 768 ||
    window.matchMedia("(hover: none)").matches ||
    window.matchMedia("(pointer: coarse)").matches;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (isMobile || prefersReducedMotion) return;

  document.addEventListener("mousemove", (e) => {
    const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
    const moveY = (e.clientY - window.innerHeight / 2) * 0.01;

    document.querySelectorAll(".parallax-layer").forEach((layer, index) => {
      const depth = (index + 1) * 0.5;

      layer.style.transform = `translate(${moveX * depth}px, ${
        moveY * depth
      }px)`;
    });
  });
}

// =========================================================
// 8. Ancien effet de vibration au scroll — supprimé
// =========================================================
//
// Ancien code problématique :
//
// document.body.style.transform = `translateX(...)`;
//
// Ce code créait un débordement horizontal sur mobile.
// Le body ne doit JAMAIS recevoir de transform pour un effet décoratif.
// =========================================================


// =========================================================
// 9. Effet de dégradé animé sur le header
// =========================================================

function animateHeaderGradient() {
  const header = document.querySelector(".site-header");

  if (!header) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) return;

  let hue = 0;

  setInterval(() => {
    hue = (hue + 1) % 360;
    header.style.borderBottomColor = `hsl(${hue}, 70%, 50%)`;
  }, 140);
}

window.addEventListener("load", animateHeaderGradient);