import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.DB) {
      throw new Error("DB environment variable is missing");
    }

    await mongoose.connect(process.env.DB);
    console.log("MongoDB Connected Successfully (Mongoose)");
  } catch (err) {
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1);
  }
};

export default connectDB;
