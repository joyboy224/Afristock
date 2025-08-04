import express from "express";
import AlertController from "../controllers/alertController.js";

const router = express.Router();

// Obtenir toutes les alertes
router.get("/", AlertController.getAllAlerts);

// Créer une nouvelle alerte
router.post("/", AlertController.createAlert);

// Obtenir une alerte par ID
router.get("/:id", AlertController.getAlertById);

// Mettre à jour une alerte
router.put("/:id", AlertController.updateAlert);

// Supprimer une alerte
router.delete("/:id", AlertController.deleteAlert);

// Obtenir les alertes par type
router.get("/type/:type", AlertController.getAlertsByType);

// Obtenir les alertes par sévérité
router.get("/severity/:severity", AlertController.getAlertsBySeverity);

export default router;
