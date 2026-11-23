import mongoose from "mongoose";

export default async function connectDatabase() {
  const connectionString = process.env.MONGODB_URI;

  if (!connectionString) {
    throw new Error("MONGODB_URI is missing. Add it to the root .env file.");
  }

  const connection = await mongoose.connect(connectionString, {
    dbName: "Portfolio",
  });

  console.log(`MongoDB connected: ${connection.connection.host}/${connection.connection.name}`);
}
