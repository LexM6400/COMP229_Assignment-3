import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDatabase from "./server/config/database.js";
import contactRoutes from "./server/routes/contactRoutes.js";
import projectRoutes from "./server/routes/projectRoutes.js";
import qualificationRoutes from "./server/routes/qualificationRoutes.js";
import userRoutes from "./server/routes/userRoutes.js";
import authRoutes from "./server/routes/authRoutes.js";
import { notFound, errorHandler } from "./server/middleware/errorMiddleware.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (_request, response) => {
  response.json({ message: "Portfolio API is running" });
});

app.use("/api/contacts", contactRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/qualifications", qualificationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.use(notFound);
app.use(errorHandler);

async function startServer() {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing. Add it to the root .env file.");
    }
    await connectDatabase();
    app.listen(port, () => {
      console.log(`Portfolio API running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error(`Server could not start: ${error.message}`);
    process.exit(1);
  }
}

startServer();
