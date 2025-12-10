import React, { useEffect, useState } from "react";
import AnnonceCard from "../components/AnnonceCard";
import { getAnnonces } from "../services/annonces";

function Annonces() {
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getAnnonces()
      .then((data) => {
        if (mounted) setAnnonces(data);
      })
      .catch((err) => {
        console.error(err);
        if (mounted) setError(err.message || "Erreur réseau");
      })
      .finally(() => mounted && setLoading(false));

    return () => (mounted = false);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête simple */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
            Annonces Immobilières
          </h1>
          <p className="text-gray-600">Découvrez nos meilleures offres</p>
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
          <>
            {annonces.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Aucune annonce disponible</h3>
                <p className="text-gray-500 text-lg">Revenez plus tard pour découvrir nos nouvelles offres</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {annonces.map((a) => (
                  <AnnonceCard key={a.id} annonce={a} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Annonces;
