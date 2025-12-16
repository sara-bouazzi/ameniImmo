import React, { useEffect, useState } from "react";
import AnnonceCard from "../components/AnnonceCard";
import MapView from "../components/MapView";
import { getAnnonces } from "../services/annonces";

function Annonces() {
  const [annonces, setAnnonces] = useState([]);
  const [filteredAnnonces, setFilteredAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filtres
  const [filters, setFilters] = useState({
    statut: "",
    type: "",
    ville: "",
    prixMin: "",
    prixMax: "",
    superficieMin: "",
    superficieMax: "",
    chambres: "",
    sallesBain: "",
    sortBy: "recent"
  });

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getAnnonces()
      .then((data) => {
        if (mounted) {
          setAnnonces(data);
          setFilteredAnnonces(data);
        }
      })
      .catch((err) => {
        console.error(err);
        if (mounted) setError(err.message || "Erreur réseau");
      })
      .finally(() => mounted && setLoading(false));

    return () => (mounted = false);
  }, []);

  // Appliquer les filtres
  useEffect(() => {
    let filtered = [...annonces];

    // Filtre par statut
    if (filters.statut) {
      filtered = filtered.filter(a => a.statut === filters.statut);
    }

    // Filtre par type
    if (filters.type) {
      filtered = filtered.filter(a => a.type_bien === filters.type);
    }

    // Filtre par ville
    if (filters.ville) {
      filtered = filtered.filter(a => 
        a.ville && a.ville.toLowerCase().includes(filters.ville.toLowerCase())
      );
    }

    // Filtre par prix
    if (filters.prixMin) {
      filtered = filtered.filter(a => a.prix >= parseFloat(filters.prixMin));
    }
    if (filters.prixMax) {
      filtered = filtered.filter(a => a.prix <= parseFloat(filters.prixMax));
    }

    // Filtre par superficie
    if (filters.superficieMin) {
      filtered = filtered.filter(a => a.superficie >= parseFloat(filters.superficieMin));
    }
    if (filters.superficieMax) {
      filtered = filtered.filter(a => a.superficie <= parseFloat(filters.superficieMax));
    }

    // Filtre par chambres
    if (filters.chambres) {
      filtered = filtered.filter(a => a.nbr_chambres >= parseInt(filters.chambres));
    }

    // Filtre par salles de bain
    if (filters.sallesBain) {
      filtered = filtered.filter(a => a.nbr_salles_bain >= parseInt(filters.sallesBain));
    }

    // Tri
    switch (filters.sortBy) {
      case "recent":
        filtered.sort((a, b) => b.id - a.id);
        break;
      case "price-asc":
        filtered.sort((a, b) => a.prix - b.prix);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.prix - a.prix);
        break;
      case "surface-desc":
        filtered.sort((a, b) => b.superficie - a.superficie);
        break;
      default:
        break;
    }

    setFilteredAnnonces(filtered);
  }, [filters, annonces]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const resetFilters = () => {
    setFilters({
      statut: "",
      type: "",
      ville: "",
      prixMin: "",
      prixMax: "",
      superficieMin: "",
      superficieMax: "",
      chambres: "",
      sallesBain: "",
      sortBy: "recent"
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
              Annonces Immobilières
            </h1>
            <p className="text-gray-600">
              {filteredAnnonces.length} {filteredAnnonces.length === 1 ? 'annonce trouvée' : 'annonces trouvées'}
            </p>
          </div>

          <div className="flex items-center gap-3 mt-4 md:mt-0">
            {/* Bouton Carte */}
            <button
              onClick={() => setShowMap(!showMap)}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                showMap 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              {showMap ? 'Grille' : 'Carte'}
            </button>

            {/* Bouton Filtres (mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-lg font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filtres
            </button>
          </div>
        </div>

        {/* État de chargement */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Chargement des annonces...</p>
            </div>
          </div>
        )}
        
        {/* État d'erreur */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-8 shadow-sm">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-800 font-medium">⚠️ {error}</p>
            </div>
          </div>
        )}

        {/* Contenu principal */}
        {!loading && !error && (
          <div className="space-y-6">
            {/* Filtres en haut */}
            <div className={`${showFilters ? 'block' : 'hidden md:block'}`}>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Filtres</h3>
                  <button
                    onClick={resetFilters}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Réinitialiser
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Statut */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transaction
                    </label>
                    <select
                      name="statut"
                      value={filters.statut}
                      onChange={handleFilterChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Tous</option>
                      <option value="vente">Vente</option>
                      <option value="location">Location</option>
                    </select>
                  </div>

                  {/* Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type de bien
                    </label>
                    <select
                      name="type"
                      value={filters.type}
                      onChange={handleFilterChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Tous</option>
                      <option value="logement">Logement</option>
                      <option value="terrain">Terrain</option>
                      <option value="espace_travail">Espace de travail</option>
                      <option value="place_parc">Parking</option>
                    </select>
                  </div>

                  {/* Ville */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ville
                    </label>
                    <input
                      type="text"
                      name="ville"
                      value={filters.ville}
                      onChange={handleFilterChange}
                      placeholder="Ex: Tunis, Sousse..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  {/* Prix */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prix (TND)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        name="prixMin"
                        value={filters.prixMin}
                        onChange={handleFilterChange}
                        placeholder="Min"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      />
                      <input
                        type="number"
                        name="prixMax"
                        value={filters.prixMax}
                        onChange={handleFilterChange}
                        placeholder="Max"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>

                  {/* Superficie */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Superficie (m²)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        name="superficieMin"
                        value={filters.superficieMin}
                        onChange={handleFilterChange}
                        placeholder="Min"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      />
                      <input
                        type="number"
                        name="superficieMax"
                        value={filters.superficieMax}
                        onChange={handleFilterChange}
                        placeholder="Max"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>

                  {/* Tri */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trier par
                    </label>
                    <select
                      name="sortBy"
                      value={filters.sortBy}
                      onChange={handleFilterChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="recent">Plus récentes</option>
                      <option value="price-asc">Prix croissant</option>
                      <option value="price-desc">Prix décroissant</option>
                      <option value="surface-desc">Surface décroissante</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Zone de contenu */}
            <div>
              {showMap ? (
                <MapView annonces={filteredAnnonces} />
              ) : (
                <>
                  {filteredAnnonces.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">Aucune annonce trouvée</h3>
                      <p className="text-gray-500 text-lg mb-6">Essayez de modifier vos critères de recherche</p>
                      <button
                        onClick={resetFilters}
                        className="btn-primary"
                      >
                        Réinitialiser les filtres
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredAnnonces.map((a) => (
                        <AnnonceCard key={a.id} annonce={a} />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Annonces;
