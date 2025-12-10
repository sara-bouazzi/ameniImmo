import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getRoleBadge = (role) => {
    const badges = {
      admin: { text: "Admin", color: "bg-red-500" },
      owner: { text: "Propriétaire", color: "bg-blue-500" },
      visiteur: { text: "Visiteur", color: "bg-green-500" },
    };
    return badges[role] || { text: "Utilisateur", color: "bg-gray-500" };
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo et Nom */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">AI</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                AmeniImmo
              </span>
            </Link>
          </div>

          {/* Navigation */}
          {user ? (
            <div className="flex items-center space-x-6">
              {/* Liens de navigation */}
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 font-medium transition"
              >
                Accueil
              </Link>

              {/* Liens spécifiques au rôle */}
              {user.role === "admin" && (
                <Link
                  to="/admin/dashboard"
                  className="text-gray-700 hover:text-red-600 font-medium transition"
                >
                  Dashboard Admin
                </Link>
              )}

              {user.role === "owner" && (
                <Link
                  to="/mes-annonces"
                  className="text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  Mes Annonces
                </Link>
              )}

              {user.role === "visiteur" && (
                <Link
                  to="/favoris"
                  className="text-gray-700 hover:text-green-600 font-medium transition"
                >
                  Mes Favoris
                </Link>
              )}

              {/* Profil utilisateur */}
              <div className="flex items-center space-x-3 border-l pl-6">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800">
                    {user.username}
                  </p>
                  <span
                    className={`text-xs text-white px-2 py-0.5 rounded-full ${
                      getRoleBadge(user.role).color
                    }`}
                  >
                    {getRoleBadge(user.role).text}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow hover:shadow-lg"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          ) : (
            // Si non connecté
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 font-medium transition"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
