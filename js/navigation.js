// =========================================================
// navigation.js — Navigation globale Jeyko.dev
//
// Rôle :
// - Effet header au scroll
// - Ouverture / fermeture du menu mobile
// - Ajout d'une classe body.nav-open pour gérer le menu en CSS
// - Fermeture du menu quand on clique sur un lien
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");
  const navLinks = document.querySelectorAll(".main-nav .nav-link");

  if (!header || !toggle || !nav) return;

  // Header scroll effect
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 20);
  });

  // Ouverture / fermeture du menu mobile
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");

    toggle.classList.toggle("open", isOpen);
    document.body.classList.toggle("nav-open", isOpen);

    toggle.setAttribute(
      "aria-label",
      isOpen ? "Fermer le menu" : "Ouvrir le menu"
    );

    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Ferme le menu quand on clique sur un lien
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.classList.remove("open");
      document.body.classList.remove("nav-open");

      toggle.setAttribute("aria-label", "Ouvrir le menu");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
});
