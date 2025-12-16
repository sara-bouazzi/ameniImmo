import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Corriger l'icône par défaut de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function MapView({ annonces = [] }) {
  // Centre de la Tunisie
  const tunisiaCenter = [36.8065, 10.1815];
  const defaultZoom = 7;

  // Créer une icône personnalisée rouge pour les annonces
  const customIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  // Fonction pour obtenir des coordonnées approximatives basées sur la ville
  const getCoordinates = (annonce) => {
    const cityCoords = {
      tunis: [36.8065, 10.1815],
      sousse: [35.8256, 10.6369],
      sfax: [34.7406, 10.7603],
      hammamet: [36.4000, 10.6167],
      monastir: [35.7772, 10.8264],
      bizerte: [37.2744, 9.8739],
      nabeul: [36.4511, 10.7356],
      ariana: [36.8625, 10.1956],
      "la marsa": [36.8780, 10.3247],
      carthage: [36.8531, 10.3231],
      "el mourouj": [36.7261, 10.1953],
      // Ajoutez plus de villes selon vos besoins
    };

    const ville = annonce.ville?.toLowerCase() || "";
    
    // Chercher une correspondance exacte ou partielle
    for (const [city, coords] of Object.entries(cityCoords)) {
      if (ville.includes(city)) {
        // Ajouter un petit décalage aléatoire pour éviter que les markers se superposent
        const offsetLat = (Math.random() - 0.5) * 0.02;
        const offsetLng = (Math.random() - 0.5) * 0.02;
        return [coords[0] + offsetLat, coords[1] + offsetLng];
      }
    }

    // Si la ville n'est pas reconnue, utiliser le centre de la Tunisie avec un offset
    return [tunisiaCenter[0] + (Math.random() - 0.5) * 2, tunisiaCenter[1] + (Math.random() - 0.5) * 2];
  };

  const formatPrice = (value) => {
    if (value == null) return "-";
    try {
      return Number(value).toLocaleString("fr-FR");
    } catch {
      return value;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-6xl mx-auto">
      <div className="p-4 bg-gradient-to-r from-primary-700 to-primary-600 text-white flex items-center justify-between">
        <h3 className="text-xl font-bold">Carte des Annonces</h3>
        <div className="flex items-center text-sm">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          {annonces.length} {annonces.length === 1 ? "annonce" : "annonces"}
        </div>
      </div>

      <div className="h-[450px] relative">
        <MapContainer
          center={tunisiaCenter}
          zoom={defaultZoom}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {annonces.map((annonce) => {
            const position = getCoordinates(annonce);
            return (
              <Marker key={annonce.id} position={position} icon={customIcon}>
                <Popup maxWidth={300}>
                  <div className="p-2">
                    <h4 className="font-bold text-gray-900 mb-2 text-base">
                      {annonce.titre}
                    </h4>
                    
                    <div className="space-y-1 mb-3">
                      <div className="flex items-start text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-1 mt-0.5 text-primary-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span>{annonce.ville}, {annonce.gouvernorat}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-1 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                        <span>{annonce.surface} m²</span>
                      </div>

                      {annonce.statut && (
                        <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-800">
                          {annonce.statut}
                        </div>
                      )}
                    </div>

                    <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                      {annonce.description}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <div>
                        <p className="text-xs text-gray-500">Prix</p>
                        <p className="text-lg font-bold text-primary-700">
                          {formatPrice(annonce.prix)} TND
                        </p>
                      </div>
                      <a
                        href={`/annonces/${annonce.id}`}
                        className="inline-flex items-center px-3 py-2 bg-primary-700 hover:bg-primary-800 text-white text-sm font-medium rounded-lg transition-colors"
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = `/annonces/${annonce.id}`;
                        }}
                      >
                        Détails
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}

export default MapView;
