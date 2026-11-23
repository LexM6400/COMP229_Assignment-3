
import mongoose from "mongoose";

const qualificationSchema = new mongoose.Schema(
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

    // Additional Education page fields
    institution: {
      type: String,
      default: "",
      trim: true,
    },

    program: {
      type: String,
      default: "",
      trim: true,
    },

    credential: {
      type: String,
      default: "",
      trim: true,
    },

    dates: {
      type: String,
      default: "",
      trim: true,
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    courses: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: "qualifications",
  }
);

export default mongoose.model(
  "Qualification",
  qualificationSchema
);
