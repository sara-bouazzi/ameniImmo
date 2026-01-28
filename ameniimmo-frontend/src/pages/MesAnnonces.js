import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function MesAnnonces() {
  const { user, authTokens } = useContext(AuthContext);
  const navigate = useNavigate();
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est propriétaire
    if (!user || user.role !== "owner") {
      navigate("/");
      return;
    }
    fetchMesAnnonces();
  }, [user, navigate]);

  const fetchMesAnnonces = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/annonces/", {
        headers: {
          Authorization: `Bearer ${authTokens?.access}`,
        },
      });
      // Filtrer uniquement les annonces du propriétaire connecté
      const mesAnnonces = response.data.filter(
        (annonce) => annonce.proprietaire === user.id
      );
      setAnnonces(mesAnnonces);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement des annonces:", error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette annonce ?")) {
      return;
    }
    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
      await axios.delete(`${API_URL}/api/annonces/${id}/`, {
        headers: {
          Authorization: `Bearer ${authTokens?.access}`,
        },
      });
      fetchMesAnnonces();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Erreur lors de la suppression de l'annonce");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-gray-50 to-secondary-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête moderne */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-display font-bold gradient-text mb-3 flex items-center">
              <svg className="w-10 h-10 text-primary-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Mes Annonces
            </h1>
            <p className="text-gray-600 text-lg">Gérez et suivez vos biens immobiliers</p>
          </div>
          <Link
            to="/annonces/creer"
            className="inline-flex items-center justify-center bg-gradient-to-r from-primary-700 to-primary-600 text-white px-6 py-3.5 rounded-xl font-semibold hover:shadow-glow transition-all transform hover:scale-[1.02]"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nouvelle Annonce
          </Link>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-gray-100 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide">Total</p>
                <p className="text-4xl font-bold gradient-text mt-3">{annonces.length}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-gray-100 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide">Approuvées</p>
                <p className="text-4xl font-bold text-green-600 mt-3">
                  {annonces.filter((a) => a.approuve).length}
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-gray-100 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide">En Attente</p>
                <p className="text-4xl font-bold text-orange-600 mt-3">
                  {annonces.filter((a) => !a.approuve).length}
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des annonces */}
        {annonces.length === 0 ? (
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-16 text-center border border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Aucune annonce</h3>
            <p className="text-gray-600 text-lg mb-6">Commencez par créer votre première annonce</p>
            <Link
              to="/annonces/creer"
              className="inline-flex items-center bg-gradient-to-r from-primary-700 to-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-glow transition-all transform hover:scale-[1.02]"
            >
              Créer une annonce
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {annonces.map((annonce) => (
              <div 
                key={annonce.id} 
                className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-gray-100 transform hover:scale-105 transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/annonces/${annonce.id}`)}
              >
                {/* Image de l'annonce */}
                <div className="h-56 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center relative overflow-hidden">
                  {annonce.images && annonce.images.length > 0 ? (
                    <>
                      <img
                        src={annonce.images[0].image}
                        alt={annonce.titre}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      <div className="absolute inset-0 bg-black/10"></div>
                      
                      {/* Badge nombre d'images */}
                      {annonce.images.length > 1 && (
                        <div className="absolute bottom-4 left-4 z-10">
                          <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold bg-black/50 text-white backdrop-blur-sm">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {annonce.images.length}
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-black/10"></div>
                      <svg className="w-20 h-20 text-white opacity-40 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </>
                  )}
                  
                  {/* Badge statut en haut */}
                  <div className="absolute top-4 right-4">
                    {annonce.approuve ? (
                      <span className="px-3 py-1.5 text-xs font-bold rounded-full bg-green-500 text-white shadow-lg flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Approuvée
                      </span>
                    ) : (
                      <span className="px-3 py-1.5 text-xs font-bold rounded-full bg-orange-500 text-white shadow-lg flex items-center">
                        <svg className="w-4 h-4 mr-1 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        En attente
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{annonce.titre}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{annonce.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {annonce.ville}, {annonce.gouvernorat}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                      {annonce.surface} m²
                    </div>
                  </div>

                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <span className="text-3xl font-bold gradient-text">
                      {annonce.prix?.toLocaleString()} TND
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {!annonce.approuve && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Implémenter la modification
                          navigate(`/annonces/modifier/${annonce.id}`);
                        }}
                        className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-4 py-2.5 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center justify-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Modifier
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(annonce.id);
                      }}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MesAnnonces;
