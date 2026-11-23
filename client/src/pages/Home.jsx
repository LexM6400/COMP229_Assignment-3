import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="home-hero">
      <section className="home-copy">
        <p className="eyebrow">Game Programming Student</p>
        <h1>Hi, I’m Alexis Gabriel Morales</h1>
        <p>
          Welcome to my personal portfolio. I am a Game Programming student at
          Centennial College with an interest in building games, websites, and
          video editing.
        </p>

        <h2>My Mission</h2>
        <p>
          My mission is to create games that entertain people of all ages while
          continuing to grow as a game programmer and designer.
        </p>

        <h2>What I Work With</h2>
        <p>
          C#, Java, JavaScript, React, Unity, Blender, HTML, CSS, DaVinci Resolve,
          and software design fundamentals.
        </p>

        <div className="home-links">
          <Link to="/about">About Me</Link>
          <Link to="/projects">View Projects</Link>
        </div>
      </section>

      <div className="home-portrait">
        <img
          src="/images/profile-photo.jpg"
          alt="Alexis Gabriel Morales"
          onError={(event) => {
            event.currentTarget.hidden = true;
            event.currentTarget.nextElementSibling.hidden = false;
          }}
        />
        <div className="photo-placeholder" hidden aria-label="Portrait placeholder">
          AGM
        </div>
      </div>
    </main>
  );
}
