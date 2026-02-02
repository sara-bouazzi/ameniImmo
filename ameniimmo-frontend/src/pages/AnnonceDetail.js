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

  const handleEmailClick = () => {
    const subject = `Demande d'information : ${annonce.titre}`;
    const body = `Bonjour,\n\nJe suis intéressé par cette annonce :\n${annonce.titre}\nPrix : ${formatPrice(annonce.prix)} TND\n\nMerci de me contacter.\n\nCordialement`;
    window.location.href = `mailto:sarra.bouazzi2002@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Bouton retour */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex items-center px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md text-gray-700 hover:text-primary-600 transition-all"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-4">
            {/* Images carousel */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="relative h-[400px] bg-gray-900 overflow-hidden">
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
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all backdrop-blur-sm"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all backdrop-blur-sm"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                        
                        {/* Indicateur d'images */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/30 backdrop-blur-sm px-3 py-2 rounded-full">
                          {annonce.images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`h-2 rounded-full transition-all ${
                                index === currentImageIndex ? 'bg-white w-8' : 'bg-white/50 w-2'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                    <div className="text-center">
                      <svg className="w-20 h-20 text-gray-600 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                      </svg>
                      <p className="text-gray-500 text-sm">Aucune image disponible</p>
                    </div>
                  </div>
                )}
                
                {/* Badge statut */}
                {annonce.statut && (
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-primary-600 text-white shadow-lg uppercase">
                      {annonce.statut}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Miniatures */}
              {annonce.images && annonce.images.length > 1 && (
                <div className="p-3 bg-gray-100 border-t border-gray-200">
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {annonce.images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentImageIndex ? 'border-primary-600 ring-2 ring-primary-200' : 'border-gray-300 opacity-70 hover:opacity-100 hover:border-gray-400'
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

            {/* En-tête avec titre, localisation et prix */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{annonce.titre}</h1>
                    <div className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 mr-2 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">{annonce.ville}, {annonce.gouvernorat}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-sm text-gray-500 mb-1">Prix</p>
                    <p className="text-3xl font-bold text-primary-600">{formatPrice(annonce.prix)} <span className="text-lg">TND</span></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Caractéristiques */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                <svg className="w-6 h-6 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Caractéristiques
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                  <svg className="w-5 h-5 text-primary-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <div>
                    <p className="text-xs text-gray-500">Type</p>
                    <p className="font-semibold text-gray-900 text-sm">{annonce.type_bien || "Immobilier"}</p>
                  </div>
                </div>
                <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                  <svg className="w-5 h-5 text-primary-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  <div>
                    <p className="text-xs text-gray-500">Superficie</p>
                    <p className="font-semibold text-gray-900 text-sm">{annonce.surface} m²</p>
                  </div>
                </div>
                <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                  <svg className="w-5 h-5 text-primary-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <div>
                    <p className="text-xs text-gray-500">Usage</p>
                    <p className="font-semibold text-gray-900 text-sm">{annonce.fonctionnalite}</p>
                  </div>
                </div>
                <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                  <svg className="w-5 h-5 text-primary-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-xs text-gray-500">Région</p>
                    <p className="font-semibold text-gray-900 text-sm">{annonce.region}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                <svg className="w-6 h-6 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{annonce.description}</p>
            </div>
          </div>

          {/* Colonne latérale - Informations de contact */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Nous contacter
              </h3>
              <p className="text-gray-600 text-sm mb-4">Intéressé par cette annonce ? Contactez-nous !</p>
              <div className="space-y-3">
                <a
                  href="tel:+21656101017"
                  className="flex items-center justify-center w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-semibold transition-colors shadow-sm"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  56 10 10 17
                </a>

                <a
                  href={`https://wa.me/21656101017?text=${encodeURIComponent('Bonjour, je suis intéressé par : ' + annonce.titre + ' - ' + formatPrice(annonce.prix) + ' TND')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full bg-[#25D366] hover:bg-[#20BA5A] text-white py-3 rounded-lg font-semibold transition-colors shadow-sm"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </a>

                <button
                  onClick={handleEmailClick}
                  className="flex items-center justify-center w-full bg-white border-2 border-gray-300 text-gray-700 hover:border-primary-600 hover:text-primary-600 py-3 rounded-lg font-semibold transition-all shadow-sm cursor-pointer"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email
                </button>

                {user && user.role === "visiteur" && (
                  <div className="pt-3 border-t border-gray-200">
                    <FavoriteButton annonceId={annonce.id} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions Admin - En bas pour les admins */}
          {user && user.role === "admin" && (
            <div className="lg:col-span-3 mt-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
                  <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Actions Administrateur
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button
                      onClick={() => navigate(`/annonces/modifier/${annonce.id}`)}
                      className="flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors shadow-sm"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Modifier
                    </button>
                    <button
                      onClick={async () => {
                        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) {
                          try {
                            const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
                            const authTokens = JSON.parse(localStorage.getItem("authTokens"));
                            await axios.delete(`${API_URL}/api/annonces/${annonce.id}/`, {
                              headers: {
                                Authorization: `Bearer ${authTokens?.access}`,
                              },
                            });
                            alert("Annonce supprimée avec succès");
                            navigate("/annonces");
                          } catch (error) {
                            console.error("Erreur lors de la suppression:", error);
                            alert("Erreur lors de la suppression de l'annonce");
                          }
                        }
                      }}
                      className="flex items-center justify-center w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-colors shadow-sm"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default AnnonceDetail;
