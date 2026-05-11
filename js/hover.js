// hover.js — Effets 3D et magnétiques sur les éléments interactifs

document.addEventListener("DOMContentLoaded", () => {
  // Ignore si l'utilisateur préfère moins de mouvement
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // ── Tilt 3D sur les cartes ──────────────────────────────────────────────────
  const tiltTargets = document.querySelectorAll(
    ".project-card, .feature-card, .info-card, .process-card, .faq-card"
  );

  tiltTargets.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);

      card.style.transform = `perspective(800px) rotateX(${-dy * 4}deg) rotateY(${dx * 4}deg) translateZ(4px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  // ── Effet magnétique sur les boutons principaux ─────────────────────────────
  const magnetTargets = document.querySelectorAll(".btn.primary, .btn.ghost");

  magnetTargets.forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);

      btn.style.transform = `translate(${dx * 0.15}px, ${dy * 0.15}px)`;
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
    });
  });
});
