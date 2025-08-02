// Gestion des ventes

document.addEventListener('DOMContentLoaded', function() {
    // Remplir la liste déroulante des produits
    if (document.getElementById('productSelect')) {
        populateProductSelect();
    }
    
    // Bouton d'ajout de produit à la vente
    const addProductToSaleBtn = document.getElementById('addProductToSaleBtn');
    if (addProductToSaleBtn) {
        addProductToSaleBtn.addEventListener('click', addProductToSale);
    }
    
    // Bouton de finalisation de la vente
    const finalizeSaleBtn = document.getElementById('finalizeSaleBtn');
    if (finalizeSaleBtn) {
        finalizeSaleBtn.addEventListener('click', finalizeSale);
    }
    
    // Bouton d'annulation de la vente
    const cancelSaleBtn = document.getElementById('cancelSaleBtn');
    if (cancelSaleBtn) {
        cancelSaleBtn.addEventListener('click', cancelSale);
    }
    
    // Recherche de produit
    const productSearch = document.getElementById('productSearch');
    if (productSearch) {
        productSearch.addEventListener('input', filterProducts);
    }
    
    // Bouton "Enregistrer une vente"
    const sellProductBtn = document.getElementById('sellProductBtn');
    if (sellProductBtn) {
        sellProductBtn.addEventListener('click', function() {
            window.location.href = 'vente.html';
        });
    }
});

// Fonction pour remplir la liste déroulante des produits
function populateProductSelect() {
    const products = getProducts();
    const productSelect = document.getElementById('productSelect');
    
    // Vider la liste déroulante
    productSelect.innerHTML = '<option value="">Sélectionnez un produit</option>';
    
    // Ajouter chaque produit à la liste déroulante
    products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.id;
        option.textContent = `${product.name} (${product.quantity} en stock)`;
        productSelect.appendChild(option);
    });
}

// Fonction pour filtrer les produits selon la recherche
function filterProducts() {
    const searchTerm = document.getElementById('productSearch').value.toLowerCase();
    const productSelect = document.getElementById('productSelect');
    const options = productSelect.querySelectorAll('option');
    
    options.forEach(option => {
        if (option.value === '') return;
        
        const text = option.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            option.style.display = '';
        } else {
            option.style.display = 'none';
        }
    });
}

// Fonction pour ajouter un produit à la vente
function addProductToSale() {
    const productSelect = document.getElementById('productSelect');
    const selectedProductId = productSelect.value;
    const quantity = parseInt(document.getElementById('selectedQuantity').value);
    
    if (!selectedProductId) {
        alert('Veuillez sélectionner un produit');
        return;
    }
    
    if (isNaN(quantity) || quantity <= 0) {
        alert('Veuillez entrer une quantité valide');
        return;
    }
    
    // Obtenir les produits
    const products = getProducts();
    const product = products.find(p => p.id === selectedProductId);
    
    if (!product) {
        alert('Produit non trouvé');
        return;
    }
    
    if (quantity > product.quantity) {
        alert('Quantité insuffisante en stock');
        return;
    }
    
    // Créer un objet pour la vente
    const saleItem = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        productId: product.id,
        productName: product.name,
        quantity: quantity,
        unitPrice: product.sellingPrice,
        totalPrice: quantity * product.sellingPrice
    };
    
    // Obtenir les articles de la vente existants
    let saleItems = JSON.parse(sessionStorage.getItem('saleItems') || '[]');
    
    // Ajouter le nouvel article
    saleItems.push(saleItem);
    
    // Sauvegarder les articles de la vente
    sessionStorage.setItem('saleItems', JSON.stringify(saleItems));
    
    // Mettre à jour l'affichage
    displaySaleItems();
    
    // Réinitialiser le formulaire
    productSelect.value = '';
    document.getElementById('selectedQuantity').value = '1';
    document.getElementById('productSearch').value = '';
    populateProductSelect();
}

