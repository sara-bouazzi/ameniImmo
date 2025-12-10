import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Accueil() {
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnonces();
  }, []);

  const fetchAnnonces = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/annonces/");
      // Afficher uniquement les annonces approuvées
      const approuvees = response.data.filter((a) => a.approuve === true);
      setAnnonces(approuvees);
      setLoading(false);
    } catch (error) {
      console.error("Erreur:", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">Bienvenue sur AmeniImmo</h1>
          <p className="text-xl mb-8">Trouvez votre bien immobilier idéal en Tunisie</p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/annonces"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Voir toutes les annonces
            </Link>
            <Link
              to="/register"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
            >
              S'inscrire
            </Link>
          </div>
        </div>
      </div>

      {/* Annonces récentes */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Annonces récentes</h2>
          <p className="text-gray-600">Les dernières offres disponibles</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : annonces.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Aucune annonce disponible pour le moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {annonces.slice(0, 6).map((annonce) => (
              <div
                key={annonce.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-200"
              >
                {/* Image placeholder */}
                <div className="h-48 bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-white opacity-50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{annonce.titre}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {annonce.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {annonce.ville}, {annonce.gouvernorat}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                        />
                      </svg>
                      {annonce.surface} m²
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">
                      {annonce.prix?.toLocaleString()} TND
                    </span>
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {annonce.statut}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {annonces.length > 6 && (
          <div className="text-center mt-8">
            <Link
              to="/annonces"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Voir toutes les annonces →
            </Link>
          </div>
        )}
      </div>

      {/* Fonctionnalités */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Pourquoi choisir AmeniImmo ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Recherche facile</h3>
              <p className="text-gray-600">
                Trouvez rapidement le bien qui vous correspond
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Annonces vérifiées</h3>
              <p className="text-gray-600">
                Toutes les annonces sont approuvées par nos administrateurs
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Disponibilité 24/7</h3>
              <p className="text-gray-600">
                Accédez aux annonces à tout moment, où que vous soyez
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Accueil;
