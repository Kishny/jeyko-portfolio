// about-accordion.js — Accordéons mobiles pour la page À propos

document.addEventListener("DOMContentLoaded", () => {
    const mobileQuery = window.matchMedia("(max-width: 768px)");
  
    const accordionSelectors = [
      ".philosophy-card",
      ".timeline-content",
      ".expertise-card",
      ".stack-category",
      ".process-step",
      ".commitment-card",
    ];
  
    const getCardTitle = (card) => {
      const title =
        card.querySelector("h3") ||
        card.querySelector(".timeline-title") ||
        card.querySelector(".category-title") ||
        card.querySelector(".step-number");
  
      return title ? title.textContent.trim() : "Voir le détail";
    };
  
    const createAccordion = () => {
      if (!mobileQuery.matches) return;
  
      const cards = document.querySelectorAll(accordionSelectors.join(","));
  
      cards.forEach((card, index) => {
        if (card.classList.contains("about-accordion-ready")) return;
  
        card.classList.add("about-accordion-card", "about-accordion-ready");
  
        const titleText = getCardTitle(card);
  
        const trigger = document.createElement("button");
        trigger.className = "about-accordion-trigger";
        trigger.type = "button";
        trigger.setAttribute("aria-expanded", "false");
  
        trigger.innerHTML = `
          <span class="about-accordion-title">${titleText}</span>
          <span class="about-accordion-icon">+</span>
        `;
  
        const content = document.createElement("div");
        content.className = "about-accordion-content";
  
        while (card.firstChild) {
          content.appendChild(card.firstChild);
        }
  
        card.appendChild(trigger);
        card.appendChild(content);
  
        trigger.addEventListener("click", () => {
          const isOpen = card.classList.contains("open");
  
          card.classList.toggle("open", !isOpen);
          trigger.setAttribute("aria-expanded", String(!isOpen));
        });
  
        // Ouvre seulement la première carte de chaque grande section pour donner un aperçu.
        const shouldOpenByDefault =
          card.matches(".philosophy-card:first-child") ||
          card.matches(".expertise-card:first-child") ||
          card.matches(".stack-category:first-child") ||
          card.matches(".process-step:first-child") ||
          card.matches(".commitment-card:first-child");
  
        if (shouldOpenByDefault) {
          card.classList.add("open");
          trigger.setAttribute("aria-expanded", "true");
        }
      });
    };
  
    createAccordion();
  
    window.addEventListener("resize", () => {
      createAccordion();
    });
  });