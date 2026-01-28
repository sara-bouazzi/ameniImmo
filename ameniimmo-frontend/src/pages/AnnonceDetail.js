import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import FavoriteButton from "../components/FavoriteButton";

function AnnonceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [annonce, setAnnonce] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchAnnonce();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchAnnonce = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
      const response = await axios.get(`${API_URL}/api/annonces/${id}/`);
      setAnnonce(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Erreur lors du chargement:", err);
      setError("Impossible de charger l'annonce");
      setLoading(false);
    }
  };

  const formatPrice = (value) => {
    if (value == null) return "-";
    try {
      return Number(value).toLocaleString("fr-FR");
    } catch {
      return value;
    }
  };

  const nextImage = () => {
    if (annonce?.images && annonce.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % annonce.images.length);
    }
  };

  const prevImage = () => {
    if (annonce?.images && annonce.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + annonce.images.length) % annonce.images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-gray-50 to-secondary-50">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-primary-200"></div>
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-primary-700 border-t-transparent absolute top-0"></div>
        </div>
      </div>
    );
  }

  if (error || !annonce) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-gray-50 to-secondary-50">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Annonce introuvable</h2>
          <p className="text-gray-600 mb-6">{error || "Cette annonce n'existe pas ou a été supprimée"}</p>
          <button onClick={() => navigate("/annonces")} className="btn-primary">
            Retour aux annonces
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-gray-50 to-secondary-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Bouton retour */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-gray-600 hover:text-primary-700 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images carousel */}
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="relative h-96 bg-gradient-to-br from-primary-500 to-primary-700 overflow-hidden">
                {annonce.images && annonce.images.length > 0 ? (
<>
                    {/* Image principale */}
                    <img
                      src={annonce.images[currentImageIndex].image}
                      alt={annonce.titre}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    
                    {/* Boutons de navigation */}
                    {annonce.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                        
                        {/* Indicateur d'images */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                          {annonce.images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`w-2 h-2 rounded-full transition-all ${
                                index === currentImageIndex ? 'bg-white w-8' : 'bg-white/50'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/10 backdrop-blur-sm rounded-full p-8">
                      <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                      </svg>
                    </div>
                  </div>
                )}
                
                {/* Badge statut */}
                {annonce.statut && (
                  <div className="absolute top-6 left-6">
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-white text-gray-800 shadow-lg">
                      {annonce.statut}
                    </span>
                  </div>
                )}

                {/* Bouton Favori */}
                {user && user.role === "visiteur" && (
                  <div className="absolute top-6 right-6">
                    <FavoriteButton annonceId={annonce.id} />
                  </div>
                )}
              </div>
              
              {/* Miniatures */}
              {annonce.images && annonce.images.length > 1 && (
                <div className="p-4 bg-gray-50">
                  <div className="flex gap-2 overflow-x-auto">
                    {annonce.images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentImageIndex ? 'border-primary-600' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={img.image}
                          alt={`Miniature ${index + 1}`}
                          className="absolute inset-0 w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Détails */}
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-gray-100">
              <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">{annonce.titre}</h1>
              
              {/* Localisation */}
              <div className="flex items-center text-gray-600 mb-6">
                <svg className="w-5 h-5 mr-2 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="text-lg">{annonce.ville}, {annonce.gouvernorat} - {annonce.region}</span>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{annonce.description}</p>
              </div>

              {/* Caractéristiques */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Caractéristiques</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center mb-2">
                      <svg className="w-5 h-5 text-primary-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                      <span className="text-sm font-medium text-gray-600">Surface</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{annonce.surface} m²</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center mb-2">
                      <svg className="w-5 h-5 text-primary-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-600">Type</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{annonce.type_bien || "Immobilier"}</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center mb-2">
                      <svg className="w-5 h-5 text-primary-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-600">Fonctionnalité</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{annonce.fonctionnalite}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne latérale */}
          <div className="lg:col-span-1">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-gray-100 sticky top-8">
              <div className="text-center mb-6">
                <p className="text-sm text-gray-500 mb-2">Prix</p>
                <p className="text-5xl font-bold gradient-text mb-1">
                  {formatPrice(annonce.prix)}
                </p>
                <p className="text-gray-600 text-lg">TND</p>
              </div>

              <div className="border-t border-gray-200 pt-6 space-y-4">
                {/* Contact */}
                <a
                  href="tel:+21656101017"
                  className="flex items-center justify-center w-full bg-gradient-to-r from-primary-700 to-primary-600 hover:from-primary-800 hover:to-primary-700 text-white py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Appeler
                </a>

                <a
                  href="mailto:med.ouerfelli2@gmail.com"
                  className="flex items-center justify-center w-full bg-white border-2 border-primary-600 text-primary-700 hover:bg-primary-50 py-3 rounded-xl font-semibold transition-all"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Envoyer un email
                </a>
              </div>

              {/* Informations agence */}
              <div className="border-t border-gray-200 mt-6 pt-6">
                <h3 className="font-bold text-gray-900 mb-3">AMENI iMo</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Agence Immobilière agréée par l'état
                </p>
                <div className="space-y-2 text-sm text-gray-600">
                  <p className="flex items-start">
                    <svg className="w-4 h-4 mr-2 mt-0.5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    Résidence Layla, Bloc B, El Mourouj
                  </p>
                  <p className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    Lun-Sam: 09:00-18:00
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnnonceDetail;
