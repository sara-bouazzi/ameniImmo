import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function CreerAnnonce() {
  const { user, authTokens } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    prix: "",
    surface: "",
    region: "",
    ville: "",
    gouvernorat: "",
    fonctionnalite: "",
    statut: "à louer",
    type_bien: "Immobilier", // Type de bien
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/annonces/",
        {
          ...formData,
          prix: parseFloat(formData.prix),
          surface: parseFloat(formData.surface),
          approuve: false, // Par défaut en attente d'approbation
        },
        {
          headers: {
            Authorization: `Bearer ${authTokens?.access}`,
            "Content-Type": "application/json",
          },
        }
      );
      // Redirection vers "Mes Annonces"
      navigate("/mes-annonces");
    } catch (err) {
      console.error("Erreur lors de la création:", err);
      setError(err.response?.data || "Erreur lors de la création de l'annonce");
      setLoading(false);
    }
  };

  if (!user || user.role !== "owner") {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Créer une annonce</h1>
          <p className="text-gray-600">Publiez votre bien immobilier</p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
          <div className="space-y-6">
            {/* Type de bien */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Type de bien *
              </label>
              <select
                name="type_bien"
                value={formData.type_bien}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Immobilier">Immobilier (Général)</option>
                <option value="Logement">Logement</option>
                <option value="Terrain">Terrain</option>
                <option value="Espace de travail">Espace de travail</option>
                <option value="Place de parc">Place de parc</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Sélectionnez le type de bien immobilier
              </p>
            </div>

            {/* Titre */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Titre de l'annonce *
              </label>
              <input
                type="text"
                name="titre"
                value={formData.titre}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Appartement F3 centre-ville"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Décrivez votre bien en détail..."
              />
            </div>

            {/* Prix et Surface */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Prix (TND) *
                </label>
                <input
                  type="number"
                  name="prix"
                  value={formData.prix}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="150000"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Surface (m²) *
                </label>
                <input
                  type="number"
                  name="surface"
                  value={formData.surface}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="85"
                />
              </div>
            </div>

            {/* Localisation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Gouvernorat *
                </label>
                <input
                  type="text"
                  name="gouvernorat"
                  value={formData.gouvernorat}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tunis"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ville *
                </label>
                <input
                  type="text"
                  name="ville"
                  value={formData.ville}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ariana"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Région *
                </label>
                <input
                  type="text"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ghazela"
                />
              </div>
            </div>

            {/* Fonctionnalité et Statut */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fonctionnalité *
                </label>
                <input
                  type="text"
                  name="fonctionnalite"
                  value={formData.fonctionnalite}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: résidentiel, commercial..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Statut *
                </label>
                <select
                  name="statut"
                  value={formData.statut}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="à louer">À louer</option>
                  <option value="à vendre">À vendre</option>
                </select>
              </div>
            </div>

            {/* Message d'erreur */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {typeof error === 'string' ? error : JSON.stringify(error)}
              </div>
            )}

            {/* Boutons */}
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate("/mes-annonces")}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold transition"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {loading ? "Création..." : "Créer l'annonce"}
              </button>
            </div>

            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>ℹ️ Information :</strong> Votre annonce sera soumise à l'approbation d'un administrateur avant d'être publiée.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreerAnnonce;
