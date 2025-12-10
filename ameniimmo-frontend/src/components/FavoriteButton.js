import React, { useContext } from "react";
import { FavoritesContext } from "../context/FavoritesContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function FavoriteButton({ annonceId, className = "" }) {
  const { user } = useContext(AuthContext);
  const { isFavorite, toggleFavorite } = useContext(FavoritesContext);
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      navigate('/login');
      return;
    }

    toggleFavorite(annonceId);
  };

  const favorite = isFavorite(annonceId);

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-full transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
        favorite 
          ? 'bg-red-500 text-white hover:bg-red-600' 
          : 'bg-white text-gray-400 hover:text-red-500 hover:bg-red-50'
      } ${className}`}
      aria-label={favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
      title={favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      <svg 
        className="w-6 h-6" 
        fill={favorite ? "currentColor" : "none"} 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={favorite ? 0 : 2} 
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
        />
      </svg>
    </button>
  );
}

export default FavoriteButton;
