// Middleware pour vérifier si l'utilisateur a un rôle spécifique
const requireRole = (roles) => {
  return (req, res, next) => {
    // Si roles est une chaîne, la convertir en tableau
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    // Vérifier si l'utilisateur est authentifié
    if (!req.user) {
      return res.status(401).json({ error: "Authentification requise" });
    }
    
    // Vérifier si le rôle de l'utilisateur est dans les rôles autorisés
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Accès refusé: rôle insuffisant" });
    }
    
    // Si tout est bon, passer à la suite
    next();
  };
};

// Middleware pour vérifier si l'utilisateur est admin
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Authentification requise" });
  }
  
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Accès refusé: droits d'administrateur requis" });
  }
  
  next();
};

export { requireRole, requireAdmin };
