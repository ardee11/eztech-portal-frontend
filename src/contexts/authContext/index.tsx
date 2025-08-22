import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

interface User {
  aid: number;
  email: string;
  name: string;
  role: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  userLoggedIn: boolean;
  userRole: string[] | null;
  userName: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<any>(token);
        if (decoded.exp * 1000 < Date.now()) {
          logout();
          setLoading(false);
        } else {
          setUser({
            aid: decoded.aid,
            email: decoded.email,
            name: decoded.name,
            role: Array.isArray(decoded.role) ? decoded.role : [decoded.role],
          });
          setLoading(false);
        }
      } catch (error) {
        console.error("Invalid token:", error);
        logout();
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Login failed");
      }

      const { token, user } = await res.json();

      setToken(token); 
      setUser({
        ...user,
        role: Array.isArray(user.role) ? user.role : [user.role],
      });              
      localStorage.setItem("token", token);
      navigate("/");
      return user;

    } catch (error: any) {
      throw new Error(error.message || "Login error");
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading,
    userLoggedIn: !!user,
    userName: user?.name ?? null,
    userRole: Array.isArray(user?.role) ? user.role : [],
  };

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
