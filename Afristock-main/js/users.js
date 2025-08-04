// Gestion des utilisateurs
class Users {
    constructor() {
        this.users = [];
        this.currentUser = null;
    }

    // Initialiser la gestion des utilisateurs
    init() {
        // Charger les utilisateurs depuis le localStorage
        this.loadUsers();
        
        // Charger l'utilisateur courant
        this.loadCurrentUser();
        
        console.log('Gestion des utilisateurs initialisée');
    }

    // Charger les utilisateurs depuis le localStorage
    loadUsers() {
        const usersData = localStorage.getItem('users');
        if (usersData) {
            this.users = JSON.parse(usersData);
        }
    }

    // Sauvegarder les utilisateurs dans le localStorage
    saveUsers() {
        localStorage.setItem('users', JSON.stringify(this.users));
    }

    // Charger l'utilisateur courant depuis le localStorage
    loadCurrentUser() {
        const currentUserData = localStorage.getItem('currentUser');
        if (currentUserData) {
            this.currentUser = JSON.parse(currentUserData);
        }
    }

    // Sauvegarder l'utilisateur courant dans le localStorage
    saveCurrentUser() {
        if (this.currentUser) {
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        }
    }

    // Créer un nouvel utilisateur
    createUser(username, password, role = 'vendeur') {
        // Vérifier si l'utilisateur existe déjà
        if (this.users.some(user => user.username === username)) {
            throw new Error('Nom d\'utilisateur déjà utilisé');
        }

        // Créer un nouvel utilisateur
        const newUser = {
            id: Date.now().toString(),
            username,
            password, // Note: Dans une application réelle, le mot de passe devrait être haché
            role,
            createdAt: new Date().toISOString()
        };

        this.users.push(newUser);
        this.saveUsers();

        console.log(`Utilisateur créé: ${username}`);
        return newUser;
    }

    // Authentifier un utilisateur
    authenticateUser(username, password) {
        const user = this.users.find(u => u.username === username && u.password === password);
        if (user) {
            this.currentUser = user;
            this.saveCurrentUser();
            console.log(`Utilisateur authentifié: ${username}`);
            return user;
        }
        return null;
    }

