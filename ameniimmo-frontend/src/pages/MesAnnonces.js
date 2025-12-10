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
      await axios.delete(`http://127.0.0.1:8000/api/annonces/${id}/`, {
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Annonces</h1>
            <p className="text-gray-600">Gérez vos annonces immobilières</p>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{annonces.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Approuvées</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {annonces.filter((a) => a.approuve).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">En Attente</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">
                  {annonces.filter((a) => !a.approuve).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des annonces */}
        {annonces.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune annonce</h3>
            <p className="text-gray-600 mb-6">Commencez par créer votre première annonce</p>
            <Link
              to="/annonces/creer"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Créer une annonce
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {annonces.map((annonce) => (
              <div key={annonce.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-200">
                {/* Image placeholder */}
                <div className="h-48 bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                  <svg className="w-16 h-16 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>

                <div className="p-6">
                  {/* Badge statut */}
                  <div className="mb-3">
                    {annonce.approuve ? (
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        ✓ Approuvée
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                        ⏱ En attente
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">{annonce.titre}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{annonce.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {annonce.ville}, {annonce.gouvernorat}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                      {annonce.surface} m²
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-blue-600">
                      {annonce.prix?.toLocaleString()} TND
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDelete(annonce.id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition"
                    >
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
