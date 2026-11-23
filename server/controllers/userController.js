
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/User.js";

// Return user information without sensitive fields
function publicUser(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    created: user.created,
    updated: user.updated,
  };
}

// GET - Retrieve all users (Admin only)
export async function getUsers(_request, response) {
  const users = await User.find().sort({ created: -1 });
  response.json(users.map(publicUser));
}

// GET - Retrieve one user (Admin only)
export async function getUser(request, response) {
  if (!mongoose.isValidObjectId(request.params.id)) {
    return response.status(400).json({
      message: "Invalid user ID.",
    });
  }

  const user = await User.findById(request.params.id);

  if (!user) {
    return response.status(404).json({
      message: "User not found.",
    });
  }

  response.json(publicUser(user));
}

// POST - Create a regular user (Admin only)
export async function createUser(request, response) {
  const { name, email, password } = request.body;

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    !name.trim() ||
    !email.trim() ||
    password.length < 8
  ) {
    return response.status(400).json({
      message: "Valid name, email and password (8+ characters) are required.",
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await User.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    return response.status(409).json({
      message: "An account with this email already exists.",
    });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: passwordHash,
    role: "user",
  });

  response.status(201).json(publicUser(user));
}

// PUT - Update a user (Admin only)
export async function updateUser(request, response) {
  if (!mongoose.isValidObjectId(request.params.id)) {
    return response.status(400).json({
      message: "Invalid user ID.",
    });
  }

  const user = await User.findById(request.params.id)
    .select("+tokenVersion");

  if (!user) {
    return response.status(404).json({
      message: "User not found.",
    });
  }

  const { name, email, password } = request.body;

  if (name !== undefined) {
    if (typeof name !== "string" || !name.trim()) {
      return response.status(400).json({
        message: "Name cannot be empty.",
      });
    }

    user.name = name.trim();
  }

  if (email !== undefined) {
    if (typeof email !== "string" || !email.trim()) {
      return response.status(400).json({
        message: "Valid email is required.",
      });
    }

    user.email = email.trim().toLowerCase();
  }

  if (password !== undefined) {
    if (typeof password !== "string" || password.length < 8) {
      return response.status(400).json({
        message: "Password must contain at least 8 characters.",
      });
    }

    user.password = await bcrypt.hash(password, 12);
  }

  // Invalidate existing sessions after account changes
  user.tokenVersion += 1;

  await user.save();

  response.json(publicUser(user));
}

// DELETE - Remove one user (Admin only)
export async function deleteUser(request, response) {
  if (!mongoose.isValidObjectId(request.params.id)) {
    return response.status(400).json({
      message: "Invalid user ID.",
    });
  }

  // Prevent an administrator from deleting their own account
  if (request.user._id.toString() === request.params.id) {
    return response.status(403).json({
      message: "You cannot delete your own admin account.",
    });
  }

  const user = await User.findByIdAndDelete(request.params.id);

  if (!user) {
    return response.status(404).json({
      message: "User not found.",
    });
  }

  response.json({
    message: "User removed.",
    user: publicUser(user),
  });
}

// DELETE ALL - Disabled for safety
export async function deleteUsers(_request, response) {
  return response.status(403).json({
    message: "Bulk deletion of user accounts is disabled.",
  });
}
