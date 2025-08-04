import express from "express";
import DocsController from "../controllers/docsController.js";

const router = express.Router();

// Obtenir la documentation des codes d'erreur
router.get("/", DocsController.getDocumentation);

// Obtenir les informations de santé de l'API
router.get("/health", DocsController.getHealth);

// Obtenir la documentation Swagger
router.get("/swagger", DocsController.getSwagger);

export default router;
