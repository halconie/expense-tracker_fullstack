import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    const DB_OPTIONS = {
      // dbName: "cuvette",
      useNewUrlParser: true,
      useUnifiedTopology: true
    };
    await mongoose.connect(process.env.MONGODB_URI, DB_OPTIONS);
    console.log("Connected to Database ✅");
  } catch (error) {
    console.error("Database connection failed ❌:", error.message);
    process.exit(1);
  }
};

export default connectDB;
