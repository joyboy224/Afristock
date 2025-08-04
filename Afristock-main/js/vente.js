// Gestion des ventes

// Données des ventes (simulation de base de données locale)
let localSales = [
    { 
        id: '1', 
        customerId: 'client1',
        customerName: 'Client 1',
        items: [
            { productId: '1', productName: 'Produit 1', quantity: 2, price: 1000 },
            { productId: '2', productName: 'Produit 2', quantity: 1, price: 2000 }
        ],
        total: 4000,
        date: '2023-01-15',
        status: 'completed'
    },
    { 
        id: '2', 
        customerId: 'client2',
        customerName: 'Client 2',
        items: [
            { productId: '1', productName: 'Produit 1', quantity: 1, price: 1000 }
        ],
        total: 1000,
        date: '2023-01-16',
        status: 'completed'
    }
];

// Vente en cours
let currentSale = {
    customerId: '',
    customerName: '',
    items: [],
    total: 0
};

// Initialiser la gestion des ventes
function initSales() {
    // Charger les ventes depuis le localStorage
    const savedSales = localStorage.getItem('sales');
    if (savedSales) {
        localSales = JSON.parse(savedSales);
    }
    
    console.log('Gestion des ventes initialisée');
}

// Obtenir toutes les ventes
function getAllSales() {
    return localSales;
}

// Obtenir une vente par ID
function getSaleById(id) {
    return localSales.find(s => s.id === id);
}

// Créer une nouvelle vente
function createSale(saleData) {
    // Générer un ID unique
    const newId = (localSales.length + 1).toString();
    
    // Créer la nouvelle vente
    const newSale = {
        id: newId,
        ...saleData,
        date: new Date().toISOString().split('T')[0] // Date actuelle au format YYYY-MM-DD
    };
    
    // Ajouter à la liste des ventes
    localSales.push(newSale);
    
    // Sauvegarder dans le localStorage
    saveSales();
    
    console.log(`Vente créée: ${newId}`);
    return newSale;
}

// Mettre à jour une vente
function updateSale(saleId, updates) {
    const saleIndex = localSales.findIndex(s => s.id === saleId);
    if (saleIndex !== -1) {
        // Mettre à jour la vente
        localSales[saleIndex] = { ...localSales[saleIndex], ...updates };
        
        // Sauvegarder dans le localStorage
        saveSales();
        
        console.log(`Vente mise à jour: ${saleId}`);
        return localSales[saleIndex];
    }
    throw new Error('Vente non trouvée');
}

// Supprimer une vente
function deleteSale(saleId) {
    const saleIndex = localSales.findIndex(s => s.id === saleId);
    if (saleIndex !== -1) {
        // Supprimer la vente
        const deletedSale = localSales.splice(saleIndex, 1)[0];
        
        // Sauvegarder dans le localStorage
        saveSales();
        
        console.log(`Vente supprimée: ${deletedSale.id}`);
        return deletedSale;
    }
    throw new Error('Vente non trouvée');
}

// Ajouter un produit à la vente en cours
function addProductToCurrentSale(productId, quantity) {
    // Obtenir le produit
    const product = window.produit.getProductById(productId);
    if (!product) {
        throw new Error('Produit non trouvé');
    }
    
    // Vérifier que la quantité est disponible
    if (quantity > product.quantity) {
        throw new Error('Quantité insuffisante en stock');
    }
    
    // Vérifier si le produit est déjà dans la vente
    const existingItemIndex = currentSale.items.findIndex(item => item.productId === productId);
    
    if (existingItemIndex !== -1) {
        // Mettre à jour la quantité
        currentSale.items[existingItemIndex].quantity += quantity;
    } else {
        // Ajouter un nouvel item
        currentSale.items.push({
            productId: product.id,
            productName: product.name,
            quantity: quantity,
            price: product.price
        });
    }
    
    // Mettre à jour le total
    updateCurrentSaleTotal();
    
    console.log(`Produit ajouté à la vente: ${product.name} (quantité: ${quantity})`);
    return currentSale;
}

// Supprimer un produit de la vente en cours
function removeProductFromCurrentSale(productId) {
    // Trouver l'index de l'item
    const itemIndex = currentSale.items.findIndex(item => item.productId === productId);
    
    if (itemIndex !== -1) {
        // Supprimer l'item
        currentSale.items.splice(itemIndex, 1);
        
        // Mettre à jour le total
        updateCurrentSaleTotal();
        
        console.log(`Produit supprimé de la vente: ${productId}`);
        return currentSale;
    }
    throw new Error('Produit non trouvé dans la vente');
}

