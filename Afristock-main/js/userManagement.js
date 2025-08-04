// Gestion des utilisateurs via backend

let currentUser = null;

// Initialiser la gestion des utilisateurs
function initUserManagement() {
    // Charger l'utilisateur courant depuis le localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
    }
    
    console.log('Gestion des utilisateurs initialisée');
}

// Authentifier un utilisateur via backend
async function authenticateUser(username, password) {
    try {
        const response = await fetch('http://localhost:4000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            console.log('Erreur de connexion:', errorData.message || 'Identifiants invalides');
            return null;
        }
        
        const data = await response.json();
        
        // Sauvegarder le token JWT et l'utilisateur courant
        localStorage.setItem('jwtToken', data.token);
        currentUser = data.user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        console.log(`Utilisateur authentifié: ${username}`);
        return currentUser;
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        return null;
    }
}

// Déconnecter l'utilisateur courant
function logoutUser() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('jwtToken');
    console.log('Utilisateur déconnecté');
}

// Obtenir l'utilisateur courant
function getCurrentUser() {
    return currentUser;
}

// Exporter les fonctions pour une utilisation dans d'autres fichiers
window.userManagement = {
    authenticateUser,
    logoutUser,
    getCurrentUser
};
