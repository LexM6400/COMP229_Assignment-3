import Contact from "../models/Contact.js";

export async function getContacts(_request, response) {
  const contacts = await Contact.find().sort({ createdAt: -1 });
  response.json(contacts);
}

export async function getContact(request, response) {
  const contact = await Contact.findById(request.params.id);
  if (!contact) return response.status(404).json({ message: "Contact not found." });
  response.json(contact);
}

export async function createContact(request, response) {
  const contact = await Contact.create(request.body);
  response.status(201).json(contact);
}

export async function updateContact(request, response) {
  const contact = await Contact.findByIdAndUpdate(request.params.id, request.body, {
    new: true,
    runValidators: true,
  });
  if (!contact) return response.status(404).json({ message: "Contact not found." });
  response.json(contact);
}

export async function deleteContact(request, response) {
  const contact = await Contact.findByIdAndDelete(request.params.id);
  if (!contact) return response.status(404).json({ message: "Contact not found." });
  response.json({ message: "Contact removed.", contact });
}

export async function deleteContacts(_request, response) {
  const result = await Contact.deleteMany({});
  response.json({ message: "All contacts removed.", deletedCount: result.deletedCount });
}
