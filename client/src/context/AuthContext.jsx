
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

const API_URL = "http://localhost:5000";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore the login session when the page refreshes
  useEffect(() => {
    let active = true;

    async function checkAuthentication() {
      try {
        const response = await fetch(
          `${API_URL}/api/auth/me`,
          { credentials: "include" }
        );

        if (!response.ok) {
          throw new Error("Not authenticated");
        }

        const data = await response.json();

        if (active) {
          setUser(data.user);
        }
      } catch {
        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    checkAuthentication();

    return () => {
      active = false;
    };
  }, []);

  async function signin(email, password) {
    const response = await fetch(
      `${API_URL}/api/auth/signin`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Signin failed.");
    }

    setUser(data.user);
    return data.user;
  }

  async function signout() {
    const response = await fetch(
      `${API_URL}/api/auth/signout`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Signout failed.");
    }

    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signin,
        signout,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}
