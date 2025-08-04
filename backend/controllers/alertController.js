import AlertService from "../services/alertService.js";
import { logger } from "../middlewares/logger.js";

/**
 * Contrôleur pour gérer les opérations liées aux alertes
 */

class AlertController {
  /**
   * Obtenir toutes les alertes
   * @param {Object} req - Requête HTTP
   * @param {Object} res - Réponse HTTP
   */
  static async getAllAlerts(req, res) {
    try {
      const alerts = await AlertService.getAllAlerts();
      res.json(alerts);
    } catch (error) {
      logger.error(`Erreur lors de la récupération des alertes: ${error.message}`);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }

  /**
   * Créer une nouvelle alerte
   * @param {Object} req - Requête HTTP
   * @param {Object} res - Réponse HTTP
   */
  static async createAlert(req, res) {
    try {
      const alert = await AlertService.createAlert(req.body);
      res.status(201).json(alert);
    } catch (error) {
      logger.error(`Erreur lors de la création de l'alerte: ${error.message}`);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }

  /**
   * Obtenir une alerte par ID
   * @param {Object} req - Requête HTTP
   * @param {Object} res - Réponse HTTP
   */
  static async getAlertById(req, res) {
    try {
      // Pour cette démonstration, nous simulons la récupération d'une alerte par ID
      const alerts = await AlertService.getAllAlerts();
      const alert = alerts.find(a => a.id === req.params.id);
      
      if (!alert) {
        return res.status(404).json({ error: "Alerte non trouvée" });
      }
      
      res.json(alert);
    } catch (error) {
      logger.error(`Erreur lors de la récupération de l'alerte: ${error.message}`);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }

  /**
   * Mettre à jour une alerte
   * @param {Object} req - Requête HTTP
   * @param {Object} res - Réponse HTTP
   */
  static async updateAlert(req, res) {
    try {
      const alert = await AlertService.updateAlert(req.params.id, req.body);
      res.json(alert);
    } catch (error) {
      logger.error(`Erreur lors de la mise à jour de l'alerte: ${error.message}`);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }

  /**
   * Supprimer une alerte
   * @param {Object} req - Requête HTTP
   * @param {Object} res - Réponse HTTP
   */
  static async deleteAlert(req, res) {
    try {
      const result = await AlertService.deleteAlert(req.params.id);
      res.json({ message: result.message });
    } catch (error) {
      logger.error(`Erreur lors de la suppression de l'alerte: ${error.message}`);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }

  /**
   * Obtenir les alertes par type
   * @param {Object} req - Requête HTTP
   * @param {Object} res - Réponse HTTP
   */
  static async getAlertsByType(req, res) {
    try {
      const alerts = await AlertService.getAlertsByType(req.params.type);
      res.json(alerts);
    } catch (error) {
      logger.error(`Erreur lors de la récupération des alertes par type: ${error.message}`);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }

  /**
   * Obtenir les alertes par sévérité
   * @param {Object} req - Requête HTTP
   * @param {Object} res - Réponse HTTP
   */
  static async getAlertsBySeverity(req, res) {
    try {
      const alerts = await AlertService.getAlertsBySeverity(req.params.severity);
      res.json(alerts);
    } catch (error) {
      logger.error(`Erreur lors de la récupération des alertes par sévérité: ${error.message}`);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }
}

export default AlertController;
