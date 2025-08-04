import express from "express";
import AuthController from "../controllers/authController.js";

const router = express.Router();

// Route pour l'inscription (publique)
router.post("/register", AuthController.register);

// Route pour l'authentification
router.post("/login", AuthController.login);

// Route de vérification de token
router.get("/verify", AuthController.verifyToken);

// Route de déconnexion
router.post("/logout", AuthController.logout);

// Route pour la réinitialisation de mot de passe
router.post("/reset-password", AuthController.resetPassword);

// Route pour obtenir le profil de l'utilisateur
router.get("/profile", AuthController.getProfile);

export default router;

