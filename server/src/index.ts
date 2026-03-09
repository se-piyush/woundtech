import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import routes from "./routes";
import { errorHandler } from "./middleware/errorHandler";
import { swaggerSpec } from "./config/swagger";

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware (simple implementation)
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }

  next();
});

// Swagger API Documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Patient Visit Tracker API Docs",
  }),
);

// API routes
app.use("/api", routes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler - must be last
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
  console.log(`Patient Visit Tracker is ready!`);
});

export default app;
