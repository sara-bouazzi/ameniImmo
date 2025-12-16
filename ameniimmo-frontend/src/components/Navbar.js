import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";
import { FavoritesContext } from "../context/FavoritesContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { favorites } = useContext(FavoritesContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo et Nom */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              {/* Logo Ameni Immo */}
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all duration-300 transform group-hover:scale-105 p-1">
                <img 
                  src={require('../assets/images/596818333_1270646351763515_5564567517230444995_n.jpg')} 
                  alt="Ameni Immo" 
                  className="w-full h-full object-cover rounded-lg" 
                />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 rounded-full animate-ping opacity-75"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold font-display gradient-text">
                Ameni Immo
              </span>
              <span className="text-xs text-gray-500 font-medium">Agence Immobilière Agréée</span>
            </div>
          </Link>

          {/* Navigation Desktop */}
          {user ? (
            <div className="hidden md:flex items-center space-x-1">
              <Link
                to="/"
                className="px-4 py-2 text-gray-700 hover:text-primary-700 font-medium transition-colors rounded-lg hover:bg-primary-50"
              >
                Accueil
              </Link>

              {user.role === "owner" && (
                <Link
                  to="/mes-annonces"
                  className="px-4 py-2 text-gray-700 hover:text-primary-700 font-medium transition-colors rounded-lg hover:bg-primary-50"
                >
                  Mes Annonces
                </Link>
              )}

              {user.role === "admin" && (
                <Link
                  to="/admin/dashboard"
                  className="px-4 py-2 bg-gradient-to-r from-primary-700 to-primary-600 text-white font-semibold rounded-lg hover:shadow-glow transition-all"
                >
                  Dashboard Admin
                </Link>
              )}

              {/* Icons: Favoris et Notifications */}
              <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gray-200">
                {/* Favoris - Uniquement pour les visiteurs */}
                {user.role === "visiteur" && (
                  <Link
                    to="/favoris"
                    className="relative p-2 text-gray-600 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full transition-colors"
                    aria-label="Favoris"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {favorites.length > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full min-w-[20px]">
                        {favorites.length > 99 ? '99+' : favorites.length}
                      </span>
                    )}
                  </Link>
                )}

                {/* Notifications - Uniquement pour les admins */}
                {user.role === "admin" && <NotificationBell />}
              </div>

              {/* Profil utilisateur */}
              <div className="ml-2 flex items-center space-x-3 pl-4 border-l border-gray-200">
                <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-lg">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                    {user.prenom?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900">
                      {user.prenom} {user.nom}
                    </span>
                    <span className="text-xs text-primary-600 font-medium">
                      {user.role === 'admin' ? 'Administrateur' : 
                       user.role === 'owner' ? 'Propriétaire' : 'Visiteur'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-gray-700 hover:text-red-600 font-medium transition-colors rounded-lg hover:bg-red-50"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-3">
              <Link
                to="/login"
                className="px-6 py-2.5 text-primary-700 font-semibold hover:bg-primary-50 rounded-lg transition-all"
              >
                Connexion
              </Link>
              <Link
                to="/register"
                className="btn-primary"
              >
                Inscription
              </Link>
            </div>
          )}

          {/* Menu Mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Menu Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 space-y-2">
            {user ? (
              <>
                <Link to="/" className="block px-4 py-2 text-gray-700 hover:bg-primary-50 rounded-lg">
                  Accueil
                </Link>
                {user.role === "owner" && (
                  <Link to="/mes-annonces" className="block px-4 py-2 text-gray-700 hover:bg-primary-50 rounded-lg">
                    Mes Annonces
                  </Link>
                )}
                {user.role === "admin" && (
                  <Link to="/admin/dashboard" className="block px-4 py-2 bg-primary-700 text-white rounded-lg">
                    Dashboard Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-4 py-2 text-gray-700 hover:bg-primary-50 rounded-lg">
                  Connexion
                </Link>
                <Link to="/register" className="block px-4 py-2 bg-primary-700 text-white rounded-lg text-center">
                  Inscription
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
