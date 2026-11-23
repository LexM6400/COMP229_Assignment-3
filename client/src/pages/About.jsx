export default function About() {
  return (
    <main className="page">
      <h1>About Me</h1>

      <img
        src="/images/profile-photo.jpg"
        alt="Alexis Gabriel Morales"
        className="profile-image"
      />

      <h2>Alexis Gabriel Morales</h2>

      <p>
        I am a Game Programming student at Centennial College. I am interested
        in game development, web development, software design, and 3D
        modelling. I have experience using Unity, Blender, Java, C#, React,
        HTML, and CSS. My goal is to continue developing my technical and
        creative skills and eventually work in the game or software development
        industry.
      </p>

      <a
        href="/Alexis-Morales-Resume.pdf"
        target="_blank"
        rel="noreferrer"
      >
        View My Résumé
      </a>
    </main>
  );
}