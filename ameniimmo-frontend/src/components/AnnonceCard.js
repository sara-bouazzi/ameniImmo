import React from "react";

function formatPrice(value) {
  if (value == null) return "-";
  try {
    return Number(value).toLocaleString("fr-FR");
  } catch {
    return value;
  }
}

function AnnonceCard({ annonce }) {
  const {
    titre,
    description,
    prix,
    surface,
    ville,
    statut,
    fonctionnalite,
  } = annonce;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
      {/* Image avec gradient coloré */}
      <div className="relative h-52 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 group-hover:bg-black/30 transition-colors duration-300"></div>
        
        {/* Badge statut */}
        {statut && (
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-white text-gray-800 shadow-lg">
              {statut}
            </span>
          </div>
        )}
        
        {/* Icône centrale */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-full p-4">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
          {titre}
        </h3>
        
        {/* Localisation */}
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <svg className="w-4 h-4 mr-1.5 text-indigo-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span>{ville}</span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2 min-h-[2.5rem]">
          {description}
        </p>

        {/* Prix et surface */}
        <div className="flex items-end justify-between mb-4 pb-4 border-b border-gray-100">
          <div>
            <p className="text-xs text-gray-500 mb-1">Prix</p>
            <p className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {formatPrice(prix)} <span className="text-sm">TND</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1">Surface</p>
            <p className="text-lg font-semibold text-gray-900">{surface} m²</p>
          </div>
        </div>

        {/* Fonctionnalités et bouton */}
        <div className="flex items-center justify-between">
          {fonctionnalite && (
            <div className="flex-1 mr-3">
              <p className="text-xs text-gray-500 truncate" title={fonctionnalite}>
                {fonctionnalite}
              </p>
            </div>
          )}
          
          <button className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg">
            Détails
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AnnonceCard;
