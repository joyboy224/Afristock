// Gestion de l'authentification

// Vérifier si l'utilisateur est déjà connecté
function checkAuth() {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const currentUser = sessionStorage.getItem('currentUser');
    const currentPage = window.location.pathname.split('/').pop();
    
    if (!isAuthenticated && !currentUser && currentPage !== 'login.html') {
        window.location.href = 'login.html';
    }
    
    if ((isAuthenticated || currentUser) && currentPage === 'login.html') {
        window.location.href = 'dashboard.html';
    }
}

// Gestion de la connexion
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Vérification avec le système d'utilisateurs
            const user = userManagement.authenticateUser(username, password);
            if (user) {
                // Stocker les informations de connexion
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('username', username);
                userManagement.setCurrentUser(user);
                
                // Rediriger vers la page de choix du mode si non sélectionné
                if (!localStorage.getItem('selectedMode')) {
                    window.location.href = 'choose_mode.html';
                } else {
                    window.location.href = 'dashboard.html';
                }
            } else {
                alert('Identifiants invalides');
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
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('boutiqueId');
            localStorage.removeItem('selectedMode');
            sessionStorage.removeItem('currentUser');
            userManagement.logoutUser();
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
