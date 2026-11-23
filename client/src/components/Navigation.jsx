
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navigation() {
  const navigate = useNavigate();
  const { user, isAdmin, signout, loading } = useAuth();
  const [error, setError] = useState("");

  async function handleSignout() {
    try {
      setError("");
      await signout();
      navigate("/signin");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <header className="site-header">
      <nav className="navbar">
        <NavLink to="/" className="logo">
          AGM
        </NavLink>

        <div className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About Me</NavLink>
          <NavLink to="/projects">Projects</NavLink>
          <NavLink to="/education">Education</NavLink>
          <NavLink to="/services">Services</NavLink>
          <NavLink to="/contact">Contact Me</NavLink>

          {!loading && (
            user ? (
              <>
                {isAdmin && (
                  <span className="admin-label">
                    Admin
                  </span>
                )}

                <button
                  type="button"
                  className="signout-button"
                  onClick={handleSignout}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <NavLink to="/signin">Sign In</NavLink>
                <NavLink to="/signup">Sign Up</NavLink>
              </>
            )
          )}
        </div>
      </nav>

      {error && <p role="alert">{error}</p>}
    </header>
  );
}
