import Qualification from "../models/Qualification.js";

export async function getQualifications(_request, response) {
  response.json(await Qualification.find().sort({ createdAt: -1 }));
}

export async function getQualification(request, response) {
  const qualification = await Qualification.findById(request.params.id);
  if (!qualification) return response.status(404).json({ message: "Qualification not found." });
  response.json(qualification);
}

export async function createQualification(request, response) {
  response.status(201).json(await Qualification.create(request.body));
}

export async function updateQualification(request, response) {
  const qualification = await Qualification.findByIdAndUpdate(
    request.params.id,
    request.body,
    { new: true, runValidators: true },
  );
  if (!qualification) return response.status(404).json({ message: "Qualification not found." });
  response.json(qualification);
}

export async function deleteQualification(request, response) {
  const qualification = await Qualification.findByIdAndDelete(request.params.id);
  if (!qualification) return response.status(404).json({ message: "Qualification not found." });
  response.json({ message: "Qualification removed.", qualification });
}

export async function deleteQualifications(_request, response) {
  const result = await Qualification.deleteMany({});
  response.json({ message: "All qualifications removed.", deletedCount: result.deletedCount });
}