    // Déconnecter l'utilisateur courant
    logoutUser() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        console.log('Utilisateur déconnecté');
    }

    // Mettre à jour un utilisateur
    updateUser(userId, updates) {
        const userIndex = this.users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
            // Mettre à jour l'utilisateur
            this.users[userIndex] = { ...this.users[userIndex], ...updates };
            this.saveUsers();

            // Si c'est l'utilisateur courant, mettre à jour aussi
            if (this.currentUser && this.currentUser.id === userId) {
                this.currentUser = { ...this.currentUser, ...updates };
                this.saveCurrentUser();
            }

            console.log(`Utilisateur mis à jour: ${userId}`);
            return this.users[userIndex];
        }
        throw new Error('Utilisateur non trouvé');
    }

    // Supprimer un utilisateur
    deleteUser(userId) {
        const userIndex = this.users.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
            // Supprimer l'utilisateur
            const deletedUser = this.users.splice(userIndex, 1)[0];
            this.saveUsers();

            // Si c'est l'utilisateur courant, le déconnecter
            if (this.currentUser && this.currentUser.id === userId) {
                this.logoutUser();
            }

            console.log(`Utilisateur supprimé: ${deletedUser.username}`);
            return deletedUser;
        }
        throw new Error('Utilisateur non trouvé');
    }

    // Obtenir tous les utilisateurs
    getAllUsers() {
        return this.users;
    }

    // Obtenir un utilisateur par ID
    getUserById(userId) {
        return this.users.find(u => u.id === userId);
    }

    // Obtenir un utilisateur par nom d'utilisateur
    getUserByUsername(username) {
        return this.users.find(u => u.username === username);
    }

    // Obtenir l'utilisateur courant
    getCurrentUser() {
        return this.currentUser;
    }

    // Vérifier si un utilisateur est administrateur
    isAdmin(user) {
        return user && user.role === 'admin';
    }

    // Vérifier si l'utilisateur courant est administrateur
    isCurrentUserAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
    }

    // Vérifier si un utilisateur est vendeur
    isSeller(user) {
        return user && user.role === 'vendeur';
    }

    // Vérifier si l'utilisateur courant est vendeur
    isCurrentUserSeller() {
        return this.currentUser && this.currentUser.role === 'vendeur';
    }

    // Synchroniser les utilisateurs avec le backend (mode centralisé)
    async syncWithBackend() {
        // Vérifier si nous sommes en mode centralisé
        const mode = localStorage.getItem('selectedMode');
        if (mode !== 'central') {
            console.log('La synchronisation avec le backend n\'est disponible qu\'en mode centralisé');
            return;
        }

        // Obtenir le token JWT
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            throw new Error('Token d\'authentification manquant');
        }

        try {
            // Récupérer les utilisateurs depuis le backend
            const response = await fetch('http://localhost:4000/api/users', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erreur lors de la récupération des utilisateurs');
            }

            const backendUsers = await response.json();
            
            // Mettre à jour les utilisateurs locaux
            this.users = backendUsers.map(user => ({
                id: user._id,
                username: user.username,
                role: user.role,
                createdAt: user.createdAt
                // Note: Le mot de passe n'est pas renvoyé par le backend pour des raisons de sécurité
            }));
            
            this.saveUsers();
            
            console.log('Utilisateurs synchronisés avec le backend');
        } catch (error) {
            console.error('Erreur lors de la synchronisation avec le backend:', error);
            throw error;
        }
    }

    // Créer un utilisateur sur le backend (mode centralisé)
    async createUserOnBackend(username, password, role = 'vendeur') {
        // Vérifier si nous sommes en mode centralisé
        const mode = localStorage.getItem('selectedMode');
        if (mode !== 'central') {
            console.log('La création d\'utilisateur sur le backend n\'est disponible qu\'en mode centralisé');
            return;
        }

        // Obtenir le token JWT
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            throw new Error('Token d\'authentification manquant');
        }

        try {
            // Créer l'utilisateur sur le backend
            const response = await fetch('http://localhost:4000/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ username, password, role })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erreur lors de la création de l\'utilisateur');
            }

            const result = await response.json();
            
            // Synchroniser avec le backend
            await this.syncWithBackend();
            
            console.log('Utilisateur créé sur le backend');
            return result;
        } catch (error) {
            console.error('Erreur lors de la création de l\'utilisateur sur le backend:', error);
            throw error;
        }
    }

    // Mettre à jour un utilisateur sur le backend (mode centralisé)
    async updateUserOnBackend(userId, updates) {
        // Vérifier si nous sommes en mode centralisé
        const mode = localStorage.getItem('selectedMode');
        if (mode !== 'central') {
            console.log('La mise à jour d\'utilisateur sur le backend n\'est disponible qu\'en mode centralisé');
            return;
        }

        // Obtenir le token JWT
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            throw new Error('Token d\'authentification manquant');
        }

        try {
            // Mettre à jour l'utilisateur sur le backend
            const response = await fetch(`http://localhost:4000/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updates)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erreur lors de la mise à jour de l\'utilisateur');
            }

            const result = await response.json();
            
            // Synchroniser avec le backend
            await this.syncWithBackend();
            
            console.log('Utilisateur mis à jour sur le backend');
            return result;
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'utilisateur sur le backend:', error);
            throw error;
        }
    }

    // Supprimer un utilisateur sur le backend (mode centralisé)
    async deleteUserFromBackend(userId) {
        // Vérifier si nous sommes en mode centralisé
        const mode = localStorage.getItem('selectedMode');
        if (mode !== 'central') {
            console.log('La suppression d\'utilisateur sur le backend n\'est disponible qu\'en mode centralisé');
            return;
        }

        // Obtenir le token JWT
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            throw new Error('Token d\'authentification manquant');
        }

        try {
            // Supprimer l'utilisateur sur le backend
            const response = await fetch(`http://localhost:4000/api/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erreur lors de la suppression de l\'utilisateur');
            }

            const result = await response.json();
            
            // Synchroniser avec le backend
            await this.syncWithBackend();
            
            console.log('Utilisateur supprimé sur le backend');
            return result;
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'utilisateur sur le backend:', error);
            throw error;
        }
    }
}

// Créer une instance globale
window.users = new Users();
