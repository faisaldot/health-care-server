import type { Server } from "node:http";
import app from "./app";
import config from "./config";

// Track server instance globally for cleanup
let server: Server | undefined;

/**
 * Gracefully shut down the server
 * @param exitCode - Exit code to use when process terminates
 */
const gracefulShutdown = (exitCode = 0): void => {
  console.log("\n🔄 Initiating graceful shutdown...");

  if (server) {
    server.close((err) => {
      if (err) {
        console.error("❌ Error during server shutdown:", err);
        process.exit(1);
      }

      console.log("✅ Server closed successfully");

      // Close database connections here if applicable
      // Example: await prisma.$disconnect();

      console.log("👋 Process exiting...");
      process.exit(exitCode);
    });

    // Force shutdown after 30 seconds if graceful shutdown fails
    setTimeout(() => {
      console.error("⚠️  Forced shutdown after timeout");
      process.exit(1);
    }, 30000);
  } else {
    console.log("⚠️  No active server to close");
    process.exit(exitCode);
  }
};

/**
 * Handle uncaught exceptions
 */
process.on("uncaughtException", (error: Error) => {
  console.error("💥 UNCAUGHT EXCEPTION! Shutting down...");
  console.error("Error name:", error.name);
  console.error("Error message:", error.message);
  console.error("Stack trace:", error.stack);

  // For uncaught exceptions, exit immediately as the process is in an unknown state
  process.exit(1);
});

/**
 * Handle unhandled promise rejections
 */
process.on(
  "unhandledRejection",
  (reason: unknown, promise: Promise<unknown>) => {
    console.error("💥 UNHANDLED REJECTION! Shutting down...");
    console.error("Reason:", reason);
    console.error("Promise:", promise);

    gracefulShutdown(1);
  },
);

/**
 * Handle SIGTERM signal (e.g., from Docker, Kubernetes)
 */
process.on("SIGTERM", () => {
  console.log("📡 SIGTERM signal received");
  gracefulShutdown(0);
});

/**
 * Handle SIGINT signal (e.g., Ctrl+C)
 */
process.on("SIGINT", () => {
  console.log("📡 SIGINT signal received");
  gracefulShutdown(0);
});

/**
 * Initialize database connection
 * Add your database initialization logic here
 */
function connectDatabase(): void {
  try {
    // await prisma.$connect();
    // console.log("✅ Database connected successfully");

    // For now, just log if database URL is configured
    if (config.databaseUrl) {
      console.log("✅ Database configuration detected");
      // Add your actual database connection logic here
    } else {
      console.warn("⚠️  No database URL configured");
    }
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    throw error;
  }
}

/**
 * Bootstrap and start the application
 */
async function bootstrap(): Promise<void> {
  try {
    console.log("🚀 Starting application...");
    console.log(`📍 Environment: ${config.nodeEnv || "development"}`);
    console.log(`📍 Port: ${config.port}`);

    // Connect to database
    await connectDatabase();

    // Start the HTTP server
    server = app.listen(config.port, () => {
      console.log("════════════════════════════════════════");
      console.log("✅ Server is running successfully!");
      console.log(`🌐 Local: http://localhost:${config.port}`);
      console.log(`📝 Environment: ${config.nodeEnv || "development"}`);
      console.log(`⏰ Started at: ${new Date().toISOString()}`);
      console.log("════════════════════════════════════════");
    });

    // Handle server errors
    server.on("error", (error: NodeJS.ErrnoException) => {
      if (error.code === "EADDRINUSE") {
        console.error(`❌ Port ${config.port} is already in use`);
      } else if (error.code === "EACCES") {
        console.error(`❌ Port ${config.port} requires elevated privileges`);
      } else {
        console.error("❌ Server error:", error);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error("❌ Failed to start application:", error);

    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Stack trace:", error.stack);
    }

    process.exit(1);
  }
}

// Start the application
bootstrap();

// Export for testing purposes
export { server, bootstrap, gracefulShutdown };
