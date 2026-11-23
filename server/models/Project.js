
import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    firstname: {
      type: String,
      required: true,
      trim: true,
    },

    lastname: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    completion: {
      type: Date,
      required: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    // Additional fields for the React portfolio
    image: {
      type: String,
      default: "",
    },

    imageAlt: {
      type: String,
      default: "",
    },

    technologies: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      default: "",
    },

    outcome: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    collection: "projects",
  }
);

export default mongoose.model("Project", projectSchema);
