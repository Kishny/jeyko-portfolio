// main.js — Initialisation partagée

// Retire la classe no-js dès que ce script s'exécute
document.documentElement.classList.remove("no-js");

document.addEventListener("DOMContentLoaded", () => {
  // Smooth scroll pour tous les liens ancres internes
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Marque le lien de navigation actif selon l'URL courante
  const currentPage = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link").forEach((link) => {
    const href = link.getAttribute("href")?.split("/").pop();
    if (href === currentPage) {
      link.classList.add("active");
    }
  });
});
