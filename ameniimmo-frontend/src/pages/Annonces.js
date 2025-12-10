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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Annonces Immobilières</h1>
          <p className="text-gray-600">Découvrez nos meilleures offres</p>
        </div>

        {/* État de chargement */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-3 border-blue-500 border-t-transparent"></div>
          </div>
        )}
        
        {/* État d'erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 text-sm">⚠️ {error}</p>
          </div>
        )}

        {/* Contenu principal */}
        {!loading && !error && (
          <>
            {annonces.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <svg className="mx-auto h-10 w-10 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Aucune annonce disponible</h3>
                <p className="text-gray-500">Revenez plus tard pour découvrir nos nouvelles offres</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