// Fonction pour afficher les articles de la vente
function displaySaleItems() {
    const saleItems = JSON.parse(sessionStorage.getItem('saleItems') || '[]');
    const tableBody = document.querySelector('#saleItemsTable tbody');
    
    // Vider le tableau
    tableBody.innerHTML = '';
    
    // Ajouter chaque article au tableau
    let totalAmount = 0;
    saleItems.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.productName}</td>
            <td>${item.quantity}</td>
            <td>${item.unitPrice} FCFA</td>
            <td>${item.totalPrice} FCFA</td>
            <td>
                <button class="remove-item-btn" data-id="${item.id}">Supprimer</button>
            </td>
        `;
        tableBody.appendChild(row);
        totalAmount += item.totalPrice;
    });
    
    // Afficher le montant total
    document.getElementById('totalAmount').textContent = `${totalAmount} FCFA`;
    
    // Ajouter les événements aux boutons de suppression
    document.querySelectorAll('.remove-item-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = this.getAttribute('data-id');
            removeItemFromSale(itemId);
        });
    });
}

// Fonction pour supprimer un article de la vente
function removeItemFromSale(itemId) {
    let saleItems = JSON.parse(sessionStorage.getItem('saleItems') || '[]');
    saleItems = saleItems.filter(item => item.id !== itemId);
    sessionStorage.setItem('saleItems', JSON.stringify(saleItems));
    displaySaleItems();
}

// Fonction pour finaliser la vente
function finalizeSale() {
    const customerName = document.getElementById('customerName').value;
    const customerPhone = document.getElementById('customerPhone').value;
    const customerAddress = document.getElementById('customerAddress').value;
    
    if (!customerName) {
        alert('Veuillez entrer le nom du client');
        return;
    }
    
    const saleItems = JSON.parse(sessionStorage.getItem('saleItems') || '[]');
    if (saleItems.length === 0) {
        alert('Veuillez ajouter au moins un produit à la vente');
        return;
    }
    
    // Calculer le montant total
    const totalAmount = saleItems.reduce((total, item) => total + item.totalPrice, 0);
    
    // Créer une facture
    const invoice = {
        id: Date.now().toString(),
        customerName,
        customerPhone,
        customerAddress,
        items: saleItems,
        totalAmount,
        date: new Date().toLocaleDateString('fr-FR')
    };
    
    // Sauvegarder la facture
    saveInvoice(invoice);
    
    // Mettre à jour le stock
    updateStock(saleItems);
    
    // Vider la session de vente
    sessionStorage.removeItem('saleItems');
    
    // Rediriger vers la page de facture
    sessionStorage.setItem('currentInvoice', JSON.stringify(invoice));
    window.location.href = 'facture.html';
}

// Fonction pour sauvegarder une facture
function saveInvoice(invoice) {
    const mode = localStorage.getItem('selectedMode') || 'local';
    const boutiqueId = localStorage.getItem('boutiqueId');
    
    if (mode === 'local') {
        // Pour le mode local, utiliser localStorage
        const key = `invoices_${boutiqueId}`;
        const invoices = JSON.parse(localStorage.getItem(key) || '[]');
        invoices.push(invoice);
        localStorage.setItem(key, JSON.stringify(invoices));
    } else {
        // Pour le mode centralisé, cela serait envoyé à un serveur
        // Dans cette implémentation, nous simulons avec localStorage
        const key = `invoices_central`;
        const invoices = JSON.parse(localStorage.getItem(key) || '[]');
        invoices.push(invoice);
        localStorage.setItem(key, JSON.stringify(invoices));
    }
}

// Fonction pour mettre à jour le stock
function updateStock(saleItems) {
    // Obtenir les produits
    let products = getProducts();
    
    // Mettre à jour la quantité de chaque produit vendu
    saleItems.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
            const oldQuantity = product.quantity;
            product.quantity -= item.quantity;
            const newQuantity = product.quantity;
            
            // Enregistrer le mouvement de stock
            recordStockMovement(item.productId, 'exit', item.quantity, oldQuantity, newQuantity);
        }
    });
    
    // Sauvegarder les produits mis à jour
    saveProducts(products);
}

// Fonction pour enregistrer un mouvement de stock (copiée de stock_movements.js)
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

// Fonction pour obtenir les mouvements de stock (copiée de stock_movements.js)
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

// Fonction pour sauvegarder les mouvements de stock (copiée de stock_movements.js)
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

// Fonction pour annuler la vente
function cancelSale() {
    if (confirm('Êtes-vous sûr de vouloir annuler cette vente ?')) {
        sessionStorage.removeItem('saleItems');
        window.location.href = 'dashboard.html';
    }
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

// Fonction pour sauvegarder les produits (copiée de produit.js)
function saveProducts(products) {
    const mode = localStorage.getItem('selectedMode') || 'local';
    const boutiqueId = localStorage.getItem('boutiqueId');
    
    if (mode === 'local') {
        // Pour le mode local, utiliser localStorage
        const key = `products_${boutiqueId}`;
        localStorage.setItem(key, JSON.stringify(products));
    } else {
        // Pour le mode centralisé, cela serait envoyé à un serveur
        // Dans cette implémentation, nous simulons avec localStorage
        const key = `products_central`;
        localStorage.setItem(key, JSON.stringify(products));
    }
}

// Afficher les articles de la vente lors du chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('#saleItemsTable')) {
        displaySaleItems();
    }
});
