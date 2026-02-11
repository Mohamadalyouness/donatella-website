import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Ensure .env is loaded (in case this file is imported directly)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envResult = dotenv.config({ path: join(__dirname, ".env") });

// Debug: Check if .env file was loaded
if (envResult.error) {
  // eslint-disable-next-line no-console
  console.warn("⚠️ Warning: Could not load .env file:", envResult.error.message);
} else {
  // eslint-disable-next-line no-console
  console.log("✅ .env file loaded successfully");
}

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/donatella";

export async function connectDB() {
  // Debug: Check if env var is loaded
  // eslint-disable-next-line no-console
  console.log("🔍 Checking environment variables...");
  // eslint-disable-next-line no-console
  console.log("MONGODB_URI from env:", process.env.MONGODB_URI ? "✅ Found" : "❌ Not found (using default)");

  // Check if password placeholder is still in the connection string
  if (MONGODB_URI.includes("<db_password>")) {
    // eslint-disable-next-line no-console
    console.error(
      "❌ ERROR: Please replace <db_password> in your .env file with your actual MongoDB Atlas password!"
    );
    // eslint-disable-next-line no-console
    console.error("Current connection string:", MONGODB_URI);
    process.exit(1);
  }

  // Check if still using localhost default
  if (MONGODB_URI.includes("localhost") || MONGODB_URI.includes("127.0.0.1")) {
    // eslint-disable-next-line no-console
    console.error("❌ ERROR: Using localhost connection. Your .env file may not be loaded!");
    // eslint-disable-next-line no-console
    console.error("💡 Make sure:");
    // eslint-disable-next-line no-console
    console.error("   1. The .env file exists in the server/ directory");
    // eslint-disable-next-line no-console
    console.error("   2. The .env file has MONGODB_URI set (without <db_password> placeholder)");
    // eslint-disable-next-line no-console
    console.error("   3. You've restarted the server after creating/editing .env");
    process.exit(1);
  }

  // eslint-disable-next-line no-console
  console.log("🔗 Attempting to connect to MongoDB...");
  // eslint-disable-next-line no-console
  console.log("📍 Connection string:", MONGODB_URI.replace(/:[^:@]+@/, ":****@")); // Hide password in logs

  try {
    await mongoose.connect(MONGODB_URI, {
      // Optimized MongoDB Atlas connection options for faster responses
      serverSelectionTimeoutMS: 5000, // Reduced from 10s to 5s
      socketTimeoutMS: 10000, // Reduced from 45s to 10s
      maxPoolSize: 10, // Connection pool size
      minPoolSize: 2, // Minimum connections
    });
    // eslint-disable-next-line no-console
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("❌ MongoDB connection error:", err.message);
    // eslint-disable-next-line no-console
    console.error("💡 Make sure:");
    // eslint-disable-next-line no-console
    console.error("   1. Your .env file has the correct password (not <db_password>)");
    // eslint-disable-next-line no-console
    console.error("   2. Your IP is whitelisted in MongoDB Atlas Network Access");
    // eslint-disable-next-line no-console
    console.error("   3. Your database user exists and has the correct password");
    process.exit(1);
  }
}

