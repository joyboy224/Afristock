// Gestion des mouvements de stock

// Données des mouvements de stock (simulation de base de données locale)
let localStockMovements = [
    { 
        id: '1', 
        productId: '1',
        productName: 'Produit 1',
        type: 'incoming',
        quantity: 100,
        date: '2023-01-01',
        reason: 'Réapprovisionnement'
    },
    { 
        id: '2', 
        productId: '1',
        productName: 'Produit 1',
        type: 'outgoing',
        quantity: 50,
        date: '2023-01-05',
        reason: 'Vente'
    },
    { 
        id: '3', 
        productId: '2',
        productName: 'Produit 2',
        type: 'incoming',
        quantity: 200,
        date: '2023-01-02',
        reason: 'Réapprovisionnement'
    },
    { 
        id: '4', 
        productId: '2',
        productName: 'Produit 2',
        type: 'outgoing',
        quantity: 170,
        date: '2023-01-06',
        reason: 'Vente'
    }
];

// Initialiser la gestion des mouvements de stock
function initStockMovements() {
    // Charger les mouvements de stock depuis le localStorage
    const savedStockMovements = localStorage.getItem('stockMovements');
    if (savedStockMovements) {
        localStockMovements = JSON.parse(savedStockMovements);
    }
    
    console.log('Gestion des mouvements de stock initialisée');
}

// Obtenir tous les mouvements de stock
function getAllStockMovements() {
    return localStockMovements;
}

// Obtenir un mouvement de stock par ID
function getStockMovementById(id) {
    return localStockMovements.find(m => m.id === id);
}

// Créer un nouveau mouvement de stock
function createStockMovement(movementData) {
    // Générer un ID unique
    const newId = (localStockMovements.length + 1).toString();
    
    // Créer le nouveau mouvement
    const newMovement = {
        id: newId,
        ...movementData,
        date: new Date().toISOString().split('T')[0] // Date actuelle au format YYYY-MM-DD
    };
    
    // Ajouter à la liste des mouvements
    localStockMovements.push(newMovement);
    
    // Sauvegarder dans le localStorage
    saveStockMovements();
    
    console.log(`Mouvement de stock créé: ${newId}`);
    return newMovement;
}

// Mettre à jour un mouvement de stock
function updateStockMovement(movementId, updates) {
    const movementIndex = localStockMovements.findIndex(m => m.id === movementId);
    if (movementIndex !== -1) {
        // Mettre à jour le mouvement
        localStockMovements[movementIndex] = { ...localStockMovements[movementIndex], ...updates };
        
        // Sauvegarder dans le localStorage
        saveStockMovements();
        
        console.log(`Mouvement de stock mis à jour: ${movementId}`);
        return localStockMovements[movementIndex];
    }
    throw new Error('Mouvement de stock non trouvé');
}

// Supprimer un mouvement de stock
function deleteStockMovement(movementId) {
    const movementIndex = localStockMovements.findIndex(m => m.id === movementId);
    if (movementIndex !== -1) {
        // Supprimer le mouvement
        const deletedMovement = localStockMovements.splice(movementIndex, 1)[0];
        
        // Sauvegarder dans le localStorage
        saveStockMovements();
        
        console.log(`Mouvement de stock supprimé: ${deletedMovement.id}`);
        return deletedMovement;
    }
    throw new Error('Mouvement de stock non trouvé');
}

// Filtrer les mouvements de stock par produit
function filterStockMovementsByProduct(productId) {
    return localStockMovements.filter(m => m.productId === productId);
}

// Filtrer les mouvements de stock par type
function filterStockMovementsByType(type) {
    return localStockMovements.filter(m => m.type === type);
}

// Filtrer les mouvements de stock par date
function filterStockMovementsByDate(startDate, endDate) {
    return localStockMovements.filter(m => {
        const movementDate = new Date(m.date);
        return movementDate >= new Date(startDate) && movementDate <= new Date(endDate);
    });
}

// Obtenir le solde du stock pour un produit
function getStockBalance(productId) {
    const movements = filterStockMovementsByProduct(productId);
    
    let balance = 0;
    movements.forEach(movement => {
        if (movement.type === 'incoming') {
            balance += movement.quantity;
        } else if (movement.type === 'outgoing') {
            balance -= movement.quantity;
        }
    });
    
    return balance;
}

// Obtenir le solde du stock pour tous les produits
function getAllStockBalances() {
    const products = window.produit.getAllProducts();
    const balances = {};
    
    products.forEach(product => {
        balances[product.id] = getStockBalance(product.id);
    });
    
    return balances;
}

// Obtenir les mouvements de stock entrants
function getIncomingStockMovements() {
    return localStockMovements.filter(m => m.type === 'incoming');
}

// Obtenir les mouvements de stock sortants
function getOutgoingStockMovements() {
    return localStockMovements.filter(m => m.type === 'outgoing');
}

// Obtenir la quantité totale de stock entrant
function getTotalIncomingStock() {
    const incomingMovements = getIncomingStockMovements();
    return incomingMovements.reduce((total, movement) => total + movement.quantity, 0);
}

// Obtenir la quantité totale de stock sortant
function getTotalOutgoingStock() {
    const outgoingMovements = getOutgoingStockMovements();
    return outgoingMovements.reduce((total, movement) => total + movement.quantity, 0);
}

// Obtenir le solde total du stock
function getTotalStockBalance() {
    const totalIncoming = getTotalIncomingStock();
    const totalOutgoing = getTotalOutgoingStock();
    return totalIncoming - totalOutgoing;
}

// Rechercher des mouvements de stock
function searchStockMovements(query) {
    const lowerQuery = query.toLowerCase();
    return localStockMovements.filter(m => 
        m.productName.toLowerCase().includes(lowerQuery) ||
        m.reason.toLowerCase().includes(lowerQuery) ||
        m.id.includes(query)
    );
}

// Obtenir les mouvements de stock récents
function getRecentStockMovements(limit = 10) {
    const sortedMovements = [...localStockMovements].sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });
    
    return sortedMovements.slice(0, limit);
}

// Sauvegarder les mouvements de stock dans le localStorage
function saveStockMovements() {
    localStorage.setItem('stockMovements', JSON.stringify(localStockMovements));
}

// Synchroniser les mouvements de stock avec le backend (mode centralisé)
async function syncWithBackend() {
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
        // Récupérer les mouvements de stock depuis le backend
        const response = await fetch('http://localhost:4000/api/stock-movements', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erreur lors de la récupération des mouvements de stock');
        }
        
        const backendStockMovements = await response.json();
        
        // Mettre à jour les mouvements de stock locaux
        localStockMovements = backendStockMovements;
        
        // Sauvegarder dans le localStorage
        saveStockMovements();
        
        console.log('Mouvements de stock synchronisés avec le backend');
    } catch (error) {
        console.error('Erreur lors de la synchronisation avec le backend:', error);
        throw error;
    }
}

// Initialiser la gestion des mouvements de stock
initStockMovements();

// Exporter les fonctions pour une utilisation dans d'autres fichiers
window.stockMovements = {
    getAllStockMovements,
    getStockMovementById,
    createStockMovement,
    updateStockMovement,
    deleteStockMovement,
    filterStockMovementsByProduct,
    filterStockMovementsByType,
    filterStockMovementsByDate,
    getStockBalance,
    getAllStockBalances,
    getIncomingStockMovements,
    getOutgoingStockMovements,
    getTotalIncomingStock,
    getTotalOutgoingStock,
    getTotalStockBalance,
    searchStockMovements,
    getRecentStockMovements,
    syncWithBackend
};
