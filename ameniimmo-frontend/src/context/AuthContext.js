import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authTokens, setAuthTokens] = useState(() => {
    try {
      const tokens = localStorage.getItem("authTokens");
      return tokens ? JSON.parse(tokens) : null;
    } catch (error) {
      console.error("Error parsing authTokens:", error);
      localStorage.removeItem("authTokens");
      return null;
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const userData = localStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      localStorage.removeItem("user");
      return null;
    }
  });

  const login = (data) => {
    // data = { user, access, refresh, message }
    setAuthTokens({ access: data.access, refresh: data.refresh });
    setUser(data.user);
    localStorage.setItem("authTokens", JSON.stringify({ access: data.access, refresh: data.refresh }));
    localStorage.setItem("user", JSON.stringify(data.user));
  };

  const logout = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ authTokens, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
