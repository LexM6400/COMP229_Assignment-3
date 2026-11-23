
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const API_URL = "http://localhost:5000/api/qualifications";

const originalEducation = {
  title: "Centennial College",
  institution: "Centennial College",
  program: "Game Programming",
  credential: "Ontario College Advanced Diploma",
  dates: "Start Year–Present",
  location: "Toronto, Ontario",
  courses: [
    "Java Programming",
    "Web Application Development",
    "Game and Simulation Programming",
    "Software Systems Design",
    "Assets for Game Developers",
    "Discrete Mathematics",
  ],
  description: "Game Programming student at Centennial College.",
};

const emptyForm = {
  title: "",
  firstname: "",
  lastname: "",
  email: "",
  completion: "",
  description: "",
  institution: "",
  program: "",
  credential: "",
  dates: "",
  location: "",
  courses: "",
};

export default function Education() {
  const { user, isAdmin, loading: authLoading } = useAuth();

  const [qualifications, setQualifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function loadQualifications() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Unable to load qualifications.");
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid qualification data.");
      }

      setQualifications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadQualifications();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

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

  function handleEdit(qualification) {
    setEditingId(qualification._id || null);

    setForm({
      ...emptyForm,
      ...qualification,
      firstname: qualification.firstname || "",
      lastname: qualification.lastname || "",
      email: qualification.email || user?.email || "",
      completion: qualification.completion
        ? String(qualification.completion).slice(0, 10)
        : "",
      courses: Array.isArray(qualification.courses)
        ? qualification.courses.join("\n")
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

  async function handleSubmit(event) {
    event.preventDefault();

    if (!isAdmin) {
      setError("Admin access is required.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    const wasEditing = Boolean(editingId);

    const payload = {
      ...form,
      courses: form.courses
        .split("\n")
        .map((course) => course.trim())
        .filter(Boolean),
    };

    try {
      const response = await fetch(
        editingId ? `${API_URL}/${editingId}` : API_URL,
        {
          method: wasEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to save qualification."
        );
      }

      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);

      await loadQualifications();

      setMessage(
        wasEditing
          ? "Qualification updated successfully."
          : "Qualification added successfully."
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(qualification) {
    if (!isAdmin || !qualification._id) return;

    const confirmed = window.confirm(
      `Delete "${qualification.title}"?`
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/${qualification._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        const data = await response.json();

        throw new Error(
          data.message || "Unable to delete qualification."
        );
      }

      await loadQualifications();

      setMessage("Qualification deleted successfully.");
    } catch (err) {
      setError(err.message);
    }
  }

  const hasCentennial = qualifications.some(
    (item) =>
      (item.title || "").trim().toLowerCase() ===
        "centennial college" ||
      (item.institution || "").trim().toLowerCase() ===
        "centennial college"
  );

  const displayQualifications = error
    ? qualifications
    : [
        ...qualifications,
        ...(!hasCentennial
          ? [{ ...originalEducation, isLocal: true }]
          : []),
      ];

  return (
    <main className="page education-page">
      <header className="page-header">
        <h1>Education</h1>
        <p>My educational background and relevant coursework.</p>
      </header>

      {!authLoading && isAdmin && (
        <div className="education-admin-toolbar">
          <button
            type="button"
            className="education-action-button"
            onClick={handleAdd}
          >
            + Add Qualification
          </button>
        </div>
      )}

      {loading && <p>Loading qualifications...</p>}

      {error && (
        <p className="education-error" role="alert">
          {error}
        </p>
      )}

      {message && (
        <p className="education-success" role="status">
          {message}
        </p>
      )}

      {isAdmin && showForm && (
        <section className="education-form-container">
          <h2>
            {editingId ? "Edit Qualification" : "Add Qualification"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="education-admin-form"
          >
            <label>
              Qualification Title
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              First Name
              <input
                name="firstname"
                value={form.firstname}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Last Name
              <input
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
              Institution
              <input
                name="institution"
                value={form.institution}
                onChange={handleChange}
              />
            </label>

            <label>
              Program
              <input
                name="program"
                value={form.program}
                onChange={handleChange}
              />
            </label>

            <label>
              Credential
              <input
                name="credential"
                value={form.credential}
                onChange={handleChange}
              />
            </label>

            <label>
              Dates Attended
              <input
                name="dates"
                value={form.dates}
                onChange={handleChange}
                placeholder="Start Year–Present"
              />
            </label>

            <label>
              Location
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
              />
            </label>

            <label>
              Description
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="3"
                required
              />
            </label>

            <label>
              Relevant Courses (one per line)
              <textarea
                name="courses"
                value={form.courses}
                onChange={handleChange}
                rows="6"
              />
            </label>

            <div className="education-form-actions">
              <button
                type="submit"
                className="education-action-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Qualification"
                  : "Save Qualification"}
              </button>

              <button
                type="button"
                className="education-cancel-button"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      <section aria-label="Education qualifications">
        {!loading &&
          displayQualifications.map((qualification) => (
            <article
              className="education-card"
              key={qualification._id || qualification.title}
            >
              <h2>
                {qualification.institution || qualification.title}
              </h2>

              {qualification.program && (
                <p>
                  <strong>Program:</strong> {qualification.program}
                </p>
              )}

              {qualification.credential && (
                <p>
                  <strong>Credential:</strong> {qualification.credential}
                </p>
              )}

              {qualification.dates && (
                <p>
                  <strong>Dates:</strong> {qualification.dates}
                </p>
              )}

              {qualification.location && (
                <p>
                  <strong>Location:</strong> {qualification.location}
                </p>
              )}

              {qualification.description && (
                <p>{qualification.description}</p>
              )}

              {qualification.courses?.length > 0 && (
                <>
                  <h3>Relevant Courses</h3>
                  <ul>
                    {qualification.courses.map((course, index) => (
                      <li key={`${course}-${index}`}>{course}</li>
                    ))}
                  </ul>
                </>
              )}

              {isAdmin && (
                <div className="education-card-actions">
                  <button
                    type="button"
                    className="education-edit-button"
                    onClick={() => handleEdit(qualification)}
                  >
                    {qualification.isLocal
                      ? "Save to MongoDB"
                      : "Edit"}
                  </button>

                  {!qualification.isLocal && (
                    <button
                      type="button"
                      className="education-delete-button"
                      onClick={() => handleDelete(qualification)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              )}
            </article>
          ))}
      </section>
    </main>
  );
}
