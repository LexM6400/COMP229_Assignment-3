
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Projects from "./pages/Projects.jsx";
import Education from "./pages/Education.jsx";
import Services from "./pages/Services.jsx";
import Contact from "./pages/Contact.jsx";

// New authentication pages
import Signin from "./pages/Signin.jsx";
import Signup from "./pages/Signup.jsx";

export default function MainRouter() {
  return (
    <Routes>
      {/* Existing portfolio pages */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/education" element={<Education />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<Contact />} />

      {/* Assignment 3 authentication pages */}
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}
