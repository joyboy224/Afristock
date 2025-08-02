// Gestion des mouvements de stock

document.addEventListener('DOMContentLoaded', function() {
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
    
    // Afficher le rôle de l'utilisateur
    const user = userManagement.getCurrentUser();
    if (user) {
        document.getElementById('userRole').textContent = `Rôle: ${user.role === 'admin' ? 'Administrateur' : 'Vendeur'}`;
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
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('boutiqueId');
            localStorage.removeItem('selectedMode');
            sessionStorage.removeItem('currentUser');
            userManagement.logoutUser();
            window.location.href = 'login.html';
        });
    }
    
    // Remplir la liste déroulante des produits
    populateProductFilter();
    
    // Bouton de filtrage
    const filterMovementsBtn = document.getElementById('filterMovementsBtn');
    if (filterMovementsBtn) {
        filterMovementsBtn.addEventListener('click', filterMovements);
    }
    
    // Définir les dates par défaut (dernier mois)
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    document.getElementById('movementStartDate').value = lastMonth.toISOString().split('T')[0];
    document.getElementById('movementEndDate').value = today.toISOString().split('T')[0];
    
    // Afficher tous les mouvements par défaut
    displayMovements();
});

// Fonction pour remplir la liste déroulante des produits
function populateProductFilter() {
    const products = getProducts();
    const productFilter = document.getElementById('productFilter');
    
    // Ajouter chaque produit à la liste déroulante
    products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.id;
        option.textContent = product.name;
        productFilter.appendChild(option);
    });
}

// Fonction pour filtrer les mouvements
function filterMovements() {
    displayMovements();
}

// Fonction pour afficher les mouvements
function displayMovements() {
    const startDate = document.getElementById('movementStartDate').value;
    const endDate = document.getElementById('movementEndDate').value;
    const productId = document.getElementById('productFilter').value;
    
    // Obtenir les mouvements de stock
    const movements = getStockMovements();
    
    // Filtrer les mouvements
    const filteredMovements = movements.filter(movement => {
        // Filtrer par date
        if (startDate && new Date(movement.date) < new Date(startDate)) {
            return false;
        }
        
        if (endDate && new Date(movement.date) > new Date(endDate)) {
            return false;
        }
        
        // Filtrer par produit
        if (productId && movement.productId !== productId) {
            return false;
        }
        
        return true;
    });
    
    // Afficher les mouvements dans le tableau
    const tableBody = document.querySelector('#movementsTable tbody');
    tableBody.innerHTML = '';
    
    filteredMovements.forEach(movement => {
        const product = getProductById(movement.productId);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${movement.date}</td>
            <td>${product ? product.name : 'Produit inconnu'}</td>
            <td>${movement.type === 'entry' ? 'Entrée' : 'Sortie'}</td>
            <td>${movement.quantity}</td>
            <td>${movement.stockBefore}</td>
            <td>${movement.stockAfter}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Fonction pour obtenir les mouvements de stock
function getStockMovements() {
    const mode = localStorage.getItem('selectedMode') || 'local';
    const boutiqueId = localStorage.getItem('boutiqueId');
    
    if (mode === 'local') {
        // Pour le mode local, utiliser localStorage
        const key = `movements_${boutiqueId}`;
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } else {
        // Pour le mode centralisé, cela viendrait d'un serveur
        // Dans cette implémentation, nous simulons avec localStorage
        const key = `movements_central`;
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    }
}

// Fonction pour enregistrer un mouvement de stock
function recordStockMovement(productId, type, quantity, stockBefore, stockAfter) {
    const movement = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        productId: productId,
        type: type, // 'entry' ou 'exit'
        quantity: quantity,
        stockBefore: stockBefore,
        stockAfter: stockAfter,
        date: new Date().toISOString().split('T')[0]
    };
    
    // Obtenir les mouvements existants
    const movements = getStockMovements();
    
    // Ajouter le nouveau mouvement
    movements.push(movement);
    
    // Sauvegarder les mouvements
    saveStockMovements(movements);
}

// Fonction pour sauvegarder les mouvements de stock
function saveStockMovements(movements) {
    const mode = localStorage.getItem('selectedMode') || 'local';
    const boutiqueId = localStorage.getItem('boutiqueId');
    
    if (mode === 'local') {
        // Pour le mode local, utiliser localStorage
        const key = `movements_${boutiqueId}`;
        localStorage.setItem(key, JSON.stringify(movements));
    } else {
        // Pour le mode centralisé, cela serait envoyé à un serveur
        // Dans cette implémentation, nous simulons avec localStorage
        const key = `movements_central`;
        localStorage.setItem(key, JSON.stringify(movements));
    }
}

// Fonction pour obtenir un produit par son ID
function getProductById(productId) {
    const products = getProducts();
    return products.find(product => product.id === productId);
}

// Fonction pour obtenir les produits (copiée de produit.js)
function getProducts() {
    const mode = localStorage.getItem('selectedMode') || 'local';
    const boutiqueId = localStorage.getItem('boutiqueId');
    
    if (mode === 'local') {
        // Pour le mode local, utiliser localStorage
        const key = `products_${boutiqueId}`;
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } else {
        // Pour le mode centralisé, cela viendrait d'un serveur
        // Dans cette implémentation, nous simulons avec localStorage
        const key = `products_central`;
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    }
}
