// contact.js - Fonctionnalités premium pour la page contact

// ─── Configuration EmailJS ────────────────────────────────────────────────────
// 1. Créez un compte gratuit sur https://www.emailjs.com/
// 2. Ajoutez un service (Gmail, Outlook…) → copiez le Service ID
// 3. Créez un template (utilisez les variables ci-dessous) → copiez le Template ID
// 4. Account > API Keys → copiez la Public Key
//
// Variables disponibles dans votre template EmailJS :
//   {{from_name}}     → nom de l'expéditeur
//   {{from_email}}    → email de l'expéditeur (utiliser comme Reply-To)
//   {{subject}}       → sujet
//   {{project_type}}  → type de projet
//   {{message}}       → corps du message
// ─────────────────────────────────────────────────────────────────────────────
const EMAILJS_PUBLIC_KEY  = "VOTRE_CLE_PUBLIQUE";   // Account > API Keys
const EMAILJS_SERVICE_ID  = "VOTRE_SERVICE_ID";      // Email Services > Service ID
const EMAILJS_TEMPLATE_ID = "VOTRE_TEMPLATE_ID";     // Email Templates > Template ID

class ContactPageManager {
  constructor() {
    this.form = document.getElementById("contact-form");
    this.fileInput = document.querySelector(".file-input");
    this.filePreview = document.getElementById("file-preview");
    this.messageInput = document.getElementById("message");
    this.charCount = document.getElementById("char-count");
    this.submitBtn = document.querySelector(".submit-btn");
    this.successMessage = document.getElementById("success-message");
    this.faqQuestions = document.querySelectorAll(".faq-question");

    this.init();
  }

  init() {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    this.initFormValidation();
    this.initFileUpload();
    this.initCharacterCounter();
    this.initFaqAccordion();
    this.initMap();
    this.initAnimations();
    this.initFormSubmission();
    this.initCounterAnimations();
  }

  // Validation du formulaire
  initFormValidation() {
    const inputs = this.form.querySelectorAll(".form-input[required]");
    const checkbox = document.getElementById("privacy");

    inputs.forEach((input) => {
      input.addEventListener("blur", () => this.validateField(input));
      input.addEventListener("input", () => {
        this.clearError(input);
        this.checkFormValidity();
      });
    });

    checkbox.addEventListener("change", () => this.checkFormValidity());

    // Validation en temps réel pour l'email
    const emailInput = document.getElementById("email");
    emailInput.addEventListener("input", () => this.validateEmail(emailInput));
  }

  validateField(field) {
    const value = field.value.trim();
    const errorId = `${field.id}-error`;
    const errorElement = document.getElementById(errorId);

    if (!value) {
      this.showError(field, "Ce champ est obligatoire");
      return false;
    }

    // Validation spécifique par type
    switch (field.type) {
      case "email":
        return this.validateEmail(field);
      case "textarea":
        if (value.length < 10) {
          this.showError(
            field,
            "Le message doit contenir au moins 10 caractères"
          );
          return false;
        }
        break;
      default:
        if (value.length < 2) {
          this.showError(field, "Ce champ doit contenir au moins 2 caractères");
          return false;
        }
    }

    this.clearError(field);
    return true;
  }

  validateEmail(field) {
    const email = field.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      this.showError(field, "Veuillez entrer une adresse email valide");
      return false;
    }

