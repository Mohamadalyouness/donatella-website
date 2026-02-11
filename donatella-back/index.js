// IMPORTANT: Load .env FIRST before any other imports that use environment variables
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file from server directory BEFORE other imports
dotenv.config({ path: join(__dirname, ".env") });

// Now import other modules that depend on environment variables
import express from "express";
import cors from "cors";
import { connectDB } from "./config.db.js";
import { itemsRouter } from "./routes.items.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: true, // Allow any origin (for network access: phone/tablet at 192.168.x.x:5173)
    credentials: false,
  })
);
app.use(express.json({ limit: "10mb" })); // Increased for base64 images

app.get("/", (_req, res) => {
  res.json({ status: "ok", message: "Donatella API" });
});

app.use("/api/items", itemsRouter);

app.listen(PORT, "0.0.0.0", async () => {
  // eslint-disable-next-line no-console
  console.log(`\n🚀 Starting Donatella API Server...`);
  // eslint-disable-next-line no-console
  console.log(`📡 Port: ${PORT}`);
  try {
    await connectDB();
    // eslint-disable-next-line no-console
    console.log(`✅ Server ready! API available at http://localhost:${PORT}`);
    // eslint-disable-next-line no-console
    console.log(`📋 Endpoints:`);
    // eslint-disable-next-line no-console
    console.log(`   GET    http://localhost:${PORT}/api/items`);
    // eslint-disable-next-line no-console
    console.log(`   POST   http://localhost:${PORT}/api/items`);
    // eslint-disable-next-line no-console
    console.log(`\n`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`❌ Failed to start server:`, err.message);
    process.exit(1);
  }
});

