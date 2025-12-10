import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );

  const [user, setUser] = useState(() =>
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null
  );

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
