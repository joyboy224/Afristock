import jwt from "jsonwebtoken";
import User from "../models/User.js";
import BlacklistedToken from "../models/BlacklistedToken.js";
import { logger } from "../middlewares/logger.js";
import config from "../config/config.js";
import emailQueueService from "./emailQueueService.js";

/**
 * Service d'authentification pour gérer les opérations liées à l'authentification
 */

class AuthService {
  /**
   * Enregistrer un nouvel utilisateur
   * @param {string} username - Nom d'utilisateur
   * @param {string} password - Mot de passe
   * @param {string} role - Rôle de l'utilisateur
   * @returns {Promise<Object>} - Résultat de l'opération
   */
  static async registerUser(username, password, role) {
    try {
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        throw new Error("Nom d'utilisateur déjà utilisé");
      }

      // Hacher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Créer un nouvel utilisateur
      const newUser = new User({ 
        username, 
        password: hashedPassword, 
        role: role || "vendeur"
      });

      await newUser.save();
      
      // Envoyer un email de bienvenue via la file d'attente
      try {
        emailQueueService.sendWelcomeEmail(newUser.email || `${username}@afristock.com`, username, 2);
      } catch (emailError) {
        logger.warn(`Erreur lors de l'envoi de l'email de bienvenue: ${emailError.message}`);
      }
      
      logger.info(`Nouvel utilisateur enregistré: ${username}`);
      return { success: true, message: "Utilisateur créé avec succès" };
    } catch (error) {
      logger.error(`Erreur lors de l'enregistrement: ${error.message}`);
      throw error;
    }
  }

  /**
   * Authentifier un utilisateur
   * @param {string} username - Nom d'utilisateur
   * @param {string} password - Mot de passe
   * @returns {Promise<Object>} - Résultat de l'authentification
   */
  static async authenticateUser(username, password) {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        logger.warn(`Tentative de connexion échouée: utilisateur ${username} non trouvé`);
        throw new Error("Utilisateur non trouvé");
      }

      // Vérifier le mot de passe
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        logger.warn(`Tentative de connexion échouée: mot de passe incorrect pour ${username}`);
        throw new Error("Mot de passe incorrect");
      }

      // Générer un token JWT
      const token = jwt.sign(
        { id: user._id, username: user.username, role: user.role },
        config.jwtSecret,
        { expiresIn: "1h" }
      );

      logger.info(`Connexion réussie: ${username} (${user.role})`);
      return { 
        success: true,
        message: "Authentification réussie",
        token, 
        user: { id: user._id, username: user.username, role: user.role } 
      };
    } catch (error) {
      logger.error(`Erreur lors de la connexion: ${error.message}`);
      throw error;
    }
  }

  /**
   * Vérifier un token JWT
   * @param {string} token - Token JWT
   * @returns {Promise<boolean>} - Validité du token
   */
  static async verifyToken(token) {
    try {
      // Vérifier si le token est sur liste noire
      const blacklistedToken = await BlacklistedToken.findOne({ token });
      if (blacklistedToken) {
        logger.warn("Token sur liste noire");
        return false;
      }

      const decoded = jwt.verify(token, config.jwtSecret);
      return { valid: true, decoded };
    } catch (error) {
      logger.warn(`Token invalide: ${error.message}`);
      return { valid: false };
    }
  }

  /**
   * Déconnecter un utilisateur (ajouter le token à la liste noire)
   * @param {string} token - Token JWT
   * @returns {Promise<Object>} - Résultat de la déconnexion
   */
  static async logoutUser(token) {
    try {
      if (!token) {
        throw new Error("Aucun token fourni");
      }
      
      // Vérifier si le token est valide
      const decoded = jwt.verify(token, config.jwtSecret);
      
      // Ajouter le token à la liste noire
      const expiresAt = new Date(decoded.exp * 1000);
      await BlacklistedToken.create({ token, expiresAt });
      
      logger.info(`Déconnexion réussie: ${decoded.username}`);
      return { success: true, message: "Déconnexion réussie" };
    } catch (error) {
      logger.error(`Erreur lors de la déconnexion: ${error.message}`);
      throw error;
    }
  }

  /**
   * Réinitialiser le mot de passe d'un utilisateur
   * @param {string} username - Nom d'utilisateur
   * @param {string} newPassword - Nouveau mot de passe
   * @returns {Promise<Object>} - Résultat de la réinitialisation
   */
  static async resetPassword(username, newPassword) {
    try {
      // Trouver l'utilisateur
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error("Utilisateur non trouvé");
      }

      // Hacher le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Mettre à jour le mot de passe
      user.password = hashedPassword;
      await user.save();
      
      logger.info(`Mot de passe réinitialisé pour: ${username}`);
      return { success: true, message: "Mot de passe réinitialisé avec succès" };
    } catch (error) {
      logger.error(`Erreur lors de la réinitialisation du mot de passe: ${error.message}`);
      throw error;
    }
  }

  /**
   * Obtenir le profil d'un utilisateur
   * @param {Object} user - Informations de l'utilisateur du token
   * @returns {Object} - Profil de l'utilisateur
   */
  static getUserProfile(user) {
    return {
      id: user.id,
      username: user.username,
      role: user.role
    };
  }
}

export default AuthService;
