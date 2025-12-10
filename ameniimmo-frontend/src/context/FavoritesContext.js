import React, { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);

  // Charger les favoris depuis le localStorage au démarrage
  useEffect(() => {
    if (user) {
      const storedFavorites = localStorage.getItem(`favorites_${user.id}`);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } else {
      setFavorites([]);
    }
  }, [user]);

  // Sauvegarder les favoris dans le localStorage
  useEffect(() => {
    if (user && favorites.length >= 0) {
      localStorage.setItem(`favorites_${user.id}`, JSON.stringify(favorites));
    }
  }, [favorites, user]);

  const addFavorite = (annonceId) => {
    if (!favorites.includes(annonceId)) {
      setFavorites([...favorites, annonceId]);
    }
  };

  const removeFavorite = (annonceId) => {
    setFavorites(favorites.filter(id => id !== annonceId));
  };

  const toggleFavorite = (annonceId) => {
    if (favorites.includes(annonceId)) {
      removeFavorite(annonceId);
    } else {
      addFavorite(annonceId);
    }
  };

  const isFavorite = (annonceId) => {
    return favorites.includes(annonceId);
  };

  return (
    <FavoritesContext.Provider value={{ 
      favorites, 
      addFavorite, 
      removeFavorite, 
      toggleFavorite, 
      isFavorite 
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};
