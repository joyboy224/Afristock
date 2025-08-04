import DocsService from "../services/docsService.js";
import { logger } from "../middlewares/logger.js";

/**
 * Contrôleur pour gérer les opérations liées à la documentation
 */

class DocsController {
  /**
   * Obtenir la documentation des codes d'erreur
   * @param {Object} req - Requête HTTP
   * @param {Object} res - Réponse HTTP
   */
  static async getDocumentation(req, res) {
    try {
      const docsInfo = DocsService.getDocumentationInfo();
      res.json({
        title: docsInfo.title,
        version: docsInfo.version,
        description: docsInfo.description,
        endpoints: docsInfo.endpoints,
        authentication: docsInfo.authentication,
        rateLimit: docsInfo.rateLimit,
        errors: [
          { code: 1001, message: "Utilisateur non trouvé" },
          { code: 1002, message: "Mot de passe incorrect" },
          { code: 2001, message: "Accès refusé" },
          { code: 3001, message: "Token invalide" },
          { code: 3002, message: "Token expiré" },
          { code: 4001, message: "Données invalides" },
          { code: 5001, message: "Erreur serveur" }
        ]
      });
    } catch (error) {
      logger.error(`Erreur lors de la récupération de la documentation: ${error.message}`);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }

  /**
   * Obtenir les informations de santé de l'API
   * @param {Object} req - Requête HTTP
   * @param {Object} res - Réponse HTTP
   */
  static async getHealth(req, res) {
    try {
      const healthInfo = DocsService.getHealthInfo();
      res.json(healthInfo);
    } catch (error) {
      logger.error(`Erreur lors de la récupération des informations de santé: ${error.message}`);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }

  /**
   * Obtenir la documentation Swagger
   * @param {Object} req - Requête HTTP
   * @param {Object} res - Réponse HTTP
   */
  static async getSwagger(req, res) {
    try {
      res.json({
        message: "Documentation Swagger disponible à /api-docs",
        url: "/api-docs"
      });
    } catch (error) {
      logger.error(`Erreur lors de la récupération de la documentation Swagger: ${error.message}`);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }
}

export default DocsController;
