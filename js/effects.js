// effects.js - Effets premium interactifs

class PremiumEffects {
  constructor() {
    this.initParticles();
    this.initCustomCursor();
    this.initLoadingScreen();
    this.initMorphingShapes();
  }

  // 1. Système de particules
  initParticles() {
    const container = document.querySelector(".particles-container");
    if (!container) return;

    const particleCount = window.innerWidth < 768 ? 15 : 30;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";

      // Position aléatoire
      const size = Math.random() * 100 + 50;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${Math.random() * 100}vw`;
      particle.style.top = `${Math.random() * 100}vh`;

      // Animation delay
      particle.style.animationDelay = `${Math.random() * 20}s`;
      particle.style.animationDuration = `${Math.random() * 20 + 20}s`;

      container.appendChild(particle);
    }
  }

  // 2. Curseur personnalisé
  initCustomCursor() {
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

    // Elements avec effet hover
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

    // Animation loop
    const animateCursor = () => {
      // Interpolation pour effet fluide
      dotX += (mouseX - dotX) * 0.15;
      dotY += (mouseY - dotY) * 0.15;

      outlineX += (mouseX - outlineX) * 0.1;
      outlineY += (mouseY - outlineY) * 0.1;

      // Appliquer les transformations
      cursorDot.style.transform = `translate(${dotX}px, ${dotY}px)`;
      cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px) scale(${scale})`;

      requestAnimationFrame(animateCursor);
    };

    animateCursor();
  }

  // 3. Écran de chargement
  initLoadingScreen() {
    const loadingScreen = document.querySelector(".loading-screen");

    window.addEventListener("load", () => {
      setTimeout(() => {
        loadingScreen.classList.add("loaded");

        // Supprimer l'écran de chargement après l'animation
        setTimeout(() => {
          loadingScreen.style.display = "none";
        }, 600);
      }, 1000);
    });
  }

  // 4. Formes morphing pour le CTA
  initMorphingShapes() {
    const ctaSection = document.querySelector(".cta");
    if (!ctaSection) return;

    const shapesContainer = document.querySelector(".cta-shapes");
    if (!shapesContainer) return;

    const shapeCount = 3;
    const colors = [
      "rgba(142, 122, 181, 0.1)",
      "rgba(0, 224, 255, 0.1)",
      "rgba(255, 107, 107, 0.1)",
    ];

    for (let i = 0; i < shapeCount; i++) {
      const shape = document.createElement("div");
      shape.className = `shape shape-${i + 1} morphing-shape`;

      // Style aléatoire
      shape.style.width = `${Math.random() * 200 + 100}px`;
      shape.style.height = `${Math.random() * 200 + 100}px`;
      shape.style.background = colors[i];
      shape.style.left = `${Math.random() * 80 + 10}%`;
      shape.style.top = `${Math.random() * 80 + 10}%`;
      shape.style.animationDelay = `${i * 2}s`;

      shapesContainer.appendChild(shape);
    }
  }

  // 5. Effet de défilement fluide
  initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });
  }

  // 6. Effet de révélation avancé
  initAdvancedReveal() {
    const revealElements = document.querySelectorAll(".reveal-text");

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");

            // Effet de délai pour les enfants
            const children = entry.target.querySelectorAll(".reveal-child");
            children.forEach((child, index) => {
              child.style.transitionDelay = `${index * 0.1}s`;
              child.classList.add("visible");
            });
          }
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

// Initialiser les effets quand le DOM est chargé
document.addEventListener("DOMContentLoaded", () => {
  const effects = new PremiumEffects();
  effects.initSmoothScroll();
  effects.initAdvancedReveal();
});

// Effet de parallaxe léger
document.addEventListener("mousemove", (e) => {
  const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
  const moveY = (e.clientY - window.innerHeight / 2) * 0.01;

  document.querySelectorAll(".parallax-layer").forEach((layer, index) => {
    const depth = (index + 1) * 0.5;
    layer.style.transform = `translate(${moveX * depth}px, ${moveY * depth}px)`;
  });
});

// Effet de vibration au scroll
let lastScroll = 0;
const scrollVibration = () => {
  const currentScroll = window.pageYOffset;
  const scrollDiff = currentScroll - lastScroll;

  if (Math.abs(scrollDiff) > 5) {
    document.body.style.transform = `translateX(${
      Math.sin(currentScroll * 0.01) * 2
    }px)`;
  }

  lastScroll = currentScroll;
  requestAnimationFrame(scrollVibration);
};

scrollVibration();

// Effet de dégradé animé sur le header
const animateHeaderGradient = () => {
  const header = document.querySelector(".site-header");
  if (!header) return;

  let hue = 0;
  setInterval(() => {
    hue = (hue + 1) % 360;
    header.style.borderBottomColor = `hsl(${hue}, 70%, 50%)`;
  }, 100);
};

// Initialiser après le chargement
window.addEventListener("load", animateHeaderGradient);