    this.clearError(field);
    return true;
  }

  showError(field, message) {
    const formGroup = field.closest(".form-group");
    const errorId = `${field.id}-error`;
    const errorElement = document.getElementById(errorId);

    formGroup.classList.add("error");
    if (errorElement) {
      errorElement.textContent = message;
    }
  }

  clearError(field) {
    const formGroup = field.closest(".form-group");
    formGroup.classList.remove("error");
  }

  checkFormValidity() {
    const inputs = this.form.querySelectorAll(".form-input[required]");
    const checkbox = document.getElementById("privacy");

    let isValid = true;

    inputs.forEach((input) => {
      if (!input.value.trim()) {
        isValid = false;
      }
    });

    if (!checkbox.checked) {
      isValid = false;
    }

    this.submitBtn.disabled = !isValid;
    return isValid;
  }

  // Gestion de l'upload de fichier
  initFileUpload() {
    if (!this.fileInput) return;

    this.fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // Vérifier la taille du fichier (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        alert("Le fichier est trop volumineux (max 10MB)");
        this.fileInput.value = "";
        return;
      }

      // Vérifier le type de fichier
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
        "image/jpg",
        "image/png",
      ];

      if (!allowedTypes.includes(file.type)) {
        alert(
          "Type de fichier non autorisé. Formats acceptés : PDF, DOC, JPG, PNG"
        );
        this.fileInput.value = "";
        return;
      }

      this.showFilePreview(file);
    });
  }

  showFilePreview(file) {
    this.filePreview.innerHTML = "";
    this.filePreview.classList.add("active");

    const preview = document.createElement("div");
    preview.className = "file-preview-content";

    const icon = document.createElement("i");
    icon.className = this.getFileIcon(file.type);

    const info = document.createElement("div");
    info.className = "file-info-preview";

    const name = document.createElement("div");
    name.className = "file-name";
    name.textContent = file.name;

    const size = document.createElement("div");
    size.className = "file-size";
    size.textContent = this.formatFileSize(file.size);

    const removeBtn = document.createElement("button");
    removeBtn.className = "file-remove";
    removeBtn.innerHTML = '<i class="fas fa-times"></i>';
    removeBtn.addEventListener("click", () => {
      this.fileInput.value = "";
      this.filePreview.classList.remove("active");
    });

    info.appendChild(name);
    info.appendChild(size);

    preview.appendChild(icon);
    preview.appendChild(info);
    preview.appendChild(removeBtn);

    this.filePreview.appendChild(preview);
  }

  getFileIcon(fileType) {
    if (fileType.includes("pdf")) return "fas fa-file-pdf";
    if (fileType.includes("word") || fileType.includes("document"))
      return "fas fa-file-word";
    if (fileType.includes("image")) return "fas fa-file-image";
    return "fas fa-file";
  }

  formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  // Compteur de caractères
  initCharacterCounter() {
    if (!this.messageInput || !this.charCount) return;

    this.messageInput.addEventListener("input", () => {
      const length = this.messageInput.value.length;
      this.charCount.textContent = length;

      // Changer la couleur si proche de la limite
      if (length > 900) {
        this.charCount.style.color = "#ff6b6b";
      } else if (length > 750) {
        this.charCount.style.color = "#ffa726";
      } else {
        this.charCount.style.color = "var(--text-muted)";
      }
    });
  }

  // Accordéon FAQ
  initFaqAccordion() {
    this.faqQuestions.forEach((question) => {
      question.addEventListener("click", () => {
        const isExpanded = question.getAttribute("aria-expanded") === "true";
        const answer = question.nextElementSibling;

        // Fermer les autres éléments ouverts
        if (!isExpanded) {
          this.faqQuestions.forEach((q) => {
            if (q !== question) {
              q.setAttribute("aria-expanded", "false");
              q.nextElementSibling.style.maxHeight = "0";
            }
          });
        }

        // Basculer l'état actuel
        question.setAttribute("aria-expanded", !isExpanded);

        if (!isExpanded) {
          answer.style.maxHeight = answer.scrollHeight + "px";
        } else {
          answer.style.maxHeight = "0";
        }
      });
    });
  }

  // Initialisation de la carte
  initMap() {
    const mapElement = document.getElementById("map");
    if (!mapElement || typeof mapboxgl === "undefined") return;

    // Token Mapbox (remplacer par votre token)
    mapboxgl.accessToken =
      "pk.eyJ1IjoiamV5a28iLCJhIjoiY2x2N2VxMmxwMGY4bDJrbzZ1bW5rMm83YyJ9.your-token-here";

    try {
      const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/dark-v11",
        center: [2.3522, 48.8566], // Paris
        zoom: 3,
        interactive: false,
        attributionControl: false,
      });

      // Ajouter un marqueur
      new mapboxgl.Marker({
        color: "#8e7ab5",
        scale: 0.8,
      })
        .setLngLat([2.3522, 48.8566])
        .addTo(map);

      // Effet de parallaxe au scroll
      window.addEventListener("scroll", () => {
        const scrollY = window.scrollY;
        const mapSection = document.querySelector(".contact-map");
        const mapRect = mapSection.getBoundingClientRect();

        if (mapRect.top < window.innerHeight && mapRect.bottom > 0) {
          const progress = 1 - mapRect.top / window.innerHeight;
          const zoom = 3 + progress * 2;
          map.setZoom(zoom);
        }
      });
    } catch (error) {
      console.log("Mapbox non disponible, utilisation du fallback");
      mapElement.style.background = "linear-gradient(135deg, #1a1f35, #0b0d12)";
    }
  }

  // Animations
  initAnimations() {
    // Animation des inputs au focus
    const inputs = this.form.querySelectorAll(".form-input");
    inputs.forEach((input) => {
      input.addEventListener("focus", () => {
        input.classList.add("focused");
      });

      input.addEventListener("blur", () => {
        if (input.value) input.classList.add("filled");
        input.classList.remove("focused");
      });
    });

    // Animation du bouton submit
    this.submitBtn.addEventListener("mouseenter", () => {
      if (!this.submitBtn.disabled) {
        this.submitBtn.classList.add("hover");
      }
    });

    this.submitBtn.addEventListener("mouseleave", () => {
      this.submitBtn.classList.remove("hover");
    });

    // Animation des cartes de contact
    const contactMethods = document.querySelectorAll(".contact-method");
    contactMethods.forEach((method) => {
      method.addEventListener("mouseenter", (e) => {
        const rect = method.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        method.style.setProperty("--mouse-x", `${x}px`);
        method.style.setProperty("--mouse-y", `${y}px`);
      });
    });
  }

  // Soumission du formulaire via EmailJS
  initFormSubmission() {
    this.form.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!this.checkFormValidity()) return;

      this.submitBtn.classList.add("loading");
      this.submitBtn.disabled = true;

      const templateParams = {
        from_name:    document.getElementById("name").value.trim(),
        from_email:   document.getElementById("email").value.trim(),
        subject:      document.getElementById("subject").value.trim(),
        project_type: document.getElementById("project-type").value || "Non spécifié",
        message:      document.getElementById("message").value.trim(),
      };

      try {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
        this.showSuccessMessage();
        this.resetForm();
      } catch (error) {
        console.error("Erreur EmailJS :", error);
        showToast(
          "Échec de l'envoi. Réessayez ou écrivez-moi directement à contact@jeyko.dev",
          "error"
        );
        this.submitBtn.classList.remove("loading");
        this.submitBtn.disabled = false;
      }
    });
  }

  showSuccessMessage() {
    this.successMessage.classList.add("active");

    // Masquer le message après 5 secondes
    setTimeout(() => {
      this.successMessage.classList.remove("active");
    }, 5000);
  }

  resetForm() {
    this.form.reset();
    this.filePreview.classList.remove("active");
    this.filePreview.innerHTML = "";
    this.charCount.textContent = "0";

    // Réinitialiser les états
    const inputs = this.form.querySelectorAll(".form-input");
    inputs.forEach((input) => {
      input.classList.remove("filled");
      const formGroup = input.closest(".form-group");
      if (formGroup) formGroup.classList.remove("error");
    });

    // Réinitialiser le bouton
    this.submitBtn.classList.remove("loading");
    this.submitBtn.disabled = true;
  }

  // Animation des compteurs
  initCounterAnimations() {
    const counters = document.querySelectorAll(".stat-number");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const counter = entry.target;
            const target = parseInt(counter.dataset.count);
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const timer = setInterval(() => {
              current += step;
              if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
              } else {
                counter.textContent = Math.floor(current);
              }
            }, 16);

            observer.unobserve(counter);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((counter) => observer.observe(counter));
  }
}

