// Gestion des produits

document.addEventListener('DOMContentLoaded', function() {
    // Afficher la liste des produits dans le tableau de bord
    if (document.getElementById('productsTable')) {
        displayProducts();
        updateStats();
    }
    
    // Gestion du formulaire d'ajout/édition de produit
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveProduct();
        });
        
        // Gestion de l'aperçu de l'image
        const imageInput = document.getElementById('productImage');
        if (imageInput) {
            imageInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const imagePreview = document.getElementById('imagePreview');
                        imagePreview.src = e.target.result;
                        imagePreview.style.display = 'block';
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    }
    
    // Bouton d'ajout de produit
    const addProductBtn = document.getElementById('addProductBtn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', function() {
            window.location.href = 'add_product.html';
        });
    }
    
    // Bouton "Voir les rapports"
    const viewReportsBtn = document.getElementById('viewReportsBtn');
    if (viewReportsBtn) {
        viewReportsBtn.addEventListener('click', function() {
            window.location.href = 'reports.html';
        });
    }
    
    // Bouton "Vente" (Enregistrer une vente)
    const sellProductBtn = document.getElementById('sellProductBtn');
    if (sellProductBtn) {
        sellProductBtn.addEventListener('click', function() {
            window.location.href = 'vente.html';
        });
    }
    
    // Bouton "Import/Export"
    const importExportBtn = document.getElementById('importExportBtn');
    if (importExportBtn) {
        importExportBtn.addEventListener('click', function() {
            window.location.href = 'import_export.html';
        });
    }
    
    // Bouton "Mouvements de stock"
    const viewStockMovementsBtn = document.getElementById('viewStockMovementsBtn');
    if (viewStockMovementsBtn) {
        viewStockMovementsBtn.addEventListener('click', function() {
            window.location.href = 'stock_movements.html';
        });
    }
    
    // Boutons d'annulation
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            window.location.href = 'dashboard.html';
        });
    }
});

// Fonction pour afficher les produits
function displayProducts() {
    const products = getProducts();
    const tableBody = document.querySelector('#productsTable tbody');
    
    // Vider le tableau
    tableBody.innerHTML = '';
    
    // Ajouter chaque produit au tableau
    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.brand || '-'}</td>
            <td>${product.purchasePrice} FCFA</td>
            <td>${product.sellingPrice} FCFA</td>
            <td>${product.quantity}</td>
            <td>
                <button class="edit-btn" data-id="${product.id}">Modifier</button>
                <button class="delete-btn" data-id="${product.id}">Supprimer</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // Ajouter les événements aux boutons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            editProduct(productId);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            deleteProduct(productId);
        });
    });
}

// Fonction pour obtenir les produits
function getProducts() {
    return getDataForMode('products');
}

// Fonction pour sauvegarder les produits
function saveProducts(products) {
    saveDataForMode('products', products);
}

// Fonction pour sauvegarder un produit
function saveProduct() {
    const productId = document.getElementById('productId').value;
    const name = document.getElementById('productName').value;
    const brand = document.getElementById('brand').value;
    const purchasePrice = parseFloat(document.getElementById('purchasePrice').value);
    const sellingPrice = parseFloat(document.getElementById('sellingPrice').value);
    const quantity = parseInt(document.getElementById('quantity').value);
    const dimensions = document.getElementById('dimensions').value;
    const imagePreview = document.getElementById('imagePreview').src;
    
    // Vérifier que les champs obligatoires sont remplis
    if (!name || isNaN(purchasePrice) || isNaN(sellingPrice) || isNaN(quantity)) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
    }
    
    // Obtenir les produits existants
    let products = getProducts();
    
    if (productId) {
        // Modifier un produit existant
        const index = products.findIndex(p => p.id === productId);
        if (index !== -1) {
            // Enregistrer le mouvement de stock si la quantité change
            const oldQuantity = products[index].quantity;
            if (oldQuantity !== quantity) {
                const stockBefore = oldQuantity;
                const stockAfter = quantity;
                const quantityDiff = quantity - oldQuantity;
                const movementType = quantityDiff > 0 ? 'entry' : 'exit';
                
                // Enregistrer le mouvement de stock
                window.recordStockMovement(productId, movementType, Math.abs(quantityDiff), stockBefore, stockAfter);
            }
            
            products[index] = {
                ...products[index],
                name,
                brand,
                purchasePrice,
                sellingPrice,
                quantity,
                dimensions,
                image: imagePreview && !imagePreview.includes('data:,') ? imagePreview : products[index].image
            };
        }
    } else {
        // Ajouter un nouveau produit
        const newProduct = {
            id: Date.now().toString(),
            name,
            brand,
            purchasePrice,
            sellingPrice,
            quantity,
            dimensions,
            image: imagePreview && !imagePreview.includes('data:,') ? imagePreview : ''
        };
        products.push(newProduct);
        
        // Enregistrer le mouvement de stock pour l'ajout initial
        window.recordStockMovement(newProduct.id, 'entry', quantity, 0, quantity);
    }
    
    // Sauvegarder les produits
    saveProducts(products);
    
    // Rediriger vers le tableau de bord
    window.location.href = 'dashboard.html';
}