// Mettre à jour la quantité d'un produit dans la vente en cours
function updateProductQuantityInCurrentSale(productId, newQuantity) {
    // Trouver l'index de l'item
    const itemIndex = currentSale.items.findIndex(item => item.productId === productId);
    
    if (itemIndex !== -1) {
        // Obtenir le produit
        const product = window.produit.getProductById(productId);
        if (!product) {
            throw new Error('Produit non trouvé');
        }
        
        // Vérifier que la quantité est disponible
        if (newQuantity > product.quantity) {
            throw new Error('Quantité insuffisante en stock');
        }
        
        // Mettre à jour la quantité
        currentSale.items[itemIndex].quantity = newQuantity;
        
        // Mettre à jour le total
        updateCurrentSaleTotal();
        
        console.log(`Quantité mise à jour pour le produit ${productId}: ${newQuantity}`);
        return currentSale;
    }
    throw new Error('Produit non trouvé dans la vente');
}

// Mettre à jour le total de la vente en cours
function updateCurrentSaleTotal() {
    currentSale.total = currentSale.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
}

// Finaliser la vente en cours
function finalizeCurrentSale() {
    // Vérifier qu'il y a des items dans la vente
    if (currentSale.items.length === 0) {
        throw new Error('La vente est vide');
    }
    
    // Vérifier que les informations du client sont fournies
    if (!currentSale.customerName) {
        throw new Error('Le nom du client est requis');
    }
    
    // Créer la vente
    const sale = createSale({
        customerId: currentSale.customerId || 'client-' + Date.now(),
        customerName: currentSale.customerName,
        items: [...currentSale.items],
        total: currentSale.total,
        status: 'completed'
    });
    
    // Mettre à jour les quantités des produits
    currentSale.items.forEach(item => {
        const product = window.produit.getProductById(item.productId);
        if (product) {
            window.produit.updateProductQuantity(item.productId, product.quantity - item.quantity);
        }
    });
    
    // Réinitialiser la vente en cours
    resetCurrentSale();
    
    console.log('Vente finalisée');
    return sale;
}

// Annuler la vente en cours
function cancelCurrentSale() {
    resetCurrentSale();
    console.log('Vente annulée');
}

// Réinitialiser la vente en cours
function resetCurrentSale() {
    currentSale = {
        customerId: '',
        customerName: '',
        items: [],
        total: 0
    };
}

// Obtenir la vente en cours
function getCurrentSale() {
    return currentSale;
}

// Rechercher des ventes
function searchSales(query) {
    const lowerQuery = query.toLowerCase();
    return localSales.filter(s => 
        s.customerName.toLowerCase().includes(lowerQuery) ||
        s.items.some(item => item.productName.toLowerCase().includes(lowerQuery)) ||
        s.id.includes(query)
    );
}

// Filtrer les ventes par date
function filterSalesByDate(startDate, endDate) {
    return localSales.filter(s => {
        const saleDate = new Date(s.date);
        return saleDate >= new Date(startDate) && saleDate <= new Date(endDate);
    });
}

// Obtenir le total des ventes sur une période
function getTotalSalesForPeriod(startDate, endDate) {
    const sales = filterSalesByDate(startDate, endDate);
    return sales.reduce((total, sale) => total + sale.total, 0);
}

// Obtenir les ventes par statut
function getSalesByStatus(status) {
    return localSales.filter(s => s.status === status);
}

// Mettre à jour le statut d'une vente
function updateSaleStatus(saleId, newStatus) {
    const sale = getSaleById(saleId);
    if (sale) {
        sale.status = newStatus;
        
        // Sauvegarder dans le localStorage
        saveSales();
        
        console.log(`Statut de la vente ${saleId} mis à jour: ${newStatus}`);
        return sale;
    }
    throw new Error('Vente non trouvée');
}

// Sauvegarder les ventes dans le localStorage
function saveSales() {
    localStorage.setItem('sales', JSON.stringify(localSales));
}

// Synchroniser les ventes avec le backend (mode centralisé)
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
        // Récupérer les ventes depuis le backend
        const response = await fetch('http://localhost:4000/api/sales', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erreur lors de la récupération des ventes');
        }
        
        const backendSales = await response.json();
        
        // Mettre à jour les ventes locales
        localSales = backendSales;
        
        // Sauvegarder dans le localStorage
        saveSales();
        
        console.log('Ventes synchronisées avec le backend');
    } catch (error) {
        console.error('Erreur lors de la synchronisation avec le backend:', error);
        throw error;
    }
}

// Initialiser la gestion des ventes
initSales();

// Exporter les fonctions pour une utilisation dans d'autres fichiers
window.vente = {
    getAllSales,
    getSaleById,
    createSale,
    updateSale,
    deleteSale,
    addProductToCurrentSale,
    removeProductFromCurrentSale,
    updateProductQuantityInCurrentSale,
    updateCurrentSaleTotal,
    finalizeCurrentSale,
    cancelCurrentSale,
    resetCurrentSale,
    getCurrentSale,
    searchSales,
    filterSalesByDate,
    getTotalSalesForPeriod,
    getSalesByStatus,
    updateSaleStatus,
    syncWithBackend
};
