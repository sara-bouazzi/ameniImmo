import React from "react";

function MapView({ annonces = [], selectedAnnonce = null, onAnnonceSelect }) {
  // Composant carte simplifié - Placeholder pour intégration Leaflet
  // Tunisie centre approximatif: 36.8065° N, 10.1815° E
  
  const tunisiaRegions = [
    { name: "Tunis", lat: 36.8065, lng: 10.1815, count: 0 },
    { name: "Sousse", lat: 35.8256, lng: 10.6369, count: 0 },
    { name: "Sfax", lat: 34.7406, lng: 10.7603, count: 0 },
    { name: "Hammamet", lat: 36.4000, lng: 10.6167, count: 0 },
    { name: "Monastir", lat: 35.7772, lng: 10.8264, count: 0 },
    { name: "Bizerte", lat: 37.2744, lng: 9.8739, count: 0 },
    { name: "Nabeul", lat: 36.4511, lng: 10.7356, count: 0 },
    { name: "Djerba", lat: 33.8076, lng: 10.8451, count: 0 }
  ];

  // Compter les annonces par région
  const regionsWithCount = tunisiaRegions.map(region => {
    const count = annonces.filter(a => 
      a.ville && a.ville.toLowerCase().includes(region.name.toLowerCase())
    ).length;
    return { ...region, count };
  });

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-full">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Carte des Annonces</h3>
        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-5 h-5 mr-1 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          {annonces.length} {annonces.length === 1 ? 'annonce' : 'annonces'}
        </div>
      </div>

      {/* Carte stylisée */}
      <div className="relative bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg h-96 overflow-hidden border-2 border-blue-200">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        {/* Regions */}
        <div className="relative h-full p-4">
          {regionsWithCount.map((region, idx) => (
            <div
              key={idx}
              className="absolute group cursor-pointer"
              style={{
                left: `${20 + (idx % 3) * 30}%`,
                top: `${20 + Math.floor(idx / 3) * 25}%`
              }}
              onClick={() => onAnnonceSelect && onAnnonceSelect(region)}
            >
              {region.count > 0 && (
                <>
                  {/* Marker */}
                  <div className="relative flex items-center justify-center transform hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-red-500 drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="absolute text-xs font-bold text-white top-1">
                      {region.count}
                    </span>
                  </div>

                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap shadow-lg">
                      {region.name}: {region.count} {region.count === 1 ? 'annonce' : 'annonces'}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Légende */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3 text-xs">
          <div className="font-semibold text-gray-900 mb-2">Légende</div>
          <div className="flex items-center text-gray-600">
            <svg className="w-4 h-4 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            Nombre d'annonces
          </div>
        </div>

        {/* Info box */}
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-3 text-xs max-w-xs">
          <div className="text-gray-700">
            <strong>Note:</strong> Pour une meilleure expérience avec une vraie carte interactive,
            installez <code className="bg-gray-100 px-1 rounded">react-leaflet</code>
          </div>
        </div>
      </div>

      {/* Statistiques par région */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        {regionsWithCount.filter(r => r.count > 0).slice(0, 4).map((region, idx) => (
          <div key={idx} className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-primary-700">{region.count}</div>
            <div className="text-xs text-gray-600">{region.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MapView;
