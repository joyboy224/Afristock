import UserService from "../services/userService.js";
import { logger } from "../middlewares/logger.js";

/**
 * Contrôleur pour gérer les opérations liées aux utilisateurs
 */

class UserController {
  /**
   * Obtenir tous les utilisateurs
   * @param {Object} req - Requête HTTP
   * @param {Object} res - Réponse HTTP
   */
  static async getAllUsers(req, res) {
    try {
      const users = await UserService.getAllUsers();
      res.json(users);
    } catch (error) {
      logger.error(`Erreur lors de la récupération des utilisateurs: ${error.message}`);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }

  /**
   * Ajouter un nouvel utilisateur
   * @param {Object} req - Requête HTTP
   * @param {Object} res - Réponse HTTP
   */
  static async createUser(req, res) {
    const { username, password, role } = req.body;
    try {
      // Vérifier si l'utilisateur existe déjà
      try {
        await UserService.getUserByUsername(username);
        return res.status(400).json({ error: "Nom d'utilisateur déjà utilisé" });
      } catch (error) {
        // Si l'utilisateur n'existe pas, c'est normal, on continue
        if (error.message !== "Utilisateur non trouvé") {
          throw error;
        }
      }

      // Hacher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Créer l'utilisateur directement avec le modèle
      const newUser = new User({ username, password: hashedPassword, role });
      await newUser.save();
      
      logger.info(`Utilisateur créé par admin: ${username} (${role})`);
      res.status(201).json({ message: "Utilisateur créé avec succès" });
    } catch (error) {
      logger.error(`Erreur lors de la création d'utilisateur: ${error.message}`);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }

  /**
   * Mettre à jour un utilisateur
   * @param {Object} req - Requête HTTP
   * @param {Object} res - Réponse HTTP
   */
  static async updateUser(req, res) {
    const { username, password, role } = req.body;
    try {
      const updates = {};
      if (username) updates.username = username;
      if (role) updates.role = role;
      
      // Si un mot de passe est fourni, le hacher
      if (password) {
        updates.password = await bcrypt.hash(password, 10);
      }
      
      const user = await UserService.updateUser(req.params.id, updates);
      logger.info(`Utilisateur mis à jour par admin: ${user.username} (${user.role})`);
      res.json({ message: "Utilisateur mis à jour avec succès" });
    } catch (error) {
      if (error.message === "Utilisateur non trouvé") {
        return res.status(404).json({ error: error.message });
      }
      logger.error(`Erreur lors de la mise à jour d'utilisateur: ${error.message}`);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }

  /**
   * Supprimer un utilisateur
   * @param {Object} req - Requête HTTP
   * @param {Object} res - Réponse HTTP
   */
  static async deleteUser(req, res) {
    try {
      const result = await UserService.deleteUser(req.params.id);
      res.json({ message: result.message });
    } catch (error) {
      if (error.message === "Utilisateur non trouvé") {
        return res.status(404).json({ error: error.message });
      }
      logger.error(`Erreur lors de la suppression d'utilisateur: ${error.message}`);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }
}

export default UserController;
