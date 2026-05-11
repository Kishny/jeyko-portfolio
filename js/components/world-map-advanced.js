/**
 * WORLD MAP AVANCÉE
 * Version avec interactions et effets au survol
 */

document.addEventListener("DOMContentLoaded", function () {
  const mapContainer = document.getElementById("worldMap");
  if (!mapContainer) return;

  // 1. INITIALISATION
  const worldMap = L.map("worldMap", {
    center: [25, 10],
    zoom: 2,
    minZoom: 2,
    maxZoom: 5,
    zoomControl: false,
    attributionControl: true,
    scrollWheelZoom: false,
    dragging: false,
    doubleClickZoom: false,
    boxZoom: false,
    keyboard: false,
  });

  // 2. FOND DE CARTE PERSONNALISÉ
  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
    {
      attribution: "© OpenStreetMap © CARTO",
      subdomains: "abcd",
      maxZoom: 5,
      opacity: 0.85,
    }
  ).addTo(worldMap);

  // 3. COUCHES DE SURVOL POUR LES PAYS (Données simplifiées)
  // Note: Pour une vraie carte des pays, il faudrait un GeoJSON
  // Ceci est un exemple avec quelques polygones simulés

  // Style des polygones (pays)
  const countryStyle = {
    fillColor: "rgba(100, 150, 255, 0.15)",
    weight: 0.5,
    opacity: 0.4,
    color: "rgba(150, 200, 255, 0.3)",
    fillOpacity: 0.15,
  };

  // Style au survol
  const hoverStyle = {
    fillColor: "rgba(var(--accent-rgb), 0.35)",
    weight: 1,
    opacity: 0.8,
    color: "var(--accent-color)",
    fillOpacity: 0.25,
  };

  // 4. EXEMPLE DE QUELQUES "PAYS" SIMULÉS (coordonnées simplifiées)
  const demoCountries = [
    {
      name: "France",
      coordinates: [
        [48, -5],
        [48, 8],
        [42, 8],
        [42, -5],
      ],
      clients: 5,
      description: "Projets principaux",
    },
    {
      name: "Canada",
      coordinates: [
        [60, -140],
        [60, -50],
        [42, -50],
        [42, -140],
      ],
      clients: 3,
      description: "Collaborations remote",
    },
    {
      name: "Japon",
      coordinates: [
        [45, 128],
        [45, 146],
        [30, 146],
        [30, 128],
      ],
      clients: 2,
      description: "Projets web app",
    },
  ];

  // 5. AJOUT DES POLYGONES ET INTERACTIONS
  demoCountries.forEach((country) => {
    const polygon = L.polygon(country.coordinates, countryStyle).addTo(worldMap)
      .bindTooltip(`
                <div class="map-tooltip">
                    <strong>${country.name}</strong><br>
                    <small>${country.clients} projets</small>
                </div>
            `);

    // Effets de survol
    polygon.on("mouseover", function (e) {
      this.setStyle(hoverStyle);

      // Effet de pulsation sur le pays
      const layer = e.target;
      layer.bringToFront();

      // Animation légère
      layer.setStyle({
        ...hoverStyle,
        fillColor: "rgba(var(--accent-rgb), 0.4)",
      });
    });

    polygon.on("mouseout", function () {
      this.setStyle(countryStyle);
    });
  });

  // 6. MARQUEUR PRINCIPAL
  const markerIcon = L.divIcon({
    className: "custom-marker",
    html: `
            <div class="marker-pulse"></div>
            <div class="marker-dot">
                <i class="fas fa-code"></i>
            </div>
        `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });

  L.marker([46.5, 2.5], { icon: markerIcon })
    .addTo(worldMap)
    .bindPopup(
      `
            <div class="map-popup">
                <h4>🚀 Jeyko.dev</h4>
                <p>Développeur Web Full-Stack</p>
                <div class="popup-stats">
                    <span>🌍 ${demoCountries.length}+ pays</span><br>
                    <span>⚡ 100% remote</span>
                </div>
            </div>
        `
    )
    .openPopup();

  // 7. ANIMATION D'INITIALISATION
  setTimeout(() => {
    worldMap.setView([25, 10], 1.9, {
      animate: true,
      duration: 3,
    });
  }, 1000);

  // 8. GESTION DU REDIMENSIONNEMENT
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      worldMap.invalidateSize();
    }, 200);
  });

  console.log("🌍 World Map avancée initialisée");
});
