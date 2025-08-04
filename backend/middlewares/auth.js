import jwt from "jsonwebtoken";
import config from "../config/config.js";
import BlacklistedToken from "../models/BlacklistedToken.js";
import { logger } from "./logger.js";

export const verifyJWT = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1] || req.cookies.token;

  if (!token) {
    logger.warn("Accès refusé: aucun token fourni");
    return res.status(401).json({ error: "Accès refusé: aucun token fourni" });
  }

  try {
    // Vérifier si le token est sur liste noire
    const blacklistedToken = await BlacklistedToken.findOne({ token });
    if (blacklistedToken) {
      logger.warn("Token sur liste noire");
      return res.status(401).json({ error: "Token invalide" });
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    logger.warn(`Token invalide: ${err.message}`);
    return res.status(401).json({ error: "Token invalide" });
  }
};
