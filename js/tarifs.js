// tarifs.js — Accordéons mobile + effets cartes page tarifs

document.addEventListener("DOMContentLoaded", () => {
  initMobileAccordions();
  initPricingCardGlow();
});

function initMobileAccordions() {
  const sections = document.querySelectorAll(
    ".pricing-section, .maintenance-section"
  );

  sections.forEach((section) => {
    const accordions = section.querySelectorAll(".mobile-accordion");

    accordions.forEach((accordion, index) => {
      const trigger = accordion.querySelector(".pricing-accordion-trigger");
      const content = accordion.querySelector(".accordion-content");

      if (!trigger || !content) return;

      trigger.setAttribute("aria-expanded", "false");

      if (window.innerWidth <= 768 && index === 0) {
        accordion.classList.add("open");
        trigger.setAttribute("aria-expanded", "true");
      } else {
        accordion.classList.remove("open");
        trigger.setAttribute("aria-expanded", "false");
      }

      trigger.addEventListener("click", () => {
        if (window.innerWidth > 768) return;

        const isOpen = accordion.classList.contains("open");

        accordions.forEach((item) => {
          const itemTrigger = item.querySelector(".pricing-accordion-trigger");

          item.classList.remove("open");
          itemTrigger?.setAttribute("aria-expanded", "false");
        });

        if (!isOpen) {
          accordion.classList.add("open");
          trigger.setAttribute("aria-expanded", "true");
        }
      });
    });
  });
}

function initPricingCardGlow() {
  const cards = document.querySelectorAll(
    ".pricing-card, .maintenance-card, .tech-card"
  );

  cards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });
}