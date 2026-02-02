import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function ModifierAnnonce() {
  const { user, authTokens } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();
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
    type_bien: "Immobilier",
    approuve: false,
  });
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est admin ou owner
    if (!user || (user.role !== "admin" && user.role !== "owner")) {
      navigate("/");
      return;
    }
    fetchAnnonce();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate, id]);

  const fetchAnnonce = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
      const response = await axios.get(`${API_URL}/api/annonces/${id}/`, {
        headers: {
          Authorization: `Bearer ${authTokens?.access}`,
        },
      });
      
      const annonce = response.data;
      
      // Vérifier si l'utilisateur a le droit de modifier cette annonce
      if (user.role !== "admin" && annonce.proprietaire !== user.id) {
        alert("Vous n'êtes pas autorisé à modifier cette annonce");
        navigate("/");
        return;
      }

      setFormData({
        titre: annonce.titre || "",
        description: annonce.description || "",
        prix: annonce.prix || "",
        surface: annonce.surface || "",
        region: annonce.region || "",
        ville: annonce.ville || "",
        gouvernorat: annonce.gouvernorat || "",
        fonctionnalite: annonce.fonctionnalite || "",
        statut: annonce.statut || "à louer",
        type_bien: annonce.type_bien || "Immobilier",
        approuve: annonce.approuve || false,
      });
      
      setExistingImages(annonce.images || []);
      setLoadingData(false);
    } catch (err) {
      console.error("Erreur lors du chargement:", err);
      setError("Impossible de charger l'annonce");
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files);

    // Créer les aperçus des images
    const previews = files.map(file => URL.createObjectURL(file));
    setNewImagePreviews(previews);
  };

  const removeNewImage = (index) => {
    const updatedImages = newImages.filter((_, i) => i !== index);
    const updatedPreviews = newImagePreviews.filter((_, i) => i !== index);
    setNewImages(updatedImages);
    setNewImagePreviews(updatedPreviews);
  };

  const removeExistingImage = async (imageId, index) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette image ?")) {
      return;
    }

    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
      await axios.delete(`${API_URL}/api/annonces/${id}/delete_image/`, {
        headers: {
          Authorization: `Bearer ${authTokens?.access}`,
          "Content-Type": "application/json",
        },
        data: { image_id: imageId },
      });
      
      setExistingImages(existingImages.filter((_, i) => i !== index));
    } catch (err) {
      console.error("Erreur lors de la suppression de l'image:", err);
      alert("Erreur lors de la suppression de l'image");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Empêcher la double soumission
    if (loading) return;
    
    // Validation des champs requis
    if (!formData.titre || !formData.prix || !formData.surface) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    // Validation des nombres
    const prix = parseFloat(formData.prix);
    const surface = parseFloat(formData.surface);
    
    if (isNaN(prix) || prix <= 0) {
      setError("Le prix doit être un nombre positif");
      return;
    }
    
    if (isNaN(surface) || surface <= 0) {
      setError("La surface doit être un nombre positif");
      return;
    }
    
    setError(null);
    setLoading(true);

    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
      
      // Mettre à jour l'annonce
      await axios.put(
        `${API_URL}/api/annonces/${id}/`,
        {
          ...formData,
          prix: prix,
          surface: surface,
        },
        {
          headers: {
            Authorization: `Bearer ${authTokens?.access}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Upload des nouvelles images si présentes
      if (newImages.length > 0) {
        const imageFormData = new FormData();
        
        newImages.forEach((image) => {
          imageFormData.append('images', image);
        });

        await axios.post(
          `${API_URL}/api/annonces/${id}/upload_images/`,
          imageFormData,
          {
            headers: {
              Authorization: `Bearer ${authTokens?.access}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      alert("Annonce modifiée avec succès");
      
      // Redirection selon le rôle
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/mes-annonces");
      }
    } catch (err) {
      console.error("Erreur lors de la modification:", err);
      setError(err.response?.data || "Erreur lors de la modification de l'annonce");
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-gray-50 to-secondary-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête moderne */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h1 className="text-4xl font-display font-bold gradient-text mb-3">
            {user.role === "admin" ? "Modifier l'annonce (Admin)" : "Modifier mon annonce"}
          </h1>
          <p className="text-gray-600 text-lg">Mettez à jour les informations de votre bien</p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 md:p-10 border border-gray-100">
          <div className="space-y-6">
            {/* Type de bien */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Type de bien <span className="text-red-500">*</span>
              </label>
              <select
                name="type_bien"
                value={formData.type_bien}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none"
                required
              >
                <option value="Immobilier">Immobilier</option>
                <option value="Logement">Logement</option>
                <option value="Terrain">Terrain</option>
                <option value="Espace de travail">Espace de travail</option>
                <option value="Place de parc">Place de parc</option>
              </select>
            </div>

            {/* Titre */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Titre de l'annonce <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="titre"
                value={formData.titre}
                onChange={handleChange}
                placeholder="Ex: Appartement spacieux 3 pièces"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                placeholder="Décrivez votre bien en détail..."
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none resize-none"
              ></textarea>
            </div>

            {/* Prix et Surface */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Prix (TND) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="prix"
                  value={formData.prix}
                  onChange={handleChange}
                  placeholder="150000"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Surface (m²) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="surface"
                  value={formData.surface}
                  onChange={handleChange}
                  placeholder="120"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Localisation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Gouvernorat
                </label>
                <input
                  type="text"
                  name="gouvernorat"
                  value={formData.gouvernorat}
                  onChange={handleChange}
                  placeholder="Tunis"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ville
                </label>
                <input
                  type="text"
                  name="ville"
                  value={formData.ville}
                  onChange={handleChange}
                  placeholder="El Mourouj"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Région
                </label>
                <input
                  type="text"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  placeholder="El Mourouj 1"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none"
                />
              </div>
            </div>

            {/* Fonctionnalité et Statut */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fonctionnalité
                </label>
                <input
                  type="text"
                  name="fonctionnalite"
                  value={formData.fonctionnalite}
                  onChange={handleChange}
                  placeholder="Résidentiel"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Statut
                </label>
                <select
                  name="statut"
                  value={formData.statut}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none"
                >
                  <option value="à louer">À louer</option>
                  <option value="à vendre">À vendre</option>
                </select>
              </div>
            </div>

            {/* Approbation (Admin seulement) */}
            {user.role === "admin" && (
              <div className="border-2 border-primary-200 bg-primary-50 rounded-xl p-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="approuve"
                    checked={formData.approuve}
                    onChange={handleChange}
                    className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                  />
                  <span className="ml-3 text-sm font-semibold text-gray-700">
                    Approuver cette annonce
                  </span>
                </label>
                <p className="text-xs text-gray-600 mt-2 ml-8">
                  Les annonces approuvées seront visibles par tous les utilisateurs
                </p>
              </div>
            )}

            {/* Images existantes */}
            {existingImages.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Images actuelles
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {existingImages.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img.image}
                        alt={`Image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-xl border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(img.id, index)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nouvelles images */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Ajouter de nouvelles images
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-primary-500 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <p className="text-sm text-gray-600">Cliquez pour ajouter des images</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG jusqu'à 10MB</p>
                </label>
              </div>

              {/* Aperçu des nouvelles images */}
              {newImagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {newImagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Nouveau ${index + 1}`}
                        className="w-full h-32 object-cover rounded-xl border-2 border-primary-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Message d'erreur */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-red-700 font-medium">{typeof error === 'object' ? JSON.stringify(error) : error}</p>
                </div>
              </div>
            )}

            {/* Boutons d'action */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3.5 rounded-xl font-semibold transition-all"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3.5 rounded-xl font-semibold transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Modification en cours...
                  </span>
                ) : (
                  "Enregistrer les modifications"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModifierAnnonce;
