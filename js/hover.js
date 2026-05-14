// =========================================================
// hover.js — Effets 3D et magnétiques
// Projet : Jeyko.dev Portfolio
//
// Rôle :
// - Tilt 3D léger sur certaines cartes
// - Effet magnétique sur les boutons
//
// Corrections importantes :
// - Désactivation sur mobile / tactile
// - Désactivation si l’utilisateur préfère moins d’animations
// - Aucun transform appliqué au body
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
  // Respect de l’accessibilité : pas d’animation si demandé par l’utilisateur.
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) return;

  // Sur mobile / tactile, ces effets peuvent gêner ou créer des bugs visuels.
  const isTouchDevice =
    window.matchMedia("(hover: none)").matches ||
    window.matchMedia("(pointer: coarse)").matches ||
    window.innerWidth <= 768;

  if (isTouchDevice) return;

  // =========================================================
  // 1. Tilt 3D sur les cartes
  // =========================================================

  const tiltTargets = document.querySelectorAll(
    ".project-card, .feature-card, .info-card, .process-card, .faq-card"
  );

  tiltTargets.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) / (rect.width / 2);
      const deltaY = (e.clientY - centerY) / (rect.height / 2);

      card.style.transform = `
        perspective(800px)
        rotateX(${-deltaY * 4}deg)
        rotateY(${deltaX * 4}deg)
        translateZ(4px)
      `;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  // =========================================================
  // 2. Effet magnétique sur les boutons principaux
  // =========================================================

  const magnetTargets = document.querySelectorAll(".btn.primary, .btn.ghost");

  magnetTargets.forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();

      const deltaX = e.clientX - (rect.left + rect.width / 2);
      const deltaY = e.clientY - (rect.top + rect.height / 2);

      btn.style.transform = `translate(${deltaX * 0.15}px, ${
        deltaY * 0.15
      }px)`;
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
    });
  });
});
