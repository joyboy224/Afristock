// Fonctions de sécurité pour l'application Afristock

// Générer un token JWT (simulation)
function generateToken(user) {
    // Dans une implémentation réelle, vous utiliseriez une bibliothèque comme jsonwebtoken
    // Pour cette simulation, nous allons créer un token simple basé sur les informations de l'utilisateur
    
    // Créer le payload
    const payload = {
        id: user.id,
        username: user.username,
        role: user.role,
        iat: Math.floor(Date.now() / 1000), // Issued at time
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // Expiration time (24 heures)
    };
    
    // Encoder le payload en base64
    const payloadBase64 = btoa(JSON.stringify(payload));
    
    // Créer un header simple (pour simulation seulement)
    const header = btoa('{"alg":"HS256","typ":"JWT"}');
    
    // Créer une signature simple (pour simulation seulement)
    const signature = btoa('signature');
    
    // Retourner le token JWT
    return `${header}.${payloadBase64}.${signature}`;
}

// Vérifier un token JWT (simulation)
function verifyToken(token) {
    try {
        // Décoder le token
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('Token invalide');
        }
        
        // Décoder le payload
        const payload = JSON.parse(atob(parts[1]));
        
        // Vérifier l'expiration
        if (payload.exp < Date.now() / 1000) {
            throw new Error('Token expiré');
        }
        
        return { valid: true, payload: payload };
    } catch (error) {
        return { valid: false, error: error.message };
    }
}

// Hacher un mot de passe (simulation)
function hashPassword(password) {
    // Dans une implémentation réelle, vous utiliseriez une bibliothèque comme bcrypt
    // Pour cette simulation, nous allons simplement ajouter un préfixe sans inverser la chaîne
    
    // Ajouter un préfixe
    return `hashed_${password}`;
}

// Vérifier un mot de passe (simulation)
function verifyPassword(password, hashedPassword) {
    // Hacher le mot de passe fourni
    const hashedInput = hashPassword(password);
    
    // Comparer avec le mot de passe haché stocké
    return hashedInput === hashedPassword;
}

// Générer un sel (simulation)
function generateSalt() {
    // Dans une implémentation réelle, vous utiliseriez une bibliothèque comme crypto
    // Pour cette simulation, nous allons générer une chaîne aléatoire
    
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let salt = '';
    for (let i = 0; i < 16; i++) {
        salt += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return salt;
}

// Chiffrer des données (simulation)
function encryptData(data, key) {
    // Dans une implémentation réelle, vous utiliseriez une bibliothèque comme crypto
    // Pour cette simulation, nous allons simplement encoder en base64 et ajouter un préfixe
    
    // Convertir les données en chaîne si ce n'est pas déjà le cas
    const dataString = typeof data === 'string' ? data : JSON.stringify(data);
    
    // Encoder en base64
    const encoded = btoa(dataString);
    
    // Ajouter un préfixe
    return `encrypted_${encoded}`;
}

// Déchiffrer des données (simulation)
function decryptData(encryptedData, key) {
    try {
        // Vérifier que les données sont chiffrées
        if (!encryptedData.startsWith('encrypted_')) {
            throw new Error('Données non chiffrées');
        }
        
        // Supprimer le préfixe
        const encoded = encryptedData.substring(10);
        
        // Décoder depuis base64
        const decoded = atob(encoded);
        
        // Essayer de parser en JSON
        try {
            return JSON.parse(decoded);
        } catch (e) {
            // Si ce n'est pas du JSON, retourner la chaîne décodée
            return decoded;
        }
    } catch (error) {
        throw new Error('Erreur lors du déchiffrement des données');
    }
}

// Générer une clé API (simulation)
function generateAPIKey() {
    // Dans une implémentation réelle, vous utiliseriez une bibliothèque comme crypto
    // Pour cette simulation, nous allons générer une chaîne aléatoire
    
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let apiKey = 'sk_';
    for (let i = 0; i < 32; i++) {
        apiKey += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return apiKey;
}

// Vérifier une clé API
function verifyAPIKey(apiKey) {
    // Vérifier que la clé API commence par 'sk_'
    if (!apiKey || !apiKey.startsWith('sk_')) {
        return false;
    }
    
    // Vérifier la longueur (préfixe 'sk_' + 32 caractères)
    if (apiKey.length !== 35) {
        return false;
    }
    
    return true;
}

// Nettoyer les entrées utilisateur pour prévenir les attaques XSS
function sanitizeInput(input) {
    // Remplacer les caractères dangereux par leurs équivalents HTML
    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '<')
        .replace(/>/g, '>')
        .replace(/"/g, '"')
        .replace(/'/g, '&#x27;');
}

// Valider une adresse email
function validateEmail(email) {
    // Expression régulière simple pour valider une adresse email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Valider un mot de passe
function validatePassword(password) {
    // Vérifier que le mot de passe a au moins 8 caractères
    if (password.length < 8) {
        return false;
    }
    
    // Vérifier qu'il contient au moins une lettre majuscule, une lettre minuscule et un chiffre
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    return hasUpperCase && hasLowerCase && hasNumbers;
}

// Générer un nonce pour la protection CSRF
function generateNonce() {
    // Dans une implémentation réelle, vous utiliseriez une bibliothèque comme crypto
    // Pour cette simulation, nous allons générer une chaîne aléatoire
    
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let nonce = '';
    for (let i = 0; i < 32; i++) {
        nonce += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return nonce;
}

// Exporter les fonctions pour une utilisation dans d'autres fichiers
window.security = {
    generateToken,
    verifyToken,
    hashPassword,
    verifyPassword,
    generateSalt,
    encryptData,
    decryptData,
    generateAPIKey,
    verifyAPIKey,
    sanitizeInput,
    validateEmail,
    validatePassword,
    generateNonce
};
