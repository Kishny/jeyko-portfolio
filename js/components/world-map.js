/**
 * WORLD MAP - Initialisation Leaflet
 * Version basique : affiche une carte du monde stylisée
 */

document.addEventListener("DOMContentLoaded", function () {
  const mapContainer = document.getElementById("worldMap");

  // Si l'élément n'existe pas, on arrête
  if (!mapContainer) return;

  // 1. INITIALISATION DE LA CARTE
  const worldMap = L.map("worldMap", {
    center: [25, 10], // Centré sur l'Europe/Afrique
    zoom: 2, // Zoom global
    minZoom: 2,
    maxZoom: 6,
    zoomControl: false, // On désactive les contrôles par défaut
    attributionControl: true,
    scrollWheelZoom: false, // Désactive le zoom avec la molette dans cette carte
    dragging: false, // Désactive le déplacement pour une carte d'arrière-plan
    doubleClickZoom: false,
    boxZoom: false,
    keyboard: false,
  });

  // 2. AJOUT D'UN FOND DE CARTE RÉALISTE (CartoDB Voyager)
  L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
    attribution:
      '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 6,
    tileSize: 256,
    zoomOffset: 0,
    opacity: 1,
  }).addTo(worldMap);

  // 3. AJOUT D'UN MARQUEUR (Position : France)
  const markerIcon = L.divIcon({
    className: "custom-marker",
    html: `
            <div class="marker-pulse"></div>
            <div class="marker-dot">
                <i class="fas fa-map-marker-alt"></i>
            </div>
        `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });

  L.marker([46.5, 2.5], { icon: markerIcon }) // Coordonnées approximatives de la France
    .addTo(worldMap)
    .bindPopup(
      "<b>📍 Jeyko.dev</b><br>Basé en France<br>Travail à distance mondial"
    )
    .openPopup();

  // 4. CONTRÔLE DE ZOOM PERSONNALISÉ (optionnel)
  const zoomControl = L.control
    .zoom({
      position: "topright",
    })
    .addTo(worldMap);

  // 5. ADAPTATION AU REDIMENSIONNEMENT
  let resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      worldMap.invalidateSize();
    }, 200);
  });

  // 6. ANIMATION D'APPARITION (optionnel)
  // La carte se "zoome" légèrement à l'ouverture
  setTimeout(() => {
    worldMap.setView([25, 10], 1.8, {
      animate: true,
      duration: 2.5,
    });
  }, 800);

  console.log("🌍 World Map initialisée avec succès");
});
