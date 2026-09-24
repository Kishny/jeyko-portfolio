/* Jeyko.dev — scripts communs (menu mobile, apparitions, projets, formulaire) */
(function () {
  "use strict";
  document.documentElement.classList.add("js");

  const ARROW =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>';

  /* ---------- Menu mobile ---------- */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  if (toggle && nav) {
    // Sur mobile, le bouton « Démarrer un projet » de l'en-tête est repris dans le menu
    const headerCta = document.querySelector(".header-cta");
    if (headerCta && !nav.querySelector(".nav__cta")) {
      const cta = headerCta.cloneNode(true);
      cta.className = "nav__cta";
      nav.appendChild(cta);
    }
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ---------- Apparition au scroll ---------- */
  const observer =
    "IntersectionObserver" in window
      ? new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
        )
      : null;
  function watch(root) {
    (root || document).querySelectorAll(".reveal:not(.is-visible)").forEach((el) => {
      if (observer) observer.observe(el);
      else el.classList.add("is-visible");
    });
  }
  watch();

  /* ---------- Projets ---------- */
  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const host = (url) => {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch (e) {
      return "";
    }
  };
  const byYear = (list) =>
    list.map((p, i) => ({ p, i })).sort((a, b) => parseInt(b.p.year) - parseInt(a.p.year) || a.i - b.i).map((x) => x.p);

  function projectCard(p, index, featured) {
    const num = String(index + 1).padStart(2, "0");
    const chips = String(p.stack || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, featured ? 5 : 3)
      .map((s) => `<span class="chip">${esc(s)}</span>`)
      .join("");
    const domain = host(p.demo);
    return `<a class="project${featured ? " project--featured" : ""} reveal" href="${esc(p.link)}">
  <div class="window">
    <div class="window__bar"><span><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>PRJ-${num} · ${esc(p.badge || "").toUpperCase()}</span>${domain ? `<span>${esc(domain)}</span>` : ""}</div>
    <div class="window__img"><img src="${esc(p.image)}" alt="Aperçu du projet ${esc(p.title)}" loading="lazy" decoding="async"></div>
  </div>
  <div class="project__head"><h3>${esc(p.title)}</h3><span class="project__year">${esc(p.year)}</span></div>
  <p class="project__desc">${esc(p.description)}</p>
  <div class="project__meta"><div class="chips">${chips}</div><span class="project__client">${esc(p.client)} · ${esc(p.duration)}</span></div>
</a>`;
  }

  async function loadProjects() {
    const base = document.body.dataset.base || "";
    const res = await fetch(base + "data/projects.json");
    const data = await res.json();
    return byYear(data.projects);
  }

  // Accueil : 3 projets récents
  const home = document.getElementById("home-projects");
  if (home) {
    loadProjects()
      .then((projects) => {
        const [first, ...rest] = projects;
        home.innerHTML =
          projectCard(first, 0, true) +
          `<div class="projects-grid">${rest.slice(0, 2).map((p, i) => projectCard(p, i + 1)).join("")}</div>`;
        watch(home);
      })
      .catch(() => {
        home.innerHTML = '<p class="empty">Les projets n’ont pas pu être chargés. <a class="red" href="projects.html">Voir toutes les réalisations</a></p>';
      });
  }

  // Réalisations : filtres, recherche, pagination
  const list = document.getElementById("projects-list");
  if (list) {
    const PAGE = 7;
    const state = { all: [], filter: "all", q: "", shown: PAGE };
    const more = document.getElementById("load-more");
    const count = document.getElementById("projects-count");
    const search = document.getElementById("project-search");
    const filters = document.querySelectorAll(".filter");

    const matches = (p) => {
      if (state.filter !== "all" && !(p.categories || []).includes(state.filter)) return false;
      if (!state.q) return true;
      const hay = [p.title, p.description, p.stack, p.client, ...(p.tags || [])].join(" ").toLowerCase();
      return hay.includes(state.q);
    };

    function render() {
      const found = state.all.filter(matches);
      const visible = found.slice(0, state.shown);
      if (!found.length) {
        list.innerHTML = '<p class="empty">Aucun projet ne correspond à cette recherche.</p>';
      } else {
        const [first, ...rest] = visible;
        list.innerHTML =
          projectCard(first, state.all.indexOf(first), true) +
          (rest.length ? `<div class="projects-grid">${rest.map((p) => projectCard(p, state.all.indexOf(p))).join("")}</div>` : "");
      }
      if (more) more.hidden = visible.length >= found.length;
      if (count) count.textContent = `${found.length} projet${found.length > 1 ? "s" : ""}`;
      watch(list);
    }

    filters.forEach((btn) =>
      btn.addEventListener("click", () => {
        filters.forEach((b) => b.setAttribute("aria-pressed", "false"));
        btn.setAttribute("aria-pressed", "true");
        state.filter = btn.dataset.filter;
        state.shown = PAGE;
        render();
      })
    );
    if (search)
      search.addEventListener("input", () => {
        state.q = search.value.trim().toLowerCase();
        state.shown = PAGE;
        render();
      });
    if (more)
      more.addEventListener("click", () => {
        state.shown += 6;
        render();
      });

    loadProjects()
      .then((projects) => {
        state.all = projects;
        document.querySelectorAll("[data-project-total]").forEach((el) => (el.textContent = projects.length));
        render();
      })
      .catch(() => {
        list.innerHTML = '<p class="empty">Les projets n’ont pas pu être chargés. Réessayez dans un instant.</p>';
      });
  }

  // Compteur « projets livrés » sur les autres pages
  const totals = document.querySelectorAll("[data-project-total]");
  if (totals.length && !list) {
    loadProjects()
      .then((p) => totals.forEach((el) => (el.textContent = p.length)))
      .catch(() => {});
  }

  /* ---------- Formulaire de contact ---------- */
  const form = document.getElementById("contact-form");
  if (form) {
    // Pour activer l'envoi direct : renseigner ces 3 clés EmailJS (https://www.emailjs.com).
    // Tant qu'elles sont vides, le formulaire ouvre la messagerie du visiteur avec le message pré-rempli.
    const EMAILJS = { publicKey: "", serviceId: "", templateId: "" };
    const TO = "contact.jeyko.dev@gmail.com";
    const status = document.getElementById("form-status");
    const message = document.getElementById("message");
    const counter = document.getElementById("char-count");

    if (message && counter) message.addEventListener("input", () => (counter.textContent = message.value.length));

    const setError = (id, text) => {
      const input = document.getElementById(id);
      const box = input.closest(".field") || input.closest(".consent");
      const err = document.getElementById(id + "-error");
      if (box) box.classList.toggle("has-error", !!text);
      if (err) err.textContent = text || "";
      input.setAttribute("aria-invalid", text ? "true" : "false");
      return !text;
    };
    const validate = () => {
      const v = (id) => document.getElementById(id).value.trim();
      let ok = true;
      ok = setError("name", v("name").length < 2 ? "Indiquez votre nom." : "") && ok;
      ok = setError("email", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v("email")) ? "" : "Indiquez une adresse email valide.") && ok;
      ok = setError("message", v("message").length < 10 ? "Décrivez votre projet en quelques mots (10 caractères minimum)." : "") && ok;
      ok = setError("privacy", document.getElementById("privacy").checked ? "" : "Merci d’accepter la politique de confidentialité.") && ok;
      return ok;
    };
    const show = (type, text) => {
      status.className = "form__status " + (type === "ok" ? "is-ok" : "is-error");
      status.textContent = text;
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!validate()) {
        const first = form.querySelector('[aria-invalid="true"]');
        if (first) first.focus();
        return;
      }
      const data = {
        from_name: form.name.value.trim(),
        from_email: form.email.value.trim(),
        project_type: (form.querySelector('input[name="project-type"]:checked') || {}).value || "Non précisé",
        budget: form.budget.value,
        message: form.message.value.trim(),
      };
      const btn = form.querySelector('button[type="submit"]');

      if (EMAILJS.publicKey && EMAILJS.serviceId && EMAILJS.templateId && window.emailjs) {
        btn.disabled = true;
        try {
          window.emailjs.init({ publicKey: EMAILJS.publicKey });
          await window.emailjs.send(EMAILJS.serviceId, EMAILJS.templateId, { ...data, subject: "Nouveau projet — " + data.project_type });
          show("ok", "Merci ! Votre message est bien parti. Je vous réponds sous 24 h ouvrées.");
          form.reset();
          if (counter) counter.textContent = "0";
        } catch (err) {
          show("error", "L’envoi a échoué. Écrivez-moi directement à " + TO + ".");
        }
        btn.disabled = false;
        return;
      }

      const body = `Nom : ${data.from_name}\nEmail : ${data.from_email}\nType de projet : ${data.project_type}\nBudget : ${data.budget}\n\n${data.message}`;
      window.location.href = `mailto:${TO}?subject=${encodeURIComponent("Nouveau projet — " + data.project_type)}&body=${encodeURIComponent(body)}`;
      show("ok", "Votre messagerie va s’ouvrir avec votre message pré-rempli. Il ne reste qu’à l’envoyer !");
    });
  }

  /* ---------- Services : aperçu qui suit le curseur ---------- */
  const preview = document.querySelector(".service-preview");
  if (preview && window.matchMedia("(hover: hover) and (min-width: 961px)").matches) {
    let x = 0, y = 0, raf = null;
    const move = () => {
      preview.style.left = x + 170 + "px";
      preview.style.top = y - 10 + "px";
      raf = null;
    };
    document.querySelectorAll(".service").forEach((row) => {
      row.addEventListener("mouseenter", () => {
        preview.src = row.dataset.preview;
        preview.classList.add("is-on");
      });
      row.addEventListener("mouseleave", () => preview.classList.remove("is-on"));
      row.addEventListener("mousemove", (e) => {
        x = e.clientX; y = e.clientY;
        if (!raf) raf = requestAnimationFrame(move);
      });
    });
  }

  /* ---------- Boutons : effet magnétique + onde au clic ---------- */
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  document.querySelectorAll(".btn").forEach((btn) => {
    if (finePointer && !reduceMotion) {
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        btn.style.setProperty("--mx", (dx * 0.1).toFixed(1) + "px");
        btn.style.setProperty("--my", (dy * 0.2).toFixed(1) + "px");
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.setProperty("--mx", "0px");
        btn.style.setProperty("--my", "0px");
      });
    }
    btn.addEventListener("pointerdown", (e) => {
      if (reduceMotion) return;
      const r = btn.getBoundingClientRect();
      const dot = document.createElement("span");
      dot.className = "ripple";
      dot.style.left = e.clientX - r.left + "px";
      dot.style.top = e.clientY - r.top + "px";
      dot.style.setProperty("--ripple-scale", Math.ceil((Math.max(r.width, r.height) * 2.4) / 16));
      btn.appendChild(dot);
      dot.addEventListener("animationend", () => dot.remove());
      btn.classList.remove("is-clicked");
      void btn.offsetWidth;
      btn.classList.add("is-clicked");
    });
    btn.addEventListener("animationend", (e) => {
      if (e.target === btn) btn.classList.remove("is-clicked");
    });
  });

  /* ---------- Année du pied de page ---------- */
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
})();
