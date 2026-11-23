
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const API_URL = "http://localhost:5000/api/contacts";

const emptyForm = {
  firstName: "",
  lastName: "",
  contactNumber: "",
  emailAddress: "",
  message: "",
};

export default function Contact() {
  const { isAdmin, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState(emptyForm);
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adminError, setAdminError] = useState("");
  const [adminMessage, setAdminMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && isAdmin) {
      loadContacts();
    } else if (!authLoading) {
      setContacts([]);
    }
  }, [authLoading, isAdmin]);

  async function loadContacts() {
    setLoading(true);
    setAdminError("");

    try {
      const response = await fetch(API_URL, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Unable to load messages.");
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid contact data.");
      }

      setContacts(data);
    } catch (error) {
      setAdminError(error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          firstname: formData.firstName,
          lastname: formData.lastName,
          contactNumber: formData.contactNumber,
          email: formData.emailAddress,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Could not send your message."
        );
      }

      setStatus("Thank you! Your message has been sent.");
      setFormData(emptyForm);

      if (isAdmin) {
        await loadContacts();
      }
    } catch (error) {
      setStatus(
        error.message || "Could not send your message."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleEdit(contact) {
    setEditingId(contact._id);

    setEditForm({
      firstName: contact.firstname || "",
      lastName: contact.lastname || "",
      contactNumber: contact.contactNumber || "",
      emailAddress: contact.email || "",
      message: contact.message || "",
    });

    setAdminError("");
    setAdminMessage("");
  }

  function handleEditChange(event) {
    const { name, value } = event.target;

    setEditForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleUpdate(event) {
    event.preventDefault();

    if (!isAdmin || !editingId) return;

    setSaving(true);
    setAdminError("");
    setAdminMessage("");

    try {
      const response = await fetch(
        `${API_URL}/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            firstname: editForm.firstName,
            lastname: editForm.lastName,
            contactNumber: editForm.contactNumber,
            email: editForm.emailAddress,
            message: editForm.message,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to update message."
        );
      }

      setEditingId(null);
      setEditForm(emptyForm);

      await loadContacts();
      setAdminMessage("Message updated successfully.");
    } catch (error) {
      setAdminError(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(contact) {
    if (!isAdmin) return;

    const confirmed = window.confirm(
      `Delete the message from ${contact.firstname} ${contact.lastname}?`
    );

    if (!confirmed) return;

    setAdminError("");
    setAdminMessage("");

    try {
      const response = await fetch(
        `${API_URL}/${contact._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        const data = await response.json();

        throw new Error(
          data.message || "Unable to delete message."
        );
      }

      if (editingId === contact._id) {
        setEditingId(null);
        setEditForm(emptyForm);
      }

      await loadContacts();
      setAdminMessage("Message deleted successfully.");
    } catch (error) {
      setAdminError(error.message);
    }
  }

  return (
    <main className="page contact-page">
      <h1>Contact Me</h1>

      <section className="contact-panel">
        <h2>Contact Information</h2>
        <p>Alexis Gabriel Morales</p>
        <p>Email: Add your email address</p>
        <p>Location: Toronto, Ontario</p>
        <p>GitHub: Add your GitHub link</p>
        <p>LinkedIn: Add your LinkedIn link</p>
      </section>

      <form onSubmit={handleSubmit}>
        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />

        <label htmlFor="lastName">Last Name</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />

        <label htmlFor="contactNumber">Contact Number</label>
        <input
          type="tel"
          id="contactNumber"
          name="contactNumber"
          value={formData.contactNumber}
          onChange={handleChange}
        />

        <label htmlFor="emailAddress">Email Address</label>
        <input
          type="email"
          id="emailAddress"
          name="emailAddress"
          value={formData.emailAddress}
          onChange={handleChange}
          required
        />

        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows="5"
          required
        />

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>

        {status && <p role="status">{status}</p>}
      </form>

      {!authLoading && isAdmin && (
        <section className="contact-admin-section">
          <div className="contact-admin-header">
            <h2>Contact Messages</h2>

            <button
              type="button"
              className="contact-refresh-button"
              onClick={loadContacts}
              disabled={loading}
            >
              Refresh
            </button>
          </div>

          {adminError && (
            <p className="contact-error" role="alert">
              {adminError}
            </p>
          )}

          {adminMessage && (
            <p className="contact-success" role="status">
              {adminMessage}
            </p>
          )}

          {loading && <p>Loading messages...</p>}

          {!loading && contacts.length === 0 && (
            <p>No contact messages found.</p>
          )}

          {!loading &&
            contacts.map((contact) => (
              <article
                className="contact-message-card"
                key={contact._id}
              >
                <h3>
                  {contact.firstname} {contact.lastname}
                </h3>

                <p>
                  <strong>Email:</strong> {contact.email}
                </p>

                {contact.contactNumber && (
                  <p>
                    <strong>Contact Number:</strong>{" "}
                    {contact.contactNumber}
                  </p>
                )}

                <p>
                  <strong>Message:</strong>{" "}
                  {contact.message || "No message provided."}
                </p>

                {contact.createdAt && (
                  <p className="contact-message-date">
                    Received:{" "}
                    {new Date(
                      contact.createdAt
                    ).toLocaleString()}
                  </p>
                )}

                <div className="contact-card-actions">
                  <button
                    type="button"
                    className="contact-edit-button"
                    onClick={() => handleEdit(contact)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="contact-delete-button"
                    onClick={() => handleDelete(contact)}
                  >
                    Delete
                  </button>
                </div>

                {editingId === contact._id && (
                  <form
                    className="contact-edit-form"
                    onSubmit={handleUpdate}
                  >
                    <h3>Edit Message</h3>

                    <label>
                      First Name
                      <input
                        name="firstName"
                        value={editForm.firstName}
                        onChange={handleEditChange}
                        required
                      />
                    </label>

                    <label>
                      Last Name
                      <input
                        name="lastName"
                        value={editForm.lastName}
                        onChange={handleEditChange}
                        required
                      />
                    </label>

                    <label>
                      Email
                      <input
                        type="email"
                        name="emailAddress"
                        value={editForm.emailAddress}
                        onChange={handleEditChange}
                        required
                      />
                    </label>

                    <label>
                      Contact Number
                      <input
                        name="contactNumber"
                        value={editForm.contactNumber}
                        onChange={handleEditChange}
                      />
                    </label>

                    <label>
                      Message
                      <textarea
                        name="message"
                        value={editForm.message}
                        onChange={handleEditChange}
                        rows="4"
                      />
                    </label>

                    <div className="contact-card-actions">
                      <button
                        type="submit"
                        className="contact-edit-button"
                        disabled={saving}
                      >
                        {saving ? "Saving..." : "Update Message"}
                      </button>

                      <button
                        type="button"
                        className="contact-cancel-button"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </article>
            ))}
        </section>
      )}
    </main>
  );
}
