import { logger } from "../middlewares/logger.js";
import config from "../config/config.js";

/**
 * Service de documentation pour gérer les opérations liées à la documentation
 */

class DocsService {
  /**
   * Vérifier la clé API pour accéder à la documentation
   * @param {string} apiKey - Clé API fournie
   * @returns {boolean} - Validité de la clé API
   */
  static verifyApiKey(apiKey) {
    try {
      const isValid = apiKey && apiKey === config.apiKey;
      
      if (isValid) {
        logger.info("Clé API valide pour l'accès à la documentation");
      } else {
        logger.warn("Tentative d'accès à la documentation avec une clé API invalide");
      }
      
      return isValid;
    } catch (error) {
      logger.error(`Erreur lors de la vérification de la clé API: ${error.message}`);
      return false;
    }
  }

  /**
   * Obtenir les informations de la documentation
   * @returns {Object} - Informations de la documentation
   */
  static getDocumentationInfo() {
    try {
      const docsInfo = {
        title: "API Afristock",
        version: "1.0.0",
        description: "Documentation de l'API pour le système de gestion de stock Afristock",
        endpoints: {
          auth: {
            "/api/auth/register": "Inscrire un nouvel utilisateur",
            "/api/auth/login": "Authentifier un utilisateur",
            "/api/auth/verify": "Vérifier un token JWT",
            "/api/auth/logout": "Déconnecter un utilisateur",
            "/api/auth/reset-password": "Réinitialiser le mot de passe d'un utilisateur",
            "/api/auth/profile": "Obtenir le profil de l'utilisateur"
          },
          users: {
            "/api/users": "Gérer les utilisateurs (CRUD)",
            "/api/users/:id": "Gérer un utilisateur spécifique (CRUD)"
          },
          alerts: {
            "/api/alerts": "Gérer les alertes (CRUD)",
            "/api/alerts/:id": "Gérer une alerte spécifique (CRUD)",
            "/api/alerts/type/:type": "Obtenir les alertes par type",
            "/api/alerts/severity/:severity": "Obtenir les alertes par sévérité"
          }
        },
        authentication: {
          type: "JWT",
          header: "Authorization: Bearer <token>"
        },
        rateLimit: {
          windowMs: "15 minutes",
          max: 100,
          message: "Trop de requêtes, veuillez réessayer plus tard"
        }
      };
      
      logger.info("Informations de documentation récupérées");
      return docsInfo;
    } catch (error) {
      logger.error(`Erreur lors de la récupération des informations de documentation: ${error.message}`);
      throw error;
    }
  }

  /**
   * Obtenir les informations de santé de l'API
   * @returns {Object} - Informations de santé de l'API
   */
  static getHealthInfo() {
    try {
      const healthInfo = {
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: "1.0.0",
        environment: process.env.NODE_ENV || "development"
      };
      
      logger.info("Informations de santé de l'API récupérées");
      return healthInfo;
    } catch (error) {
      logger.error(`Erreur lors de la récupération des informations de santé: ${error.message}`);
      throw error;
    }
  }
}

export default DocsService;
