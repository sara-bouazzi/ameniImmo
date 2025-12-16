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
  }, [user, navigate]);

  const fetchAnnonces = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/annonces/", {
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
      await axios.patch(
        `http://127.0.0.1:8000/api/annonces/${id}/`,
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
      await axios.delete(`http://127.0.0.1:8000/api/annonces/${id}/`, {
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
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setFilter("pending")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === "pending"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              En Attente ({stats.pending})
            </button>
            <button
              onClick={() => setFilter("approved")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === "approved"
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Approuvées ({stats.approved})
            </button>
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === "all"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Toutes ({stats.total})
            </button>
          </div>
        </div>

        {/* Liste des annonces */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {filteredAnnonces.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Aucune annonce à afficher
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Titre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prix
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ville
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAnnonces.map((annonce) => (
                    <tr key={annonce.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{annonce.titre}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{annonce.type_bien || annonce.statut}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-blue-600">
                          {annonce.prix?.toLocaleString()} TND
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{annonce.ville}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {annonce.approuve ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Approuvée
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                            En attente
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {!annonce.approuve && (
                            <button
                              onClick={() => handleApprove(annonce.id)}
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg transition"
                            >
                              Approuver
                            </button>
                          )}
                          <button
                            onClick={() => handleReject(annonce.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition"
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
