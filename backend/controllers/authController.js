import AuthService from "../services/authService.js";
import { logger } from "../middlewares/logger.js";

/**
 * Contrôleur pour gérer les opérations liées à l'authentification
 */

class AuthController {
  /**
   * Inscrire un nouvel utilisateur
   * @param {Object} req - Requête HTTP
   * @param {Object} res - Réponse HTTP
   */
  static async register(req, res) {
    const { username, password, role } = req.body;

    try {
      const result = await AuthService.registerUser(username, password, role);
      res.status(201).json({ message: result.message });
    } catch (error) {
      if (error.message === "Nom d'utilisateur déjà utilisé") {
        return res.status(400).json({ error: error.message });
      }
      logger.error(`Erreur lors de l'enregistrement: ${error.message}`);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }

  /**
   * Authentifier un utilisateur
   * @param {Object} req - Requête HTTP
   * @param {Object} res - Réponse HTTP
   */
  static async login(req, res) {
    const { username, password } = req.body;

    try {
      const result = await AuthService.authenticateUser(username, password);
      res.json({ 
        message: result.message,
        token: result.token, 
        user: result.user 
      });
    } catch (error) {
      if (error.message === "Utilisateur non trouvé" || error.message === "Mot de passe incorrect") {
        return res.status(401).json({ error: error.message });
      }
      logger.error(`Erreur lors de la connexion: ${error.message}`);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }

  /**
   * Vérifier un token JWT
   * @param {Object} req - Requête HTTP
   * @param {Object} res - Réponse HTTP
   */
  static async verifyToken(req, res) {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return res.status(401).json({ error: "Aucun token fourni" });
    }
    
    const result = await AuthService.verifyToken(token);
    if (result.valid) {
      res.json({ valid: true });
    } else {
      res.status(401).json({ error: "Token invalide" });
    }
  }

  /**
   * Déconnecter un utilisateur
   * @param {Object} req - Requête HTTP
   * @param {Object} res - Réponse HTTP
   */
  static async logout(req, res) {
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");
      const result = await AuthService.logoutUser(token);
      res.json({ message: result.message });
    } catch (error) {
      if (error.message === "Aucun token fourni") {
        return res.status(401).json({ error: error.message });
      }
      logger.error(`Erreur lors de la déconnexion: ${error.message}`);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }

  /**
   * Réinitialiser le mot de passe d'un utilisateur
   * @param {Object} req - Requête HTTP
   * @param {Object} res - Réponse HTTP
   */
  static async resetPassword(req, res) {
    const { username, newPassword } = req.body;

    try {
      const result = await AuthService.resetPassword(username, newPassword);
      res.json({ message: result.message });
    } catch (error) {
      if (error.message === "Utilisateur non trouvé") {
        return res.status(404).json({ error: error.message });
      }
      logger.error(`Erreur lors de la réinitialisation du mot de passe: ${error.message}`);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }

  /**
   * Obtenir le profil de l'utilisateur
   * @param {Object} req - Requête HTTP
   * @param {Object} res - Réponse HTTP
   */
  static async getProfile(req, res) {
    // Cette route devrait être protégée par le middleware verifyJWT dans index.js
    // Pour cette implémentation, nous supposons que le middleware a déjà vérifié le token
    const userProfile = AuthService.getUserProfile(req.user);
    res.json({ user: userProfile });
  }
}

export default AuthController;
