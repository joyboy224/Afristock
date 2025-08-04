import express from "express";
import UserController from "../controllers/userController.js";
import { requireAdmin } from "../middlewares/rbac.js";

const router = express.Router();

// Récupérer tous les utilisateurs (admin uniquement)
router.get("/", requireAdmin, UserController.getAllUsers);

// Ajouter un nouvel utilisateur (admin uniquement)
router.post("/", requireAdmin, UserController.createUser);

// Modifier un utilisateur (admin uniquement)
router.put("/:id", requireAdmin, UserController.updateUser);

// Supprimer un utilisateur (admin uniquement)
router.delete("/:id", requireAdmin, UserController.deleteUser);

export default router;
