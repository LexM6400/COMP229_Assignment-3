import Project from "../models/Project.js";

export async function getProjects(_request, response) {
  response.json(await Project.find().sort({ createdAt: -1 }));
}

export async function getProject(request, response) {
  const project = await Project.findById(request.params.id);
  if (!project) return response.status(404).json({ message: "Project not found." });
  response.json(project);
}

export async function createProject(request, response) {
  response.status(201).json(await Project.create(request.body));
}

export async function updateProject(request, response) {
  const project = await Project.findByIdAndUpdate(request.params.id, request.body, {
    new: true,
    runValidators: true,
  });
  if (!project) return response.status(404).json({ message: "Project not found." });
  response.json(project);
}

export async function deleteProject(request, response) {
  const project = await Project.findByIdAndDelete(request.params.id);
  if (!project) return response.status(404).json({ message: "Project not found." });
  response.json({ message: "Project removed.", project });
}

export async function deleteProjects(_request, response) {
  const result = await Project.deleteMany({});
  response.json({ message: "All projects removed.", deletedCount: result.deletedCount });
}
