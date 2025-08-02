// Gestion des rapports et des statistiques

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
    
    // Bouton de génération de rapport
    const generateReportBtn = document.getElementById('generateReportBtn');
    if (generateReportBtn) {
        generateReportBtn.addEventListener('click', generateReport);
    }
    
    // Définir les dates par défaut (dernier mois)
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    document.getElementById('startDate').value = lastMonth.toISOString().split('T')[0];
    document.getElementById('endDate').value = today.toISOString().split('T')[0];
});

// Fonction pour générer un rapport
function generateReport() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const reportType = document.getElementById('reportType').value;
    
    if (!startDate || !endDate) {
        alert('Veuillez sélectionner une période');
        return;
    }
    
    // Obtenir les données en fonction du type de rapport
    switch (reportType) {
        case 'sales':
            generateSalesReport(startDate, endDate);
            break;
        case 'inventory':
            generateInventoryReport();
            break;
        case 'products':
            generateProductsReport();
            break;
        default:
            alert('Type de rapport non reconnu');
    }
}

// Fonction pour générer un rapport de ventes
function generateSalesReport(startDate, endDate) {
    // Obtenir les factures
    const invoices = getInvoices();
    
    // Filtrer les factures par date
    const filteredInvoices = invoices.filter(invoice => {
        const invoiceDate = new Date(invoice.date);
        return invoiceDate >= new Date(startDate) && invoiceDate <= new Date(endDate);
    });
    
    // Calculer les statistiques
    let totalSales = 0;
    let numberOfSales = filteredInvoices.length;
    const productSales = {};
    
    // Parcourir les factures pour calculer les totaux
    filteredInvoices.forEach(invoice => {
        totalSales += invoice.totalAmount;
        
        // Compter les ventes par produit
        invoice.items.forEach(item => {
            if (productSales[item.productName]) {
                productSales[item.productName] += item.quantity;
            } else {
                productSales[item.productName] = item.quantity;
            }
        });
    });
    
    // Trouver les produits les plus vendus
    const topProducts = Object.entries(productSales)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([product, quantity]) => `${product} (${quantity})`)
        .join(', ');
    
    // Mettre à jour l'affichage
    document.getElementById('totalSales').textContent = `${totalSales} FCFA`;
    document.getElementById('numberOfSales').textContent = numberOfSales;
    document.getElementById('topProducts').textContent = topProducts || '-';
    
    // Afficher les détails dans le tableau
    const tableBody = document.querySelector('#reportTable tbody');
    tableBody.innerHTML = '';
    
    filteredInvoices.forEach(invoice => {
        invoice.items.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${invoice.date}</td>
                <td>${item.productName}</td>
                <td>${item.quantity}</td>
                <td>${item.unitPrice} FCFA</td>
                <td>${item.totalPrice} FCFA</td>
            `;
            tableBody.appendChild(row);
        });
    });
}

// Fonction pour générer un rapport de stock
function generateInventoryReport() {
    // Obtenir les produits
    const products = getProducts();
    
    // Calculer les statistiques
    let totalStockValue = 0;
    let lowStockProducts = 0;
    
    products.forEach(product => {
        totalStockValue += product.purchasePrice * product.quantity;
        if (product.quantity < 5) {
            lowStockProducts++;
        }
    });
    
    // Mettre à jour l'affichage
    document.getElementById('totalSales').textContent = `${totalStockValue} FCFA`;
    document.getElementById('numberOfSales').textContent = products.length;
    document.getElementById('topProducts').textContent = `${lowStockProducts} produit(s) en rupture`;
    
    // Afficher les détails dans le tableau
    const tableBody = document.querySelector('#reportTable tbody');
    tableBody.innerHTML = '';
    
    products.forEach(product => {
        const row = document.createElement('tr');
        const stockValue = product.purchasePrice * product.quantity;
        row.innerHTML = `
            <td>-</td>
            <td>${product.name}</td>
            <td>${product.quantity}</td>
            <td>${product.purchasePrice} FCFA</td>
            <td>${stockValue} FCFA</td>
        `;
        tableBody.appendChild(row);
    });
}

// Fonction pour générer un rapport de produits
function generateProductsReport() {
    // Obtenir les produits
    const products = getProducts();
    
    // Calculer les statistiques
    let totalProducts = products.length;
    let totalStockValue = 0;
    const brandCount = {};
    
    products.forEach(product => {
        totalStockValue += product.purchasePrice * product.quantity;
        
        // Compter les produits par marque
        if (brandCount[product.brand]) {
            brandCount[product.brand]++;
        } else {
            brandCount[product.brand] = 1;
        }
    });
    
    // Trouver les marques les plus représentées
    const topBrands = Object.entries(brandCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([brand, count]) => `${brand} (${count})`)
        .join(', ');
    
    // Mettre à jour l'affichage
    document.getElementById('totalSales').textContent = `${totalStockValue} FCFA`;
    document.getElementById('numberOfSales').textContent = totalProducts;
    document.getElementById('topProducts').textContent = topBrands || '-';
    
    // Afficher les détails dans le tableau
    const tableBody = document.querySelector('#reportTable tbody');
    tableBody.innerHTML = '';
    
    products.forEach(product => {
        const stockValue = product.purchasePrice * product.quantity;
        const profitMargin = ((product.sellingPrice - product.purchasePrice) / product.purchasePrice * 100).toFixed(2);
        row.innerHTML = `
            <td>-</td>
            <td>${product.name}</td>
            <td>${product.quantity}</td>
            <td>${product.purchasePrice} FCFA</td>
            <td>${stockValue} FCFA</td>
        `;
        tableBody.appendChild(row);
    });
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