// Initialiser quand le DOM est chargé
document.addEventListener("DOMContentLoaded", () => {
  const contactPage = new ContactPageManager();

  // Ajouter des styles pour les animations
  const style = document.createElement("style");
  style.textContent = `
        .file-preview-content {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: var(--radius-md);
        }
        
        .file-preview-content i {
            font-size: 2rem;
            color: var(--accent);
        }
        
        .file-info-preview {
            flex: 1;
        }
        
        .file-name {
            color: var(--text-main);
            font-weight: 500;
            margin-bottom: 0.25rem;
            word-break: break-all;
        }
        
        .file-size {
            color: var(--text-muted);
            font-size: 0.875rem;
        }
        
        .file-remove {
            background: none;
            border: none;
            color: var(--text-muted);
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 50%;
            transition: all 0.3s ease;
        }
        
        .file-remove:hover {
            color: #ff6b6b;
            background: rgba(255, 255, 255, 0.1);
        }
        
        .form-input.focused ~ .input-focus {
            opacity: 1;
        }
        
        .submit-btn.hover .btn-glow {
            opacity: 0.7;
        }
        
        /* Animation du scroll pour les ancres */
        html {
            scroll-behavior: smooth;
        }

        /* Toast notifications */
        .toast {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 1rem 1.5rem;
            border-radius: var(--radius-md);
            backdrop-filter: blur(12px);
            font-size: 0.9rem;
            font-weight: 500;
            z-index: 9999;
            transform: translateY(120%);
            transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            max-width: 420px;
        }
        .toast.show {
            transform: translateY(0);
        }
        .toast-success {
            background: rgba(34, 197, 94, 0.15);
            border: 1px solid rgba(34, 197, 94, 0.3);
            color: #86efac;
        }
        .toast-error {
            background: rgba(239, 68, 68, 0.15);
            border: 1px solid rgba(239, 68, 68, 0.3);
            color: #fca5a5;
        }
    `;
  document.head.appendChild(style);

  // Gestion du scroll indicator
  const scrollIndicator = document.querySelector(".scroll-indicator");
  if (scrollIndicator) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        scrollIndicator.style.opacity = "0";
        scrollIndicator.style.pointerEvents = "none";
      } else {
        scrollIndicator.style.opacity = "0.7";
        scrollIndicator.style.pointerEvents = "auto";
      }
    });

    scrollIndicator.addEventListener("click", () => {
      document.querySelector(".contact-sections").scrollIntoView({
        behavior: "smooth",
      });
    });
  }

  // Effet de glitch au survol des titres
  const glitchTexts = document.querySelectorAll(".glitch-text");
  glitchTexts.forEach((text) => {
    text.addEventListener("mouseenter", () => {
      text.classList.add("glitching");
      setTimeout(() => {
        text.classList.remove("glitching");
      }, 500);
    });
  });
});

// Fonction pour afficher un message toast
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
        <i class="fas fa-${
          type === "success" ? "check-circle" : "exclamation-circle"
        }"></i>
        <span>${message}</span>
    `;

  document.body.appendChild(toast);

  // Animation d'entrée
  setTimeout(() => toast.classList.add("show"), 10);

  // Supprimer après 3 secondes
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Export pour les modules ES6
if (typeof module !== "undefined" && module.exports) {
  module.exports = ContactPageManager;
}
