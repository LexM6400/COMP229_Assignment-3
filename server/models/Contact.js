import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    // These two optional fields keep the additional information collected by A1.
    contactNumber: { type: String, trim: true, default: "" },
    message: { type: String, trim: true, default: "" },
  },
  { timestamps: true, collection: "contacts" },
);

export default mongoose.model("Contact", contactSchema);
