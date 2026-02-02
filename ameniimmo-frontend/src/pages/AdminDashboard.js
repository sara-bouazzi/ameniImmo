import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function AdminDashboard() {
  const { user, authTokens } = useContext(AuthContext);
  const navigate = useNavigate();
  const [annonces, setAnnonces] = useState([]);
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending"); // "all", "pending", "approved"

  useEffect(() => {
    // Vérifier si l'utilisateur est admin
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }
    fetchAnnonces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate]);

  const fetchAnnonces = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
      const response = await axios.get(`${API_URL}/api/annonces/`, {
        headers: {
          Authorization: `Bearer ${authTokens?.access}`,
        },
      });
      const data = response.data;
      setAnnonces(data);
      
      // Calculer les statistiques
      const total = data.length;
      const approved = data.filter((a) => a.approuve === true).length;
      const pending = data.filter((a) => a.approuve === false).length;
      setStats({ total, approved, pending });
      
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement des annonces:", error);
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
      await axios.patch(
        `${API_URL}/api/annonces/${id}/`,
        { approuve: true },
        {
          headers: {
            Authorization: `Bearer ${authTokens?.access}`,
            "Content-Type": "application/json",
          },
        }
      );
      // Rafraîchir la liste
      fetchAnnonces();
    } catch (error) {
      console.error("Erreur lors de l'approbation:", error);
      alert("Erreur lors de l'approbation de l'annonce");
    }
  };

  const handleReject = async (id) => {
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
      // Rafraîchir la liste
      fetchAnnonces();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Erreur lors de la suppression de l'annonce");
    }
  };

  const filteredAnnonces = annonces.filter((annonce) => {
    if (filter === "pending") return annonce.approuve === false;
    if (filter === "approved") return annonce.approuve === true;
    return true; // "all"
  });

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
        <div className="mb-10">
          <h1 className="text-4xl font-display font-bold gradient-text mb-3 flex items-center">
            <svg className="w-10 h-10 text-primary-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            Dashboard Administrateur
          </h1>
          <p className="text-gray-600 text-lg">Gérez et validez les annonces immobilières</p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-gray-100 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide">Total Annonces</p>
                <p className="text-4xl font-bold gradient-text mt-3">{stats.total}</p>
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
                <p className="text-4xl font-bold text-green-600 mt-3">{stats.approved}</p>
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
                <p className="text-4xl font-bold text-orange-600 mt-3">{stats.pending}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Filtrer les annonces</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setFilter("pending")}
              className={`px-6 py-4 rounded-xl font-bold text-lg transition transform hover:scale-105 ${
                filter === "pending"
                  ? "bg-orange-500 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <div className="flex items-center justify-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                En Attente ({stats.pending})
              </div>
            </button>
            <button
              onClick={() => setFilter("approved")}
              className={`px-6 py-4 rounded-xl font-bold text-lg transition transform hover:scale-105 ${
                filter === "approved"
                  ? "bg-green-500 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <div className="flex items-center justify-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Approuvées ({stats.approved})
              </div>
            </button>
            <button
              onClick={() => setFilter("all")}
              className={`px-6 py-4 rounded-xl font-bold text-lg transition transform hover:scale-105 ${
                filter === "all"
                  ? "bg-blue-500 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <div className="flex items-center justify-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                Toutes ({stats.total})
              </div>
            </button>
          </div>
        </div>

        {/* Liste des annonces en cartes */}
        {filteredAnnonces.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-2xl text-gray-500 font-semibold">Aucune annonce à afficher</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredAnnonces.map((annonce) => (
              <div key={annonce.id} className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-gray-100 hover:shadow-2xl transition-all">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6">
                  {/* Image */}
                  <div className="md:col-span-3">
                    <div className="relative h-48 md:h-full bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl overflow-hidden">
                      {annonce.images && annonce.images.length > 0 ? (
                        <img
                          src={annonce.images[0].image}
                          alt={annonce.titre}
                          className="absolute inset-0 w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg className="w-16 h-16 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                        </div>
                      )}
                      {/* Badge statut */}
                      <div className="absolute top-3 right-3">
                        {annonce.approuve ? (
                          <span className="px-3 py-1.5 text-sm font-bold rounded-full bg-green-500 text-white shadow-lg flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Approuvée
                          </span>
                        ) : (
                          <span className="px-3 py-1.5 text-sm font-bold rounded-full bg-orange-500 text-white shadow-lg flex items-center">
                            <svg className="w-4 h-4 mr-1 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            En attente
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Informations */}
                  <div className="md:col-span-5">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{annonce.titre}</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center text-lg">
                        <svg className="w-6 h-6 text-primary-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span className="font-semibold text-gray-700">Type:</span>
                        <span className="ml-2 text-gray-900">{annonce.type_bien || annonce.statut}</span>
                      </div>
                      
                      <div className="flex items-center text-lg">
                        <svg className="w-6 h-6 text-primary-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        <span className="font-semibold text-gray-700">Ville:</span>
                        <span className="ml-2 text-gray-900">{annonce.ville}</span>
                      </div>
                      
                      <div className="flex items-center text-lg">
                        <svg className="w-6 h-6 text-primary-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                        <span className="font-semibold text-gray-700">Surface:</span>
                        <span className="ml-2 text-gray-900">{annonce.surface} m²</span>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="bg-primary-50 px-4 py-2 rounded-xl border-2 border-primary-200">
                          <span className="text-3xl font-bold text-primary-700">{annonce.prix?.toLocaleString()} TND</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="md:col-span-4">
                    <h4 className="text-lg font-bold text-gray-700 mb-4">Actions</h4>
                    <div className="space-y-3">
                      <button
                        onClick={() => navigate(`/annonces/${annonce.id}`)}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center"
                      >
                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Voir
                      </button>
                      
                      <button
                        onClick={() => navigate(`/annonces/modifier/${annonce.id}`)}
                        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center"
                      >
                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Modifier
                      </button>
                      
                      {!annonce.approuve && (
                        <button
                          onClick={() => handleApprove(annonce.id)}
                          className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center"
                        >
                          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Approuver
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleReject(annonce.id)}
                        className="w-full bg-red-500 hover:bg-red-600 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center"
                      >
                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Supprimer
                      </button>
                    </div>
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

export default AdminDashboard;
