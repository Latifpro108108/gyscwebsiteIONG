import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import { seedDatabase } from "./seed/seed.js";
import authRoutes from "./routes/auth.js";
import contentRoutes from "./routes/content.js";
import adminRoutes from "./routes/admin.js";

const app = express();
const PORT = Number(process.env.PORT) || 5000;

function isAllowedOrigin(origin) {
  if (!origin) return true;
  const configured = (process.env.CLIENT_URL || "http://localhost:5173")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  if (configured.includes(origin)) return true;
  return /^http:\/\/localhost:\d+$/.test(origin) || /^http:\/\/127\.0\.0\.1:\d+$/.test(origin);
}

app.use(
  cors({
    origin(origin, callback) {
      callback(null, isAllowedOrigin(origin));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/admin", adminRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: err.message || "Server error" });
});

function listen(port) {
  return new Promise((resolve, reject) => {
    const server = app.listen(port, () => resolve(server));
    server.on("error", reject);
  });
}

async function start() {
  await connectDB();
  await seedDatabase();

  try {
    await listen(PORT);
    console.log(`GYSC API running on http://localhost:${PORT}`);
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && err.code === "EADDRINUSE") {
      console.error(`Port ${PORT} is already in use.`);
      console.error("Stop the other server (Ctrl+C in its terminal) or run:");
      console.error(`  npx kill-port ${PORT}`);
      process.exit(1);
    }
    throw err;
  }
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
