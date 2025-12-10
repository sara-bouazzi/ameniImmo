import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchBar() {
  const navigate = useNavigate();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchParams, setSearchParams] = useState({
    statut: "vente",
    type: "",
    ville: "",
    prixMin: "",
    prixMax: "",
    chambres: "",
    superficieMin: "",
    superficieMax: "",
    sallesBain: ""
  });

  const handleChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Construire les paramètres de recherche
    const params = new URLSearchParams();
    Object.keys(searchParams).forEach(key => {
      if (searchParams[key]) {
        params.append(key, searchParams[key]);
      }
    });
    navigate(`/annonces?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 -mt-10 relative z-10">
      <form onSubmit={handleSearch}>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {/* Statut */}
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transaction
            </label>
            <select
              name="statut"
              value={searchParams.statut}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="vente">Acheter</option>
              <option value="location">Louer</option>
            </select>
          </div>

          {/* Type de bien */}
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de bien
            </label>
            <select
              name="type"
              value={searchParams.type}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Tous</option>
              <option value="logement">Logement</option>
              <option value="terrain">Terrain</option>
              <option value="espace_travail">Espace de travail</option>
              <option value="place_parc">Parking</option>
            </select>
          </div>

          {/* Ville */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Localisation
            </label>
            <input
              type="text"
              name="ville"
              value={searchParams.ville}
              onChange={handleChange}
              placeholder="Ex: Tunis, Sousse, Hammamet..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Prix */}
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prix (TND)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                name="prixMin"
                value={searchParams.prixMin}
                onChange={handleChange}
                placeholder="Min"
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Bouton Rechercher */}
          <div className="md:col-span-1 flex items-end">
            <button
              type="submit"
              className="w-full px-6 py-3 bg-gradient-to-r from-primary-700 to-primary-600 hover:from-primary-800 hover:to-primary-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Rechercher</span>
            </button>
          </div>
        </div>

        {/* Filtres avancés */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center text-primary-700 hover:text-primary-800 font-medium transition-colors"
          >
            <svg className={`w-5 h-5 mr-2 transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            Recherche avancée
          </button>

          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              {/* Prix Max */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix max (TND)
                </label>
                <input
                  type="number"
                  name="prixMax"
                  value={searchParams.prixMax}
                  onChange={handleChange}
                  placeholder="Max"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Superficie Min */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Superficie min (m²)
                </label>
                <input
                  type="number"
                  name="superficieMin"
                  value={searchParams.superficieMin}
                  onChange={handleChange}
                  placeholder="Min"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Superficie Max */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Superficie max (m²)
                </label>
                <input
                  type="number"
                  name="superficieMax"
                  value={searchParams.superficieMax}
                  onChange={handleChange}
                  placeholder="Max"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Chambres */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chambres
                </label>
                <select
                  name="chambres"
                  value={searchParams.chambres}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Toutes</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>
              </div>

              {/* Salles de bain */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salles de bain
                </label>
                <select
                  name="sallesBain"
                  value={searchParams.sallesBain}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Toutes</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default SearchBar;
