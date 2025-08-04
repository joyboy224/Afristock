import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import yaml from "yamljs";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import alertRoutes from "./routes/alerts.js";
import docsRoutes from "./routes/docs.js";
import { connectDb } from "./utils/db.js";
import { verifyJWT } from "./middlewares/auth.js";
import { morganMiddleware, errorLogger } from "./middlewares/logger.js";
import ErrorController from "./controllers/errorController.js";
import config from "./config/config.js";

dotenv.config();

const app = express();
const PORT = config.port;

// Middleware pour servir la documentation Swagger
const swaggerDocument = yaml.load("./docs/swagger.yaml");

// Middlewares
app.use(helmet());
app.use(cors({ origin: config.clientUrl, credentials: true }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(express.json());
app.use(cookieParser());

// Logger HTTP requests
app.use(morganMiddleware);

// DB
connectDb();

// Routes publiques
app.use("/api/auth", authRoutes);

// Routes protégées
app.use("/api/users", verifyJWT, userRoutes);
app.use("/api/alerts", verifyJWT, alertRoutes);

// Routes de documentation (protégées par clé API)
app.use("/api/docs", (req, res, next) => {
  const apiKey = req.header("X-API-Key");
  if (apiKey && apiKey === config.apiKey) {
    next();
  } else {
    res.status(401).json({ error: "Clé API invalide" });
  }
}, docsRoutes);

// Route pour la documentation Swagger (publique)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Global error logger
app.use(errorLogger);

// Gestionnaire d'erreurs
app.use(ErrorController.handleValidationError);
app.use(ErrorController.handleDuplicateError);
app.use(ErrorController.handleJWTError);
app.use(ErrorController.handleCastError);
app.use(ErrorController.handleGenericError);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
