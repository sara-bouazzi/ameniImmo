import React, { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";

export const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastCheck, setLastCheck] = useState(null);

  // Charger les notifications depuis le localStorage
  useEffect(() => {
    if (user) {
      const storedNotifications = localStorage.getItem(`notifications_${user.id}`);
      const storedLastCheck = localStorage.getItem(`lastCheck_${user.id}`);
      
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      }
      
      if (storedLastCheck) {
        setLastCheck(new Date(storedLastCheck));
      } else {
        setLastCheck(new Date());
      }
    }
  }, [user]);

  // Calculer le nombre de notifications non lues
  useEffect(() => {
    const unread = notifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  }, [notifications]);

  // Ajouter une nouvelle notification
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      ...notification,
      read: false,
      createdAt: new Date().toISOString()
    };

    const updated = [newNotification, ...notifications];
    setNotifications(updated);
    
    if (user) {
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updated));
    }
  };

  // Marquer une notification comme lue
  const markAsRead = (notificationId) => {
    const updated = notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    setNotifications(updated);
    
    if (user) {
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updated));
    }
  };

  // Marquer toutes les notifications comme lues
  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    
    if (user) {
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updated));
    }
  };

  // Supprimer une notification
  const removeNotification = (notificationId) => {
    const updated = notifications.filter(n => n.id !== notificationId);
    setNotifications(updated);
    
    if (user) {
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updated));
    }
  };

  // Supprimer toutes les notifications
  const clearAll = () => {
    setNotifications([]);
    
    if (user) {
      localStorage.removeItem(`notifications_${user.id}`);
    }
  };

  // Mettre à jour la dernière vérification
  const updateLastCheck = () => {
    const now = new Date();
    setLastCheck(now);
    
    if (user) {
      localStorage.setItem(`lastCheck_${user.id}`, now.toISOString());
    }
  };

  return (
    <NotificationsContext.Provider value={{ 
      notifications,
      unreadCount,
      lastCheck,
      addNotification,
      markAsRead,
      markAllAsRead,
      removeNotification,
      clearAll,
      updateLastCheck
    }}>
      {children}
    </NotificationsContext.Provider>
  );
};
