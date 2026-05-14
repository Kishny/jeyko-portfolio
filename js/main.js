// =========================================================
// main.js — Initialisation globale du site
// Projet : Jeyko.dev Portfolio
//
// Rôle :
// - Retirer la classe no-js
// - Smooth scroll pour les liens d’ancre
// - Détection automatique du lien actif dans la navigation
//
// Corrections importantes :
// - Sécurité si un lien ou une cible n’existe pas
// - Évite les erreurs JS silencieuses
// =========================================================

// Retire la classe no-js dès que JavaScript est disponible.
document.documentElement.classList.remove("no-js");

document.addEventListener("DOMContentLoaded", () => {
  // =========================================================
  // 1. Smooth scroll pour les liens ancres internes
  // Exemple : href="#projects"
  // =========================================================

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const href = anchor.getAttribute("href");

      // Ignore les ancres vides ou invalides.
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

  // =========================================================
  // 2. Lien actif dans la navigation
  // =========================================================

  const currentPage = location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll(".nav-link").forEach((link) => {
    const href = link.getAttribute("href");

    if (!href) return;

    const linkPage = href.split("/").pop();

    if (linkPage === currentPage) {
      link.classList.add("active");
    }
  });
});
