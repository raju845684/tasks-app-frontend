import { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // Restore session on page refresh
  useEffect(() => {
    if (token) {
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const stored = localStorage.getItem("user");
      if (stored) setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, [token]);

  const saveSession = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    API.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    setToken(data.token);
    setUser(data.user);
  };

  const signup = async (name, email, password) => {
    const res = await API.post("/auth/signup", { name, email, password });
    saveSession(res.data);
  };

  const login = async (email, password) => {
    const res = await API.post("/auth/login", { email, password });
    saveSession(res.data);
  };

  const googleLogin = async (credential) => {
    const res = await API.post("/auth/google", { credential });
    saveSession(res.data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete API.defaults.headers.common["Authorization"];
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, signup, login, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
