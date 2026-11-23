
import { BrowserRouter } from "react-router-dom";

import Navigation from "./components/Navigation.jsx";
import MainRouter from "./MainRouter.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navigation />
        <MainRouter />

        <footer className="site-footer">
          <p>
            © 2026 Alexis Gabriel Morales.
            All rights reserved.
          </p>
        </footer>
      </AuthProvider>
    </BrowserRouter>
  );
}
