
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const API_URL = "http://localhost:5000/api/projects";


const featuredProjects = [
  {
    title: "In the Spire",
    image: "/images/InTheSpire.png",
    imageAlt: "Gameplay scene from In the Spire",
    technologies: "Unity, C#, 2D Game Development",
    role: "Game Programmer and Designer",
    description:
      "A medieval 2D platformer following Vaelor on his journey through a ruined kingdom to confront Calderus at the top of the spire.",
    outcome:
      "Created core movement, parallax backgrounds, level transitions, enemy behaviour, boss concepts, and the overall game presentation.",
  },
  {
    title: "Evolution Of Fighting Games",
    image: "/images/VideoEditting.png",
    imageAlt: "Fighting games video editing project",
    technologies: "DaVinci Resolve",
    role: "Video Editor, Narrator",
    description:
      "A video project exploring the rich history of fighting games.",
    outcome:
      "Produced a video showcasing the history and impact of fighting games, using smooth transitions and narration.",
  },
  {
    title: "Lucas Nullix Character Project",
    image: "/images/lucas-nullix.png",
    imageAlt: "3D character model of Lucas Nullix",
    technologies: "Blender, Unity, 3D Modelling and Animation",
    role: "3D Modeller and Animator",
    description:
      "A stylized technology-themed character created as a mission-giver for a game project, complete with clothing, accessories, and a custom rig.",
    outcome:
      "Modelled, rigged, and prepared the character for Unity with idle, walk, jump, and call animations.",
  },
];

const emptyForm = {
  title: "",
  firstname: "",
  lastname: "",
  email: "",
  completion: "",
  description: "",
  image: "",
  imageAlt: "",
  technologies: "",
  role: "",
  outcome: "",
};

export default function Projects() {
  const { user, isAdmin, loading: authLoading } = useAuth();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  // Load projects from MongoDB
  async function loadProjects() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Unable to load projects.");
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid project data.");
      }

      setProjects(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  // Show saved MongoDB projects and original projects
  // that have not been imported yet.
  const savedTitles = new Set(
    projects.map((project) =>
      project.title.trim().toLowerCase()
    )
  );

  const unsavedFeatured = featuredProjects
    .filter(
      (project) =>
        !savedTitles.has(project.title.trim().toLowerCase())
    )
    .map((project) => ({
      ...project,
      isLocal: true,
    }));

  const displayProjects = [
    ...projects,
    ...unsavedFeatured,
  ];

  // Update form fields
  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // Open Add Project form
  function handleAdd() {
    setEditingId(null);
    setForm({
      ...emptyForm,
      email: user?.email || "",
    });
    setError("");
    setMessage("");
    setShowForm(true);
  }

  // Open Edit Project form or prepare local project for import
  function handleEdit(project) {
    setEditingId(project._id || null);

    setForm({
      ...emptyForm,
      ...project,
      firstname: project.firstname || "",
      lastname: project.lastname || "",
      email: project.email || user?.email || "",
      completion: project.completion
        ? String(project.completion).slice(0, 10)
        : "",
    });

    setError("");
    setMessage("");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // Save new or edited project to MongoDB
  async function handleSubmit(event) {
    event.preventDefault();

    if (!isAdmin) {
      setError("Admin access is required.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const url = editingId
        ? `${API_URL}/${editingId}`
        : API_URL;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Could not save project."
        );
      }

      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);

      await loadProjects();

      setMessage(
        editingId
          ? "Project updated successfully!"
          : "Project added successfully!"
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  // Delete a saved MongoDB project
  async function handleDelete(project) {
    if (!isAdmin || !project._id) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.title}"?`
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/${project._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.message || "Could not delete project."
        );
      }

      await loadProjects();

      setMessage("Project deleted from MongoDB.");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="page projects-page">
      <header className="page-header">
        <h1>My Projects</h1>

        <p>
          These projects highlight my experience with
          game development, video editing,
          programming, and 2D production.
        </p>
      </header>

      {/* Admin controls */}
      {!authLoading && isAdmin && (
        <div className="project-admin-toolbar">
          <button
            type="button"
            className="project-action-button"
            onClick={handleAdd}
          >
            + Add Project
          </button>
        </div>
      )}

      {loading && <p>Loading projects...</p>}

      {error && (
        <p className="project-error" role="alert">
          {error}
        </p>
      )}

      {message && (
        <p className="project-success" role="status">
          {message}
        </p>
      )}

      {/* Add / Edit Project form */}
      {isAdmin && showForm && (
        <section className="project-form-container">
          <h2>
            {editingId ? "Edit Project" : "Add Project"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="project-admin-form"
          >
            <label>
              Project Title
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              First Name
              <input
                type="text"
                name="firstname"
                value={form.firstname}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Last Name
              <input
                type="text"
                name="lastname"
                value={form.lastname}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Completion Date
              <input
                type="date"
                name="completion"
                value={form.completion}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Technologies
              <input
                type="text"
                name="technologies"
                value={form.technologies}
                onChange={handleChange}
              />
            </label>

            <label>
              Your Role
              <input
                type="text"
                name="role"
                value={form.role}
                onChange={handleChange}
              />
            </label>

            <label>
              Image Path
              <input
                type="text"
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="/images/example.png"
              />
            </label>

            <label>
              Image Alt Text
              <input
                type="text"
                name="imageAlt"
                value={form.imageAlt}
                onChange={handleChange}
              />
            </label>

            <label>
              Description
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="4"
                required
              />
            </label>

            <label>
              Outcome
              <textarea
                name="outcome"
                value={form.outcome}
                onChange={handleChange}
                rows="3"
              />
            </label>

            <div className="project-form-actions">
              <button
                type="submit"
                disabled={saving}
                className="project-action-button"
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Project"
                  : "Save Project"}
              </button>

              <button
                type="button"
                className="project-cancel-button"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Existing project cards */}
      <section
        className="project-grid"
        aria-label="Featured projects"
      >
        {displayProjects.map((project) => (
          <article
            className="project-card"
            key={project._id || project.title}
          >
            {project.image && (
              <img
                className="project-image"
                src={project.image}
                alt={project.imageAlt || project.title}
              />
            )}

            <div className="project-content">
              <h2>{project.title}</h2>

              {project.technologies && (
                <p className="project-tools">
                  {project.technologies}
                </p>
              )}

              {project.role && (
                <p>
                  <strong>My Role:</strong>{" "}
                  {project.role}
                </p>
              )}

              <p>{project.description}</p>

              {project.outcome && (
                <p>
                  <strong>Outcome:</strong>{" "}
                  {project.outcome}
                </p>
              )}

              {/* Admin-only buttons */}
              {isAdmin && (
                <div className="project-card-actions">
                  <button
                    type="button"
                    className="project-edit-button"
                    onClick={() => handleEdit(project)}
                  >
                    {project.isLocal
                      ? "Save to MongoDB"
                      : "Edit"}
                  </button>

                  {!project.isLocal && (
                    <button
                      type="button"
                      className="project-delete-button"
                      onClick={() =>
                        handleDelete(project)
                      }
                    >
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
