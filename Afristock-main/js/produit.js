// Gestion des produits

// Données des produits (simulation de base de données locale)
let localProducts = [
    { 
        id: '1', 
        name: 'Produit 1', 
        description: 'Description du produit 1',
        price: 1000,
        quantity: 50,
        category: 'Catégorie A'
    },
    { 
        id: '2', 
        name: 'Produit 2', 
        description: 'Description du produit 2',
        price: 2000,
        quantity: 30,
        category: 'Catégorie B'
    }
];

// Initialiser la gestion des produits
function initProducts() {
    // Charger les produits depuis le localStorage
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
        localProducts = JSON.parse(savedProducts);
    }
    
    console.log('Gestion des produits initialisée');
}

// Obtenir tous les produits
function getAllProducts() {
    return localProducts;
}

// Obtenir un produit par ID
function getProductById(id) {
    return localProducts.find(p => p.id === id);
}

// Créer un nouveau produit
function createProduct(productData) {
    // Générer un ID unique
    const newId = (localProducts.length + 1).toString();
    
    // Créer le nouveau produit
    const newProduct = {
        id: newId,
        ...productData
    };
    
    // Ajouter à la liste des produits
    localProducts.push(newProduct);
    
    // Sauvegarder dans le localStorage
    saveProducts();
    
    console.log(`Produit créé: ${newProduct.name}`);
    return newProduct;
}

// Mettre à jour un produit
function updateProduct(productId, updates) {
    const productIndex = localProducts.findIndex(p => p.id === productId);
    if (productIndex !== -1) {
        // Mettre à jour le produit
        localProducts[productIndex] = { ...localProducts[productIndex], ...updates };
        
        // Sauvegarder dans le localStorage
        saveProducts();
        
        console.log(`Produit mis à jour: ${productId}`);
        return localProducts[productIndex];
    }
    throw new Error('Produit non trouvé');
}

// Supprimer un produit
function deleteProduct(productId) {
    const productIndex = localProducts.findIndex(p => p.id === productId);
    if (productIndex !== -1) {
        // Supprimer le produit
        const deletedProduct = localProducts.splice(productIndex, 1)[0];
        
        // Sauvegarder dans le localStorage
        saveProducts();
        
        console.log(`Produit supprimé: ${deletedProduct.name}`);
        return deletedProduct;
    }
    throw new Error('Produit non trouvé');
}

// Rechercher des produits
function searchProducts(query) {
    const lowerQuery = query.toLowerCase();
    return localProducts.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery)
    );
}

// Filtrer les produits par catégorie
function filterProductsByCategory(category) {
    return localProducts.filter(p => p.category === category);
}

// Trier les produits
function sortProducts(sortBy, ascending = true) {
    const sortedProducts = [...localProducts];
    
    sortedProducts.sort((a, b) => {
        if (a[sortBy] < b[sortBy]) {
            return ascending ? -1 : 1;
        }
        if (a[sortBy] > b[sortBy]) {
            return ascending ? 1 : -1;
        }
        return 0;
    });
    
    return sortedProducts;
}

// Obtenir les catégories uniques
function getUniqueCategories() {
    const categories = localProducts.map(p => p.category);
    return [...new Set(categories)];
}

// Mettre à jour la quantité d'un produit
function updateProductQuantity(productId, newQuantity) {
    const product = getProductById(productId);
    if (product) {
        product.quantity = newQuantity;
        
        // Sauvegarder dans le localStorage
        saveProducts();
        
        console.log(`Quantité mise à jour pour le produit ${productId}: ${newQuantity}`);
        return product;
    }
    throw new Error('Produit non trouvé');
}

// Vérifier si un produit est en stock
function isProductInStock(productId) {
    const product = getProductById(productId);
    return product && product.quantity > 0;
}

// Obtenir les produits en rupture de stock
function getOutOfStockProducts() {
    return localProducts.filter(p => p.quantity === 0);
}

// Obtenir les produits à faible stock
function getLowStockProducts(threshold = 10) {
    return localProducts.filter(p => p.quantity > 0 && p.quantity <= threshold);
}

// Sauvegarder les produits dans le localStorage
function saveProducts() {
    localStorage.setItem('products', JSON.stringify(localProducts));
}

// Synchroniser les produits avec le backend (mode centralisé)
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
        // Récupérer les produits depuis le backend
        const response = await fetch('http://localhost:4000/api/products', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erreur lors de la récupération des produits');
        }
        
        const backendProducts = await response.json();
        
        // Mettre à jour les produits locaux
        localProducts = backendProducts;
        
        // Sauvegarder dans le localStorage
        saveProducts();
        
        console.log('Produits synchronisés avec le backend');
    } catch (error) {
        console.error('Erreur lors de la synchronisation avec le backend:', error);
        throw error;
    }
}

// Initialiser la gestion des produits
initProducts();

// Exporter les fonctions pour une utilisation dans d'autres fichiers
window.produit = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    filterProductsByCategory,
    sortProducts,
    getUniqueCategories,
    updateProductQuantity,
    isProductInStock,
    getOutOfStockProducts,
    getLowStockProducts,
    syncWithBackend
};
