// Gestion de l'import et de l'export de données

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
    
    // Bouton d'import
    const importBtn = document.getElementById('importBtn');
    if (importBtn) {
        importBtn.addEventListener('click', importData);
    }
    
    // Bouton d'export
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportData);
    }
});

// Fonction pour importer des données
function importData() {
    const fileInput = document.getElementById('importFile');
    const importResult = document.getElementById('importResult');
    
    if (!fileInput.files || !fileInput.files[0]) {
        importResult.innerHTML = '<p style="color: red;">Veuillez sélectionner un fichier CSV</p>';
        return;
    }
    
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const csv = e.target.result;
            const data = parseCSV(csv);
            const importedCount = importProducts(data);
            
            importResult.innerHTML = `<p style="color: green;">${importedCount} produits importés avec succès</p>`;
            fileInput.value = '';
        } catch (error) {
            importResult.innerHTML = `<p style="color: red;">Erreur lors de l'import: ${error.message}</p>`;
        }
    };
    
    reader.readAsText(file);
}

// Fonction pour parser un fichier CSV
function parseCSV(csv) {
    const lines = csv.split('\n');
    const headers = lines[0].split(',').map(header => header.trim());
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const values = line.split(',');
        const row = {};
        
        for (let j = 0; j < headers.length; j++) {
            row[headers[j]] = values[j] ? values[j].trim() : '';
        }
        
        data.push(row);
    }
    
    return data;
}

// Fonction pour importer des produits
function importProducts(productsData) {
    let importedCount = 0;
    
    // Obtenir les produits existants
    let existingProducts = getProducts();
    
    // Parcourir les produits à importer
    productsData.forEach(product => {
        // Vérifier si le produit existe déjà
        const existingProduct = existingProducts.find(p => p.name === product.name);
        
        if (existingProduct) {
            // Mettre à jour le produit existant
            existingProduct.brand = product.brand || existingProduct.brand;
            existingProduct.purchasePrice = parseFloat(product.purchasePrice) || existingProduct.purchasePrice;
            existingProduct.sellingPrice = parseFloat(product.sellingPrice) || existingProduct.sellingPrice;
            existingProduct.quantity = parseInt(product.quantity) || existingProduct.quantity;
            existingProduct.dimensions = product.dimensions || existingProduct.dimensions;
        } else {
            // Ajouter un nouveau produit
            const newProduct = {
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                name: product.name,
                brand: product.brand || '',
                purchasePrice: parseFloat(product.purchasePrice) || 0,
                sellingPrice: parseFloat(product.sellingPrice) || 0,
                quantity: parseInt(product.quantity) || 0,
                dimensions: product.dimensions || '',
                image: ''
            };
            existingProducts.push(newProduct);
        }
        
        importedCount++;
    });
    
    // Sauvegarder les produits
    saveProducts(existingProducts);
    
    return importedCount;
}

// Fonction pour exporter des données
function exportData() {
    const exportType = document.getElementById('exportType').value;
    const exportResult = document.getElementById('exportResult');
    
    try {
        let csvContent = '';
        let filename = '';
        
        switch (exportType) {
            case 'products':
                csvContent = exportProducts();
                filename = 'produits.csv';
                break;
            case 'sales':
                csvContent = exportSales();
                filename = 'ventes.csv';
                break;
            case 'inventory':
                csvContent = exportInventory();
                filename = 'stock.csv';
                break;
            default:
                throw new Error('Type d\'export non reconnu');
        }
        
        // Créer un lien de téléchargement
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        exportResult.innerHTML = `<p style="color: green;">Fichier ${filename} téléchargé avec succès</p>`;
    } catch (error) {
        exportResult.innerHTML = `<p style="color: red;">Erreur lors de l'export: ${error.message}</p>`;
    }
}

// Fonction pour exporter les produits
function exportProducts() {
    const products = getProducts();
    
    // Créer les en-têtes
    let csv = 'name,brand,purchasePrice,sellingPrice,quantity,dimensions\n';
    
    // Ajouter les données
    products.forEach(product => {
        csv += `"${product.name}","${product.brand}",${product.purchasePrice},${product.sellingPrice},${product.quantity},"${product.dimensions}"\n`;
    });
    
    return csv;
}

// Fonction pour exporter les ventes
function exportSales() {
    const invoices = getInvoices();
    
    // Créer les en-têtes
    let csv = 'date,customerName,totalAmount,items\n';
    
    // Ajouter les données
    invoices.forEach(invoice => {
        const items = invoice.items.map(item => 
            `${item.productName}(${item.quantity})`
        ).join(';');
        
        csv += `"${invoice.date}","${invoice.customerName}",${invoice.totalAmount},"${items}"\n`;
    });
    
    return csv;
}

// Fonction pour exporter le stock
function exportInventory() {
    const products = getProducts();
    
    // Créer les en-têtes
    let csv = 'name,brand,quantity,purchasePrice,totalValue\n';
    
    // Ajouter les données
    products.forEach(product => {
        const totalValue = product.purchasePrice * product.quantity;
        csv += `"${product.name}","${product.brand}",${product.quantity},${product.purchasePrice},${totalValue}\n`;
    });
    
    return csv;
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

// Fonction pour obtenir les factures (copiée de facture.js)
function getInvoices() {
    const mode = localStorage.getItem('selectedMode') || 'local';
    const boutiqueId = localStorage.getItem('boutiqueId');
    
    if (mode === 'local') {
        // Pour le mode local, utiliser localStorage
        const key = `invoices_${boutiqueId}`;
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } else {
        // Pour le mode centralisé, cela viendrait d'un serveur
        // Dans cette implémentation, nous simulons avec localStorage
        const key = `invoices_central`;
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    }
}
