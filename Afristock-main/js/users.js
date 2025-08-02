// Gestion des utilisateurs et des rôles

document.addEventListener('DOMContentLoaded', function() {
    // Afficher la liste des utilisateurs
    if (document.getElementById('usersTable')) {
        displayUsers();
    }
    
    // Gestion du formulaire d'ajout d'utilisateur
    const addUserForm = document.getElementById('addUserForm');
    if (addUserForm) {
        addUserForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addUserFormHandler();
        });
    }
    
    // Bouton retour au tableau de bord
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.location.href = 'dashboard.html';
        });
    }
    
    // Bouton de déconnexion
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            userManagement.logoutUser();
            window.location.href = 'login.html';
        });
    }
    
    // Afficher le nom de la boutique
    const boutiqueNameElement = document.getElementById('boutiqueName');
    if (boutiqueNameElement) {
        const boutiqueId = localStorage.getItem('boutiqueId');
        if (boutiqueId) {
            boutiqueNameElement.textContent = `Boutique: ${boutiqueId}`;
        }
    }
    
    // Afficher le mode
    const modeInfoElement = document.getElementById('modeInfo');
    if (modeInfoElement) {
        const mode = localStorage.getItem('selectedMode') || 'local';
        const modeText = mode === 'local' ? 'Stock individuel (local)' : 'Stock partagé (centralisé)';
        modeInfoElement.textContent = `Mode: ${modeText}`;
    }
});

// Fonction pour afficher les utilisateurs
function displayUsers() {
    const users = getUsers();
    const tableBody = document.querySelector('#usersTable tbody');
    
    // Vider le tableau
    tableBody.innerHTML = '';
    
    // Ajouter chaque utilisateur au tableau
    users.forEach(user => {
        const row = document.createElement('tr');
        const createdDate = new Date(user.createdAt).toLocaleDateString('fr-FR');
        row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.role === 'admin' ? 'Administrateur' : 'Vendeur'}</td>
            <td>${createdDate}</td>
            <td>
                <button class="edit-user-btn" data-id="${user.id}">Modifier</button>
                <button class="delete-user-btn" data-id="${user.id}">Supprimer</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // Ajouter les événements aux boutons
    document.querySelectorAll('.edit-user-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const userId = this.getAttribute('data-id');
            editUser(userId);
        });
    });
    
    document.querySelectorAll('.delete-user-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const userId = this.getAttribute('data-id');
            deleteUser(userId);
        });
    });
}

// Fonction pour gérer le formulaire d'ajout d'utilisateur
function addUserFormHandler() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    
    try {
        userManagement.addUser({ username, password, role });
        alert('Utilisateur ajouté avec succès');
        document.getElementById('addUserForm').reset();
        displayUsers();
    } catch (error) {
        alert(error.message);
    }
}

// Fonction pour modifier un utilisateur
function editUser(userId) {
    // Dans une vraie application, cela ouvrirait un formulaire de modification
    alert('Fonction de modification non implémentée dans cette version');
}

// Fonction pour supprimer un utilisateur
function deleteUser(userId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
        try {
            userManagement.deleteUser(userId);
            displayUsers();
            alert('Utilisateur supprimé avec succès');
        } catch (error) {
            alert(error.message);
        }
    }
}

// Fonction pour obtenir les utilisateurs
function getUsers() {
    const mode = localStorage.getItem('selectedMode') || 'local';
    const boutiqueId = localStorage.getItem('boutiqueId');
    
    if (mode === 'local') {
        // Pour le mode local, utiliser localStorage
        const key = `users_${boutiqueId}`;
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } else {
        // Pour le mode centralisé, cela viendrait d'un serveur
        // Dans cette implémentation, nous simulons avec localStorage
        const key = `users_central`;
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    }
}

// Fonction pour sauvegarder les utilisateurs
function saveUsers(users) {
    const mode = localStorage.getItem('selectedMode') || 'local';
    const boutiqueId = localStorage.getItem('boutiqueId');
    
    if (mode === 'local') {
        // Pour le mode local, utiliser localStorage
        const key = `users_${boutiqueId}`;
        localStorage.setItem(key, JSON.stringify(users));
    } else {
        // Pour le mode centralisé, cela serait envoyé à un serveur
        // Dans cette implémentation, nous simulons avec localStorage
        const key = `users_central`;
        localStorage.setItem(key, JSON.stringify(users));
    }
}

// Fonction pour ajouter un utilisateur
function addUser(user) {
    const users = getUsers();
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = users.find(u => u.username === user.username);
    if (existingUser) {
        throw new Error('Un utilisateur avec ce nom existe déjà');
    }
    
    // Ajouter l'utilisateur
    users.push({
        id: Date.now().toString(),
        username: user.username,
        password: user.password, // Dans une vraie application, le mot de passe serait hashé
        role: user.role, // 'admin' ou 'vendeur'
        createdAt: new Date().toISOString()
    });
    
    saveUsers(users);
}

// Fonction pour modifier un utilisateur
function updateUser(userId, updates) {
    const users = getUsers();
    const index = users.findIndex(u => u.id === userId);
    
    if (index === -1) {
        throw new Error('Utilisateur non trouvé');
    }
    
    // Mettre à jour l'utilisateur
    users[index] = {
        ...users[index],
        ...updates
    };
    
    saveUsers(users);
}

// Fonction pour supprimer un utilisateur
function deleteUser(userId) {
    const users = getUsers();
    const index = users.findIndex(u => u.id === userId);
    
    if (index === -1) {
        throw new Error('Utilisateur non trouvé');
    }
    
    // Supprimer l'utilisateur
    users.splice(index, 1);
    saveUsers(users);
}

// Fonction pour authentifier un utilisateur
function authenticateUser(username, password) {
    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    
    return user || null;
}

// Fonction pour obtenir le rôle de l'utilisateur actuel
function getCurrentUserRole() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || 'null');
    return currentUser ? currentUser.role : null;
}

// Fonction pour vérifier si l'utilisateur a un rôle spécifique
function hasRole(requiredRole) {
    const userRole = getCurrentUserRole();
    return userRole === requiredRole || userRole === 'admin'; // Admin a accès à tout
}

// Fonction pour vérifier si l'utilisateur est admin
function isAdmin() {
    return getCurrentUserRole() === 'admin';
}

// Fonction pour vérifier si l'utilisateur est vendeur
function isSalesperson() {
    return getCurrentUserRole() === 'vendeur';
}

// Fonction pour obtenir l'utilisateur actuel
function getCurrentUser() {
    return JSON.parse(sessionStorage.getItem('currentUser') || 'null');
}

// Fonction pour définir l'utilisateur actuel
function setCurrentUser(user) {
    sessionStorage.setItem('currentUser', JSON.stringify({
        id: user.id,
        username: user.username,
        role: user.role
    }));
}

// Fonction pour déconnecter l'utilisateur
function logoutUser() {
    sessionStorage.removeItem('currentUser');
}

// Exporter les fonctions
window.userManagement = {
    getUsers,
    addUser,
    updateUser,
    deleteUser,
    authenticateUser,
    getCurrentUserRole,
    hasRole,
    isAdmin,
    isSalesperson,
    getCurrentUser,
    setCurrentUser,
    logoutUser
};