// Fonction pour modifier un produit
function editProduct(productId) {
    const products = getProducts();
    const product = products.find(p => p.id === productId);
    
    if (product) {
        // Remplir le formulaire avec les données du produit
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('brand').value = product.brand || '';
        document.getElementById('purchasePrice').value = product.purchasePrice;
        document.getElementById('sellingPrice').value = product.sellingPrice;
        document.getElementById('quantity').value = product.quantity;
        document.getElementById('dimensions').value = product.dimensions || '';
        
        // Afficher l'image si elle existe
        if (product.image) {
            const imagePreview = document.getElementById('imagePreview');
            imagePreview.src = product.image;
            imagePreview.style.display = 'block';
        }
        
        // Changer le titre du formulaire
        document.querySelector('.product-form h1').textContent = 'Modifier un produit';
        
        // Changer le texte du bouton
        document.getElementById('saveProductBtn').textContent = 'Mettre à jour le produit';
    }
}

// Fonction pour supprimer un produit
function deleteProduct(productId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
        let products = getProducts();
        products = products.filter(p => p.id !== productId);
        saveProducts(products);
        displayProducts();
        updateStats();
    }
}

// Fonction pour mettre à jour les statistiques
function updateStats() {
    const products = getProducts();
    const totalProducts = products.length;
    const stockValue = products.reduce((total, product) => total + (product.purchasePrice * product.quantity), 0);
    const lowStockAlerts = products.filter(product => product.quantity < 5).length;
    
    document.getElementById('totalProducts').textContent = totalProducts;
    document.getElementById('stockValue').textContent = `${stockValue} FCFA`;
    document.getElementById('lowStockAlerts').textContent = lowStockAlerts;
}

// Fonction pour obtenir les données selon le mode (copiée de mode.js)
function getDataForMode(dataType) {
    const mode = localStorage.getItem('selectedMode') || 'local';
    const boutiqueId = localStorage.getItem('boutiqueId');
    
    if (mode === 'local') {
        // Pour le mode local, utiliser localStorage
        const key = `${dataType}_${boutiqueId}`;
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } else {
        // Pour le mode centralisé, cela viendrait d'un serveur
        // Dans cette implémentation, nous simulons avec localStorage
        const key = `${dataType}_central`;
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    }
}

// Fonction pour sauvegarder les données selon le mode (copiée de mode.js)
function saveDataForMode(dataType, data) {
    const mode = localStorage.getItem('selectedMode') || 'local';
    const boutiqueId = localStorage.getItem('boutiqueId');
    
    if (mode === 'local') {
        // Pour le mode local, utiliser localStorage
        const key = `${dataType}_${boutiqueId}`;
        localStorage.setItem(key, JSON.stringify(data));
    } else {
        // Pour le mode centralisé, cela serait envoyé à un serveur
        // Dans cette implémentation, nous simulons avec localStorage
        const key = `${dataType}_central`;
        localStorage.setItem(key, JSON.stringify(data));
    }
}
