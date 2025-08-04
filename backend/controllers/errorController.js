import { logger } from "../middlewares/logger.js";

/**
 * Contrôleur pour gérer les erreurs de l'application
 */

class ErrorController {
  /**
   * Gérer les erreurs de validation
   * @param {Object} error - Erreur de validation
   * @param {Object} req - Requête HTTP
   * @param {Object} res - Réponse HTTP
   * @param {Function} next - Fonction suivante
   */
  static handleValidationError(error, req, res, next) {
    if (error.name === "ValidationError") {
      logger.warn(`Erreur de validation: ${error.message}`);
      return res.status(400).json({ 
        error: "Données invalides",
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    next(error);
  }

  /**
   * Gérer les erreurs de duplication
   * @param {Object} error - Erreur de duplication
   * @param {Object} req - Requête HTTP
   * @param {Object} res - Réponse HTTP
   * @param {Function} next - Fonction suivante
   */
  static handleDuplicateError(error, req, res, next) {
    if (error.code === 11000) {
      logger.warn(`Erreur de duplication: ${error.message}`);
      return res.status(400).json({ 
        error: "Entrée déjà existante",
        field: Object.keys(error.keyValue)[0]
      });
    }
    next(error);
  }

  /**
   * Gérer les erreurs de token JWT
   * @param {Object} error - Erreur de token
   * @param {Object} req - Requête HTTP
   * @param {Object} res - Réponse HTTP
   * @param {Function} next - Fonction suivante
   */
  static handleJWTError(error, req, res, next) {
    if (error.name === "JsonWebTokenError") {
      logger.warn(`Erreur de token JWT: ${error.message}`);
      return res.status(401).json({ error: "Token invalide" });
    }
    if (error.name === "TokenExpiredError") {
      logger.warn(`Token JWT expiré: ${error.message}`);
      return res.status(401).json({ error: "Token expiré" });
    }
    next(error);
  }

  /**
   * Gérer les erreurs de cast
   * @param {Object} error - Erreur de cast
   * @param {Object} req - Requête HTTP
   * @param {Object} res - Réponse HTTP
   * @param {Function} next - Fonction suivante
   */
  static handleCastError(error, req, res, next) {
    if (error.name === "CastError") {
      logger.warn(`Erreur de cast: ${error.message}`);
      return res.status(400).json({ error: "ID invalide" });
    }
    next(error);
  }

  /**
   * Gérer les erreurs génériques
   * @param {Object} error - Erreur
   * @param {Object} req - Requête HTTP
   * @param {Object} res - Réponse HTTP
   * @param {Function} next - Fonction suivante
   */
  static handleGenericError(error, req, res, next) {
    logger.error(`Erreur non gérée: ${error.message}`);
    
    // En développement, renvoyer l'erreur complète
    if (process.env.NODE_ENV === "development") {
      return res.status(500).json({
        error: error.message,
        stack: error.stack
      });
    }
    
    // En production, renvoyer un message générique
    res.status(500).json({ error: "Erreur serveur" });
  }
}

export default ErrorController;
