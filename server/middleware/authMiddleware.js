
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Verify authentication
export async function protect(request, response, next) {
  try {
    const authorization = request.headers.authorization;

    const bearerToken = authorization?.startsWith("Bearer ")
      ? authorization.slice(7)
      : null;

    const token = request.cookies?.token || bearerToken;

    if (!token) {
      return response.status(401).json({
        message: "Please sign in to continue.",
      });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(payload.userId)
      .select("+tokenVersion");

    if (!user || user.tokenVersion !== payload.tokenVersion) {
      return response.status(401).json({
        message: "Your session is no longer valid. Please sign in again.",
      });
    }

    request.user = user;
    next();

  } catch (error) {
    return response.status(401).json({
      message: "Invalid or expired token. Please sign in again.",
    });
  }
}

// Restrict routes to specific roles
export function authorize(...allowedRoles) {
  return (request, response, next) => {
    if (!request.user) {
      return response.status(401).json({
        message: "Authentication required.",
      });
    }

    if (!allowedRoles.includes(request.user.role)) {
      return response.status(403).json({
        message: "Access denied. Insufficient permissions.",
      });
    }

    next();
  };
}
