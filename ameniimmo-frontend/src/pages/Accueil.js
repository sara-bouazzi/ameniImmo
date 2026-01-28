import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import SearchBar from "../components/SearchBar";
import Testimonials from "../components/Testimonials";
import AnnonceCard from "../components/AnnonceCard";
import MapView from "../components/MapView";

function Accueil() {
  const { user } = useContext(AuthContext);
  const [annonces, setAnnonces] = useState([]);
  const [filteredAnnonces, setFilteredAnnonces] = useState([]);
  const [searchActive, setSearchActive] = useState(false);
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
      const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
      
      // Récupérer les annonces
      const annoncesResponse = await axios.get(`${API_URL}/api/annonces/`);
      const approuvees = annoncesResponse.data.filter((a) => a.approuve === true);
      setAnnonces(approuvees);
      setFilteredAnnonces(approuvees);

      // Calculer les années d'expérience (depuis 2010)
      const anneeDebut = 2010;
      const anneeActuelle = new Date().getFullYear();
      const experience = anneeActuelle - anneeDebut;

      // Récupérer les utilisateurs pour compter les clients
      let clientsCount = 2; // Valeur par défaut
      try {
        const usersResponse = await axios.get(`${API_URL}/api/users/`);
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

  const handleSearch = (searchParams) => {
    let filtered = [...annonces];

    // Filtre par statut
    if (searchParams.statut) {
      const filterStatut = searchParams.statut === 'vente' ? 'à vendre' : searchParams.statut === 'location' ? 'à louer' : searchParams.statut;
      filtered = filtered.filter(a => {
        const annonceStatut = a.statut ? a.statut.toLowerCase().trim() : '';
        return annonceStatut.includes(filterStatut.toLowerCase());
      });
    }

    // Filtre par ville
    if (searchParams.ville) {
      const searchTerm = searchParams.ville.toLowerCase();
      filtered = filtered.filter(a => 
        (a.ville && a.ville.toLowerCase().includes(searchTerm)) ||
        (a.region && a.region.toLowerCase().includes(searchTerm)) ||
        (a.gouvernorat && a.gouvernorat.toLowerCase().includes(searchTerm))
      );
    }

    // Filtre par prix
    if (searchParams.prixMin) {
      filtered = filtered.filter(a => a.prix >= parseFloat(searchParams.prixMin));
    }
    if (searchParams.prixMax) {
      filtered = filtered.filter(a => a.prix <= parseFloat(searchParams.prixMax));
    }

    // Filtre par superficie
    if (searchParams.superficieMin) {
      filtered = filtered.filter(a => (a.surface || a.superficie) >= parseFloat(searchParams.superficieMin));
    }
    if (searchParams.superficieMax) {
      filtered = filtered.filter(a => (a.surface || a.superficie) <= parseFloat(searchParams.superficieMax));
    }

    setFilteredAnnonces(filtered);
    setSearchActive(true);
    
    // Scroll vers les résultats
    setTimeout(() => {
      document.getElementById('resultats-recherche')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const resetSearch = () => {
    setFilteredAnnonces(annonces);
    setSearchActive(false);
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
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Résultats de recherche */}
      {searchActive && (
        <div id="resultats-recherche" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">
              Résultats de recherche
              <span className="text-primary-600 ml-3">({filteredAnnonces.length})</span>
            </h2>
            <button
              onClick={resetSearch}
              className="flex items-center gap-2 text-primary-700 hover:text-primary-800 font-medium transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Réinitialiser
            </button>
          </div>

          {filteredAnnonces.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun résultat trouvé</h3>
              <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAnnonces.map((annonce) => (
                <AnnonceCard key={annonce.id} annonce={annonce} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Catégories */}
      {!searchActive && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">
              Nos <span className="gradient-text">Catégories</span>
            </h2>
            <p className="text-gray-600 text-lg">Découvrez notre large sélection de biens immobiliers</p>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            { 
              icon: "🏘️", 
              title: "Immobilier", 
              filter: "immobilier",
              description: "Tous types de biens"
            },
            { 
              icon: "🏢", 
              title: "Logement", 
              filter: "logement",
              description: "Appartements, maisons..."
            },
            { 
              icon: "🏞️", 
              title: "Terrain", 
              filter: "terrain",
              description: "Terrains à vendre"
            },
            { 
              icon: "🏗️", 
              title: "Espace de travail", 
              filter: "espace",
              description: "Bureaux, locaux..."
            },
            { 
              icon: "🅿️", 
              title: "Place de parc", 
              filter: "parc",
              description: "Parkings"
            }
          ].map((cat, idx) => (
            <Link
              key={idx}
              to={`/annonces?search=${cat.filter}`}
              className="card p-6 text-center group cursor-pointer transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl"
            >
              <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">{cat.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors">{cat.title}</h3>
              <p className="text-sm text-gray-600">{cat.description}</p>
            </Link>
          ))}
        </div>
      </div>
      )}

      {/* Annonces */}
      {!searchActive && (
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
                <AnnonceCard key={annonce.id} annonce={annonce} />
              ))}
            </div>
          )}
        </div>
      </div>
      )}

      {/* Section Carte Interactive */}
      <div className="py-16 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold text-gray-900 mb-4">
              Explorez <span className="gradient-text">sur la Carte</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Découvrez la localisation de tous nos biens disponibles en Tunisie
            </p>
          </div>

          {/* Carte avec annonces */}
          {annonces.length > 0 && (
            <div className="transform hover:scale-[1.01] transition-transform duration-300">
              <MapView annonces={annonces} />
            </div>
          )}
        </div>
      </div>

      {/* Section Témoignages avec Carousel */}
      <Testimonials />
    </div>
  );
}

export default Accueil;
