import mongoose from "mongoose";

try {
  // Connect
  const connection = await mongoose.connect(process.env.MONGODB_URI!, {
    dbName: process.env.DB_NAME,
  });
  console.log("\x1b[35m" + "✔️ MongoDB connected via Mongoose" + "\x1b[0m");
  console.log(`Using db: ${connection.connection.name}`);
} catch (error) {
  // Log error and end Node process if it fails
  console.error("\x1b[31m" + "❌ MongoDB connection error:" + "\x1b[0m", error);
  process.exit(1);
}
