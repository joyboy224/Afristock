import User from "../models/User.js";
import { logger } from "../middlewares/logger.js";
import emailQueueService from "./emailQueueService.js";

/**
 * Service d'utilisateurs pour gérer les opérations liées aux utilisateurs
 */

class UserService {
  /**
   * Obtenir tous les utilisateurs
   * @returns {Promise<Array>} - Liste des utilisateurs
   */
  static async getAllUsers() {
    try {
      const users = await User.find({}, { password: 0 }); // Exclure les mots de passe
      return users;
    } catch (error) {
      logger.error(`Erreur lors de la récupération des utilisateurs: ${error.message}`);
      throw error;
    }
  }

  /**
   * Obtenir un utilisateur par ID
   * @param {string} id - ID de l'utilisateur
   * @returns {Promise<Object>} - Utilisateur trouvé
   */
  static async getUserById(id) {
    try {
      const user = await User.findById(id, { password: 0 }); // Exclure le mot de passe
      if (!user) {
        throw new Error("Utilisateur non trouvé");
      }
      return user;
    } catch (error) {
      logger.error(`Erreur lors de la récupération de l'utilisateur: ${error.message}`);
      throw error;
    }
  }

  /**
   * Mettre à jour un utilisateur
   * @param {string} id - ID de l'utilisateur
   * @param {Object} updates - Données de mise à jour
   * @returns {Promise<Object>} - Utilisateur mis à jour
   */
  static async updateUser(id, updates) {
    try {
      // Empêcher la mise à jour du mot de passe via cette méthode
      if (updates.password) {
        delete updates.password;
      }

      const user = await User.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true }
      );

      if (!user) {
        throw new Error("Utilisateur non trouvé");
      }

      logger.info(`Utilisateur mis à jour: ${user.username}`);
      return user;
    } catch (error) {
      logger.error(`Erreur lors de la mise à jour de l'utilisateur: ${error.message}`);
      throw error;
    }
  }

  /**
   * Supprimer un utilisateur
   * @param {string} id - ID de l'utilisateur
   * @returns {Promise<Object>} - Résultat de la suppression
   */
  static async deleteUser(id) {
    try {
      const user = await User.findByIdAndDelete(id);
      
      if (!user) {
        throw new Error("Utilisateur non trouvé");
      }

      logger.info(`Utilisateur supprimé: ${user.username}`);
      return { success: true, message: "Utilisateur supprimé avec succès" };
    } catch (error) {
      logger.error(`Erreur lors de la suppression de l'utilisateur: ${error.message}`);
      throw error;
    }
  }

  /**
   * Obtenir un utilisateur par nom d'utilisateur
   * @param {string} username - Nom d'utilisateur
   * @returns {Promise<Object>} - Utilisateur trouvé
   */
  static async getUserByUsername(username) {
    try {
      const user = await User.findOne({ username }, { password: 0 }); // Exclure le mot de passe
      if (!user) {
        throw new Error("Utilisateur non trouvé");
      }
      return user;
    } catch (error) {
      logger.error(`Erreur lors de la récupération de l'utilisateur: ${error.message}`);
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
      
      // Envoyer un email de confirmation via la file d'attente
      try {
        emailQueueService.sendPasswordResetEmail(user.email || `${username}@afristock.com`, username, "RESET_TOKEN", 1);
      } catch (emailError) {
        logger.warn(`Erreur lors de l'envoi de l'email de réinitialisation: ${emailError.message}`);
      }
      
      logger.info(`Mot de passe réinitialisé pour: ${username}`);
      return { success: true, message: "Mot de passe réinitialisé avec succès" };
    } catch (error) {
      logger.error(`Erreur lors de la réinitialisation du mot de passe: ${error.message}`);
      throw error;
    }
  }
}

export default UserService;
