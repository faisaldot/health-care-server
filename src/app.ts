import cors from "cors";
import express from "express";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import config from "./config";

const app = express();

// Cors configuration
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

// Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get("/api/v1/health", (_req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    environment: config.nodeEnv,
    timeStamp: new Date().toISOString(),
  });
});

// Not found and global error handler route
app.use(globalErrorHandler);
app.use(notFound);

export default app;
