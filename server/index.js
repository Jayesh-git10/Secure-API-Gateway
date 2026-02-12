import express from "express";
import { createServer } from "http";
import { registerRoutes } from "./routes.js";
import { serveStatic } from "./static.js";

const app = express();
const httpServer = createServer(app);

// Body parser
app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  })
);

app.use(express.urlencoded({ extended: false }));

// Logger
export function log(message, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;

    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;

      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    // Register API routes
    await registerRoutes(httpServer, app);

    // Error handler
    app.use((err, _req, res, next) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      console.error("Internal Server Error:", err);

      if (res.headersSent) {
        return next(err);
      }

      return res.status(status).json({ message });
    });

    // Production vs Development
    if (process.env.NODE_ENV === "production") {
      // Serve built frontend
      serveStatic(app);
    } else {
      const { setupVite } = await import("./vite.js");
      await setupVite(httpServer, app);
    }

    // IMPORTANT: Use PORT from environment (Render requirement)
    const port = parseInt(process.env.PORT || "5000", 10);

    httpServer.listen(
      {
        port,
        host: "0.0.0.0",
        reusePort: true,
      },
      () => {
        log(`Server running on port ${port}`);
      }
    );
  } catch (err) {
    console.error("Server failed to start:", err);
    process.exit(1);
  }
})();
