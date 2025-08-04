import User from "../models/User.js";
import { connectDb } from "../utils/db.js";
import config from "../config/config.js";
import dotenv from "dotenv";
dotenv.config();

// Fonction pour créer un utilisateur admin
async function createAdminUser() {
  try {
    // Connexion à la base de données
    await connectDb();

    // Vérifier si l'utilisateur admin existe déjà
    const existingAdmin = await User.findOne({ username: "Salam" });
    if (existingAdmin) {
      console.log("L'utilisateur admin 'Salam' existe déjà");
      process.exit(0);
    }

    // Créer l'utilisateur admin (le modèle s'occupera du hashage du mot de passe)
    const adminUser = new User({
      username: "Salam",
      password: "Youssouf8190@",
      role: "admin"
    });

    await adminUser.save();

    console.log("Utilisateur admin 'Salam' créé avec succès");
    process.exit(0);
  } catch (err) {
    console.error("Erreur lors de la création de l'utilisateur admin:", err);
    process.exit(1);
  }
}

// Exécuter la fonction
createAdminUser();
