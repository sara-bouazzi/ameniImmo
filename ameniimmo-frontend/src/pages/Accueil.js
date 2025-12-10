import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import SearchBar from "../components/SearchBar";
import Testimonials from "../components/Testimonials";

function Accueil() {
  const { user } = useContext(AuthContext);
  const [annonces, setAnnonces] = useState([]);
  const [stats, setStats] = useState({
    biensDisponibles: 0,
    clientsSatisfaits: 0,
    anneesExperience: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Récupérer les annonces
      const annoncesResponse = await axios.get("http://127.0.0.1:8000/api/annonces/");
      const approuvees = annoncesResponse.data.filter((a) => a.approuve === true);
      setAnnonces(approuvees);

      // Calculer les années d'expérience (depuis 2010)
      const anneeDebut = 2010;
      const anneeActuelle = new Date().getFullYear();
      const experience = anneeActuelle - anneeDebut;

      // Récupérer les utilisateurs pour compter les clients
      let clientsCount = 2; // Valeur par défaut
      try {
        const usersResponse = await axios.get("http://127.0.0.1:8000/api/users/");
        const clients = usersResponse.data.filter((u) => u.role === 'visiteur' || u.role === 'owner');
        clientsCount = clients.length;
      } catch (userError) {
        console.log("Impossible de récupérer les utilisateurs, utilisation de la valeur par défaut");
      }

      setStats({
        biensDisponibles: approuvees.length,
        clientsSatisfaits: clientsCount,
        anneesExperience: experience
      });

      setLoading(false);
    } catch (error) {
      console.error("Erreur:", error);
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-700 via-primary-600 to-secondary-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-display font-bold leading-tight">
              Trouvez Votre
              <span className="block">Bien Immobilier Idéal</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto font-light">
              L'expertise immobilière en Tunisie - Votre partenaire de confiance
            </p>

            {!user && (
              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                <Link to="/annonces" className="btn-primary">
                  Voir les annonces
                </Link>
                <Link to="/register" className="btn-secondary">
                  S'inscrire
                </Link>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-16">
              <div className="text-center">
                <div className="text-4xl font-bold">{stats.biensDisponibles}+</div>
                <div className="text-gray-200 mt-2">Biens disponibles</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold">{stats.clientsSatisfaits}+</div>
                <div className="text-gray-200 mt-2">Clients satisfaits</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold">{stats.anneesExperience}+</div>
                <div className="text-gray-200 mt-2">Années d'expérience</div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" className="w-full">
            <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Barre de recherche avancée */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SearchBar />
      </div>

      {/* Catégories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">
            Nos <span className="gradient-text">Catégories</span>
          </h2>
          <p className="text-gray-600 text-lg">Découvrez notre large sélection de biens immobiliers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { icon: "🏠", title: "Appartements", count: "120+" },
            { icon: "🏡", title: "Maisons", count: "85+" },
            { icon: "🏢", title: "Locaux commerciaux", count: "45+" },
            { icon: "🏞️", title: "Terrains", count: "60+" }
          ].map((cat, idx) => (
            <div key={idx} className="card p-6 text-center group cursor-pointer transform hover:-translate-y-2">
              <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform">{cat.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{cat.title}</h3>
              <p className="text-primary-600 font-semibold">{cat.count} biens</p>
            </div>
          ))}
        </div>
      </div>

      {/* Annonces */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">
                Annonces <span className="gradient-text">Récentes</span>
              </h2>
              <p className="text-gray-600 text-lg">Les dernières offres disponibles</p>
            </div>
            <Link to="/annonces" className="hidden md:inline-flex items-center text-primary-700 font-semibold hover:text-primary-800 transition-colors group">
              Voir tout
              <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200"></div>
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-700 border-t-transparent absolute top-0"></div>
              </div>
            </div>
          ) : annonces.length === 0 ? (
            <div className="text-center py-20 card">
              <p className="text-gray-600 text-xl font-medium">Aucune annonce disponible</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {annonces.slice(0, 6).map((annonce) => (
                <div key={annonce.id} className="card group cursor-pointer transform hover:-translate-y-2">
                  <div className="relative h-56 bg-gradient-to-br from-primary-400 to-primary-600 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-20 h-20 text-white opacity-30" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                      </svg>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-1 group-hover:text-primary-700 transition-colors">
                      {annonce.titre}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {annonce.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Prix</p>
                        <p className="text-2xl font-bold gradient-text">
                          {formatPrice(annonce.prix)}
                        </p>
                      </div>
                      <button className="bg-primary-700 text-white p-3 rounded-lg hover:shadow-glow transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Témoignages Clients */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">
              Ce que disent <span className="gradient-text">nos clients</span>
            </h2>
            <p className="text-gray-600 text-lg">Témoignages de clients satisfaits</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Témoignage 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">
                "Service exceptionnel ! J'ai trouvé ma maison de rêve en moins d'un mois. L'équipe est très professionnelle et à l'écoute."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  K
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">Karim Layouni</h4>
                  <p className="text-sm text-gray-500">Acheteur - Tunis</p>
                </div>
              </div>
            </div>

            {/* Témoignage 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">
                "Excellent accompagnement du début à la fin. La plateforme est intuitive et les annonces sont de qualité."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  A
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">Afifa Lahiani</h4>
                  <p className="text-sm text-gray-500">Propriétaire - Sousse</p>
                </div>
              </div>
            </div>

            {/* Témoignage 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">
                "Une expérience formidable ! Processus rapide et transparent. Je recommande vivement Ameni Immo."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  M
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">Mohamed Ramzi</h4>
                  <p className="text-sm text-gray-500">Locataire - Hammamet</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Témoignages avec Carousel */}
      <Testimonials />

      {/* CTA */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-display font-bold mb-4">Prêt à trouver votre bien idéal ?</h2>
          <p className="text-xl mb-8 text-gray-100">
            Rejoignez des centaines de clients satisfaits
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/annonces" className="btn-secondary">
              Parcourir les annonces
            </Link>
            <Link to="/register" className="bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all shadow-lg">
              Créer un compte
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Accueil;
