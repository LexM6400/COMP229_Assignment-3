import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const oneDayMs = 24 * 60 * 60 * 1000;

function createToken(user) {
  return jwt.sign(
    { userId: user._id.toString(), tokenVersion: user.tokenVersion },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );
}

function setTokenCookie(response, token) {
  response.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: oneDayMs,
  });
}

function safeUser(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    created: user.created,
    updated: user.updated,
  };
}

export async function signUp(request, response) {
  const { name, email, password } = request.body;
  if (!name?.trim() || !email?.trim() || !password) {
    return response.status(400).json({ message: "Name, email, and password are required." });
  }
  if (password.length < 8) {
    return response.status(400).json({ message: "Password must contain at least 8 characters." });
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (await User.findOne({ email: normalizedEmail })) {
    return response.status(409).json({ message: "An account with this email already exists." });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name: name.trim(), email: normalizedEmail, password: passwordHash });
  const token = createToken(user);
  setTokenCookie(response, token);
  response.status(201).json({ message: "Account created.", token, user: safeUser(user) });
}

export async function signIn(request, response) {
  const { email, password } = request.body;
  if (!email?.trim() || !password) {
    return response.status(400).json({ message: "Email and password are required." });
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password +tokenVersion");
  const passwordMatches = user && await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    return response.status(401).json({ message: "Email or password is incorrect." });
  }

  const token = createToken(user);
  setTokenCookie(response, token);
  response.json({ message: "Signed in.", token, user: safeUser(user) });
}

export async function signOut(request, response) {
  // Incrementing the version revokes all JWTs issued before this sign-out.
  await User.findByIdAndUpdate(request.user._id, { $inc: { tokenVersion: 1 } });
  response.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  response.json({ message: "Signed out." });
}

export function getCurrentUser(request, response) {
  response.json({ user: safeUser(request.user) });
}
