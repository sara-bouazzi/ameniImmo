import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const { user, authTokens } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

  // Charger les notifications depuis l'API
  const fetchNotifications = async () => {
    if (!user || !authTokens?.access) return;
    
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/notifications/`, {
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
        },
      });
      
      setNotifications(response.data);
      const unread = response.data.filter(n => n.statut === 'non_lu').length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Erreur lors du chargement des notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Charger les notifications au montage et toutes les 30 secondes
  useEffect(() => {
    if (user && authTokens?.access) {
      fetchNotifications();
      
      // Rafraîchir toutes les 30 secondes
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user, authTokens]);

  // Calculer le nombre de notifications non lues
  useEffect(() => {
    const unread = notifications.filter(n => n.statut === 'non_lu').length;
    setUnreadCount(unread);
  }, [notifications]);

  // Marquer une notification comme lue
  const markAsRead = async (notificationId) => {
    if (!authTokens?.access) return;
    
    try {
      await axios.post(
        `${API_URL}/api/notifications/${notificationId}/marquer_lu/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        }
      );
      
      // Mettre à jour localement
      const updated = notifications.map(n => 
        n.id === notificationId ? { ...n, statut: 'lu' } : n
      );
      setNotifications(updated);
    } catch (error) {
      console.error("Erreur lors du marquage comme lu:", error);
    }
  };

  // Marquer toutes les notifications comme lues
  const markAllAsRead = async () => {
    if (!authTokens?.access) return;
    
    try {
      await axios.post(
        `${API_URL}/api/notifications/marquer_toutes_lues/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        }
      );
      
      // Mettre à jour localement
      const updated = notifications.map(n => ({ ...n, statut: 'lu' }));
      setNotifications(updated);
    } catch (error) {
      console.error("Erreur lors du marquage de toutes comme lues:", error);
    }
  };

  // Supprimer une notification
  const removeNotification = async (notificationId) => {
    if (!authTokens?.access) return;
    
    try {
      await axios.delete(`${API_URL}/api/notifications/${notificationId}/`, {
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
        },
      });
      
      // Mettre à jour localement
      const updated = notifications.filter(n => n.id !== notificationId);
      setNotifications(updated);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  // Supprimer toutes les notifications
  const clearAll = async () => {
    if (!authTokens?.access) return;
    
    try {
      // Supprimer toutes une par une
      await Promise.all(
        notifications.map(n => 
          axios.delete(`${API_URL}/api/notifications/${n.id}/`, {
            headers: {
              Authorization: `Bearer ${authTokens.access}`,
            },
          })
        )
      );
      
      setNotifications([]);
    } catch (error) {
      console.error("Erreur lors de la suppression de toutes:", error);
    }
  };

  return (
    <NotificationsContext.Provider value={{ 
      notifications,
      unreadCount,
      loading,
      markAsRead,
      markAllAsRead,
      removeNotification,
      clearAll,
      fetchNotifications
    }}>
      {children}
    </NotificationsContext.Provider>
  );
};
