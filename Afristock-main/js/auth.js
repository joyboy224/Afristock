// Gestion de l'authentification avec JWT, notifications et file d'attente d'emails
// Configuration de l'API backend
const API_BASE_URL = 'http://localhost:4000';

// Vérifier si l'utilisateur est déjà connecté
async function checkAuth() {
    const token = localStorage.getItem('jwtToken');
    const currentPage = window.location.pathname.split('/').pop();
    const mode = localStorage.getItem('selectedMode');

    // Vérifier l'authentification selon le mode
    let isAuthenticated = false;
    if (mode === 'central') {
        // Mode centralisé : vérifier avec le backend
        if (token) {
            try {
                const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                isAuthenticated = response.ok;
            } catch (e) {
                isAuthenticated = false;
            }
        }
    } else {
        // Mode local : vérifier le token JWT
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                isAuthenticated = payload.exp > Date.now() / 1000;
            } catch (e) {
                isAuthenticated = false;
            }
        }
    }

    if (!isAuthenticated && currentPage !== 'login.html' && currentPage !== 'choose_mode.html') {
        window.location.href = 'login.html';
    }

    if (isAuthenticated && currentPage === 'login.html') {
        window.location.href = 'dashboard.html';
    }
}

// Fonction pour se connecter
async function login(username, password) {
    const mode = localStorage.getItem('selectedMode');
    
    if (mode === 'central') {
        // Mode centralisé : se connecter via le backend
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('jwtToken', data.token);
                return { success: true, user: data.user };
            } else {
                const errorData = await response.json();
                return { success: false, error: errorData.error };
            }
        } catch (e) {
            console.error('Erreur lors de la connexion:', e);
            return { success: false, error: 'Erreur de connexion au serveur' };
        }
    } else {
        // Mode local : se connecter via userManagement
        try {
            const user = userManagement.authenticateUser(username, password);
            if (user) {
                // Générer un token JWT
                const token = security.generateToken(user);
                localStorage.setItem('jwtToken', token);
                userManagement.setCurrentUser(user);
                return { success: true, user: user };
            } else {
                return { success: false, error: 'Identifiants invalides' };
            }
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            return { success: false, error: error.message || 'Erreur de connexion' };
        }
    }
}

// Fonction pour se déconnecter
async function logout() {
    const mode = localStorage.getItem('selectedMode');
    const token = localStorage.getItem('jwtToken');
    
    if (mode === 'central' && token) {
        // Mode centralisé : déconnecter avec le backend
        try {
            await fetch(`${API_BASE_URL}/api/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
        } catch (e) {
            console.error('Erreur lors de la déconnexion:', e);
        }
    }
    
    // Nettoyer le localStorage pour les deux modes
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('boutiqueId');
    localStorage.removeItem('selectedMode');
    sessionStorage.removeItem('currentUser');
    userManagement.logoutUser();

    // Fermer la connexion aux notifications
    if (window.notifications && typeof window.notifications.close === 'function') {
        notifications.close();
    }

    // Arrêter la file d'attente d'emails
    if (window.emailQueue && typeof window.emailQueue.stop === 'function') {
        emailQueue.stop();
    }
}

// Afficher un message d'erreur
function showError(message) {
    const errorElement = document.getElementById('loginError');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        // Cacher le message après 5 secondes
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 5000);
    } else {
        // Si aucun élément d'erreur n'existe, utiliser une alerte
        alert(message);
    }
}

// Afficher un message de succès
function showSuccess(message) {
    const successElement = document.getElementById('loginSuccess');
    if (successElement) {
        successElement.textContent = message;
        successElement.style.display = 'block';
        
        // Cacher le message après 5 secondes
        setTimeout(() => {
            successElement.style.display = 'none';
        }, 5000);
    }
}

// Gestion de la connexion
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // Vérifier que les champs ne sont pas vides
            if (!username || !password) {
                showError('Veuillez remplir tous les champs');
                return;
            }

            // Vérification avec le système d'utilisateurs
            const result = await login(username, password);
            if (result.success) {
                const user = result.user;

                // Initialiser les notifications en temps réel
                if (window.notifications && typeof window.notifications.init === 'function') {
                    notifications.init();
                }

                // Initialiser la file d'attente d'emails
                if (window.emailQueue && typeof window.emailQueue.init === 'function') {
                    emailQueue.init();
                }

                // Afficher un message de succès
                showSuccess('Connexion réussie. Redirection...');

                // Rediriger vers la page de choix du mode si non sélectionné
                if (!localStorage.getItem('selectedMode')) {
                    setTimeout(() => {
                        window.location.href = 'choose_mode.html';
                    }, 1000);
                } else {
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1000);
                }
            } else {
                // Afficher un message d'erreur plus détaillé
                showError(`Erreur de connexion: ${result.error}`);
            }
        });
    }

    // Afficher le nom de la boutique dans le tableau de bord
    const boutiqueNameElement = document.getElementById('boutiqueName');
    if (boutiqueNameElement) {
        const boutiqueId = localStorage.getItem('boutiqueId');
        if (boutiqueId) {
            boutiqueNameElement.textContent = `Boutique: ${boutiqueId}`;
        }
    }

    // Gestion de la déconnexion
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async function() {
            await logout();
            window.location.href = 'login.html';
        });
    }

    // Bouton retour au tableau de bord
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.location.href = 'dashboard.html';
        });
    }
});

// Initialiser la vérification d'authentification
checkAuth();
